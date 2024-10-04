import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest) {
    try {
        const { userId, message,type}=await request.json();

        const notificationCreate= await prisma.notifications.create({
            data:{userId, message ,type}
        })
        return NextResponse.json(notificationCreate);
    } catch (error) {
        console.error("Error creating notification:", error);
        return NextResponse.json({ error: "Failed to create notification" }, { status: 500 });
      
    }
}