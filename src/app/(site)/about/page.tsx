"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Award, Users, Globe, Building2, CheckCircle, ArrowRight, 
  Quote, Play, Star, Target, Heart, Zap 
} from "lucide-react";

import aboutHero from "@/assets/about-hero.jpg";
import bossPhoto from "@/assets/boss-photo.jpg";
import brandMarriott from "@/assets/brand-marriott.png";
import brandHilton from "@/assets/brand-hilton.png";
import brandHyatt from "@/assets/brand-hyatt.png";
import brandIhg from "@/assets/brand-ihg.png";
import brandFairmont from "@/assets/brand-fairmont.png";
import brandSheraton from "@/assets/brand-sheraton.png";

const stats = [
  { number: "500+", label: "Projects Completed", icon: Building2 },
  { number: "20+", label: "Years Experience", icon: Award },
  { number: "50+", label: "Countries Served", icon: Globe },
  { number: "1000+", label: "Happy Clients", icon: Users },
];

const values = [
  { icon: Target, title: "Precision Engineering", desc: "Every product is designed with millimeter precision to ensure perfect fit and lasting performance in demanding commercial environments." },
  { icon: Star, title: "Uncompromising Quality", desc: "We source only the finest materials and apply rigorous quality control at every stage of manufacturing." },
  { icon: Heart, title: "Client-Centric Approach", desc: "Your kitchen vision drives our process. We listen, design, and deliver solutions tailored to your unique needs." },
  { icon: Zap, title: "Innovation Driven", desc: "Constantly pushing boundaries with the latest technology and energy-efficient designs for modern kitchens." },
];

const milestones = [
  { year: "2004", title: "Founded", desc: "BetterKing was established with a vision to revolutionize commercial kitchen solutions." },
  { year: "2010", title: "Global Expansion", desc: "Expanded operations to serve clients across Asia, Middle East, and Europe." },
  { year: "2016", title: "500+ Projects", desc: "Reached the milestone of completing over 500 commercial kitchen installations worldwide." },
  { year: "2020", title: "Innovation Hub", desc: "Launched our R&D center focused on energy-efficient and smart kitchen technologies." },
  { year: "2024", title: "Industry Leader", desc: "Recognized as a top commercial kitchen solutions provider serving 50+ countries." },
];

const brands = [
  { src: brandMarriott, name: "Marriott" },
  { src: brandHilton, name: "Hilton" },
  { src: brandHyatt, name: "Hyatt" },
  { src: brandIhg, name: "IHG" },
  { src: brandFairmont, name: "Fairmont" },
  { src: brandSheraton, name: "Sheraton" },
];

