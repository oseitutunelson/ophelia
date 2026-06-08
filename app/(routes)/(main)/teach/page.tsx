import { Metadata } from 'next';
import Link from 'next/link';
import { GraduationCap, BookOpen, Users, DollarSign, Star, CheckCircle, ArrowRight, Sparkles, BarChart3 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Teach on Ophelia | Share Your Fashion Expertise',
  description: 'Share your fashion expertise, teach the next generation of creatives, and earn from your passion.',
};

const BENEFITS = [
  { icon: DollarSign, title: 'Earn Revenue', desc: 'Keep 80–90% of course revenue. Set your own prices.' },
  { icon: Users,      title: 'Reach Students', desc: 'Connect with 50,000+ fashion enthusiasts globally.' },
  { icon: BookOpen,   title: 'Easy Course Builder', desc: 'Upload videos, add lessons, set quizzes — all in one place.' },
  { icon: BarChart3,  title: 'Track Performance', desc: 'Real-time analytics on enrollments, ratings, and earnings.' },
  { icon: Star,       title: 'Build Your Brand', desc: 'Get a verified instructor badge and public profile.' },
  { icon: GraduationCap, title: 'Issue Certificates', desc: 'Students earn Ophelia certificates upon completion.' },
];

const STEPS = [
  { step: '01', title: 'Apply to Teach', desc: 'Submit your profile, expertise, and a sample lesson.' },
  { step: '02', title: 'Get Approved', desc: 'Our team reviews your application within 5 business days.' },
  { step: '03', title: 'Create Your Course', desc: 'Use our course builder to add modules, lessons, and content.' },
  { step: '04', title: 'Publish & Earn', desc: 'Go live, attract students, and start earning.' },
];

const STATS = [
  { value: '50K+', label: 'Active Learners' },
  { value: '500+', label: 'Courses Published' },
  { value: '90%', label: 'Revenue Share' },
  { value: '100+', label: 'Verified Instructors' },
];

