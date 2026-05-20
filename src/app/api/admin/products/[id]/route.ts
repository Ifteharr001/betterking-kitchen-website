import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { revalidatePath } from "next/cache";

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

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; 
    const body = await req.json();

    if (body.category) body.category = body.category.toLowerCase();
    if (body.subCategory) body.subCategory = body.subCategory.toLowerCase();

    await connectDB();

    let updateData: any = { ...body };

    if (body.name) {
      const transName = await autoTranslate(body.name);
      updateData.name = { en: body.name, ...transName };
    }

    if (body.description) {
      const transDesc = await autoTranslate(body.description);
      updateData.description = { en: body.description, ...transDesc };
    }

    if (body.features && Array.isArray(body.features)) {
      const transFeatures = [];
      for (const feature of body.features) {
        const tf = await autoTranslate(feature);
        transFeatures.push({ en: feature, ...tf });
      }
      updateData.features = transFeatures;
    }

    if (body.highlights && Array.isArray(body.highlights)) {
      const transHighlights = [];
      for (const hl of body.highlights) {
        const thl = await autoTranslate(hl.text);
        transHighlights.push({ icon: hl.icon, text: { en: hl.text, ...thl } });
      }
      updateData.highlights = transHighlights;
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { id: id }, 
      { $set: updateData },
      { returnDocument: 'after', runValidators: true } 
    );
revalidatePath('/', 'layout');
    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Product updated successfully", product: updatedProduct },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await connectDB();

    const deletedProduct = await Product.findOneAndDelete({ id: id });
    revalidatePath('/', 'layout');

    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    
    const product = await Product.findOne({ id: id });
    
    if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}