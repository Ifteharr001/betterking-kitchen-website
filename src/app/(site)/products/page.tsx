"use client"; 

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

interface Product {
  id: string;
  name: string;
  category: string;
  subCategory?: string;
  image: string;
  price: string;
  description: string;
}

interface CategoryData {
  _id: string;
  name: string;
  slug: string;
  subCategories: { _id: string; name: string; slug: string; }[];
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");
  const subcategorySlug = searchParams.get("subcategory");

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  const [pageTitle, setPageTitle] = useState("All Commercial Kitchen Equipment");
  const [pageDescription, setPageDescription] = useState("Browse our complete catalog of high-performance kitchen machinery designed for modern culinary businesses.");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/admin/categories")
        ]);
        
        if (!prodRes.ok) throw new Error("Failed to fetch products");
        
        const productsData = await prodRes.json();
        const catData = await catRes.json();
        
        setAllProducts(productsData);
        if (catData.categories) {
          setCategories(catData.categories);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (allProducts.length === 0 || categories.length === 0) return;

    let result = [...allProducts];

    if (categorySlug && subcategorySlug) {
      const selectedCategory = categories.find(c => c.slug === categorySlug);
      
      if (selectedCategory) {
        const selectedSubCategory = selectedCategory.subCategories?.find(s => s.slug === subcategorySlug);
        
        if (selectedSubCategory) {
         
          setPageTitle(selectedSubCategory.name);
          setPageDescription(`Explore our top-quality ${selectedSubCategory.name.toLowerCase()} for your commercial kitchen needs.`);
          
          result = result.filter(p => p.subCategory === selectedSubCategory._id);
        }
      }
    } else {
      setPageTitle("All Commercial Kitchen Equipment");
      setPageDescription("Browse our complete catalog of high-performance kitchen machinery designed for modern culinary businesses.");
    }

    setFilteredProducts(result);
  }, [allProducts, categories, categorySlug, subcategorySlug]);

  const getCategoryName = (catId: string) => {
    if (!catId) return "Category";
    const cat = categories.find((c) => c._id === catId);
    return cat ? cat.name : "Category";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 py-12 md:py-20 mt-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 capitalize">
              {pageTitle.includes("All Commercial") ? (
                <>All Commercial Kitchen <span className="text-primary">Equipment</span></>
              ) : (
                <>{pageTitle}</>
              )}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {pageDescription}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading products...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300 flex flex-col"
                >
                  <div className="aspect-square bg-gray-50 p-6 flex items-center justify-center relative overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute bottom-4 right-4 flex gap-2 translate-y-10 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                      <span className="bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-primary">
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                      {getCategoryName(product.category)}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                      {product.description?.substring(0, 60)}...
                    </p>
                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">View Details</span>
                      <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-400">No products found.</h2>
              <p className="text-gray-500 mt-2">
                {subcategorySlug 
                  ? "We currently don't have any products in this sub-category." 
                  : "Start adding products from your admin panel."}
              </p>
              {subcategorySlug && (
                <Link href="/products">
                  <button className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                    View All Products
                  </button>
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}