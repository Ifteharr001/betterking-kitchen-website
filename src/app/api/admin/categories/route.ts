import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import SubCategory from "@/models/SubCategory";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const categories = await Category.find({}).lean();
    const subCategories = await SubCategory.find({}).lean();

    const mergedCategories = categories.map((cat: any) => ({
      ...cat,
      subCategories: subCategories.filter(
        (sub: any) => String(sub.categoryId) === String(cat._id)
      )
    }));

    return NextResponse.json({ categories: mergedCategories }, { status: 200 });
  } catch (error: any) {
    console.error("GET Categories Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const { name, description, image } = body;

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newCategory = await Category.create({
      name,
      slug,
      description: description || "",
      image: image || "/placeholder.svg" 
    });

    return NextResponse.json(
      { message: "Category created successfully", category: newCategory }, 
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST Category Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create category" }, { status: 500 });
  }
}