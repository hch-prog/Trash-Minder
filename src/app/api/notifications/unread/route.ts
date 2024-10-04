import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = parseInt(searchParams.get('userId') ?? "")

        if (!userId) {
            return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
        }

        const find = prisma.notifications.findMany({
            where: { userId }
        })

        return NextResponse.json({ success: true, find }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: "Failed" }, { status: 400 })
    }
}