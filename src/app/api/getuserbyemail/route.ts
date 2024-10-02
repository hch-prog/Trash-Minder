import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest, res: NextResponse) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { messsage: "Email is not present" },
                { status: 400 }
            )
        }
        const user = await prisma.users.findUnique({
            where: {
                email
            },
        })

        if (user) {
            return NextResponse.json(user);
        } else {
            const newUser = await prisma.users.create({
                data: {
                    email,
                    name: "User",  
                },
            })
            return NextResponse.json(newUser, { status: 201 });
        }

    } catch (error) {
        console.error("Error in getuserbyemail:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });

    }
}