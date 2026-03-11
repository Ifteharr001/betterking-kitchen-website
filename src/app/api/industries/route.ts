import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Industry from "@/models/Industry";

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12'); // Default 12 for public listing
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

    const response = NextResponse.json({
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

    // Add caching headers for better performance
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600'); // 5 min cache

    return response;
  } catch (error) {
    console.error('Error fetching industries:', error);
    return NextResponse.json({ error: "Failed to fetch industries" }, { status: 500 });
  }
}