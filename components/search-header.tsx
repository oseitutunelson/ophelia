'use client';

import { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import useOrigin from '@/hooks/use-origin';
import { useRouter, useSearchParams } from 'next/navigation';

interface SearchHeaderProps {
  search: string | undefined;
}

export default function SearchHeader({ search }: SearchHeaderProps) {
  const router = useRouter();
  const origin = useOrigin();
  const searchParams = useSearchParams();
  const [searchVal, setSearchVal] = useState('');

  const category = searchParams.get('category');

  const handleSearch = () => {
    router.push(
      category
        ? `${origin}?search=${searchVal}&category=${category}`
        : `${origin}?search=${searchVal}`
    );
  };

  if (search === undefined) return null;

  return (
    <section className='pt-[72px] bg-[hsl(var(--background))]'>
      <div className='w-full bg-gradient-to-b from-[#f0ebe2] to-[hsl(var(--background))] py-14 px-6 flex flex-col items-center gap-6'>

        {/* back link */}
        <Link
          href='/'
          className='flex items-center gap-2 text-luxury-label tracking-luxury text-lux-muted hover:text-lux-black transition-colors duration-300 self-start max-w-[628px] w-full mx-auto'
        >
          <ArrowLeft size={13} />
          Back to Discover
        </Link>

        {/* search input */}
        <form
          action={handleSearch}
          className='w-full max-w-[628px] flex items-center gap-3 border border-lux-border bg-white focus-within:border-lux-black/30 transition-colors duration-300 px-5 h-14'
        >
          <Search size={16} strokeWidth={2} className='text-lux-subtle flex-shrink-0' />
          <input
            type='text'
            placeholder='Search works…'
            defaultValue={search}
            onChange={(e) => setSearchVal(e.target.value)}
            className='flex-1 bg-transparent text-lux-black text-sm placeholder:text-lux-subtle outline-none border-none'
          />
        </form>

        {/* result heading */}
        {search !== '' && (
          <div className='text-center'>
            <h1 className='font-display text-3xl md:text-4xl font-bold text-lux-black'>
              {search.charAt(0).toUpperCase() + search.slice(1)}
            </h1>
            <p className='text-lux-muted text-xs mt-2 text-luxury-label tracking-luxury'>
              Browsing works tagged &ldquo;{search}&rdquo;
            </p>
          </div>
        )}
      </div>

      <div className='divider-gold mx-6' />
    </section>
  );
}
