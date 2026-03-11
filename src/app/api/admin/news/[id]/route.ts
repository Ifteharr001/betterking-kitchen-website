import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";

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

// GET Request
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; 
    await connectDB();
    const blog = await Blog.findById(id);
    
    if (!blog) return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    return NextResponse.json(blog, { status: 200 }); 
  } catch (error) {
    return NextResponse.json({ message: "Error fetching blog" }, { status: 500 });
  }
}
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; 
    const body = await req.json();
    await connectDB();
    
    const engTitle = typeof body.title === 'string' ? body.title : body.title?.en;
    const engCategory = typeof body.category === 'string' ? body.category : body.category?.en;
    const engLocation = typeof body.location === 'string' ? body.location : body.location?.en;
    const engShortDesc = typeof body.shortDesc === 'string' ? body.shortDesc : body.shortDesc?.en;
    const engDescription = typeof body.description === 'string' ? body.description : body.description?.en;

    const transTitle = await autoTranslate(engTitle || "");
    const transCategory = await autoTranslate(engCategory || "");
    const transLocation = await autoTranslate(engLocation || "");
    const transShortDesc = await autoTranslate(engShortDesc || "");
    const transDescription = await autoTranslate(engDescription || "");

    const updateData = {
      ...(body.slug && { slug: body.slug }),
      ...(body.image && { image: body.image }),
      title: { en: engTitle || "", ...transTitle },
      category: { en: engCategory || "", ...transCategory },
      location: { en: engLocation || "", ...transLocation },
      shortDesc: { en: engShortDesc || "", ...transShortDesc },
      description: { en: engDescription || "", ...transDescription },
    };

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    
    if (!updatedBlog) return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    return NextResponse.json({ message: "Blog updated successfully", blog: updatedBlog }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error updating blog", error }, { status: 500 });
  }
}

// DELETE Request
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    
    return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting blog" }, { status: 500 });
  }
}