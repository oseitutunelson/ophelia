"use client";

import Link from 'next/link';
import { Job } from '@prisma/client';
import { MapPin, DollarSign, Briefcase, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useState } from 'react';
import Image from 'next/image';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import useGetProfile from '@/hooks/use-get-profile';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@clerk/nextjs';

interface JobCardProps {
  job: Job;
  onDelete?: () => void;
}

export default function JobCard({ job, onDelete }: JobCardProps) {
  const { data, isLoading } = useGetProfile({ userId: job.userId });
  const { userId: currentUserId } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const isUserJob = currentUserId === job.userId;

  const handleDelete = async () => {
    if (!isUserJob) return;
    setIsDeleting(true);
    try {
      const res = await axios.delete(`/api/job/${job.id}`);
      if (res.data?.success) {
        onDelete?.();
      }
    } catch (err) {
      console.error('Failed to delete job:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className='border border-[#e7e7e9] rounded-lg p-6 hover:shadow-md transition-shadow'>
      <div className='flex justify-between items-start mb-4'>
        <div className='flex-1'>
          <h3 className='text-lg font-semibold text-[#3d3d4e] mb-2'>{job.title}</h3>
          <p className='text-sm text-[#9e9ea7] line-clamp-2'>{job.description}</p>
        </div>
        {isUserJob && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className='ml-4 p-2 hover:bg-red-50 rounded-lg transition-colors'
            aria-label='Delete job'
          >
            <Trash2 size={18} className='text-red-500' />
          </button>
        )}
      </div>

      <div className='grid grid-cols-2 gap-4 mb-4'>
        <div className='flex items-center gap-2'>
          <Briefcase size={16} className='text-[#9e9ea7]' />
          <span className='text-sm text-[#3d3d4e]'>{job.jobType}</span>
        </div>
        {job.location && (
          <div className='flex items-center gap-2'>
            <MapPin size={16} className='text-[#9e9ea7]' />
            <span className='text-sm text-[#3d3d4e]'>{job.location}</span>
          </div>
        )}
        {job.salary && (
          <div className='flex items-center gap-2'>
            <DollarSign size={16} className='text-[#9e9ea7]' />
            <span className='text-sm text-[#3d3d4e]'>{job.salary}</span>
          </div>
        )}
        {job.experience && (
          <div className='flex items-center gap-2 text-sm'>
            <span className='px-2 py-1 bg-[#f5f5f7] rounded text-[#3d3d4e]'>
              {job.experience}
            </span>
          </div>
        )}
      </div>

      <div className='mb-4'>
        <span className='inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium'>
          {job.category}
        </span>
      </div>

      {job.image && (
        <div className='relative h-40 mb-4 rounded-lg overflow-hidden'>
          <Image
            src={job.image}
            alt={job.title}
            fill
            className='object-cover'
          />
        </div>
      )}

      <div className='flex justify-between items-center pt-4 border-t border-[#e7e7e9]'>
        <div className='flex items-center gap-2'>
          {isLoading && (
            <div className='flex items-center gap-2'>
              <Skeleton className='rounded-full h-8 w-8' />
              <Skeleton className='w-32 h-4' />
            </div>
          )}
          {!isLoading && data?.profile && data?.user && (
            <Link
              href={`/${data.profile.username}`}
              className='flex items-center gap-2 hover:opacity-80'
            >
              <Avatar className='h-8 w-8'>
                <AvatarImage src={data.user.imageUrl} alt='avatar' />
                <AvatarFallback>
                  {data.user.firstName?.charAt(0)}
                  {data.user.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className='text-sm font-medium text-[#3d3d4e]'>
                {data.user.firstName} {data.user.lastName}
              </span>
            </Link>
          )}
        </div>
        <Button
          className='rounded-full h-9 px-6 font-semibold hover:opacity-80'
          asChild
        >
          <Link href={`/jobs/${job.id}`}>View Details</Link>
        </Button>
      </div>
    </div>
  );
}
