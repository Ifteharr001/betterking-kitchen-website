import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Industry from "@/models/Industry";

export async function GET() {
  try {
    await connectDB();
    const industries = await Industry.find({}).sort({ createdAt: -1 });
    return NextResponse.json(industries);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch industries" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();

    const newIndustry = await Industry.create(body);
    
    return NextResponse.json(newIndustry, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create industry" }, { status: 500 });
  }
}