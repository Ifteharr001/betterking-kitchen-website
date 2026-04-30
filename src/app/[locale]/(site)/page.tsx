import React from 'react';
import { setRequestLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';

import Hero from './components/Hero';

const Categories = dynamic(() => import('./components/Categories'));
const TrustedBrands = dynamic(() => import('./components/TrustedBrands'));
const FeaturedProducts = dynamic(() => import('./components/FeaturedProducts'));
const ProductGrid = dynamic(() => import('./components/ProductGrid'));
const WhyChooseUs = dynamic(() => import('./components/WhyChooseUs'));
const Industries = dynamic(() => import('./components/Industries'));

export const revalidate = 86400;

export function generateStaticParams() {
  return [
    { locale: 'en' }, { locale: 'bn' }, { locale: 'fr' }, 
    { locale: 'es' }, { locale: 'ar' }, { locale: 'zh' }
  ]; 
}

const homePage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  
  setRequestLocale(locale);

  return (
    <div>
      <Hero />
      <Categories />
      <TrustedBrands />
      <FeaturedProducts />
      <ProductGrid />
      <WhyChooseUs />
      <Industries />
    </div>
  );
};

export default homePage;