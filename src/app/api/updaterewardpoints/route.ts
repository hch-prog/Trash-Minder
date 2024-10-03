
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';



export async function POST(request: Request) {
  try {
    const { userId, pointsToAdd } = await request.json();

    if (!userId || typeof pointsToAdd !== 'number') {
      return NextResponse.json({ error: 'User ID and points are required' }, { status: 400 });
    }

    const reward = await prisma.reward.findFirst({
      where: { userId }
    });

    if (!reward) {
      return NextResponse.json({ error: 'Reward not found for this user' }, { status: 404 });
    }

    const updatedReward = await prisma.reward.update({
      where: { id: reward.id },  
      data: {
        points: {
          increment: pointsToAdd,  
        },
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedReward, { status: 200 });
  } catch (error) {
    console.error('Error updating reward points:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
