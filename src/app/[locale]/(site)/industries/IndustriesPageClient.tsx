"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

// Cloudinary Loader Function
const cloudinaryLoader = ({ src, width }: { src: string, width: number }) => {
  if (src.includes('res.cloudinary.com')) {
    return src.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
  }
  return src;
};



const getLocalizedText = (val: any, locale: string) => {
  if (!val) return "";
  if (typeof val === 'string') return val;
  return val[locale] || val.en || "";
};

interface Industry {
  _id: string;
  name: any;
  description: any;
  image: string;
  details: any;
  createdAt: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

function IndustriesPageClient() {
  const locale = useLocale();
  const t = useTranslations("Industries");
  const searchParams = useSearchParams();

  const [industries, setIndustries] = useState<Industry[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchIndustries = async (page: number = 1, search: string = "") => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '12');
      if (search) params.set('search', search);

      const response = await fetch(`/api/industries?${params}`);
      if (!response.ok) throw new Error('Failed to fetch industries');

      const data = await response.json();
      setIndustries(data.industries || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching industries:', error);
      setIndustries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndustries(currentPage, searchQuery);
  }, [currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchIndustries(1, searchQuery);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 mt-10">
              {t("title") || "Our Industries"}
            </h1>
            <p className="text-xl text-white/90 mb-8">
              {t("description") || "Discover how BetterKing serves diverse industries with innovative kitchen solutions"}
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t("searchPlaceholder") || "Search industries..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 pr-12 text-gray-900 rounded-full border-0 focus:ring-2 focus:ring-white/50 focus:outline-none"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white px-4 py-1.5 rounded-full hover:bg-primary/90 transition-colors"
                >
                  {t("search") || "Search"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-gray-600">{t("loading") || "Loading industries..."}</span>
            </div>
          ) : industries.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-semibold text-gray-600 mb-4">
                {t("noIndustries") || "No industries found"}
              </h3>
              <p className="text-gray-500">
                {searchQuery ? (t("noSearchResults") || "Try adjusting your search terms") : (t("noIndustriesDesc") || "Check back later for industry information")}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {industries.map((industry) => (
                  <div
                    key={industry._id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
                  >
                  <div className="relative h-48 overflow-hidden">
                      <Image
                      loader={cloudinaryLoader}
                        src={industry.image}
                        alt={getLocalizedText(industry.name, locale)}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                       
                        priority={industries.indexOf(industry) < 3} 
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        {getLocalizedText(industry.name, locale)}
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {getLocalizedText(industry.description, locale)}
                      </p>

                      <Link
                        href={`/${locale}/industries/${industry._id}`}
                        className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors group"
                      >
                        {t("learnMore") || "Learn More"}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {t("previous") || "Previous"}
                  </button>

                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(pagination.totalPages - 4, currentPage - 2)) + i;
                    if (pageNum > pagination.totalPages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-2 border rounded-lg transition-colors ${
                          pageNum === currentPage
                            ? 'bg-primary text-white border-primary'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {t("next") || "Next"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default IndustriesPageClient;