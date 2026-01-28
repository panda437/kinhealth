import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Member from "@/models/Member";
import HealthEvent from "@/models/HealthEvent";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !(session.user as any).id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const member = await Member.findOne({
            _id: params.id,
            userId: (session.user as any).id,
        });

        if (!member) {
            return NextResponse.json({ message: "Member not found" }, { status: 404 });
        }

        const events = await HealthEvent.find({ memberId: params.id }).sort({
            timestamp: -1,
        });

        return NextResponse.json({ member, events });
    } catch (error: any) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
