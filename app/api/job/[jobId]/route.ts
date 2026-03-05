import { auth } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

interface Params {
  jobId: string;
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
  try {
    const { jobId } = params;

    const job = await db.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      job
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch job' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { jobId } = params;
    const job = await db.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      );
    }

    if (job.userId !== userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, description, category, jobType, location, salary, experience, image } = body;

    const updatedJob = await db.job.update({
      where: { id: jobId },
      data: {
        title: title || job.title,
        description: description || job.description,
        category: category || job.category,
        jobType: jobType || job.jobType,
        location: location !== undefined ? location : job.location,
        salary: salary !== undefined ? salary : job.salary,
        experience: experience !== undefined ? experience : job.experience,
        image: image !== undefined ? image : job.image
      }
    });

    return NextResponse.json({
      success: true,
      job: updatedJob
    });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update job' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { jobId } = params;
    const job = await db.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      );
    }

    if (job.userId !== userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await db.job.delete({
      where: { id: jobId }
    });

    return NextResponse.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete job' },
      { status: 500 }
    );
  }
}
