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

        const userPoints = transactions.reduce((total, transaction) => {
            return transaction.type.startsWith('earned') ? total + transaction.amount : total - transaction.amount
        }, 0)

        const dbRewards = await prisma.reward.findMany({
            where: { isAvailable: true },
        })

        const allRewards = [
            {
                id: 0,
                name: "Your Points",
                cost: userPoints,
                description: "Redeem your earned points",
                collectionInfo: "Points earned from reporting and collecting waste"
            },
            ...dbRewards
        ]

        return NextResponse.json(allRewards)
    } catch (error) {
        console.error('Error fetching rewards:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}