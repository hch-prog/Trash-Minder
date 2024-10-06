import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  try {
    const user = await prisma.users.findUnique({
      where: { email: email },
      select: {
        name: true,
        email: true,
        number: true,
        address: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function PUT(request: Request) {
  const { email, name, number, address } = await request.json()

  if (!email || !name || !number || !address) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
  }

  try {
    const updatedUser = await prisma.users.update({
      where: { email: email },
      data: {
        name: name,
        number: number, 
        address: address,
      },
    })

    return NextResponse.json(updatedUser, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

