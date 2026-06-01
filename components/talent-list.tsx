"use client";

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';

import TalentCard from '@/components/talent-card';
import { cn } from '@/lib/utils';

interface Work {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  createdAt: string;
}

interface Talent {
  id: string;
  userId: string;
  username: string;
  bio?: string;
  works: Work[];
  profilePicture?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES = [
  { value: 'all',                 label: 'All Designers'       },
  { value: 'fashion-design',      label: 'Fashion Design'      },
  { value: 'tailor-seamstress',   label: 'Tailor / Seamstress' },
  { value: 'pattern-making',      label: 'Pattern Making'      },
  { value: 'fashion-styling',     label: 'Fashion Styling'     },
  { value: 'wardrobe-consulting', label: 'Wardrobe Consulting' },
  { value: 'fashion-marketing',   label: 'Fashion Marketing'   },
  { value: 'fashion-writing',     label: 'Fashion Writing'     },
  { value: 'other-fashion',       label: 'Other'               },
];

function SkeletonCard() {
  return (
    <div className='flex flex-col border border-lux-border'>
      <div className='w-full aspect-[4/3] shimmer bg-lux-border' />
      <div className='p-5 space-y-4'>
        <div className='flex items-center gap-3'>
          <div className='h-10 w-10 rounded-full shimmer bg-lux-border flex-shrink-0' />
          <div className='space-y-1.5 flex-1'>
            <div className='h-3.5 w-28 shimmer bg-lux-border' />
            <div className='h-2.5 w-20 shimmer bg-lux-border' />
          </div>
        </div>
        <div className='h-3 w-full shimmer bg-lux-border' />
        <div className='h-3 w-3/4 shimmer bg-lux-border' />
        <div className='grid grid-cols-3 gap-2'>
          {[0, 1, 2].map((i) => (
            <div key={i} className='aspect-square shimmer bg-lux-border' />
          ))}
        </div>
        <div className='h-10 w-full shimmer bg-lux-border' />
      </div>
    </div>
  );
}

export default function TalentList() {
  const [talents,          setTalents]          = useState<Talent[]>([]);
  const [isLoading,        setIsLoading]        = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery,      setSearchQuery]      = useState('');
  const [inputVal,         setInputVal]         = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(inputVal), 300);
    return () => clearTimeout(timer);
  }, [inputVal]);

  useEffect(() => {
    let alive = true;
    setIsLoading(true);

    const params = new URLSearchParams();
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (searchQuery)                 params.set('search',   searchQuery);

    axios.get(`/api/talents?${params.toString()}`).then((res) => {
      if (alive && res.data?.success) setTalents(res.data.talents ?? []);
    }).catch(() => {}).finally(() => { if (alive) setIsLoading(false); });

    return () => { alive = false; };
  }, [selectedCategory, searchQuery]);

  /* GSAP entrance */
  useEffect(() => {
    if (isLoading || !talents.length) return;
    let cleanup: (() => void) | undefined;
    (async () => {
      const { gsap }          = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      gsap.fromTo('.talent-card-item',
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out', stagger: 0.06,
          scrollTrigger: { trigger: '.talent-grid', start: 'top 88%', once: true } }
      );
      cleanup = () => ScrollTrigger.getAll().forEach((t) => t.kill());
    })();
    return () => cleanup?.();
  }, [isLoading, talents]);

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────── */}
      <div
        className='pt-[72px] bg-gradient-to-b from-[#f0ebe2] to-[hsl(var(--background))]'
      >
        <div className='max-w-[900px] mx-auto px-6 pt-12 pb-10 text-center'>
          {/* eyebrow */}
          <div className='flex items-center justify-center gap-3 mb-7'>
            <div className='h-px w-10 bg-[#c9a96e]/50' />
            <span className='text-luxury-label text-[#c9a96e] tracking-luxury'>
              Creative Marketplace
            </span>
            <div className='h-px w-10 bg-[#c9a96e]/50' />
          </div>

          <h1 className='font-display text-4xl md:text-[3.4rem] font-bold text-lux-black leading-[1.05] tracking-tight mb-5'>
            Discover World&#8209;Class{' '}
            <span className='italic text-[#c9a96e]'>Fashion Talent</span>
          </h1>

          <p className='text-lux-mid text-base md:text-lg leading-relaxed max-w-[480px] mx-auto mb-10'>
            Connect with the finest fashion designers, stylists, and creative
            professionals ready to bring your vision to life.
          </p>

          {/* Stats */}
          <div className='flex items-center justify-center gap-10 pt-8 border-t border-[#e5e1d9]'>
            {[
              { value: '12K+', label: 'Designers' },
              { value: '150+', label: 'Specialties' },
              { value: '98%',  label: 'Satisfaction' },
            ].map((s) => (
              <div key={s.label} className='text-center'>
                <div className='font-display text-2xl font-bold text-lux-black'>{s.value}</div>
                <div className='text-luxury-label text-lux-muted mt-1 tracking-luxury'>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sticky filter bar ──────────────────────────────── */}
      <div className='sticky top-[72px] z-30 bg-[hsl(var(--background))] border-b border-lux-border'>
        <div className='max-w-[1400px] mx-auto px-6'>
          <div className='flex items-center gap-4 py-3'>

            {/* Search input */}
            <div className='flex items-center gap-2.5 border border-lux-border bg-white focus-within:border-lux-black/30 transition-colors duration-300 px-4 h-10 min-w-[180px] max-w-[280px] flex-shrink-0'>
              <Search size={13} strokeWidth={2} className='text-lux-subtle flex-shrink-0' />
              <input
                ref={searchRef}
                type='text'
                placeholder='Search designers…'
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className='flex-1 bg-transparent text-lux-black text-sm placeholder:text-lux-subtle outline-none border-none'
              />
            </div>

            <div className='hidden sm:block h-5 w-px bg-lux-border flex-shrink-0' />

            {/* Category tabs — scrollable */}
            <div className='flex items-center gap-0 overflow-x-auto scrollbar-hide flex-1'>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type='button'
                  onClick={() => setSelectedCategory(cat.value)}
                  className={cn(
                    'flex-shrink-0 h-10 px-4 text-luxury-label tracking-luxury transition-all duration-200 border-b-2 -mb-px whitespace-nowrap',
                    selectedCategory === cat.value
                      ? 'text-lux-black border-lux-black'
                      : 'text-lux-muted hover:text-lux-mid border-transparent'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className='divider-gold mx-6' />
      </div>

      {/* ── Grid ───────────────────────────────────────────── */}
      <div className='max-w-[1400px] mx-auto px-6 lg:px-16 xl:px-20 py-10'>

        {/* result count */}
        {!isLoading && talents.length > 0 && (
          <p className='text-luxury-label tracking-luxury text-lux-muted mb-6'>
            {talents.length} designer{talents.length !== 1 ? 's' : ''} found
          </p>
        )}

        {/* Skeleton loading */}
        {isLoading && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* No results */}
        {!isLoading && talents.length === 0 && (
          <div className='flex flex-col items-center gap-4 py-24 text-center'>
            <h3 className='font-display text-2xl font-bold text-lux-black'>No designers found</h3>
            <p className='text-lux-mid text-sm max-w-xs leading-relaxed'>
              Try a different specialty or clear your search.
            </p>
            <button
              type='button'
              onClick={() => { setSelectedCategory('all'); setInputVal(''); }}
              className='mt-2 text-luxury-label tracking-luxury text-lux-mid hover:text-lux-black border border-lux-border hover:border-lux-black/30 px-6 py-2.5 transition-all duration-300'
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Talent grid */}
        {!isLoading && talents.length > 0 && (
          <div className='talent-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {talents.map((talent) => (
              <TalentCard
                key={talent.userId}
                userId={talent.userId}
                username={talent.username}
                bio={talent.bio}
                works={talent.works}
                profilePicture={talent.profilePicture}
                githubUrl={talent.githubUrl}
                linkedinUrl={talent.linkedinUrl}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
