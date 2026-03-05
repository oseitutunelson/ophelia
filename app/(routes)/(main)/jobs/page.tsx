'use client';

import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';

import JobList from '@/components/job-list';
import { Button } from '@/components/ui/button';

export default function JobsPage() {
  const { userId } = useAuth();

  return (
    <div className='min-h-screen bg-white'>
      <div className='max-w-7xl mx-auto px-6 lg:px-10 py-12'>
        <div className='flex justify-between items-center mb-12'>
          <div>
            <h1 className='text-4xl font-bold text-[#3d3d4e] mb-2'>Fashion Jobs</h1>
            <p className='text-[#9e9ea7] text-lg'>
              Explore career opportunities in fashion design, tailoring, styling, and more
            </p>
          </div>
          {userId && (
            <Button className='rounded-full h-12 px-8 font-semibold' asChild>
              <Link href='/post-job'>Post a Job</Link>
            </Button>
          )}
        </div>

        <JobList />
      </div>
    </div>
  );
}
