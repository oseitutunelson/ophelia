import Link from 'next/link';
import { format } from 'date-fns';
import { Profile } from '@prisma/client';
import { User } from '@clerk/nextjs/server';
import { AtSign, Github, Linkedin, CalendarDays } from 'lucide-react';
import ProBadge from '@/components/pro-badge';

interface ProfileAboutProps {
  user: User;
  profile: Profile;
}

export default function ProfileAbout({ user, profile }: ProfileAboutProps) {
  return (
    <div className='w-full max-w-[1152px] grid md:grid-cols-3 gap-12 lg:gap-16'>

      {/* ── Main info ─────────────────────────────────────────── */}
      <div className='md:col-span-2 flex flex-col gap-10'>

        <div>
          <p className='text-luxury-label tracking-luxury text-lux-muted mb-3'>Full Name</p>
          <p className='font-display text-2xl font-bold text-lux-black flex items-center gap-2'>
            {user.firstName} {user.lastName}
            {(user.publicMetadata as any)?.isPro && (
              <ProBadge isAgency={!!(user.publicMetadata as any)?.isAgencyPro} size='md' />
            )}
          </p>
        </div>

        <div className='divider-gold' />

        {profile.bio && (
          <div>
            <p className='text-luxury-label tracking-luxury text-lux-muted mb-3'>Biography</p>
            <p className='text-lux-mid leading-relaxed text-[0.95rem]'>{profile.bio}</p>
          </div>
        )}

        <div className='divider-gold' />

        {/* Stats */}
        <div className='grid grid-cols-3 gap-0 border border-lux-border'>
          {[
            { label: 'Followers', value: '—' },
            { label: 'Following', value: '—' },
            { label: 'Likes',     value: '—' },
          ].map(({ label, value }, i, arr) => (
            <div
              key={label}
              className={`p-5 text-center ${i < arr.length - 1 ? 'border-r border-lux-border' : ''}`}
            >
              <div className='font-display text-2xl font-bold text-lux-black mb-1'>{value}</div>
              <div className='text-luxury-label tracking-luxury text-lux-muted'>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Sidebar ───────────────────────────────────────────── */}
      <div className='flex flex-col gap-8'>

        {/* Account info panel */}
        <div className='border border-lux-border p-6 flex flex-col gap-4'>
          <p className='text-luxury-label tracking-luxury text-lux-muted mb-1'>Account</p>

          <div className='flex items-center gap-3'>
            <AtSign size={13} className='text-lux-muted flex-shrink-0' />
            <span className='text-sm text-lux-black font-medium'>{profile.username}</span>
          </div>

          <div className='flex items-center gap-3'>
            <CalendarDays size={13} className='text-lux-muted flex-shrink-0' />
            <span className='text-sm text-lux-mid'>
              Member since {format(new Date(user.createdAt), 'MMM yyyy')}
            </span>
          </div>
        </div>

        {/* Social links */}
        <div className='flex flex-col gap-4'>
          <p className='text-luxury-label tracking-luxury text-lux-muted'>Social</p>

          {profile.githubUrl ? (
            <Link
              href={profile.githubUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-3 group'
            >
              <div className='w-8 h-8 border border-lux-border flex items-center justify-center group-hover:border-lux-black/30 transition-colors duration-200'>
                <Github size={14} className='text-lux-mid group-hover:text-lux-black transition-colors duration-200' />
              </div>
              <span className='text-sm text-lux-mid group-hover:text-lux-black transition-colors duration-200'>
                GitHub
              </span>
            </Link>
          ) : (
            <div className='flex items-center gap-3 opacity-40'>
              <div className='w-8 h-8 border border-lux-border flex items-center justify-center'>
                <Github size={14} className='text-lux-subtle' />
              </div>
              <span className='text-sm text-lux-subtle'>Not linked</span>
            </div>
          )}

          {profile.linkedinUrl ? (
            <Link
              href={profile.linkedinUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-3 group'
            >
              <div className='w-8 h-8 border border-lux-border flex items-center justify-center group-hover:border-lux-black/30 transition-colors duration-200'>
                <Linkedin size={14} className='text-lux-mid group-hover:text-lux-black transition-colors duration-200' />
              </div>
              <span className='text-sm text-lux-mid group-hover:text-lux-black transition-colors duration-200'>
                LinkedIn
              </span>
            </Link>
          ) : (
            <div className='flex items-center gap-3 opacity-40'>
              <div className='w-8 h-8 border border-lux-border flex items-center justify-center'>
                <Linkedin size={14} className='text-lux-subtle' />
              </div>
              <span className='text-sm text-lux-subtle'>Not linked</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
