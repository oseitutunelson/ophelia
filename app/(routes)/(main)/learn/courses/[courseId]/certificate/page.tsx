'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Award } from 'lucide-react';
import axios from 'axios';
import { useAuth, useUser } from '@clerk/nextjs';
import CertificateViewer from '@/components/certificate-viewer';

interface CertData {
  courseTitle: string;
  instructorName: string;
  completedAt: string;
  certificateId: string;
}

export default function CertificatePage() {
  const { courseId } = useParams() as { courseId: string };
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const [cert, setCert] = useState<CertData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isSignedIn) { router.push('/sign-in'); return; }

    async function load() {
      try {
        const res = await axios.get(`/api/courses/${courseId}/certificate`);
        setCert(res.data);
      } catch {
        setError('Certificate not found. Complete the course to earn your certificate.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [courseId, isSignedIn, router]);

  const studentName = user ? `${user.firstName} ${user.lastName}`.trim() : 'Student';

  return (
    <div className='min-h-screen bg-lux-bg pt-[72px]'>
      {/* Header */}
      <div className='max-w-[1152px] mx-auto px-6 py-8'>
        <Link href={`/learn/courses/${courseId}/learn`} className='flex items-center gap-2 text-lux-mid hover:text-lux-black text-sm transition-colors duration-200 mb-8'>
          <ArrowLeft className='h-4 w-4' /> Back to course
        </Link>

        <div className='text-center mb-10'>
          <Award className='h-12 w-12 text-gold mx-auto mb-3' />
          <h1 className='font-display text-4xl font-bold text-lux-black mb-2'>Your Certificate</h1>
          <p className='text-lux-muted text-sm'>Download, print, or share your achievement</p>
        </div>

        {loading && (
          <div className='flex justify-center py-16'>
            <div className='h-8 w-8 border-2 border-gold border-t-transparent animate-spin' />
          </div>
        )}

        {error && (
          <div className='max-w-lg mx-auto text-center py-16'>
            <p className='text-lux-mid mb-4'>{error}</p>
            <Link href={`/learn/courses/${courseId}/learn`} className='text-sm text-gold hover:underline'>
              Return to course →
            </Link>
          </div>
        )}

        {cert && !loading && (
          <CertificateViewer
            studentName={studentName}
            courseTitle={cert.courseTitle}
            instructorName={cert.instructorName}
            completedAt={cert.completedAt}
            certificateId={cert.certificateId}
          />
        )}
      </div>
    </div>
  );
}
