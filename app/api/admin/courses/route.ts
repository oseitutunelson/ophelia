import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const adminId = await requireAdminApi();
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') ?? '';
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
  const limit = 30;

  const where = q ? { OR: [{ title: { contains: q } }, { category: { contains: q } }] } : {};

  const [courses, total] = await Promise.all([
    db.course.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { instructor: { select: { userId: true } }, _count: { select: { enrollments: true } } },
    }),
    db.course.count({ where }),
  ]);

  return NextResponse.json({ courses, total });
}
