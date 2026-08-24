import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/server-session';
import { setLogsApproval } from '@/lib/sheets';
import { isSameOrigin } from '@/lib/origin-check';

export const runtime = 'nodejs';

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

  const ids: string[] = Array.isArray(body?.ids)
    ? body.ids.filter((x: unknown) => typeof x === 'string')
    : [];
  const approved = body?.approved !== false; // default to true

  if (ids.length === 0) {
    return NextResponse.json({ error: 'no_ids' }, { status: 400 });
  }
  if (ids.length > 500) {
    return NextResponse.json({ error: 'too_many_ids' }, { status: 400 });
  }

  try {
    const updated = await setLogsApproval(ids, approved, user.username);
    return NextResponse.json({ updated });
  } catch (e: any) {
    console.error('POST /api/admin/approve failed:', e?.message ?? e);
    return NextResponse.json(
      { error: 'sheets_error', detail: e?.message ?? String(e) },
      { status: 500 },
    );
  }
}
