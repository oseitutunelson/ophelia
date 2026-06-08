'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, ChevronRight, X, Plus } from 'lucide-react';
import axios from 'axios';

const STEPS = [
  { title: 'Your Profile', desc: 'Tell us about yourself' },
  { title: 'Your Experience', desc: 'Share your expertise' },
  { title: 'Portfolio & Sample', desc: 'Show your work' },
  { title: 'Review & Submit', desc: 'Final confirmation' },
];

export default function InstructorApplicationForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    bio: '',
    expertise: [] as string[],
    expertiseInput: '',
    experience: '',
    portfolioUrl: '',
    sampleLessonUrl: '',
  });

  function addExpertise() {
    const val = form.expertiseInput.trim();
    if (val && !form.expertise.includes(val)) {
      setForm(f => ({ ...f, expertise: [...f.expertise, val], expertiseInput: '' }));
    }
  }

  function removeExpertise(tag: string) {
    setForm(f => ({ ...f, expertise: f.expertise.filter(e => e !== tag) }));
  }

  function canProceed() {
    if (step === 0) return form.fullName.trim() && form.bio.trim().length >= 50;
    if (step === 1) return form.expertise.length > 0 && form.experience.trim().length >= 100;
    return true;
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError('');
    try {
      await axios.post('/api/instructor/apply', {
        fullName: form.fullName,
        bio: form.bio,
        expertise: form.expertise,
        experience: form.experience,
        portfolioUrl: form.portfolioUrl || undefined,
        sampleLessonUrl: form.sampleLessonUrl || undefined,
      });
      setDone(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setError(msg ?? 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className='text-center py-16 max-w-md mx-auto'>
        <div className='w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4'>
          <CheckCircle className='h-8 w-8 text-emerald-600' />
        </div>
        <h2 className='font-display text-2xl font-bold text-lux-black mb-2'>Application Submitted!</h2>
        <p className='text-lux-mid mb-6'>
          We'll review your application and get back to you within 5 business days.
          You'll receive an email once your application is approved.
        </p>
        <button
          onClick={() => router.push('/teach')}
          className='px-6 py-3 bg-lux-black text-white text-sm font-medium hover:bg-lux-dark transition-colors duration-200'
        >
          Back to Teaching Hub
        </button>
      </div>
    );
  }

  return (
    <div className='max-w-2xl mx-auto'>
      {/* Step indicators */}
      <div className='flex items-center mb-10'>
        {STEPS.map((s, i) => (
          <div key={i} className='flex items-center flex-1'>
            <div className={`flex items-center gap-2 ${i <= step ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors duration-300 ${
                i < step ? 'bg-gold text-white' : i === step ? 'bg-lux-black text-white' : 'bg-lux-border text-lux-mid'
              }`}>
                {i < step ? <CheckCircle className='h-4 w-4' /> : i + 1}
              </div>
              <div className='hidden sm:block'>
                <p className='text-xs font-semibold text-lux-black'>{s.title}</p>
                <p className='text-xs text-lux-muted'>{s.desc}</p>
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-3 transition-colors duration-300 ${i < step ? 'bg-gold' : 'bg-lux-border'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 0: Profile */}
      {step === 0 && (
        <div className='space-y-5'>
          <h2 className='font-display text-2xl font-bold text-lux-black'>Your Profile</h2>
          <div>
            <label className='block text-sm font-medium text-lux-black mb-1.5'>Full Name *</label>
            <input
              value={form.fullName}
              onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
              placeholder='Your full name'
              className='w-full border border-lux-border px-4 py-3 text-sm text-lux-black focus:outline-none focus:border-lux-black placeholder:text-lux-muted'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-lux-black mb-1.5'>Bio *</label>
            <p className='text-xs text-lux-muted mb-2'>Minimum 50 characters. Describe your background, passion, and teaching style.</p>
            <textarea
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              placeholder='I am a fashion designer with 10 years of experience in luxury apparel...'
              rows={5}
              className='w-full border border-lux-border px-4 py-3 text-sm text-lux-black resize-none focus:outline-none focus:border-lux-black placeholder:text-lux-muted'
            />
            <p className={`text-xs mt-1 ${form.bio.length >= 50 ? 'text-emerald-600' : 'text-lux-muted'}`}>
              {form.bio.length}/50 min characters
            </p>
          </div>
        </div>
      )}

      {/* Step 1: Experience */}
      {step === 1 && (
        <div className='space-y-5'>
          <h2 className='font-display text-2xl font-bold text-lux-black'>Your Expertise</h2>
          <div>
            <label className='block text-sm font-medium text-lux-black mb-1.5'>Areas of Expertise *</label>
            <div className='flex gap-2 mb-3'>
              <input
                value={form.expertiseInput}
                onChange={e => setForm(f => ({ ...f, expertiseInput: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addExpertise())}
                placeholder='e.g. Fashion Design, Pattern Making'
                className='flex-1 border border-lux-border px-4 py-2.5 text-sm text-lux-black focus:outline-none focus:border-lux-black placeholder:text-lux-muted'
              />
              <button type='button' onClick={addExpertise} className='px-4 py-2.5 bg-lux-black text-white text-sm'>
                <Plus className='h-4 w-4' />
              </button>
            </div>
            <div className='flex flex-wrap gap-2'>
              {form.expertise.map(tag => (
                <span key={tag} className='flex items-center gap-1.5 text-xs bg-lux-hover border border-lux-border px-3 py-1.5 text-lux-black'>
                  {tag}
                  <button onClick={() => removeExpertise(tag)} type='button'>
                    <X className='h-3 w-3 text-lux-muted' />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium text-lux-black mb-1.5'>Professional Experience *</label>
            <p className='text-xs text-lux-muted mb-2'>Minimum 100 characters. Describe your industry experience.</p>
            <textarea
              value={form.experience}
              onChange={e => setForm(f => ({ ...f, experience: e.target.value }))}
              placeholder="Describe your years of experience, notable projects, brands you've worked with, and any teaching experience..."
              rows={6}
              className='w-full border border-lux-border px-4 py-3 text-sm text-lux-black resize-none focus:outline-none focus:border-lux-black placeholder:text-lux-muted'
            />
            <p className={`text-xs mt-1 ${form.experience.length >= 100 ? 'text-emerald-600' : 'text-lux-muted'}`}>
              {form.experience.length}/100 min characters
            </p>
          </div>
        </div>
      )}

      {/* Step 2: Portfolio */}
      {step === 2 && (
        <div className='space-y-5'>
          <h2 className='font-display text-2xl font-bold text-lux-black'>Portfolio & Sample Lesson</h2>
          <div>
            <label className='block text-sm font-medium text-lux-black mb-1.5'>Portfolio URL</label>
            <p className='text-xs text-lux-muted mb-2'>Link to your portfolio, website, or Behance/Dribbble profile.</p>
            <input
              value={form.portfolioUrl}
              onChange={e => setForm(f => ({ ...f, portfolioUrl: e.target.value }))}
              type='url'
              placeholder='https://yourportfolio.com'
              className='w-full border border-lux-border px-4 py-3 text-sm text-lux-black focus:outline-none focus:border-lux-black placeholder:text-lux-muted'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-lux-black mb-1.5'>Sample Lesson URL</label>
            <p className='text-xs text-lux-muted mb-2'>Link to a YouTube, Vimeo, or Loom video showing your teaching style.</p>
            <input
              value={form.sampleLessonUrl}
              onChange={e => setForm(f => ({ ...f, sampleLessonUrl: e.target.value }))}
              type='url'
              placeholder='https://youtube.com/watch?v=...'
              className='w-full border border-lux-border px-4 py-3 text-sm text-lux-black focus:outline-none focus:border-lux-black placeholder:text-lux-muted'
            />
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className='space-y-5'>
          <h2 className='font-display text-2xl font-bold text-lux-black'>Review Your Application</h2>
          <div className='space-y-4 p-6 bg-lux-bg border border-lux-border'>
            <Row label='Full Name' value={form.fullName} />
            <Row label='Bio' value={form.bio} />
            <Row label='Expertise' value={form.expertise.join(', ')} />
            <Row label='Experience' value={form.experience} />
            {form.portfolioUrl && <Row label='Portfolio' value={form.portfolioUrl} />}
            {form.sampleLessonUrl && <Row label='Sample Lesson' value={form.sampleLessonUrl} />}
          </div>
          {error && (
            <div className='p-4 bg-red-50 border border-red-200 text-red-700 text-sm'>{error}</div>
          )}
          <p className='text-xs text-lux-muted'>
            By submitting, you agree to Ophelia's instructor terms and content guidelines.
            Our team will review your application within 5 business days.
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className='flex items-center justify-between mt-8 pt-6 border-t border-lux-border'>
        <button
          type='button'
          onClick={() => setStep(s => s - 1)}
          disabled={step === 0}
          className='px-5 py-2.5 border border-lux-border text-sm text-lux-mid hover:text-lux-black hover:border-lux-black transition-colors duration-200 disabled:opacity-30'
        >
          Back
        </button>
        {step < STEPS.length - 1 ? (
          <button
            type='button'
            onClick={() => setStep(s => s + 1)}
            disabled={!canProceed()}
            className='flex items-center gap-2 px-6 py-2.5 bg-lux-black text-white text-sm font-medium hover:bg-lux-dark transition-colors duration-200 disabled:opacity-50'
          >
            Continue <ChevronRight className='h-4 w-4' />
          </button>
        ) : (
          <button
            type='button'
            onClick={handleSubmit}
            disabled={submitting}
            className='px-6 py-2.5 bg-gold text-white text-sm font-medium hover:bg-gold-deep transition-colors duration-200 disabled:opacity-50'
          >
            {submitting ? 'Submitting…' : 'Submit Application'}
          </button>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className='text-xs text-lux-muted mb-0.5'>{label}</p>
      <p className='text-sm text-lux-black break-words'>{value || '—'}</p>
    </div>
  );
}
