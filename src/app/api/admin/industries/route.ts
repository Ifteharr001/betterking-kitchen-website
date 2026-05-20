import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Industry from "@/models/Industry";
import { revalidatePath } from "next/cache";

// Auto translator function
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

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // Build search query
    const searchQuery = search
      ? {
          $or: [
            { "name.en": { $regex: search, $options: 'i' } },
            { "description.en": { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const [industries, total] = await Promise.all([
      Industry.find(searchQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Industry.countDocuments(searchQuery)
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      industries,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching industries:', error);
    return NextResponse.json({ error: "Failed to fetch industries" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();

    const transName = await autoTranslate(body.name);
    const transDesc = await autoTranslate(body.description);
    const transDetails = await autoTranslate(body.details || "");

    const payload = {
      ...body,
      name: { en: body.name, ...transName },
      description: { en: body.description, ...transDesc },
      details: { en: body.details || "", ...transDetails }
    };

    const newIndustry = await Industry.create(payload);
    revalidatePath('/', 'layout');
    
    return NextResponse.json(newIndustry, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create industry" }, { status: 500 });
  }
}