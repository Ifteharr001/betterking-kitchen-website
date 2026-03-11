"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

interface RelatedProductsProps {
  currentProductId: string;
}

interface Product {
  id: string;
  name: any;
  category: any;
  image: string;
}

const getLocalizedText = (val: any, locale: string) => {
  if (!val) return "";
  if (typeof val === 'string') return val;
  return val[locale] || val.en || "";
};

const RelatedProducts = ({ currentProductId }: RelatedProductsProps) => {
  const locale = useLocale();
  const t = useTranslations("RelatedProducts"); 

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductsAndCats = async () => {
      try {
        const [resProd, resCat] = await Promise.all([
           fetch('/api/products'),
           fetch('/api/admin/categories') 
        ]);

        if (!resProd.ok) throw new Error("Failed to fetch products");
        
        const dataProd = await resProd.json();
        const dataCat = await resCat.json();

        if(dataCat.categories) {
            setCategories(dataCat.categories);
        }

        const filtered = dataProd
          .filter((p: Product) => p.id !== currentProductId)
          .slice(0, 4);

        setRelatedProducts(filtered);
      } catch (error) {
        console.error("Error loading related products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndCats();
  }, [currentProductId]);

  const getCategoryName = (catId: string) => {
    if (!catId) return "";
    const cat = categories.find((c) => c._id === catId);
    return cat ? getLocalizedText(cat.name, locale) : catId;
  };

  if (loading) return <div className="py-10 text-center">{t("loading")}</div>;

  if (relatedProducts.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {relatedProducts.map((product) => (
          <Link
            key={product.id}
            href={`/${locale}/product/${product.id}`}
            className="group bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-primary transition-all duration-300"
          >
            <div className="aspect-square bg-white rounded-lg mb-3 flex items-center justify-center overflow-hidden border border-gray-100 relative">
              <Image 
                src={product.image} 
                alt={getLocalizedText(product.name, locale)} 
                fill 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="text-xs text-primary font-medium uppercase tracking-wide mb-1">
              {getCategoryName(product.category)}
            </p>
            <h4 className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
              {getLocalizedText(product.name, locale)}
            </h4>
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500 group-hover:text-primary transition-colors">
              <span>{t("viewDetails")}</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;