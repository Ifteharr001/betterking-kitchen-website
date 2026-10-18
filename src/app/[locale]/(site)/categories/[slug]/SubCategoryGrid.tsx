"use client";

import Image from "next/image";
import Link from "next/link";

type SubCategory = {
  _id: string;
  name: string;
  slug: string;
  image: string;
};

type Props = {
  locale: string;
  categorySlug: string;
  fallbackImage: string;
  subCategories: SubCategory[];
};

export default function SubCategoryGrid({
  locale,
  categorySlug,
  fallbackImage,
  subCategories,
}: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {subCategories.map((sub) => (
        <Link href={`/${locale}/products?category=${categorySlug}&subcategory=${sub.slug}`} key={sub._id}>
          <div className="bg-white rounded-xl p-4 text-center group border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 h-full flex flex-col">
            <div className="w-24 h-24 mx-auto mb-4 rounded-lg overflow-hidden bg-gray-50 relative">
              <Image
                src={sub.image && sub.image !== "/placeholder.svg" ? sub.image : fallbackImage || "/placeholder.svg"}
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
  );
}