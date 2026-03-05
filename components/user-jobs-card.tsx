'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, ExternalLink, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface UserJob {
  id: string;
  title: string;
  description: string;
  category: string;
  location?: string;
  salary?: string;
  jobType: string;
  experience?: string;
  image?: string;
  createdAt: string;
  _count?: {
    applications: number;
  };
}

export default function UserJobsCard() {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<UserJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/profile/my-jobs');
      if (res.data?.success) {
        setJobs(res.data.jobs);
      }
    } catch (err: any) {
      console.error('Failed to fetch jobs:', err);
      toast({
        title: 'Error',
        description: 'Failed to load your jobs',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className='text-center py-8'>
        <Loader2 className='h-8 w-8 animate-spin mx-auto' />
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className='text-center py-12'>
        <p className='text-[#9e9ea7]'>You haven't posted any jobs yet</p>
        <Link href='/post-job' className='text-blue-600 hover:underline mt-2 inline-block'>
          Post your first job
        </Link>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-bold text-[#3d3d4e]'>My Posted Jobs</h2>
      <div className='space-y-3'>
        {jobs.map((job) => (
          <div
            key={job.id}
            className='border border-[#e7e7e9] rounded-lg p-4 hover:shadow-md transition-shadow'
          >
            <Link href={`/jobs/${job.id}`} className='flex gap-4 hover:opacity-80'>
              {job.image && (
                <div className='relative h-24 w-24 rounded overflow-hidden flex-shrink-0'>
                  <Image
                    src={job.image}
                    alt={job.title}
                    fill
                    className='object-cover'
                  />
                </div>
              )}
              <div className='flex-1 min-w-0'>
                <h3 className='font-semibold text-[#3d3d4e]'>{job.title}</h3>
                <p className='text-sm text-[#9e9ea7] mt-1 line-clamp-2'>
                  {job.description}
                </p>
                <div className='flex items-center gap-4 mt-2 text-xs text-[#9e9ea7]'>
                  <span>{job.jobType}</span>
                  {job.location && <span>{job.location}</span>}
                  {job.salary && <span>{job.salary}</span>}
                </div>
                <p className='text-xs text-[#9e9ea7] mt-1'>
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className='flex flex-col items-end gap-2'>
                <ExternalLink size={18} className='text-[#9e9ea7] flex-shrink-0' />
                <Button
                  size='sm'
                  variant='outline'
                  onClick={(e) => {
                    e.preventDefault();
                    // Navigate to applications view
                    window.location.href = `/jobs/${job.id}`;
                  }}
                  className='text-xs'
                >
                  <Users size={14} className='mr-1' />
                  View Applications
                </Button>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
