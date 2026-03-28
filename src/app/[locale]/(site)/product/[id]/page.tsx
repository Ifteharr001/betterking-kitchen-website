"use client";

import { useState, useEffect, use } from "react"; 
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check, Star, Shield, Truck, Award, Clock, Zap, Phone, ChevronRight, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ProductQuoteForm from "../../components/ProductQuoteForm";
import RelatedProducts from "../../components/RelatedProducts";
import { useLocale, useTranslations } from "next-intl"; 

const getLocalizedText = (val: any, locale: string) => {
  if (!val) return "";
  if (typeof val === 'string') return val;
  return val[locale] || val.en || "";
};

const iconMap: any = {
  Shield: Shield,
  Truck: Truck,
  Award: Award,
  Clock: Clock,
  Zap: Zap,
};

interface PageProps {
  params: Promise<{ productId?: string; id?: string; Id?: string }>;
}

const ProductDetails = ({ params }: PageProps) => {
  const resolvedParams = use(params);
  const productId = resolvedParams.productId ?? resolvedParams.id ?? resolvedParams.Id;
  const locale = useLocale(); 
  const t = useTranslations("ProductDetails");

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [catName, setCatName] = useState<string>("");
  const [catSlug, setCatSlug] = useState<string>("");
  const [subCatName, setSubCatName] = useState<string>("");
  const [subCatSlug, setSubCatSlug] = useState<string>("");

  useEffect(() => {
    if (!productId) return; 

    const fetchProductAndCategories = async () => {
      try {
        setLoading(true);
        
        const [prodRes, catRes] = await Promise.all([
          fetch(`/api/products/${productId}`),
          fetch(`/api/admin/categories`)
        ]);
        
        if (!prodRes.ok) {
          throw new Error("Product not found");
        }
        
        const prodData = await prodRes.json();
        const catData = await catRes.json();
        
        setProduct(prodData);

        if (catData.categories && prodData.category) {
          const category = catData.categories.find((c: any) => c._id === prodData.category);
          if (category) {
            setCatName(getLocalizedText(category.name, locale));
            setCatSlug(category.slug);

            if (prodData.subCategory && category.subCategories) {
              const subCategory = category.subCategories.find((s: any) => s._id === prodData.subCategory);
              if (subCategory) {
                setSubCatName(getLocalizedText(subCategory.name, locale));
                setSubCatSlug(subCategory.slug);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndCategories();
  }, [productId, locale]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold mb-4 text-foreground">{t("productNotFound")}</h1>
        <Link href={`/${locale}`} className="text-primary hover:underline">{t("returnHome")}</Link>
      </div>
    );
  }

  const productImages: string[] = (product.gallery && product.gallery.length > 0)
    ? product.gallery
    : [product.image];

  const prevImage = () => {
    setSelectedImageIndex((i) => (i - 1 + productImages.length) % productImages.length);
  };

  const nextImage = () => {
    setSelectedImageIndex((i) => (i + 1) % productImages.length);
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          
          <nav className="flex flex-wrap items-center gap-2 text-sm mb-8">
            <Link href={`/${locale}`} className="text-muted-foreground hover:text-primary transition-colors">{t("home")}</Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            
            <Link href={`/${locale}/products`} className="text-muted-foreground hover:text-primary transition-colors">{t("products")}</Link>
            
            {catName && (
              <>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                <Link href={`/${locale}/categories/${catSlug}`} className="text-muted-foreground hover:text-primary transition-colors capitalize">
                  {catName}
                </Link>
              </>
            )}

            {subCatName && (
              <>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                <Link href={`/${locale}/products?category=${catSlug}&subcategory=${subCatSlug}`} className="text-muted-foreground hover:text-primary transition-colors capitalize">
                  {subCatName}
                </Link>
              </>
            )}

            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground font-medium truncate text-gray-500 max-w-[200px] sm:max-w-full" title={getLocalizedText(product.name, locale)}>
              {getLocalizedText(product.name, locale)}
            </span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          
            <div className="space-y-4">
            
              <div className="relative bg-gray-50 border border-gray-200 rounded-2xl p-8 aspect-square flex items-center justify-center">
                <span className="absolute top-4 left-4 text-xs font-bold text-white bg-primary px-3 py-1.5 rounded-full uppercase tracking-wider">
                  {catName || "Product"}
                </span>
                <Image 
                  src={productImages[selectedImageIndex]} 
                  alt={getLocalizedText(product.name, locale)}
                  width={600}
                  height={600}
                  className="max-w-[80%] max-h-[80%] object-contain"
                />

                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      aria-label="Previous image"
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-[#dbb145] hover:bg-[#c79d3f] p-2 rounded-full shadow-md"
                    >
                      <ArrowLeft className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={nextImage}
                      aria-label="Next image"
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#dbb145] hover:bg-[#c79d3f] p-2 rounded-full shadow-md"
                    >
                      <ArrowRight className="w-5 h-5 text-white" />
                    </button>
                  </>
                )}
              </div>
              
              <div className="flex gap-3">
                {productImages.map((img: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-20 h-20 rounded-xl border-2 bg-gray-50 flex items-center justify-center transition-all overflow-hidden ${
                      selectedImageIndex === index 
                        ? 'border-primary' 
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <Image 
                      src={img} 
                      alt={`View ${index + 1}`} 
                      width={56} 
                      height={56} 
                      className="object-contain" 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="mb-4">
                <p className="text-primary font-semibold text-sm tracking-wider uppercase mb-2">
                  {subCatName || catName || "Equipment"}
                </p>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {getLocalizedText(product.name, locale)}
                </h1>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <span className="text-sm text-gray-500">({t("basedOnMarket")})</span>
              </div>

              <p className="text-gray-600 leading-relaxed mb-6">{getLocalizedText(product.description, locale)}</p>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">{t("keyFeatures")}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {product.features?.map((feature: any, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm text-gray-600">{getLocalizedText(feature, locale)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Button 
                  onClick={() => setIsQuoteOpen(true)}
                  className="btn-gold flex-1 py-6 text-base font-semibold"
                >
                  {t("getQuote")}
                </Button>
                <Button className="flex-1 py-6 gap-2 bg-[#0a1628] hover:bg-[#142338] text-white border-0">
                  <Phone className="w-5 h-5" />
                  <span className="font-semibold">+880 1234-567890</span>
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {product.highlights?.map((highlight: any, index: number) => {
                  const IconComponent = iconMap[highlight.icon] || Shield; 
                  return (
                    <div key={index} className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{getLocalizedText(highlight.text, locale)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="specifications" className="mb-16">
            <TabsList className="w-full justify-start border-b border-gray-200 rounded-none bg-transparent p-0 mb-8 overflow-x-auto">
              {[
                { id: 'specifications', label: t("specificationsTab") },
                { id: 'features', label: t("featuresTab") },
                { id: 'related', label: t("relatedTab") }
              ].map((tab) => (
                <TabsTrigger 
                  key={tab.id}
                  value={tab.id} 
                  className="px-6 py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-gray-600 font-semibold uppercase tracking-wider text-sm whitespace-nowrap"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="specifications" className="mt-0">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 lg:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">{t("techSpecs")}</h3>
                <div className="space-y-0">
                  {product.specifications && Object.entries(product.specifications).map(([key, value], index, arr) => (
                    <div 
                      key={key} 
                      className={`flex items-center justify-between py-4 ${
                        index !== arr.length - 1 ? 'border-b border-gray-200' : ''
                      }`}
                    >
                      <span className="text-gray-600">{key}</span>
                      <span className="font-medium text-gray-900">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="mt-0">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 lg:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">{t("allFeatures")}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {product.features?.map((feature: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium text-gray-900">{getLocalizedText(feature, locale)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="related" className="mt-0">
              <RelatedProducts currentProductId={product.id} />
            </TabsContent>
          </Tabs>

          {/* Contact Section */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{t("readyUpgrade")}</h2>
                <p className="text-gray-300 mb-6">{t("readyUpgradeDesc")}</p>
                <Button 
                  onClick={() => setIsQuoteOpen(true)}
                  className="btn-gold py-6 px-8 text-base font-semibold"
                >
                  {t("requestQuote")}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { val: '24hr', lbl: t("responseTime") },
                  { val: '500+', lbl: t("happyClients") },
                  { val: '15+', lbl: t("yearsExp") },
                  { val: '100%', lbl: t("satisfaction") }
                ].map((stat, i) => (
                  <div key={i} className="text-center p-4 bg-gray-700/50 rounded-xl">
                    <p className="text-3xl font-bold text-primary">{stat.val}</p>
                    <p className="text-sm text-gray-400">{stat.lbl}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={isQuoteOpen} onOpenChange={setIsQuoteOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">{t("quoteTitle")}</DialogTitle>
            <p className="text-gray-600">{t("quoteDesc")}</p>
          </DialogHeader>
          <ProductQuoteForm 
            productName={getLocalizedText(product.name, locale)} 
            productImage={product.image}
            onClose={() => setIsQuoteOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductDetails;