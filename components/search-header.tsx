'use client';

import { useState, useEffect } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import useOrigin from '@/hooks/use-origin';
import { cn } from '@/lib/utils';

const SORT_TABS = [
  { value: 'latest',   label: 'Latest'   },
  { value: 'popular',  label: 'Popular'  },
  { value: 'trending', label: 'Trending' },
];

const QUICK_CATEGORIES = [
  'Branding', 'Illustration', 'Fashion Photography',
  'Garment Design', '3D Fashion Design', 'Jewelry & Accessories', 'Others',
];

interface SearchHeaderProps {
  search: string | undefined;
}

export default function SearchHeader({ search }: SearchHeaderProps) {
  const router       = useRouter();
  const origin       = useOrigin();
  const searchParams = useSearchParams();
  const [searchVal, setSearchVal] = useState(search ?? '');
  const [isScrolled, setIsScrolled] = useState(false);

  const category = searchParams.get('category');
  const sort     = searchParams.get('sort') ?? 'latest';

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const buildUrl = (overrides: { search?: string; sort?: string; category?: string }) => {
    const s = overrides.search   !== undefined ? overrides.search   : (search   ?? '');
    const o = overrides.sort     !== undefined ? overrides.sort     : sort;
    const c = overrides.category !== undefined ? overrides.category : (category ?? '');
    const p: Record<string, string> = {};
    if (s) p.search   = s;
    if (o && o !== 'latest') p.sort = o;
    if (c) p.category = c;
    const qs = new URLSearchParams(p).toString();
    return qs ? `${origin}?${qs}` : origin;
  };

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    router.push(buildUrl({ search: searchVal }));
  };

  if (search === undefined) return null;

  return (
    <section>
      {/* ── Hero header (non-sticky) ─────────────────────────── */}
      <div className='pt-[72px] bg-gradient-to-b from-[#f0ebe2] to-[hsl(var(--background))]'>
        <div className='max-w-[900px] mx-auto px-6 pt-10 pb-8'>
          <Link
            href='/'
            className='inline-flex items-center gap-2 text-luxury-label tracking-luxury text-lux-muted hover:text-lux-black transition-colors duration-300 mb-8'
          >
            <ArrowLeft size={13} />
            Back to Discover
          </Link>

          {search !== '' && (
            <div>
              <h1 className='font-display text-4xl md:text-[3.2rem] font-bold text-lux-black leading-tight'>
                {search.charAt(0).toUpperCase() + search.slice(1)}
              </h1>
              <p className='text-lux-muted text-xs mt-2.5 text-luxury-label tracking-luxury'>
                Browsing works tagged &ldquo;{search}&rdquo;
                {category && (
                  <span className='ml-2 text-gold'>· {category}</span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Sticky filter bar ─────────────────────────────────── */}
      <div
        className={cn(
          'sticky top-[72px] z-30 border-b border-lux-border transition-all duration-300',
          isScrolled
            ? 'bg-white/92 backdrop-blur-xl shadow-[0_2px_20px_rgba(0,0,0,0.06)]'
            : 'bg-[hsl(var(--background))]'
        )}
      >
        <div className='max-w-[1400px] mx-auto px-6'>
          <div className='flex items-center gap-4 py-3 flex-wrap'>

            {/* Search input */}
            <form
              onSubmit={handleSearch}
              className='flex items-center gap-2.5 border border-lux-border bg-white focus-within:border-lux-black/30 transition-colors duration-300 px-4 h-10 min-w-[180px] max-w-[320px] flex-1'
            >
              <Search size={13} strokeWidth={2} className='text-lux-subtle flex-shrink-0' />
              <input
                type='text'
                placeholder='Refine search…'
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className='flex-1 bg-transparent text-lux-black text-sm placeholder:text-lux-subtle outline-none border-none'
              />
            </form>

            {/* Divider */}
            <div className='hidden sm:block h-5 w-px bg-lux-border' />

            {/* Sort tabs */}
            <div className='flex items-center'>
              {SORT_TABS.map((tab) => (
                <button
                  key={tab.value}
                  type='button'
                  onClick={() => router.push(buildUrl({ sort: tab.value }))}
                  className={cn(
                    'h-10 px-4 text-luxury-label tracking-luxury transition-all duration-200 border-b-2 -mb-px',
                    sort === tab.value
                      ? 'text-lux-black border-lux-black'
                      : 'text-lux-muted hover:text-lux-mid border-transparent'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className='hidden lg:block h-5 w-px bg-lux-border' />

            {/* Quick category pills */}
            <div className='hidden lg:flex items-center gap-1.5 overflow-hidden'>
              {QUICK_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type='button'
                  onClick={() => router.push(buildUrl({ category: category === cat ? '' : cat }))}
                  className={cn(
                    'flex-shrink-0 h-7 px-3 text-[10px] tracking-[0.14em] uppercase font-medium border transition-all duration-200',
                    category === cat
                      ? 'border-lux-black text-lux-black bg-transparent'
                      : 'border-lux-border text-lux-muted hover:border-lux-black/30 hover:text-lux-mid'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className='divider-gold mx-6' />
      </div>
    </section>
  );
}
