import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (userId) {
      const instructor = await db.instructor.findUnique({
        where: { userId },
        include: {
          courses: { where: { isPublished: true }, orderBy: { createdAt: 'desc' } },
        },
      });
      return NextResponse.json(instructor ?? null);
    }

    const { userId: authUserId } = auth();
    if (!authUserId) return NextResponse.json(null);

    const instructor = await db.instructor.findUnique({
      where: { userId: authUserId },
      include: { courses: { orderBy: { createdAt: 'desc' } } },
    });
    return NextResponse.json(instructor ?? null);
  } catch (err) {
    console.error('[INSTRUCTOR_GET]', err);
    return NextResponse.json(null);
  }
}
