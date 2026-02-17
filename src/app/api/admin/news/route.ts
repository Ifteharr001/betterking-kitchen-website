import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";

export async function GET() {
  try {
    await connectDB();
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching blogs", error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();

    const existingBlog = await Blog.findOne({ slug: body.slug });
    if (existingBlog) {
      return NextResponse.json({ message: "Slug already exists" }, { status: 400 });
    }

    const newBlog = await Blog.create(body);
    return NextResponse.json({ message: "Blog created successfully", blog: newBlog }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating blog", error }, { status: 500 });
  }
}