import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/server-session';
import { appendProject, deleteProjectById, readProjects } from '@/lib/sheets';
import { isSameOrigin } from '@/lib/origin-check';

export const runtime = 'nodejs';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  try {
    const projects = await readProjects();
    return NextResponse.json({ projects });
  } catch (e: any) {
    console.error('GET /api/projects failed:', e?.message ?? e);
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
  if (user.role !== 'admin')
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const name = String(body.name ?? '').trim();
  if (!name) return NextResponse.json({ error: 'name_required' }, { status: 400 });
  if (name.length > 100)
    return NextResponse.json({ error: 'name_too_long' }, { status: 400 });

  try {
    const existing = await readProjects();
    if (existing.find((p) => p.name.toLowerCase() === name.toLowerCase())) {
      return NextResponse.json(
        { error: 'duplicate_project' },
        { status: 409 },
      );
    }
    const project = await appendProject(name, user.username);
    return NextResponse.json({ project }, { status: 201 });
  } catch (e: any) {
    console.error('POST /api/projects failed:', e?.message ?? e);
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
  if (user.role !== 'admin')
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id_required' }, { status: 400 });

  try {
    const ok = await deleteProjectById(id);
    if (!ok) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('DELETE /api/projects failed:', e?.message ?? e);
    return NextResponse.json(
      { error: 'sheets_error', detail: e?.message ?? String(e) },
      { status: 500 },
    );
  }
}
