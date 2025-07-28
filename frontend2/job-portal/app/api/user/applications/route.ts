
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';


export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || !token.sub) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = token.sub;

  // Fetch applications
  const applications = await prisma.application.findMany({
    where: { userId },
    include: {
      job: { select: { title: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ applications });
}
