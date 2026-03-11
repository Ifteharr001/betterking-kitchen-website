import Footer from "./components/Footer"; 
import Header from "./components/Header"; 
import FloatingContact from "./components/FloatingContact";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";

export const dynamic = "force-dynamic"; 

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  let categories: { _id: string; name: any; slug: string }[] = [];
  
  try {
    await dbConnect();
    const rawCategories = await Category.find({}).lean();
    
    categories = rawCategories.map((cat: any) => ({
      _id: cat._id.toString(),
      name: cat.name, 
      slug: cat.slug
    }));
  } catch (error) {
    console.error("Failed to fetch categories in layout:", error);
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative">
      
      <Header categories={categories} />
      
      <main className="flex-1">
        {children}
      </main>

      <FloatingContact />

      <Footer />
    </div>
  );
}