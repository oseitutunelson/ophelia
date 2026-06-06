import db from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: 'Unauthenticated.' }, { status: 401 });

    const post = await db.blogPost.findUnique({ where: { slug: params.slug } });
    if (!post) return NextResponse.json({ error: 'Not found.' }, { status: 404 });

    const existing = await db.blogLike.findUnique({
      where: { postId_userId: { postId: post.id, userId } },
    });

    if (existing) {
      await db.blogLike.delete({ where: { id: existing.id } });
      return NextResponse.json({ liked: false });
    }

    await db.blogLike.create({ data: { postId: post.id, userId } });
    return NextResponse.json({ liked: true });
  } catch (error) {
    console.error('[BLOG_LIKE]', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
