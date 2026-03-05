import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all jobs posted by the user
    const jobs = await db.job.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      jobs
    });
  } catch (error) {
    console.error('Error fetching user jobs:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}
