import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Contact from "@/models/Contact"; 
import Quote from "@/models/Quote";

export async function GET() {
  try {
    await connectDB();

    const [
      totalProducts,
      totalInquiries,
      pendingInquiries,
      totalQuotes,
      pendingQuotes,
      totalOrders,
      processingOrders,
    ] = await Promise.all([
      Product.countDocuments(),
      Contact.countDocuments(),
      Contact.countDocuments({ status: "unread" }),
      Quote.countDocuments(),
      Quote.countDocuments({ status: "pending" }),
      Order.countDocuments(),
      Order.countDocuments({ status: "processing" }),
    ]);

   
    const [recentInquiries, recentQuotes, recentOrders] = await Promise.all([
      Contact.find().sort({ createdAt: -1 }).limit(5).lean(),
      Quote.find().sort({ createdAt: -1 }).limit(5).lean(),
      Order.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    return NextResponse.json({
      stats: {
        totalProducts,
        activeProducts: totalProducts, 
        totalInquiries,
        pendingInquiries,
        totalQuotes,
        pendingQuotes,
        totalOrders,
        processingOrders,
      },
      recentInquiries,
      recentQuotes,
      recentOrders,
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ message: "Error fetching dashboard data" }, { status: 500 });
  }
}