'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import type { Work } from '@prisma/client';

import SearchCard from '@/components/search-card';

// Skeleton cards mimic the same cycling aspect ratios as SearchCard
const SKELETON_ASPECTS = [
  'aspect-[4/3]', 'aspect-[3/4]', 'aspect-[1/1]',
  'aspect-[4/3]', 'aspect-[16/9]', 'aspect-[4/5]',
];

function SkeletonCard({ index }: { index: number }) {
  return (
    <div className='break-inside-avoid mb-5'>
      <div className={`w-full shimmer bg-lux-border ${SKELETON_ASPECTS[index % SKELETON_ASPECTS.length]}`} />
      <div className='mt-2.5 px-0.5 flex items-center gap-2'>
        <div className='h-5 w-5 rounded-full shimmer bg-lux-border' />
        <div className='h-3 w-24 shimmer bg-lux-border rounded-sm' />
      </div>
    </div>
  );
}

interface SearchResultsGridProps {
  initialData: Work[];
  pageCount: number;
  search?: string;
  category?: string;
  sort?: string;
}

export default function SearchResultsGrid({
  initialData,
  pageCount,
  search,
  category,
  sort,
}: SearchResultsGridProps) {
  const [allWorks,     setAllWorks]     = useState<Work[]>(initialData);
  const [page,         setPage]         = useState(1);
  const [isLoading,    setIsLoading]    = useState(false);
  const [hasMore,      setHasMore]      = useState(pageCount > 1);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Reset state when search params change (new query/sort)
  useEffect(() => {
    setAllWorks(initialData);
    setPage(1);
    setHasMore(pageCount > 1);
  }, [initialData, pageCount]);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('offset', String(page * 12));
      if (search)   params.set('search',   search);
      if (category) params.set('category', category);
      if (sort && sort !== 'latest') params.set('sort', sort);

      const { data } = await axios.get<Work[]>(`/api/work?${params.toString()}`);

      if (Array.isArray(data) && data.length > 0) {
        setAllWorks((prev) => [...prev, ...data]);
        const next = page + 1;
        setPage(next);
        setHasMore(next < pageCount);
      } else {
        setHasMore(false);
      }
    } catch {
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, page, pageCount, search, category, sort]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { rootMargin: '300px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  /* ── No results ──────────────────────────────────────────── */
  if (allWorks.length === 0) {
    return (
      <section className='w-full py-20 flex flex-col items-center gap-6 text-center'>
        <div className='relative w-56 h-44 opacity-50'>
          <Image src='/no-results.png' alt='No results' fill className='object-contain' />
        </div>

        <div>
          <h3 className='font-display text-2xl font-bold text-lux-black mb-2'>
            No results found
          </h3>
          <p className='text-lux-mid text-sm max-w-[300px] leading-relaxed mx-auto'>
            We couldn&apos;t find anything matching your search. Try different keywords or browse a category.
          </p>
        </div>

        {/* suggestion pills */}
        <div className='flex flex-wrap justify-center gap-2 mt-2'>
          {['Branding', 'Illustration', 'Fashion Photography', 'Garment Design', 'Jewelry & Accessories', 'Others'].map((tag) => (
            <Link
              key={tag}
              href={`/?category=${encodeURIComponent(tag)}`}
              className='text-luxury-label tracking-luxury text-lux-mid hover:text-lux-black border border-lux-border hover:border-lux-black/30 px-4 py-2 transition-all duration-300'
            >
              {tag}
            </Link>
          ))}
        </div>
      </section>
    );
  }

  return (
    <div className='w-full'>
      {/* ── Masonry columns grid ─────────────────────────────── */}
      <div className='columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5'>
        {allWorks.map((work, i) => (
          <SearchCard key={work.id} work={work} index={i} />
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className='w-full h-1' />

      {/* Loading skeletons while fetching next page */}
      {isLoading && (
        <div className='columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 mt-0'>
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} index={(allWorks.length + i) % 6} />
          ))}
        </div>
      )}

      {/* End of results */}
      {!hasMore && allWorks.length > 0 && !isLoading && (
        <div className='flex flex-col items-center gap-3 py-14'>
          <div className='divider-gold w-24' />
          <p className='text-luxury-label tracking-luxury text-lux-subtle'>
            You&apos;ve seen it all
          </p>
        </div>
      )}
    </div>
  );
}
