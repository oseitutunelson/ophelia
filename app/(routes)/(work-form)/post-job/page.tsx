import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import JobForm from '@/components/job-form';

export default function PostJobPage() {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className='min-h-screen bg-white'>
      <div className='w-full max-w-2xl mx-auto px-6 lg:px-10 py-16'>
        <div className='mb-12'>
          <h1 className='text-4xl font-bold text-[#3d3d4e] mb-3'>Post a Job</h1>
          <p className='text-lg text-[#9e9ea7]'>
            Share your fashion job opportunity with our community
          </p>
        </div>

        <div className='border border-[#e7e7e9] rounded-lg p-8 shadow-sm'>
          <JobForm />
        </div>
      </div>
    </div>
  );
}
