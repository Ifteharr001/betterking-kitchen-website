"use client";

import { Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Globe, Search, ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation"; 
import { useTranslations, useLocale } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  { code: "EN", value: "en", name: "English" },
  { code: "BN", value: "bn", name: "বাংলা" },
  { code: "ZH", value: "zh", name: "中文" },
  { code: "ES", value: "es", name: "Español" },
  { code: "FR", value: "fr", name: "Français" },
  { code: "AR", value: "ar", name: "العربية" },
];

const getLocalizedText = (val: any, locale: string) => {
  if (!val) return "";
  if (typeof val === 'string') return val;
  return val[locale] || val.en || Object.values(val)[0] || ""; 
};

interface HeaderProps {
  lightBackground?: boolean;
  hideTopBar?: boolean;
  categories?: any[]; 
}

const Header = ({ lightBackground = false, hideTopBar = false, categories = [] }: HeaderProps) => {
  const t = useTranslations("Navigation"); 
  const currentLocale = useLocale();

  const [isScrolled, setIsScrolled] = useState(false);
  
  const [selectedLang, setSelectedLang] = useState(
    languages.find(l => l.value === currentLocale)?.code || "EN"
  );
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter(); 

  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const cleanPath = pathname.replace(/^\/(en|bn|ar|es|zh|fr|zh-CN)(?=\/|$)/, "");
  const isLightPage = 
    cleanPath.startsWith("/product/") || 
    cleanPath === "/products" || 
    cleanPath.startsWith("/news") || 
    cleanPath.startsWith("/categories") ||
    cleanPath.startsWith("/industries");

  const showDarkMode = lightBackground || isLightPage || isScrolled || mobileMenuOpen;
  const shouldHideTopBar = hideTopBar || isLightPage;

  const handleLanguageChange = (langValue: string, langCode: string) => {
    setSelectedLang(langCode);
    
    document.cookie = `NEXT_LOCALE=${langValue}; path=/; max-age=31536000`;
    
    const currentPathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/';
    const newPath = `/${langValue}${currentPathWithoutLocale}`;
    
    window.location.href = newPath;
  };

  useEffect(() => {
    setIsMounted(true); 
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleScrollClose = () => {
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("scroll", handleScrollClose);
    return () => window.removeEventListener("scroll", handleScrollClose);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${currentLocale}/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const getLocalizedLink = (path: string) => {
    return `/${currentLocale}${path}`;
  };

  const getLinkClass = (path: string) => {
    const isActive = cleanPath === path;
    if (showDarkMode) {
      return isActive ? "text-primary" : "text-gray-700 hover:text-primary";
    }
    return isActive ? "text-primary" : "text-white/90 hover:text-primary";
  };

  const getMobileLinkClass = (path: string) => {
    const isActive = cleanPath === path;
    return isActive 
      ? "block py-3 px-4 text-sm font-bold text-primary bg-gray-50 rounded-lg"
      : "block py-3 px-4 text-sm font-bold text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg";
  };

  const chunkArray = (array: any[], size: number) => {
    const chunkedArr = [];
    for (let i = 0; i < array.length; i += size) {
      chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
  };

  const categoryChunks = chunkArray(categories, 10);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
    
      {!shouldHideTopBar && (
        <div 
          className={`transition-all duration-300 overflow-hidden hidden md:block ${
            isScrolled ? 'max-h-0 opacity-0' : 'max-h-12 opacity-100'
          }`}
        >
          <div className="bg-transparent">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="flex items-center justify-between h-10 text-sm">
                <div className="flex items-center gap-6">
                
                  <a href="tel:17505816772" className="flex items-center gap-2 text-white hover:text-primary transition-colors">
                    <Phone className="w-3.5 h-3.5" />
                    <span>17505816772</span>
                  </a>
                  <a href="mailto:liufenghua@betterkingkitchen.com" className="flex items-center gap-2 text-white hover:text-primary transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                    <span>liufenghua@betterkingkitchen.com</span>
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <a href="#" className="text-white hover:text-primary transition-colors"><Facebook className="w-4 h-4" /></a>
                    <a href="#" className="text-white hover:text-primary transition-colors"><Twitter className="w-4 h-4" /></a>
                    <a href="#" className="text-white hover:text-primary transition-colors"><Instagram className="w-4 h-4" /></a>
                    <a href="#" className="text-white hover:text-primary transition-colors"><Linkedin className="w-4 h-4" /></a>
                  </div>

                  {isMounted && (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center gap-1.5 pl-4 border-l border-white/30 text-white hover:text-primary transition-colors cursor-pointer outline-none">
                        <Globe className="w-4 h-4" />
                        <span>{selectedLang}</span>
                        <ChevronDown className="w-3 h-3" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white border-gray-200">
                        {languages.map((lang) => (
                          <DropdownMenuItem 
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.value, lang.code)}
                            className="cursor-pointer text-gray-900 hover:bg-gray-100"
                          >
                            <span className="font-medium">{lang.code}</span>
                            <span className="ml-2 text-gray-600">{lang.name}</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  
                </div>
              </div>
              <div className="h-px bg-white/20" />
            </div>
          </div>
        </div>
      )}

      <nav className={`transition-all duration-300 ${
        showDarkMode ? 'bg-white shadow-md' : 'bg-transparent'
      }`}>
          
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20"> 
            
            <Link href={getLocalizedLink("/")} prefetch={false} className={`flex items-center ${isSearchOpen ? 'hidden md:flex' : 'flex'}`}>
              <div className="relative h-12 w-40">
                <Image 
                  src={showDarkMode ? "/black-logo.png" : "/white-logo.png"}
                  alt="BetterKing Logo"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </Link>

            <div className={`hidden lg:flex items-center gap-8 ${isSearchOpen ? 'opacity-0 pointer-events-none w-0' : 'opacity-100 w-auto'} transition-all duration-300`}>
              <Link href={getLocalizedLink("/")} prefetch={false} className={`text-sm font-bold transition-colors uppercase ${getLinkClass("/")}`}>
                {t("home")}
              </Link>
              
              <div className="relative group py-4">
                <Link href={getLocalizedLink("/products")} prefetch={false} className={`flex items-center gap-1 text-sm font-bold transition-colors uppercase ${getLinkClass("/products")}`}>
                  {t("products")}
                  <ChevronDown className="w-3.5 h-3.5" />
                </Link>
                
                <div className="absolute left-0 top-full pt-2 hidden group-hover:block z-50">
                  <div className="bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden py-2 flex">
                    
                    {categoryChunks.length > 0 ? (
                      categoryChunks.map((chunk, chunkIndex) => (
                        <div 
                          key={chunkIndex} 
                          className={`w-64 ${chunkIndex !== categoryChunks.length - 1 ? 'border-r border-gray-200' : ''}`}
                        >
                          {chunk.map((cat: any) => (
                            <Link 
                            prefetch={false}
                              key={cat._id} 
                              href={getLocalizedLink(`/categories/${cat.slug}`)} 
                              className="block px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors"
                            >
                              {getLocalizedText(cat.name, currentLocale)}
                            </Link>
                          ))}
                        </div>
                      ))
                    ) : (
                      <div className="w-64 px-5 py-3 text-sm text-gray-500">No categories found</div>
                    )}

                  </div>
                </div>
              </div>

              <Link href={getLocalizedLink("/solutions")} prefetch={false} className={`text-sm font-bold transition-colors uppercase ${getLinkClass("/solutions")}`}>
                {t("solutions")}
              </Link>
              <Link href={getLocalizedLink("/industries")} prefetch={false} className={`text-sm font-bold transition-colors uppercase ${getLinkClass("/industries")}`}>
                {t("industries")}
              </Link>
              <Link href={getLocalizedLink("/projects")} prefetch={false} className={`text-sm font-bold transition-colors uppercase ${getLinkClass("/projects")}`}>
                {t("projects")}
              </Link>
              <Link href={getLocalizedLink("/news")} prefetch={false} className={`text-sm font-bold transition-colors uppercase ${getLinkClass("/news")}`}>
                {t("news")}
              </Link>
              <Link href={getLocalizedLink("/track-order")} prefetch={false} className={`text-sm font-bold transition-colors uppercase ${getLinkClass("/track-order")}`}>
                {t("trackOrder")}
              </Link>
              <Link href={getLocalizedLink("/about")} prefetch={false} className={`text-sm font-bold transition-colors uppercase ${getLinkClass("/about")}`}>
                {t("about")}
              </Link>
              <Link href={getLocalizedLink("/contact")} prefetch={false} className={`text-sm font-bold transition-colors uppercase ${getLinkClass("/contact")}`}>
                {t("contact")}
              </Link>
            </div>

            <div className="flex items-center gap-3 justify-end flex-1 lg:flex-none">
              <div className={`flex items-center transition-all duration-300 ${
                isSearchOpen ? 'w-full md:w-64 bg-gray-100 rounded-full px-3 py-1' : 'w-8'
              }`}>
                {isSearchOpen ? (
                  <form onSubmit={handleSearchSubmit} className="flex items-center w-full">
                    <input 
                      ref={searchInputRef}
                      type="text" 
                      placeholder="Search products..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent border-none outline-none text-sm text-gray-900 w-full placeholder:text-gray-500"
                    />
                    <button 
                      type="button"
                      onClick={() => setIsSearchOpen(false)}
                      className="text-gray-500 hover:text-red-500 transition-colors p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <button 
                    onClick={() => setIsSearchOpen(true)}
                    className={`p-1 transition-colors ${
                      showDarkMode ? 'text-gray-600 hover:text-gray-900' : 'text-white hover:text-primary'
                    }`}
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}
              </div>

              <button 
                onClick={() => window.dispatchEvent(new Event("openContactModal"))} 
                className={`btn-gold hidden sm:inline-flex ${isSearchOpen ? 'hidden md:inline-flex' : ''}`}
              >
                {t("getQuote")}
              </button>

              <button 
                className={`lg:hidden p-2 transition-colors ${
                  showDarkMode ? 'text-gray-900' : 'text-white'
                }`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full left-0 top-20 z-40">
            <div className="container mx-auto px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
              
              <div className="pb-3 mb-2 border-b border-gray-100">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2 px-2">Select Language</p>
                <div className="flex flex-wrap gap-2 px-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.value, lang.code)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
                        selectedLang === lang.code 
                          ? 'bg-primary text-white border-primary' 
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {lang.code}
                    </button>
                  ))}
                </div>
              </div>

              <Link href={getLocalizedLink("/")} prefetch={false} onClick={() => setMobileMenuOpen(false)} className={`${getMobileLinkClass("/")} uppercase`}>{t("home")}</Link>
              
              <div className="border-b border-gray-50 pb-1 mb-1">
                <div className="flex items-center justify-between pr-2">
                  <Link href={getLocalizedLink("/products")} prefetch={false} onClick={() => setMobileMenuOpen(false)} className={`flex-1 uppercase ${getMobileLinkClass("/products")}`}>
                    {t("products")}
                  </Link>
                  <button 
                    onClick={() => setMobileProductsOpen(!mobileProductsOpen)} 
                    className="p-2 text-gray-500 hover:text-primary bg-gray-50 rounded-lg ml-2"
                  >
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${mobileProductsOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                
                {mobileProductsOpen && (
                  <div className="pl-4 pr-2 py-2 space-y-1 border-l-2 border-gray-100 ml-4 mb-2 mt-1">
                    {categories.map((cat) => (
                      <Link 
                        key={cat._id} 
                        prefetch={false}
                        href={getLocalizedLink(`/categories/${cat.slug}`)} 
                        className="block py-2 px-4 text-sm font-medium text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {getLocalizedText(cat.name, currentLocale)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href={getLocalizedLink("/solutions")} prefetch={false} onClick={() => setMobileMenuOpen(false)} className={`${getMobileLinkClass("/solutions")} uppercase`}>{t("solutions")}</Link>
              <Link href={getLocalizedLink("/industries")} prefetch={false} onClick={() => setMobileMenuOpen(false)} className={`${getMobileLinkClass("/industries")} uppercase`}>{t("industries")}</Link>
              <Link href={getLocalizedLink("/projects")} prefetch={false} onClick={() => setMobileMenuOpen(false)} className={`${getMobileLinkClass("/projects")} uppercase`}>{t("projects")}</Link>
              <Link href={getLocalizedLink("/news")} prefetch={false} onClick={() => setMobileMenuOpen(false)} className={`${getMobileLinkClass("/news")} uppercase`}>{t("news")}</Link>
              <Link href={getLocalizedLink("/track-order")} prefetch={false} onClick={() => setMobileMenuOpen(false)} className={`${getMobileLinkClass("/track-order")} uppercase`}>{t("trackOrder")}</Link>
              <Link href={getLocalizedLink("/about")} prefetch={false} onClick={() => setMobileMenuOpen(false)} className={`${getMobileLinkClass("/about")} uppercase`}>{t("about")}</Link>
              <Link href={getLocalizedLink("/contact")} prefetch={false} onClick={() => setMobileMenuOpen(false)} className={`${getMobileLinkClass("/contact")} uppercase`}>{t("contact")}</Link>
              
              <div className="pt-3 px-4">
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.dispatchEvent(new Event("openContactModal"));
                  }} 
                  className="btn-gold w-full block text-center uppercase"
                >
                  {t("getQuote")}
                </button>
              </div>
              
              <div className="pt-3 px-4 space-y-2 border-t border-gray-100 mt-3 pb-4">
                <a href="tel:17505816772" className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-primary" />
                  17505816772
                </a>
                <a href="mailto:liufenghua@betterkingkitchen.com" className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-primary" />
                  liufenghua@betterkingkitchen.com
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;