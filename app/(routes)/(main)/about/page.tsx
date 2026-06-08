'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import {
  ArrowRight, Palette, BookOpen, Newspaper, Briefcase,
  Building2, GraduationCap, Camera, Scissors, Users,
  Globe2, Heart, TrendingUp, Award, Zap, Sparkles,
  CheckCircle, Mail, Instagram, Twitter, Linkedin,
  Star, Eye, ShoppingBag, Megaphone, DollarSign,
} from 'lucide-react';

// ─── Scroll-reveal hook ───────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

// ─── Count-up hook ────────────────────────────────────────────────────────────
function useCountUp(target: number, active: boolean, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active || target === 0) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, active, duration]);
  return count;
}

// ─── Stat counter card ────────────────────────────────────────────────────────
function StatCounter({ value, label, suffix = '+', active }: { value: number; label: string; suffix?: string; active: boolean }) {
  const count = useCountUp(value, active);
  return (
    <div className='text-center'>
      <p className='text-[42px] md:text-[52px] font-display font-bold text-gold leading-none'>
        {count.toLocaleString()}{suffix}
      </p>
      <p className='text-[13px] text-white/50 mt-2 tracking-wide uppercase'>{label}</p>
    </div>
  );
}

// ─── Section wrapper with reveal ─────────────────────────────────────────────
function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Gold label ───────────────────────────────────────────────────────────────
function GoldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex items-center gap-3 justify-center mb-4'>
      <div className='h-px w-10 bg-gold/40' />
      <span className='text-[11px] font-semibold tracking-[0.2em] text-gold uppercase'>{children}</span>
      <div className='h-px w-10 bg-gold/40' />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  const [stats, setStats] = useState({ users: 0, works: 0, blogs: 0, courses: 0, instructors: 0, jobs: 0 });
  const statsReveal = useReveal();

  useEffect(() => {
    axios.get('/api/public/stats').then(r => setStats(r.data)).catch(() => {});
  }, []);

  return (
    <div className='min-h-screen'>

      {/* ══════════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section className='relative min-h-screen bg-[#09090d] flex items-center overflow-hidden pt-[72px]'>
        {/* Grid overlay */}
        <div className='absolute inset-0 pointer-events-none' style={{ backgroundImage: 'linear-gradient(rgba(201,169,110,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,169,110,0.04) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
        {/* Radial glow */}
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none' style={{ background: 'radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 70%)' }} />

        <div className='relative max-w-[1152px] mx-auto px-6 py-28 text-center'>
          <Reveal>
            <div className='inline-flex items-center gap-2 border border-gold/20 text-gold text-[11px] tracking-[0.2em] uppercase px-4 py-2 mb-8'>
              <Sparkles className='h-3 w-3' />
              The Platform for Fashion Creatives
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h1 className='font-display text-[48px] md:text-[72px] lg:text-[88px] font-bold text-white leading-[1.05] tracking-tight mb-6'>
              Empowering the Next<br />
              <span className='text-gold'>Generation</span> of<br />
              Fashion Creatives.
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className='text-[17px] md:text-[19px] text-white/55 max-w-2xl mx-auto leading-relaxed mb-10'>
              A global platform where fashion designers, photographers, stylists, agencies,
              brands, and creative professionals showcase their work, learn new skills,
              build careers, and connect with opportunities.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
              <Link href='/' className='group inline-flex items-center gap-2 bg-gold text-white px-8 py-4 text-[13px] font-semibold tracking-wide hover:bg-gold-deep transition-colors duration-300'>
                Explore Designs
                <ArrowRight className='h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5' />
              </Link>
              <Link href='/sign-up' className='inline-flex items-center gap-2 border border-white/20 text-white px-8 py-4 text-[13px] font-semibold tracking-wide hover:border-gold hover:text-gold transition-all duration-300'>
                Join the Community
              </Link>
            </div>
          </Reveal>

          {/* Scroll indicator */}
          <div className='absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30'>
            <div className='w-px h-12 bg-white/40' style={{ animation: 'scaleY 1.5s ease-in-out infinite', transformOrigin: 'top' }} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          OUR STORY
      ══════════════════════════════════════════════════════════════════════ */}
      <section className='bg-[#f7f5f0] py-28'>
        <div className='max-w-[1152px] mx-auto px-6'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
            <div>
              <Reveal>
                <GoldLabel>Our Story</GoldLabel>
                <h2 className='font-display text-[42px] md:text-[52px] font-bold text-lux-black leading-tight mb-6'>
                  Built to solve a real problem.
                </h2>
                <div className='space-y-4 text-[16px] text-lux-mid leading-relaxed'>
                  <p>
                    The fashion and creative industry has always been difficult to break into.
                    Talented designers graduate with exceptional skills but no platform to
                    showcase their work to the world.
                  </p>
                  <p>
                    Agencies spend months searching for the right creative talent — only to
                    find the process slow, expensive, and scattered across different platforms.
                  </p>
                  <p>
                    Students hunger for quality fashion education that meets them where they are.
                    Professionals need a single destination to manage their portfolio, discover jobs,
                    publish ideas, and grow their audience.
                  </p>
                  <p className='text-lux-black font-medium'>
                    Ophelia was built to bring all of that into one elegant ecosystem.
                  </p>
                </div>
              </Reveal>
            </div>

            {/* Timeline */}
            <Reveal delay={150}>
              <div className='relative'>
                <div className='absolute left-5 top-0 bottom-0 w-px bg-gold/20' />
                {[
                  { year: '2023', title: 'The Idea', desc: 'A vision to create a unified ecosystem for fashion creatives emerged from a simple observation: too much talent, too little visibility.' },
                  { year: '2024', title: 'Building Begins', desc: 'Development started — portfolio tools, learning platform, job board, blog, and agency discovery all designed from scratch.' },
                  { year: '2025', title: 'Platform Launches', desc: 'Ophelia goes live with a complete suite of tools for designers, photographers, agencies, educators, and brands.' },
                  { year: '2026', title: 'Global Growth', desc: 'Expanding reach worldwide — empowering creatives across every continent to build, learn, and connect.' },
                ].map((item, i) => (
                  <div key={i} className='flex items-start gap-6 mb-8 last:mb-0'>
                    <div className='relative flex-shrink-0'>
                      <div className='w-10 h-10 rounded-full bg-lux-black border-2 border-gold flex items-center justify-center'>
                        <span className='text-gold text-[10px] font-bold'>{item.year}</span>
                      </div>
                    </div>
                    <div className='pt-2'>
                      <p className='font-semibold text-lux-black mb-1'>{item.title}</p>
                      <p className='text-[14px] text-lux-mid leading-relaxed'>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          STATS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className='bg-[#09090d] py-20'>
        <div className='max-w-[1152px] mx-auto px-6'>
          <Reveal>
            <p className='text-center text-[13px] font-semibold tracking-[0.2em] text-gold/60 uppercase mb-14'>Platform by the numbers</p>
          </Reveal>
          <div
            ref={statsReveal.ref}
            className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8'
          >
            <StatCounter value={stats.users} label='Registered Users' active={statsReveal.visible} />
            <StatCounter value={stats.works} label='Design Projects' active={statsReveal.visible} />
            <StatCounter value={stats.courses} label='Courses' active={statsReveal.visible} />
            <StatCounter value={stats.instructors} label='Instructors' active={statsReveal.visible} />
            <StatCounter value={stats.blogs} label='Blog Articles' active={statsReveal.visible} />
            <StatCounter value={stats.jobs} label='Job Listings' active={statsReveal.visible} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          MISSION & VISION
      ══════════════════════════════════════════════════════════════════════ */}
      <section className='bg-white py-28'>
        <div className='max-w-[1152px] mx-auto px-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
            {/* Mission */}
            <Reveal>
              <div className='bg-[#f7f5f0] border border-lux-border p-10 h-full'>
                <GoldLabel>Our Mission</GoldLabel>
                <h3 className='font-display text-[30px] font-bold text-lux-black text-center leading-tight mb-6'>
                  Accessible. Creative. Professional.
                </h3>
                <p className='text-[16px] text-lux-mid leading-relaxed text-center mb-8'>
                  "To create the world's most accessible platform for fashion creativity,
                  education, collaboration, and professional growth."
                </p>
                <div className='grid grid-cols-1 gap-3'>
                  {[
                    { icon: <Palette className='h-4 w-4' />, label: 'Creativity' },
                    { icon: <BookOpen className='h-4 w-4' />, label: 'Learning' },
                    { icon: <TrendingUp className='h-4 w-4' />, label: 'Opportunity' },
                    { icon: <Heart className='h-4 w-4' />, label: 'Community' },
                    { icon: <Zap className='h-4 w-4' />, label: 'Innovation' },
                  ].map(item => (
                    <div key={item.label} className='flex items-center gap-3'>
                      <div className='w-7 h-7 rounded-full bg-gold/10 flex items-center justify-center text-gold flex-shrink-0'>{item.icon}</div>
                      <span className='text-[14px] font-medium text-lux-black'>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Vision */}
            <Reveal delay={150}>
              <div className='bg-lux-black p-10 h-full'>
                <div className='flex items-center gap-3 justify-center mb-4'>
                  <div className='h-px w-10 bg-gold/40' />
                  <span className='text-[11px] font-semibold tracking-[0.2em] text-gold uppercase'>Our Vision</span>
                  <div className='h-px w-10 bg-gold/40' />
                </div>
                <h3 className='font-display text-[30px] font-bold text-white text-center leading-tight mb-6'>
                  Leading the Future of Fashion.
                </h3>
                <p className='text-[16px] text-white/60 leading-relaxed text-center mb-8'>
                  "To become the leading digital destination for fashion creators — empowering
                  millions of people to learn, create, showcase, and monetize their talent."
                </p>
                <div className='grid grid-cols-1 gap-4'>
                  {[
                    'A home for every fashion creative on earth',
                    'Education that closes the skills gap',
                    'Tools that turn passion into profession',
                    'A global network of talent and opportunity',
                    'Technology that amplifies human creativity',
                  ].map((v, i) => (
                    <div key={i} className='flex items-start gap-3'>
                      <CheckCircle className='h-4 w-4 text-gold flex-shrink-0 mt-0.5' />
                      <span className='text-[14px] text-white/70'>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          WHO WE SERVE
      ══════════════════════════════════════════════════════════════════════ */}
      <section className='bg-[#f7f5f0] py-28'>
        <div className='max-w-[1152px] mx-auto px-6'>
          <Reveal>
            <GoldLabel>Who We Serve</GoldLabel>
            <h2 className='font-display text-[42px] md:text-[52px] font-bold text-lux-black text-center leading-tight mb-4'>
              Built for every creative.
            </h2>
            <p className='text-[16px] text-lux-mid text-center max-w-xl mx-auto mb-14'>
              Whether you're just starting out or running a global agency — there's a place for you here.
            </p>
          </Reveal>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
            {[
              { icon: <Palette className='h-6 w-6' />, title: 'Fashion Designers', desc: 'Showcase portfolios, discover opportunities, and grow your audience across the world.' },
              { icon: <Camera className='h-6 w-6' />, title: 'Photographers', desc: 'Display your work, build your reputation, and connect with leading fashion brands.' },
              { icon: <Scissors className='h-6 w-6' />, title: 'Stylists', desc: 'Show your expertise, attract new clients, and establish your personal brand.' },
              { icon: <GraduationCap className='h-6 w-6' />, title: 'Students', desc: 'Learn from industry professionals, build real skills, and launch your career.' },
              { icon: <Building2 className='h-6 w-6' />, title: 'Agencies', desc: 'Discover top talent, recruit professionals, and grow your creative business.' },
              { icon: <ShoppingBag className='h-6 w-6' />, title: 'Brands', desc: 'Promote products, find creators, forge partnerships, and drive campaigns.' },
              { icon: <BookOpen className='h-6 w-6' />, title: 'Educators', desc: 'Teach courses, share knowledge, and monetize your expertise at scale.' },
              { icon: <Users className='h-6 w-6' />, title: 'Community', desc: 'Connect with thousands of creatives — collaborate, inspire, and grow together.' },
            ].map((card, i) => (
              <Reveal key={card.title} delay={i * 60}>
                <div className='group bg-white border border-lux-border p-6 hover:border-gold/40 hover:shadow-luxury transition-all duration-300 h-full'>
                  <div className='w-11 h-11 bg-gold/8 flex items-center justify-center text-gold mb-4 group-hover:bg-gold group-hover:text-white transition-all duration-300'>
                    {card.icon}
                  </div>
                  <h4 className='font-display font-semibold text-lux-black mb-2'>{card.title}</h4>
                  <p className='text-[13px] text-lux-mid leading-relaxed'>{card.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════════════════════════════ */}
      <section className='bg-[#09090d] py-28'>
        <div className='max-w-[1152px] mx-auto px-6'>
          <Reveal>
            <div className='flex items-center gap-3 justify-center mb-4'>
              <div className='h-px w-10 bg-gold/40' />
              <span className='text-[11px] font-semibold tracking-[0.2em] text-gold uppercase'>What You Can Do Here</span>
              <div className='h-px w-10 bg-gold/40' />
            </div>
            <h2 className='font-display text-[42px] md:text-[52px] font-bold text-white text-center leading-tight mb-14'>
              One platform.<br /><span className='text-gold'>Infinite possibilities.</span>
            </h2>
          </Reveal>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4'>
            {[
              { icon: <Palette className='h-5 w-5' />, label: 'Showcase Fashion Designs' },
              { icon: <Eye className='h-5 w-5' />, label: 'Build a Professional Portfolio' },
              { icon: <BookOpen className='h-5 w-5' />, label: 'Learn Fashion Skills' },
              { icon: <Newspaper className='h-5 w-5' />, label: 'Publish Fashion Blogs' },
              { icon: <Globe2 className='h-5 w-5' />, label: 'Discover Fashion News' },
              { icon: <Briefcase className='h-5 w-5' />, label: 'Apply for Fashion Jobs' },
              { icon: <Users className='h-5 w-5' />, label: 'Hire Creative Talent' },
              { icon: <Building2 className='h-5 w-5' />, label: 'Promote Agencies' },
              { icon: <GraduationCap className='h-5 w-5' />, label: 'Sell Courses' },
              { icon: <DollarSign className='h-5 w-5' />, label: 'Earn from Your Expertise' },
            ].map((feat, i) => (
              <Reveal key={feat.label} delay={i * 50}>
                <div className='flex items-center gap-3 p-4 border border-white/[0.07] hover:border-gold/30 hover:bg-white/[0.02] transition-all duration-300'>
                  <div className='w-9 h-9 rounded bg-gold/10 flex items-center justify-center text-gold flex-shrink-0'>{feat.icon}</div>
                  <span className='text-[13px] text-white/70 font-medium leading-snug'>{feat.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          CORE VALUES
      ══════════════════════════════════════════════════════════════════════ */}
      <section className='bg-white py-28'>
        <div className='max-w-[1152px] mx-auto px-6'>
          <Reveal>
            <GoldLabel>Our Core Values</GoldLabel>
            <h2 className='font-display text-[42px] md:text-[52px] font-bold text-lux-black text-center leading-tight mb-14'>
              What we stand for.
            </h2>
          </Reveal>
          <div className='grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4'>
            {[
              { icon: <Palette />, value: 'Creativity', desc: 'We champion original expression above all else.' },
              { icon: <Zap />, value: 'Innovation', desc: 'Always pushing the boundaries of what\'s possible.' },
              { icon: <Star />, value: 'Quality', desc: 'High standards in everything we build and deliver.' },
              { icon: <Heart />, value: 'Community', desc: 'People first — always building together.' },
              { icon: <TrendingUp />, value: 'Growth', desc: 'Committed to helping everyone level up.' },
              { icon: <Award />, value: 'Trust', desc: 'Transparent, honest, and reliable in all we do.' },
              { icon: <Globe2 />, value: 'Accessibility', desc: 'Fashion creativity is for everyone, everywhere.' },
            ].map((v, i) => (
              <Reveal key={v.value} delay={i * 60}>
                <div className='group text-center p-5 border border-lux-border hover:border-gold/40 transition-all duration-300'>
                  <div className='w-10 h-10 bg-[#f7f5f0] flex items-center justify-center mx-auto mb-3 text-gold group-hover:bg-gold group-hover:text-white transition-all duration-300'>
                    {v.icon}
                  </div>
                  <p className='font-display font-semibold text-[14px] text-lux-black mb-1.5'>{v.value}</p>
                  <p className='text-[11px] text-lux-muted leading-relaxed'>{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          COMMUNITY / TESTIMONIALS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className='bg-[#09090d] py-28'>
        <div className='max-w-[1152px] mx-auto px-6'>
          <Reveal>
            <div className='flex items-center gap-3 justify-center mb-4'>
              <div className='h-px w-10 bg-gold/40' />
              <span className='text-[11px] font-semibold tracking-[0.2em] text-gold uppercase'>Built for Creatives</span>
              <div className='h-px w-10 bg-gold/40' />
            </div>
            <h2 className='font-display text-[42px] md:text-[52px] font-bold text-white text-center leading-tight mb-4'>
              A community that lifts you up.
            </h2>
            <p className='text-[16px] text-white/50 text-center max-w-xl mx-auto mb-14'>
              Join thousands of designers, photographers, educators, and creatives who are already building their futures here.
            </p>
          </Reveal>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mb-14'>
            {[
              { quote: "Ophelia gave me the platform to share my designs with the world. Within weeks I had agencies reaching out for collaborations I never thought possible.", name: 'Amara B.', role: 'Fashion Designer, Lagos' },
              { quote: "I found my entire creative team through Ophelia. The quality of talent here is extraordinary — it's become essential to how we hire.", name: 'Sylvie M.', role: 'Creative Director, Paris' },
              { quote: "As a fashion educator, having a platform that actually understands our industry changed everything. My course has reached students across 30 countries.", name: 'Prof. Adeola K.', role: 'Fashion Educator, Accra' },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className='border border-white/[0.07] p-7 h-full flex flex-col'>
                  <div className='flex gap-0.5 mb-4'>
                    {Array.from({ length: 5 }).map((_, s) => <Star key={s} className='h-3.5 w-3.5 text-gold fill-gold' />)}
                  </div>
                  <p className='text-[15px] text-white/70 leading-relaxed flex-1 mb-6 italic'>"{t.quote}"</p>
                  <div className='flex items-center gap-3'>
                    <div className='w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-[13px] flex-shrink-0'>
                      {t.name[0]}
                    </div>
                    <div>
                      <p className='text-[13px] font-semibold text-white'>{t.name}</p>
                      <p className='text-[11px] text-white/40'>{t.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Community values row */}
          <div className='grid grid-cols-5 gap-4'>
            {['Creativity', 'Inclusiveness', 'Collaboration', 'Professional Growth', 'Innovation'].map((v, i) => (
              <Reveal key={v} delay={i * 60}>
                <div className='text-center py-4 border border-white/[0.07]'>
                  <p className='text-[12px] font-semibold tracking-wide text-gold uppercase'>{v}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          WHY CHOOSE US
      ══════════════════════════════════════════════════════════════════════ */}
      <section className='bg-[#f7f5f0] py-28'>
        <div className='max-w-[1152px] mx-auto px-6'>
          <Reveal>
            <GoldLabel>Why Choose Ophelia</GoldLabel>
            <h2 className='font-display text-[42px] md:text-[52px] font-bold text-lux-black text-center leading-tight mb-14'>
              An ecosystem, not just a platform.
            </h2>
          </Reveal>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            {[
              { icon: <Palette />, title: 'Fashion-Focused Ecosystem', desc: 'Purpose-built for fashion and creative professionals — not a generic portfolio site.' },
              { icon: <BookOpen />, title: 'Integrated Learning Platform', desc: 'A full Coursera-style learning hub with fashion courses, certifications, and instructors.' },
              { icon: <Eye />, title: 'Portfolio Creation Tools', desc: 'Beautiful, shareable portfolios that make your work look as good as it deserves.' },
              { icon: <Building2 />, title: 'Agency Discovery', desc: 'Agencies find talent and talent finds agencies — both in the same place.' },
              { icon: <GraduationCap />, title: 'Instructor Marketplace', desc: 'Anyone with expertise can become an instructor and earn from what they know.' },
              { icon: <Megaphone />, title: 'Advertising Solutions', desc: 'Promote your work, agency, or course to thousands of targeted fashion creatives.' },
              { icon: <Briefcase />, title: 'Fashion Job Board', desc: 'Post and find fashion roles — from internships to senior creative director positions.' },
              { icon: <Newspaper />, title: 'Built-in Fashion Blog', desc: 'Write, publish, and build thought leadership in the fashion and creative space.' },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 50}>
                <div className='flex items-start gap-5 p-6 bg-white border border-lux-border hover:border-gold/40 hover:shadow-card transition-all duration-300'>
                  <div className='w-10 h-10 flex items-center justify-center bg-gold/8 text-gold flex-shrink-0'>
                    {item.icon}
                  </div>
                  <div>
                    <p className='font-display font-semibold text-lux-black mb-1'>{item.title}</p>
                    <p className='text-[13px] text-lux-mid leading-relaxed'>{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          TEAM
      ══════════════════════════════════════════════════════════════════════ */}
      <section className='bg-white py-28'>
        <div className='max-w-[1152px] mx-auto px-6'>
          <Reveal>
            <GoldLabel>Meet the Team</GoldLabel>
            <h2 className='font-display text-[42px] md:text-[52px] font-bold text-lux-black text-center leading-tight mb-4'>
              The people behind Ophelia.
            </h2>
            <p className='text-[16px] text-lux-mid text-center max-w-xl mx-auto mb-14'>
              A passionate team of creatives, technologists, and fashion industry veterans dedicated to building something special.
            </p>
          </Reveal>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-5'>
            {[
              { initials: 'OP', name: 'Founder', role: 'CEO & Founder', bio: 'Visionary behind Ophelia — passionate about democratising access to fashion creativity worldwide.' },
              { initials: 'TL', name: 'Tech Lead', role: 'Head of Engineering', bio: 'Building the technical infrastructure that powers everything on the platform.' },
              { initials: 'CD', name: 'Creative Lead', role: 'Head of Design', bio: 'Ensuring every pixel of Ophelia communicates quality, elegance, and creative intent.' },
              { initials: 'GM', name: 'Growth Lead', role: 'Head of Community', bio: 'Cultivating the community, partnerships, and relationships that make Ophelia thrive.' },
            ].map((member, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className='text-center group'>
                  <div className='relative mx-auto w-24 h-24 rounded-full bg-[#f7f5f0] border-2 border-lux-border group-hover:border-gold transition-colors duration-300 flex items-center justify-center mb-4'>
                    <span className='font-display font-bold text-2xl text-gold'>{member.initials}</span>
                  </div>
                  <p className='font-display font-semibold text-lux-black'>{member.name}</p>
                  <p className='text-[12px] text-gold tracking-wide mb-2'>{member.role}</p>
                  <p className='text-[12px] text-lux-muted leading-relaxed'>{member.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          CONTACT
      ══════════════════════════════════════════════════════════════════════ */}
      <section className='bg-[#f7f5f0] py-20 border-t border-lux-border'>
        <div className='max-w-[1152px] mx-auto px-6 text-center'>
          <Reveal>
            <GoldLabel>Get in Touch</GoldLabel>
            <h2 className='font-display text-[36px] font-bold text-lux-black mb-3'>
              Have questions? We'd love to hear from you.
            </h2>
            <p className='text-[15px] text-lux-mid mb-10 max-w-lg mx-auto'>
              Whether you want to partner with us, get support, or just say hello — reach out any time.
            </p>
            <div className='flex flex-wrap items-center justify-center gap-5 mb-8'>
              <a href='mailto:hello@ophelia.com' className='flex items-center gap-2 text-[14px] text-lux-mid hover:text-gold transition-colors'>
                <Mail className='h-4 w-4' /> hello@ophelia.com
              </a>
              <a href='mailto:support@ophelia.com' className='flex items-center gap-2 text-[14px] text-lux-mid hover:text-gold transition-colors'>
                <Mail className='h-4 w-4' /> support@ophelia.com
              </a>
            </div>
            <div className='flex items-center justify-center gap-4'>
              {[
                { icon: <Instagram className='h-5 w-5' />, href: '#' },
                { icon: <Twitter className='h-5 w-5' />, href: '#' },
                { icon: <Linkedin className='h-5 w-5' />, href: '#' },
              ].map((s, i) => (
                <a key={i} href={s.href} className='w-10 h-10 border border-lux-border flex items-center justify-center text-lux-muted hover:border-gold hover:text-gold transition-all duration-200'>
                  {s.icon}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════════════════════ */}
      <section className='relative bg-[#09090d] py-32 overflow-hidden'>
        <div className='absolute inset-0 pointer-events-none' style={{ backgroundImage: 'linear-gradient(rgba(201,169,110,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,169,110,0.04) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none' style={{ background: 'radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)' }} />
        <div className='relative max-w-[1152px] mx-auto px-6 text-center'>
          <Reveal>
            <p className='text-[11px] font-semibold tracking-[0.2em] text-gold uppercase mb-6'>Join the Future of Fashion Creativity</p>
            <h2 className='font-display text-[48px] md:text-[64px] lg:text-[80px] font-bold text-white leading-[1.05] tracking-tight mb-6'>
              There's a place<br />for you here.
            </h2>
            <p className='text-[17px] text-white/50 max-w-xl mx-auto mb-10 leading-relaxed'>
              Whether you're a designer, photographer, student, agency, educator, or brand —
              your creative journey starts here.
            </p>
            <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
              <Link href='/sign-up' className='group inline-flex items-center gap-2 bg-gold text-white px-10 py-4 text-[13px] font-semibold tracking-wide hover:bg-gold-deep transition-colors duration-300'>
                Create Free Account
                <ArrowRight className='h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5' />
              </Link>
              <Link href='/' className='inline-flex items-center gap-2 border border-white/20 text-white/70 px-10 py-4 text-[13px] font-semibold tracking-wide hover:border-gold/40 hover:text-white transition-all duration-300'>
                Explore the Platform
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  );
}
