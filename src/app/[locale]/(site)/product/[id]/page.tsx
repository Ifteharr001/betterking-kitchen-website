import { setRequestLocale } from "next-intl/server";
import ProductDetailsClient from "./ProductDetailsClient";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const { id, locale } = await params;
  
  setRequestLocale(locale);

  return <ProductDetailsClient params={Promise.resolve({ id })} />;
}