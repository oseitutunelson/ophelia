import { Metadata } from 'next';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import InstructorApplicationForm from '@/components/instructor-application-form';
import db from '@/lib/db';

export const metadata: Metadata = {
  title: 'Apply to Teach | Ophelia Academy',
  description: 'Submit your application to become an instructor on Ophelia.',
};

export default async function TeachApplyPage() {
  const { userId } = auth();
  if (!userId) redirect('/sign-in?redirect=/teach/apply');

  // Check if already applied or is an instructor
  const [existing, instructor] = await Promise.all([
    db.instructorApplication.findUnique({ where: { userId } }),
    db.instructor.findUnique({ where: { userId } }),
  ]);

  if (instructor) redirect('/teach/dashboard');

  return (
    <div className='min-h-screen bg-lux-bg pt-[72px]'>
      <div className='max-w-[800px] mx-auto px-6 py-12'>
        <Link href='/teach' className='flex items-center gap-2 text-lux-mid hover:text-lux-black text-sm transition-colors duration-200 mb-10'>
          <ArrowLeft className='h-4 w-4' /> Back to Teaching Hub
        </Link>

        {/* Header */}
        <div className='text-center mb-10'>
          <div className='w-14 h-14 bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-4'>
            <GraduationCap className='h-7 w-7 text-gold' />
          </div>
          <h1 className='font-display text-4xl font-bold text-lux-black mb-2'>Instructor Application</h1>
          <p className='text-lux-muted text-sm max-w-md mx-auto'>
            Complete the 4-step application to join Ophelia Academy as a verified instructor.
          </p>
        </div>

        {/* Already applied */}
        {existing && existing.status === 'pending' && (
          <div className='mb-8 p-5 bg-amber-50 border border-amber-200 text-center'>
            <p className='font-medium text-amber-800 mb-1'>Application Under Review</p>
            <p className='text-sm text-amber-700'>
              We received your application. Our team will respond within 5 business days.
            </p>
          </div>
        )}

        {existing && existing.status === 'rejected' && (
          <div className='mb-8 p-5 bg-red-50 border border-red-200'>
            <p className='font-medium text-red-800 mb-1'>Application Not Approved</p>
            {existing.reviewNote && (
              <p className='text-sm text-red-700'>Feedback: {existing.reviewNote}</p>
            )}
            <p className='text-sm text-red-600 mt-2'>
              You're welcome to reapply after improving your portfolio or teaching sample.
            </p>
          </div>
        )}

        {/* Show form only if no pending/rejected application */}
        {!existing && <InstructorApplicationForm />}
      </div>
    </div>
  );
}
