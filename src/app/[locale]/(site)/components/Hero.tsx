"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import heroImage from "@/assets/hero-kitchen.png"; 

const Hero = () => {
  const t = useTranslations("Hero");

  const slides = [
    {
      id: 1,
      badge: t("slides.0.badge"),
      title: t("slides.0.title"),
      highlight: t("slides.0.highlight"),
      description: t("slides.0.description"),
      video: null,
      image: heroImage, 
      overlay: "bg-gradient-to-r from-[#0a1628]/95 via-[#0a1628]/70 to-[#0a1628]/30",
      cta: { 
        primary: { text: t("slides.0.ctaPrimary"), link: "/products" }, 
        secondary: { text: t("slides.0.ctaSecondary"), link: "/projects", isModal: false }
      }
    },
    {
      id: 2,
      badge: t("slides.1.badge"),
      title: t("slides.1.title"),
      highlight: t("slides.1.highlight"),
      description: t("slides.1.description"),
      video: "/videos/hero-video-2.mp4",
      image: heroImage,
      overlay: "bg-gradient-to-r from-[#0a1628]/95 via-[#0a1628]/70 to-[#0a1628]/30",
      cta: { 
        primary: { text: t("slides.1.ctaPrimary"), link: "/products" }, 
        secondary: { text: t("slides.1.ctaSecondary"), link: "#", isModal: true }
      }
    },
    {
      id: 3,
      badge: t("slides.2.badge"),
      title: t("slides.2.title"),
      highlight: t("slides.2.highlight"),
      description: t("slides.2.description"),
      video: "/videos/hero-video-3.mp4",
      image: heroImage,
      overlay: "bg-gradient-to-r from-[#1a3a5c]/90 via-[#1a3a5c]/60 to-[#1a3a5c]/20",
      cta: { 
        primary: { text: t("slides.2.ctaPrimary"), link: "/projects" }, 
        secondary: { text: t("slides.2.ctaSecondary"), link: "#", isModal: true } 
      }
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0a1628]">
      
      {slides.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 z-0 transition-opacity duration-700 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image 
            src={slide.image} 
            alt="Kitchen Background" 
            fill
            priority={index === 0} 
            className="object-cover"
            placeholder="blur"
            quality={90}
            sizes="100vw"
          />
          
          {slide.video && (
            <video
              key={slide.video}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover z-[1]"
              onLoadedData={(e) => {
                (e.target as HTMLVideoElement).play();
              }}
            >
              <source src={slide.video} type="video/mp4" />
            </video>
          )}
          <div className={`absolute inset-0 z-[2] ${slide.overlay}`} />
        </div>
      ))}

      <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-24 md:pt-32">
        <div className="max-w-2xl">
          {slides.map((slide, index) => (
            <div 
              key={slide.id}
              className={`transition-all duration-500 ${
                index === currentSlide 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8 absolute pointer-events-none'
              }`}
            >
              <span className="badge-gold mb-4 md:mb-6 inline-block text-[10px] md:text-xs">
                {slide.badge}
              </span>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 md:mb-6 text-white">
                {slide.title} <br />
                <span className="gradient-headline">{slide.highlight}</span>
              </h1>
              
              <p className="text-sm sm:text-base md:text-lg text-white/70 mb-6 md:mb-8 max-w-xl">
                {slide.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href={slide.cta.primary.link} className="btn-gold text-sm md:text-base text-center inline-flex items-center justify-center">
                  {slide.cta.primary.text}
                </Link>
                
                {slide.cta.secondary.isModal ? (
                  <button 
                    onClick={() => window.dispatchEvent(new Event("openContactModal"))}
                    className="inline-flex items-center justify-center gap-2 px-5 md:px-6 py-3 text-sm font-semibold rounded-lg border border-white/30 text-white hover:bg-white/10 transition-all duration-300"
                  >
                    {slide.cta.secondary.text}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <Link 
                    href={slide.cta.secondary.link} 
                    className="inline-flex items-center justify-center gap-2 px-5 md:px-6 py-3 text-sm font-semibold rounded-lg border border-white/30 text-white hover:bg-white/10 transition-all duration-300"
                  >
                    {slide.cta.secondary.text}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}

              </div>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      <div className="absolute right-4 sm:right-8 lg:right-12 bottom-8 sm:bottom-10 z-20 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 ${
              index === currentSlide 
                ? 'w-8 sm:w-10 h-2 bg-primary rounded-full' 
                : 'w-2 h-2 bg-white/40 rounded-full hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center z-20 hidden md:block">
        <span className="text-xs tracking-widest text-white/60 uppercase mb-3 block">
          {t("scroll")}
        </span>
        <div className="w-px h-12 bg-primary mx-auto scroll-indicator" />
      </div>
    </section>
  );
};

export default Hero;