import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Quote from "@/models/Quote";

export async function GET() {
  try {
    await connectDB();
    const quotes = await Quote.find({}).sort({ createdAt: -1 });
    return NextResponse.json(quotes);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch quotes" }, { status: 500 });
  }
}