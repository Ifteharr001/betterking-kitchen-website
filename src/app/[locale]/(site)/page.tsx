import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

const Hero = dynamic(() => import('./components/Hero'), { ssr: true });
const Categories = dynamic(() => import('./components/Categories'), { ssr: true });
const TrustedBrands = dynamic(() => import('./components/TrustedBrands'));
const FeaturedProducts = dynamic(() => import('./components/FeaturedProducts'));
const ProductGrid = dynamic(() => import('./components/ProductGrid'));
const WhyChooseUs = dynamic(() => import('./components/WhyChooseUs'));
const Industries = dynamic(() => import('./components/Industries'));

export const revalidate = 3600;

const homePage = () => {
    return (
    <div >
      <Hero />
      <Categories      />
      <TrustedBrands />
      <FeaturedProducts />
      <ProductGrid />
      <WhyChooseUs />
      <Industries />
    </div>
  );
};

export default homePage;