import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await req.json();
    
    await connectDB();
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: id },
      { status },
      { new: true }
    );

    return NextResponse.json({ message: "Status updated", order: updatedOrder });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}