import { auth } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { message, workId, portfolioUrl } = body;

    if (!message?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Please provide a message' },
        { status: 400 }
      );
    }

    if (!workId && !portfolioUrl) {
      return NextResponse.json(
        { success: false, message: 'Please share your work or portfolio link' },
        { status: 400 }
      );
    }

    // Check if job exists
    const job = await db.job.findUnique({
      where: { id: params.jobId }
    });

    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      );
    }

    // Check if user can't apply to their own job
    if (job.userId === userId) {
      return NextResponse.json(
        { success: false, message: "You can't apply to your own job" },
        { status: 400 }
      );
    }

    // Check if user already applied
    const existingApplication = await db.jobApplication.findUnique({
      where: {
        jobId_userId: {
          jobId: params.jobId,
          userId
        }
      }
    });

    if (existingApplication) {
      return NextResponse.json(
        { success: false, message: 'You have already applied to this job' },
        { status: 400 }
      );
    }

    // Create application
    const application = await db.jobApplication.create({
      data: {
        jobId: params.jobId,
        userId,
        message,
        workId: workId || null,
        portfolioUrl: portfolioUrl || null,
        status: 'pending'
      }
    });

    return NextResponse.json({
      success: true,
      application
    });
  } catch (error) {
    console.error('Error applying to job:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to apply to job' },
      { status: 500 }
    );
  }
}
