
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';



export async function GET() {
  try {
    const rewards = await prisma.reward.findMany({
      orderBy: { points: 'desc' },
      include: {
        user: {
          select: { name: true }, 
        },
      },
    });

    return NextResponse.json(rewards, { status: 200 });
  } catch (error) {
    console.error('Error fetching all rewards:', error);
    return NextResponse.json({ error: 'Failed to fetch rewards' }, { status: 500 });
  }
}