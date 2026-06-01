'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Check, Zap, Building2, ArrowRight, Star } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const INDIVIDUAL_FEATURES = [
  'Verified Designer Badge',
  'Priority Search Ranking',
  'Priority Feed Placement',
  'Increased Profile Visibility',
  'Featured Creator Eligibility',
  'Pro Analytics Dashboard',
  'Early Access to New Features',
  'Priority Support',
  'Unlimited Project Uploads',
  'Increased Exposure Across Explore Pages'
];

const AGENCY_FEATURES = [
  'Everything in Individual Pro',
  'Agency Verification Badge',
  'Team Account Management',
  'Up to 10 Team Members',
  'Agency Portfolio Page',
  'Agency Showcase Section',
  'Top Search Placement',
  'Homepage Promotion Eligibility',
  'Advanced Analytics',
  'Client Lead Generation Tools',
  'Priority Review and Approval',
  'Agency Profile Branding',
  'Featured Agency Badge',
  'Dedicated Agency Dashboard',
  'Premium Customer Support'
];

const FAQS = [
  { q: 'Can I cancel anytime?', a: 'Yes. You can cancel your subscription at any time from your account settings. Your Pro benefits remain active until the end of the billing period.' },
  { q: 'What payment methods are accepted?', a: 'We accept all major credit and debit cards via Stripe, and local payment options via Paystack.' },
  { q: 'What is the difference between Individual Pro and Agency Pro?', a: 'Individual Pro is designed for solo designers and creatives. Agency Pro adds team management, agency branding, and multi-member accounts for studios and agencies.' },
  { q: 'How does the verified badge work?', a: 'Once subscribed, a gold verified badge appears beside your name on your profile, all your works, and throughout the platform — signalling trust and professionalism.' },
  { q: 'Does Pro improve my search ranking?', a: 'Yes. Pro members receive priority placement in search results, the discovery feed, and category pages, giving you significantly more visibility.' }
];

type Plan = 'individual' | 'agency';
type PaymentMethod = 'stripe' | 'paystack';

