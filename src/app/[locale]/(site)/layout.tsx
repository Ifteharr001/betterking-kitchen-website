import Footer from "./components/Footer"; 
import Header from "./components/Header"; 
import FloatingContact from "./components/FloatingContact";
import { Suspense } from "react";

export const revalidate = 60; // Aggressively revalidate every 60 seconds for faster updates
export const dynamic = 'auto'; // Allow static generation with dynamic content

// Loading placeholder for Header
function HeaderSkeleton() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="h-12 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="hidden lg:flex gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative">
      
      <Suspense fallback={<HeaderSkeleton />}>
        <Header categories={[]} />
      </Suspense>
      
      <main className="flex-1">
        {children}
      </main>

      <FloatingContact />

      <Footer />
    </div>
  );
}