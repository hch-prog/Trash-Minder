import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  try {
    const transactions = await prisma.transactions.findMany({
      where: { userId: parseInt(userId) },
    })

    const balance = transactions.reduce((acc, transaction) => {
      return transaction.type.startsWith('earned') ? acc + transaction.amount : acc - transaction.amount
    }, 0)

    return NextResponse.json({ balance: Math.max(balance, 0) })
  } catch (error) {
    console.error('Error fetching balance:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
