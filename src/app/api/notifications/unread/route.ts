import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = parseInt(searchParams.get('userId') ?? "");

        if (!userId) {
            return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
        }

        const unreadNotifications = await prisma.notifications.findMany({
            where: {
                userId: userId,
                isRead: false,
            },
        });

        return NextResponse.json(unreadNotifications, { status: 200 });
    } catch (error) {
        console.error("Error fetching unread notifications:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
