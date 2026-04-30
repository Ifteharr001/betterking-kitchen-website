import { setRequestLocale } from "next-intl/server";
import TrackOrderClient from "./TrackOrderClient";

export const revalidate = 86400; 

export function generateStaticParams() {
  return [
    { locale: 'en' }, { locale: 'bn' }, { locale: 'fr' }, 
    { locale: 'es' }, { locale: 'ar' }, { locale: 'zh' }
  ]; 
}

export default async function TrackOrderPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  setRequestLocale(locale);

  return <TrackOrderClient />;
}