import { NextResponse } from 'next/server';
import { EXTERNAL_COURSES } from '@/lib/learn-utils';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const isFree   = searchParams.get('free');
  const limit    = parseInt(searchParams.get('limit') ?? '18');

  let courses = [...EXTERNAL_COURSES];
  if (category) courses = courses.filter(c => c.category === category);
  if (isFree === 'true') courses = courses.filter(c => c.isFree);
  courses = courses.slice(0, limit);

  return NextResponse.json(courses);
}
