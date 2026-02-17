"use client"; 
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  price: string;
  description: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 py-12 md:py-20 mt-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              All Commercial Kitchen <span className="text-primary">Equipment</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our complete catalog of high-performance kitchen machinery designed for modern culinary businesses.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading products...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
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
                      {product.category}
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
              <p className="text-gray-500 mt-2">Start adding products from your admin panel.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}