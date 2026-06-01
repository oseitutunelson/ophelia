'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { MoreHorizontal, Loader2, ArrowRight, Pencil } from 'lucide-react';
import type { Profile, Work } from '@prisma/client';
import { useAuth } from '@clerk/nextjs';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useFollow from '@/hooks/use-follow';
import MessageModal from '@/components/modals/message-modal';
import ProBadge from '@/components/pro-badge';

export interface ClientUser {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
  publicMetadata?: Record<string, unknown>;
}

interface ProfileHeaderProps {
  user: ClientUser;
  profile: Profile;
  works: Work[];
}

const isProUser    = (u: ClientUser) => !!(u.publicMetadata?.isPro || u.publicMetadata?.isAgencyPro);
const isAgencyUser = (u: ClientUser) => !!u.publicMetadata?.isAgencyPro;

export default function ProfileHeader({ user, profile, works }: ProfileHeaderProps) {
  const { userId: currentUserId } = useAuth();
  const isOwner = currentUserId === user.id;
  const { stats, isFollowing, isLoading: followLoading, follow, unfollow } = useFollow(user.id);
  const [messageModalOpen, setMessageModalOpen] = useState(false);

  const handleFollowToggle = () => (isFollowing ? unfollow() : follow());

  const handleGetInTouch = () => {
    if (!currentUserId) { window.location.href = '/sign-in'; return; }
    setMessageModalOpen(true);
  };

  const statsRow = (
    <div className='flex items-center gap-6'>
      <span className='text-luxury-label tracking-luxury text-lux-muted'>
        <span className='font-display text-lg font-bold text-lux-black mr-1.5'>
          {stats ? stats.followers.toLocaleString() : '0'}
        </span>
        Followers
      </span>
      <div className='h-3 w-px bg-lux-border' />
      <span className='text-luxury-label tracking-luxury text-lux-muted'>
        <span className='font-display text-lg font-bold text-lux-black mr-1.5'>
          {stats ? stats.following.toLocaleString() : '0'}
        </span>
        Following
      </span>
      <div className='h-3 w-px bg-lux-border' />
      <span className='text-luxury-label tracking-luxury text-lux-muted'>
        <span className='font-display text-lg font-bold text-lux-black mr-1.5'>
          {stats ? stats.likes.toLocaleString() : '0'}
        </span>
        Likes
      </span>
    </div>
  );

  const actionButtons = (
    <div className='flex items-center gap-2.5'>
      {!isOwner && (
        <button
          type='button'
          onClick={handleGetInTouch}
          className='group inline-flex items-center gap-2 bg-lux-black hover:bg-lux-dark text-white px-6 py-2.5 text-luxury-label tracking-luxury font-semibold transition-colors duration-300'
        >
          Get in touch
          <ArrowRight size={12} className='transition-transform duration-300 group-hover:translate-x-0.5' />
        </button>
      )}

      {isOwner && (
        <Link
          href='/account'
          className='inline-flex items-center gap-2 border border-lux-border hover:border-lux-black/30 text-lux-mid hover:text-lux-black px-6 py-2.5 text-luxury-label tracking-luxury transition-all duration-300'
        >
          <Pencil size={11} />
          Edit Profile
        </Link>
      )}

      {!isOwner && (
        <button
          type='button'
          onClick={handleFollowToggle}
          disabled={followLoading}
          className={cn(
            'inline-flex items-center gap-2 px-6 py-2.5 text-luxury-label tracking-luxury transition-all duration-300',
            isFollowing
              ? 'border border-lux-black text-lux-black hover:border-lux-border hover:text-lux-mid'
              : 'border border-lux-border hover:border-lux-black/30 text-lux-mid hover:text-lux-black'
          )}
        >
          {followLoading && <Loader2 size={11} className='animate-spin' />}
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      )}

      <button
        type='button'
        aria-label='More options'
        className='w-10 h-10 flex items-center justify-center border border-lux-border hover:border-lux-black/30 text-lux-muted hover:text-lux-black transition-all duration-300'
      >
        <MoreHorizontal size={16} />
      </button>
    </div>
  );

  return (
    <>
      {/* ── No works variant ──────────────────────────────────── */}
      {works.length === 0 && (
        <div className='w-full pt-12 pb-8 flex flex-col gap-6'>
          <div className='flex items-center gap-5'>
            <Avatar className='h-20 w-20 ring-1 ring-lux-border flex-shrink-0'>
              <AvatarImage src={user.imageUrl ?? undefined} alt='avatar' />
              <AvatarFallback className='font-display font-bold text-2xl bg-lux-hover text-lux-black'>
                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className='text-luxury-label tracking-luxury text-[#c9a96e] mb-1'>
                @{profile.username}
              </p>
              <h1 className='font-display text-3xl font-bold text-lux-black leading-tight flex items-center gap-2'>
                {user.firstName} {user.lastName}
                {isProUser(user) && (
                  <ProBadge isAgency={isAgencyUser(user)} size='md' />
                )}
              </h1>
            </div>
          </div>

          {profile.bio && (
            <p className='text-lux-mid leading-relaxed max-w-[540px]'>{profile.bio}</p>
          )}

          {statsRow}
          {actionButtons}
        </div>
      )}

      {/* ── Has works variant ─────────────────────────────────── */}
      {works.length > 0 && (
        <div className='w-full pt-10 pb-8 flex flex-col lg:flex-row items-start gap-10 lg:gap-16'>

          {/* Left: identity */}
          <div className='flex flex-col gap-6 flex-shrink-0 lg:max-w-[340px]'>
            <div className='flex items-center gap-4'>
              <Avatar className='h-16 w-16 ring-1 ring-lux-border flex-shrink-0'>
                <AvatarImage src={user.imageUrl ?? undefined} alt='avatar' />
                <AvatarFallback className='font-display font-bold text-xl bg-lux-hover text-lux-black'>
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className='text-luxury-label tracking-luxury text-[#c9a96e] mb-0.5'>
                  @{profile.username}
                </p>
                <h1 className='font-display text-2xl font-bold text-lux-black leading-tight flex items-center gap-2'>
                  {user.firstName} {user.lastName}
                  {isProUser(profile) && (
                    <ProBadge isAgency={isAgencyUser(profile)} size='md' />
                  )}
                </h1>
              </div>
            </div>

            {profile.bio && (
              <p className='font-display text-xl lg:text-2xl font-bold italic text-lux-black leading-snug'>
                {profile.bio}
              </p>
            )}

            {statsRow}
            {actionButtons}
          </div>

          {/* Right: featured work image */}
          <div className='w-full flex-1 min-w-0'>
            <Link href={`/work/${works[0].id}`} scroll={false} className='group block w-full overflow-hidden relative'>
              <div className='relative w-full aspect-[16/9] overflow-hidden bg-[#f0ece5]'>
                <Image
                  src={works[0].image}
                  alt={works[0].title}
                  fill
                  priority
                  className='object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]'
                />
                {/* hover overlay */}
                <div className='absolute inset-0 bg-lux-black/0 group-hover:bg-lux-black/10 transition-colors duration-500' />
                {/* title badge */}
                <div className='absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300'>
                  <span className='inline-block bg-white/90 backdrop-blur-sm text-lux-black text-[10px] tracking-[0.14em] uppercase font-semibold px-3 py-1.5'>
                    {works[0].title}
                  </span>
                </div>
              </div>
              {/* gold accent line */}
              <div className='divider-gold mt-0' />
            </Link>
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
