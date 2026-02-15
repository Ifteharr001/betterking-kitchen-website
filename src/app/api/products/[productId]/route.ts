import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ productId: string }> } 
) {
  try {
    await connectDB();
    const { productId } = await params;

    const product = await Product.findOne({ id: productId });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error }, 
      { status: 500 }
    );
  }
}