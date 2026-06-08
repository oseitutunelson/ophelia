import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const [users, works, blogs, courses, instructors, jobs] = await Promise.all([
    db.profile.count(),
    db.work.count(),
    db.blogPost.count({ where: { status: 'published' } }),
    db.course.count({ where: { isPublished: true } }),
    db.instructor.count(),
    db.job.count(),
  ]);

  return NextResponse.json({ users, works, blogs, courses, instructors, jobs });
}
