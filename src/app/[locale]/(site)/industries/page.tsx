import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import IndustriesPageClient from "./IndustriesPageClient";

export const revalidate = 3600;
export const dynamic = 'auto';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Industries" });

  return {
    title: t("title") || "Industries | BetterKing",
    description: t("description") || "Explore our industries and solutions",
    keywords: ["industries", "solutions", "BetterKing"],
  };
}

export default function IndustriesPage() {
  return <IndustriesPageClient />;
}