"use client";

import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { useState } from 'react';
import { Job } from '@prisma/client';
import { MapPin, Briefcase, DollarSign, Trash2, ArrowRight } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';

import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import useGetProfile from '@/hooks/use-get-profile';

interface JobCardProps {
  job: Job;
  onDelete?: () => void;
}

export default function JobCard({ job, onDelete }: JobCardProps) {
  const { data, isLoading }       = useGetProfile({ userId: job.userId });
  const { userId: currentUserId } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = currentUserId === job.userId;

  const handleDelete = async () => {
    if (!isOwner || isDeleting) return;
    setIsDeleting(true);
    try {
      const r = await axios.delete(`/api/job/${job.id}`);
      if (r.data?.success) onDelete?.();
    } catch { /* noop */ } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={cn(
      'job-card-item group border border-lux-border bg-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
      'hover:shadow-[0_16px_48px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.05)] hover:-translate-y-0.5'
    )}>

      {/* Optional cover image */}
      {job.image && (
        <div className='relative w-full aspect-[21/6] overflow-hidden bg-[#f0ece5]'>
          <Image
            src={job.image}
            alt={job.title}
            fill
            className='object-cover transition-transform duration-700 group-hover:scale-[1.03]'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-lux-black/20 to-transparent' />
        </div>
      )}

      <div className='p-6'>
        {/* Top row: category + delete */}
        <div className='flex items-start justify-between mb-4'>
          <span className='inline-block text-luxury-label tracking-luxury text-[#c9a96e] border border-[#c9a96e]/30 px-3 py-1'>
            {job.category.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </span>

          {isOwner && (
            <button
              type='button'
              onClick={handleDelete}
              disabled={isDeleting}
              aria-label='Delete job'
              className='p-1.5 text-lux-subtle hover:text-red-500 transition-colors duration-200'
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>

        {/* Title + description */}
        <h3 className='font-display text-xl font-bold text-lux-black mb-2 leading-snug'>
          {job.title}
        </h3>
        <p className='text-lux-mid text-sm leading-relaxed line-clamp-2 mb-5'>
          {job.description}
        </p>

        {/* Meta chips */}
        <div className='flex flex-wrap items-center gap-x-5 gap-y-2 mb-5'>
          {job.jobType && (
            <span className='flex items-center gap-1.5 text-luxury-label tracking-luxury text-lux-muted'>
              <Briefcase size={11} />
              {job.jobType}
            </span>
          )}
          {job.location && (
            <span className='flex items-center gap-1.5 text-luxury-label tracking-luxury text-lux-muted'>
              <MapPin size={11} />
              {job.location}
            </span>
          )}
          {job.salary && (
            <span className='flex items-center gap-1.5 text-luxury-label tracking-luxury text-lux-muted'>
              <DollarSign size={11} />
              {job.salary}
            </span>
          )}
          {job.experience && (
            <span className='text-luxury-label tracking-luxury text-lux-muted'>
              {job.experience}
            </span>
          )}
        </div>

        {/* Footer: poster + CTA */}
        <div className='flex items-center justify-between pt-4 border-t border-lux-border'>
          <div className='flex items-center gap-2'>
            {isLoading ? (
              <>
                <Skeleton className='h-7 w-7 rounded-full bg-lux-border' />
                <Skeleton className='h-3 w-28 bg-lux-border' />
              </>
            ) : data?.profile && data?.user ? (
              <Link
                href={`/${data.profile.username}`}
                className='flex items-center gap-2 hover:opacity-70 transition-opacity duration-200'
              >
                <Avatar className='h-7 w-7 ring-1 ring-lux-border'>
                  <AvatarImage src={data.user.imageUrl} alt='avatar' />
                  <AvatarFallback className='text-[9px] bg-lux-hover text-lux-mid'>
                    {data.user.firstName?.charAt(0)}{data.user.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className='text-xs text-lux-mid truncate max-w-[140px]'>
                  {data.user.firstName} {data.user.lastName}
                </span>
              </Link>
            ) : null}
          </div>

          <Link
            href={`/jobs/${job.id}`}
            className='group/btn inline-flex items-center gap-2 bg-lux-black hover:bg-lux-dark text-white px-5 py-2 text-luxury-label tracking-luxury font-semibold transition-colors duration-300'
          >
            View Details
            <ArrowRight size={11} className='transition-transform duration-300 group-hover/btn:translate-x-0.5' />
          </Link>
        </div>
      </div>
    </div>
  );
}
