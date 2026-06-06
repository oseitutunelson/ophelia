export type AdType = 'design' | 'agency' | 'job' | 'blog';

export interface PricingTier {
  duration: number;
  price: number;
  label: string;
  popular?: boolean;
}

export interface AdProduct {
  type: AdType;
  label: string;
  description: string;
  icon: string;
  color: string;
  tiers: PricingTier[];
  benefits: string[];
}

export const AD_PRODUCTS: AdProduct[] = [
  {
    type: 'design',
    label: 'Design Promotion',
    description: 'Boost your fashion designs and creative portfolio to the top of discovery feeds.',
    icon: '✦',
    color: '#c9a96e',
    tiers: [
      { duration: 7,  price: 4.99,  label: '7 Days' },
      { duration: 14, price: 7.99,  label: '14 Days', popular: true },
      { duration: 30, price: 14.99, label: '30 Days' },
    ],
    benefits: [
      'Homepage placement',
      'Search priority boost',
      'Explore page visibility',
      'Featured creator section',
      '"Sponsored" label for credibility',
    ],
  },
  {
    type: 'agency',
    label: 'Agency Promotion',
    description: 'Elevate your agency profile and attract premium clients and top talent.',
    icon: '◆',
    color: '#a07840',
    tiers: [
      { duration: 7,  price: 9.99,  label: '7 Days' },
      { duration: 14, price: 14.99, label: '14 Days', popular: true },
      { duration: 30, price: 24.99, label: '30 Days' },
    ],
    benefits: [
      'Featured agency placement',
      'Homepage agency spotlight',
      'Search ranking boost',
      'Agency spotlight section',
      'Verified promotion badge',
    ],
  },
  {
    type: 'job',
    label: 'Job Promotion',
    description: 'Get your fashion job listing in front of the best designers and creatives.',
    icon: '◉',
    color: '#6b6b6b',
    tiers: [
      { duration: 30, price: 19.99, label: '30 Days' },
    ],
    benefits: [
      'Job board priority listing',
      'Homepage jobs section',
      'Featured jobs placement',
      'Higher application rate',
      'Priority search placement',
    ],
  },
  {
    type: 'blog',
    label: 'Blog Promotion',
    description: 'Amplify your fashion articles and editorial content to a wider audience.',
    icon: '●',
    color: '#b0a898',
    tiers: [
      { duration: 7,  price: 3.99,  label: '7 Days' },
      { duration: 14, price: 6.99,  label: '14 Days', popular: true },
      { duration: 30, price: 12.99, label: '30 Days' },
    ],
    benefits: [
      'Featured article placement',
      'Homepage exposure',
      'Blog category priority',
      'Increased readership',
      'Social discovery boost',
    ],
  },
];

export function getPricingTier(type: AdType, duration: number): PricingTier | undefined {
  return AD_PRODUCTS.find((p) => p.type === type)?.tiers.find((t) => t.duration === duration);
}

export function getCampaignPrice(type: AdType, duration: number): number {
  return getPricingTier(type, duration)?.price ?? 0;
}

export function getAdProduct(type: AdType): AdProduct | undefined {
  return AD_PRODUCTS.find((p) => p.type === type);
}

export const CAMPAIGN_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending_payment: { label: 'Awaiting Payment', color: '#b0a898' },
  active:          { label: 'Active',            color: '#22c55e' },
  paused:          { label: 'Paused',            color: '#f59e0b' },
  expired:         { label: 'Expired',           color: '#6b6b6b' },
};

export function estimatedReach(type: AdType, duration: number): string {
  const base: Record<AdType, number> = { design: 4200, agency: 7500, job: 3800, blog: 2900 };
  const mult = duration === 7 ? 1 : duration === 14 ? 2.1 : 4.8;
  const low = Math.round(base[type] * mult);
  const high = Math.round(low * 1.4);
  return `${low.toLocaleString()}–${high.toLocaleString()}`;
}
