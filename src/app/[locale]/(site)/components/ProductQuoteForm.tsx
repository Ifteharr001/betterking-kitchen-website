"use client";

import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { StaticImageData } from "next/image";
import { useTranslations } from "next-intl";

interface ProductQuoteFormProps {
  productName: string;
  productImage: string | StaticImageData;
  onClose?: () => void;
}

const ProductQuoteForm = ({ productName, productImage, onClose }: ProductQuoteFormProps) => {
  const { toast } = useToast();
  const t = useTranslations("QuoteForm"); 
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    companyName: "",
    businessType: "",
    hotelStarRating: "",
    kitchenSize: "",
    seatingCapacity: "",
    openingDate: "",
    dailyProduction: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      data.append("productName", productName);
      const prodImgStr = typeof productImage === 'string' ? productImage : (productImage as any).src || "";
      data.append("productImage", prodImgStr);

      if (selectedImage) {
        data.append("file", selectedImage);
      }

      const res = await fetch("/api/quote", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || t("toastFailedTitle"));

      toast({
        title: t("toastSuccessTitle"),
        description: t("toastSuccessDesc", { id: result.orderId }),
        duration: 6000,
      });
      
      setFormData({
        name: "",
        email: "",
        mobile: "",
        companyName: "",
        businessType: "",
        hotelStarRating: "",
        kitchenSize: "",
        seatingCapacity: "",
        openingDate: "",
        dailyProduction: "",
        message: ""
      });
      setSelectedImage(null);

      if (onClose) onClose();

    } catch (error: any) {
      console.error(error);
      toast({
        title: t("toastFailedTitle"),
        description: error.message || t("toastFailedDesc"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4 border border-gray-200">
        <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-gray-100 relative">
          <Image 
            src={productImage} 
            alt={productName} 
            fill
            className="object-contain p-2"
          />
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">{t("requestingFor")}</p>
          <p className="font-semibold text-gray-900">{productName}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-primary uppercase tracking-wider">{t("contactInfo")}</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700">{t("fullName")} <span className="text-red-500">*</span></Label>
            <Input 
              id="name" 
              name="name" 
              value={formData.name}
              onChange={handleInputChange}
              placeholder={t("fullNamePlaceholder")} 
              required 
              className="bg-white border-gray-300 focus:border-primary text-gray-900"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">{t("email")} <span className="text-red-500">*</span></Label>
            <Input 
              id="email" 
              name="email" 
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t("emailPlaceholder")} 
              required 
              className="bg-white border-gray-300 focus:border-primary text-gray-900"
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="mobile" className="text-gray-700">{t("mobile")} <span className="text-red-500">*</span></Label>
            <Input 
              id="mobile" 
              name="mobile" 
              value={formData.mobile}
              onChange={handleInputChange}
              placeholder={t("mobilePlaceholder")} 
              required 
              className="bg-white border-gray-300 focus:border-primary text-gray-900"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-gray-700">{t("companyName")}</Label>
            <Input 
              id="companyName" 
              name="companyName" 
              value={formData.companyName}
              onChange={handleInputChange}
              placeholder={t("companyPlaceholder")} 
              className="bg-white border-gray-300 focus:border-primary text-gray-900"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-primary uppercase tracking-wider">{t("businessDetails")}</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-700">{t("businessType")}</Label>
            <Select onValueChange={(value) => handleSelectChange("businessType", value)}>
              <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                <SelectValue placeholder={t("btPlaceholder")} />
              </SelectTrigger>
              <SelectContent className="bg-[#0c1727] border-gray-200">
                <SelectItem value="hotel">{t("btHotel")}</SelectItem>
                <SelectItem value="restaurant">{t("btRestaurant")}</SelectItem>
                <SelectItem value="cafe">{t("btCafe")}</SelectItem>
                <SelectItem value="bakery">{t("btBakery")}</SelectItem>
                <SelectItem value="catering">{t("btCatering")}</SelectItem>
                <SelectItem value="cloud-kitchen">{t("btCloud")}</SelectItem>
                <SelectItem value="other">{t("btOther")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700">{t("hotelStar")}</Label>
            <Select onValueChange={(value) => handleSelectChange("hotelStarRating", value)}>
              <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                <SelectValue placeholder={t("hsPlaceholder")} />
              </SelectTrigger>
              <SelectContent className="bg-[#0c1727] border-gray-200">
                <SelectItem value="1-star">{t("hs1")}</SelectItem>
                <SelectItem value="2-star">{t("hs2")}</SelectItem>
                <SelectItem value="3-star">{t("hs3")}</SelectItem>
                <SelectItem value="4-star">{t("hs4")}</SelectItem>
                <SelectItem value="5-star">{t("hs5")}</SelectItem>
                <SelectItem value="luxury">{t("hsLuxury")}</SelectItem>
                <SelectItem value="na">{t("hsNA")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-700">{t("kitchenSize")}</Label>
            <Select onValueChange={(value) => handleSelectChange("kitchenSize", value)}>
              <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                <SelectValue placeholder={t("ksPlaceholder")} />
              </SelectTrigger>
              <SelectContent className="bg-[#0c1727] border-gray-200">
                <SelectItem value="small">{t("ksSmall")}</SelectItem>
                <SelectItem value="medium">{t("ksMedium")}</SelectItem>
                <SelectItem value="large">{t("ksLarge")}</SelectItem>
                <SelectItem value="xlarge">{t("ksXLarge")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="seatingCapacity" className="text-gray-700">{t("seating")}</Label>
            <Input 
              id="seatingCapacity" 
              name="seatingCapacity" 
              value={formData.seatingCapacity}
              onChange={handleInputChange}
              placeholder={t("seatingPlaceholder")} 
              className="bg-white border-gray-300 focus:border-primary text-gray-900"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="openingDate" className="text-gray-700">{t("openingDate")}</Label>
            <Input 
              id="openingDate" 
              name="openingDate" 
              type="date"
              value={formData.openingDate}
              onChange={handleInputChange}
              className="bg-white border-gray-300 focus:border-primary text-gray-900"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dailyProduction" className="text-gray-700">{t("dailyProd")}</Label>
            <Input 
              id="dailyProduction" 
              name="dailyProduction" 
              value={formData.dailyProduction}
              onChange={handleInputChange}
              placeholder={t("dailyProdPlaceholder")} 
              className="bg-white border-gray-300 focus:border-primary text-gray-900"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-primary uppercase tracking-wider">{t("attachments")}</h4>
        <div className="space-y-2">
          <Label className="text-gray-700">{t("layout")}</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary/50 transition-colors bg-gray-50 relative">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {selectedImage ? (
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-gray-200">
                  <span className="text-sm text-primary font-medium">{selectedImage.name}</span>
                  <button 
                    type="button" 
                    onClick={removeImage}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <label htmlFor="image-upload" className="cursor-pointer block w-full h-full">
                <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm text-gray-700 font-medium">{t("clickToUpload")}</p>
                <p className="text-xs text-gray-500 mt-1">{t("uploadLimit")}</p>
              </label>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-gray-700">{t("additionalNotes")}</Label>
        <Textarea 
          id="message" 
          name="message" 
          value={formData.message}
          onChange={handleInputChange}
          placeholder={t("notesPlaceholder")}
          rows={4}
          className="bg-white border-gray-300 focus:border-primary resize-none text-gray-900"
        />
      </div>

      <Button type="submit" className="w-full btn-gold py-6 text-base font-semibold" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t("submitting")}
          </>
        ) : (
          t("submitBtn")
        )}
      </Button>
    </form>
  );
};

export default ProductQuoteForm;