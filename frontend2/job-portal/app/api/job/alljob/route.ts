// app/api/job/alljob/route.ts

import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const SECRET = process.env.NEXTAUTH_SECRET!;


export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: SECRET });
    console.log('DEBUG GET TOKEN:', token);

      console.log('DEBUG TOKEN:', token);

  if (!token) {
    return NextResponse.json({ message: 'No token found' }, { status: 401 });
  }
    console.log('DEBUG TOKEN ROLE:', token.role);
  

    if (!token || token.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const jobs = await prisma.job.findMany({
      where: { ownerId: token.sub }, // `sub` is userId
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ jobs }, { status: 200 });
  } catch (error) {
    console.error('Error fetching jobs for admin:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
