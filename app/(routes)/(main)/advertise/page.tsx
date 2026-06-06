import { Metadata } from 'next';
import Link from 'next/link';
import { Check, ArrowRight, TrendingUp, Users, Briefcase, FileText, Zap, BarChart2, Target, Shield } from 'lucide-react';
import { AD_PRODUCTS } from '@/lib/ad-utils';

export const metadata: Metadata = {
  title: 'Advertise on Ophelia | Reach Fashion Creatives',
  description: 'Promote your fashion designs, agency, jobs, and articles to thousands of fashion creatives, agencies, and brands on Ophelia.',
};

const STATS = [
  { value: '50K+', label: 'Active Designers' },
  { value: '2.8K+', label: 'Agencies' },
  { value: '120K+', label: 'Monthly Impressions' },
  { value: '94%', label: 'Ad Engagement Rate' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Choose What to Promote', description: 'Select your design, agency profile, job listing, or blog article to feature across the platform.' },
  { step: '02', title: 'Set Your Duration', description: 'Pick 7, 14, or 30 days depending on your goals. Longer campaigns unlock better reach and value.' },
  { step: '03', title: 'Go Live Instantly', description: 'After payment, your campaign activates within minutes and appears across relevant platform sections.' },
];

const FAQS = [
  { q: 'How quickly does my campaign go live?', a: 'Your campaign activates within minutes after payment confirmation. You\'ll see it featured across the platform immediately.' },
  { q: 'Can I pause or stop a campaign early?', a: 'Yes. You can pause any active campaign from your advertiser dashboard at any time. Campaigns cannot be refunded once active.' },
  { q: 'Where does my promoted content appear?', a: 'Sponsored content appears in the homepage featured sections, category feeds, search results, and relevant discovery pages — all clearly labelled "Sponsored".' },
  { q: 'What payment methods are accepted?', a: 'We accept all major credit and debit cards via Stripe, plus local payment via Paystack (GHS).' },
  { q: 'Can I run multiple campaigns at once?', a: 'Yes. You can run campaigns for different content types simultaneously with no restrictions.' },
];

const TYPE_ICONS = { design: TrendingUp, agency: Users, job: Briefcase, blog: FileText };

export default function AdvertisePage() {
  return (
    <main className='bg-[#0d0d0d] text-[#f7f5f0] min-h-screen'>
      {/* ── Hero ── */}
      <section className='relative pt-36 pb-28 px-5 lg:px-12 overflow-hidden'>
        {/* ambient glow */}
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gold/10 blur-[140px] rounded-full pointer-events-none' />

        <div className='relative max-w-5xl mx-auto text-center'>
          <span className='inline-flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-gold border border-gold/30 px-4 py-2 mb-8'>
            <Zap className='w-3 h-3' /> Advertising Platform
          </span>

          <h1 className='font-display text-5xl lg:text-7xl xl:text-8xl text-white leading-[1.05] mb-7'>
            Reach Thousands of<br />
            <span className='text-gold'>Fashion Creatives</span>
          </h1>

          <p className='text-[#b0a898] text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto mb-10'>
            Promote your work, hire top talent, grow your agency, and increase visibility across Ophelia — the platform where fashion meets creativity.
          </p>

          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <Link
              href='/advertise/new'
              className='flex items-center gap-2.5 px-8 py-4 bg-gold text-[#0d0d0d] text-sm font-bold tracking-wider uppercase hover:bg-gold-warm transition-colors duration-200'
            >
              Start Advertising <ArrowRight className='w-4 h-4' />
            </Link>
            <a
              href='#pricing'
              className='flex items-center gap-2.5 px-8 py-4 border border-[#3a3a3a] text-[#b0a898] text-sm font-semibold tracking-wider uppercase hover:border-gold/40 hover:text-gold transition-colors duration-200'
            >
              View Ad Packages
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className='border-y border-[#1e1e1e] bg-[#111111]'>
        <div className='max-w-5xl mx-auto px-5 lg:px-12 py-10 grid grid-cols-2 lg:grid-cols-4 gap-8'>
          {STATS.map((s) => (
            <div key={s.label} className='text-center'>
              <p className='font-display text-4xl lg:text-5xl text-gold mb-1'>{s.value}</p>
              <p className='text-[#6b6b6b] text-sm tracking-wide'>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Ad Products ── */}
      <section className='py-24 px-5 lg:px-12 max-w-7xl mx-auto'>
        <div className='text-center mb-16'>
          <p className='text-[11px] font-bold tracking-widest uppercase text-gold mb-3'>What You Can Promote</p>
          <h2 className='font-display text-4xl lg:text-5xl text-white'>Advertising Products</h2>
          <p className='text-[#6b6b6b] mt-4 max-w-xl mx-auto'>Four targeted ad formats designed to grow your presence across every corner of the platform.</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {AD_PRODUCTS.map((product) => {
            const Icon = TYPE_ICONS[product.type];
            return (
              <div key={product.type} className='group relative bg-[#111111] border border-[#1e1e1e] p-8 hover:border-gold/30 transition-colors duration-300'>
                <div className='flex items-start justify-between mb-6'>
                  <div>
                    <div className='w-12 h-12 rounded-sm bg-gold/10 flex items-center justify-center mb-4'>
                      <Icon className='w-6 h-6 text-gold' />
                    </div>
                    <h3 className='font-display text-2xl text-white mb-2'>{product.label}</h3>
                    <p className='text-[#6b6b6b] text-sm leading-relaxed'>{product.description}</p>
                  </div>
                  <span className='text-2xl text-gold/30 font-display shrink-0 ml-4'>{product.icon}</span>
                </div>

                <ul className='space-y-2.5 mb-8'>
                  {product.benefits.map((b) => (
                    <li key={b} className='flex items-center gap-3 text-sm text-[#b0a898]'>
                      <Check className='w-4 h-4 text-gold shrink-0' />
                      {b}
                    </li>
                  ))}
                </ul>

                <div className='flex items-center gap-3 flex-wrap'>
                  {product.tiers.map((t) => (
                    <span key={t.duration} className='text-xs text-[#6b6b6b] border border-[#2a2a2a] px-3 py-1.5'>
                      {t.label} — <span className='text-[#b0a898]'>${t.price}</span>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className='py-20 bg-[#0a0a0a] border-y border-[#1a1a1a]'>
        <div className='max-w-5xl mx-auto px-5 lg:px-12'>
          <div className='text-center mb-16'>
            <p className='text-[11px] font-bold tracking-widest uppercase text-gold mb-3'>Simple Process</p>
            <h2 className='font-display text-4xl text-white'>How It Works</h2>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className='text-center'>
                <p className='font-display text-6xl text-gold/20 mb-4'>{step.step}</p>
                <h3 className='font-display text-xl text-white mb-3'>{step.title}</h3>
                <p className='text-[#6b6b6b] text-sm leading-relaxed'>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id='pricing' className='py-24 px-5 lg:px-12 max-w-7xl mx-auto'>
        <div className='text-center mb-16'>
          <p className='text-[11px] font-bold tracking-widest uppercase text-gold mb-3'>Transparent Pricing</p>
          <h2 className='font-display text-4xl lg:text-5xl text-white'>Ad Packages</h2>
          <p className='text-[#6b6b6b] mt-4 max-w-lg mx-auto'>No hidden fees. No contracts. Pay only for the duration you choose.</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {AD_PRODUCTS.map((product) => {
            const Icon = TYPE_ICONS[product.type];
            return (
              <div key={product.type} className='bg-[#111111] border border-[#1e1e1e] p-8'>
                <div className='flex items-center gap-3 mb-6'>
                  <Icon className='w-5 h-5 text-gold' />
                  <h3 className='font-display text-xl text-white'>{product.label}</h3>
                </div>
                <div className='space-y-3'>
                  {product.tiers.map((tier) => (
                    <div key={tier.duration} className={`flex items-center justify-between p-4 border ${tier.popular ? 'border-gold/40 bg-gold/5' : 'border-[#2a2a2a]'}`}>
                      <div className='flex items-center gap-3'>
                        <span className='text-[#f7f5f0] font-medium'>{tier.label}</span>
                        {tier.popular && (
                          <span className='text-[9px] font-bold tracking-widest uppercase bg-gold text-[#0d0d0d] px-2 py-0.5'>
                            Popular
                          </span>
                        )}
                      </div>
                      <span className='font-display text-2xl text-gold'>${tier.price}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href={`/advertise/new?type=${product.type}`}
                  className='mt-6 flex items-center justify-center gap-2 w-full py-3 border border-gold/30 text-gold text-sm font-semibold tracking-wider uppercase hover:bg-gold hover:text-[#0d0d0d] transition-all duration-200'
                >
                  Promote {product.type === 'design' ? 'a Design' : product.type === 'agency' ? 'Your Agency' : product.type === 'job' ? 'a Job' : 'an Article'}
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Trust signals ── */}
      <section className='py-16 bg-[#0a0a0a] border-y border-[#1a1a1a]'>
        <div className='max-w-5xl mx-auto px-5 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
          {[
            { icon: BarChart2, title: 'Real-Time Analytics', desc: 'Track impressions, clicks, and engagement live from your dashboard.' },
            { icon: Target, title: 'Targeted Reach', desc: 'Your ads appear to fashion designers, agencies, and recruiters — not random audiences.' },
            { icon: Shield, title: 'Transparent & Safe', desc: 'Clear "Sponsored" labels on all promoted content. No deceptive practices.' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title}>
                <div className='w-12 h-12 rounded-sm bg-gold/10 flex items-center justify-center mx-auto mb-4'>
                  <Icon className='w-6 h-6 text-gold' />
                </div>
                <h3 className='font-display text-lg text-white mb-2'>{item.title}</h3>
                <p className='text-[#6b6b6b] text-sm leading-relaxed'>{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className='py-24 px-5 lg:px-12 max-w-3xl mx-auto'>
        <div className='text-center mb-12'>
          <p className='text-[11px] font-bold tracking-widest uppercase text-gold mb-3'>FAQ</p>
          <h2 className='font-display text-4xl text-white'>Common Questions</h2>
        </div>
        <div className='space-y-0 border border-[#1e1e1e]'>
          {FAQS.map((faq, i) => (
            <details key={i} className='group border-b border-[#1e1e1e] last:border-0'>
              <summary className='flex items-center justify-between px-6 py-5 cursor-pointer text-[#f7f5f0] font-medium text-sm hover:text-gold transition-colors list-none'>
                {faq.q}
                <span className='text-gold text-lg ml-4 shrink-0 group-open:rotate-45 transition-transform duration-200'>+</span>
              </summary>
              <p className='px-6 pb-5 text-[#6b6b6b] text-sm leading-relaxed'>{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className='py-24 px-5 lg:px-12 text-center bg-[#0a0a0a] border-t border-[#1a1a1a]'>
        <div className='relative max-w-2xl mx-auto'>
          <div className='absolute inset-0 bg-gold/8 blur-[80px] rounded-full pointer-events-none' />
          <div className='relative'>
            <h2 className='font-display text-4xl lg:text-5xl text-white mb-5'>
              Start Growing Today
            </h2>
            <p className='text-[#6b6b6b] text-base mb-10 leading-relaxed'>
              Join hundreds of designers, agencies, and brands already reaching new audiences on Ophelia.
            </p>
            <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
              <Link
                href='/advertise/new'
                className='flex items-center gap-2.5 px-10 py-4 bg-gold text-[#0d0d0d] text-sm font-bold tracking-wider uppercase hover:bg-gold-warm transition-colors duration-200'
              >
                Create Your Campaign <ArrowRight className='w-4 h-4' />
              </Link>
              <Link
                href='/advertise/dashboard'
                className='text-[#6b6b6b] text-sm hover:text-gold transition-colors'
              >
                View My Dashboard →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
