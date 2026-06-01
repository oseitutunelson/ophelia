import Link from 'next/link';
import { notFound } from 'next/navigation';
import { currentUser } from '@clerk/nextjs';

import db from '@/lib/db';
import WorkList from '@/components/work-list';

export default async function BookmarksPage() {
  const user = await currentUser();
  if (!user) notFound();

  const bookmarks = await db.bookmark.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' }
  });

  const workIds = bookmarks.map((b) => b.workId);
  const works = workIds.length
    ? await db.work.findMany({ where: { id: { in: workIds } }, orderBy: { createdAt: 'desc' } })
    : [];

  const pageCount = Math.ceil(works.length / 12);

  return (
    <div className='min-h-screen pt-[72px]'>

      {/* ── Hero header ─────────────────────────────────────── */}
      <div className='bg-gradient-to-b from-[#f0ebe2] to-[hsl(var(--background))]'>
        <div className='max-w-[1152px] mx-auto px-6 pt-10 pb-8'>
          <div className='flex items-center gap-3 mb-5'>
            <div className='h-px w-10 bg-[#c9a96e]/50' />
            <span className='text-luxury-label text-[#c9a96e] tracking-luxury'>Your Account</span>
            <div className='h-px w-10 bg-[#c9a96e]/50' />
          </div>
          <h1 className='font-display text-4xl font-bold text-lux-black leading-tight'>
            Account Settings
          </h1>
          <p className='text-lux-mid text-sm mt-2'>
            Manage your profile, security, and saved works.
          </p>
        </div>
      </div>

      {/* ── Tab nav ─────────────────────────────────────────── */}
      <div className='border-b border-lux-border'>
        <div className='max-w-[1152px] mx-auto px-6 flex'>
          <Link
            href='/account'
            className='inline-flex items-center h-12 px-5 text-luxury-label tracking-luxury text-lux-muted hover:text-lux-mid border-b-2 border-transparent transition-colors duration-200'
          >
            Account
          </Link>
          <Link
            href='/account/bookmarks'
            className='inline-flex items-center h-12 px-5 text-luxury-label tracking-luxury text-lux-black border-b-2 border-lux-black -mb-px'
          >
            Saved Works
          </Link>
        </div>
        <div className='divider-gold mx-6' />
      </div>

      {/* ── Bookmarks grid ──────────────────────────────────── */}
      <div className='max-w-[1152px] mx-auto px-6 lg:px-16 xl:px-20 py-10'>
        {works.length === 0 ? (
          <div className='flex flex-col items-center gap-4 py-24 text-center'>
            <h3 className='font-display text-2xl font-bold text-lux-black'>No saved works yet</h3>
            <p className='text-lux-mid text-sm max-w-xs leading-relaxed'>
              Bookmark designs you love and they will appear here.
            </p>
            <Link
              href='/'
              className='mt-2 text-luxury-label tracking-luxury text-lux-mid hover:text-lux-black border border-lux-border hover:border-lux-black/30 px-6 py-2.5 transition-all duration-300'
            >
              Browse Works
            </Link>
          </div>
        ) : (
          <>
            <p className='text-luxury-label tracking-luxury text-lux-muted mb-6'>
              {works.length} saved work{works.length !== 1 ? 's' : ''}
            </p>
            <WorkList initialData={works} pageCount={pageCount} />
          </>
        )}
      </div>
    </div>
  );
}
