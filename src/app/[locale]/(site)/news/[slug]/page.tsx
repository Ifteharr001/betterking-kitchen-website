import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Tag, ArrowLeft } from "lucide-react";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";
import { setRequestLocale } from "next-intl/server";
import CloudinaryImage from "../../components/CloudinaryImage";

export const revalidate = 86400;

const generateSeoSlug = (text: string) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

export async function generateStaticParams() {
  const locales = ['en', 'bn', 'fr', 'es', 'ar', 'zh'];
  
  await connectDB();
  const blogs = await Blog.find({}).select('slug title').lean();

  const params = [];

  for (const locale of locales) {
    for (const blog of blogs) {
      const rawSlug = blog.slug || blog.title?.en || "";
      const cleanSlug = generateSeoSlug(rawSlug);
      
      if (cleanSlug) {
        params.push({ locale, slug: cleanSlug });
      }
    }
  }

  return params;
}

async function getBlog(slug: string, locale: string) {
  try {
    await connectDB();
    const allBlogs = await Blog.find({}).lean();
    
    const blog = allBlogs.find((b: any) => {
      const rawSlug = b.slug || b.title?.en || b.title?.[locale] || "";
      return generateSeoSlug(rawSlug) === slug;
    });
    
    if (!blog) return null;

    return {
      ...blog,
      _id: (blog._id as any).toString(),
      createdAt: blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "N/A",
      title: blog.title?.[locale] || blog.title?.en || "",
      category: blog.category?.[locale] || blog.category?.en || "",
      location: blog.location?.[locale] || blog.location?.en || "",
      shortDesc: blog.shortDesc?.[locale] || blog.shortDesc?.en || "",
      description: blog.description?.[locale] || blog.description?.en || "",
    };
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

export default async function BlogDetailsPage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  
  const { slug, locale } = await params;
  
  setRequestLocale(locale);
  
  const blog = await getBlog(slug, locale);

  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white py-12 md:py-20 mt-16">
   
      <div className="w-full h-[300px] md:h-[500px] relative">
        <CloudinaryImage
          src={blog.image || "/placeholder.jpg"}
          alt={blog.title}
          fill
          className="object-cover"
          priority
          sizes="100vw" 
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 lg:px-8 text-center">
           <h1 className="text-3xl md:text-5xl font-bold text-white max-w-4xl mx-auto leading-6">
  {blog.title}
</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 max-w-4xl -mt-10 relative z-10">
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-10 border border-gray-100">
          
          <div className="flex flex-wrap gap-4 md:gap-6 text-sm text-gray-500 mb-8 border-b border-gray-100 pb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{blog.createdAt}</span>
            </div>
            {blog.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{blog.location}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" />
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold text-xs uppercase">
                {blog.category}
              </span>
            </div>
          </div>

   <div 
  className="prose prose-lg max-w-none text-gray-800 leading-relaxed break-words overflow-hidden w-full [&_p]:mb-5 [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mb-4 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mb-4 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-5 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-5 [&_a]:text-primary [&_a]:underline"
  dangerouslySetInnerHTML={{ __html: blog.description }} 
/>

          <div className="mt-10 pt-6 border-t border-gray-100">
     
            <Link 
              href={`/${locale}/news`} 
              className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to All News
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}