import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import SubCategory from "@/models/SubCategory";

import { getTranslations, setRequestLocale } from "next-intl/server";

export const revalidate = 86400; 

export async function generateStaticParams() {
  const locales = ['en', 'bn', 'fr', 'es', 'ar', 'zh'];
  await dbConnect();
  
  const categories = await Category.find({}).select('slug').lean();

  const params = [];
  for (const locale of locales) {
    for (const cat of categories) {
      if (cat.slug) {
        params.push({ 
          locale, 
          slug: cat.slug 
        });
      }
    }
  }
  return params;
}

type SubCategoryType = {
  _id: string;
  name: string;
  slug: string;
  image: string;
};

type CategoryData = {
  _id: string;
  name: string;
  description: string;
  subCategories: SubCategoryType[];
};

const getLocalizedText = (val: any, locale: string) => {
  if (!val) return "";
  if (typeof val === 'string') return val;
  return val[locale] || val.en || "";
};

async function getCategoryDetails(slug: string, locale: string): Promise<CategoryData | null> {
  try {
    await dbConnect();
    const category = await Category.findOne({ slug }).lean();
    if (!category) return null;

    const subCategories = await SubCategory.find({ categoryId: category._id }).lean();

    return {
      _id: category._id.toString(),
      name: getLocalizedText(category.name, locale),
      description: getLocalizedText(category.description, locale),
      subCategories: subCategories.map((sub: any) => ({
        _id: sub._id.toString(),
        name: getLocalizedText(sub.name, locale),
        slug: sub.slug,
        image: sub.image && sub.image !== "" ? sub.image : "/placeholder.svg",
      })),
    };
  } catch (error) {
    console.error("Error fetching category details:", error);
    return null;
  }
}

export default async function SubCategoriesPage({ 
  params 
}: { 
  params: Promise<{ slug: string, locale: string }> 
}) {
  const { slug, locale } = await params;
  
  setRequestLocale(locale);
  
  const category = await getCategoryDetails(slug, locale);
  const t = await getTranslations("SubCategories"); 

  if (!category) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold mb-2">{t("notFoundTitle")}</h2>
        <p className="text-gray-500 mb-6">{t("notFoundDesc")}</p>
        <Link href={`/${locale}`}>
          <Button><ArrowLeft className="w-4 h-4 mr-2" /> {t("backToHome")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 mt-16">
      <div className="container mx-auto px-4 lg:px-8">
        
        <nav className="flex items-center text-sm text-gray-500 mb-8">
          <Link href={`/${locale}`} className="hover:text-primary transition-colors flex items-center">
            <Home className="w-4 h-4 mr-1" /> {t("home")}
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link href={`/${locale}/categories`} className="hover:text-primary transition-colors">
            {t("categories")}
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900 font-medium">{category.name}</span>
        </nav>

        <div className="mb-10 mt-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{category.name}</h1>
          {category.description && (
            <p className="text-gray-600 max-w-3xl">{category.description}</p>
          )}
        </div>

        {/* Sub-Categories Grid */}
        {category.subCategories?.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center border border-gray-100 shadow-sm">
            <p className="text-gray-500">{t("noSubCategories")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {category.subCategories.map((sub) => (
              <Link href={`/${locale}/products?category=${slug}&subcategory=${sub.slug}`} key={sub._id}>
                <div className="bg-white rounded-xl p-4 text-center group border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 h-full flex flex-col">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-lg overflow-hidden bg-gray-50 relative">
                    <Image 
                      src={sub.image} 
                      alt={sub.name} 
                      fill
                      sizes="(max-width: 768px) 96px, 96px"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
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