import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();

    const existingProduct = await Product.findOne({ id: body.id });
    if (existingProduct) {
      return NextResponse.json(
        { error: "Product ID already exists. Use a unique ID." },
        { status: 400 }
      );
    }

    const newProduct = await Product.create(body);

    return NextResponse.json(
      { message: "Product created successfully", product: newProduct },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}