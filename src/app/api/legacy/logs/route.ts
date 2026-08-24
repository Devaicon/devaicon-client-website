import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/server-session';
import {
  appendLog,
  deleteLogById,
  deleteLogsByIds,
  findLogById,
  readLogs,
  readProjects,
} from '@/lib/sheets';
import {
  CATEGORIES,
  PAGE_SIZE_DEFAULT,
  PAGE_SIZE_MAX,
  BULK_IDS_MAX,
  type TimeLog,
} from '@/lib/types';
import { isSameOrigin } from '@/lib/origin-check';
import {
  composeDescription,
  DESCRIPTION_MIN_LENGTH,
  DESCRIPTION_MAX_LENGTH,
} from '@/lib/description';

export const runtime = 'nodejs';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function num(v: string | null): number | null {
  if (v == null || v.trim() === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/**
 * Apply optional list filters:
 *   dateFrom/dateTo    inclusive YYYY-MM-DD range
 *   hoursMin/hoursMax  inclusive numeric range
 *   status             approved | pending  (flagged is latest-backend only)
 *   project/category   exact match
 */
function filterLogs(logs: TimeLog[], sp: URLSearchParams): TimeLog[] {
  const dateFrom = (sp.get('dateFrom') ?? '').trim();
  const dateTo = (sp.get('dateTo') ?? '').trim();
  const hoursMin = num(sp.get('hoursMin'));
  const hoursMax = num(sp.get('hoursMax'));
  const status = (sp.get('status') ?? '').trim().toLowerCase();
  const project = (sp.get('project') ?? '').trim();
  const category = (sp.get('category') ?? '').trim();

  return logs.filter((l) => {
    if (DATE_RE.test(dateFrom) && l.date < dateFrom) return false;
    if (DATE_RE.test(dateTo) && l.date > dateTo) return false;
    if (hoursMin != null && l.hours < hoursMin) return false;
    if (hoursMax != null && l.hours > hoursMax) return false;
    if (status === 'approved' && !l.approvedAt) return false;
    if (status === 'pending' && l.approvedAt) return false;
    // The Sheets backend has no flag data, so a flag filter matches nothing.
    if (status === 'flagged') return false;
    if (project && l.project !== project) return false;
    if (category && l.category !== category) return false;
    return true;
  });
}

function parsePagination(sp: URLSearchParams): { page: number; pageSize: number } {
  let page = parseInt(sp.get('page') ?? '', 10);
  let pageSize = parseInt(sp.get('pageSize') ?? '', 10);
  if (!Number.isFinite(page) || page < 1) page = 1;
  if (!Number.isFinite(pageSize) || pageSize < 1) pageSize = PAGE_SIZE_DEFAULT;
  if (pageSize > PAGE_SIZE_MAX) pageSize = PAGE_SIZE_MAX;
  return { page, pageSize };
}

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const sp = req.nextUrl.searchParams;
  const wantAll = sp.get('all') === '1';
  if (wantAll && user.role !== 'admin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  try {
    let logs = await readLogs(wantAll ? undefined : { username: user.username });

    // Admins viewing everything can still narrow to one user.
    if (wantAll) {
      const username = (sp.get('username') ?? '').trim().toLowerCase();
      if (username) logs = logs.filter((l) => l.username === username);
    }

    logs = filterLogs(logs, sp);
    // Newest first, matching the Express backend's ordering.
    logs.sort((a, b) => (a.loggedAt < b.loggedAt ? 1 : a.loggedAt > b.loggedAt ? -1 : 0));

    // Pagination is opt-in: without page/pageSize we return all matching logs,
    // since consumers like the dashboard need the full set for accurate totals.
    const total = logs.length;
    const paginate = sp.get('page') != null || sp.get('pageSize') != null;
    let page = 1;
    let pageSize = total;
    let pageLogs = logs;
    if (paginate) {
      ({ page, pageSize } = parsePagination(sp));
      const start = (page - 1) * pageSize;
      pageLogs = logs.slice(start, start + pageSize);
    }

    return NextResponse.json({
      logs: pageLogs,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: paginate ? Math.max(1, Math.ceil(total / pageSize)) : 1,
      },
    });
  } catch (e: any) {
    console.error('GET /api/logs failed:', e?.message ?? e);
    return NextResponse.json(
      { error: 'sheets_error', detail: e?.message ?? String(e) },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: 'forbidden_origin' }, { status: 403 });
  }

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const date = String(body.date ?? '').trim();
  const project = String(body.project ?? '').trim();
  const category = String(body.category ?? '').trim();
  const hours = Number(body.hours);
  // Free-text summary is required; structured fields are optional and composed
  // into the stored description (keeps the single-column model unchanged).
  const summary = String(body.description ?? '').trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: 'invalid_date', message: 'Date must be YYYY-MM-DD.' },
      { status: 400 },
    );
  }
  if (!project) {
    return NextResponse.json({ error: 'project_required' }, { status: 400 });
  }
  if (!CATEGORIES.includes(category as any)) {
    return NextResponse.json({ error: 'invalid_category' }, { status: 400 });
  }
  if (!Number.isFinite(hours) || hours <= 0 || hours > 24) {
    return NextResponse.json(
      { error: 'invalid_hours', message: 'Hours must be between 0 and 24.' },
      { status: 400 },
    );
  }
  if (summary.length < DESCRIPTION_MIN_LENGTH) {
    return NextResponse.json(
      {
        error: 'description_too_short',
        message: `Summary must be at least ${DESCRIPTION_MIN_LENGTH} characters.`,
      },
      { status: 400 },
    );
  }

  const description = composeDescription({
    summary,
    tools: body.tools,
    areas: body.areas,
    status: body.status,
    reference: body.reference,
  });
  if (description.length > DESCRIPTION_MAX_LENGTH) {
    return NextResponse.json(
      {
        error: 'description_too_long',
        message: `Description must be at most ${DESCRIPTION_MAX_LENGTH} characters.`,
      },
      { status: 400 },
    );
  }

  try {
    const projects = await readProjects();
    if (!projects.find((p) => p.name === project)) {
      return NextResponse.json(
        {
          error: 'unknown_project',
          message: 'Project not found. Ask admin to add it.',
        },
        { status: 400 },
      );
    }
  } catch (e: any) {
    console.error('Project check failed:', e?.message ?? e);
    return NextResponse.json(
      { error: 'sheets_error', detail: e?.message ?? String(e) },
      { status: 500 },
    );
  }

  try {
    const log = await appendLog({
      date,
      username: user.username,
      project,
      category,
      hours,
      description,
    });
    return NextResponse.json({ log }, { status: 201 });
  } catch (e: any) {
    console.error('POST /api/logs failed:', e?.message ?? e);
    return NextResponse.json(
      { error: 'sheets_error', detail: e?.message ?? String(e) },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: 'forbidden_origin' }, { status: 403 });
  }

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const idsParam = req.nextUrl.searchParams.get('ids');

  // Multi-select: delete several logs at once via ?ids=a,b,c
  if (idsParam) {
    const requested = Array.from(
      new Set(
        idsParam
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      ),
    );
    if (requested.length === 0) {
      return NextResponse.json({ error: 'id_required' }, { status: 400 });
    }
    if (requested.length > BULK_IDS_MAX) {
      return NextResponse.json({ error: 'too_many_ids' }, { status: 400 });
    }

    try {
      const all = await readLogs();
      const byId = new Map(all.map((l) => [l.id, l]));
      const allowed = requested.filter((id) => {
        const log = byId.get(id);
        if (!log) return false;
        // Devs can only delete their own un-approved logs; admins anything.
        if (user.role !== 'admin') {
          if (log.username !== user.username) return false;
          if (log.approvedAt) return false;
        }
        return true;
      });

      const deleted = allowed.length ? await deleteLogsByIds(allowed) : 0;
      return NextResponse.json({ ok: true, deleted, requested: requested.length });
    } catch (e: any) {
      console.error('DELETE /api/logs (bulk) failed:', e?.message ?? e);
      return NextResponse.json(
        { error: 'sheets_error', detail: e?.message ?? String(e) },
        { status: 500 },
      );
    }
  }

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id_required' }, { status: 400 });

  try {
    const log = await findLogById(id);
    if (!log) return NextResponse.json({ error: 'not_found' }, { status: 404 });

    // Devs can only delete their own entries, and only if not yet approved.
    // Admins can delete anything (override).
    if (user.role !== 'admin') {
      if (log.username !== user.username) {
        return NextResponse.json({ error: 'forbidden' }, { status: 403 });
      }
      if (log.approvedAt) {
        return NextResponse.json(
          {
            error: 'log_approved',
            message:
              'This entry has been approved by an admin and can no longer be edited. Ask an admin to unapprove it first.',
          },
          { status: 403 },
        );
      }
    }

    const ok = await deleteLogById(id);
    if (!ok) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('DELETE /api/logs failed:', e?.message ?? e);
    return NextResponse.json(
      { error: 'sheets_error', detail: e?.message ?? String(e) },
      { status: 500 },
    );
  }
}
