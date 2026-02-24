"use client";

import { Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Globe, Search, ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  { code: "EN", name: "English" },
  { code: "BN", name: "বাংলা" },
  { code: "ES", name: "Español" },
  { code: "FR", name: "Français" },
  { code: "AR", name: "العربية" },
];

interface HeaderProps {
  lightBackground?: boolean;
  hideTopBar?: boolean;
}

const Header = ({ lightBackground = false }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedLang, setSelectedLang] = useState("EN");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Category States for Dropdown
  const [categories, setCategories] = useState<any[]>([]);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  const searchInputRef = useRef<HTMLInputElement>(null);
  const showDarkMode = lightBackground || isScrolled || mobileMenuOpen;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();
        if (data.categories) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

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

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    if (showDarkMode) {
      return isActive ? "text-primary" : "text-gray-700 hover:text-primary";
    }
    return isActive ? "text-primary" : "text-white/90 hover:text-primary";
  };

  const getMobileLinkClass = (path: string) => {
    const isActive = pathname === path;
    return isActive 
      ? "block py-3 px-4 text-sm font-bold text-primary bg-gray-50 rounded-lg"
      : "block py-3 px-4 text-sm font-bold text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
    
      {!lightBackground && (
        <div 
          className={`transition-all duration-300 overflow-hidden hidden md:block ${
            isScrolled ? 'max-h-0 opacity-0' : 'max-h-12 opacity-100'
          }`}
        >
          <div className="bg-transparent">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="flex items-center justify-between h-10 text-sm">
                <div className="flex items-center gap-6">
                 
                  <a href="tel:+18005550123" className="flex items-center gap-2 text-white hover:text-primary transition-colors">
                    <Phone className="w-3.5 h-3.5" />
                    <span>+1 (800) 555-0123</span>
                  </a>
                  <a href="mailto:sales@betterking.com" className="flex items-center gap-2 text-white hover:text-primary transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                    <span>sales@betterking.com</span>
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <a href="#" className="text-white hover:text-primary transition-colors"><Facebook className="w-4 h-4" /></a>
                    <a href="#" className="text-white hover:text-primary transition-colors"><Twitter className="w-4 h-4" /></a>
                    <a href="#" className="text-white hover:text-primary transition-colors"><Instagram className="w-4 h-4" /></a>
                    <a href="#" className="text-white hover:text-primary transition-colors"><Linkedin className="w-4 h-4" /></a>
                  </div>

                  {isMounted ? (
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
                            onClick={() => setSelectedLang(lang.code)}
                            className="cursor-pointer text-gray-900 hover:bg-gray-100"
                          >
                            <span className="font-medium">{lang.code}</span>
                            <span className="ml-2 text-gray-600">{lang.name}</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <div className="flex items-center gap-1.5 pl-4 border-l border-white/30 text-white cursor-pointer">
                      <Globe className="w-4 h-4" />
                      <span>{selectedLang}</span>
                      <ChevronDown className="w-3 h-3" />
                    </div>
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
            
            <Link href="/" className={`flex items-center ${isSearchOpen ? 'hidden md:flex' : 'flex'}`}>
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
              <Link href="/" className={`text-sm font-bold transition-colors ${getLinkClass("/")}`}>
                HOME
              </Link>
              
              {/* Dropdown for Products */}
              <div className="relative group py-4">
                <Link href="/products" className={`flex items-center gap-1 text-sm font-bold transition-colors ${getLinkClass("/products")}`}>
                  PRODUCTS
                  <ChevronDown className="w-3.5 h-3.5" />
                </Link>
                
                <div className="absolute left-0 top-full pt-2 hidden group-hover:block w-64 z-50">
                  <div className="bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden py-2">
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <Link 
                          key={cat._id} 
                          href={`/categories/${cat.slug}`} 
                          className="block px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))
                    ) : (
                      <div className="px-5 py-3 text-sm text-gray-500">Loading categories...</div>
                    )}
                  </div>
                </div>
              </div>

              <Link href="/solutions" className={`text-sm font-bold transition-colors ${getLinkClass("/solutions")}`}>
                SOLUTIONS
              </Link>
              <Link href="/projects" className={`text-sm font-bold transition-colors ${getLinkClass("/projects")}`}>
                PROJECTS
              </Link>
              <Link href="/news" className={`text-sm font-bold transition-colors ${getLinkClass("/news")}`}>
                NEWS & BLOGS
              </Link>
              <Link href="/track-order" className={`text-sm font-bold transition-colors ${getLinkClass("/track-order")}`}>
                TRACK ORDER
              </Link>
              <Link href="/about" className={`text-sm font-bold transition-colors ${getLinkClass("/about")}`}>
                ABOUT
              </Link>
              <Link href="/contact" className={`text-sm font-bold transition-colors ${getLinkClass("/contact")}`}>
                CONTACT
              </Link>
            </div>

            <div className="flex items-center gap-3 justify-end flex-1 lg:flex-none">
              <div className={`flex items-center transition-all duration-300 ${
                isSearchOpen ? 'w-full md:w-64 bg-gray-100 rounded-full px-3 py-1' : 'w-8'
              }`}>
                {isSearchOpen ? (
                  <>
                    <input 
                      ref={searchInputRef}
                      type="text" 
                      placeholder="Search..." 
                      className="bg-transparent border-none outline-none text-sm text-gray-900 w-full placeholder:text-gray-500"
                    />
                    <button 
                      onClick={() => setIsSearchOpen(false)}
                      className="text-gray-500 hover:text-red-500 transition-colors p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
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

              <button className={`btn-gold hidden sm:inline-flex ${isSearchOpen ? 'hidden md:inline-flex' : ''}`}>
                Get Quote
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
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className={getMobileLinkClass("/")}>HOME</Link>
              
              {/* Mobile Products Dropdown */}
              <div className="border-b border-gray-50 pb-1 mb-1">
                <div className="flex items-center justify-between pr-2">
                  <Link href="/products" onClick={() => setMobileMenuOpen(false)} className={`flex-1 ${getMobileLinkClass("/products")}`}>
                    PRODUCTS
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
                        href={`/categories/${cat.slug}`} 
                        className="block py-2 px-4 text-sm font-medium text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/solutions" onClick={() => setMobileMenuOpen(false)} className={getMobileLinkClass("/solutions")}>SOLUTIONS</Link>
              <Link href="/projects" onClick={() => setMobileMenuOpen(false)} className={getMobileLinkClass("/projects")}>PROJECTS</Link>
              <Link href="/news" onClick={() => setMobileMenuOpen(false)} className={getMobileLinkClass("/news")}>NEWS & BLOGS</Link>
              <Link href="/track-order" onClick={() => setMobileMenuOpen(false)} className={getMobileLinkClass("/track-order")}>TRACK ORDER</Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className={getMobileLinkClass("/contact")}>CONTACT</Link>
              
              <div className="pt-3 px-4">
                <button className="btn-gold w-full">Get Quote</button>
              </div>
              <div className="pt-3 px-4 space-y-2 border-t border-gray-100 mt-3 pb-4">
                <a href="tel:+18005550123" className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-primary" />
                  +1 (800) 555-0123
                </a>
                <a href="mailto:sales@betterking.com" className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-primary" />
                  sales@betterking.com
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