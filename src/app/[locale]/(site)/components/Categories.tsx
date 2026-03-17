import Link from "next/link";
import Image from "next/image";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import SubCategory from "@/models/SubCategory";

import { getLocale, getTranslations } from "next-intl/server";

async function getCategories(locale: string) {
  try {
    await dbConnect();
    const categories = await Category.find({}).lean();
    const subCategories = await SubCategory.find({}).lean();

    return categories.map((cat: any) => ({
      _id: cat._id.toString(),
      name: cat.name?.[locale] || cat.name?.en || "", 
      slug: cat.slug,
      image: cat.image && cat.image !== "" ? cat.image : "/placeholder.svg",
      subCategories: subCategories.filter(
        (sub: any) => String(sub.categoryId) === String(cat._id)
      )
    }));
  } catch (error) {
    console.error("Failed to fetch categories", error);
    return [];
  }
}

export default async function Categories() {
  const locale = await getLocale();
  const categories = await getCategories(locale);
 
  const t = await getTranslations("Categories"); 

  return (
    <section className="py-12 md:py-20 bg-gray-50 relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} 
      />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mt-12 tracking-tight text-gray-900 mb-3 md:mb-4">
            {t("title")}
          </h2>
          <p className="text-sm md:text-lg max-w-2xl mx-auto text-gray-600">
            {t("subtitle")}
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="text-center text-gray-500 py-10">{t("noCategories")}</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link href={`/${locale}/categories/${category.slug}`} key={category._id}>
                <div className="bg-white rounded-xl p-4 md:p-6 text-center group border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 cursor-pointer h-full flex flex-col justify-between items-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 md:mb-4 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 relative">
         
                    <Image 
                      src={category.image} 
                      alt={category.name || "Category Image"} 
                      fill
                      sizes="(max-width: 768px) 64px, 80px"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      quality={80}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base line-clamp-2">
                      {category.name}
                    </h3>
                    <p className="text-[11px] md:text-xs text-gray-500">
                      {category.subCategories?.length || 0} {t("subCategories")}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}