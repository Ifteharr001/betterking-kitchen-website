import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Tag } from "lucide-react";
import connectDB from "@/lib/db"; 
import Blog from "@/models/Blog";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

async function getBlogs(locale: string) {
  try {
    await connectDB();
    const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean();
    
    return blogs.map((blog: any) => ({
      ...blog,
      _id: blog._id.toString(),
      createdAt: blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "N/A",
      title: blog.title?.[locale] || blog.title?.en || "",
      category: blog.category?.[locale] || blog.category?.en || "",
      location: blog.location?.[locale] || blog.location?.en || "",
      shortDesc: blog.shortDesc?.[locale] || blog.shortDesc?.en || "",
    }));
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const blogs = await getBlogs(locale);
  
  const t = await getTranslations("NewsPage");

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-20 mt-16">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('latest')} <span className="text-primary">{t('newsInsights')}</span>
          </h1>
          <p className="text-gray-600">
            {t('subtitle')}
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <h2 className="text-xl font-semibold">{t('noNewsTitle')}</h2>
            <p>{t('noNewsSubtitle')}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {blogs.map((blog: any) => (
              <div 
                key={blog._id} 
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col md:flex-row group"
              >
                <div className="w-full md:w-72 h-48 md:h-auto relative shrink-0 overflow-hidden">
                  <Image
                    src={blog.image || "/placeholder.jpg"} 
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-6 flex flex-col justify-center flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-4 items-center">
                  
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span>{blog.createdAt || blog.date}</span> 
                    </div>
                    
                    {blog.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        <span>{blog.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-primary" />
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                        {blog.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-6 line-clamp-2">
                    {blog.shortDesc}
                  </p>

                  <Link 
                    href={`/${locale}/news/${blog.slug}`} 
                    className="inline-flex items-center justify-center bg-black text-white text-xs font-bold px-5 py-2.5 rounded hover:bg-primary hover:text-white transition-colors w-fit"
                  >
                    {t('readMore')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}