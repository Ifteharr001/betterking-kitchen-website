import connectDB from "@/lib/db";
import Product from "@/models/Product"; 
import { setRequestLocale } from "next-intl/server";
import ProductDetailsClient from "./ProductDetailsClient";

export const revalidate = 86400; 

export async function generateStaticParams() {
  const locales = ['en', 'bn', 'fr', 'es', 'ar', 'zh'];
  await connectDB();
  
  const products = await Product.find({}).select('_id').lean();

  const params = [];
  for (const locale of locales) {
    for (const prod of products) {
      params.push({ 
        locale, 
        id: (prod._id as any).toString() 
      });
    }
  }
  return params;
}

export default async function Page({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const { id, locale } = await params;
  
  setRequestLocale(locale);

  return <ProductDetailsClient params={Promise.resolve({ id })} />;
}