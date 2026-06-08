import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json([]);

    const enrollments = await db.enrollment.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: { course: { include: { instructor: true } } },
    });

    return NextResponse.json(enrollments);
  } catch (err) {
    console.error('[ENROLLMENTS_GET]', err);
    return NextResponse.json([]);
  }
}
