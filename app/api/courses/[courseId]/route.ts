import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

type Params = { params: { courseId: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const course = await db.course.findUnique({
      where: { id: params.courseId },
      include: {
        instructor: true,
        modules: {
          orderBy: { order: 'asc' },
          include: { lessons: { orderBy: { order: 'asc' } } },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        _count: { select: { enrollments: true, reviews: true } },
      },
    });

    if (!course) return NextResponse.json({ error: 'Course not found.' }, { status: 404 });
    return NextResponse.json(course);
  } catch (err) {
    console.error('[COURSE_GET]', err);
    return NextResponse.json({ error: 'Failed to fetch course.' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: 'Unauthenticated.' }, { status: 401 });

    const course = await db.course.findUnique({ where: { id: params.courseId }, include: { instructor: true } });
    if (!course) return NextResponse.json({ error: 'Course not found.' }, { status: 404 });
    if (course.instructor.userId !== userId) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });

    const body = await req.json();
    const updated = await db.course.update({ where: { id: params.courseId }, data: body });
    return NextResponse.json(updated);
  } catch (err) {
    console.error('[COURSE_PATCH]', err);
    return NextResponse.json({ error: 'Failed to update course.' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: 'Unauthenticated.' }, { status: 401 });

    const course = await db.course.findUnique({ where: { id: params.courseId }, include: { instructor: true } });
    if (!course) return NextResponse.json({ error: 'Course not found.' }, { status: 404 });
    if (course.instructor.userId !== userId) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });

    await db.course.delete({ where: { id: params.courseId } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[COURSE_DELETE]', err);
    return NextResponse.json({ error: 'Failed to delete course.' }, { status: 500 });
  }
}
