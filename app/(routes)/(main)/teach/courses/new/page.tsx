import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import db from '@/lib/db';
import CourseCreationForm from '@/components/course-creation-form';

export const metadata: Metadata = {
  title: 'Create New Course | Ophelia Academy',
};

export default async function NewCoursePage() {
  const { userId } = auth();
  if (!userId) redirect('/sign-in?redirect=/teach/courses/new');

  const instructor = await db.instructor.findUnique({ where: { userId } });
  if (!instructor) redirect('/teach/apply');

  return (
    <div className='min-h-screen bg-lux-bg pt-[72px]'>
      <div className='max-w-[900px] mx-auto px-6 py-12'>
        <Link href='/teach/dashboard' className='flex items-center gap-2 text-lux-mid hover:text-lux-black text-sm transition-colors duration-200 mb-8'>
          <ArrowLeft className='h-4 w-4' /> Back to Dashboard
        </Link>

        <div className='mb-8'>
          <h1 className='font-display text-3xl font-bold text-lux-black mb-2'>Create a New Course</h1>
          <p className='text-lux-muted text-sm'>
            After creating your course, you'll be taken to the course editor where you can add modules, lessons, and content.
          </p>
        </div>

        <CourseCreationForm />
      </div>
    </div>
  );
}
