// app/api/application/[id]/status/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const applicationId = params.id; // ✅ Correct usage now
    const body = await req.json();
    const { status } = body;

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
    });

    return NextResponse.json({
      message: 'Application status updated successfully',
      application: updatedApplication,
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    return NextResponse.json({ error: 'Error updating application status' }, { status: 500 });
  }
}
