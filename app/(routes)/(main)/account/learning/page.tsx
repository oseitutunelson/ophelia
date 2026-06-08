import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import AccountLearningList from '@/components/account-learning-list';

export const metadata: Metadata = {
  title: 'My Learning | Ophelia',
  description: 'Track your enrolled courses, certificates, and learning progress.',
};

export default async function AccountLearningPage() {
  const { userId } = auth();
  if (!userId) redirect('/sign-in');

  return (
    <div className='min-h-screen pt-[72px]'>
      {/* Header */}
      <div className='bg-gradient-to-b from-[#f0ebe2] to-[hsl(var(--background))]'>
        <div className='max-w-[1152px] mx-auto px-6 pt-10 pb-8'>
          <div className='flex items-center gap-3 mb-5'>
            <div className='h-px w-10 bg-[#c9a96e]/50' />
            <span className='text-luxury-label text-[#c9a96e] tracking-luxury'>Your Account</span>
            <div className='h-px w-10 bg-[#c9a96e]/50' />
          </div>
          <h1 className='font-display text-4xl font-bold text-lux-black leading-tight'>Account Settings</h1>
          <p className='text-lux-mid text-sm mt-2'>Manage your profile, security, and saved works.</p>
        </div>
      </div>

      {/* Tab nav */}
      <div className='border-b border-lux-border'>
        <div className='max-w-[1152px] mx-auto px-6 flex overflow-x-auto scrollbar-hide'>
          {[
            { href: '/account',           label: 'Account' },
            { href: '/account/bookmarks', label: 'Saved Works' },
            { href: '/account/campaigns', label: 'My Campaigns' },
            { href: '/account/learning',  label: 'My Learning' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`inline-flex items-center h-12 px-5 text-luxury-label tracking-luxury border-b-2 -mb-px transition-colors duration-200 ${
                href === '/account/learning'
                  ? 'text-lux-black border-lux-black'
                  : 'text-lux-muted hover:text-lux-mid border-transparent'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className='divider-gold mx-6' />
      </div>

      {/* Content */}
      <div className='max-w-[1152px] mx-auto px-6 py-10'>
        <AccountLearningList />
      </div>
    </div>
  );
}
