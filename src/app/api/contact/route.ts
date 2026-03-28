import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Contact from "@/models/Contact";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate required fields
    if (!body.fullName || !body.email || !body.message) {
      return NextResponse.json({ 
        error: "Missing required fields: fullName, email, message" 
      }, { status: 400 });
    }

    await connectDB();
    const newContact = await Contact.create(body);
    
    return NextResponse.json({ 
      message: "Message sent successfully!", 
      contact: newContact 
    }, { status: 201 });
  } catch (error: any) {
    console.error("Contact form error:", error);
    return NextResponse.json({ 
      error: "Failed to send message: " + (error.message || "Unknown error") 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const contacts = await Contact.find({}).sort({ createdAt: -1 }); 
    return NextResponse.json(contacts, { status: 200 });
  } catch (error: any) {
    console.error("Fetch contacts error:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}