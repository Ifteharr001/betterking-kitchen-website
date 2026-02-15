"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface RelatedProductsProps {
  currentProductId: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
}

const RelatedProducts = ({ currentProductId }: RelatedProductsProps) => {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error("Failed to fetch products");
        
        const data = await res.json();

        const filtered = data
          .filter((p: Product) => p.id !== currentProductId)
          .slice(0, 4);

        setRelatedProducts(filtered);
      } catch (error) {
        console.error("Error loading related products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentProductId]);

  if (loading) return <div className="py-10 text-center">Loading more products...</div>;

  if (relatedProducts.length === 0) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">More Products</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {relatedProducts.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="group bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-primary transition-all duration-300"
          >
            <div className="aspect-square bg-white rounded-lg mb-3 flex items-center justify-center overflow-hidden border border-gray-100 relative">
              <Image 
                src={product.image} 
                alt={product.name}
                fill 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="text-xs text-primary font-medium uppercase tracking-wide mb-1">{product.category}</p>
            <h4 className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h4>
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500 group-hover:text-primary transition-colors">
              <span>View Details</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;