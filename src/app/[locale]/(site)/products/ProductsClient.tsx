"use client"; 

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, SearchX } from "lucide-react"; 
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl"; 
 
const getLocalizedText = (val: any, locale: string) => {
  if (!val) return "";
  if (typeof val === 'string') return val;
  return val[locale] || val.en || Object.values(val)[0] || ""; 
};

interface Product {
  id: string;
  name: any;
  category: string;
  subCategory?: string;
  image: string;
  price: string;
  description: any;
}

interface CategoryData {
  _id: string;
  name: any;
  slug: string;
  subCategories: { _id: string; name: any; slug: string; }[];
}

export default function ProductsClient() {
  const locale = useLocale(); 
  const t = useTranslations("ProductsPage"); 
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");
  const subcategorySlug = searchParams.get("subcategory");
  
  const searchQuery = searchParams.get("search") || searchParams.get("q");

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  const [pageTitle, setPageTitle] = useState("");
  const [pageDescription, setPageDescription] = useState("");
  const [isDefaultTitle, setIsDefaultTitle] = useState(true);

  const getCategoryName = (catId: string) => {
    if (!catId) return "";
    const cat = categories.find((c) => c._id === catId);
    return cat ? getLocalizedText(cat.name, locale) : "";
  };

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
          const subCatNameLocal = getLocalizedText(selectedSubCategory.name, locale);
          setPageTitle(subCatNameLocal);
          
          setPageDescription(`${t("subCatDescPrefix")} ${subCatNameLocal.toLowerCase()} ${t("subCatDescSuffix")}`);
          setIsDefaultTitle(false);
          
          result = result.filter(p => p.subCategory === selectedSubCategory._id);
        }
      }
    } else {
      setIsDefaultTitle(true);
      setPageDescription(t("defaultDesc"));
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim(); 
      
      result = result.filter(p => {
        const productName = getLocalizedText(p.name, locale).toLowerCase();
        const productDesc = getLocalizedText(p.description, locale).toLowerCase();
        const catName = getCategoryName(p.category).toLowerCase();
        
        return productName.includes(query) || productDesc.includes(query) || catName.includes(query);
      });
      
      if (!categorySlug) {
        setIsDefaultTitle(false);
        setPageTitle(`Search Results for "${searchQuery}"`);
        setPageDescription(`Found ${result.length} products matching your search.`);
      }
    }

    setFilteredProducts(result);
  }, [allProducts, categories, categorySlug, subcategorySlug, searchQuery, locale, t]); 

  return (
    <main className="flex-1 py-12 md:py-20 mt-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 capitalize">
            {isDefaultTitle ? (
              <>{t("defaultTitle")} <span className="text-primary">{t("defaultTitleSpan")}</span></>
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
            <p className="text-gray-500 mt-4">{t("loading")}</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                prefetch={false}
                href={`/${locale}/product/${product.id}`} 
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300 flex flex-col"
              >
                <div className="aspect-square bg-gray-50 p-3 sm:p-6 flex items-center justify-center relative overflow-hidden">
                  <Image
                    src={product.image}
                    alt={getLocalizedText(product.name, locale)}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                    className="object-contain p-2 sm:p-4 group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    quality={85}
                  />
                  <div className="absolute bottom-4 right-4 gap-2 translate-y-10 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100 hidden sm:flex">
                    <span className="bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-primary">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                <div className="p-3 sm:p-5 flex-1 flex flex-col">
                  <span className="text-[10px] sm:text-xs font-bold text-primary uppercase tracking-wider mb-1 sm:mb-2 line-clamp-1">
                    {getCategoryName(product.category) || "Product"}
                  </span>
                  <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {getLocalizedText(product.name, locale)}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mb-3 sm:mb-4 flex-1">
                    {getLocalizedText(product.description, locale)?.substring(0, 60)}...
                  </p>
                  <div className="mt-auto pt-3 sm:pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-gray-900">{t("viewDetails")}</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm max-w-2xl mx-auto">
            <SearchX className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t("noProducts")}</h2>
            <p className="text-gray-500 mb-6">
              {searchQuery 
                ? `We couldn't find any products matching "${searchQuery}". Please try checking your spelling or use more general terms.` 
                : (subcategorySlug ? t("noProductsSubCat") : t("noProductsAdmin"))}
            </p>
            
            <Link 
              href={`/${locale}/products`} 
              prefetch={false}
              className="inline-block px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-md"
            >
              {t("viewAllBtn")}
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}