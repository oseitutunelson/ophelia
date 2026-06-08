'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Award, Flame, Clock, ChevronRight, Star } from 'lucide-react';
import axios from 'axios';
import { CATEGORY_GRADIENTS } from '@/lib/learn-utils';

interface EnrollmentWithCourse {
  id: string;
  courseId: string;
  progressPct: number;
  status: string;
  completedAt?: string | null;
  course: {
    id: string;
    title: string;
    thumbnail?: string | null;
    category: string;
    totalLessons: number;
    hasCertificate: boolean;
    instructor?: { userId: string } | null;
    instructorName?: string;
  };
}

interface Certificate {
  id: string;
  courseTitle: string;
  instructorName: string;
  completedAt: string;
  certificateId: string;
  courseId: string;
}

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className='h-1.5 bg-lux-border rounded-full overflow-hidden'>
      <div className='h-full bg-gold rounded-full transition-all duration-500' style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function AccountLearningList() {
  const [enrollments, setEnrollments] = useState<EnrollmentWithCourse[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'in-progress' | 'completed' | 'certificates'>('in-progress');

  useEffect(() => {
    async function load() {
      try {
        const [enrRes, certRes] = await Promise.all([
          axios.get('/api/learn/enrollments'),
          axios.get('/api/learn/certificates'),
        ]);
        setEnrollments(enrRes.data ?? []);
        setCertificates(certRes.data ?? []);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const inProgress = enrollments.filter(e => e.status === 'active' && e.progressPct < 100);
  const completed  = enrollments.filter(e => e.status === 'completed' || e.progressPct === 100);

  const tabs = [
    { key: 'in-progress' as const,  label: 'In Progress', count: inProgress.length },
    { key: 'completed'  as const,  label: 'Completed',   count: completed.length },
    { key: 'certificates' as const, label: 'Certificates', count: certificates.length },
  ];

  if (loading) {
    return (
      <div className='space-y-4'>
        {[1, 2, 3].map(i => (
          <div key={i} className='h-20 bg-lux-hover animate-pulse rounded-sm' />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Stats */}
      <div className='grid grid-cols-3 gap-4 mb-8'>
        {[
          { icon: BookOpen, label: 'Enrolled',     value: enrollments.length },
          { icon: Award,    label: 'Certificates', value: certificates.length },
          { icon: Flame,    label: 'Day Streak',   value: '–' },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className='bg-lux-bg border border-lux-border p-4 text-center'>
            <Icon className='h-5 w-5 text-gold mx-auto mb-2' />
            <p className='text-2xl font-bold text-lux-black font-display'>{value}</p>
            <p className='text-xs text-lux-muted mt-0.5'>{label}</p>
          </div>
        ))}
      </div>

      {/* Tab nav */}
      <div className='flex gap-1 border-b border-lux-border mb-6'>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors duration-200 border-b-2 -mb-px ${
              tab === t.key
                ? 'border-lux-black text-lux-black'
                : 'border-transparent text-lux-muted hover:text-lux-mid'
            }`}
          >
            {t.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              tab === t.key ? 'bg-lux-black text-white' : 'bg-lux-border text-lux-mid'
            }`}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'in-progress' && (
        <div className='space-y-3'>
          {inProgress.length === 0 && (
            <div className='text-center py-16'>
              <BookOpen className='h-10 w-10 text-lux-muted mx-auto mb-3' />
              <p className='text-lux-mid font-medium mb-1'>No courses in progress</p>
              <p className='text-sm text-lux-muted mb-4'>Start learning today</p>
              <Link href='/learn/courses' className='text-sm text-gold hover:underline'>Browse courses →</Link>
            </div>
          )}
          {inProgress.map(e => (
            <CourseEnrollmentRow key={e.id} enrollment={e} />
          ))}
        </div>
      )}

      {tab === 'completed' && (
        <div className='space-y-3'>
          {completed.length === 0 && (
            <div className='text-center py-16'>
              <Award className='h-10 w-10 text-lux-muted mx-auto mb-3' />
              <p className='text-lux-mid font-medium mb-1'>No completed courses yet</p>
              <p className='text-sm text-lux-muted'>Keep learning to earn your first certificate</p>
            </div>
          )}
          {completed.map(e => (
            <CourseEnrollmentRow key={e.id} enrollment={e} isCompleted />
          ))}
        </div>
      )}

      {tab === 'certificates' && (
        <div className='space-y-3'>
          {certificates.length === 0 && (
            <div className='text-center py-16'>
              <Award className='h-10 w-10 text-lux-muted mx-auto mb-3' />
              <p className='text-lux-mid font-medium mb-1'>No certificates yet</p>
              <p className='text-sm text-lux-muted'>Complete a course to earn your certificate</p>
            </div>
          )}
          {certificates.map(cert => (
            <div key={cert.id} className='flex items-center gap-4 p-4 bg-white border border-lux-border hover:shadow-card transition-shadow duration-200'>
              <div className='h-12 w-12 bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0'>
                <Award className='h-6 w-6 text-gold' />
              </div>
              <div className='flex-1 min-w-0'>
                <p className='font-medium text-lux-black text-sm truncate'>{cert.courseTitle}</p>
                <p className='text-xs text-lux-muted mt-0.5'>
                  by {cert.instructorName} · {new Date(cert.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <p className='text-xs text-lux-subtle font-mono mt-0.5'>{cert.certificateId}</p>
              </div>
              <Link
                href={`/learn/courses/${cert.courseId}/certificate`}
                className='flex items-center gap-1 text-xs text-gold hover:underline flex-shrink-0'
              >
                View <ChevronRight className='h-3 w-3' />
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className='mt-6 pt-4 border-t border-lux-border flex items-center justify-between'>
        <Link href='/learn/courses' className='text-sm text-lux-mid hover:text-lux-black transition-colors duration-200'>
          Browse more courses →
        </Link>
        <Link href='/teach' className='text-sm text-gold hover:underline'>
          Become an Instructor
        </Link>
      </div>
    </div>
  );
}

function CourseEnrollmentRow({ enrollment, isCompleted }: { enrollment: EnrollmentWithCourse; isCompleted?: boolean }) {
  const gradient = CATEGORY_GRADIENTS[enrollment.course.category] ?? 'from-neutral-100 to-stone-50';
  return (
    <div className='flex items-center gap-4 p-4 bg-white border border-lux-border hover:shadow-card transition-shadow duration-200'>
      <div className={`relative w-16 h-12 flex-shrink-0 bg-gradient-to-br ${gradient} overflow-hidden`}>
        {enrollment.course.thumbnail && (
          <Image src={enrollment.course.thumbnail} alt={enrollment.course.title} fill className='object-cover' />
        )}
      </div>
      <div className='flex-1 min-w-0'>
        <p className='font-medium text-lux-black text-sm truncate'>{enrollment.course.title}</p>
        <p className='text-xs text-lux-muted mb-1.5'>{enrollment.course.category}</p>
        <ProgressBar pct={enrollment.progressPct} />
        <p className='text-xs text-lux-muted mt-1'>{enrollment.progressPct}% complete</p>
      </div>
      <Link
        href={`/learn/courses/${enrollment.courseId}/learn`}
        className='flex items-center gap-1 text-xs text-gold hover:underline flex-shrink-0'
      >
        {isCompleted ? 'Review' : 'Continue'} <ChevronRight className='h-3 w-3' />
      </Link>
    </div>
  );
}
