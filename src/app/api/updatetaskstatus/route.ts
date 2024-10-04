import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { reportId, newStatus, collectorId } = await request.json();

  
    if (!reportId || !newStatus) {
      return NextResponse.json({ error: 'Report ID and new status are required' }, { status: 400 });
    }

   
    const updateData: any = { status: newStatus };
    
    if (collectorId !== undefined) {
      updateData.collectorId = collectorId;
    }
    
    const updatedReport = await prisma.report.update({
      where: { id: reportId },
      data: updateData,
    });

    return NextResponse.json(updatedReport, { status: 200 });
  } catch (error) {
    console.error("Error updating task status:", error);
    return NextResponse.json({ error: "Failed to update task status" }, { status: 500 });
  }
}
