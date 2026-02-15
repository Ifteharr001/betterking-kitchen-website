"use client"; 

import Image from "next/image";
import Marquee from "react-fast-marquee"; 

import brandMarriott from "@/assets/brand-marriott.png";
import brandHilton from "@/assets/brand-hilton.png";
import brandHyatt from "@/assets/brand-hyatt.png";
import brandSheraton from "@/assets/brand-sheraton.png";
import brandIhg from "@/assets/brand-ihg.png";
import brandPeninsula from "@/assets/brand-peninsula.png";
import brandWhiteswan from "@/assets/brand-whiteswan.png";
import brandFairmont from "@/assets/brand-fairmont.png";

const brands = [
  { name: "Marriott", logo: brandMarriott },
  { name: "Hilton", logo: brandHilton },
  { name: "Hyatt", logo: brandHyatt },
  { name: "Sheraton", logo: brandSheraton },
  { name: "IHG", logo: brandIhg },
  { name: "Peninsula", logo: brandPeninsula },
  { name: "White Swan", logo: brandWhiteswan },
  { name: "Fairmont", logo: brandFairmont },
];

const TrustedBrands = () => {
  return (
    <section 
      className="py-12 md:py-20 relative overflow-hidden" 
      style={{
        background: 'linear-gradient(135deg, #fefefe 0%, #f8f9fa 50%, #f1f3f5 100%)'
      }}
    >
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='hexagons' fill='%23000000' fill-opacity='1' fill-rule='nonzero'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-slate-200/60 to-transparent rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-10 md:mb-14">
          <p className="text-xs md:text-sm tracking-wider uppercase font-bold text-gray-500 mb-2">
            Trusted by Global Hospitality Leaders
          </p>
          <div className="w-16 h-0.5 bg-primary mx-auto" />
        </div>
        
        <div className="w-full">
          <Marquee 
            speed={40}
            gradient={true}
            gradientColor="white" 
            gradientWidth={100} 
            autoFill={true} 
            pauseOnHover={true} 
          >
            {brands.map((brand, index) => (
              <div key={index} className="mx-8 md:mx-12"> 
                <Image 
                  src={brand.logo} 
                  alt={brand.name}
                  height={80} 
                  className="h-10 sm:h-14 md:h-16 lg:h-20 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                />
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
};

export default TrustedBrands;