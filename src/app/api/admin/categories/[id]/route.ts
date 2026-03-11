import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import SubCategory from "@/models/SubCategory";

// 💡 অটো ট্রান্সলেটর ম্যাজিক
async function translateText(text: string, targetLang: string) {
  if (!text) return "";
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const data = await res.json();
    return data[0].map((item: any) => item[0]).join('');
  } catch (error) {
    console.error(`Error translating to ${targetLang}:`, error);
    return "";
  }
}

async function autoTranslate(text: string) {
  if (!text) return { bn: "", ar: "", es: "", zh: "", fr: "" };
  const [bn, ar, es, zh, fr] = await Promise.all([
    translateText(text, 'bn'),
    translateText(text, 'ar'),
    translateText(text, 'es'),
    translateText(text, 'zh-CN'),
    translateText(text, 'fr')
  ]);
  return { bn, ar, es, zh, fr };
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, description, image } = body;
    const { id } = await params;

    let updateData: any = {};
    if (image) updateData.image = image;

    if (name) {
      const engName = typeof name === 'string' ? name : name?.en;
      const transName = await autoTranslate(engName);
      updateData.name = { en: engName, ...transName };
      updateData.slug = engName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    if (description !== undefined) {
      const engDesc = typeof description === 'string' ? description : description?.en;
      const transDesc = await autoTranslate(engDesc || "");
      updateData.description = { en: engDesc || "", ...transDesc };
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } 
    );

    if (!updatedCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Category updated & translated successfully", category: updatedCategory }, 
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PUT Category Error:", error);
    return NextResponse.json({ error: error.message || "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;

    const deletedCategory = await Category.findByIdAndDelete(id);
    
    if (!deletedCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    await SubCategory.deleteMany({ categoryId: id });

    return NextResponse.json({ message: "Category and associated sub-categories deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE Category Error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete category" }, { status: 500 });
  }
}