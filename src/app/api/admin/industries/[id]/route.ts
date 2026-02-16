import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Industry from "@/models/Industry";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    
    const industry = await Industry.findById(id);
    
    if (!industry) {
      return NextResponse.json({ error: "Industry not found" }, { status: 404 });
    }

    return NextResponse.json(industry);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch industry" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    await connectDB();

    const updatedIndustry = await Industry.findByIdAndUpdate(
      id,
      { ...body }, // নতুন ডাটা দিয়ে রিপ্লেস হবে
      { new: true }
    );

    if (!updatedIndustry) {
      return NextResponse.json({ error: "Industry not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Updated successfully", industry: updatedIndustry });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update industry" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const deletedIndustry = await Industry.findByIdAndDelete(id);

    if (!deletedIndustry) {
      return NextResponse.json({ error: "Industry not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete industry" }, { status: 500 });
  }
}