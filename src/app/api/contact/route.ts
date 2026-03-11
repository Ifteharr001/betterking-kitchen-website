import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Contact from "@/models/Contact";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();
    const newContact = await Contact.create(body);
    return NextResponse.json({ message: "Message sent successfully!", contact: newContact }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const contacts = await Contact.find({}).sort({ createdAt: -1 }); 
    return NextResponse.json(contacts, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}