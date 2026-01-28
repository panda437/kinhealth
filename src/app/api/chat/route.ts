import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Member from "@/models/Member";
import HealthEvent from "@/models/HealthEvent";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !(session.user as any).id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const { message } = await req.json();

        if (!message) {
            return NextResponse.json({ message: "Message is required" }, { status: 400 });
        }

        await dbConnect();
        const members = await Member.find({ userId });

        const prompt = `
      You are KinHealth AI, a medical data assistant.
      Your task is to parse a family member's health update into a structured JSON object.
      
      Family Members: ${members.map(m => `${m.name} (ID: ${m._id})`).join(', ')}
      
      User Message: "${message}"
      
      Respond with ONLY a JSON object in the following format:
      {
        "memberId": "The ID of the member identified (if not found, choose the most likely one or ask)",
        "memberName": "The name of the member identified",
        "category": "One of: Vaccination, Prescription, Symptom, Lab Report, Doctor Visit, Lifestyle, Vitals",
        "title": "A short descriptive title for the event",
        "data": { "key": "value", ... any relevant details extracted },
        "confirmationMessage": "A friendly confirmation message like 'Logged fever for Arham. Shall I remind you to check his temperature in 4 hours?'"
      }
      
      If you can't identify a member, ask for clarification in the confirmationMessage and set memberId to null.
    `;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-0125", // or gpt-4-turbo-preview
            messages: [{ role: "system", content: "You are a helpful assistant that outputs JSON." }, { role: "user", content: prompt }],
            response_format: { type: "json_object" },
        });

        const result = JSON.parse(response.choices[0].message.content || "{}");

        if (result.memberId) {
            // Save the event
            await HealthEvent.create({
                memberId: result.memberId,
                category: result.category,
                title: result.title,
                data: result.data,
                source: 'user_chat',
                timestamp: new Date(),
            });
        }

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("AI Inbox Error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
