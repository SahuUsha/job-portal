
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
// import { authOptions } from '../../auth/[...nextauth]/authOptions';
import { prisma } from '@/lib/prisma';
import { JobType } from '@prisma/client';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const createJobSchema = z.object({
  title: z.string().min(3).trim(),
  description: z.string().min(10),
  department: z.string().min(3),
  location: z.string().min(3),
  salary: z.string().trim(),
  isActive: z.boolean(),
  jobType: z.string().min(3).trim(),
  requireResume: z.boolean(),
  customFields: z
    .array(
      z.object({
        fieldName: z.string().min(3).trim(),
        fieldValue: z.string().min(3).trim(),
      })
    )
    .optional(),
});


  const jobId = params.id;
  const body = await req.json();
  const parsed = createJobSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }

  const data = parsed.data;
  const jobTypeInput = data.jobType.toUpperCase() as JobType;

  try {
    const job = await prisma.job.update({
      where: { id: jobId },
      data: {
        title: data.title,
        description: data.description,
        department: data.department,
        location: data.location,
        salary: data.salary,
        isActive: data.isActive,
        jobType: jobTypeInput,
        requireResume: data.requireResume,https://sora.chatgpt.com/?utm_source=chatgpt
        customField: data.customFields || [],
      },
    });

    return NextResponse.json({ message: 'Job updated successfully', job }, { status: 200 });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
