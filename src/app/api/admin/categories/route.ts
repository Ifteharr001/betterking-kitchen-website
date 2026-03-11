import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import SubCategory from "@/models/SubCategory";

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
    const engName = typeof name === 'string' ? name : name?.en;
    const engDescription = typeof description === 'string' ? description : description?.en;

    if (!engName) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const transName = await autoTranslate(engName);
    const transDescription = await autoTranslate(engDescription || "");

    const slug = engName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newCategory = await Category.create({
      name: { en: engName, ...transName },
      slug,
      description: { en: engDescription || "", ...transDescription },
      image: image || "/placeholder.svg" 
    });

    return NextResponse.json(
      { message: "Category created & translated successfully", category: newCategory }, 
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST Category Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create category" }, { status: 500 });
  }
}