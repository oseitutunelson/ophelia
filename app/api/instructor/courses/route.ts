import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: 'Unauthenticated.' }, { status: 401 });

    const instructor = await db.instructor.findUnique({ where: { userId } });
    if (!instructor) return NextResponse.json({ error: 'Not an instructor.' }, { status: 403 });

    const courses = await db.course.findMany({
      where: { instructorId: instructor.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { enrollments: true, reviews: true } },
      },
    });

    return NextResponse.json(courses);
  } catch (err) {
    console.error('[INSTRUCTOR_COURSES]', err);
    return NextResponse.json({ error: 'Failed.' }, { status: 500 });
  }
}
