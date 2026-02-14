"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Work } from '@prisma/client';
import { BookmarkIcon, HeartIcon } from 'lucide-react';
import axios from 'axios';
import { useEffect, useState } from 'react';

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

  const randomNumber = (min: number, max: number) => {
    return (Math.floor(Math.random() * (max - min + 1)) + min).toLocaleString();
  };

  const [likesCount, setLikesCount] = useState<number | null>(null);
  const [bookmarksCount, setBookmarksCount] = useState<number | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchMeta = async () => {
      try {
        const res = await axios.get(`/api/work/${work.id}/meta`);
        if (res.data?.success && mounted) {
          setLikesCount(res.data.likesCount ?? 0);
          setBookmarksCount(res.data.bookmarksCount ?? 0);
          setIsLiked(!!res.data.isLiked);
          setIsBookmarked(!!res.data.isBookmarked);
        }
      } catch (err) {
        // ignore
      }
    };

    fetchMeta();

    return () => {
      mounted = false;
    };
  }, [work.id]);

  return (
    <div className='flex flex-col gap-2'>
      <Link
        href={`/work/${work.id}`}
        className={cn(
          'relative w-full overflow-hidden group',
          isProfile
            ? 'h-[260px] lg:h-[225px] xl:h-[360px]'
            : 'h-[260px] lg:h-[225px] xl:h-[260px]',
          isMoreWorks && 'h-[260px] xl:h-[200px]'
        )}
        scroll={false}
      >
        <Image
          src={work.image}
          alt={work.title}
          fill
          sizes='(max-width: 767px) 100vw, (max-width: 1023px) 50vw, (max-width: 1439px) 33vw, 25vw'
          className='object-cover rounded-lg contrast-[0.95]'
        />
        <div className='opacity-0 group-hover:opacity-100 group-hover:cursor-pointer absolute top-0 bottom-0 right-0 left-0 p-5 flex z-10 items-end rounded-lg bg-card-info transition-opacity ease-in-out duration-300'>
          <div className='w-full flex justify-between items-center'>
            <div className='text-white font-medium w-1/2 truncate'>
              {work.title}
            </div>
            <div className='flex justify-end'>
                <button
                  type='button'
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    try {
                      const res = await axios.post(`/api/work/${work.id}/bookmark`);
                      if (res.data?.success) {
                        setBookmarksCount(res.data.bookmarksCount ?? 0);
                        setIsBookmarked(!!res.data.bookmarked);
                      }
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                  className='bg-white rounded-full flex justify-center items-center w-10 h-10 ml-3'
                  aria-label='Bookmark'
                >
                  <BookmarkIcon size={16} className={isBookmarked ? 'text-red-500' : ''} />
                </button>

                <button
                  type='button'
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    try {
                      const res = await axios.post(`/api/work/${work.id}/like`);
                      if (res.data?.success) {
                        setLikesCount(res.data.likesCount ?? 0);
                        setIsLiked(!!res.data.liked);
                      }
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                  className='bg-white rounded-full flex justify-center items-center w-10 h-10 ml-3'
                  aria-label='Like'
                >
                  <HeartIcon size={16} className={isLiked ? 'text-red-500' : ''} />
                </button>
            </div>
          </div>
        </div>
      </Link>
      {!isProfile && !isMoreWorks && (
        <div className='flex justify-between items-center'>
          {isLoading && (
            <div className='w-full flex justify-start items-center space-x-2'>
              <Skeleton className='rounded-full h-6 w-6' />
              <Skeleton className='w-1/2 h-5' />
            </div>
          )}
          {!isLoading && data && data.user && data.profile && (
            <Link
              href={`/${data.profile.username}`}
              className='w-full flex justify-start items-center space-x-2'
            >
              <Avatar className='h-6 w-6'>
                <AvatarImage src={data.user.imageUrl} alt='avatar' />
                <AvatarFallback>
                  {data.user.firstName?.charAt(0)}
                  {data.user.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <p className='text-sm font-medium w-1/2 truncate'>
                {data.user.firstName} {data.user.lastName}
              </p>
            </Link>
          )}
          {!isAlsoLikeWorks && (
            <div className='flex items-center gap-2'>
              <div className='flex items-center space-x-[6px]'>
                {isLoading && <Skeleton className='w-10 h-5' />}
                {!isLoading && (
                  <>
                    <Icons.heart className={cn('w-4 h-4 fill-current', isLiked ? 'text-red-500' : 'text-[#9e9ea7]')} />
                    <p className='text-xs font-medium text-[#3d3d4e]'>
                      {likesCount !== null ? likesCount.toLocaleString() : randomNumber(300, 50)}
                    </p>
                  </>
                )}
              </div>
              <div className='flex items-center space-x-[6px]'>
                {isLoading && <Skeleton className='w-10 h-5' />}
                {!isLoading && (
                  <>
                    <Icons.eye className='w-4 h-4 fill-current text-[#9e9ea7]' />
                    <p className='text-xs font-medium text-[#3d3d4e]'>
                      {bookmarksCount !== null ? bookmarksCount.toLocaleString() : randomNumber(10, 1)}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
