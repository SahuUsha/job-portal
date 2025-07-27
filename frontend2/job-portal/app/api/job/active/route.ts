import { prisma } from '@/lib/prisma';

import { NextRequest, NextResponse } from 'next/server';
export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    if (jobs.length === 0) {
      return NextResponse.json({ message: 'No active jobs found' }, { status: 404 });
    }

    return NextResponse.json({ jobs }, { status: 200 });
  } catch (error) {
    console.error('Error fetching active jobs:', error);
    return NextResponse.json({ message: 'Error fetching active jobs' }, { status: 500 });
  }
}
