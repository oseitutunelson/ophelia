import { Metadata } from 'next';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import BlogForm from '@/components/blog-form';

export const metadata: Metadata = {
  title: 'Write an Article | Ophelia Journal',
};

export default function NewBlogPage() {
  const { userId } = auth();
  if (!userId) redirect('/sign-in');

  return <BlogForm mode='create' />;
}
