"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BookmarkIcon, MessageCircleIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

interface Work {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  createdAt: string;
}

interface TalentCardProps {
  userId: string;
  username: string;
  bio?: string;
  works: Work[];
  profilePicture?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export default function TalentCard({
  userId,
  username,
  bio,
  works,
  profilePicture,
  githubUrl,
  linkedinUrl
}: TalentCardProps) {
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarking, setIsBookmarking] = useState(false);

  useEffect(() => {
    const checkBookmark = async () => {
      try {
        const res = await axios.get(`/api/profile-bookmarks/${userId}`);
        if (res.data?.success) {
          setIsBookmarked(res.data.isBookmarked);
        }
      } catch (err) {
        console.error('Failed to check bookmark:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkBookmark();
  }, [userId]);

  const handleBookmark = async () => {
    try {
      setIsBookmarking(true);

      if (isBookmarked) {
        // Remove bookmark
        const res = await axios.delete(`/api/profile-bookmarks/${userId}`);
        if (res.data?.success) {
          setIsBookmarked(false);
          toast({
            description: 'Removed from bookmarks'
          });
        }
      } else {
        // Add bookmark
        const res = await axios.post('/api/profile-bookmarks', {
          talentId: userId
        });
        if (res.data?.success) {
          setIsBookmarked(true);
          toast({
            description: 'Added to bookmarks'
          });
        }
      }
    } catch (err: any) {
      console.error('Failed to toggle bookmark:', err);
      toast({
        description:
          err.response?.data?.error || 'Something went wrong',
        variant: 'destructive'
      });
    } finally {
      setIsBookmarking(false);
    }
  };

  if (isLoading) {
    return (
      <div className='border border-[#e7e7e9] rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300'>
        <Skeleton className='h-48 w-full' />
        <div className='p-4 space-y-3'>
          <Skeleton className='h-4 w-1/2' />
          <Skeleton className='h-3 w-full' />
          <div className='grid grid-cols-3 gap-2'>
            <Skeleton className='h-16' />
            <Skeleton className='h-16' />
            <Skeleton className='h-16' />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='border border-[#e7e7e9] rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full'>
      {/* Featured Work Image */}
      {works.length > 0 && (
        <div className='relative h-56 w-full overflow-hidden bg-gray-100'>
          <Image
            src={works[0].image}
            alt={works[0].title}
            fill
            className='object-cover hover:scale-105 transition-transform duration-300'
          />
        </div>
      )}

      {/* Card Content */}
      <div className='p-4 flex-1 flex flex-col'>
        {/* Profile Info */}
        <div className='flex items-start justify-between mb-4'>
          <Link
            href={`/profile/${username}`}
            className='flex items-center gap-3 hover:opacity-80 transition-opacity flex-1'
          >
            <Avatar className='h-12 w-12'>
              {profilePicture && (
                <AvatarImage src={profilePicture} alt={username} />
              )}
              <AvatarFallback className='bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold'>
                {username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className='flex-1 min-w-0'>
              <h3 className='font-semibold text-sm truncate'>{username}</h3>
              <p className='text-xs text-[#9e9ea7]'>Verified Designer</p>
            </div>
          </Link>

          <button
            onClick={handleBookmark}
            disabled={isBookmarking}
            className={`flex-shrink-0 ml-2 transition-colors ${
              isBookmarked
                ? 'text-yellow-500'
                : 'text-[#9e9ea7] hover:text-yellow-500'
            }`}
          >
            <BookmarkIcon
              className='w-5 h-5'
              fill={isBookmarked ? 'currentColor' : 'none'}
            />
          </button>
        </div>

        {/* Bio */}
        {bio && (
          <p className='text-sm text-[#6d6d78] mb-3 line-clamp-2 flex-shrink-0'>
            {bio}
          </p>
        )}

        {/* Portfolio Works */}
        {works.length > 0 && (
          <div className='mb-4 flex-1'>
            <p className='text-xs font-semibold text-[#3d3d4e] mb-2'>
              Featured Works ({works.length})
            </p>
            <div className='grid grid-cols-3 gap-2'>
              {works.map(work => (
                <Link
                  key={work.id}
                  href={`/work/${work.id}`}
                  className='relative group aspect-square rounded overflow-hidden bg-gray-100'
                >
                  <Image
                    src={work.image}
                    alt={work.title}
                    fill
                    className='object-cover group-hover:scale-110 transition-transform duration-300'
                  />
                  <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center'>
                    <span className='text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity'>
                      {work.category}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className='flex gap-2 mt-auto'>
          <Button
            variant='outline'
            size='sm'
            className='flex-1 rounded-full border-[#e7e7e9] hover:bg-transparent'
            asChild
          >
            <Link href={`/messages?user=${userId}`}>
              <MessageCircleIcon className='w-4 h-4 mr-2' />
              Contact
            </Link>
          </Button>
          <Button
            size='sm'
            className='flex-1 rounded-full'
            asChild
          >
            <Link href={`/${username}`}>View Profile</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
