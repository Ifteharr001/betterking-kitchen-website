import { setRequestLocale } from 'next-intl/server';
import AboutUs from './AboutUs'; 

export function generateStaticParams() {
  return [
    { locale: 'en' }, { locale: 'bn' }, { locale: 'fr' }, 
    { locale: 'es' }, { locale: 'ar' }, { locale: 'zh' }
  ]; 
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  setRequestLocale(locale); 

  return (
    <AboutUs />
  );
}