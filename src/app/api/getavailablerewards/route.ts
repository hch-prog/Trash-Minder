
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';




async function getRewardTransactions(userId: number) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getrewardtransactions?userId=${userId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      console.error('Failed to fetch reward transactions');
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching reward transactions:', error);
    return [];
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = parseInt(searchParams.get('userId') ?? '');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

   const userTransactions = await getRewardTransactions(userId);

    const userPoints = userTransactions.reduce((total: number, transaction: any) => {
      return transaction.type.startsWith('earned') ? total + transaction.amount : total - transaction.amount;
    }, 0);

    const dbRewards = await prisma.reward.findMany({
      where: { isAvailable: true },
    });

    const availableRewards = [
      {
        id: 0,
        name: 'Your Points',
        cost: userPoints,
        description: 'Redeem your earned points',
        collectionInfo: 'Points earned from reporting and collecting waste',
      },
      ...dbRewards,
    ];

    return NextResponse.json(availableRewards, { status: 200 });
  } catch (error) {
    console.error('Error fetching available rewards:', error);
    return NextResponse.json({ error: 'Failed to fetch rewards' }, { status: 500 });
  }
}