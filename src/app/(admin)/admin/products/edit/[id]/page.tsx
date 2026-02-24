"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  PackagePlus, Plus, X, Upload, Shield, Truck, Clock, 
  Star, Award, Zap, Heart, ThumbsUp, Wrench, Headphones, 
  RefreshCw, CheckCircle, Settings, Flame, Snowflake, Loader2, Save, type LucideIcon 
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "@/components/ImageUpload";

const iconOptions: { name: string; icon: LucideIcon }[] = [
  { name: "Shield", icon: Shield },
  { name: "Truck", icon: Truck },
  { name: "Clock", icon: Clock },
  { name: "Star", icon: Star },
  { name: "Award", icon: Award },
  { name: "Zap", icon: Zap },
  { name: "Heart", icon: Heart },
  { name: "ThumbsUp", icon: ThumbsUp },
  { name: "Wrench", icon: Wrench },
  { name: "Headphones", icon: Headphones },
  { name: "RefreshCw", icon: RefreshCw },
  { name: "CheckCircle", icon: CheckCircle },
  { name: "Settings", icon: Settings },
  { name: "Flame", icon: Flame },
  { name: "Snowflake", icon: Snowflake },
];

const AdminEditProduct = () => {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true); // ডাটা ফেচিং লোডিং
  const [saving, setSaving] = useState(false);  // সেভ লোডিং

  // Dynamic Categories State
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [subCategoriesList, setSubCategoriesList] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    category: "",
    subCategory: "", // Added Sub-Category, Removed Price
    description: "",
  });

  const [features, setFeatures] = useState<string[]>([""]);
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([{ key: "", value: "" }]);
  const [highlights, setHighlights] = useState<{ icon: string; text: string }[]>([{ icon: "", text: "" }]);
  
  const [image, setImage] = useState<string>(""); 
  const [gallery, setGallery] = useState<string[]>([]);

  // ডাটা ফেচ করা
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ক্যাটাগরি এবং প্রোডাক্ট ডাটা একসাথে কল করা হচ্ছে
        const [prodRes, catRes] = await Promise.all([
          fetch(`/api/admin/products/${params.id}`),
          fetch(`/api/admin/categories`)
        ]);

        if (!prodRes.ok) throw new Error("Product not found");
        
        const productData = await prodRes.json();
        const catData = await catRes.json();
        const fetchedCategories = catData.categories || [];

        setCategoriesList(fetchedCategories);

        setFormData({
          id: productData.id,
          name: productData.name,
          category: productData.category || "",
          subCategory: productData.subCategory || "",
          description: productData.description || "",
        });
        
        setImage(productData.image);
        setGallery(productData.gallery || []);
        setFeatures(productData.features?.length > 0 ? productData.features : [""]);
        setHighlights(productData.highlights?.length > 0 ? productData.highlights : [{ icon: "", text: "" }]);
        
        if (productData.specifications) {
          const specsArray = Object.entries(productData.specifications).map(([key, value]) => ({
            key,
            value: String(value),
          }));
          setSpecs(specsArray.length > 0 ? specsArray : [{ key: "", value: "" }]);
        }

        // এডিট পেজ লোড হওয়ার পর পূর্বের ক্যাটাগরির সাব-ক্যাটাগরিগুলো লিস্টে সেট করা
        if (productData.category) {
          const selectedCat = fetchedCategories.find((c: any) => c._id === productData.category);
          if (selectedCat && selectedCat.subCategories) {
            setSubCategoriesList(selectedCat.subCategories);
          }
        }

      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load product details.",
          variant: "destructive",
        });
        router.push("/admin/products");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchData();
  }, [params.id, router, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Category Change to populate Sub-Categories
  const handleCategoryChange = (val: string) => {
    setFormData((prev) => ({ ...prev, category: val, subCategory: "" }));
    const selectedCat = categoriesList.find((c) => c._id === val);
    if (selectedCat && selectedCat.subCategories) {
      setSubCategoriesList(selectedCat.subCategories);
    } else {
      setSubCategoriesList([]);
    }
  };

  const handleUpdate = async () => {
    if (!formData.name || !image) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      const formattedSpecs: Record<string, string> = {};
      specs.forEach((s) => {
        if (s.key && s.value) formattedSpecs[s.key] = s.value;
      });

      const payload = {
        ...formData,
        features: features.filter((f) => f.trim() !== ""),
        specifications: formattedSpecs,
        highlights: highlights.filter((h) => h.text.trim() !== ""),
        image,
        gallery,
      };

      const res = await fetch(`/api/admin/products/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update product");

      toast({
        title: "Success!",
        description: "Product updated successfully.",
      });

      router.push("/admin/products");
      router.refresh();

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Edit Product</h1>
        <p className="text-muted-foreground text-sm mt-1">Update product details for <span className="font-semibold text-gray-900">{formData.id}</span></p>
      </div>

      {/* Basic Info */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2 text-muted-foreground">
            <PackagePlus className="w-4 h-4 text-primary" /> Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-700">Product ID</Label>
              <Input 
                name="id" 
                value={formData.id} 
                disabled 
                className="bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed" 
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-700">Product Name <span className="text-red-500">*</span></Label>
              <Input 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                className="bg-white text-black border-gray-200" 
                required 
              />
            </div>

            {/* Dynamic Category Dropdown */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-700">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="bg-white text-black border-gray-200">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="bg-black border-gray-200 z-50">
                  {categoriesList.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dynamic Sub-Category Dropdown */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-700">Sub-Category</Label>
              <Select 
                value={formData.subCategory} 
                onValueChange={(val) => setFormData(prev => ({ ...prev, subCategory: val }))}
                disabled={!formData.category || subCategoriesList.length === 0}
              >
                <SelectTrigger className="bg-white text-black border-gray-200">
                  <SelectValue placeholder={subCategoriesList.length === 0 && formData.category ? "No Sub-categories" : "Select Sub-Category"} />
                </SelectTrigger>
                <SelectContent className="bg-black border-gray-200 z-50">
                  {subCategoriesList.map((sub) => (
                    <SelectItem key={sub._id} value={sub._id}>{sub.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-gray-700">Description</Label>
            <Textarea 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange} 
              rows={4} 
              className="bg-white text-black border-gray-200" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="pb-4 border-b border-gray-100/30">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2 text-muted-foreground">
              <Upload className="w-4 h-4 text-primary" /> Main Image <span className="text-red-500">*</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ImageUpload 
              value={image ? [image] : []} 
              onChange={(url) => setImage(url)}
              onRemove={() => setImage("")}
            />
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="pb-4 border-b border-gray-100/30">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2 text-muted-foreground">
              <Upload className="w-4 h-4 text-primary" /> Gallery Images
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ImageUpload 
              value={gallery} 
              onChange={(url) => setGallery((prev) => [...prev, url])}
              onRemove={(url) => setGallery((prev) => prev.filter((img) => img !== url))}
            />
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="pb-4 border-b">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-6">
          {features.map((f, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={f}
                onChange={(e) => {
                  const updated = [...features];
                  updated[i] = e.target.value;
                  setFeatures(updated);
                }}
                className="bg-white text-black border-gray-200"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="shrink-0 text-muted-foreground hover:text-destructive" 
                onClick={() => setFeatures(features.filter((_, index) => index !== i))}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1.5 mt-2 border-gray-200" 
            onClick={() => setFeatures([...features, ""])}
          >
            <Plus className="w-3.5 h-3.5" /> Add Feature
          </Button>
        </CardContent>
      </Card>

      {/* Specs & Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="pb-4 border-b">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Specifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            {specs.map((s, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={s.key}
                  onChange={(e) => {
                    const updated = [...specs];
                    updated[i] = { ...updated[i], key: e.target.value };
                    setSpecs(updated);
                  }}
                  className="w-1/3 bg-white text-black border-gray-200"
                  placeholder="Key"
                />
                <Input
                  value={s.value}
                  onChange={(e) => {
                    const updated = [...specs];
                    updated[i] = { ...updated[i], value: e.target.value };
                    setSpecs(updated);
                  }}
                  className="bg-white text-black border-gray-200"
                  placeholder="Value"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="shrink-0 text-muted-foreground hover:text-destructive" 
                  onClick={() => setSpecs(specs.filter((_, index) => index !== i))}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1.5 mt-2 border-gray-200" 
              onClick={() => setSpecs([...specs, { key: "", value: "" }])}
            >
              <Plus className="w-3.5 h-3.5" /> Add Spec
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="pb-4 border-b">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Highlights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            {highlights.map((h, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Select
                  value={h.icon}
                  onValueChange={(val) => {
                    const updated = [...highlights];
                    updated[i] = { ...updated[i], icon: val };
                    setHighlights(updated);
                  }}
                >
                  <SelectTrigger className="w-[140px] bg-white text-black border-gray-200">
                    <SelectValue placeholder="Icon">
                      {h.icon && (() => {
                        const found = iconOptions.find((o) => o.name === h.icon);
                        return found ? (
                          <div className="flex items-center gap-2">
                            <found.icon className="w-4 h-4" />
                            <span className="truncate">{found.name}</span>
                          </div>
                        ) : h.icon;
                      })()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 z-50">
                    {iconOptions.map((opt) => (
                      <SelectItem key={opt.name} value={opt.name}>
                        <div className="flex items-center gap-2">
                          <opt.icon className="w-4 h-4" />
                          <span>{opt.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={h.text}
                  onChange={(e) => {
                    const updated = [...highlights];
                    updated[i] = { ...updated[i], text: e.target.value };
                    setHighlights(updated);
                  }}
                  className="bg-white text-black border-gray-200"
                  placeholder="Text"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="shrink-0 text-muted-foreground hover:text-destructive" 
                  onClick={() => setHighlights(highlights.filter((_, index) => index !== i))}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1.5 mt-2 border-gray-200" 
              onClick={() => setHighlights([...highlights, { icon: "", text: "" }])}
            >
              <Plus className="w-3.5 h-3.5" /> Add Highlight
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-4 pt-4">
        <Button 
          type="button"
          variant="outline" 
          onClick={() => router.back()}
          className="px-8 border-gray-200 text-white hover:bg-gray-50 hover:text-black"
        >
          Cancel
        </Button>
        <Button 
          type="button"
          size="lg" 
          className="gap-2 px-8 bg-primary hover:bg-primary/90 text-white font-bold" 
          onClick={handleUpdate}
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Updating...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AdminEditProduct;