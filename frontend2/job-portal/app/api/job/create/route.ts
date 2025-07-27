import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import { JobType } from "@prisma/client";

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

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createJobSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  try {
    const data = parsed.data;
    const jobTypeInput = data.jobType.toUpperCase() as JobType;

    if (!Object.values(JobType).includes(jobTypeInput)) {
      return NextResponse.json({ message: "Invalid job type" }, { status: 400 });
    }

    const existing = await prisma.job.findFirst({
      where: {
        title: data.title,
        department: data.department,
        location: data.location,
      },
    });

    if (existing) {
      return NextResponse.json({ message: "Job already exists" }, { status: 409 });
    }

    const job = await prisma.job.create({
      data: {
        ownerId: session.user.id,
        title: data.title,
        description: data.description,
        department: data.department,
        location: data.location,
        salary: data.salary,
        isActive: data.isActive,
        jobType: jobTypeInput,
        requireResume: data.requireResume,
        customFields: data.customFields || [],
      },
    });

    return NextResponse.json({ message: "Job created successfully", job }, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
