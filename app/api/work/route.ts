import db from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    const body = await req.json();
    const { title, description, image, liveSiteUrl, githubUrl, category } =
      body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthenticated.' },
        { status: 401 }
      );
    }

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Image is required.' },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Title is required.' },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        { success: false, error: 'Description is required.' },
        { status: 400 }
      );
    }

    if (!githubUrl) {
      return NextResponse.json(
        { success: false, error: 'GitHub URL is required.' },
        { status: 400 }
      );
    }

    if (!liveSiteUrl) {
      return NextResponse.json(
        { success: false, error: 'Website URL is required.' },
        { status: 400 }
      );
    }

    const work = await db.work.create({
      data: {
        userId,
        image,
        title,
        description,
        githubUrl,
        liveSiteUrl,
        category
      }
    });

    // revalidate the home page and the category-specific URL so new uploads
    // appear immediately on the Discover page and on their category page.
    try {
      revalidatePath('/');
      if (typeof category === 'string' && category.trim() !== '') {
        // include category query so cached category page is refreshed too
        revalidatePath(`/?category=${encodeURIComponent(category)}`);
      }
    } catch (e) {
      // revalidation is best-effort in dev; log but don't fail the request
      console.warn('[WORK_POST] revalidatePath failed', e);
    }

    return NextResponse.json({ success: true, work });
  } catch (error) {
    let message;

    if (error instanceof Error) {
      message = error.message;
    } else {
      message = String(error);
    }

    console.log('[WORK_POST]', error);

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const offset   = searchParams.get('offset');
    const search   = searchParams.get('search');
    const category = searchParams.get('category');
    const userId   = searchParams.get('userId');
    const sort     = searchParams.get('sort'); // 'latest' | 'popular' | 'trending'

    const offsetNum      = typeof offset === 'string' ? parseInt(offset) : 0;
    const titleContains  = typeof search   === 'string' ? search   : undefined;
    const ownerUserId    = typeof userId   === 'string' ? userId   : undefined;
    const categoryFilter = typeof category === 'string' ? decodeURIComponent(category) : undefined;

    const where = {
      userId: ownerUserId,
      title: { contains: titleContains, mode: 'insensitive' as const },
      ...(categoryFilter && { category: { equals: categoryFilter, mode: 'insensitive' as const } }),
      ...(sort === 'trending' && {
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      })
    };

    if (sort === 'popular') {
      const worksWithCounts = await db.work.findMany({
        skip: offsetNum,
        take: 24,
        where,
        include: { _count: { select: { likes: true } } }
      });
      const sorted = worksWithCounts
        .sort((a, b) => b._count.likes - a._count.likes)
        .slice(0, 12);
      const works = sorted.map(({ _count: _c, ...w }) => w);
      return NextResponse.json(works);
    }

    const works = await db.work.findMany({
      skip: offsetNum,
      take: 12,
      where,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(works);
  } catch (error) {
    let message;

    if (error instanceof Error) {
      message = error.message;
    } else {
      message = String(error);
    }

    console.log('[WORK_GET]', error);

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
