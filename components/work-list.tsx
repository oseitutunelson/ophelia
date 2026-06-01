'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import type { Work } from '@prisma/client';

import { cn } from '@/lib/utils';
import WorkPage from '@/components/work-page';
import WorkInitialPage from '@/components/work-initial-page';

interface WorkListProps {
  initialData: Work[];
  pageCount: number;
  isProfile?: boolean;
  isOwner?: boolean;
  userId?: string;
  userFullname?: string;
}

export default function WorkList({
  initialData,
  pageCount,
  isProfile = false,
  isOwner = false,
  userId,
  userFullname
}: WorkListProps) {
  const [count, setCount]     = useState(1);
  const [loading, setLoading] = useState(false);
  const gridRef               = useRef<HTMLElement>(null);

  const pages = [
    <WorkInitialPage key={1} initialData={initialData} isProfile={isProfile} />
  ];
  for (let i = 2; i <= count; i++) {
    pages.push(
      <WorkPage key={i} index={i} setLoading={setLoading} isProfile={isProfile} userId={userId} />
    );
  }

  /* GSAP stagger entrance */
  useEffect(() => {
    if (!initialData.length) return;
    let cleanup: (() => void) | undefined;

    const run = async () => {
      const { gsap }         = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const cards = document.querySelectorAll<HTMLElement>('.work-card-item');
      if (!cards.length) return;

      gsap.fromTo(cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.05,
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 88%',
            once: true
          }
        }
      );
      cleanup = () => ScrollTrigger.getAll().forEach((t) => t.kill());
    };
    run();
    return () => cleanup?.();
  }, [initialData]);

  return (
    <>
      {/* no results */}
      {initialData.length === 0 && !isProfile && (
        <section className='w-full pt-8 lg:pt-14 flex flex-col items-center gap-5'>
          <div className='relative inline-flex mb-3'>
            <Image src='/no-results.png' alt='no results' width={400} height={300} className='opacity-60' />
            <span className='absolute right-14 bottom-4 text-lux-subtle text-xs'>
              Art by <Link href='/' className='underline text-lux-muted'>Misha</Link>
            </span>
          </div>
          <h3 className='font-display text-2xl font-bold text-lux-black text-center'>No results found</h3>
          <p className='text-lux-mid text-sm text-center max-w-xs'>
            We couldn't find anything matching your search.
          </p>
        </section>
      )}

      {/* empty: other's profile */}
      {initialData.length === 0 && isProfile && !isOwner && (
        <section className='w-full pt-8 flex flex-col items-center my-20 gap-5'>
          <Image src='/no-works.jpg' alt='no works' width={160} height={160} className='opacity-50 rounded-full' />
          <h4 className='font-display text-xl font-semibold text-lux-black text-center'>No works yet</h4>
          <p className='text-sm text-lux-mid text-center max-w-xs'>
            {typeof userFullname === 'string' ? userFullname : 'This designer'} hasn't uploaded any work yet.
          </p>
        </section>
      )}

      {/* empty: owner's profile */}
      {initialData.length === 0 && isProfile && isOwner && (
        <section className='w-full gap-8 pt-6 grid md:grid-cols-2 lg:grid-cols-3'>
          <div className='w-full flex flex-col items-center justify-center text-center h-[270px] xl:h-[360px] border border-dashed border-lux-border hover:border-gold/50 transition-colors duration-500 bg-lux-hover/30'>
            <h2 className='text-xl font-display font-bold text-lux-black mb-2'>Upload your first work</h2>
            <p className='mb-5 text-lux-mid text-sm max-w-[240px]'>
              Show off your best work and connect with the creative community.
            </p>
            <Link
              href='/upload-new'
              className='inline-flex items-center text-luxury-label tracking-luxury text-white bg-lux-black hover:bg-lux-dark transition-colors duration-300 px-5 py-2.5 font-semibold'
            >
              Upload First Work
            </Link>
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className='w-full h-[225px] xl:h-[360px] bg-gradient-to-b from-lux-border/30 to-transparent' />
          ))}
        </section>
      )}

      {/* work grid */}
      {initialData.length > 0 && (
        <section
          ref={gridRef}
          id='works'
          className={cn(
            'w-full gap-8 pt-6 grid md:grid-cols-2 lg:grid-cols-3',
            !isProfile && 'xl:grid-cols-4',
            isProfile  && 'xl:gap-10'
          )}
        >
          {pages}
        </section>
      )}

      {/* load more */}
      {count < pageCount && !loading ? (
        <div className='mt-14 flex justify-center'>
          <button
            onClick={() => setCount((c) => c + 1)}
            className='text-luxury-label tracking-luxury text-lux-mid hover:text-lux-black border border-lux-border hover:border-lux-black/30 px-8 py-3 transition-all duration-300 bg-white'
          >
            Load More Work
          </button>
        </div>
      ) : loading ? (
        <div className='flex items-center justify-center mt-14 gap-2 text-lux-mid'>
          <Loader2 className='animate-spin' size={16} />
          <span className='text-sm'>Loading…</span>
        </div>
      ) : (
        <div className='mt-14 h-9' />
      )}
    </>
  );
}
