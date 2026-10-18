import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import SubCategory from "@/models/SubCategory";

// In-memory cache with TTL
let cachedCategories: any[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in-memory cache

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    if (searchParams.get("metadata") === "1") {
      await connectDB();
      const [categories, subCategories] = await Promise.all([
        Category.find({}).select("_id name slug").sort({ createdAt: 1 }).lean(),
        SubCategory.find({}).select("_id categoryId name slug").lean(),
      ]);

      const metadata = categories.map((category: any) => ({
        _id: category._id.toString(),
        name: category.name,
        slug: category.slug,
        subCategories: subCategories
          .filter((subCategory: any) => String(subCategory.categoryId) === String(category._id))
          .map((subCategory: any) => ({
            _id: subCategory._id.toString(),
            name: subCategory.name,
            slug: subCategory.slug,
          })),
      }));

      const response = NextResponse.json(metadata, { status: 200 });
      response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
      return response;
    }

    // Check in-memory cache first
    const now = Date.now();
    if (cachedCategories?.length && (now - cacheTimestamp) < CACHE_TTL) {
      const response = NextResponse.json(cachedCategories, { status: 200 });
      response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
      response.headers.set('X-Cache', 'HIT');
      return response;
    }

    await connectDB();
    
    const categories = await Category.find({})
      .select("_id name slug")
      .lean()
      .sort({ createdAt: 1 })
      .maxTimeMS(5000);

    let subCategories: any[] = [];
    try {
      subCategories = await SubCategory.find({}).select("categoryId").lean().maxTimeMS(5000);
    } catch (error) {
      console.error("Failed to fetch subcategories:", error);
    }

    const formattedCategories = categories.map((cat: any) => ({
      _id: cat._id.toString(),
      name: cat.name,
      slug: cat.slug,
      image: `/api/categories/${cat._id}/image`,
      subCategoryCount: subCategories.filter(
        (sub: any) => String(sub.categoryId) === String(cat._id)
      ).length
    }));

    // Update in-memory cache
    if (formattedCategories.length > 0) {
      cachedCategories = formattedCategories;
      cacheTimestamp = now;
    }

    const response = NextResponse.json(formattedCategories, { status: 200 });
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
    response.headers.set('X-Cache', 'MISS');
    return response;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    
    // Return cached data even on error if available
    if (cachedCategories) {
      const response = NextResponse.json(cachedCategories, { status: 200 });
      response.headers.set('X-Cache', 'STALE');
      return response;
    }
    
    return NextResponse.json(
      { error: "Failed to fetch categories", details: error }, 
      { status: 500 }
    );
  }
}
