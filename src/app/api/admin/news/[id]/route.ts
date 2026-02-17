import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; 
    await connectDB();
    const blog = await Blog.findById(id);
    
    if (!blog) return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching blog" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; 
    const body = await req.json();
    await connectDB();
    
    const updatedBlog = await Blog.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json({ message: "Blog updated", blog: updatedBlog });
  } catch (error) {
    return NextResponse.json({ message: "Error updating blog" }, { status: 500 });
  }
}

// DELETE Request
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    
    await Blog.findByIdAndDelete(id);
    return NextResponse.json({ message: "Blog deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting blog" }, { status: 500 });
  }
}