import { Metadata } from 'next';
import { auth } from '@clerk/nextjs';
import { notFound, redirect } from 'next/navigation';
import db from '@/lib/db';
import BlogForm from '@/components/blog-form';

export const metadata: Metadata = { title: 'Edit Article | Ophelia Journal' };

type Props = { params: { slug: string } };

export default async function EditBlogPage({ params }: Props) {
  const { userId } = auth();
  if (!userId) redirect('/sign-in');

  const post = await db.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post) notFound();
  if (post.authorId !== userId) redirect(`/blog/${params.slug}`);

  return (
    <BlogForm
      mode='edit'
      initialData={{
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt || '',
        content: post.content,
        coverImage: post.coverImage || '',
        category: post.category,
        tags: post.tags,
        metaDescription: post.metaDescription || '',
        status: post.status,
      }}
    />
  );
}
