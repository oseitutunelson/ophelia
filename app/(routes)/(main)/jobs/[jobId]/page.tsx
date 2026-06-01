'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Job } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { MapPin, DollarSign, Briefcase, ArrowLeft, Trash2 } from 'lucide-react';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import JobApplicationForm from '@/components/job-application-form';
import JobApplicationsList from '@/components/job-applications-list';
import useGetProfile from '@/hooks/use-get-profile';

function DetailSkeleton() {
  return (
    <div className='min-h-screen pt-[72px]'>
      <div className='max-w-[800px] mx-auto px-6 py-12 space-y-6'>
        <div className='h-4 w-24 shimmer bg-lux-border' />
        <div className='w-full aspect-[16/6] shimmer bg-lux-border' />
        <div className='h-8 w-2/3 shimmer bg-lux-border' />
        <div className='h-4 w-full shimmer bg-lux-border' />
        <div className='h-4 w-5/6 shimmer bg-lux-border' />
      </div>
    </div>
  );
}

export default function JobDetailPage() {
  const params                    = useParams();
  const jobId                     = params.jobId as string;
  const { userId: currentUserId } = useAuth();
  const [job,        setJob]        = useState<Job | null>(null);
  const [isLoading,  setIsLoading]  = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!jobId) return;
    let alive = true;
    setIsLoading(true);
    axios.get(`/api/job/${jobId}`)
      .then((r) => { if (alive && r.data?.success) setJob(r.data.job); })
      .catch(() => {})
      .finally(() => { if (alive) setIsLoading(false); });
    return () => { alive = false; };
  }, [jobId]);

  const { data: posterData } = useGetProfile({ userId: job?.userId ?? '' });
  const isOwner = currentUserId === job?.userId;

  const handleDelete = async () => {
    if (!job || isDeleting) return;
    setIsDeleting(true);
    try {
      const r = await axios.delete(`/api/job/${job.id}`);
      if (r.data?.success) window.location.href = '/jobs';
    } catch { /* noop */ } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <DetailSkeleton />;

  if (!job) {
    return (
      <div className='min-h-screen flex items-center justify-center pt-[72px]'>
        <div className='text-center'>
          <h2 className='font-display text-3xl font-bold text-lux-black mb-3'>Job Not Found</h2>
          <p className='text-lux-mid mb-8'>This position no longer exists or has been removed.</p>
          <Link
            href='/jobs'
            className='text-luxury-label tracking-luxury text-lux-mid hover:text-lux-black border border-lux-border hover:border-lux-black/30 px-6 py-3 transition-all duration-300'
          >
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen pt-[72px]'>

      {/* ── Cover image ─────────────────────────────────────── */}
      {job.image && (
        <div className='relative w-full aspect-[21/6] overflow-hidden bg-[#f0ece5]'>
          <Image src={job.image} alt={job.title} fill className='object-cover' />
          <div className='absolute inset-0 bg-gradient-to-t from-lux-black/30 to-transparent' />
        </div>
      )}

      <div className='max-w-[800px] mx-auto px-6 py-10'>

        {/* Back */}
        <Link
          href='/jobs'
          className='inline-flex items-center gap-2 text-luxury-label tracking-luxury text-lux-muted hover:text-lux-black transition-colors duration-300 mb-8'
        >
          <ArrowLeft size={13} />
          Back to Jobs
        </Link>

        {/* Header */}
        <div className='flex items-start justify-between mb-2'>
          <span className='text-luxury-label tracking-luxury text-[#c9a96e] border border-[#c9a96e]/30 px-3 py-1'>
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
              <Trash2 size={16} />
            </button>
          )}
        </div>

        <h1 className='font-display text-4xl md:text-[3rem] font-bold text-lux-black leading-tight mt-4 mb-8'>
          {job.title}
        </h1>

        {/* Meta panel */}
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-0 border border-lux-border mb-10'>
          {[
            { icon: <Briefcase size={14} />, label: 'Job Type',   value: job.jobType   },
            { icon: <MapPin size={14} />,    label: 'Location',   value: job.location  },
            { icon: <DollarSign size={14} />,label: 'Salary',     value: job.salary    },
            { icon: null,                    label: 'Experience', value: job.experience },
          ].filter((m) => m.value).map((meta, i, arr) => (
            <div
              key={meta.label}
              className={`p-5 ${i < arr.length - 1 ? 'border-r border-lux-border' : ''}`}
            >
              <div className='flex items-center gap-1.5 text-luxury-label tracking-luxury text-lux-muted mb-1.5'>
                {meta.icon}
                {meta.label}
              </div>
              <p className='font-display font-bold text-lux-black text-lg leading-tight'>
                {meta.value}
              </p>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className='mb-12'>
          <h2 className='font-display text-2xl font-bold text-lux-black mb-5'>
            Job Description
          </h2>
          <div className='divider-gold mb-6' />
          <p className='text-lux-mid leading-relaxed whitespace-pre-wrap text-[0.95rem]'>
            {job.description}
          </p>
        </div>

        {/* Posted by */}
        {posterData?.profile && posterData?.user && (
          <div className='mb-12'>
            <p className='text-luxury-label tracking-luxury text-lux-muted mb-4'>Posted by</p>
            <Link
              href={`/${posterData.profile.username}`}
              className='flex items-center gap-4 p-5 border border-lux-border hover:border-lux-black/20 transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]'
            >
              <Avatar className='h-12 w-12 ring-1 ring-lux-border flex-shrink-0'>
                <AvatarImage src={posterData.user.imageUrl} alt='avatar' />
                <AvatarFallback className='bg-lux-hover text-lux-mid font-semibold'>
                  {posterData.user.firstName?.charAt(0)}{posterData.user.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className='font-display font-bold text-lux-black'>
                  {posterData.user.firstName} {posterData.user.lastName}
                </p>
                <p className='text-luxury-label tracking-luxury text-lux-muted mt-0.5'>
                  @{posterData.profile.username}
                </p>
                {posterData.profile.bio && (
                  <p className='text-sm text-lux-mid mt-1.5 line-clamp-1'>{posterData.profile.bio}</p>
                )}
              </div>
            </Link>
          </div>
        )}

        <div className='divider-gold mb-10' />

        {/* Apply / Applications */}
        {!isOwner && <JobApplicationForm jobId={jobId} />}
        {isOwner  && <JobApplicationsList jobId={jobId} />}
      </div>
    </div>
  );
}
