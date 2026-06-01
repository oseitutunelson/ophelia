'use client';

import { useRef } from 'react';
import { useOverflow } from 'use-overflow';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import useOrigin from '@/hooks/use-origin';
import { useRouter, useSearchParams } from 'next/navigation';

const CATEGORIES = [
  'Discover',
  'Animation',
  'Branding',
  'Illustration',
  'Pattern Making',
  'Garment Design',
  '3D Fashion Design',
  'Sketches & Concepts',
  'Jewelry & Accessories',
  'Fashion Photography',
  'NFT / Digital Ownership Fashion',
  'Metaverse Wearables'
];

export default function Categories() {
  const router = useRouter();
  const origin = useOrigin();
  const searchParams = useSearchParams();

  const search   = searchParams.get('search');
  const category = searchParams.get('category');

  const listRef = useRef<HTMLUListElement>(null);
  const { refXOverflowing, refXScrollBegin, refXScrollEnd } = useOverflow(listRef);

  const scroll = (dir: 'left' | 'right') => {
    if (!listRef.current) return;
    const { scrollLeft, clientWidth } = listRef.current;
    listRef.current.scrollTo({
      left: dir === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth,
      behavior: 'smooth'
    });
  };

  const handleFilter = (item: string) => {
    if (item === 'Discover') {
      router.push(search ? `${origin}?search=${encodeURIComponent(search)}` : origin);
    } else {
      router.push(
        search
          ? `${origin}?search=${encodeURIComponent(search)}&category=${encodeURIComponent(item)}`
          : `${origin}?category=${encodeURIComponent(item)}`
      );
    }
  };

  const isActive = (item: string) =>
    item === category || (item === 'Discover' && category === null);

  return (
    <div className='overflow-x-auto overflow-y-hidden relative'>
      {/* left scroll fade */}
      {refXOverflowing && !refXScrollBegin && (
        <button
          onClick={() => scroll('left')}
          className='absolute left-0 top-0 bottom-0 z-10 flex items-center pl-0 pr-6 bg-gradient-to-r from-[hsl(var(--background))] via-[hsl(var(--background))]/80 to-transparent'
          aria-label='Scroll left'
        >
          <ChevronLeft size={15} className='text-lux-muted' />
        </button>
      )}
      {/* right scroll fade */}
      {refXOverflowing && !refXScrollEnd && (
        <button
          onClick={() => scroll('right')}
          className='absolute right-0 top-0 bottom-0 z-10 flex items-center pr-0 pl-6 bg-gradient-to-l from-[hsl(var(--background))] via-[hsl(var(--background))]/80 to-transparent'
          aria-label='Scroll right'
        >
          <ChevronRight size={15} className='text-lux-muted' />
        </button>
      )}

      <ul
        ref={listRef}
        className='flex gap-1 px-0.5 whitespace-nowrap overflow-x-auto scroll-smooth scrollbar-hide'
      >
        {CATEGORIES.map((item, i) => (
          <li key={i}>
            <button
              type='button'
              onClick={() => handleFilter(item)}
              className={cn(
                'inline-flex items-center h-8 px-4 text-luxury-label tracking-luxury transition-all duration-300',
                isActive(item)
                  ? 'text-lux-black border-b border-lux-black'
                  : 'text-lux-muted hover:text-lux-mid border-b border-transparent'
              )}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
