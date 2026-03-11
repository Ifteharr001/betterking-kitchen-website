import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

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

    const transName = await autoTranslate(body.name);
    const transDesc = await autoTranslate(body.description);

    const transFeatures = [];
    if (body.features && Array.isArray(body.features)) {
      for (const feature of body.features) {
        const tf = await autoTranslate(feature);
        transFeatures.push({ en: feature, ...tf });
      }
    }

    const transHighlights = [];
    if (body.highlights && Array.isArray(body.highlights)) {
      for (const hl of body.highlights) {
        const thl = await autoTranslate(hl.text);
        transHighlights.push({ icon: hl.icon, text: { en: hl.text, ...thl } });
      }
    }

    const payload = {
      ...body,
      name: { en: body.name, ...transName },
      description: { en: body.description, ...transDesc },
      features: transFeatures,
      highlights: transHighlights
    };

    const newProduct = await Product.create(payload);

    return NextResponse.json(
      { message: "Product created & translated successfully", product: newProduct },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const hasPagination = url.searchParams.has("page") || url.searchParams.has("limit");

    // Keep backwards compatibility for callers expecting an array
    if (!hasPagination) {
      const products = await Product.find({}).sort({ createdAt: -1 });
      return NextResponse.json(products, { status: 200 });
    }

    const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") || "20")));
    const skip = (page - 1) * limit;

    const query = {};

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("id name category subCategory image")
        .lean(),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({ products, total, page, limit }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}