import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET_ApplicationCount(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });

    return NextResponse.json({ applicationCount: job?._count.applications || 0 });
  } catch (error) {
    console.error('Error fetching application count:', error);
    return NextResponse.json({ message: 'Error fetching application count' }, { status: 500 });
  }
}