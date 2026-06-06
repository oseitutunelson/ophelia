import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { currentUser } from '@clerk/nextjs';
import AccountCampaignsList from '@/components/account-campaigns-list';

export const metadata: Metadata = {
  title: 'My Campaigns | Ophelia Account',
};

export default async function AccountCampaignsPage() {
  const user = await currentUser();
  if (!user) notFound();

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
        <div className='max-w-[1152px] mx-auto px-6 flex overflow-x-auto scrollbar-hide'>
          <Link
            href='/account'
            className='inline-flex items-center h-12 px-5 text-luxury-label tracking-luxury text-lux-muted hover:text-lux-mid border-b-2 border-transparent transition-colors duration-200'
          >
            Account
          </Link>
          <Link
            href='/account/bookmarks'
            className='inline-flex items-center h-12 px-5 text-luxury-label tracking-luxury text-lux-muted hover:text-lux-mid border-b-2 border-transparent transition-colors duration-200'
          >
            Saved Works
          </Link>
          <Link
            href='/account/campaigns'
            className='inline-flex items-center h-12 px-5 text-luxury-label tracking-luxury text-lux-black border-b-2 border-lux-black -mb-px'
          >
            My Campaigns
          </Link>
        </div>
        <div className='divider-gold mx-6' />
      </div>

      {/* ── Campaigns content ───────────────────────────────── */}
      <div className='max-w-[1152px] mx-auto px-6 py-10'>
        <div className='flex items-end justify-between mb-8'>
          <div>
            <p className='text-luxury-label tracking-luxury text-gold mb-1'>Advertising</p>
            <h2 className='font-display text-2xl text-lux-black'>My Campaigns</h2>
            <p className='text-lux-muted text-sm mt-1'>
              Manage your active promotions and track performance.
            </p>
          </div>
          <Link
            href='/advertise'
            className='hidden sm:flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-lux-mid border border-lux-border px-5 py-2.5 hover:bg-lux-hover hover:text-lux-black transition-colors'
          >
            Advertising Hub
          </Link>
        </div>

        <AccountCampaignsList />
      </div>
    </div>
  );
}
