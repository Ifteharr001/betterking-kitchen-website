"use client";

import { Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Globe, Search, ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
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
  
  const [isMounted, setIsMounted] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const showDarkMode = lightBackground || isScrolled || mobileMenuOpen;

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
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top bar */}
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
                  {/* Phone & Mail Links... */}
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
                  {/* Social Icons... */}
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
                  {/* ---------------------------------------- */}
                  
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
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link href="/" className={`flex items-center gap-2 ${isSearchOpen ? 'hidden md:flex' : 'flex'}`}>
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <span className="font-bold text-primary-foreground text-lg">B</span>
              </div>
              <span className={`font-bold text-xl tracking-tight transition-colors ${
                showDarkMode ? 'text-gray-900' : 'text-white'
              }`}>BETTERKING</span>
            </Link>

            <div className={`hidden lg:flex items-center gap-8 ${isSearchOpen ? 'opacity-0 pointer-events-none w-0' : 'opacity-100 w-auto'} transition-all duration-300`}>
              <Link href="/products" className={`text-sm font-bold transition-colors ${
                showDarkMode ? 'text-gray-900 hover:text-primary' : 'text-white hover:text-primary'
              }`}>PRODUCTS</Link>
              <Link href="solutions" className={`text-sm font-bold transition-colors ${
                showDarkMode ? 'text-gray-700 hover:text-primary' : 'text-white/90 hover:text-primary'
              }`}>SOLUTIONS</Link>
              <Link href="/projects" className={`text-sm font-bold transition-colors ${
                showDarkMode ? 'text-gray-700 hover:text-primary' : 'text-white/90 hover:text-primary'
              }`}>PROJECTS</Link>
              <Link href="/track-order" className={`text-sm font-bold transition-colors ${
                showDarkMode ? 'text-gray-700 hover:text-primary' : 'text-white/90 hover:text-primary'
              }`}>TRACK ORDER</Link>
              <Link href="#" className={`text-sm font-bold transition-colors ${
                showDarkMode ? 'text-gray-700 hover:text-primary' : 'text-white/90 hover:text-primary'
              }`}>CONTACT</Link>
            </div>

            {/* Right side */}
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

        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full left-0 top-16 z-40">
            <div className="container mx-auto px-4 py-4 space-y-1">
              <Link href="/products" className="block py-3 px-4 text-sm font-bold text-gray-900 hover:bg-gray-50 rounded-lg">PRODUCTS</Link>
              <Link href="#" className="block py-3 px-4 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-lg">SOLUTIONS</Link>
              <Link href="#" className="block py-3 px-4 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-lg">PROJECTS</Link>
              <Link href="/track-order" className="block py-3 px-4 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-lg">TRACK ORDER</Link>
              <Link href="#" className="block py-3 px-4 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-lg">CONTACT</Link>
              <div className="pt-3 px-4">
                <button className="btn-gold w-full">Get Quote</button>
              </div>
              <div className="pt-3 px-4 space-y-2 border-t border-gray-100 mt-3">
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