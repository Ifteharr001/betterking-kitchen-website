"use client";

import { 
  ChevronRight, Building2, UtensilsCrossed, GraduationCap, Hospital, Cake, 
  Coffee, Briefcase, Ruler, Wrench, Truck, Headphones, DollarSign, Shield, ArrowRight 
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

// 💡 Magic function for localization
const getLocalizedText = (val: any, locale: string) => {
  if (!val) return "";
  if (typeof val === 'string') return val;
  return val[locale] || val.en || "";
};

// Before/After Slider Component
const BeforeAfterSlider = ({ t }: { t: any }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) handleMove(e.clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging.current) handleMove(e.touches[0].clientX);
    };
    const handleUp = () => { isDragging.current = false; };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchend", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchend", handleUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-4xl mx-auto aspect-[16/9] rounded-2xl overflow-hidden cursor-col-resize select-none shadow-2xl"
      onMouseDown={() => { isDragging.current = true; }}
      onTouchStart={() => { isDragging.current = true; }}
    >
      {/* After  */}
      <img
        src="https://i.ibb.co.com/v4QPffdS/220120-055.jpg"
        alt="After - Modern Kitchen"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Before ) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPosition}%` }}>
        <img
          src="https://i.ibb.co.com/R4P48BVZ/Whats-App-Image-2026-03-12-at-8-16-10-AM.jpg"
          alt="Before - Old Kitchen"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100vw', maxWidth: 'none' }}
        />
      </div>
      {/* Slider line */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10" style={{ left: `${sliderPosition}%` }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center">
          <div className="flex items-center gap-0.5">
            <ChevronRight className="w-4 h-4 text-gray-800 rotate-180" />
            <ChevronRight className="w-4 h-4 text-gray-800" />
          </div>
        </div>
      </div>
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full z-20">{t("before")}</div>
      <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full z-20">{t("after")}</div>
    </div>
  );
};

const Solutions = () => {
  const t = useTranslations("SolutionsPage");
  const locale = useLocale();
  const [industries, setIndustries] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const iconMap: any = {
    0: Building2,
    1: UtensilsCrossed,
    2: GraduationCap,
    3: Hospital,
    4: Cake,
    5: Coffee
  };

useEffect(() => {
    const fetchData = async () => {
      try {
        const [indRes, catRes] = await Promise.all([
          fetch("/api/admin/industries"),
          fetch("/api/admin/categories")
        ]);
        
        if (indRes.ok) {
          const indData = await indRes.json();
          const industriesArray = Array.isArray(indData) ? indData : (indData.industries || indData.data || []);
          setIndustries(industriesArray.slice(0, 6)); 
        }
        
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData.categories ? catData.categories.slice(0, 8) : []); 
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchData();
  }, []);

  const openContactModal = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new Event("openContactModal"));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">

      <main>
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/60 to-background" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)", backgroundSize: "40px 40px" }} />
          <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
            <span className="badge-gold mb-4 inline-block">{t("heroBadge")}</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-5">
              {t("heroTitle1")} <span className="gradient-headline">{t("heroTitle2")}</span>
            </h1>
            <p className="section-subtitle mx-auto max-w-xl">
              {t("heroDesc")}
            </p>
          </div>
        </section>

        <section className="bg-white">
          <div className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
            <div className="text-center mb-12">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">{t("indBadge")}</span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-2 mb-3 text-gray-900">{t("indTitle")}</h2>
              <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">{t("indDesc")}</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {industries.length > 0 ? industries.map((ind, i) => {
                const IconComponent = iconMap[i % 6] || Building2;
                return (
                  <Link href={`/${locale}/industries/${ind._id}`} key={ind._id}>
                    <div className="group rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer bg-white">
                      <div className="relative h-48 overflow-hidden">
                        <img src={ind.image} alt={getLocalizedText(ind.name, locale)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-primary-foreground" />
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-gray-900 mb-2">{getLocalizedText(ind.name, locale)}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{getLocalizedText(ind.description, locale)}</p>
                      </div>
                    </div>
                  </Link>
                );
              }) : (
                 <div className="col-span-full text-center py-10 text-gray-500">Loading industries...</div>
              )}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
          <div className="text-center mb-10">
            <span className="badge-gold mb-4 inline-block">{t("transBadge")}</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">{t("transTitle1")} <span className="gradient-headline">{t("transTitle2")}</span></h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">{t("transDesc")}</p>
          </div>
          <BeforeAfterSlider t={t} />
        </section>

        <section className="bg-white">
          <div className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
            <div className="text-center mb-12">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">{t("servBadge")}</span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-2 mb-3 text-gray-900">{t("servTitle")}</h2>
              <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">{t("servDesc")}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
              {[
                { title: t("serv1Title"), description: t("serv1Desc"), icon: DollarSign },
                { title: t("serv2Title"), description: t("serv2Desc"), icon: Ruler },
                { title: t("serv3Title"), description: t("serv3Desc"), icon: Wrench },
                { title: t("serv4Title"), description: t("serv4Desc"), icon: Truck },
                { title: t("serv5Title"), description: t("serv5Desc"), icon: Briefcase },
                { title: t("serv6Title"), description: t("serv6Desc"), icon: Headphones },
              ].map((s, i) => (
                <div key={i} className="group text-center p-5 rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all duration-300 bg-gray-50/50">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <s.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 mb-1.5">{s.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">{t("whyBadge")}</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-2 mb-3">{t("whyTitle1")} <span className="gradient-headline">{t("whyTitle2")}</span></h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">{t("whyDesc")}</p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="flex justify-center mb-8 md:mb-0">
              <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-primary/30 shadow-2xl mx-auto md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-10">
                <img src="https://i.ibb.co.com/4RhTbppj/Whats-App-Image-2026-03-12-at-8-25-59-AM.jpg" alt="Betterking Kitchen" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border border-dashed border-primary/20" />
            </div>

            <div className="grid md:grid-cols-2 gap-x-80 gap-y-8">
              {[
                { title: t("partner1Title"), description: t("partner1Desc") },
                { title: t("partner2Title"), description: t("partner2Desc") },
                { title: t("partner3Title"), description: t("partner3Desc") },
                { title: t("partner4Title"), description: t("partner4Desc") },
                { title: t("partner5Title"), description: t("partner5Desc") },
                { title: t("partner6Title"), description: t("partner6Desc") },
              ].map((p, i) => (
                <div key={i} className={`flex items-start gap-3 ${i % 2 === 1 ? 'md:text-left' : 'md:text-right md:flex-row-reverse'}`}>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-foreground">{i + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-1">{p.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{p.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
            <div className="text-center mb-12">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">{t("prodBadge")}</span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-2 mb-3 text-gray-900">{t("prodTitle")}</h2>
              <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">{t("prodDesc")}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {categories.length > 0 ? categories.map((cat) => (
                <Link href={`/${locale}/categories/${cat.slug}`} key={cat._id}>
                  <div className="group rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer bg-white">
                    <div className="relative h-40 md:h-48 overflow-hidden bg-gray-50">
                      <img 
                        src={cat.image || "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80"} 
                        alt={getLocalizedText(cat.name, locale)} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="font-bold text-sm text-gray-900">{getLocalizedText(cat.name, locale)}</h3>
                      <button className="mt-2 text-xs font-semibold text-primary hover:underline flex items-center gap-1 mx-auto">
                        {t("details")} <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </Link>
              )) : (
                 <div className="col-span-full text-center py-10 text-gray-500">Loading categories...</div>
              )}
            </div>
          </div>
        </section>

        {/* Certifications - Dark */}
        <section className="border-y border-border">
          <div className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
            <div className="text-center mb-12">
              <span className="badge-gold mb-4 inline-block">{t("certBadge")}</span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">{t("certTitle1")} <span className="gradient-headline">{t("certTitle2")}</span></h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">{t("certDesc")}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { name: t("c1Name"), desc: t("c1Desc") },
                { name: t("c2Name"), desc: t("c2Desc") },
                { name: t("c3Name"), desc: t("c3Desc") },
                { name: t("c4Name"), desc: t("c4Desc") },
                { name: t("c5Name"), desc: t("c5Desc") },
                { name: t("c6Name"), desc: t("c6Desc") },
                { name: t("c7Name"), desc: t("c7Desc") },
                { name: t("c8Name"), desc: t("c8Desc") },
              ].map((c, i) => (
                <div key={i} className="feature-card p-6 text-center group hover:border-primary/50 transition-all">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <Shield className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-sm mb-1">{c.name}</h3>
                  <p className="text-xs text-muted-foreground">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Steps - White */}
        <section className="bg-white">
          <div className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
            <div className="text-center mb-12">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">{t("procBadge")}</span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-2 mb-3 text-gray-900">{t("procTitle")}</h2>
              <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">{t("procDesc")}</p>
            </div>
            <div className="grid md:grid-cols-4 gap-6 relative">
              <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gray-200" />
              {[
                { step: "01", title: t("p1Title"), desc: t("p1Desc") },
                { step: "02", title: t("p2Title"), desc: t("p2Desc") },
                { step: "03", title: t("p3Title"), desc: t("p3Desc") },
                { step: "04", title: t("p4Title"), desc: t("p4Desc") },
              ].map((s, i) => (
                <div key={i} className="text-center relative">
                  <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-lg font-bold relative z-10 shadow-lg">
                    {s.step}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA - Dark */}
        <section className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
          <div className="relative rounded-2xl overflow-hidden p-8 md:p-14 text-center bg-gradient-to-br from-card to-secondary">
            <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">{t("ctaTitle1")} <span className="gradient-headline">{t("ctaTitle2")}</span></h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto mb-6">
                {t("ctaDesc")}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
               
                <button onClick={openContactModal} className="btn-gold gap-2 justify-center">
                  {t("getQuote")} <ChevronRight className="w-4 h-4" />
                </button>
                <button onClick={openContactModal} className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border text-foreground rounded-lg hover:border-primary hover:text-primary transition-colors text-sm font-semibold">
                  <Building2 className="w-4 h-4" /> {t("talkExpert")}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
    </div>
  );
};

export default Solutions;