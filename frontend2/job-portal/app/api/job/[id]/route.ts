import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: params.id },
    });

    if (!job) {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ job }, { status: 200 });
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json({ message: 'Error fetching job' }, { status: 500 });
  }
}


export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const job = await prisma.job.findUnique({ where: { id: params.id } });
    if (!job) {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    const updatedJob = await prisma.job.update({
      where: { id: params.id },
      data: { isActive: !job.isActive },
    });

    return NextResponse.json({
      message: `Job is now ${updatedJob.isActive ? 'active' : 'inactive'}`,
      job: updatedJob,
    });
  } catch (error) {
    console.error('Error toggling job status:', error);
    return NextResponse.json({ message: 'Error toggling job status' }, { status: 500 });
  }
}
