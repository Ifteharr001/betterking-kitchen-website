import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SubCategory from "@/models/SubCategory";
import Category from "@/models/Category";

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

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const { categoryId, name, description, image } = body;

    const engName = typeof name === 'string' ? name : name?.en;
    const engDescription = typeof description === 'string' ? description : description?.en;

    if (!engName || !categoryId) {
      return NextResponse.json({ error: "SubCategory name and Parent Category ID are required" }, { status: 400 });
    }

    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return NextResponse.json({ error: "Parent category not found" }, { status: 404 });
    }

    const transName = await autoTranslate(engName);
    const transDescription = await autoTranslate(engDescription || "");

    const slug = engName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newSubCategory = await SubCategory.create({
      categoryId,
      name: { en: engName, ...transName },
      slug,
      description: { en: engDescription || "", ...transDescription },
      image: image || "/placeholder.svg"
    });

    return NextResponse.json(
      { message: "SubCategory created & translated successfully", subCategory: newSubCategory }, 
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST SubCategory Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create sub-category" }, { status: 500 });
  }
}