import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

type Params = { params: { courseId: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const reviews = await db.courseReview.findMany({
      where: { courseId: params.courseId },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
    return NextResponse.json(reviews);
  } catch (err) {
    console.error('[REVIEWS_GET]', err);
    return NextResponse.json({ error: 'Failed.' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: Params) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: 'Unauthenticated.' }, { status: 401 });

    const enrollment = await db.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId: params.courseId } },
    });
    if (!enrollment) return NextResponse.json({ error: 'Must be enrolled to review.' }, { status: 403 });

    const { rating, comment } = await req.json() as { rating: number; comment?: string };
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be 1–5.' }, { status: 400 });
    }

    const review = await db.courseReview.upsert({
      where: { courseId_userId: { courseId: params.courseId, userId } },
      create: { courseId: params.courseId, userId, rating, comment },
      update: { rating, comment },
    });

    // Recalculate course rating
    const agg = await db.courseReview.aggregate({
      where: { courseId: params.courseId },
      _avg: { rating: true },
      _count: { rating: true },
    });
    await db.course.update({
      where: { id: params.courseId },
      data: {
        rating: agg._avg.rating ?? 0,
        ratingCount: agg._count.rating,
      },
    });

    return NextResponse.json(review);
  } catch (err) {
    console.error('[REVIEWS_POST]', err);
    return NextResponse.json({ error: 'Failed to submit review.' }, { status: 500 });
  }
}
