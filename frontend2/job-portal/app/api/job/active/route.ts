import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        salary: true,
        jobType: true,
        isActive: true,
        createdAt: true,
        customFields: true, // ✅ include customFields
      },
    });

    if (!jobs || jobs.length === 0) {
      return NextResponse.json({ message: 'No jobs found' }, { status: 404 });
    }

    return NextResponse.json({ jobs }, { status: 200 });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ message: 'Error fetching jobs', error: String(error) }, { status: 500 });
  }
}
