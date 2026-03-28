import Image from "next/image";
import Link from "next/link";
import connectDB from "@/lib/db";
import IndustryModel from "@/models/Industry";
import { getLocale, getTranslations } from "next-intl/server"; 

 
export const revalidate = 86400;

const getLocalizedText = (val: any, locale: string) => {
  if (!val) return "";
  if (typeof val === 'string') return val;
  return val[locale] || val.en || "";
};

async function getIndustries() {
  try {
    await connectDB();
    const industries = await IndustryModel.find({}).sort({ createdAt: -1 }).limit(3).lean();
    return industries.map((ind: any) => ({
      ...ind,
      _id: ind._id.toString(),
    }));
  } catch (error) {
    console.error("Error fetching industries:", error);
    return [];
  }
}

const Industries = async () => {
  const industries = await getIndustries();
  const locale = await getLocale(); 
  const t = await getTranslations("Industries"); 

  return (
    <section className="py-12 md:py-20 relative overflow-hidden" style={{
      background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 30%, #f1f5f9 100%)'
    }}>
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
      }} />
      
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-gradient-to-r from-primary/5 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-slate-200/50 to-transparent rounded-full blur-3xl translate-x-1/4 translate-y-1/4 pointer-events-none" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-6 md:gap-8 items-start">
          <div className="lg:col-span-4 text-center lg:text-left">
            <p className="text-primary font-semibold text-xs md:text-sm uppercase tracking-wider mb-3">
              {t("subtitle")}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-2 leading-tight">
              {t("title1")}
            </h2>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4 md:mb-6 leading-tight">
              <span className="gradient-headline">{t("title2")}</span>
            </h2>
            <p className="text-gray-600 mb-6 md:mb-8 leading-relaxed text-sm md:text-base">
              {t("description")}
            </p>
            
            <Link 
              href={`/${locale}/industries`} 
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl"
            >
              {t("seeAllBtn")}
            </Link>
          </div>

          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {industries.length > 0 ? (
                industries.map((industry: any) => (
                  <Link 
                    href={`/${locale}/industries/${industry._id}`} 
                    key={industry._id}
                    className="block"
                    aria-label={`Learn more about our ${getLocalizedText(industry.name, 'en')} industry solutions`}
                  >
                    <div className="relative h-60 sm:h-80 rounded-xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300">
                      <Image 
                        src={industry.image} 
                        alt={getLocalizedText(industry.name, locale) || "Industry Image"} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="lazy"   
                        quality={85}     
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-1 h-6 bg-primary rounded-full" />
                          <h3 className="font-semibold text-base md:text-lg text-white">
                            {getLocalizedText(industry.name, locale)} 
                          </h3>
                        </div>
                        <p className="text-xs md:text-sm text-gray-300 pl-4 line-clamp-2">
                          {getLocalizedText(industry.description, locale)} 
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-3 text-center py-10 text-gray-500">
                  {t("noIndustries")}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Industries;