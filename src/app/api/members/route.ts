import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Member from "@/models/Member";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !(session.user as any).id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const body = await req.json();
        const { name, dateOfBirth, gender, bloodGroup, allergies, chronicConditions, height, weight } = body;

        if (!name || !dateOfBirth || !gender || !bloodGroup) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        await dbConnect();

        const member = await Member.create({
            userId,
            name,
            dateOfBirth: new Date(dateOfBirth),
            gender,
            bloodGroup,
            allergies: allergies ? allergies.split(',').map((s: string) => s.trim()) : [],
            chronicConditions: chronicConditions ? chronicConditions.split(',').map((s: string) => s.trim()) : [],
            height,
            weight,
        });

        return NextResponse.json(member, { status: 201 });
    } catch (error: any) {
        console.error("Add member error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !(session.user as any).id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        await dbConnect();

        const members = await Member.find({ userId }).sort({ createdAt: -1 });

        return NextResponse.json(members);
    } catch (error: any) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
