import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const body = await request.json()
  const { userId, rewardId } = body

  if (!userId || rewardId === undefined) {
    return NextResponse.json({ error: 'User ID and Reward ID are required' }, { status: 400 })
  }

  try {
    const user = await prisma.users.findUnique({
      where: { id: parseInt(userId) },
      include: { Rewards: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const transactions = await prisma.transactions.findMany({
      where: { userId: user.id },
    })

    const userBalance = transactions.reduce((acc, transactions) => {
      return transactions.type.startsWith('earned') ? acc + transactions.amount : acc - transactions.amount
    }, 0)

    if (rewardId === 0) {
      if (userBalance <= 0) {
        return NextResponse.json({ error: 'No points available to redeem' }, { status: 400 })
      }

      await prisma.transactions.create({
        data: {
          userId: user.id,
          type: 'redeemed',
          amount: userBalance,
          description: `Redeemed all points: ${userBalance}`,
        },
      })

      return NextResponse.json({ message: 'All points redeemed successfully' })
    } else {
      const reward = await prisma.reward.findUnique({
        where: { id: rewardId },
      })

      if (!reward) {
        return NextResponse.json({ error: 'Reward not found' }, { status: 404 })
      }

      if (userBalance < reward.points) {
        return NextResponse.json({ error: 'Insufficient points' }, { status: 400 })
      }

      await prisma.transactions.create({
        data: {
          userId: user.id,
          type: 'redeemed',
          amount: reward.points,
          description: `Redeemed: ${reward.name}`,
        },
      })

      return NextResponse.json({ message: 'Reward redeemed successfully' })
    }
  } catch (error) {
    console.error('Error redeeming reward:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}