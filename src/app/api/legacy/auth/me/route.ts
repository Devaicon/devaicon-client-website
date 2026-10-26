import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/legacy/server-session';
import { toMe } from '@/lib/legacy/types';

export const runtime = 'nodejs';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  return NextResponse.json({ user: toMe(user) });
}
