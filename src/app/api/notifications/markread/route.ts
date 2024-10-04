import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, response: NextResponse) {
    try {
        const { searchParams } = new URL(request.url);
        const notificationId = parseInt(searchParams.get('notificationId') ?? " ")

        if (!notificationId) {
            return NextResponse.json({ error: "Invalid notification ID" }, { status: 400 });
        }

        const notification = await prisma.notifications.update({
            where: { id: notificationId },
            data: { isRead: false },

        })

        return NextResponse.json({success:true,notification},{status:200})

    } catch (error) {
        return NextResponse.json({ error }, { status: 400 })
    }
}