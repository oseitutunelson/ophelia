import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { generateCourseSlug } from '@/lib/learn-utils';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category  = searchParams.get('category') ?? undefined;
    const level     = searchParams.get('level') ?? undefined;
    const search    = searchParams.get('search') ?? undefined;
    const isFree    = searchParams.get('free');
    const sort      = searchParams.get('sort') ?? 'newest';
    const featured  = searchParams.get('featured');
    const page      = parseInt(searchParams.get('page') ?? '1');
    const limit     = parseInt(searchParams.get('limit') ?? '12');

    const where: Record<string, unknown> = { isPublished: true };
    if (category) where.category = category;
    if (level && level !== 'All Levels') where.level = level;
    if (isFree === 'true') where.isFree = true;
    if (featured === 'true') where.isFeatured = true;
    if (search) where.title = { contains: search, mode: 'insensitive' };

    const orderBy =
      sort === 'popular'   ? { enrollmentCount: 'desc' as const } :
      sort === 'rating'    ? { rating: 'desc' as const } :
      sort === 'price_asc' ? { price: 'asc' as const } :
                             { createdAt: 'desc' as const };

    const [courses, total] = await db.$transaction([
      db.course.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: { instructor: true },
      }),
      db.course.count({ where }),
    ]);

    return NextResponse.json({ courses, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('[COURSES_GET]', err);
    return NextResponse.json({ error: 'Failed to fetch courses.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: 'Unauthenticated.' }, { status: 401 });

    const instructor = await db.instructor.findUnique({ where: { userId } });
    if (!instructor) return NextResponse.json({ error: 'Not an approved instructor.' }, { status: 403 });

    const body = await req.json();
    const { title, description, shortDescription, category, level, price, requirements, objectives, tags } = body;

    if (!title || !description || !category) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const slug = generateCourseSlug(title);
    const course = await db.course.create({
      data: {
        slug,
        title,
        description,
        shortDescription: shortDescription ?? '',
        category,
        level: level ?? 'Beginner',
        price: parseFloat(price ?? '0'),
        isFree: parseFloat(price ?? '0') === 0,
        requirements: requirements ?? [],
        objectives: objectives ?? [],
        tags: tags ?? [],
        instructorId: instructor.id,
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (err) {
    console.error('[COURSES_POST]', err);
    return NextResponse.json({ error: 'Failed to create course.' }, { status: 500 });
  }
}
