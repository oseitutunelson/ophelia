'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star, Clock, Users, BookOpen, Award, CheckCircle, Play,
  Bookmark, Share2, ChevronDown, ChevronRight, BadgeCheck, ArrowLeft,
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';
import { CATEGORY_GRADIENTS, formatDuration } from '@/lib/learn-utils';
import CourseReviewSection from '@/components/course-review-section';
import InstructorCard from '@/components/instructor-card';

interface CourseDetail {
  id: string; slug: string; title: string; description: string;
  shortDescription?: string; thumbnail?: string; previewVideo?: string;
  category: string; level: string; price: number; isFree: boolean;
  isPublished: boolean; totalDuration: number; totalLessons: number;
  hasCertificate: boolean; requirements: string[]; objectives: string[];
  enrollmentCount: number; rating: number; ratingCount: number;
  instructor: {
    id: string; userId: string; bio?: string; expertise: string[];
    isVerified: boolean; totalStudents: number; totalCourses: number; rating: number;
  };
  modules: {
    id: string; title: string; order: number;
    lessons: { id: string; title: string; type: string; duration: number; isFree: boolean; order: number }[];
  }[];
  reviews: { id: string; userId: string; rating: number; comment?: string; createdAt: string }[];
  _count: { enrollments: number; reviews: number };
}

interface EnrollmentStatus {
  enrolled: boolean;
  enrollment?: { progressPct: number; status: string };
}

