"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Job } from '@prisma/client';

import JobCard from '@/components/job-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface JobListProps {
  category?: string;
  userId?: string;
}

export default function JobList({ category, userId }: JobListProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');

  const fashionJobCategories = [
    { value: 'all', label: 'All Jobs' },
    { value: 'fashion-design', label: 'Fashion Design' },
    { value: 'tailor-seamstress', label: 'Tailor/Seamstress' },
    { value: 'pattern-making', label: 'Pattern Making' },
    { value: 'fashion-styling', label: 'Fashion Styling' },
    { value: 'wardrobe-consulting', label: 'Wardrobe Consulting' },
    { value: 'fashion-marketing', label: 'Fashion Marketing' },
    { value: 'fashion-writing', label: 'Fashion Writing' },
    { value: 'other-fashion', label: 'Other Fashion Jobs' }
  ];

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== 'all') {
          params.append('category', selectedCategory);
        }
        if (userId) {
          params.append('userId', userId);
        }

        const res = await axios.get(`/api/job?${params.toString()}`);
        if (res.data?.success) {
          setJobs(res.data.jobs || []);
        }
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [selectedCategory, userId]);

  const handleJobDelete = (jobId: string) => {
    setJobs(jobs.filter(job => job.id !== jobId));
  };

  return (
    <div className='w-full'>
      {!userId && (
        <div className='mb-8'>
          <h3 className='text-lg font-semibold mb-4 text-[#3d3d4e]'>Filter by Category</h3>
          <div className='flex flex-wrap gap-2'>
            {fashionJobCategories.map(cat => (
              <Button
                key={cat.value}
                variant={selectedCategory === cat.value ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat.value)}
                className={selectedCategory === cat.value ? 'rounded-full' : 'rounded-full'}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <div className='grid grid-cols-1 gap-6'>
          {[...Array(3)].map((_, i) => (
            <div key={i} className='border border-[#e7e7e9] rounded-lg p-6'>
              <Skeleton className='h-6 w-1/2 mb-2' />
              <Skeleton className='h-4 w-full mb-4' />
              <div className='grid grid-cols-2 gap-4 mb-4'>
                <Skeleton className='h-4' />
                <Skeleton className='h-4' />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && jobs.length === 0 && (
        <div className='text-center py-12'>
          <p className='text-[#9e9ea7] text-lg mb-4'>No jobs found</p>
          <p className='text-sm text-[#9e9ea7]'>
            {userId ? 'You haven\'t posted any jobs yet.' : 'Try a different category or check back later.'}
          </p>
        </div>
      )}

      {!isLoading && jobs.length > 0 && (
        <div className='grid grid-cols-1 gap-6'>
          {jobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              onDelete={() => handleJobDelete(job.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
