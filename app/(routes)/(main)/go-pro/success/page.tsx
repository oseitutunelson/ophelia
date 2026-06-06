'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';

type State = 'verifying' | 'success' | 'error';

export default function GoProSuccessPage() {
  const { user, isLoaded } = useUser();
  const router             = useRouter();
  const searchParams       = useSearchParams();
  const reference          = searchParams.get('reference') ?? searchParams.get('trxref');

  const [state,    setState]    = useState<State>('verifying');
  const [message,  setMessage]  = useState('');
  const [username, setUsername] = useState<string | null>(null);
  const called = useRef(false);

  const verify = async () => {
    if (!reference) {
      setState('error');
      setMessage('No payment reference found. Please contact support.');
      return;
    }

    setState('verifying');
    try {
      const { data } = await axios.post('/api/subscription/paystack/verify', { reference });

      if (data.success) {
        setUsername(data.username ?? null);
        // Reload Clerk session so publicMetadata.isPro is immediately available
        if (user) await user.reload().catch(() => {});
        setState('success');

        // Auto-redirect to profile after 2.5 s
        const target = data.username ? `/${data.username}` : '/';
        setTimeout(() => router.push(target), 2500);
      } else {
        setState('error');
        setMessage(data.error ?? 'Verification failed.');
      }
    } catch (err: any) {
      setState('error');
      setMessage(
        err?.response?.data?.error
          ?? 'Payment received but verification failed. Please contact support.'
      );
      console.error('[SUCCESS_PAGE] verify error:', err);
    }
  };

  useEffect(() => {
    // Wait for Clerk to initialise before calling the authenticated endpoint
    if (!isLoaded) return;
    if (called.current) return;
    called.current = true;
    verify();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  return (
    <div className='min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6 pt-[72px]'>
      <div className='text-center max-w-md w-full'>

        {/* Icon */}
        <div className='w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8'
          style={{ background: state === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(201,169,110,0.12)' }}>
          {state === 'verifying' && <Loader2 size={36} className='text-[#c9a96e] animate-spin' />}
          {state === 'success'   && <CheckCircle size={36} className='text-[#c9a96e]' />}
          {state === 'error'     && <XCircle size={36} className='text-red-400' />}
        </div>

        {/* Eyebrow */}
        <div className='flex items-center justify-center gap-3 mb-5'>
          <div className='h-px w-10 bg-[#c9a96e]/40' />
          <span className='text-luxury-label text-[#c9a96e] tracking-luxury'>
            {state === 'verifying' && 'Processing payment…'}
            {state === 'success'   && "You're now Pro"}
            {state === 'error'     && 'Something went wrong'}
          </span>
          <div className='h-px w-10 bg-[#c9a96e]/40' />
        </div>

        {/* Heading */}
        <h1 className='font-display text-3xl md:text-4xl font-bold text-[#f8f6f0] mb-4'>
          {state === 'verifying' && 'Verifying your payment…'}
          {state === 'success'   && 'Payment Successful 🎉'}
          {state === 'error'     && 'Verification Failed'}
        </h1>

        {/* Body */}
        <p className='text-[#8a8a8a] leading-relaxed mb-10'>
          {state === 'verifying' && 'Please wait while we confirm your transaction with Paystack.'}
          {state === 'success'   && (
            <>
              Your Pro subscription is now active. Your verified badge has been applied.
              <br />
              <span className='text-[#c9a96e] mt-2 block'>Redirecting to your profile…</span>
            </>
          )}
          {state === 'error' && (message || 'Please try verifying again or contact support.')}
        </p>

        {/* Actions */}
        {state === 'success' && (
          <div className='flex flex-col sm:flex-row items-center justify-center gap-3'>
            {username && (
              <Link
                href={`/${username}`}
                className='inline-flex items-center gap-2 bg-[#c9a96e] hover:bg-[#b8963d] text-[#0a0a0a] px-7 py-3 text-luxury-label tracking-luxury font-semibold transition-colors duration-300'
              >
                View Your Profile
              </Link>
            )}
            <Link
              href='/'
              className='inline-flex items-center gap-2 border border-[#2a2a2a] hover:border-[#c9a96e]/40 text-[#8a8a8a] hover:text-[#c9a96e] px-7 py-3 text-luxury-label tracking-luxury transition-all duration-300'
            >
              Explore Discover
            </Link>
          </div>
        )}

        {state === 'error' && (
          <div className='flex flex-col sm:flex-row items-center justify-center gap-3'>
            <button
              type='button'
              onClick={() => { called.current = false; verify(); }}
              className='inline-flex items-center gap-2 bg-[#c9a96e] hover:bg-[#b8963d] text-[#0a0a0a] px-7 py-3 text-luxury-label tracking-luxury font-semibold transition-colors duration-300'
            >
              <RefreshCw size={13} />
              Retry Verification
            </button>
            <a
              href='mailto:support@ophelia.com'
              className='inline-flex items-center gap-2 border border-[#2a2a2a] hover:border-[#c9a96e]/40 text-[#8a8a8a] hover:text-[#c9a96e] px-7 py-3 text-luxury-label tracking-luxury transition-all duration-300'
            >
              Contact Support
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
