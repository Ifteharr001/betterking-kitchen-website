import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("id");

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    await connectDB();
    
    const order = await Order.findOne({ orderId: orderId });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const response = {
      orderId: order.orderId,
      status: order.status,
      createdAt: order.createdAt || order.date || new Date(),
      productName: order.productName || "Product",
      companyName: order.companyName,
      mobile: order.mobile,
      invoiceUrl: order.invoiceUrl,
      amount: order.amount
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Track order error:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}