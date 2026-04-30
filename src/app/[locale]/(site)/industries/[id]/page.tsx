import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import connectDB from "@/lib/db";
import Industry from "@/models/Industry";
import { getLocale } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";

export const revalidate = 86400;

export async function generateStaticParams() {
  const locales = ['en', 'bn', 'fr', 'es', 'ar', 'zh'];
  
  await connectDB();
  const industries = await Industry.find({}).select('_id').lean();

  const params = [];

  for (const locale of locales) {
    for (const ind of industries) {
      params.push({ locale, id: ind._id.toString() });
    }
  }

  return params;
}

const getLocalizedText = (val: any, locale: string) => {
  if (!val) return "";
  if (typeof val === 'string') return val;
  return val[locale] || val.en || "";
};

export default async function IndustryDetails({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const { id } = await params;
  const locale = await getLocale();
  
  setRequestLocale(locale);

  await connectDB();
  const industry = await Industry.findById(id).lean();

  if (!industry) {
    return <div className="text-center py-20">Industry not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
    
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8 shadow-lg">
            <Image 
              src={industry.image} 
              alt={getLocalizedText(industry.name, locale)} 
              fill 
              className="object-cover"
            />
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gray-100">{getLocalizedText(industry.name, locale)}</h1>
          <p className="text-xl text-gray-300 mb-8 border-l-4 border-primary pl-4">{getLocalizedText(industry.description, locale)}</p>

          <div className="prose prose-lg max-w-none text-gray-200">
            <p className="whitespace-pre-line">{getLocalizedText(industry.details, locale) || "More details coming soon..."}</p>
          </div>
        </div>
      </main>
      
    </div>
  );
}