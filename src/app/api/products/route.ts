import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    let query = {};
    
    if (category) {
      query = { category: category.toUpperCase() };
    }

    const products = await Product.find(query).sort({ createdAt: -1 }); 

    return NextResponse.json(products, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products", details: error }, 
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const existingProduct = await Product.findOne({ id: body.id });
    if (existingProduct) {
      return NextResponse.json(
        { error: "Product with this ID already exists" }, 
        { status: 400 }
      );
    }

    const newProduct = await Product.create(body);

    return NextResponse.json(
      { message: "Product created successfully", product: newProduct }, 
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product", details: error }, 
      { status: 500 }
    );
  }
}