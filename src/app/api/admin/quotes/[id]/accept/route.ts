import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Quote from "@/models/Quote";
import Order from "@/models/Order";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const quote = await Quote.findById(id);
    if (!quote) return NextResponse.json({ error: "Quote not found" }, { status: 404 });

    const newOrder = await Order.create({
      orderId: quote.orderId, 
      customerName: quote.name,
      email: quote.email,
      mobile: quote.mobile,
      companyName: quote.companyName,
      productName: quote.productName,
      status: "pending",
      amount: 0, 
      details: {
        businessType: quote.businessType,
        kitchenSize: quote.kitchenSize,
        message: quote.message,
        layoutImage: quote.layoutImage
      }
    });

    quote.status = "accepted";
    await quote.save();

    return NextResponse.json({ message: "Quote converted to Order", order: newOrder });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}