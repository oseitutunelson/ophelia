import db from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

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

    const offset = searchParams.get('offset');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const userId = searchParams.get('userId');

    const titleContains = typeof search === 'string' ? search : undefined;
    const ownerUserId = typeof userId === 'string' ? userId : undefined;
    // accept any category string from the client so category filtering works for all categories
    const categoryContains = typeof category === 'string' ? category : undefined;

    const works = await db.work.findMany({
      skip: typeof offset === 'string' ? parseInt(offset) : 0,
      take: 12,
      where: {
        userId: ownerUserId,
        title: {
          contains: titleContains,
          mode: 'insensitive'
        },
        category: categoryContains
      },
      orderBy: {
        createdAt: 'desc'
      }
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
