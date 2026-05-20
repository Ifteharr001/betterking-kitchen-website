import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { revalidatePath } from "next/cache";
import Blog from "@/models/Blog";

async function translateText(text: string, targetLang: string) {
  if (!text) return "";
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t`;
    
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ q: text }).toString(), 
    });
    
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

    const engTitle = typeof body.title === 'string' ? body.title : body.title?.en;
    const engCategory = typeof body.category === 'string' ? body.category : body.category?.en;
    const engLocation = typeof body.location === 'string' ? body.location : body.location?.en;
    const engShortDesc = typeof body.shortDesc === 'string' ? body.shortDesc : body.shortDesc?.en;
    const engDescription = typeof body.description === 'string' ? body.description : body.description?.en;

    if (!engTitle || !engDescription) {
      return NextResponse.json({ message: "Title and description are strictly required" }, { status: 400 });
    }

    const transTitle = await autoTranslate(engTitle);
    const transCategory = await autoTranslate(engCategory || "");
    const transLocation = await autoTranslate(engLocation || "");
    const transShortDesc = await autoTranslate(engShortDesc || "");
    const transDescription = await autoTranslate(engDescription);

    const blogData = {
      slug: body.slug,
      image: body.image,
      title: { en: engTitle, ...transTitle },
      category: { en: engCategory || "", ...transCategory },
      location: { en: engLocation || "", ...transLocation },
      shortDesc: { en: engShortDesc || "", ...transShortDesc },
      description: { en: engDescription, ...transDescription },
    };

    const newBlog = await Blog.create(blogData);
    revalidatePath('/', 'layout');
    return NextResponse.json({ message: "Blog created & translated successfully", blog: newBlog }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating blog", error }, { status: 500 });
  }
}