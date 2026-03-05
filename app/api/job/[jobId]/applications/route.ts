import { auth } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { clerkClient } from '@clerk/nextjs';

export async function GET(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is the job poster
    const job = await db.job.findUnique({
      where: { id: params.jobId }
    });

    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      );
    }

    if (job.userId !== userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized to view these applications' },
        { status: 403 }
      );
    }

    // Get all applications for this job
    const applications = await db.jobApplication.findMany({
      where: { jobId: params.jobId },
      orderBy: { createdAt: 'desc' }
    });

    // Enrich with user and work data
    const enrichedApplications = await Promise.all(
      applications.map(async (app) => {
        const user = await clerkClient.users.getUser(app.userId);
        let work = null;
        if (app.workId) {
          work = await db.work.findUnique({
            where: { id: app.workId }
          });
        }
        return {
          ...app,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl
          },
          work
        };
      })
    );

    return NextResponse.json({
      success: true,
      applications: enrichedApplications
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { applicationId, status } = body;

    if (!applicationId || !status) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status' },
        { status: 400 }
      );
    }

    // Check if user is the job poster
    const job = await db.job.findUnique({
      where: { id: params.jobId }
    });

    if (!job || job.userId !== userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Update application status
    const application = await db.jobApplication.update({
      where: { id: applicationId },
      data: { status }
    });

    return NextResponse.json({
      success: true,
      application
    });
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update application' },
      { status: 500 }
    );
  }
}
