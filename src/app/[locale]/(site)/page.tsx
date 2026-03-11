import React from 'react';
import Hero from './components/Hero';
import Categories from './components/Categories';
import TrustedBrands from './components/TrustedBrands';
import FeaturedProducts from './components/FeaturedProducts';
import ProductGrid from './components/ProductGrid';
import WhyChooseUs from './components/WhyChooseUs';
import Industries from './components/Industries';

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