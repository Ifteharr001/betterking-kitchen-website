import Categories from "../components/Categories";
import ProductsClient from "./ProductsClient";
import { Suspense } from "react";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  
  const isSearchActive = !!(params?.search || params?.q);
  
  const isCategoryActive = !!params?.category;
  
  const shouldHideCategories = isSearchActive || isCategoryActive;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      {!shouldHideCategories && <Categories />}
      
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }>
        <ProductsClient />
      </Suspense>
    </div>
  );
}