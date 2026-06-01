"use client";

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Job } from '@prisma/client';

import JobCard from '@/components/job-card';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { value: 'all',                 label: 'All Jobs'            },
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
    <div className='border border-lux-border p-6'>
      <div className='flex justify-between items-start mb-5'>
        <div className='space-y-2 flex-1'>
          <div className='h-3 w-20 shimmer bg-lux-border' />
          <div className='h-5 w-2/3 shimmer bg-lux-border' />
          <div className='h-3 w-full shimmer bg-lux-border mt-3' />
          <div className='h-3 w-4/5 shimmer bg-lux-border' />
        </div>
      </div>
      <div className='flex gap-4 mt-5 pt-5 border-t border-lux-border'>
        <div className='h-3 w-24 shimmer bg-lux-border' />
        <div className='h-3 w-24 shimmer bg-lux-border' />
        <div className='h-3 w-24 shimmer bg-lux-border' />
      </div>
    </div>
  );
}

interface JobListProps {
  category?: string;
  userId?: string;
  postJobButton?: React.ReactNode;
}

export default function JobList({ category, userId, postJobButton }: JobListProps) {
  const [jobs,             setJobs]             = useState<Job[]>([]);
  const [isLoading,        setIsLoading]        = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(category ?? 'all');

  useEffect(() => {
    let alive = true;
    setIsLoading(true);

    const params = new URLSearchParams();
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (userId)                      params.set('userId',   userId);

    axios.get(`/api/job?${params.toString()}`).then((r) => {
      if (alive && r.data?.success) setJobs(r.data.jobs ?? []);
    }).catch(() => {}).finally(() => { if (alive) setIsLoading(false); });

    return () => { alive = false; };
  }, [selectedCategory, userId]);

  /* GSAP entrance */
  useEffect(() => {
    if (isLoading || !jobs.length) return;
    let cleanup: (() => void) | undefined;
    (async () => {
      const { gsap }          = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      gsap.fromTo('.job-card-item',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.07,
          scrollTrigger: { trigger: '.jobs-grid', start: 'top 88%', once: true } }
      );
      cleanup = () => ScrollTrigger.getAll().forEach((t) => t.kill());
    })();
    return () => cleanup?.();
  }, [isLoading, jobs]);

  const handleJobDelete = (jobId: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
  };

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────── */}
      <div className='pt-[72px] bg-gradient-to-b from-[#f0ebe2] to-[hsl(var(--background))]'>
        <div className='max-w-[900px] mx-auto px-6 pt-12 pb-10'>
          {/* eyebrow */}
          <div className='flex items-center gap-3 mb-7'>
            <div className='h-px w-10 bg-[#c9a96e]/50' />
            <span className='text-luxury-label text-[#c9a96e] tracking-luxury'>
              Career Opportunities
            </span>
            <div className='h-px w-10 bg-[#c9a96e]/50' />
          </div>

          <div className='flex items-end justify-between gap-6 flex-wrap'>
            <div>
              <h1 className='font-display text-4xl md:text-[3.4rem] font-bold text-lux-black leading-[1.05] tracking-tight mb-4'>
                Explore{' '}
                <span className='italic text-[#c9a96e]'>Fashion Jobs</span>
              </h1>
              <p className='text-lux-mid text-base md:text-lg leading-relaxed max-w-[480px]'>
                Discover career opportunities in fashion design, tailoring,
                styling, and creative direction.
              </p>
            </div>

            {postJobButton && <div className='flex-shrink-0'>{postJobButton}</div>}
          </div>

          {/* Stats */}
          <div className='flex items-center gap-10 pt-8 mt-8 border-t border-[#e5e1d9]'>
            {[
              { value: '2K+',  label: 'Open Roles'   },
              { value: '500+', label: 'Companies'     },
              { value: '150+', label: 'Specialities'  },
            ].map((s) => (
              <div key={s.label} className='text-center'>
                <div className='font-display text-2xl font-bold text-lux-black'>{s.value}</div>
                <div className='text-luxury-label text-lux-muted mt-1 tracking-luxury'>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sticky category bar ─────────────────────────────── */}
      {!userId && (
        <div className='sticky top-[72px] z-30 bg-[hsl(var(--background))] border-b border-lux-border'>
          <div className='max-w-[1400px] mx-auto px-6'>
            <div className='flex items-center overflow-x-auto scrollbar-hide'>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type='button'
                  onClick={() => setSelectedCategory(cat.value)}
                  className={cn(
                    'flex-shrink-0 h-12 px-5 text-luxury-label tracking-luxury transition-all duration-200 border-b-2 whitespace-nowrap',
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
          <div className='divider-gold mx-6' />
        </div>
      )}

      {/* ── Job list ────────────────────────────────────────── */}
      <div className='max-w-[900px] mx-auto px-6 py-10'>

        {/* count */}
        {!isLoading && jobs.length > 0 && (
          <p className='text-luxury-label tracking-luxury text-lux-muted mb-6'>
            {jobs.length} position{jobs.length !== 1 ? 's' : ''} available
          </p>
        )}

        {/* Skeleton */}
        {isLoading && (
          <div className='space-y-4'>
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty */}
        {!isLoading && jobs.length === 0 && (
          <div className='flex flex-col items-center gap-4 py-24 text-center'>
            <h3 className='font-display text-2xl font-bold text-lux-black'>No positions found</h3>
            <p className='text-lux-mid text-sm max-w-xs leading-relaxed'>
              {userId
                ? "You haven't posted any jobs yet."
                : 'Try a different category or check back later.'}
            </p>
            {!userId && (
              <button
                type='button'
                onClick={() => setSelectedCategory('all')}
                className='mt-2 text-luxury-label tracking-luxury text-lux-mid hover:text-lux-black border border-lux-border hover:border-lux-black/30 px-6 py-2.5 transition-all duration-300'
              >
                View All Jobs
              </button>
            )}
          </div>
        )}

        {/* Job cards */}
        {!isLoading && jobs.length > 0 && (
          <div className='jobs-grid space-y-4'>
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onDelete={() => handleJobDelete(job.id)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