export default function TeachPage() {
  return (
    <div className='min-h-screen bg-lux-bg pt-[72px]'>
      {/* Hero */}
      <section className='relative bg-lux-black overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#251d10] to-[#1a1a1a]' />
        <div className='absolute inset-0 opacity-5' style={{
          backgroundImage: 'linear-gradient(#c9a96e 1px, transparent 1px), linear-gradient(90deg, #c9a96e 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        <div className='relative max-w-[1152px] mx-auto px-6 py-24 text-center'>
          <div className='inline-flex items-center gap-2 bg-gold/10 border border-gold/20 text-gold text-xs px-4 py-2 mb-6'>
            <Sparkles className='h-3.5 w-3.5' />
            <span className='tracking-[0.2em] uppercase'>Become an Instructor</span>
          </div>
          <h1 className='font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 max-w-4xl mx-auto'>
            Share Your Expertise.{' '}
            <span className='text-[#c9a96e]'>Teach the Next Generation</span>{' '}
            of Fashion Creatives.
          </h1>
          <p className='text-white/60 text-lg max-w-2xl mx-auto mb-10 leading-relaxed'>
            Whether you're a fashion designer, photographer, stylist, or illustrator —
            your knowledge has the power to transform careers.
          </p>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <Link href='/teach/apply' className='px-8 py-4 bg-gold text-white font-semibold text-sm hover:bg-gold-deep transition-colors duration-300'>
              Start Teaching Today
            </Link>
            <Link href='/learn' className='px-8 py-4 border border-white/20 text-white font-semibold text-sm hover:bg-white/5 transition-colors duration-300'>
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className='border-b border-lux-border bg-white'>
        <div className='max-w-[1152px] mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <p className='font-display text-4xl font-bold text-lux-black'>{value}</p>
              <p className='text-sm text-lux-muted mt-1'>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className='max-w-[1152px] mx-auto px-6 py-20'>
        <div className='text-center mb-12'>
          <h2 className='font-display text-4xl font-bold text-lux-black mb-3'>Why Teach on Ophelia?</h2>
          <p className='text-lux-muted max-w-xl mx-auto text-sm leading-relaxed'>
            Join a community of passionate educators shaping the future of fashion.
          </p>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className='p-6 bg-white border border-lux-border hover:shadow-card transition-shadow duration-300'>
              <div className='w-10 h-10 bg-gold/10 flex items-center justify-center mb-4'>
                <Icon className='h-5 w-5 text-gold' />
              </div>
              <h3 className='font-semibold text-lux-black mb-2'>{title}</h3>
              <p className='text-sm text-lux-mid leading-relaxed'>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className='bg-lux-black py-20'>
        <div className='max-w-[1152px] mx-auto px-6'>
          <div className='text-center mb-12'>
            <h2 className='font-display text-4xl font-bold text-white mb-3'>How It Works</h2>
            <p className='text-white/50 max-w-xl mx-auto text-sm'>Four simple steps to becoming an Ophelia instructor</p>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {STEPS.map(({ step, title, desc }, i) => (
              <div key={step} className='relative'>
                {i < STEPS.length - 1 && (
                  <div className='hidden lg:block absolute top-6 left-full w-full h-px bg-white/10 z-0' style={{ width: 'calc(100% - 2rem)' }} />
                )}
                <div className='relative z-10'>
                  <div className='text-4xl font-bold text-gold/20 font-display mb-3'>{step}</div>
                  <h3 className='font-semibold text-white mb-2'>{title}</h3>
                  <p className='text-sm text-white/50 leading-relaxed'>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue sharing */}
      <section className='max-w-[1152px] mx-auto px-6 py-20'>
        <div className='grid lg:grid-cols-2 gap-12 items-center'>
          <div>
            <span className='text-xs font-semibold text-gold tracking-wide uppercase'>Revenue Model</span>
            <h2 className='font-display text-4xl font-bold text-lux-black mt-2 mb-4'>Earn What You Deserve</h2>
            <p className='text-lux-mid leading-relaxed mb-6'>
              We believe instructors should be fairly rewarded. That's why we offer one of the most
              competitive revenue splits in the industry.
            </p>
            <div className='space-y-4'>
              {[
                { type: 'Individual Instructor', share: '80%', desc: 'Keep 80% of every sale' },
                { type: 'Agency Pro Instructor', share: '90%', desc: 'Keep 90% as an Agency Pro member' },
                { type: 'Platform Fee', share: '10–20%', desc: 'Covers hosting, payments, support' },
              ].map(item => (
                <div key={item.type} className='flex items-center gap-4 p-4 bg-lux-bg border border-lux-border'>
                  <div className='text-2xl font-bold text-gold font-display w-16 text-center flex-shrink-0'>{item.share}</div>
                  <div>
                    <p className='font-semibold text-lux-black text-sm'>{item.type}</p>
                    <p className='text-xs text-lux-muted'>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className='bg-gradient-to-br from-[#1a1a1a] to-[#2a2218] p-8 text-center'>
            <GraduationCap className='h-16 w-16 text-gold mx-auto mb-4' />
            <p className='font-display text-3xl font-bold text-white mb-2'>Ready to Start?</p>
            <p className='text-white/50 text-sm mb-6 leading-relaxed'>
              Join instructors who have already taught thousands of fashion students on Ophelia.
            </p>
            <Link href='/teach/apply' className='block w-full py-4 bg-gold text-white font-semibold text-sm hover:bg-gold-deep transition-colors duration-300 text-center'>
              Apply to Become an Instructor
            </Link>
            <p className='text-white/30 text-xs mt-3'>Free to apply · 5 business day review</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className='bg-lux-bg border-t border-lux-border py-20'>
        <div className='max-w-[800px] mx-auto px-6'>
          <h2 className='font-display text-4xl font-bold text-lux-black text-center mb-10'>Frequently Asked Questions</h2>
          <div className='space-y-4'>
            {[
              { q: 'What qualifications do I need?', a: 'No formal certifications required. We look for real-world expertise, clear communication, and passion for teaching. Your portfolio and experience speak louder than credentials.' },
              { q: 'How long does the review process take?', a: 'Our team reviews all applications within 5 business days. You\'ll receive an email notification with the outcome.' },
              { q: 'Can I set my own course pricing?', a: 'Yes! You can offer free courses or set any price. We recommend between $19–$199 for paid courses based on content depth.' },
              { q: 'What equipment do I need?', a: 'A decent camera, good lighting, and clear audio are the essentials. Many successful instructors start with just a smartphone.' },
              { q: 'Can I teach multiple courses?', a: 'Absolutely. Once approved, you can create and publish as many courses as you like across any of our 26 fashion categories.' },
            ].map(({ q, a }) => (
              <details key={q} className='group bg-white border border-lux-border p-5 cursor-pointer'>
                <summary className='flex items-center justify-between font-medium text-lux-black list-none'>
                  {q}
                  <ArrowRight className='h-4 w-4 text-lux-muted group-open:rotate-90 transition-transform duration-200 flex-shrink-0' />
                </summary>
                <p className='text-sm text-lux-mid leading-relaxed mt-3'>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
