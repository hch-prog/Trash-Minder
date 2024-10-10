import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json(); 
        const notificationId = body.notificationId;

        if (!notificationId) {
            return NextResponse.json({ message: "Invalid notification ID" }, { status: 400 });
        }

        const updatedNotification = await prisma.notifications.update({
            where: { id: notificationId },
            data: { isRead: true },
        });

        return NextResponse.json(updatedNotification, { status: 200 });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
