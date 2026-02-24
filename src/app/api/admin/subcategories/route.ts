import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SubCategory from "@/models/SubCategory";
import Category from "@/models/Category";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const { categoryId, name, description, image } = body;

    if (!name || !categoryId) {
      return NextResponse.json({ error: "SubCategory name and Parent Category ID are required" }, { status: 400 });
    }

   
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return NextResponse.json({ error: "Parent category not found" }, { status: 404 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newSubCategory = await SubCategory.create({
      categoryId,
      name,
      slug,
      description: description || "",
      image: image || "/placeholder.svg"
    });

    return NextResponse.json(
      { message: "SubCategory created successfully", subCategory: newSubCategory }, 
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST SubCategory Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create sub-category" }, { status: 500 });
  }
}