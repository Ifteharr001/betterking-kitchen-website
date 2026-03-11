"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, ArrowLeft, Search } from "lucide-react";

import "@/app/globals.css";

export default function NotFound() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    console.error("404 Error: Route not found:", pathname);
  }, [pathname]);

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
          <div className="text-center max-w-lg">
            <div className="relative mb-8">
              <h1 className="text-[150px] md:text-[200px] font-black leading-none text-primary/10 select-none">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <Search className="w-16 h-16 md:w-20 md:h-20 text-primary/40" />
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Page Not Found
            </h2>
            <p className="text-muted-foreground mb-8 text-base md:text-lg">
              Sorry, the page <code className="bg-muted px-2 py-0.5 rounded text-sm text-primary">{pathname}</code> doesn't exist or has been moved.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button 
                onClick={() => router.push('/')} 
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md flex items-center justify-center gap-2 font-medium transition-colors w-full sm:w-auto"
              >
                <Home className="w-4 h-4" /> Go Home
              </button>
              
              <button 
                onClick={() => router.back()} 
                className="border border-input bg-background hover:bg-accent hover:text-accent-foreground px-6 py-3 rounded-md flex items-center justify-center gap-2 font-medium transition-colors w-full sm:w-auto"
              >
                <ArrowLeft className="w-4 h-4" /> Go Back
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}