const AboutUs = () => {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setVideoPlaying(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">


      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary to-background" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="badge-gold mb-6 inline-block">About BetterKing</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-foreground">Powering </span>
              <span className="gradient-headline">World-Class</span>
              <span className="text-foreground"> Kitchens</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for professionals and trusted Worldwide. Elevating Hospitality & Culinary Excellence since 2004.
            </p>
          </div>
        </div>
      </section>

      {/* Video Section - White */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
              <video
                ref={videoRef}
                className="w-full aspect-video object-cover"
                controls={videoPlaying}
                poster={aboutHero.src}
                playsInline
              >
                <source src="/videos/about-video.mp4" type="video/mp4" />
              </video>
              {!videoPlaying && (
                <div 
                  className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer group-hover:bg-black/30 transition-all" 
                  onClick={handlePlayVideo}
                >
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-primary-foreground ml-1" />
                  </div>
                </div>
              )}
            </div>
            <div className="mt-8 text-center">
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Discover how BetterKing transforms commercial spaces into world-class culinary environments with cutting-edge kitchen solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Dark */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-xl border border-border bg-card">
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl md:text-4xl font-bold gradient-headline mb-1">{stat.number}</div>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story - White */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-amber-600 font-semibold text-sm tracking-wider uppercase mb-4 block">Our Story</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Two Decades of Kitchen Excellence
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                BetterKing commercial kitchen solutions are designed for performance, durability, and precision—trusted by professionals across the globe. From 5-star hotels to high-volume restaurant chains, we deliver end-to-end kitchen solutions that elevate culinary operations.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Our team of engineers and designers work closely with chefs and hospitality professionals to create kitchens that are not just functional, but inspirational. Every project is a testament to our commitment to excellence.
              </p>
              <div className="flex flex-wrap gap-4">
                {["ISO 9001 Certified", "CE Certified", "SGS Verified", "FDA Approved"].map((cert, i) => (
                  <span key={i} className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    {cert}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative">
              <Image 
                src={aboutHero} 
                alt="BetterKing Commercial Kitchen" 
                className="rounded-2xl shadow-xl w-full h-auto"
                placeholder="blur"
              />
              <div className="absolute -bottom-6 -left-6 bg-amber-500 text-white p-6 rounded-xl shadow-lg hidden md:block">
                <div className="text-3xl font-bold">20+</div>
                <div className="text-sm">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Boss Quote Section - Dark */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, hsl(var(--primary)) 0%, transparent 70%)'
        }} />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-5 gap-10 items-center">
              <div className="md:col-span-2 flex justify-center">
                <div className="relative">
                  <div className="w-64 h-64 md:w-72 md:h-72 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-2xl relative">
                    <Image 
                      src={bossPhoto} 
                      alt="CEO - BetterKing" 
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary px-6 py-2 rounded-full">
                    <span className="text-primary-foreground text-sm font-bold whitespace-nowrap">CEO & Founder</span>
                  </div>
                </div>
              </div>
              <div className="md:col-span-3">
                <Quote className="w-12 h-12 text-primary mb-6 opacity-60" />
                <blockquote className="text-xl md:text-2xl font-medium text-foreground leading-relaxed mb-6">
                  "Powering world-class kitchens behind world-class hospitality. BetterKing commercial kitchen solutions are designed for performance, durability, and precision—trusted by professionals across the globe."
                </blockquote>
                <p className="text-primary font-semibold text-lg">📩 Let's connect and build smarter kitchens together.</p>
                <div className="mt-6">
                  <Link href="/contact" className="btn-gold inline-flex items-center gap-2">
                    Contact Us <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section - White */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-amber-600 font-semibold text-sm tracking-wider uppercase mb-4 block">Our Values</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What Drives Us Forward</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <div key={i} className="text-center p-8 rounded-xl border border-gray-100 hover:border-amber-300 hover:shadow-lg transition-all group">
                <div className="w-14 h-14 rounded-xl bg-amber-50 flex items-center justify-center mx-auto mb-5 group-hover:bg-amber-100 transition-colors">
                  <v.icon className="w-7 h-7 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{v.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section - Dark */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <span className="badge-gold mb-4 inline-block">Our Journey</span>
            <h2 className="section-title">Milestones That Define Us</h2>
          </div>
          <div className="max-w-4xl mx-auto relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border hidden md:block" />
            {milestones.map((m, i) => (
              <div key={i} className={`flex items-center mb-10 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col md:flex-row`}>
                <div className={`md:w-1/2 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <div className="bg-card border border-border rounded-xl p-6 hover:border-primary transition-colors">
                    <span className="text-primary font-bold text-lg">{m.year}</span>
                    <h3 className="text-foreground font-bold text-xl mt-1">{m.title}</h3>
                    <p className="text-muted-foreground text-sm mt-2">{m.desc}</p>
                  </div>
                </div>
                <div className="hidden md:flex w-4 h-4 rounded-full bg-primary border-4 border-background absolute left-1/2 -translate-x-1/2 shadow-lg" style={{ top: `${i * 20 + 5}%` }} />
                <div className="md:w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted Partners - White */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Trusted by World-Class Brands</h2>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
            {brands.map((brand, i) => (
              <div key={i} className="relative h-10 md:h-14 w-28 grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100">
                <Image 
                  src={brand.src} 
                  alt={brand.name} 
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Dark */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Build Your Dream Kitchen?</h2>
            <p className="text-muted-foreground text-lg mb-8">Let our experts design a commercial kitchen solution tailored to your needs.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-gold inline-flex items-center justify-center gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/solutions" className="btn-outline inline-flex items-center justify-center gap-2">
                Explore Solutions
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;