'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Users, Star, DollarSign, Plus, Eye, EyeOff, BarChart3, GraduationCap } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';
import { formatDuration } from '@/lib/learn-utils';

interface CourseWithStats {
  id: string; title: string; category: string; level: string;
  price: number; isFree: boolean; isPublished: boolean; rating: number;
  enrollmentCount: number; totalLessons: number; totalDuration: number;
  createdAt: string; _count: { enrollments: number; reviews: number };
}

interface Instructor {
  id: string; userId: string; isVerified: boolean;
  totalStudents: number; totalCourses: number; rating: number;
}

export default function TeachDashboardPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<CourseWithStats[]>([]);
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) { router.push('/sign-in?redirect=/teach/dashboard'); return; }

    async function load() {
      try {
        const [instrRes, coursesRes] = await Promise.all([
          axios.get('/api/instructor'),
          axios.get('/api/instructor/courses'),
        ]);
        if (!instrRes.data) {
          router.push('/teach/apply');
          return;
        }
        setInstructor(instrRes.data);
        setCourses(coursesRes.data ?? []);
      } catch {
        router.push('/teach');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isSignedIn, router]);

  async function togglePublish(courseId: string, current: boolean) {
    await axios.patch(`/api/courses/${courseId}`, { isPublished: !current });
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, isPublished: !current } : c));
  }

  const totalStudents = courses.reduce((a, c) => a + c._count.enrollments, 0);
  const totalRevenue  = courses.reduce((a, c) => a + (c.isFree ? 0 : c.price * c._count.enrollments), 0);
  const avgRating     = courses.length > 0 ? courses.reduce((a, c) => a + c.rating, 0) / courses.length : 0;

  if (loading) {
    return (
      <div className='min-h-screen pt-[72px] flex items-center justify-center bg-lux-bg'>
        <div className='h-8 w-8 border-2 border-gold border-t-transparent animate-spin' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-lux-bg pt-[72px]'>
      {/* Header */}
      <div className='bg-gradient-to-b from-lux-black to-lux-dark border-b border-white/10'>
        <div className='max-w-[1152px] mx-auto px-6 py-10'>
          <div className='flex items-center justify-between'>
            <div>
              <div className='flex items-center gap-2 mb-1'>
                <GraduationCap className='h-5 w-5 text-gold' />
                <span className='text-xs text-gold font-medium tracking-wide uppercase'>Instructor Dashboard</span>
              </div>
              <h1 className='font-display text-3xl font-bold text-white'>My Courses</h1>
            </div>
            <Link
              href='/teach/courses/new'
              className='flex items-center gap-2 px-5 py-2.5 bg-gold text-white text-sm font-medium hover:bg-gold-deep transition-colors duration-200'
            >
              <Plus className='h-4 w-4' /> New Course
            </Link>
          </div>

          {/* Stats */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-8'>
            {[
              { icon: BookOpen,    label: 'Courses',    value: courses.length },
              { icon: Users,       label: 'Students',   value: totalStudents.toLocaleString() },
              { icon: Star,        label: 'Avg Rating', value: avgRating.toFixed(1) },
              { icon: DollarSign,  label: 'Revenue',    value: `$${totalRevenue.toFixed(0)}` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className='bg-white/5 border border-white/10 p-4 text-center'>
                <Icon className='h-4 w-4 text-gold mx-auto mb-2' />
                <p className='text-xl font-bold text-white font-display'>{value}</p>
                <p className='text-xs text-white/40'>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Courses list */}
      <div className='max-w-[1152px] mx-auto px-6 py-8'>
        {courses.length === 0 && (
          <div className='text-center py-20'>
            <BookOpen className='h-12 w-12 text-lux-muted mx-auto mb-4' />
            <p className='font-display text-xl font-bold text-lux-black mb-2'>No courses yet</p>
            <p className='text-sm text-lux-muted mb-6'>Create your first course to start teaching</p>
            <Link href='/teach/courses/new' className='inline-flex items-center gap-2 px-6 py-3 bg-lux-black text-white text-sm font-medium hover:bg-lux-dark transition-colors duration-200'>
              <Plus className='h-4 w-4' /> Create First Course
            </Link>
          </div>
        )}

        <div className='space-y-4'>
          {courses.map(course => (
            <div key={course.id} className='bg-white border border-lux-border p-5 flex flex-col sm:flex-row gap-4 hover:shadow-card transition-shadow duration-200'>
              <div className='flex-1 min-w-0'>
                <div className='flex items-start gap-3 mb-2'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-1'>
                      <span className='text-xs text-gold font-medium'>{course.category}</span>
                      <span className='text-xs text-lux-muted bg-lux-hover px-2 py-0.5 rounded-full'>{course.level}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        course.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {course.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <h3 className='font-semibold text-lux-black text-base'>{course.title}</h3>
                  </div>
                </div>

                <div className='flex flex-wrap items-center gap-4 text-xs text-lux-muted'>
                  <span className='flex items-center gap-1'><Users className='h-3 w-3' /> {course._count.enrollments} students</span>
                  <span className='flex items-center gap-1'><Star className='h-3 w-3' /> {course.rating.toFixed(1)}</span>
                  <span className='flex items-center gap-1'><BookOpen className='h-3 w-3' /> {course.totalLessons} lessons</span>
                  <span>{course.isFree ? 'Free' : `$${course.price}`}</span>
                </div>
              </div>

              <div className='flex items-center gap-3 flex-shrink-0'>
                <Link
                  href={`/learn/courses/${course.id}`}
                  className='p-2 border border-lux-border text-lux-mid hover:text-lux-black hover:border-lux-black transition-colors duration-200'
                  title='Preview'
                >
                  <BarChart3 className='h-4 w-4' />
                </Link>
                <button
                  onClick={() => togglePublish(course.id, course.isPublished)}
                  className={`p-2 border transition-colors duration-200 ${
                    course.isPublished
                      ? 'border-lux-border text-lux-mid hover:text-lux-black hover:border-lux-black'
                      : 'border-gold/30 text-gold hover:bg-gold/10'
                  }`}
                  title={course.isPublished ? 'Unpublish' : 'Publish'}
                >
                  {course.isPublished ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
