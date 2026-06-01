'use client';

import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import JobList from '@/components/job-list';

export default function JobsPage() {
  const { userId } = useAuth();

  return (
    <main className='min-h-screen'>
      <JobList postJobButton={
        userId ? (
          <Link
            href='/post-job'
            className='group inline-flex items-center gap-2 bg-lux-black hover:bg-lux-dark text-white px-7 py-3 text-luxury-label tracking-luxury font-semibold transition-colors duration-300'
          >
            Post a Job
            <ArrowRight size={12} className='transition-transform duration-300 group-hover:translate-x-0.5' />
          </Link>
        ) : null
      } />
    </main>
  );
}
