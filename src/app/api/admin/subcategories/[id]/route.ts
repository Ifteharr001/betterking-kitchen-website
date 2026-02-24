import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SubCategory from "@/models/SubCategory";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const body = await req.json();
    const { categoryId, name, description, image } = body;
    
    const { id } = await params;

    let updateData: any = { categoryId, description, image };

    if (name) {
      updateData.name = name;
      updateData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      id,
      updateData,
      { returnDocument: 'after' } 
    );

    if (!updatedSubCategory) {
      return NextResponse.json({ error: "SubCategory not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "SubCategory updated successfully", subCategory: updatedSubCategory }, 
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PUT SubCategory Error:", error);
    return NextResponse.json({ error: error.message || "Failed to update sub-category" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    
    const { id } = await params;

    const deletedSubCategory = await SubCategory.findByIdAndDelete(id);
    
    if (!deletedSubCategory) {
      return NextResponse.json({ error: "SubCategory not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "SubCategory deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE SubCategory Error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete sub-category" }, { status: 500 });
  }
}