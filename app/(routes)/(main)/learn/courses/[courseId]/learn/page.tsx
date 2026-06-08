'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Menu, X, Award, CheckCircle, FileText, Download } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';
import { getVideoEmbedUrl } from '@/lib/learn-utils';
import LessonSidebar from '@/components/lesson-sidebar';

interface Lesson {
  id: string; title: string; type: string; content?: string;
  duration: number; isFree: boolean; order: number;
  resources: string[];
}
interface Module {
  id: string; title: string; order: number; lessons: Lesson[];
}
interface Course {
  id: string; title: string; hasCertificate: boolean;
  modules: Module[];
}
interface Progress {
  lessonId: string; completed: boolean;
}

export default function CoursePlayerPage() {
  const { courseId } = useParams() as { courseId: string };
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<{ enrolled: boolean; enrollment?: { id: string; progressPct: number } } | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [markingDone, setMarkingDone] = useState(false);

  useEffect(() => {
    if (!isSignedIn) { router.push('/sign-in'); return; }

    async function load() {
      try {
        const [courseRes, enrRes] = await Promise.all([
          axios.get(`/api/courses/${courseId}`),
          axios.get(`/api/courses/${courseId}/enroll`),
        ]);

        if (!enrRes.data.enrolled) {
          router.push(`/learn/courses/${courseId}`);
          return;
        }

        setCourse(courseRes.data);
        setEnrollment(enrRes.data);

        const lessonProgress: Progress[] = enrRes.data.enrollment?.progress ?? [];
        setProgress(lessonProgress);

        // Set first lesson as active
        const firstLesson = courseRes.data.modules?.[0]?.lessons?.[0];
        if (firstLesson) setActiveLesson(firstLesson);
      } catch {
        router.push('/learn/courses');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [courseId, isSignedIn, router]);

  async function markComplete() {
    if (!activeLesson || !enrollment?.enrollment) return;
    setMarkingDone(true);
    try {
      await axios.patch(`/api/learn/progress`, {
        lessonId: activeLesson.id,
        enrollmentId: enrollment.enrollment.id,
        completed: true,
      });
      setProgress(prev => {
        const existing = prev.find(p => p.lessonId === activeLesson.id);
        if (existing) return prev.map(p => p.lessonId === activeLesson.id ? { ...p, completed: true } : p);
        return [...prev, { lessonId: activeLesson.id, completed: true }];
      });

      // Auto-advance to next lesson
      const allLessons = course?.modules.flatMap(m => m.lessons) ?? [];
      const idx = allLessons.findIndex(l => l.id === activeLesson.id);
      if (idx < allLessons.length - 1) setActiveLesson(allLessons[idx + 1]);
    } finally {
      setMarkingDone(false);
    }
  }

  const completedIds = progress.filter(p => p.completed).map(p => p.lessonId);
  const allLessons = course?.modules.flatMap(m => m.lessons) ?? [];
  const isCurrentComplete = activeLesson ? completedIds.includes(activeLesson.id) : false;
  const allComplete = allLessons.length > 0 && allLessons.every(l => completedIds.includes(l.id));

  if (loading) {
    return (
      <div className='h-screen flex items-center justify-center bg-lux-black'>
        <div className='h-8 w-8 border-2 border-gold border-t-transparent animate-spin' />
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className='h-screen flex flex-col bg-lux-black'>
      {/* Top bar */}
      <div className='flex items-center justify-between h-14 px-4 bg-lux-black border-b border-white/10 flex-shrink-0'>
        <div className='flex items-center gap-3'>
          <Link href={`/learn/courses/${courseId}`} className='text-white/60 hover:text-white transition-colors duration-200'>
            <ChevronLeft className='h-5 w-5' />
          </Link>
          <h1 className='text-sm font-medium text-white line-clamp-1 max-w-xs hidden sm:block'>{course.title}</h1>
        </div>
        <div className='flex items-center gap-3'>
          {allComplete && course.hasCertificate && (
            <Link
              href={`/learn/courses/${courseId}/certificate`}
              className='flex items-center gap-1.5 text-xs text-gold hover:underline'
            >
              <Award className='h-4 w-4' /> Get Certificate
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className='text-white/60 hover:text-white transition-colors duration-200 p-1'
          >
            {sidebarOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className='flex flex-1 overflow-hidden'>
        {/* Content area */}
        <div className='flex-1 flex flex-col overflow-hidden'>
          {activeLesson && (
            <>
              {/* Video / Text content */}
              <div className='flex-1 overflow-auto'>
                {activeLesson.type === 'video' && activeLesson.content && (
                  <div className='relative w-full bg-black' style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      src={getVideoEmbedUrl(activeLesson.content) ?? activeLesson.content}
                      className='absolute inset-0 w-full h-full'
                      allow='autoplay; fullscreen; picture-in-picture'
                      allowFullScreen
                    />
                  </div>
                )}

                {activeLesson.type === 'text' && (
                  <div className='max-w-3xl mx-auto px-6 py-8'>
                    <div className='prose prose-sm text-white/80 max-w-none' dangerouslySetInnerHTML={{ __html: activeLesson.content ?? '' }} />
                  </div>
                )}

                {/* Lesson info */}
                <div className='max-w-3xl mx-auto px-6 py-6'>
                  <div className='flex items-start justify-between gap-4 mb-4'>
                    <h2 className='text-xl font-semibold text-white'>{activeLesson.title}</h2>
                    <button
                      onClick={markComplete}
                      disabled={isCurrentComplete || markingDone}
                      className={`flex items-center gap-2 text-sm px-4 py-2 flex-shrink-0 transition-colors duration-200 ${
                        isCurrentComplete
                          ? 'bg-emerald-600/20 text-emerald-400 cursor-default'
                          : 'bg-gold/20 text-gold hover:bg-gold/30'
                      }`}
                    >
                      <CheckCircle className='h-4 w-4' />
                      {isCurrentComplete ? 'Completed' : markingDone ? 'Saving…' : 'Mark Complete'}
                    </button>
                  </div>

                  {/* Resources */}
                  {activeLesson.resources.length > 0 && (
                    <div className='mt-4 p-4 bg-white/5 border border-white/10'>
                      <p className='text-xs font-medium text-white/60 mb-3 uppercase tracking-wide'>Downloads</p>
                      <div className='space-y-2'>
                        {activeLesson.resources.map((url, i) => (
                          <a key={i} href={url} target='_blank' rel='noopener noreferrer'
                            className='flex items-center gap-2 text-sm text-gold hover:underline'>
                            <Download className='h-4 w-4' /> Resource {i + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className='h-1 bg-white/10 flex-shrink-0'>
                <div
                  className='h-full bg-gold transition-all duration-500'
                  style={{ width: `${allLessons.length > 0 ? (completedIds.length / allLessons.length) * 100 : 0}%` }}
                />
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        {sidebarOpen && (
          <div className='w-80 flex-shrink-0 bg-[#111] border-l border-white/10 overflow-hidden flex flex-col'>
            <div className='flex-1 overflow-auto text-white'>
              {course.modules.map((mod, mi) => (
                <div key={mod.id} className='border-b border-white/10'>
                  <div className='px-4 py-3 bg-white/5'>
                    <p className='text-xs font-semibold text-white/60 uppercase tracking-wide'>
                      Module {mi + 1}: {mod.title}
                    </p>
                  </div>
                  {mod.lessons.map(lesson => {
                    const isActive = lesson.id === activeLesson?.id;
                    const isComplete = completedIds.includes(lesson.id);
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left border-t border-white/5 transition-colors duration-200 ${
                          isActive ? 'bg-gold/10 border-l-2 border-l-gold' : 'hover:bg-white/5'
                        }`}
                      >
                        {isComplete ? (
                          <CheckCircle className='h-4 w-4 text-emerald-400 flex-shrink-0' />
                        ) : isActive ? (
                          <div className='h-4 w-4 border-2 border-gold rounded-full flex-shrink-0' />
                        ) : (
                          <div className='h-4 w-4 border border-white/20 rounded-full flex-shrink-0' />
                        )}
                        <span className={`text-xs flex-1 truncate ${isActive ? 'text-white font-medium' : 'text-white/60'}`}>
                          {lesson.title}
                        </span>
                        {lesson.duration > 0 && (
                          <span className='text-xs text-white/30 flex-shrink-0'>{lesson.duration}m</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
