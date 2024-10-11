import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest){
    const {searchParams}= new URL(request.url)
        const limit = parseInt(searchParams.get('limit')??'20',10);
        
    try {
        const tasks = await prisma.report.findMany({
            take:limit,
            orderBy: {createdAt:'desc'},
        });

        const formattedTasks = tasks.map((task) => ({
            ...task,
            date: task.createdAt.toISOString().split('T')[0],
        }));

        return NextResponse.json(formattedTasks, { status: 200 });

    } catch (error) {
        console.error('Error fetching waste collection tasks:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}