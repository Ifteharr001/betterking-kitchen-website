import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Tag } from "lucide-react";
import connectDB from "@/lib/db"; 
import Blog from "@/models/Blog";

export const dynamic = "force-dynamic";

async function getBlogs() {
  try {
    await connectDB();
    const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean();
    
    return blogs.map((blog: any) => ({
      ...blog,
      _id: blog._id.toString(),
      createdAt: blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "N/A"
    }));
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export default async function BlogPage() {
  const blogs = await getBlogs();

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-20 mt-16">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Latest <span className="text-primary">News & Insights</span>
          </h1>
          <p className="text-gray-600">
            Stay updated with the latest trends in commercial kitchen technology.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <h2 className="text-xl font-semibold">No news available yet.</h2>
            <p>Please check back later.</p>
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
                    href={`/news/${blog.slug}`} 
                    className="inline-flex items-center justify-center bg-black text-white text-xs font-bold px-5 py-2.5 rounded hover:bg-primary hover:text-white transition-colors w-fit"
                  >
                    Read More
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