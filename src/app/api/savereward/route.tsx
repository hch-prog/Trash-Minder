import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();


async function createTransaction(userId: number, type: 'earned_collect' | 'redeemed', amount: number, description: string) {
  try {
    const transaction = await prisma.transactions.create({
      data: { userId, type, amount, description },
    });
    return transaction;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { userId, amount } = await request.json();

    if (!userId || typeof amount !== 'number') {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }
    
    const reward = await prisma.reward.create({
      data: {
        userId,
        name: "Waste Collection Reward",
        collectionInfo: "Points earned from waste collection",
        points: amount,
        level: 1,
        isAvailable: true,
      },
    });

    
    await createTransaction(userId, "earned_collect", amount, "Points earned for collecting waste");

    return NextResponse.json(reward, { status: 200 });
  } catch (error) {
    console.error("Error saving reward:", error);
    return NextResponse.json({ error: "Failed to save reward" }, { status: 500 });
  }
}
