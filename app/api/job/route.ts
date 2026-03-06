import { auth } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const userId = searchParams.get('userId');

    const whereClause: any = {};
    if (category && category !== 'all') {
      whereClause.category = decodeURIComponent(category);
    }
    if (userId) {
      whereClause.userId = userId;
    }

    const jobs = await db.job.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      jobs
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, description, category, jobType, location, salary, experience, image } = body;

    if (!title || !description || !category || !jobType) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const job = await db.job.create({
      data: {
        userId,
        title,
        description,
        category,
        jobType,
        location: location || null,
        salary: salary || null,
        experience: experience || null,
        image: image || null
      }
    });

    return NextResponse.json({
      success: true,
      job
    });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create job' },
      { status: 500 }
    );
  }
}
