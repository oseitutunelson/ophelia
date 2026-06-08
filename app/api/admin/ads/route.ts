import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const adminId = await requireAdminApi();
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
  const limit = 30;

  const where = status ? { status } : {};

  const [campaigns, total] = await Promise.all([
    db.adCampaign.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.adCampaign.count({ where }),
  ]);

  return NextResponse.json({ campaigns, total });
}
