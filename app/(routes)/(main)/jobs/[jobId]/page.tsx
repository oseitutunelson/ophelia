'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Job } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { MapPin, DollarSign, Briefcase, Calendar, Trash2, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import JobApplicationForm from '@/components/job-application-form';
import JobApplicationsList from '@/components/job-applications-list';
import useGetProfile from '@/hooks/use-get-profile';

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params.jobId as string;
  const { userId: currentUserId } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [posterData, setPosterData] = useState<any>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`/api/job/${jobId}`);
        if (res.data?.success && res.data?.job) {
          setJob(res.data.job);
        }
      } catch (err) {
        console.error('Failed to fetch job:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  const { data: profileData } = useGetProfile({ userId: job?.userId || '' });

  useEffect(() => {
    if (profileData?.profile && profileData?.user) {
      setPosterData(profileData);
    }
  }, [profileData]);

  const handleDelete = async () => {
    if (!job) return;
    setIsDeleting(true);
    try {
      const res = await axios.delete(`/api/job/${job.id}`);
      if (res.data?.success) {
        window.location.href = '/jobs';
      }
    } catch (err) {
      console.error('Failed to delete job:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const isOwner = currentUserId === job?.userId;

  if (isLoading) {
    return (
      <div className='min-h-screen bg-white'>
        <div className='max-w-4xl mx-auto px-6 lg:px-10 py-12'>
          <Skeleton className='h-12 w-32 mb-8' />
          <Skeleton className='h-96 w-full mb-8 rounded-lg' />
          <Skeleton className='h-8 w-1/2 mb-4' />
          <Skeleton className='h-4 w-full mb-2' />
          <Skeleton className='h-4 w-full' />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-[#3d3d4e] mb-2'>Job Not Found</h2>
          <p className='text-[#9e9ea7] mb-6'>The job you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href='/jobs'>Back to Jobs</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white'>
      <div className='max-w-4xl mx-auto px-6 lg:px-10 py-12'>
        <Link href='/jobs' className='flex items-center gap-2 text-[#3d3d4e] font-semibold mb-8 hover:opacity-80'>
          <ArrowLeft size={20} />
          Back to Jobs
        </Link>

        {job.image && (
          <div className='relative h-96 rounded-lg overflow-hidden mb-8'>
            <Image
              src={job.image}
              alt={job.title}
              fill
              className='object-cover'
            />
          </div>
        )}

        <div className='flex justify-between items-start mb-8'>
          <div>
            <h1 className='text-4xl font-bold text-[#3d3d4e] mb-4'>{job.title}</h1>
            <span className='inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4'>
              {job.category}
            </span>
          </div>
          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className='p-3 hover:bg-red-50 rounded-lg transition-colors'
              aria-label='Delete job'
            >
              <Trash2 size={20} className='text-red-500' />
            </button>
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-6 bg-[#f5f5f7] rounded-lg'>
          <div className='flex items-center gap-3'>
            <Briefcase size={20} className='text-[#9e9ea7]' />
            <div>
              <p className='text-xs text-[#9e9ea7] uppercase tracking-wide'>Job Type</p>
              <p className='text-lg font-semibold text-[#3d3d4e]'>{job.jobType}</p>
            </div>
          </div>
          {job.location && (
            <div className='flex items-center gap-3'>
              <MapPin size={20} className='text-[#9e9ea7]' />
              <div>
                <p className='text-xs text-[#9e9ea7] uppercase tracking-wide'>Location</p>
                <p className='text-lg font-semibold text-[#3d3d4e]'>{job.location}</p>
              </div>
            </div>
          )}
          {job.salary && (
            <div className='flex items-center gap-3'>
              <DollarSign size={20} className='text-[#9e9ea7]' />
              <div>
                <p className='text-xs text-[#9e9ea7] uppercase tracking-wide'>Salary</p>
                <p className='text-lg font-semibold text-[#3d3d4e]'>{job.salary}</p>
              </div>
            </div>
          )}
          {job.experience && (
            <div className='flex items-center gap-3'>
              <div>
                <p className='text-xs text-[#9e9ea7] uppercase tracking-wide'>Experience</p>
                <p className='text-lg font-semibold text-[#3d3d4e]'>{job.experience}</p>
              </div>
            </div>
          )}
        </div>

        <div className='mb-8'>
          <h2 className='text-2xl font-bold text-[#3d3d4e] mb-4'>Job Description</h2>
          <p className='text-[#3d3d4e] whitespace-pre-wrap leading-relaxed'>{job.description}</p>
        </div>

        <div className='border-t border-[#e7e7e9] pt-8'>
          <h3 className='text-lg font-semibold text-[#3d3d4e] mb-4'>Posted by</h3>
          {posterData?.profile && posterData?.user && (
            <Link
              href={`/${posterData.profile.username}`}
              className='flex items-center gap-4 p-4 border border-[#e7e7e9] rounded-lg hover:shadow-md transition-shadow'
            >
              <Avatar className='h-16 w-16'>
                <AvatarImage src={posterData.user.imageUrl} alt='avatar' />
                <AvatarFallback>
                  {posterData.user.firstName?.charAt(0)}
                  {posterData.user.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className='font-semibold text-[#3d3d4e]'>
                  {posterData.user.firstName} {posterData.user.lastName}
                </p>
                <p className='text-sm text-[#9e9ea7]'>@{posterData.profile.username}</p>
                {posterData.profile.bio && (
                  <p className='text-sm text-[#3d3d4e] mt-1'>{posterData.profile.bio}</p>
                )}
              </div>
            </Link>
          )}
        </div>

        <div className='border-t border-[#e7e7e9] pt-8 mt-8'>
          {!isOwner && <JobApplicationForm jobId={jobId} />}
        </div>

        {isOwner && (
          <div className='border-t border-[#e7e7e9] pt-8 mt-8'>
            <JobApplicationsList jobId={jobId} />
          </div>
        )}
      </div>
    </div>
  );
}
