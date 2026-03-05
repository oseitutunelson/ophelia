'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { MoreHorizontal, Loader2 } from 'lucide-react';
import type { Profile, Work } from '@prisma/client';

// only the fields we render are passed down to keep the object serializable
export interface ClientUser {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
}
import { useAuth } from '@clerk/nextjs';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons/Icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useFollow from '@/hooks/use-follow';
import MessageModal from '@/components/modals/message-modal';

interface ProfileHeaderProps {
  user: ClientUser;
  profile: Profile;
  works: Work[];
}

export default function ProfileHeader({
  user,
  profile,
  works
}: ProfileHeaderProps) {
  const { userId: currentUserId } = useAuth();
  const isOwner = currentUserId === user.id;
  const { stats, isFollowing, isLoading: followLoading, follow, unfollow } = useFollow(user.id);
  const [messageModalOpen, setMessageModalOpen] = useState(false);

  const handleFollowToggle = async () => {
    if (isFollowing) {
      await unfollow();
    } else {
      await follow();
    }
  };

  const handleGetInTouch = () => {
    if (!currentUserId) {
      // Redirect to sign in
      window.location.href = '/sign-in';
      return;
    }
    setMessageModalOpen(true);
  };

  return (
    <>
      {/* profile header with no work */}
      {works.length === 0 && (
        <div className='w-full pt-9 pb-7 flex flex-col md:items-center justify-start'>
          <div className='flex flex-col md:flex-row'>
            <Avatar className='h-[84px] w-[84px] md:h-[120px] md:w-[120px]'>
              <AvatarImage src={user.imageUrl} alt='avatar' />
              <AvatarFallback>
                {user.firstName?.charAt(0)}
                {user.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className='flex flex-col md:ml-10'>
              <h1 className='text-3xl font-bold mt-[5px] mb-[10px]'>
                {user.firstName} {user.lastName}
              </h1>
              <p className='mb-2 text-[#9e9ea7]'>{profile.bio}</p>
              <div className='mt-[14px] flex space-x-3'>
                <Button
                  onClick={handleGetInTouch}
                  className='rounded-full h-12 px-6 font-semibold hover:opacity-80'
                >
                  Get in touch
                </Button>
                {isOwner && (
                  <Button
                    variant='outline'
                    className='rounded-full h-12 px-6 font-semibold shadow-none hover:bg-transparent hover:border-[#dbdbde]'
                    asChild
                  >
                    <Link href='/account'>Edit Profile</Link>
                  </Button>
                )}
                {!isOwner && (
                  <Button
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    variant='outline'
                    className='rounded-full h-12 px-6 font-semibold shadow-none hover:bg-transparent hover:border-[#dbdbde]'
                  >
                    {followLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                )}
                <Button
                  size='icon'
                  variant='outline'
                  className='rounded-full h-12 w-12 p-0 font-semibold shadow-none hover:bg-transparent hover:border-[#dbdbde]'
                >
                  <MoreHorizontal className='w-5 h-5' />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* profile header with work */}
      {works.length > 0 && (
        <div className='my-5 w-full flex flex-col md:flex-row justify-between gap-[42px] md:gap-[60px]'>
          <div className='w-full flex justify-end grow max-w-[722px] md:order-2'>
            <div className='relative'>
              <Image
                src={works[0].image}
                alt={works[0].title}
                width={578}
                height={364}
                className='w-full max-w-[578px] h-auto object-cover object-center rounded-3xl'
              />
              <Icons.probadge className='absolute -bottom-[50px] right-[10px] md:top-[8%] md:-left-[50px] lg:-left-[68px] text-[#6e6d7a] w-[100px] lg:w-[135px] h-auto' />
            </div>
          </div>
          <div className='flex flex-col'>
            <Avatar className='h-[84px] w-[84px] mb-6'>
              <AvatarImage src={user.imageUrl} alt='avatar' />
              <AvatarFallback>
                {user.firstName?.charAt(0)}
                {user.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h1 className='text-xl font-medium lg:text-3xl lg:font-bold mb-3'>
              {user.firstName} {user.lastName}
            </h1>
            <h2 className='text-2xl lg:text-5xl font-bold'>{profile.bio}</h2>
            <div className='flex gap-3 lg:gap-6 text-[#6e6d7a] mt-4 text-sm lg:text-base'>
              <p className='hover:text-[#3d3d4e] transition-colors'>
                {stats ? stats.followers.toLocaleString() : '0'} followers
              </p>
              <p className='hover:text-[#3d3d4e] transition-colors'>
                {stats ? stats.following.toLocaleString() : '0'} following
              </p>
              <p>{stats ? stats.likes.toLocaleString() : '0'} likes</p>
            </div>
            <div className='mt-6 flex space-x-3'>
              <Button
                onClick={handleGetInTouch}
                className='rounded-full h-12 px-6 font-semibold hover:opacity-80'
              >
                Get in touch
              </Button>
              {isOwner ? (
                <Button
                  variant='outline'
                  className='rounded-full h-12 px-6 font-semibold shadow-none hover:bg-transparent hover:border-[#dbdbde]'
                  asChild
                >
                  <Link href='/account'>Edit Profile</Link>
                </Button>
              ) : (
                <Button
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                  variant='outline'
                  className='rounded-full h-12 px-6 font-semibold shadow-none hover:bg-transparent hover:border-[#dbdbde]'
                >
                  {followLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
              )}
              <Button
                size='icon'
                variant='outline'
                className='rounded-full h-12 w-12 p-0 font-semibold shadow-none hover:bg-transparent hover:border-[#dbdbde]'
              >
                <MoreHorizontal className='w-5 h-5' />
              </Button>
            </div>
          </div>
        </div>
      )}
      <MessageModal
        isOpen={messageModalOpen}
        onClose={() => setMessageModalOpen(false)}
        recipientId={user.id}
        recipientName={`${user.firstName} ${user.lastName}`}
      />
    </>
  );
}
