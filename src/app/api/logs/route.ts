import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/server-session';
import {
  appendLog,
  deleteLogById,
  findLogById,
  readLogs,
  readProjects,
} from '@/lib/sheets';
import { CATEGORIES } from '@/lib/types';
import { isSameOrigin } from '@/lib/origin-check';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const wantAll = req.nextUrl.searchParams.get('all') === '1';
  if (wantAll && user.role !== 'admin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  try {
    const logs = await readLogs(
      wantAll ? undefined : { username: user.username },
    );
    return NextResponse.json({ logs });
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
  const description = String(body.description ?? '').trim();

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
