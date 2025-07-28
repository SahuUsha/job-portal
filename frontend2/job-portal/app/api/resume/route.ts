// app/api/resume/route.ts
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token?.sub) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const resume = await prisma.resume.findUnique({
      where: { userId: token.sub },
    });

    if (!resume) {
      return NextResponse.json({ message: 'Resume not found' }, { status: 404 });
    }

    return NextResponse.json({ resume });
  } catch (error) {
    console.error('Error fetching resume:', error);
    return NextResponse.json({ message: 'Error fetching resume' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token?.sub) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.content || typeof body.content !== 'object') {
      return NextResponse.json({ message: 'Invalid resume content' }, { status: 400 });
    }

    const resume = await prisma.resume.upsert({
      where: { userId: token.sub },
      update: { content: body.content },
      create: { userId: token.sub, content: body.content },
    });

    return NextResponse.json({ message: 'Resume upserted successfully', resume });
  } catch (error) {
    console.error('Error saving resume:', error);
    return NextResponse.json({ message: 'Error saving resume' }, { status: 500 });
  }
}
