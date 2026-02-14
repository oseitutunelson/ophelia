import { notFound } from 'next/navigation';
import { currentUser } from '@clerk/nextjs';

import db from '@/lib/db';
import WorkList from '@/components/work-list';

export default async function BookmarksPage() {
  const user = await currentUser();

  if (!user) {
    notFound();
  }

  // fetch bookmarks for the current user
  const bookmarks = await db.bookmark.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' }
  });

  const workIds = bookmarks.map((b) => b.workId);

  const works = workIds.length
    ? await db.work.findMany({
        where: { id: { in: workIds } },
        orderBy: { createdAt: 'desc' }
      })
    : [];

  const pageCount = Math.ceil(works.length / 12);

  return (
    <section className='container py-6'>
      <h1 className='text-2xl font-semibold mb-4'>Saved</h1>
      <WorkList initialData={works} pageCount={pageCount} />
    </section>
  );
}
