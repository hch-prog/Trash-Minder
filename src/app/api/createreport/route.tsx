import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

async function createTransaction(userId: number, type: string, amount: number, description: string) {
  try {
    const response = await axios.post('/api/createtransaction', {
      userId,
      type,
      amount,
      description,
    });

    if (response.status === 200) {  
      console.log('Transaction created:', response.data); 
      return response.data;
    } else {
      console.error('Failed to create transaction:', response.data.error);
      return null;
    }
  } catch (error) {
    console.error('Error creating transaction:', error);
    return null;
  }
}

async function createNotification(userId: number, message: string, type: string) {
  try {
    const response = await axios.post('/api/notification/create', {
      userId,
      message,
      type,
    });
    console.log('Notification created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
}

async function updateRewardPoints(userId: number, amount: number) {
  try {
    const response = await axios.post(`/api/updaterewardpoints`, {
      userId,
      amount,
    });
    console.log('Reward points updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating reward points:', error);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const { userId, location, wasteType, amount, imageUrl, verificationResult } = await req.json();

    const report = await prisma.report.create({
      data: {
        userId,
        location,
        wasteType,
        amount,
        imageUrl,
        verificationResult,
        status: 'pending',
      },
    });

    const pointsEarned = 10;
    await updateRewardPoints(userId, pointsEarned);

    await createTransaction(userId, 'earned_report', pointsEarned, 'Points earned for reporting waste');

    await createNotification(userId, `You've earned ${pointsEarned} points for reporting waste!`, 'reward');

    return NextResponse.json(report);
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
  }
}
