import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import SubCategory from "@/models/SubCategory";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const subCategory = await SubCategory.findById(id).select("image categoryId").lean();
    const image = subCategory?.image;
    const match = image?.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([a-zA-Z0-9+/=]+)$/);

    if (match) {
      return new NextResponse(Buffer.from(match[2], "base64"), {
        headers: {
          "Content-Type": match[1],
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        },
      });
    }

    if (image?.startsWith("http://") || image?.startsWith("https://")) {
      return NextResponse.redirect(image, 307);
    }

    const category = subCategory?.categoryId
      ? await Category.findById(subCategory.categoryId).select("image").lean()
      : null;
    const fallbackImage = category?.image;
    if (fallbackImage?.startsWith("http://") || fallbackImage?.startsWith("https://")) {
      return NextResponse.redirect(fallbackImage, 307);
    }

    const fallbackMatch = fallbackImage?.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([a-zA-Z0-9+/=]+)$/);
    if (fallbackMatch) {
      return new NextResponse(Buffer.from(fallbackMatch[2], "base64"), {
        headers: {
          "Content-Type": fallbackMatch[1],
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        },
      });
    }

    return NextResponse.redirect(new URL(fallbackImage || "/placeholder.svg", request.url), 307);
  } catch {
    return NextResponse.json({ error: "Failed to fetch subcategory image" }, { status: 500 });
  }
}