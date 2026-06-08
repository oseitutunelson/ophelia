import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

type Params = { params: { courseId: string } };

export async function POST(_req: Request, { params }: Params) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: 'Unauthenticated.' }, { status: 401 });

    const existing = await db.courseBookmark.findUnique({
      where: { userId_courseId: { userId, courseId: params.courseId } },
    });

    if (existing) {
      await db.courseBookmark.delete({ where: { id: existing.id } });
      return NextResponse.json({ bookmarked: false });
    }

    await db.courseBookmark.create({ data: { userId, courseId: params.courseId } });
    return NextResponse.json({ bookmarked: true });
  } catch (err) {
    console.error('[COURSE_BOOKMARK]', err);
    return NextResponse.json({ error: 'Failed.' }, { status: 500 });
  }
}