export default function GoProPage() {
  const { userId }   = useAuth();
  const router       = useRouter();
  const { toast }    = useToast();
  const [loading,    setLoading]    = useState<Plan | null>(null);
  const [method,     setMethod]     = useState<PaymentMethod>('stripe');

  const handleSubscribe = async (plan: Plan) => {
    if (!userId) { router.push('/sign-in'); return; }

    setLoading(plan);
    try {
      const endpoint = method === 'stripe'
        ? '/api/subscription/stripe/checkout'
        : '/api/subscription/paystack/initialize';

      const { data } = await axios.post(endpoint, { plan });

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No redirect URL returned');
      }
    } catch {
      toast({ description: 'Something went wrong. Please try again.', variant: 'destructive' });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className='min-h-screen bg-[#0a0a0a]'>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <div className='relative pt-[72px] overflow-hidden'>
        {/* ambient glow */}
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none'
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(201,169,110,0.12) 0%, transparent 65%)' }} />
        {/* grid */}
        <div className='absolute inset-0 opacity-[0.03] pointer-events-none'
          style={{ backgroundImage: 'linear-gradient(rgba(248,246,240,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(248,246,240,0.5) 1px,transparent 1px)', backgroundSize: '80px 80px' }} />

        <div className='relative max-w-[820px] mx-auto px-6 pt-20 pb-24 text-center'>
          <div className='flex items-center justify-center gap-3 mb-8'>
            <div className='h-px w-10 bg-[#c9a96e]/40' />
            <span className='text-luxury-label text-[#c9a96e] tracking-luxury'>Ophelia Pro</span>
            <div className='h-px w-10 bg-[#c9a96e]/40' />
          </div>

          <h1 className='font-display text-5xl md:text-[4.2rem] font-bold text-[#f8f6f0] leading-[1.05] tracking-tight mb-6'>
            Get Discovered Faster.<br />
            <span className='italic text-[#c9a96e]'>Grow Your Creative Career.</span>
          </h1>

          <p className='text-[#8a8a8a] text-lg leading-relaxed max-w-[520px] mx-auto mb-12'>
            Unlock verification, reach more users, boost your visibility, and stand out from the crowd.
          </p>

          <div className='flex flex-col sm:flex-row items-center justify-center gap-3'>
            <button
              onClick={() => handleSubscribe('individual')}
              disabled={loading !== null}
              className='group inline-flex items-center gap-2 bg-[#c9a96e] hover:bg-[#b8963d] text-[#0a0a0a] px-8 py-3.5 text-luxury-label tracking-luxury font-semibold transition-colors duration-300'
            >
              <Zap size={13} />
              Start Individual Pro — $2.59/mo
              <ArrowRight size={12} className='transition-transform duration-300 group-hover:translate-x-0.5' />
            </button>
            <button
              onClick={() => handleSubscribe('agency')}
              disabled={loading !== null}
              className='group inline-flex items-center gap-2 border border-[#c9a96e]/40 hover:border-[#c9a96e] text-[#c9a96e] px-8 py-3.5 text-luxury-label tracking-luxury transition-all duration-300'
            >
              <Building2 size={13} />
              Start Agency Pro — $9.59/mo
            </button>
          </div>
        </div>
      </div>

      {/* ── Payment method toggle ─────────────────────────────── */}
      <div className='flex items-center justify-center gap-0 pb-4'>
        {(['stripe', 'paystack'] as const).map((m) => (
          <button
            key={m}
            type='button'
            onClick={() => setMethod(m)}
            className={cn(
              'px-5 py-2 text-luxury-label tracking-luxury transition-all duration-200 border-b-2',
              method === m
                ? 'text-[#c9a96e] border-[#c9a96e]'
                : 'text-[#525252] border-transparent hover:text-[#8a8a8a]'
            )}
          >
            {m === 'stripe' ? 'Pay with Stripe' : 'Pay with Paystack'}
          </button>
        ))}
      </div>

      {/* ── Pricing cards ─────────────────────────────────────── */}
      <div className='max-w-[1000px] mx-auto px-6 pb-24'>
        <div className='divider-gold mb-16 opacity-30' />

        <div className='grid md:grid-cols-2 gap-6'>

          {/* Individual Pro */}
          <div className='border border-[#1e1e1e] p-8 flex flex-col hover:border-[#c9a96e]/30 transition-colors duration-500'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-9 h-9 border border-[#c9a96e]/40 flex items-center justify-center'>
                <Zap size={16} className='text-[#c9a96e]' />
              </div>
              <div>
                <p className='text-luxury-label tracking-luxury text-[#c9a96e]'>Individual Pro</p>
                <p className='text-[#525252] text-xs'>For designers & creatives</p>
              </div>
            </div>

            <div className='mb-8'>
              <span className='font-display text-5xl font-bold text-[#f8f6f0]'>$2.59</span>
              <span className='text-[#525252] text-sm ml-2'>/month</span>
            </div>

            <button
              onClick={() => handleSubscribe('individual')}
              disabled={loading !== null}
              className='w-full inline-flex items-center justify-center gap-2 border border-[#c9a96e]/40 hover:border-[#c9a96e] hover:bg-[#c9a96e]/5 text-[#c9a96e] py-3 text-luxury-label tracking-luxury font-semibold transition-all duration-300 mb-8 disabled:opacity-50'
            >
              {loading === 'individual' ? 'Redirecting…' : 'Get Started'}
              {loading !== 'individual' && <ArrowRight size={12} />}
            </button>

            <ul className='space-y-3 flex-1'>
              {INDIVIDUAL_FEATURES.map((f) => (
                <li key={f} className='flex items-start gap-3'>
                  <span className='w-4 h-4 rounded-full bg-[#c9a96e]/15 flex items-center justify-center flex-shrink-0 mt-0.5'>
                    <Check size={9} className='text-[#c9a96e]' strokeWidth={3} />
                  </span>
                  <span className='text-[#8a8a8a] text-sm'>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Agency Pro — featured */}
          <div className='relative border border-[#c9a96e]/40 p-8 flex flex-col'
            style={{ background: 'linear-gradient(160deg, rgba(201,169,110,0.04) 0%, transparent 60%)' }}>
            {/* Most popular badge */}
            <div className='absolute -top-3.5 left-1/2 -translate-x-1/2'>
              <span className='inline-flex items-center gap-1.5 bg-[#c9a96e] text-[#0a0a0a] px-4 py-1 text-[10px] tracking-[0.18em] uppercase font-semibold'>
                <Star size={9} fill='currentColor' />
                Most Popular
              </span>
            </div>

            <div className='flex items-center gap-3 mb-6'>
              <div className='w-9 h-9 border border-[#c9a96e] flex items-center justify-center'>
                <Building2 size={16} className='text-[#c9a96e]' />
              </div>
              <div>
                <p className='text-luxury-label tracking-luxury text-[#c9a96e]'>Agency Pro</p>
                <p className='text-[#525252] text-xs'>For studios & agencies</p>
              </div>
            </div>

            <div className='mb-8'>
              <span className='font-display text-5xl font-bold text-[#f8f6f0]'>$9.59</span>
              <span className='text-[#525252] text-sm ml-2'>/month</span>
            </div>

            <button
              onClick={() => handleSubscribe('agency')}
              disabled={loading !== null}
              className='w-full inline-flex items-center justify-center gap-2 bg-[#c9a96e] hover:bg-[#b8963d] text-[#0a0a0a] py-3 text-luxury-label tracking-luxury font-semibold transition-colors duration-300 mb-8 disabled:opacity-50'
            >
              {loading === 'agency' ? 'Redirecting…' : 'Get Agency Pro'}
              {loading !== 'agency' && <ArrowRight size={12} />}
            </button>

            <ul className='space-y-3 flex-1'>
              {AGENCY_FEATURES.map((f) => (
                <li key={f} className='flex items-start gap-3'>
                  <span className='w-4 h-4 rounded-full bg-[#c9a96e]/20 flex items-center justify-center flex-shrink-0 mt-0.5'>
                    <Check size={9} className='text-[#c9a96e]' strokeWidth={3} />
                  </span>
                  <span className={cn('text-sm', f === 'Everything in Individual Pro' ? 'text-[#c9a96e] font-medium' : 'text-[#8a8a8a]')}>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── How it works ────────────────────────────────────── */}
        <div className='mt-24 text-center'>
          <p className='text-luxury-label tracking-luxury text-[#c9a96e] mb-4'>How it works</p>
          <h2 className='font-display text-3xl font-bold text-[#f8f6f0] mb-16'>
            Up and running in minutes
          </h2>

          <div className='grid md:grid-cols-3 gap-8'>
            {[
              { step: '01', title: 'Choose your plan', body: 'Pick Individual Pro or Agency Pro based on your needs.' },
              { step: '02', title: 'Complete payment',  body: 'Pay securely via Stripe or Paystack. Cancel anytime.' },
              { step: '03', title: 'Go verified',       body: 'Your badge appears instantly across the platform.' }
            ].map(({ step, title, body }) => (
              <div key={step} className='text-left border border-[#1e1e1e] p-7'>
                <span className='font-display text-5xl font-bold text-[#1e1e1e] block mb-4'>{step}</span>
                <h3 className='font-display text-lg font-bold text-[#f8f6f0] mb-2'>{title}</h3>
                <p className='text-[#525252] text-sm leading-relaxed'>{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ ─────────────────────────────────────────────── */}
        <div className='mt-24'>
          <p className='text-luxury-label tracking-luxury text-[#c9a96e] text-center mb-4'>FAQ</p>
          <h2 className='font-display text-3xl font-bold text-[#f8f6f0] text-center mb-12'>
            Common questions
          </h2>

          <div className='space-y-0'>
            {FAQS.map(({ q, a }) => (
              <div key={q} className='border-b border-[#1e1e1e] py-6'>
                <p className='font-display font-bold text-[#f8f6f0] mb-2'>{q}</p>
                <p className='text-[#8a8a8a] text-sm leading-relaxed'>{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom CTA ──────────────────────────────────────── */}
        <div className='mt-24 border border-[#1e1e1e] p-12 text-center'
          style={{ background: 'linear-gradient(160deg, rgba(201,169,110,0.05) 0%, transparent 60%)' }}>
          <h2 className='font-display text-3xl font-bold text-[#f8f6f0] mb-4'>
            Ready to stand out?
          </h2>
          <p className='text-[#8a8a8a] mb-8 max-w-md mx-auto'>
            Join thousands of verified designers who get discovered faster on Ophelia.
          </p>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-3'>
            <button
              onClick={() => handleSubscribe('individual')}
              disabled={loading !== null}
              className='group inline-flex items-center gap-2 bg-[#c9a96e] hover:bg-[#b8963d] text-[#0a0a0a] px-8 py-3.5 text-luxury-label tracking-luxury font-semibold transition-colors duration-300'
            >
              <Zap size={13} />
              Individual Pro — $2.59/mo
              <ArrowRight size={12} className='transition-transform duration-300 group-hover:translate-x-0.5' />
            </button>
            <button
              onClick={() => handleSubscribe('agency')}
              disabled={loading !== null}
              className='group inline-flex items-center gap-2 border border-[#2a2a2a] hover:border-[#c9a96e]/40 text-[#8a8a8a] hover:text-[#c9a96e] px-8 py-3.5 text-luxury-label tracking-luxury transition-all duration-300'
            >
              <Building2 size={13} />
              Agency Pro — $9.59/mo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
