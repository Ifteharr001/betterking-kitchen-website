import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Industry from "@/models/Industry";

export async function GET() {
  try {
    await connectDB();
    const industries = await Industry.find({});
    return NextResponse.json(industries);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch industries" }, { status: 500 });
  }
}