import db from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { calculateReadTime, generateExcerpt } from '@/lib/blog-utils';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await db.blogPost.findUnique({
      where: { slug: params.slug },
      include: { _count: { select: { likes: true, comments: true, bookmarks: true } } },
    });

    if (!post) return NextResponse.json({ error: 'Not found.' }, { status: 404 });

    await db.blogPost.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('[BLOG_GET_SLUG]', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: 'Unauthenticated.' }, { status: 401 });

    const post = await db.blogPost.findUnique({ where: { slug: params.slug } });
    if (!post) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    if (post.authorId !== userId) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });

    const body = await req.json();
    const { title, content, coverImage, category, tags, excerpt, metaDescription, status } = body;

    const newContent = content ?? post.content;
    const readTime = content ? calculateReadTime(content) : post.readTime;
    const generatedExcerpt = excerpt?.trim() || (content ? generateExcerpt(content) : post.excerpt);

    const updated = await db.blogPost.update({
      where: { id: post.id },
      data: {
        ...(title && { title }),
        content: newContent,
        ...(coverImage !== undefined && { coverImage }),
        ...(category && { category }),
        ...(tags && { tags }),
        excerpt: generatedExcerpt,
        ...(metaDescription !== undefined && { metaDescription }),
        ...(status && { status }),
        readTime,
      },
    });

    revalidatePath(`/blog/${params.slug}`);
    revalidatePath('/blog');
    return NextResponse.json({ success: true, post: updated });
  } catch (error) {
    console.error('[BLOG_PATCH]', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: 'Unauthenticated.' }, { status: 401 });

    const post = await db.blogPost.findUnique({ where: { slug: params.slug } });
    if (!post) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    if (post.authorId !== userId) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });

    await db.blogPost.delete({ where: { id: post.id } });
    revalidatePath('/blog');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[BLOG_DELETE]', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
