import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Images (Ensure these are in your public folder or imported correctly)
// If in public folder, use string paths like "/product-oven.png"
import productOven from "@/assets/product-oven.png";
import productMixer from "@/assets/product-mixer.png";
import productFridge from "@/assets/product-fridge.png";
import heroKitchen from "@/assets/hero-kitchen.png"; 

// Future Database Schema Example:
// interface Product {
//   id: string;
//   title: string;
//   description: string;
//   image: string;
//   link: string;
//   discount?: string;
// }

const FeaturedProducts = () => {
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-primary" />
            <p className="text-primary font-bold text-xs md:text-sm tracking-wider uppercase">
              Betterking Elite Series
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 md:gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                Master Your Kitchen
              </h2>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mt-1">
                <span className="gradient-headline">With Precision</span>
              </h2>
              <p className="text-gray-600 max-w-lg mt-4 md:mt-6 leading-relaxed text-sm md:text-base">
                Our flagship equipment series integrates advanced AI monitoring with industrial-grade durability, setting a new benchmark for culinary performance.
              </p>
            </div>
            
            <button className="btn-gold shrink-0 self-start lg:self-end flex items-center gap-2 text-sm">
              Browse All Collection
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          
          <Link 
            href="/product/procombi-5000" 
            className="group bg-gray-50 rounded-xl overflow-hidden sm:row-span-2 lg:row-span-2 flex flex-col relative"
          >
            <div className="flex-1 flex items-center justify-center p-6 md:p-8 min-h-[200px] md:min-h-[280px]">
              <Image 
                src={productOven} 
                alt="Commercial Kitchen Equipment"
                width={400}
                height={400}
                className="max-w-full max-h-[180px] md:max-h-[240px] object-contain group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 md:p-6 text-center">
              <h3 className="font-bold text-lg md:text-xl text-gray-900 mb-2">
                Save up to $600 on select<br />Home Appliance.
              </h3>
              <p className="text-xs md:text-sm text-gray-500 mb-4 md:mb-5">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <button className="bg-primary text-primary-foreground font-semibold px-5 md:px-6 py-2 md:py-2.5 text-xs md:text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors">
                VIEW MORE
              </button>
            </div>
          </Link>

          <Link 
            href="/product/titan-mixmaster" 
            className="group relative rounded-xl overflow-hidden sm:row-span-2 lg:row-span-2 min-h-[300px] sm:min-h-[400px] lg:min-h-0"
          >
            <Image 
              src={heroKitchen} 
              alt="Kitchen Accessories"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
            <div className="relative z-10 p-5 md:p-6 text-white">
              <h3 className="font-bold text-lg md:text-xl mb-3 leading-tight">
                Enjoy sensational<br />discounts of up to 50%<br />this month only!
              </h3>
              <p className="text-xs md:text-sm text-white/80 mb-4 md:mb-5 max-w-[200px]">
                Lorem ipsum dolor sit amet consectetur adipiscing elit dolor
              </p>
              <button className="bg-primary text-primary-foreground font-semibold px-5 md:px-6 py-2 md:py-2.5 text-xs md:text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors">
                VIEW MORE
              </button>
            </div>
          </Link>

          <Link 
            href="/product/arcticflow-reachin" 
            className="group relative rounded-xl overflow-hidden min-h-[180px] md:min-h-[200px] sm:col-span-2 lg:col-span-2"
          >
            <Image 
              src={productFridge} 
              alt="Modern Kitchen"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            <div className="relative z-10 p-5 md:p-6 text-white flex flex-col justify-center h-full items-start">
              <h3 className="font-bold text-lg md:text-xl mb-3 leading-tight">
                Elevate your bathing<br />experience
              </h3>
              <button className="bg-primary text-primary-foreground font-semibold px-5 md:px-6 py-2 md:py-2.5 text-xs md:text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors">
                VIEW MORE
              </button>
            </div>
          </Link>

          <Link 
            href="/product/procombi-5000" 
            className="group relative rounded-xl overflow-hidden min-h-[180px] md:min-h-[200px] sm:col-span-2 lg:col-span-2"
          >
            <Image 
              src={productMixer} 
              alt="Kitchen Essentials"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            <div className="relative z-10 p-5 md:p-6 text-white flex flex-col justify-center h-full items-start">
              <h3 className="font-bold text-lg md:text-xl mb-3 leading-tight">
                Explore our Kitchen<br />Essentials Collection
              </h3>
              <button className="bg-primary text-primary-foreground font-semibold px-5 md:px-6 py-2 md:py-2.5 text-xs md:text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors">
                VIEW MORE
              </button>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;