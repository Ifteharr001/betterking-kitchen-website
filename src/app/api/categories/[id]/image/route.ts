import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const category = await Category.findById(id).select("image").lean();
    const image = category?.image;
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

    return NextResponse.redirect(new URL(image || "/placeholder.svg", request.url), 307);
  } catch {
    return NextResponse.json({ error: "Failed to fetch category image" }, { status: 500 });
  }
}