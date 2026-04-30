import Categories from "../components/Categories";
import ProductsClient from "./ProductsClient";
import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";

export const revalidate = 86400; 

export function generateStaticParams() {
  return [
    { locale: 'en' }, { locale: 'bn' }, { locale: 'fr' }, 
    { locale: 'es' }, { locale: 'ar' }, { locale: 'zh' }
  ]; 
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  setRequestLocale(locale);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }>
        <ProductsClient categories={<Categories />} />
      </Suspense>
      
    </div>
  );
}