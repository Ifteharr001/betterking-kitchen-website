"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl"; 
import { 
  Phone, Mail, MapPin, Clock, Send, MessageSquare, 
  Headphones, Building2, ChevronRight, Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Accordion, AccordionContent, AccordionItem, AccordionTrigger 
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const Contact = () => {
  const { toast } = useToast();
  const t = useTranslations("ContactPage"); 
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "", company: "", subject: "", message: "" });

  const contactCards = [
    { icon: Phone, title: t("contactCards.c1Title"), value: "+8615821730169", sub: t("contactCards.c1Sub"), href: "tel:+8615821730169" },
    { icon: Mail, title: t("contactCards.c2Title"), value: "liufenghua@betterkingkitchen.com", sub: t("contactCards.c2Sub"), href: "mailto:liufenghua@betterkingkitchen.com" },
    { icon: MapPin, title: t("contactCards.c3Title"), value: "6111, Zhongchun Road", sub: t("contactCards.c3Sub"), href: "#" },
    { icon: Clock, title: t("contactCards.c4Title"), value: "Mon – Fri: 9AM–6PM", sub: t("contactCards.c4Sub"), href: "#" },
  ];

  const faqs = [
    { q: t("faqs.q1"), a: t("faqs.a1") },
    { q: t("faqs.q2"), a: t("faqs.a2") },
    { q: t("faqs.q3"), a: t("faqs.a3") },
    { q: t("faqs.q4"), a: t("faqs.a4") },
    { q: t("faqs.q5"), a: t("faqs.a5") },
    { q: t("faqs.q6"), a: t("faqs.a6") },
  ];

  const stats = [
    { value: "150K+", label: t("stats.s1") },
    { value: "75+", label: t("stats.s2") },
    { value: "98%", label: t("stats.s3") },
    { value: "24/7", label: t("stats.s4") },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.message) {
      toast({ title: t("toastFillFields"), variant: "destructive" });
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          source: "contact-page"
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      toast({ title: t("toastSuccess"), description: t("toastSuccessDesc") });
      setFormData({ fullName: "", email: "", phone: "", company: "", subject: "", message: "" });
      
    } catch (error: any) {
      console.error("Submission Error:", error);
      toast({ 
        title: t("toastError"), 
        description: error.message || "Please try again later.",
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
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

        <section className="container mx-auto px-4 lg:px-8 -mt-8 pb-10 relative z-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {contactCards.map((c, i) => (
              <a key={i} href={c.href} className="feature-card group flex flex-col items-center text-center p-5 md:p-7 hover:border-primary transition-all">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <c.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-sm md:text-base mb-1">{c.title}</h3>
                <p className="text-xs md:text-sm font-medium text-foreground/90">{c.value}</p>
                <p className="text-[11px] md:text-xs text-muted-foreground mt-0.5">{c.sub}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="bg-white">
          <div className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
            <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
              
              <div className="lg:col-span-3">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">{t("formBadge")}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">{t("formTitle")}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input disabled={loading} placeholder={t("fName")} required value={formData.fullName} onChange={e => setFormData(p => ({ ...p, fullName: e.target.value }))} className="bg-gray-50 border-gray-200 h-12 text-gray-900 placeholder:text-gray-400" />
                    <Input disabled={loading} type="email" placeholder={t("fEmail")} required value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className="bg-gray-50 border-gray-200 h-12 text-gray-900 placeholder:text-gray-400" />
                    <Input disabled={loading} placeholder={t("fPhone")} value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} className="bg-gray-50 border-gray-200 h-12 text-gray-900 placeholder:text-gray-400" />
                    <Input disabled={loading} placeholder={t("fCompany")} value={formData.company} onChange={e => setFormData(p => ({ ...p, company: e.target.value }))} className="bg-gray-50 border-gray-200 h-12 text-gray-900 placeholder:text-gray-400" />
                  </div>
                  <Select disabled={loading} value={formData.subject} onValueChange={v => setFormData(p => ({ ...p, subject: v }))}>
                    <SelectTrigger className="bg-gray-50 border-gray-200 h-12 text-gray-900">
                      <SelectValue placeholder={t("fSubject")} />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="general">{t("subGeneral")}</SelectItem>
                      <SelectItem value="quote">{t("subQuote")}</SelectItem>
                      <SelectItem value="support">{t("subSupport")}</SelectItem>
                      <SelectItem value="partnership">{t("subPartner")}</SelectItem>
                      <SelectItem value="other">{t("subOther")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea disabled={loading} placeholder={t("fMessage")} required rows={5} value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))} className="bg-gray-50 border-gray-200 resize-none text-gray-900 placeholder:text-gray-400" />
                  <Button disabled={loading} type="submit" className="btn-gold gap-2 w-full md:w-auto">
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> {t("btnSending")}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> {t("btnSend")}
                      </>
                    )}
                  </Button>
                </form>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-xl overflow-hidden border border-gray-200 h-64 lg:h-72 bg-gray-50 flex items-center justify-center">
                  <iframe 
                    title="Betterking Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3413.4357774135544!2d121.34149951508964!3d31.182283981482813!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35b2649a37e9d7db%3A0x6b8bc62f6b8b0e8b!2sZhongchun%20Rd%2C%20Minhang%20Qu%2C%20Shanghai%20Shi%2C%20China!5e0!3m2!1sen!2sbd!4v1628151234567!5m2!1sen!2sbd" 
                    className="w-full h-full border-0 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                    loading="lazy"
                    allowFullScreen
                  ></iframe>
                </div>

                <div className="p-6 rounded-xl border border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-2 mb-4">
                    <Headphones className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-gray-900">{t("helpTitle")}</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    {t("helpDesc")}
                  </p>
                  <a href="tel:+8615821730169" className="btn-gold text-sm w-full justify-center gap-2">
                    <Phone className="w-4 h-4" /> {t("callNow")}
                  </a>
                </div>

                <div className="p-6 rounded-xl border border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-gray-900">{t("corpTitle")}</h3>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">
                    {t("corpAddress")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats - Dark */}
        <section className="border-y border-border bg-card/50">
          <div className="container mx-auto px-4 lg:px-8 py-12 md:py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((s, i) => (
                <div key={i}>
                  <p className="text-3xl md:text-4xl font-bold gradient-headline">{s.value}</p>
                  <p className="text-sm text-muted-foreground mt-1 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <span className="badge-gold mb-4 inline-block">{t("faqBadge")}</span>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-gray-900">{t("faqTitle")}</h2>
                <p className="text-gray-500 text-sm md:text-base">{t("faqDesc")}</p>
              </div>
              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((f, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="border border-gray-200 rounded-xl px-5 bg-gray-50 data-[state=open]:border-primary/40 transition-colors">
                    <AccordionTrigger className="text-sm md:text-base font-semibold hover:no-underline py-5 text-gray-900">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-gray-500 leading-relaxed pb-5">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA - Dark */}
        <section className="container mx-auto px-4 lg:px-8 py-16 md:py-24 ">
          <div className="relative rounded-2xl overflow-hidden p-8 md:p-14 text-center" style={{ background: "linear-gradient(135deg, hsl(var(--secondary)) 0%, hsl(var(--card)) 100%)" }}>
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">{t("ctaTitle")}</h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto mb-6">
                {t("ctaDesc")}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href={`/${locale}/products`} className="btn-gold gap-2">
                  {t("btnBrowse")} <ChevronRight className="w-4 h-4" />
                </Link>
                <a href="tel:+8615821730169" className="btn-outline gap-2">
                  <Phone className="w-4 h-4" /> {t("btnCallUs")}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
   
    </div>
  );
};

export default Contact;