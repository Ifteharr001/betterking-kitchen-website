"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { 
  Award, Users, Globe, Building2, CheckCircle, ArrowRight, 
  Quote, Play, Star, Target, Heart, Zap 
} from "lucide-react";

import aboutHero from "@/assets/about-hero.webp";
import bossPhoto from "@/assets/boss-photo.webp";
import TrustedBrands from "../components/TrustedBrands"



const AboutUs = () => {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const t = useTranslations("AboutPage"); 
  const locale = useLocale();

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setVideoPlaying(true);
    }
  };

  const stats = [
    { number: "1500+", label: t("stats.s1"), icon: Building2 },
    { number: "18+", label: t("stats.s2"), icon: Award },
    { number: "75+", label: t("stats.s3"), icon: Globe },
    { number: "5000+", label: t("stats.s4"), icon: Users },
  ];

  const values = [
    { icon: Target, title: t("v1Title"), desc: t("v1Desc") },
    { icon: Star, title: t("v2Title"), desc: t("v2Desc") },
    { icon: Heart, title: t("v3Title"), desc: t("v3Desc") },
    { icon: Zap, title: t("v4Title"), desc: t("v4Desc") },
  ];

  const milestones = [
    { year: t("m1Year"), title: t("m1Title"), desc: t("m1Desc") },
    { year: t("m2Year"), title: t("m2Title"), desc: t("m2Desc") },
    { year: t("m3Year"), title: t("m3Title"), desc: t("m3Desc") },
    { year: t("m4Year"), title: t("m4Title"), desc: t("m4Desc") },
    { year: t("m5Year"), title: t("m5Title"), desc: t("m5Desc") },
  ];

  return (
    <div className="min-h-screen bg-background">

      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary to-background" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl mt-8 mx-auto text-center">
            <span className="badge-gold mb-6 inline-block">{t("heroBadge")}</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-foreground">{t("heroTitle1")}</span>
              <span className="gradient-headline">{t("heroTitle2")}</span>
              <span className="text-foreground">{t("heroTitle3")}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("heroDesc")}
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
          <source src="https://res.cloudinary.com/dnrpstwps/video/upload/q_auto:best,f_webm/v1774561173/about-video_y7tb0b.mp4" type="video/mp4" />
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
                {t("videoDesc")}
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
              <span className="text-amber-600 font-semibold text-sm tracking-wider uppercase mb-4 block">{t("storyBadge")}</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t("storyTitle")}
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {t("storyP1")}
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {t("storyP2")}
              </p>
              <div className="flex flex-wrap gap-4">
                {[t("cert1"), t("cert2"), t("cert3"), t("cert4")].map((cert, i) => (
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
                <div className="text-3xl font-bold">18+</div>
                <div className="text-sm">{t("yearsExcellence")}</div>
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
                    <span className="text-primary-foreground text-sm font-bold whitespace-nowrap">{t("bossRole")}</span>
                  </div>
                </div>
              </div>
              <div className="md:col-span-3">
                <Quote className="w-12 h-12 text-primary mb-6 opacity-60" />
                <blockquote className="text-xl md:text-2xl font-medium text-foreground leading-relaxed mb-6">
                  {t("bossQuote")}
                </blockquote>
                <p className="text-primary font-semibold text-lg">{t("bossConnect")}</p>
                <div className="mt-6">
                  <Link href={`/${locale}/contact`} className="btn-gold inline-flex items-center gap-2">
                    {t("contactBtn")} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-amber-600 font-semibold text-sm tracking-wider uppercase mb-4 block">{t("valuesBadge")}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{t("valuesTitle")}</h2>
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

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <span className="badge-gold mb-4 inline-block">{t("journeyBadge")}</span>
            <h2 className="section-title">{t("journeyTitle")}</h2>
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

      <TrustedBrands />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t("ctaTitle")}</h2>
            <p className="text-muted-foreground text-lg mb-8">{t("ctaDesc")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/contact`} className="btn-gold inline-flex items-center justify-center gap-2">
                {t("getStartedBtn")} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href={`/${locale}/solutions`} className="btn-outline inline-flex items-center justify-center gap-2">
                {t("exploreBtn")}
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;