// app/api/jobs/[id]/applications/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  try {
    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    const applications = await prisma.application.findMany({
      where: { jobId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        job: {
          select: {
            title: true,
            department: true,
          },
        },
      },
    });

    const enrichedApplications = await Promise.all(
      applications.map(async (application) => {
        let resume = null;

        if ((application as any).usedOnsiteResume) {
          resume = await prisma.resume.findUnique({
            where: { userId: application.userId },
          });
        }

        return {
          ...application,
          resume,
        };
      })
    );

    return NextResponse.json({
      jobId: id,
      totalApplications: applications.length,
      applications: enrichedApplications,
    });
  } catch (error) {
    console.error('Error fetching job applications:', error);
    return NextResponse.json({ message: 'Error fetching job applications' }, { status: 500 });
  }
}
