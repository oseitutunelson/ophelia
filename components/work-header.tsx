'use client';

import Link from 'next/link';
import { useIntersectionObserver } from '@uidotdev/usehooks';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import useGetProfile from '@/hooks/use-get-profile';
import { Skeleton } from '@/components/ui/skeleton';
import { BookmarkIcon, HeartIcon, Mail } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface WorkHeaderProps {
  userId: string;
  title: string;
  workId?: string;
}

export default function WorkHeader({ userId, title, workId }: WorkHeaderProps) {
  const { data, isLoading } = useGetProfile({ userId });
  const [likesCount, setLikesCount] = useState<number | null>(null);
  const [bookmarksCount, setBookmarksCount] = useState<number | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (!workId) return;
    let mounted = true;
    (async () => {
      try {
        const res = await axios.get(`/api/work/${workId}/meta`);
        if (res.data?.success && mounted) {
          setLikesCount(res.data.likesCount ?? 0);
          setBookmarksCount(res.data.bookmarksCount ?? 0);
          setIsLiked(!!res.data.isLiked);
          setIsBookmarked(!!res.data.isBookmarked);
        }
      } catch (err) {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, [workId]);

  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: '0px'
  });

  return (
    <>
      <div ref={ref} className='flex justify-center'>
        <h1 className='w-full max-w-5xl text-start text-2xl font-semibold mb-[10px] pt-8 lg:pt-16 px-4 lg:px-0'>
          {title}
        </h1>
      </div>
      <div
        className={cn(
          'sticky top-0 z-10 flex justify-center',
          entry !== null && entry.intersectionRect.top === 0 && 'lg:border-b',
          entry !== null && entry.intersectionRatio === 0 && 'max-lg:border-b'
        )}
      >
        <div className='w-full max-w-5xl flex justify-between items-center pt-[14px] pb-[10px] px-4 lg:px-0 bg-white'>
          <div className='flex items-center gap-3'>
            {isLoading && (
              <Skeleton className='h-8 w-8 md:h-12 md:w-12 rounded-full' />
            )}
            {!isLoading && data && data.user && data.profile && (
              <Link href={`/${data.profile.username}`}>
                <Avatar className='h-8 w-8 md:h-12 md:w-12'>
                  <AvatarImage src={data.user.imageUrl} alt='avatar' />
                  <AvatarFallback>
                    {data.user.firstName?.charAt(0)}
                    {data.user.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}
            <div className='flex flex-col gap-1'>
              {isLoading && (
                <>
                  <Skeleton className='w-28 h-4' />
                  <div className='flex gap-[10px] items-center'>
                    <Skeleton className='w-28 h-3' />
                    <Skeleton className='hidden lg:block w-10 h-3' />
                  </div>
                </>
              )}
              {!isLoading && data && data.user && data.profile && (
                <>
                  <Link
                    href={`/${data.profile.username}`}
                    className='font-semibold text-xs md:text-sm'
                  >
                    <p>
                      {data.user.firstName} {data.user.lastName}
                    </p>
                  </Link>
                  <div className='flex gap-[10px] items-center'>
                    <div className='flex items-center'>
                      <span className='relative flex justify-center items-center h-3 w-3 mr-1'>
                        <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75'></span>
                        <span className='relative inline-flex rounded-full h-2 w-2 bg-green-600'></span>
                      </span>
                      <p className='text-green-600 text-xs font-medium'>
                        Available for work
                      </p>
                    </div>
                    <p className='hidden lg:block text-xs font-medium text-muted-foreground hover:cursor-pointer hover:font-semibold'>
                      Follow
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <button
              type='button'
              onClick={async () => {
                if (!workId) return;
                try {
                  const res = await axios.post(`/api/work/${workId}/like`);
                  if (res.data?.success) {
                    setLikesCount(res.data.likesCount ?? 0);
                    setIsLiked(!!res.data.liked);
                  }
                } catch (err) {
                  console.error(err);
                }
              }}
              className='rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border'
              aria-label='Like'
            >
              <HeartIcon size={16} className={isLiked ? 'text-red-500' : ''} />
            </button>
            <button
              type='button'
              onClick={async () => {
                if (!workId) return;
                try {
                  const res = await axios.post(`/api/work/${workId}/bookmark`);
                  if (res.data?.success) {
                    setBookmarksCount(res.data.bookmarksCount ?? 0);
                    setIsBookmarked(!!res.data.bookmarked);
                  }
                } catch (err) {
                  console.error(err);
                }
              }}
              className='rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border'
              aria-label='Bookmark'
            >
              <BookmarkIcon size={16} className={isBookmarked ? 'text-red-500' : ''} />
            </button>
            <Button className='rounded-full h-8 max-md:w-8 px-2 py-1 md:h-10 md:py-2 md:px-4'>
              <p className='hidden md:block'>Get in touch</p>
              <Mail className='w-4 h-4 md:hidden' />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
