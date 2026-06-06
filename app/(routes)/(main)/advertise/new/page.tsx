import { Metadata } from 'next';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import AdCampaignWizard from '@/components/ad-campaign-wizard';

export const metadata: Metadata = { title: 'Create Campaign | Ophelia Advertising' };

export default function NewCampaignPage() {
  const { userId } = auth();
  if (!userId) redirect('/sign-in');

  return (
    <main className='bg-[#0d0d0d] min-h-screen pt-24 pb-20'>
      <div className='text-center mb-2 px-5'>
        <p className='text-[11px] font-bold tracking-widest uppercase text-gold mb-2'>New Campaign</p>
        <h1 className='font-display text-4xl lg:text-5xl text-white'>Create Your Ad</h1>
      </div>
      <Suspense>
        <AdCampaignWizard />
      </Suspense>
    </main>
  );
}
