// app/api/job/[id]/apply/route.ts

import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/verifyToken";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const jobId = params.id;
  
  const userId = await verifyToken(req); // ✅ FIXED

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const answer = formData.get("answer") as string;
    const usedOnsiteResume = formData.get("usedOnsiteResume") === "true";

    const existing = await prisma.application.findFirst({
      where: { jobId, userId },
    });

    if (existing) { 
      return NextResponse.json({ error: "Already applied" }, { status: 400 });
    }

    let resumeUrl: string | null = null;

    if (!usedOnsiteResume) {
      const file = formData.get("resume") as File;
      if (!file || file.type !== "application/pdf") {
        return NextResponse.json({ error: "Invalid resume format" }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadRes = await new Promise<{ secure_url: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "resumes",
            resource_type: "raw",
          },
          (error, result) => {
            if (error || !result) reject(error);
            else resolve(result as any);
          }
        );

        stream.end(buffer);
      });

      resumeUrl = uploadRes.secure_url;
    }

    const application = await prisma.application.create({
      data: {
        jobId,
        userId,
        answer,
        usedOnsiteResume,
        resumeUrl,
      },
    });

    return NextResponse.json({ message: "Application submitted", application });
  } catch (error) {
    console.error("Apply error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
