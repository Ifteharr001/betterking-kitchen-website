import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Industry from "@/models/Industry";

// Auto translator function
async function translateText(text: string, targetLang: string) {
  if (!text) return "";
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, { next: { revalidate: 0 } });

    if (!res.ok) {
      console.error(`Translate API error (${res.status}):`, await res.text());
      return "";
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      console.error(`Unexpected translate response content-type: ${contentType}`);
      return "";
    }

    const data = await res.json();
    if (!Array.isArray(data) || !Array.isArray(data[0])) {
      console.error(`Unexpected translate response format:`, data);
      return "";
    }

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

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    
    const industry = await Industry.findById(id);
    
    if (!industry) {
      return NextResponse.json({ error: "Industry not found" }, { status: 404 });
    }

    return NextResponse.json(industry);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch industry" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    await connectDB();

    const existingIndustry = await Industry.findById(id).lean();
    if (!existingIndustry) {
      return NextResponse.json({ error: "Industry not found" }, { status: 404 });
    }

    let updateData: any = { ...body };

    const normalizeI18n = (val: any) => {
      if (!val) return {};
      if (typeof val === 'string') return { en: val };
      if (typeof val === 'object' && !Array.isArray(val)) return val;
      return {};
    };

    const safeMerge = (base: any = {}, update: any = {}) => {
      const baseObj = normalizeI18n(base);
      const updateObj = normalizeI18n(update);
      return {
        ...baseObj,
        ...Object.fromEntries(Object.entries(updateObj).filter(([, v]) => v != null && v !== "")),
      };
    };

    if (body.name) {
      const transName = await autoTranslate(body.name);
      updateData.name = safeMerge(existingIndustry.name, { en: body.name, ...transName });
    }

    if (body.description) {
      const transDesc = await autoTranslate(body.description);
      updateData.description = safeMerge(existingIndustry.description, { en: body.description, ...transDesc });
    }

    if (body.details !== undefined) {
      const transDetails = await autoTranslate(body.details);
      updateData.details = safeMerge(existingIndustry.details, { en: body.details, ...transDetails });
    }

    // Normalize cases where details might be an array-like object (e.g., spread from a string)
    const normalizeStringLike = (val: any): string | null => {
      if (!val || typeof val !== 'object') return null;
      const keys = Object.keys(val).filter((k) => /^[0-9]+$/.test(k));
      if (keys.length === 0) return null;
      return keys
        .map((k) => ({ idx: Number(k), val: String(val[k]) }))
        .sort((a, b) => a.idx - b.idx)
        .map((item) => item.val)
        .join('');
    };

    const fromStringLike = normalizeStringLike(updateData.details);
    if (fromStringLike !== null) {
      updateData.details = { en: fromStringLike };
    } else if (updateData.details && typeof updateData.details !== 'object') {
      updateData.details = { en: String(updateData.details) };
    }

    const updatedIndustry = await Industry.findByIdAndUpdate(
      id,
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!updatedIndustry) {
      return NextResponse.json({ error: "Industry not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Updated successfully", industry: updatedIndustry });
  } catch (error: any) {
    console.error("Failed to update industry:", error);
    return NextResponse.json({
      error: error?.message || "Failed to update industry",
      details: (error && error.stack) ? error.stack : undefined,
    }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const deletedIndustry = await Industry.findByIdAndDelete(id);

    if (!deletedIndustry) {
      return NextResponse.json({ error: "Industry not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete industry" }, { status: 500 });
  }
}