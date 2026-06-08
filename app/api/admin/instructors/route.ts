import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const adminId = await requireAdminApi();
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') ?? 'pending';

  const apps = await db.instructorApplication.findMany({
    where: status === 'all' ? {} : { status },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ applications: apps });
}
