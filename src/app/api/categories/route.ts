import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";

// In-memory cache with TTL
let cachedCategories: any[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in-memory cache

export async function GET(req: Request) {
  try {
    // Check in-memory cache first
    const now = Date.now();
    if (cachedCategories && (now - cacheTimestamp) < CACHE_TTL) {
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

    const formattedCategories = categories.map((cat: any) => ({
      _id: cat._id.toString(),
      name: cat.name,
      slug: cat.slug
    }));

    // Update in-memory cache
    cachedCategories = formattedCategories;
    cacheTimestamp = now;

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
