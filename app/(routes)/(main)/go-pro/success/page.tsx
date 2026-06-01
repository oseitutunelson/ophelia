import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function GoProSuccessPage() {
  return (
    <div className='min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6 pt-[72px]'>
      <div className='text-center max-w-md'>
        <div className='w-16 h-16 rounded-full bg-[#c9a96e]/15 flex items-center justify-center mx-auto mb-8'>
          <CheckCircle size={32} className='text-[#c9a96e]' />
        </div>

        <div className='flex items-center justify-center gap-3 mb-6'>
          <div className='h-px w-10 bg-[#c9a96e]/40' />
          <span className='text-luxury-label text-[#c9a96e] tracking-luxury'>You&apos;re now Pro</span>
          <div className='h-px w-10 bg-[#c9a96e]/40' />
        </div>

        <h1 className='font-display text-4xl font-bold text-[#f8f6f0] mb-4'>
          Welcome to Ophelia Pro
        </h1>
        <p className='text-[#8a8a8a] leading-relaxed mb-10'>
          Your verified badge is now active across the platform. Enjoy priority visibility, verified status, and all your Pro benefits.
        </p>

        <div className='flex flex-col sm:flex-row items-center justify-center gap-3'>
          <Link
            href='/'
            className='inline-flex items-center gap-2 bg-[#c9a96e] hover:bg-[#b8963d] text-[#0a0a0a] px-7 py-3 text-luxury-label tracking-luxury font-semibold transition-colors duration-300'
          >
            Explore Discover
          </Link>
          <Link
            href='/account'
            className='inline-flex items-center gap-2 border border-[#2a2a2a] hover:border-[#c9a96e]/40 text-[#8a8a8a] hover:text-[#c9a96e] px-7 py-3 text-luxury-label tracking-luxury transition-all duration-300'
          >
            Manage Subscription
          </Link>
        </div>
      </div>
    </div>
  );
}
