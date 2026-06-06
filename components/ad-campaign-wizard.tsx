'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@clerk/nextjs';
import { Check, ArrowRight, ArrowLeft, Loader2, TrendingUp, Users, Briefcase, FileText, CreditCard } from 'lucide-react';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { AD_PRODUCTS, estimatedReach, type AdType } from '@/lib/ad-utils';
import { useToast } from '@/components/ui/use-toast';

interface ContentItem {
  id: string;
  title: string;
  image?: string | null;
}

const TYPE_ICONS = { design: TrendingUp, agency: Users, job: Briefcase, blog: FileText };
const TYPE_LABELS: Record<AdType, string> = {
  design: 'Design',
  agency: 'Agency',
  job: 'Job Listing',
  blog: 'Blog Article',
};

const STEPS = ['Choose Type', 'Select Content', 'Choose Duration', 'Review & Pay'];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className='flex items-center justify-center gap-0 mb-12'>
      {STEPS.map((label, i) => (
        <div key={i} className='flex items-center'>
          <div className={cn(
            'flex items-center justify-center w-8 h-8 text-xs font-bold transition-all',
            i < current ? 'bg-gold text-[#0d0d0d]' :
            i === current ? 'bg-[#1e1e1e] text-gold border border-gold' :
            'bg-[#1a1a1a] text-[#3a3a3a] border border-[#2a2a2a]'
          )}>
            {i < current ? <Check className='w-3.5 h-3.5' /> : i + 1}
          </div>
          <span className={cn(
            'hidden md:block text-[11px] font-medium ml-2 mr-6',
            i === current ? 'text-[#f7f5f0]' : 'text-[#3a3a3a]'
          )}>
            {label}
          </span>
          {i < STEPS.length - 1 && (
            <div className={cn('hidden md:block w-8 h-px mr-4', i < current ? 'bg-gold' : 'bg-[#2a2a2a]')} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function AdCampaignWizard() {
  const { userId } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [step, setStep] = useState(0);
  const [type, setType] = useState<AdType>((searchParams.get('type') as AdType) || 'design');
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [duration, setDuration] = useState<number>(14);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paystack'>('stripe');
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loadingContent, setLoadingContent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // For agency type, no content selection is needed
  const skipContentStep = type === 'agency';

  useEffect(() => {
    if (type === 'agency') return;
    setLoadingContent(true);
    setSelectedContent(null);

    const endpoints: Record<string, string> = {
      design: '/api/work?limit=20',
      job: '/api/profile/my-jobs',
      blog: `/api/blog?authorId=${userId}&limit=20`,
    };

    const endpoint = endpoints[type];
    if (!endpoint || !userId) { setLoadingContent(false); return; }

    axios.get(endpoint)
      .then(({ data }) => {
        let items: ContentItem[] = [];
        if (type === 'design' && Array.isArray(data)) {
          items = data.filter((w: { userId?: string }) => w.userId === userId).map((w: { id: string; title: string; image?: string }) => ({ id: w.id, title: w.title, image: w.image }));
        } else if (type === 'job' && Array.isArray(data?.jobs)) {
          items = data.jobs.map((j: { id: string; title: string; image?: string }) => ({ id: j.id, title: j.title, image: j.image }));
        } else if (type === 'blog' && Array.isArray(data?.posts)) {
          items = data.posts.map((p: { id: string; title: string; coverImage?: string }) => ({ id: p.id, title: p.title, image: p.coverImage }));
        }
        setContentItems(items);
      })
      .catch(() => {})
      .finally(() => setLoadingContent(false));
  }, [type, userId]);

  const product = AD_PRODUCTS.find((p) => p.type === type)!;
  const selectedTier = product.tiers.find((t) => t.duration === duration);
  const reach = estimatedReach(type, duration);

  const handleNext = () => {
    if (step === 0) {
      if (skipContentStep) { setStep(2); } else { setStep(1); }
      return;
    }
    if (step === 1) {
      if (!selectedContent && type !== 'agency') {
        toast({ title: 'Please select content to promote.', variant: 'destructive' });
        return;
      }
      setStep(2);
      return;
    }
    if (step === 2) { setStep(3); return; }
  };

  const handleBack = () => {
    if (step === 2 && skipContentStep) { setStep(0); return; }
    setStep((s) => Math.max(0, s - 1));
  };

  const handlePay = async () => {
    if (!userId) { router.push('/sign-in'); return; }
    setSubmitting(true);

    try {
      // 1. Create campaign record
      const contentTitle = type === 'agency' ? 'Agency Profile' : selectedContent?.title || '';
      const { data: campaignData } = await axios.post('/api/campaigns', {
        type,
        contentId: selectedContent?.id || '',
        contentTitle,
        contentImage: selectedContent?.image || null,
        duration,
      });

      const campaignId = campaignData.campaign.id;

      // 2. Create checkout session
      const endpoint = paymentMethod === 'stripe'
        ? '/api/campaigns/checkout/stripe'
        : '/api/campaigns/checkout/paystack';

      const { data } = await axios.post(endpoint, { campaignId });

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No redirect URL');
      }
    } catch {
      toast({ title: 'Payment failed. Please try again.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='max-w-3xl mx-auto px-5 lg:px-0 py-12'>
      <StepIndicator current={step} />

      {/* ── Step 0: Choose Type ── */}
      {step === 0 && (
        <div>
          <h2 className='font-display text-3xl text-white mb-2 text-center'>What do you want to promote?</h2>
          <p className='text-[#6b6b6b] text-sm text-center mb-10'>Choose the type of content you'd like to feature across the platform.</p>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {AD_PRODUCTS.map((p) => {
              const Icon = TYPE_ICONS[p.type];
              const isSelected = type === p.type;
              return (
                <button
                  key={p.type}
                  onClick={() => setType(p.type)}
                  className={cn(
                    'text-left p-6 border transition-all duration-200',
                    isSelected ? 'border-gold bg-gold/10' : 'border-[#2a2a2a] bg-[#111111] hover:border-[#3a3a3a]'
                  )}
                >
                  <div className='flex items-center justify-between mb-3'>
                    <div className={cn('w-10 h-10 rounded-sm flex items-center justify-center', isSelected ? 'bg-gold' : 'bg-[#1e1e1e]')}>
                      <Icon className={cn('w-5 h-5', isSelected ? 'text-[#0d0d0d]' : 'text-gold')} />
                    </div>
                    {isSelected && <Check className='w-5 h-5 text-gold' />}
                  </div>
                  <h3 className='text-[#f7f5f0] font-semibold mb-1'>{p.label}</h3>
                  <p className='text-[#6b6b6b] text-sm leading-relaxed'>{p.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Step 1: Select Content ── */}
      {step === 1 && (
        <div>
          <h2 className='font-display text-3xl text-white mb-2 text-center'>Select your {TYPE_LABELS[type]}</h2>
          <p className='text-[#6b6b6b] text-sm text-center mb-10'>Choose which content to feature in this campaign.</p>

          {loadingContent ? (
            <div className='flex justify-center py-16'>
              <Loader2 className='w-8 h-8 animate-spin text-gold' />
            </div>
          ) : contentItems.length === 0 ? (
            <div className='text-center py-16 border border-[#2a2a2a] bg-[#111111]'>
              <p className='text-[#6b6b6b] mb-4'>No {TYPE_LABELS[type].toLowerCase()}s found.</p>
              <a href={type === 'design' ? '/upload-new' : type === 'job' ? '/post-job' : '/blog/new'} className='text-gold text-sm hover:underline'>
                Create one first →
              </a>
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1'>
              {contentItems.map((item) => {
                const isSelected = selectedContent?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedContent(item)}
                    className={cn(
                      'flex items-center gap-4 p-4 border text-left transition-all duration-200',
                      isSelected ? 'border-gold bg-gold/10' : 'border-[#2a2a2a] bg-[#111111] hover:border-[#3a3a3a]'
                    )}
                  >
                    <div className='relative w-14 h-14 shrink-0 overflow-hidden bg-[#1e1e1e]'>
                      {item.image && (
                        <Image src={item.image} alt={item.title} fill className='object-cover' unoptimized />
                      )}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className={cn('text-sm font-medium truncate', isSelected ? 'text-gold' : 'text-[#f7f5f0]')}>{item.title}</p>
                    </div>
                    {isSelected && <Check className='w-4 h-4 text-gold shrink-0' />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Step 2: Choose Duration ── */}
      {step === 2 && (
        <div>
          <h2 className='font-display text-3xl text-white mb-2 text-center'>How long do you want to run?</h2>
          <p className='text-[#6b6b6b] text-sm text-center mb-10'>Longer campaigns deliver better reach and more consistent results.</p>
          <div className='space-y-3'>
            {product.tiers.map((tier) => {
              const isSelected = duration === tier.duration;
              return (
                <button
                  key={tier.duration}
                  onClick={() => setDuration(tier.duration)}
                  className={cn(
                    'w-full flex items-center justify-between p-5 border transition-all duration-200',
                    isSelected ? 'border-gold bg-gold/10' : 'border-[#2a2a2a] bg-[#111111] hover:border-[#3a3a3a]'
                  )}
                >
                  <div className='flex items-center gap-4'>
                    <div className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center', isSelected ? 'border-gold' : 'border-[#3a3a3a]')}>
                      {isSelected && <div className='w-2.5 h-2.5 rounded-full bg-gold' />}
                    </div>
                    <div className='text-left'>
                      <p className={cn('font-semibold', isSelected ? 'text-gold' : 'text-[#f7f5f0]')}>{tier.label}</p>
                      <p className='text-[#6b6b6b] text-xs mt-0.5'>~{estimatedReach(type, tier.duration)} estimated impressions</p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='font-display text-2xl text-gold'>${tier.price}</p>
                    {tier.popular && <span className='text-[9px] font-bold tracking-wider uppercase bg-gold text-[#0d0d0d] px-2 py-0.5'>Popular</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Step 3: Review & Pay ── */}
      {step === 3 && (
        <div>
          <h2 className='font-display text-3xl text-white mb-2 text-center'>Review Your Campaign</h2>
          <p className='text-[#6b6b6b] text-sm text-center mb-10'>Confirm the details and complete payment to launch.</p>

          {/* Summary card */}
          <div className='bg-[#111111] border border-[#2a2a2a] p-6 mb-6 space-y-4'>
            <div className='flex justify-between text-sm'>
              <span className='text-[#6b6b6b]'>Campaign Type</span>
              <span className='text-[#f7f5f0] font-medium'>{product.label}</span>
            </div>
            {type !== 'agency' && selectedContent && (
              <div className='flex justify-between text-sm'>
                <span className='text-[#6b6b6b]'>Content</span>
                <span className='text-[#f7f5f0] font-medium truncate max-w-[200px] text-right'>{selectedContent.title}</span>
              </div>
            )}
            {type === 'agency' && (
              <div className='flex justify-between text-sm'>
                <span className='text-[#6b6b6b]'>Content</span>
                <span className='text-[#f7f5f0] font-medium'>Agency Profile</span>
              </div>
            )}
            <div className='flex justify-between text-sm'>
              <span className='text-[#6b6b6b]'>Duration</span>
              <span className='text-[#f7f5f0] font-medium'>{duration} Days</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-[#6b6b6b]'>Estimated Reach</span>
              <span className='text-[#f7f5f0] font-medium'>{reach} impressions</span>
            </div>
            <div className='border-t border-[#2a2a2a] pt-4 flex justify-between'>
              <span className='text-[#b0a898] font-semibold'>Total</span>
              <span className='font-display text-2xl text-gold'>${selectedTier?.price?.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment method */}
          <div className='mb-6'>
            <p className='text-[11px] font-bold tracking-widest uppercase text-[#6b6b6b] mb-3'>Payment Method</p>
            <div className='grid grid-cols-2 gap-3'>
              {(['stripe', 'paystack'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={cn(
                    'p-4 border text-sm font-semibold transition-all',
                    paymentMethod === m ? 'border-gold text-gold bg-gold/5' : 'border-[#2a2a2a] text-[#6b6b6b] hover:border-[#3a3a3a]'
                  )}
                >
                  <CreditCard className='w-4 h-4 mx-auto mb-1.5' />
                  {m === 'stripe' ? 'Card (Stripe)' : 'Paystack (GHS)'}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handlePay}
            disabled={submitting}
            className='w-full flex items-center justify-center gap-3 py-4 bg-gold text-[#0d0d0d] text-sm font-bold tracking-wider uppercase hover:bg-gold-warm transition-colors disabled:opacity-50'
          >
            {submitting ? <Loader2 className='w-5 h-5 animate-spin' /> : <CreditCard className='w-5 h-5' />}
            Pay ${selectedTier?.price?.toFixed(2)} & Launch Campaign
          </button>

          <p className='text-[#3a3a3a] text-xs text-center mt-4'>
            By proceeding you agree to our advertising terms. Campaigns are non-refundable once active.
          </p>
        </div>
      )}

      {/* ── Navigation ── */}
      <div className='flex items-center justify-between mt-10'>
        {step > 0 ? (
          <button onClick={handleBack} className='flex items-center gap-2 text-[#6b6b6b] text-sm hover:text-[#f7f5f0] transition-colors'>
            <ArrowLeft className='w-4 h-4' /> Back
          </button>
        ) : <div />}

        {step < 3 && (
          <button
            onClick={handleNext}
            className='flex items-center gap-2 px-8 py-3 bg-gold text-[#0d0d0d] text-sm font-bold tracking-wider uppercase hover:bg-gold-warm transition-colors'
          >
            Continue <ArrowRight className='w-4 h-4' />
          </button>
        )}
      </div>
    </div>
  );
}
