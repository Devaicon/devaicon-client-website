import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/server-session';
import { downloadAsXlsx } from '@/lib/sheets';

export const runtime = 'nodejs';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (user.role !== 'admin')
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  try {
    const { body, filename } = await downloadAsXlsx();
    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (e: any) {
    console.error('GET /api/admin/export failed:', e?.message ?? e);
    return NextResponse.json(
      { error: 'export_failed', detail: e?.message ?? String(e) },
      { status: 500 },
    );
  }
}
