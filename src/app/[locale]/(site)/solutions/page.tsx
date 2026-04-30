import { setRequestLocale } from "next-intl/server";
import SolutionsClient from "./SolutionsClient";
import connectDB from "@/lib/db";
import Industry from "@/models/Industry";
import Category from "@/models/Category";

export const revalidate = 86400;

export function generateStaticParams() {
  return [
    { locale: 'en' }, { locale: 'bn' }, { locale: 'fr' }, 
    { locale: 'es' }, { locale: 'ar' }, { locale: 'zh' }
  ]; 
}

export default async function SolutionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  await connectDB();
  const [industriesData, categoriesData] = await Promise.all([
    Industry.find({}).limit(6).lean(),
    Category.find({}).limit(8).lean()
  ]);

  const industries = JSON.parse(JSON.stringify(industriesData));
  const categories = JSON.parse(JSON.stringify(categoriesData));

  return <SolutionsClient initialIndustries={industries} initialCategories={categories} />;
}