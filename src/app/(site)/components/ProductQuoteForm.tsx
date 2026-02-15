"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { StaticImageData } from "next/image";

interface ProductQuoteFormProps {
  productName: string;
  productImage: string | StaticImageData;
  onClose?: () => void;
}

const ProductQuoteForm = ({ productName, productImage, onClose }: ProductQuoteFormProps) => {
  const { toast } = useToast();
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
    
    // Future Logic:
    
    toast({
      title: "Quote Request Submitted!",
      description: "Our team will contact you within 24 hours.",
    });
    
    if (onClose) onClose();
    
    // Reset Form
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
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Reference */}
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
          <p className="text-xs text-gray-500 uppercase tracking-wide">Requesting quote for</p>
          <p className="font-semibold text-gray-900">{productName}</p>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-primary uppercase tracking-wider">Contact Information</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700">Full Name <span className="text-red-500">*</span></Label>
            <Input 
              id="name" 
              name="name" 
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name" 
              required 
              className="bg-white border-gray-300 focus:border-primary text-gray-900"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">Email Address <span className="text-red-500">*</span></Label>
            <Input 
              id="email" 
              name="email" 
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com" 
              required 
              className="bg-white border-gray-300 focus:border-primary text-gray-900"
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="mobile" className="text-gray-700">Mobile / WhatsApp <span className="text-red-500">*</span></Label>
            <Input 
              id="mobile" 
              name="mobile" 
              value={formData.mobile}
              onChange={handleInputChange}
              placeholder="+880 1XXX-XXXXXX" 
              required 
              className="bg-white border-gray-300 focus:border-primary text-gray-900"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-gray-700">Company Name</Label>
            <Input 
              id="companyName" 
              name="companyName" 
              value={formData.companyName}
              onChange={handleInputChange}
              placeholder="Your company name" 
              className="bg-white border-gray-300 focus:border-primary text-gray-900"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-primary uppercase tracking-wider">Business Details</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-700">Business Type</Label>
            <Select onValueChange={(value) => handleSelectChange("businessType", value)}>
              <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="hotel">Hotel</SelectItem>
                <SelectItem value="restaurant">Restaurant</SelectItem>
                <SelectItem value="cafe">Cafe</SelectItem>
                <SelectItem value="bakery">Bakery</SelectItem>
                <SelectItem value="catering">Catering Service</SelectItem>
                <SelectItem value="cloud-kitchen">Cloud Kitchen</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-700">Hotel Star Rating</Label>
            <Select onValueChange={(value) => handleSelectChange("hotelStarRating", value)}>
              <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="1-star">1 Star</SelectItem>
                <SelectItem value="2-star">2 Star</SelectItem>
                <SelectItem value="3-star">3 Star</SelectItem>
                <SelectItem value="4-star">4 Star</SelectItem>
                <SelectItem value="5-star">5 Star</SelectItem>
                <SelectItem value="luxury">Luxury / Boutique</SelectItem>
                <SelectItem value="na">Not Applicable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-700">Kitchen Size</Label>
            <Select onValueChange={(value) => handleSelectChange("kitchenSize", value)}>
              <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                <SelectValue placeholder="Select kitchen size" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="small">Small (Under 500 sq ft)</SelectItem>
                <SelectItem value="medium">Medium (500-1000 sq ft)</SelectItem>
                <SelectItem value="large">Large (1000-2000 sq ft)</SelectItem>
                <SelectItem value="xlarge">Extra Large (2000+ sq ft)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="seatingCapacity" className="text-gray-700">Seating Capacity</Label>
            <Input 
              id="seatingCapacity" 
              name="seatingCapacity" 
              value={formData.seatingCapacity}
              onChange={handleInputChange}
              placeholder="e.g., 100 seats" 
              className="bg-white border-gray-300 focus:border-primary text-gray-900"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="openingDate" className="text-gray-700">Expected Opening Date</Label>
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
            <Label htmlFor="dailyProduction" className="text-gray-700">Daily Production Volume</Label>
            <Input 
              id="dailyProduction" 
              name="dailyProduction" 
              value={formData.dailyProduction}
              onChange={handleInputChange}
              placeholder="e.g., 500 meals/day" 
              className="bg-white border-gray-300 focus:border-primary text-gray-900"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-primary uppercase tracking-wider">Attachments</h4>
        <div className="space-y-2">
          <Label className="text-gray-700">Kitchen Layout / Floor Plan</Label>
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
                <p className="text-sm text-gray-700 font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
              </label>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-gray-700">Additional Notes / Message</Label>
        <Textarea 
          id="message" 
          name="message" 
          value={formData.message}
          onChange={handleInputChange}
          placeholder="Tell us about your project requirements, specific needs, or any questions..."
          rows={4}
          className="bg-white border-gray-300 focus:border-primary resize-none text-gray-900"
        />
      </div>

      <Button type="submit" className="w-full btn-gold py-6 text-base font-semibold">
        Submit Quote Request
      </Button>
    </form>
  );
};

export default ProductQuoteForm;