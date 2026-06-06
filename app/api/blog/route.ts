import db from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { generateSlug, calculateReadTime, generateExcerpt } from '@/lib/blog-utils';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: 'Unauthenticated.' }, { status: 401 });

    const body = await req.json();
    const { title, content, coverImage, category, tags, excerpt, metaDescription, status } = body;

    if (!title) return NextResponse.json({ error: 'Title is required.' }, { status: 400 });
    if (!content) return NextResponse.json({ error: 'Content is required.' }, { status: 400 });
    if (!category) return NextResponse.json({ error: 'Category is required.' }, { status: 400 });

    let baseSlug = generateSlug(title);
    let slug = baseSlug;
    let count = 1;
    while (await db.blogPost.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${count++}`;
    }

    const readTime = calculateReadTime(content);
    const generatedExcerpt = excerpt?.trim() || generateExcerpt(content);

    const post = await db.blogPost.create({
      data: {
        slug,
        title,
        content,
        coverImage: coverImage || null,
        category,
        tags: Array.isArray(tags) ? tags : [],
        authorId: userId,
        excerpt: generatedExcerpt,
        metaDescription: metaDescription || null,
        readTime,
        status: status || 'published',
      }
    });

    revalidatePath('/blog');
    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    console.error('[BLOG_POST]', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const offset = parseInt(sp.get('offset') || '0');
    const limit = parseInt(sp.get('limit') || '12');
    const category = sp.get('category');
    const search = sp.get('search');
    const sort = sp.get('sort') || 'latest';
    const authorId = sp.get('authorId');
    const featured = sp.get('featured');

    const where: Record<string, unknown> = {
      status: 'published',
      ...(category && category !== 'All' && { category }),
      ...(authorId && { authorId }),
      ...(featured === 'true' && { featured: true }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { excerpt: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(sort === 'trending' && {
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),
    };

    const [posts, total] = await db.$transaction([
      db.blogPost.findMany({
        skip: offset,
        take: limit,
        where,
        orderBy: sort === 'popular' ? { viewCount: 'desc' } : { createdAt: 'desc' },
        include: { _count: { select: { likes: true, comments: true, bookmarks: true } } },
      }),
      db.blogPost.count({ where }),
    ]);

    return NextResponse.json({ posts, total });
  } catch (error) {
    console.error('[BLOG_GET]', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
