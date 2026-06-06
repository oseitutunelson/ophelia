import db from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await db.blogPost.findUnique({ where: { slug: params.slug } });
    if (!post) return NextResponse.json({ error: 'Not found.' }, { status: 404 });

    const offset = parseInt(req.nextUrl.searchParams.get('offset') || '0');

    const comments = await db.blogComment.findMany({
      where: { postId: post.id },
      skip: offset,
      take: 20,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('[BLOG_COMMENTS_GET]', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: 'Unauthenticated.' }, { status: 401 });

    const post = await db.blogPost.findUnique({ where: { slug: params.slug } });
    if (!post) return NextResponse.json({ error: 'Not found.' }, { status: 404 });

    const { content } = await req.json();
    if (!content?.trim()) return NextResponse.json({ error: 'Comment cannot be empty.' }, { status: 400 });

    const comment = await db.blogComment.create({
      data: { postId: post.id, authorId: userId, content: content.trim() },
    });

    return NextResponse.json({ success: true, comment }, { status: 201 });
  } catch (error) {
    console.error('[BLOG_COMMENT_POST]', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: 'Unauthenticated.' }, { status: 401 });

    const { commentId } = await req.json();
    const comment = await db.blogComment.findUnique({ where: { id: commentId } });
    if (!comment) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    if (comment.authorId !== userId) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });

    await db.blogComment.delete({ where: { id: commentId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[BLOG_COMMENT_DELETE]', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
