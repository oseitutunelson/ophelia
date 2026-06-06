'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, Loader2, BarChart2, ArrowRight } from 'lucide-react';
import axios from 'axios';

type Status = 'verifying' | 'success' | 'error';

export default function AdvertiseSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = searchParams.get('session_id');
  const campaignId = searchParams.get('campaign_id');
  const paystackRef = searchParams.get('reference') || searchParams.get('trxref');

  const [status, setStatus] = useState<Status>('verifying');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!campaignId) { setStatus('error'); setErrorMsg('Missing campaign information.'); return; }

    const activate = async () => {
      try {
        if (sessionId) {
          // Stripe flow
          await axios.post('/api/campaigns/activate', { sessionId, campaignId });
        } else if (paystackRef) {
          // Paystack flow
          await axios.post('/api/campaigns/verify/paystack', { reference: paystackRef, campaignId });
        } else {
          setStatus('error');
          setErrorMsg('No payment reference found.');
          return;
        }
        setStatus('success');
        setTimeout(() => router.push('/advertise/dashboard'), 3500);
      } catch (err: unknown) {
        const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
        setErrorMsg(msg || 'Activation failed. Please contact support.');
        setStatus('error');
      }
    };

    activate();
  }, [sessionId, campaignId, paystackRef, router]);

  return (
    <main className='bg-[#0d0d0d] min-h-screen flex items-center justify-center px-5'>
      <div className='text-center max-w-md'>
        {status === 'verifying' && (
          <>
            <Loader2 className='w-16 h-16 text-gold animate-spin mx-auto mb-6' />
            <h1 className='font-display text-3xl text-white mb-3'>Activating Your Campaign…</h1>
            <p className='text-[#6b6b6b] text-sm'>Verifying your payment and launching your campaign. This takes just a moment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className='relative inline-block mb-6'>
              <div className='absolute inset-0 bg-gold/20 blur-2xl rounded-full' />
              <CheckCircle2 className='relative w-20 h-20 text-gold mx-auto' />
            </div>
            <h1 className='font-display text-4xl text-white mb-3'>Campaign Live!</h1>
            <p className='text-[#6b6b6b] text-sm mb-8 leading-relaxed'>
              Your campaign is now active and appearing across the platform. You'll start seeing impressions within minutes.
            </p>
            <p className='text-[#3a3a3a] text-xs mb-6'>Redirecting to your dashboard…</p>
            <Link
              href='/advertise/dashboard'
              className='inline-flex items-center gap-2 px-8 py-3 bg-gold text-[#0d0d0d] text-sm font-bold tracking-wider uppercase hover:bg-gold-warm transition-colors'
            >
              <BarChart2 className='w-4 h-4' /> View Dashboard <ArrowRight className='w-4 h-4' />
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className='w-16 h-16 text-rose-500 mx-auto mb-6' />
            <h1 className='font-display text-3xl text-white mb-3'>Something Went Wrong</h1>
            <p className='text-[#6b6b6b] text-sm mb-8'>{errorMsg}</p>
            <div className='flex flex-col sm:flex-row items-center justify-center gap-3'>
              <Link href='/advertise/new' className='px-6 py-3 bg-gold text-[#0d0d0d] text-sm font-bold tracking-wider uppercase hover:bg-gold-warm transition-colors'>
                Try Again
              </Link>
              <Link href='/advertise/dashboard' className='px-6 py-3 border border-[#2a2a2a] text-[#6b6b6b] text-sm font-semibold hover:border-[#3a3a3a] transition-colors'>
                View Dashboard
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
