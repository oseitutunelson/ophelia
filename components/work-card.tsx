'use client';

import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Work } from '@prisma/client';
import { BookmarkIcon, HeartIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons/Icons';
import useGetProfile from '@/hooks/use-get-profile';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface WorkCardProps {
  work: Work;
  isProfile?: boolean;
  isMoreWorks?: boolean;
  isAlsoLikeWorks?: boolean;
}

export default function WorkCard({
  work,
  isProfile,
  isMoreWorks = false,
  isAlsoLikeWorks = false
}: WorkCardProps) {
  const { data, isLoading } = useGetProfile({ userId: work.userId });

  const rand = (min: number, max: number) =>
    (Math.floor(Math.random() * (max - min + 1)) + min).toLocaleString();

  const [likesCount, setLikesCount]       = useState<number | null>(null);
  const [bookmarksCount, setBookmarksCount] = useState<number | null>(null);
  const [isLiked, setIsLiked]             = useState(false);
  const [isBookmarked, setIsBookmarked]   = useState(false);

  useEffect(() => {
    let alive = true;
    axios.get(`/api/work/${work.id}/meta`).then((r) => {
      if (r.data?.success && alive) {
        setLikesCount(r.data.likesCount ?? 0);
        setBookmarksCount(r.data.bookmarksCount ?? 0);
        setIsLiked(!!r.data.isLiked);
        setIsBookmarked(!!r.data.isBookmarked);
      }
    }).catch(() => {});
    return () => { alive = false; };
  }, [work.id]);

  return (
    <div className='work-card-item flex flex-col gap-3'>
      {/* ── image ── */}
      <Link
        href={`/work/${work.id}`}
        scroll={false}
        className={cn(
          'relative w-full overflow-hidden group bg-[#f0ece5]',
          isProfile
            ? 'h-[260px] lg:h-[225px] xl:h-[360px]'
            : 'h-[260px] lg:h-[225px] xl:h-[260px]',
          isMoreWorks && 'h-[260px] xl:h-[200px]'
        )}
      >
        <Image
          src={work.image}
          alt={work.title}
          fill
          sizes='(max-width: 767px) 100vw, (max-width: 1023px) 50vw, (max-width: 1439px) 33vw, 25vw'
          className='object-cover img-zoom'
        />

        {/* hover overlay */}
        <div className='opacity-0 group-hover:opacity-100 absolute inset-0 bg-card-info transition-opacity duration-500 ease-out z-10 p-4 flex items-end'>
          <div className='w-full flex justify-between items-center'>
            <span className='text-white text-sm font-medium w-1/2 truncate leading-tight'>
              {work.title}
            </span>
            <div className='flex items-center gap-1.5'>
              <button
                type='button'
                aria-label='Bookmark'
                onClick={async (e) => {
                  e.preventDefault(); e.stopPropagation();
                  const r = await axios.post(`/api/work/${work.id}/bookmark`).catch(() => null);
                  if (r?.data?.success) {
                    setBookmarksCount(r.data.bookmarksCount ?? 0);
                    setIsBookmarked(!!r.data.bookmarked);
                  }
                }}
                className='w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white border border-white/20 transition-all duration-200'
              >
                <BookmarkIcon
                  size={12}
                  className={isBookmarked ? 'text-gold fill-gold' : 'text-lux-black'}
                />
              </button>
              <button
                type='button'
                aria-label='Like'
                onClick={async (e) => {
                  e.preventDefault(); e.stopPropagation();
                  const r = await axios.post(`/api/work/${work.id}/like`).catch(() => null);
                  if (r?.data?.success) {
                    setLikesCount(r.data.likesCount ?? 0);
                    setIsLiked(!!r.data.liked);
                  }
                }}
                className='w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white border border-white/20 transition-all duration-200'
              >
                <HeartIcon
                  size={12}
                  className={isLiked ? 'text-gold fill-gold' : 'text-lux-black'}
                />
              </button>
            </div>
          </div>
        </div>
      </Link>

      {/* ── meta row ── */}
      {!isProfile && !isMoreWorks && (
        <div className='flex justify-between items-center px-0.5'>
          {isLoading && (
            <div className='flex items-center gap-2'>
              <Skeleton className='rounded-full h-5 w-5 bg-lux-border' />
              <Skeleton className='w-24 h-3.5 bg-lux-border' />
            </div>
          )}
          {!isLoading && data?.user && data?.profile && (
            <Link
              href={`/${data.profile.username}`}
              className='flex items-center gap-2 hover:opacity-70 transition-opacity duration-200'
            >
              <Avatar className='h-5 w-5 ring-1 ring-lux-border'>
                <AvatarImage src={data.user.imageUrl} alt='avatar' />
                <AvatarFallback className='text-[8px] bg-lux-hover text-lux-mid'>
                  {data.user.firstName?.charAt(0)}{data.user.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <p className='text-xs text-lux-mid w-28 truncate'>
                {data.user.firstName} {data.user.lastName}
              </p>
            </Link>
          )}

          {!isAlsoLikeWorks && (
            <div className='flex items-center gap-3'>
              {isLoading ? (
                <Skeleton className='w-8 h-3 bg-lux-border' />
              ) : (
                <div className='flex items-center gap-1.5'>
                  <Icons.heart className={cn('w-3.5 h-3.5 fill-current', isLiked ? 'text-gold' : 'text-lux-subtle')} />
                  <span className='text-[11px] text-lux-subtle'>
                    {likesCount !== null ? likesCount.toLocaleString() : rand(300, 50)}
                  </span>
                </div>
              )}
              {isLoading ? (
                <Skeleton className='w-8 h-3 bg-lux-border' />
              ) : (
                <div className='flex items-center gap-1.5'>
                  <Icons.eye className='w-3.5 h-3.5 fill-current text-lux-subtle' />
                  <span className='text-[11px] text-lux-subtle'>
                    {bookmarksCount !== null ? bookmarksCount.toLocaleString() : rand(10, 1)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
