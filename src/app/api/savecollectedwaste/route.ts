import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { reportId, collectorId } = await request.json();

    if (!reportId || !collectorId) {
      return NextResponse.json({ error: 'Report ID and Collector ID are required' }, { status: 400 });
    }

    const collectedWaste = await prisma.collectedWaste.create({
      data: {
        reportId,
        collectorId,
        collectionDate: new Date(),
        status: 'verified',
      },
    });

    return NextResponse.json(collectedWaste, { status: 200 });
  } catch (error) {
    console.error("Error saving collected waste:", error);
    return NextResponse.json({ error: "Failed to save collected waste" }, { status: 500 });
  }
}
