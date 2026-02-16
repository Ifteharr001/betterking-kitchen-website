import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Quote from "@/models/Quote";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    await Quote.findByIdAndUpdate(id, { status: "rejected" });

    return NextResponse.json({ message: "Quote rejected" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to reject quote" }, { status: 500 });
  }
}