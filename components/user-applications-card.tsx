'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Loader2 } from 'lucide-react';

import { useToast } from '@/components/ui/use-toast';

interface UserApplication {
  id: string;
  jobId: string;
  message: string;
  workId?: string;
  portfolioUrl?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  job: {
    id: string;
    title: string;
    image?: string;
  };
}

export default function UserApplicationsCard() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<UserApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/profile/my-applications');
      if (res.data?.success) {
        setApplications(res.data.applications);
      }
    } catch (err: any) {
      console.error('Failed to fetch applications:', err);
      toast({
        title: 'Error',
        description: 'Failed to load your applications',
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

  if (applications.length === 0) {
    return (
      <div className='text-center py-12'>
        <p className='text-[#9e9ea7]'>You haven't applied to any jobs yet</p>
        <Link href='/jobs' className='text-blue-600 hover:underline mt-2 inline-block'>
          View all jobs
        </Link>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-bold text-[#3d3d4e]'>My Applications</h2>
      <div className='space-y-3'>
        {applications.map((app) => (
          <div
            key={app.id}
            className='border border-[#e7e7e9] rounded-lg p-4 hover:shadow-md transition-shadow'
          >
            <Link href={`/jobs/${app.jobId}`} className='flex gap-4 hover:opacity-80'>
              {app.job.image && (
                <div className='relative h-24 w-24 rounded overflow-hidden flex-shrink-0'>
                  <Image
                    src={app.job.image}
                    alt={app.job.title}
                    fill
                    className='object-cover'
                  />
                </div>
              )}
              <div className='flex-1 min-w-0'>
                <h3 className='font-semibold text-[#3d3d4e]'>{app.job.title}</h3>
                <p className='text-xs text-[#9e9ea7] mt-1'>
                  Applied {new Date(app.createdAt).toLocaleDateString()}
                </p>
                <div className='mt-2'>
                  {app.status === 'pending' && (
                    <span className='px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium'>
                      Pending
                    </span>
                  )}
                  {app.status === 'accepted' && (
                    <span className='px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium'>
                      Accepted
                    </span>
                  )}
                  {app.status === 'rejected' && (
                    <span className='px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium'>
                      Rejected
                    </span>
                  )}
                </div>
              </div>
              <ExternalLink size={18} className='text-[#9e9ea7] flex-shrink-0' />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
