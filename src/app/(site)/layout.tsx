"use client";

import { usePathname } from "next/navigation";
import Footer from "./components/Footer";
import Header from "./components/Header";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const shouldLightHeader = pathname.startsWith("/product/") || pathname === "/products";

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      
      <Header 
        lightBackground={shouldLightHeader} 
        hideTopBar={shouldLightHeader} 
      />
      
      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}