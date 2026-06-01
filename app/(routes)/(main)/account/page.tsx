import Link from 'next/link';
import { ClerkLoaded, ClerkLoading, UserProfile } from '@clerk/nextjs';

import AccountLoading from '@/components/account-loading';

export default function AccountPage() {
  return (
    <div className='min-h-screen pt-[72px]'>

      {/* ── Hero header ─────────────────────────────────────── */}
      <div className='bg-gradient-to-b from-[#f0ebe2] to-[hsl(var(--background))]'>
        <div className='max-w-[1152px] mx-auto px-6 pt-10 pb-8'>
          <div className='flex items-center gap-3 mb-5'>
            <div className='h-px w-10 bg-[#c9a96e]/50' />
            <span className='text-luxury-label text-[#c9a96e] tracking-luxury'>Your Account</span>
            <div className='h-px w-10 bg-[#c9a96e]/50' />
          </div>
          <h1 className='font-display text-4xl font-bold text-lux-black leading-tight'>
            Account Settings
          </h1>
          <p className='text-lux-mid text-sm mt-2'>
            Manage your profile, security, and saved works.
          </p>
        </div>
      </div>

      {/* ── Tab nav ─────────────────────────────────────────── */}
      <div className='border-b border-lux-border'>
        <div className='max-w-[1152px] mx-auto px-6 flex'>
          <Link
            href='/account'
            className='inline-flex items-center h-12 px-5 text-luxury-label tracking-luxury text-lux-black border-b-2 border-lux-black -mb-px'
          >
            Account
          </Link>
          <Link
            href='/account/bookmarks'
            className='inline-flex items-center h-12 px-5 text-luxury-label tracking-luxury text-lux-muted hover:text-lux-mid border-b-2 border-transparent transition-colors duration-200'
          >
            Saved Works
          </Link>
        </div>
        <div className='divider-gold mx-6' />
      </div>

      {/* ── Clerk UserProfile ───────────────────────────────── */}
      <div className='max-w-[1152px] mx-auto px-6 py-10 my-profile'>
        <ClerkLoading>
          <AccountLoading />
        </ClerkLoading>
        <ClerkLoaded>
          <UserProfile />
        </ClerkLoaded>
      </div>
    </div>
  );
}
