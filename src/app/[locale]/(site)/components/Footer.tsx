import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import connectDB from "@/lib/db";
import CategoryModel from "@/models/Category";

const getLocalizedText = (val: any, locale: string) => {
  if (!val) return "";
  if (typeof val === 'string') return val;
  return val[locale] || val.en || "";
};

async function getCategories() {
  try {
    await connectDB();
    const categories = await CategoryModel.find({}).sort({ createdAt: -1 }).limit(5).lean();
    return categories.map((cat: any) => ({
      ...cat,
      _id: cat._id.toString(),
    }));
  } catch (error) {
    console.error("Error fetching categories for footer:", error);
    return [];
  }
}

const Footer = async () => {
  const t = await getTranslations("Footer");
  const locale = await getLocale();
  const categories = await getCategories();

  return (
    <footer className="bg-[#0a1628] text-white">
      <div className="container mx-auto px-4 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link href={`/${locale}`} className="flex items-center gap-2 mb-4 md:mb-6 w-fit">
              <div className="relative h-12 w-40"> 
                <Image 
                   src="/white-logo.webp" 
                   alt="BetterKing Logo" 
                   fill
                   className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-white/70 text-xs md:text-sm mb-4 md:mb-6 leading-relaxed">
              {t("desc")}
            </p>
            <div className="flex gap-2 md:gap-3">
              {[
                { Icon: Facebook, href: "https://www.facebook.com/profile.php?id=61583802103561" },
                { Icon: Twitter, href: "#" },
                { Icon: Instagram, href: "#" },
                { Icon: Linkedin, href: "#" },
                { Icon: Youtube, href: "#" }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  <social.Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-base md:text-lg text-primary mb-4 md:mb-6">{t("quickLinks")}</h4>
            <ul className="space-y-2 md:space-y-3 text-xs md:text-sm">
              {[
                { name: t("links.products"), href: `/${locale}/products` },
                { name: t("links.solutions"), href: `/${locale}/solutions` },
                { name: t("links.projects"), href: `/${locale}/projects` },
                { name: t("links.about"), href: `/${locale}/about` },
                { name: t("links.contact"), href: `/${locale}/contact` },
              ].map((item, index) => (
                <li key={index}>
                  <Link href={item.href} className="text-white/70 hover:text-primary font-medium transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-base md:text-lg text-primary mb-4 md:mb-6">{t("categories")}</h4>
            <ul className="space-y-2 md:space-y-3 text-xs md:text-sm">
              {categories.length > 0 ? (
                categories.map((cat: any) => (
                  <li key={cat._id}>
                    <Link href={`/${locale}/products?category=${cat.slug}`} className="text-white/70 hover:text-primary font-medium transition-colors">
                      {getLocalizedText(cat.name, locale)}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-white/50 italic">No categories found</li>
              )}
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h4 className="font-bold text-base md:text-lg text-primary mb-4 md:mb-6">{t("contactUs")}</h4>
            <ul className="space-y-3 md:space-y-4 text-xs md:text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-white/70 font-medium whitespace-pre-line">{t("address")}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0" />
                <a href="tel:17505816772" aria-label="contact number" className="text-white/70 hover:text-primary font-medium transition-colors">
                  +8615821730169
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0" />
                <a href="mailto:liufenghua@betterkingkitchen.com" aria-label="contact mail" className="text-white/70 hover:text-primary font-medium transition-colors break-all">
                  liufenghua@betterkingkitchen.com
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      <div className="border-t border-white/10 bg-[#060e1a]">
        <div className="container mx-auto px-4 lg:px-8 py-4 md:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 text-xs md:text-sm text-white/60">
            <p className="font-medium text-center md:text-left">© {new Date().getFullYear()} {t("copyright")}</p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Link href={`/${locale}/privacy`} className="hover:text-primary font-medium transition-colors">{t("privacy")}</Link>
              <Link href={`/${locale}/terms`} className="hover:text-primary font-medium transition-colors">{t("terms")}</Link>
              <Link href={`/${locale}/cookies`} className="hover:text-primary font-medium transition-colors">{t("cookie")}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;