export default function CourseDetailPage() {
  const { courseId } = useParams() as { courseId: string };
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [enrollment, setEnrollment] = useState<EnrollmentStatus>({ enrolled: false });
  const [bookmarked, setBookmarked] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openModules, setOpenModules] = useState<Set<string>>(new Set());
  const [instructorName, setInstructorName] = useState('Ophelia Instructor');

  useEffect(() => {
    async function load() {
      try {
        const [courseRes, enrRes] = await Promise.all([
          axios.get(`/api/courses/${courseId}`),
          isSignedIn ? axios.get(`/api/courses/${courseId}/enroll`) : Promise.resolve({ data: { enrolled: false } }),
        ]);
        setCourse(courseRes.data);
        setEnrollment(enrRes.data);
        if (courseRes.data?.modules?.length > 0) {
          setOpenModules(new Set([courseRes.data.modules[0].id]));
        }
      } catch {
        router.push('/learn/courses');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [courseId, isSignedIn, router]);

  async function handleEnroll() {
    if (!isSignedIn) { router.push('/sign-in'); return; }
    setEnrolling(true);
    try {
      const res = await axios.post(`/api/courses/${courseId}/enroll`);
      if (res.data.checkout && res.data.url) {
        window.location.href = res.data.url;
      } else {
        setEnrollment({ enrolled: true, enrollment: res.data.enrollment });
      }
    } catch {
      // silent
    } finally {
      setEnrolling(false);
    }
  }

  async function handleBookmark() {
    if (!isSignedIn) { router.push('/sign-in'); return; }
    const res = await axios.post(`/api/courses/${courseId}/bookmark`);
    setBookmarked(res.data.bookmarked);
  }

  function toggleModule(id: string) {
    setOpenModules(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  if (loading || !course) {
    return (
      <div className='min-h-screen pt-[72px] flex items-center justify-center bg-lux-bg'>
        <div className='h-8 w-8 border-2 border-gold border-t-transparent animate-spin' />
      </div>
    );
  }

  const gradient = CATEGORY_GRADIENTS[course.category] ?? 'from-neutral-100 to-stone-50';
  const totalModuleLessons = course.modules.reduce((a, m) => a + m.lessons.length, 0);

  return (
    <div className='min-h-screen bg-lux-bg pt-[72px]'>
      {/* Back */}
      <div className='bg-lux-black border-b border-white/10'>
        <div className='max-w-[1152px] mx-auto px-6 py-3'>
          <Link href='/learn/courses' className='flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors duration-200'>
            <ArrowLeft className='h-4 w-4' /> Back to courses
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className='bg-lux-black'>
        <div className='max-w-[1152px] mx-auto px-6 py-12 grid lg:grid-cols-[1fr_360px] gap-10'>
          <div>
            <div className='flex items-center gap-2 mb-4'>
              <span className='text-xs font-medium text-gold'>{course.category}</span>
              <span className='text-white/20'>·</span>
              <span className='text-xs text-white/50'>{course.level}</span>
            </div>
            <h1 className='font-display text-3xl lg:text-4xl font-bold text-white leading-tight mb-4'>
              {course.title}
            </h1>
            {course.shortDescription && (
              <p className='text-white/70 text-lg mb-6 leading-relaxed'>{course.shortDescription}</p>
            )}
            {/* Rating row */}
            <div className='flex flex-wrap items-center gap-4 text-sm'>
              <div className='flex items-center gap-1.5'>
                <div className='flex gap-0.5'>
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={`h-4 w-4 ${s <= Math.round(course.rating) ? 'text-gold fill-gold' : 'text-white/20 fill-white/20'}`} />
                  ))}
                </div>
                <span className='text-gold font-bold'>{course.rating.toFixed(1)}</span>
                <span className='text-white/40'>({course.ratingCount.toLocaleString()} reviews)</span>
              </div>
              <span className='text-white/40 flex items-center gap-1'>
                <Users className='h-3.5 w-3.5' /> {course.enrollmentCount.toLocaleString()} students
              </span>
            </div>
            <p className='text-white/50 text-sm mt-3'>by <span className='text-white/80'>{instructorName}</span></p>
          </div>
        </div>
      </div>

      {/* Main content + sticky sidebar */}
      <div className='max-w-[1152px] mx-auto px-6 py-10 grid lg:grid-cols-[1fr_360px] gap-10 items-start'>
        {/* Left column */}
        <div className='space-y-10'>

          {/* Preview */}
          {course.previewVideo && (
            <div className='relative aspect-video bg-lux-black rounded-sm overflow-hidden'>
              <iframe
                src={course.previewVideo}
                className='absolute inset-0 w-full h-full'
                allow='autoplay; fullscreen'
                allowFullScreen
              />
            </div>
          )}
          {!course.previewVideo && (
            <div className={`relative aspect-video bg-gradient-to-br ${gradient} flex items-center justify-center rounded-sm overflow-hidden`}>
              {course.thumbnail ? (
                <Image src={course.thumbnail} alt={course.title} fill className='object-cover' />
              ) : (
                <BookOpen className='h-16 w-16 text-lux-mid opacity-30' />
              )}
            </div>
          )}

          {/* What you'll learn */}
          {course.objectives.length > 0 && (
            <section>
              <h2 className='font-display text-2xl font-bold text-lux-black mb-5'>What You'll Learn</h2>
              <div className='grid sm:grid-cols-2 gap-3 p-6 bg-white border border-lux-border'>
                {course.objectives.map((obj, i) => (
                  <div key={i} className='flex items-start gap-2.5'>
                    <CheckCircle className='h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0' />
                    <span className='text-sm text-lux-mid'>{obj}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Course Curriculum */}
          {course.modules.length > 0 && (
            <section>
              <h2 className='font-display text-2xl font-bold text-lux-black mb-2'>Course Curriculum</h2>
              <p className='text-sm text-lux-muted mb-5'>
                {course.modules.length} modules · {totalModuleLessons} lessons · {formatDuration(course.totalDuration)}
              </p>
              <div className='border border-lux-border bg-white'>
                {course.modules.map((mod, mi) => (
                  <div key={mod.id} className='border-b border-lux-border last:border-0'>
                    <button
                      onClick={() => toggleModule(mod.id)}
                      className='w-full flex items-center justify-between p-4 hover:bg-lux-hover transition-colors duration-200 text-left'
                    >
                      <div className='flex items-center gap-3'>
                        <span className='text-xs text-lux-muted w-5'>{mi + 1}</span>
                        <span className='font-medium text-lux-black text-sm'>{mod.title}</span>
                        <span className='text-xs text-lux-muted'>({mod.lessons.length} lessons)</span>
                      </div>
                      {openModules.has(mod.id) ? <ChevronDown className='h-4 w-4 text-lux-muted' /> : <ChevronRight className='h-4 w-4 text-lux-muted' />}
                    </button>
                    {openModules.has(mod.id) && (
                      <div className='bg-lux-bg'>
                        {mod.lessons.map(lesson => (
                          <div key={lesson.id} className='flex items-center gap-3 px-5 py-3 border-t border-lux-border/50'>
                            <Play className='h-3.5 w-3.5 text-lux-muted flex-shrink-0' />
                            <span className='text-sm text-lux-mid flex-1'>{lesson.title}</span>
                            {lesson.isFree && <span className='text-xs text-emerald-600 font-medium'>Free</span>}
                            {lesson.duration > 0 && <span className='text-xs text-lux-muted'>{lesson.duration}m</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Requirements */}
          {course.requirements.length > 0 && (
            <section>
              <h2 className='font-display text-2xl font-bold text-lux-black mb-5'>Requirements</h2>
              <ul className='space-y-2'>
                {course.requirements.map((req, i) => (
                  <li key={i} className='flex items-start gap-2.5 text-sm text-lux-mid'>
                    <span className='w-1.5 h-1.5 bg-lux-muted rounded-full mt-1.5 flex-shrink-0' />
                    {req}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Instructor */}
          <section>
            <h2 className='font-display text-2xl font-bold text-lux-black mb-5'>Your Instructor</h2>
            <InstructorCard
              name={instructorName}
              bio={course.instructor.bio}
              expertise={course.instructor.expertise}
              totalStudents={course.instructor.totalStudents}
              totalCourses={course.instructor.totalCourses}
              rating={course.instructor.rating}
              isVerified={course.instructor.isVerified}
              userId={course.instructor.userId}
              variant='inline'
            />
          </section>

          {/* Reviews */}
          <CourseReviewSection
            courseId={course.id}
            reviews={course.reviews}
            avgRating={course.rating}
            ratingCount={course.ratingCount}
            isEnrolled={enrollment.enrolled}
          />
        </div>

        {/* Sticky enrollment card */}
        <div className='lg:sticky lg:top-24 space-y-4'>
          <div className='bg-white border border-lux-border shadow-luxury p-6'>
            {/* Price */}
            <div className='mb-5'>
              {course.isFree ? (
                <p className='text-3xl font-bold text-emerald-600 font-display'>Free</p>
              ) : (
                <p className='text-3xl font-bold text-lux-black font-display'>${course.price}</p>
              )}
            </div>

            {/* Enroll button */}
            {enrollment.enrolled ? (
              <Link
                href={`/learn/courses/${course.id}/learn`}
                className='block w-full text-center py-3 bg-gold text-white font-semibold text-sm hover:bg-gold-deep transition-colors duration-200 mb-4'
              >
                Continue Learning
              </Link>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className='w-full py-3 bg-lux-black text-white font-semibold text-sm hover:bg-lux-dark transition-colors duration-200 mb-4 disabled:opacity-50'
              >
                {enrolling ? 'Processing…' : course.isFree ? 'Enroll for Free' : `Enroll — $${course.price}`}
              </button>
            )}

            {/* Secondary actions */}
            <div className='flex gap-2 mb-5'>
              <button
                onClick={handleBookmark}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 border text-sm transition-colors duration-200 ${bookmarked ? 'bg-gold/10 border-gold/30 text-gold' : 'border-lux-border text-lux-mid hover:border-lux-black'}`}
              >
                <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-gold text-gold' : ''}`} />
                {bookmarked ? 'Saved' : 'Save'}
              </button>
              <button className='flex-1 flex items-center justify-center gap-2 py-2.5 border border-lux-border text-lux-mid hover:border-lux-black text-sm transition-colors duration-200'>
                <Share2 className='h-4 w-4' /> Share
              </button>
            </div>

            {/* Includes */}
            <div className='space-y-2.5 text-sm text-lux-mid'>
              <p className='font-semibold text-lux-black text-xs uppercase tracking-wide mb-3'>This course includes:</p>
              <div className='flex items-center gap-2.5'>
                <BookOpen className='h-4 w-4 text-lux-muted flex-shrink-0' />
                <span>{course.totalLessons} lessons</span>
              </div>
              <div className='flex items-center gap-2.5'>
                <Clock className='h-4 w-4 text-lux-muted flex-shrink-0' />
                <span>{formatDuration(course.totalDuration)} of content</span>
              </div>
              {course.hasCertificate && (
                <div className='flex items-center gap-2.5'>
                  <Award className='h-4 w-4 text-lux-muted flex-shrink-0' />
                  <span>Certificate of completion</span>
                </div>
              )}
              <div className='flex items-center gap-2.5'>
                <Users className='h-4 w-4 text-lux-muted flex-shrink-0' />
                <span>Lifetime access</span>
              </div>
            </div>
          </div>

          {/* Course stats */}
          <div className='bg-lux-bg border border-lux-border p-4 grid grid-cols-3 gap-3 text-center'>
            <div>
              <p className='text-lg font-bold text-lux-black font-display'>{course.rating.toFixed(1)}</p>
              <p className='text-xs text-lux-muted'>Rating</p>
            </div>
            <div>
              <p className='text-lg font-bold text-lux-black font-display'>{course.enrollmentCount.toLocaleString()}</p>
              <p className='text-xs text-lux-muted'>Students</p>
            </div>
            <div>
              <p className='text-lg font-bold text-lux-black font-display'>{course.level}</p>
              <p className='text-xs text-lux-muted'>Level</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
