'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, ExternalLink, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';

interface Application {
  id: string;
  message: string;
  workId?: string;
  portfolioUrl?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    imageUrl: string | null;
  };
  work?: {
    id: string;
    title: string;
    image: string;
    liveSiteUrl: string;
  };
}

interface JobApplicationsListProps {
  jobId: string;
}

export default function JobApplicationsList({ jobId }: JobApplicationsListProps) {
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`/api/job/${jobId}/applications`);
      if (res.data?.success) {
        setApplications(res.data.applications);
      }
    } catch (err: any) {
      console.error('Failed to fetch applications:', err);
      toast({
        title: 'Error',
        description: 'Failed to load applications',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateApplicationStatus = async (
    applicationId: string,
    status: 'accepted' | 'rejected'
  ) => {
    setUpdatingId(applicationId);
    try {
      const res = await axios.patch(`/api/job/${jobId}/applications`, {
        applicationId,
        status
      });

      if (res.data?.success) {
        setApplications(
          applications.map((app) =>
            app.id === applicationId ? { ...app, status } : app
          )
        );
        toast({
          title: 'Success',
          description: `Application ${status}`
        });
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Failed to update application',
        variant: 'destructive'
      });
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return <div className='text-center py-8 text-[#9e9ea7]'>Loading applications...</div>;
  }

  if (applications.length === 0) {
    return (
      <div className='text-center py-12'>
        <p className='text-[#9e9ea7] text-lg'>No applications yet</p>
        <p className='text-sm text-[#9e9ea7]'>Check back later for applicants</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold text-[#3d3d4e]'>Applications ({applications.length})</h2>

      <div className='space-y-4'>
        {applications.map((app) => (
          <div
            key={app.id}
            className='border border-[#e7e7e9] rounded-lg p-6 hover:shadow-md transition-shadow'
          >
            {/* Applicant Info */}
            <div className='flex items-start justify-between mb-4'>
              <Link
                href={`/${app.user.firstName}${app.user.lastName}`}
                className='flex items-center gap-3 hover:opacity-80'
              >
                <Avatar className='h-10 w-10'>
                  <AvatarImage src={app.user.imageUrl || ''} />
                  <AvatarFallback>
                    {app.user.firstName?.charAt(0)}
                    {app.user.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className='font-semibold text-[#3d3d4e]'>
                    {app.user.firstName} {app.user.lastName}
                  </p>
                  <p className='text-xs text-[#9e9ea7]'>
                    {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>

              {/* Status Badge */}
              <div>
                {app.status === 'pending' && (
                  <span className='px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium'>
                    Pending
                  </span>
                )}
                {app.status === 'accepted' && (
                  <span className='px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium'>
                    Accepted
                  </span>
                )}
                {app.status === 'rejected' && (
                  <span className='px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium'>
                    Rejected
                  </span>
                )}
              </div>
            </div>

            {/* Message */}
            <div className='mb-4'>
              <p className='text-sm font-medium text-[#3d3d4e] mb-2'>Message:</p>
              <p className='text-[#9e9ea7] text-sm whitespace-pre-wrap'>{app.message}</p>
            </div>

            {/* Shared Work */}
            {app.work && (
              <div className='mb-4 p-4 bg-[#f5f5f7] rounded-lg'>
                <p className='text-sm font-medium text-[#3d3d4e] mb-3'>Their Project:</p>
                <div className='flex gap-3'>
                  {app.work.image && (
                    <div className='relative h-20 w-20 rounded overflow-hidden flex-shrink-0'>
                      <Image
                        src={app.work.image}
                        alt={app.work.title}
                        fill
                        className='object-cover'
                      />
                    </div>
                  )}
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-semibold text-[#3d3d4e] truncate'>
                      {app.work.title}
                    </p>
                    <Link
                      href={app.work.liveSiteUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1'
                    >
                      View Project <ExternalLink size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Portfolio Link */}
            {app.portfolioUrl && (
              <div className='mb-4 p-4 bg-[#f5f5f7] rounded-lg'>
                <p className='text-sm font-medium text-[#3d3d4e] mb-2'>Portfolio:</p>
                <Link
                  href={app.portfolioUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sm text-blue-600 hover:underline flex items-center gap-2 break-all'
                >
                  {app.portfolioUrl} <ExternalLink size={14} />
                </Link>
              </div>
            )}

            {/* Action Buttons */}
            {app.status === 'pending' && (
              <div className='flex gap-2'>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => updateApplicationStatus(app.id, 'accepted')}
                  disabled={updatingId !== null}
                  className='flex-1'
                >
                  {updatingId === app.id && <Loader2 className='mr-1 h-3 w-3 animate-spin' />}
                  <Check size={16} className='mr-1' />
                  Accept
                </Button>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => updateApplicationStatus(app.id, 'rejected')}
                  disabled={updatingId !== null}
                  className='flex-1'
                >
                  {updatingId === app.id && <Loader2 className='mr-1 h-3 w-3 animate-spin' />}
                  <X size={16} className='mr-1' />
                  Reject
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
