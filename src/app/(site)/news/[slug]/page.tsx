import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Tag, ArrowLeft } from "lucide-react";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";

export const dynamic = "force-dynamic";

async function getBlog(slug: string) {
  try {
    await connectDB();
    const blog = await Blog.findOne({ slug }).lean();
    
    if (!blog) return null;

    return {
      ...blog,
      _id: (blog._id as any).toString(),
      createdAt: blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "N/A"
    };
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

export default async function BlogDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  
  const { slug } = await params;
  
  const blog = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white py-12 md:py-20 mt-16">
      {/* Hero Image Section */}
      <div className="w-full h-[300px] md:h-[500px] relative">
        <Image
          src={blog.image || "/placeholder.jpg"}
          alt={blog.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white max-w-4xl mx-auto leading-tight">
              {blog.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 max-w-4xl -mt-10 relative z-10">
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-10 border border-gray-100">
          
          {/* Meta Info */}
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

          {/* Main Content */}
          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
            <div className="whitespace-pre-wrap">
              {blog.description}
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-10 pt-6 border-t border-gray-100">
            <Link 
              href="/news" 
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