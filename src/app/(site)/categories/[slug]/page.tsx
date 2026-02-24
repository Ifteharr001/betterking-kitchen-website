"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ChevronRight, Home, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type SubCategory = {
  _id: string;
  name: string;
  slug: string;
  image: string;
};

type CategoryData = {
  _id: string;
  name: string;
  description: string;
  subCategories: SubCategory[];
};

export default function SubCategoriesPage({ params }: { params: Promise<{ slug: string }> }) {

  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  
  const [category, setCategory] = useState<CategoryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();
        
        if (data.categories) {
          const foundCategory = data.categories.find((c: any) => c.slug === slug);
          setCategory(foundCategory || null);
        }
      } catch (error) {
        console.error("Error fetching sub-categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold mb-2">Category Not Found</h2>
        <p className="text-gray-500 mb-6">The category you are looking for does not exist or has been removed.</p>
        <Link href="/">
          <Button><ArrowLeft className="w-4 h-4 mr-2" /> Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 lg:px-8">
        
        <nav className="flex items-center text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-primary transition-colors flex items-center">
            <Home className="w-4 h-4 mr-1" /> Home
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900 font-medium">{category.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-10 mt-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{category.name}</h1>
          {category.description && (
            <p className="text-gray-600 max-w-3xl">{category.description}</p>
          )}
        </div>

        {/* Sub-Categories Grid */}
        {category.subCategories?.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center border border-gray-100 shadow-sm">
            <p className="text-gray-500">No sub-categories available for this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {category.subCategories.map((sub) => (
              <Link href={`/products?category=${slug}&subcategory=${sub.slug}`} key={sub._id}>
                <div className="bg-white rounded-xl p-4 text-center group border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 h-full flex flex-col">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-lg overflow-hidden bg-gray-50 relative">
                    <img 
                      src={sub.image} 
                      alt={sub.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/150?text=No+Image";
                      }}
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm md:text-base group-hover:text-primary transition-colors mt-auto">
                    {sub.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}
        
      </div>
    </div>
  );
}