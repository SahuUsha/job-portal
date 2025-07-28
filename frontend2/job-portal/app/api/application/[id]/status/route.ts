import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ✅ NO need to import or define RouteContext types

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } } // ✅ keep this inline type
) {
  try {
    const applicationId = params.id;
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
    return NextResponse.json(
      { error: 'Error updating application status' },
      { status: 500 }
    );
  }
}
