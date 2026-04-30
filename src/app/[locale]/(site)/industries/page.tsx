import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import IndustriesPageClient from "./IndustriesPageClient";

export const revalidate = 86400;

export function generateStaticParams() {
  return [
    { locale: 'en' }, { locale: 'bn' }, { locale: 'fr' }, 
    { locale: 'es' }, { locale: 'ar' }, { locale: 'zh' }
  ]; 
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Industries" });

  return {
    title: t("title") || "Industries | BetterKing",
    description: t("description") || "Explore our industries and solutions",
    keywords: ["industries", "solutions", "BetterKing"],
  };
}

// 
export default async function IndustriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  setRequestLocale(locale);

  return <IndustriesPageClient />;
}