"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  PackagePlus, Plus, X, Upload, Shield, Truck, Clock, 
  Star, Award, Zap, Heart, ThumbsUp, Wrench, Headphones, 
  RefreshCw, CheckCircle, Settings, Flame, Snowflake, Loader2, type LucideIcon 
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

const AdminAddProduct = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    category: "",
    price: "",
    description: "",
  });

  const [features, setFeatures] = useState<string[]>([""]);
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([{ key: "", value: "" }]);
  const [highlights, setHighlights] = useState<{ icon: string; text: string }[]>([{ icon: "", text: "" }]);
  
  const [image, setImage] = useState<string>(""); 
  const [gallery, setGallery] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
   
    if (!formData.id || !formData.name || !formData.price || !image) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields and upload a main image.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const formattedSpecs: Record<string, string> = {};
      specs.forEach((s) => {
        if (s.key && s.value) formattedSpecs[s.key] = s.value;
      });

      const payload = {
        ...formData,
        price: Number(formData.price), 
        features: features.filter((f) => f.trim() !== ""), 
        specifications: formattedSpecs,
        highlights: highlights.filter((h) => h.text.trim() !== ""),
        image, 
        gallery,
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      toast({
        title: "Success!",
        description: "Product created successfully.",
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
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Add Product</h1>
        <p className="text-muted-foreground text-sm mt-1">Add a new product to your inventory</p>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader className="pb-4 border-b">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2 text-muted-foreground">
            <PackagePlus className="w-4 h-4 text-primary" /> Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Product ID <span className="text-red-500">*</span></Label>
              <Input name="id" value={formData.id} onChange={handleInputChange} placeholder="e.g. OVEN-X200" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Product Name <span className="text-red-500">*</span></Label>
              <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Titan MixMaster 3000" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Category</Label>
              <Input name="category" value={formData.category} onChange={handleInputChange} placeholder="e.g. Kitchen Appliances" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Price (TK) <span className="text-red-500">*</span></Label>
              <Input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="e.g. 95000" required />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Description</Label>
            <Textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Product description..." rows={4} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-4 border-b">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2 text-muted-foreground">
              <Upload className="w-4 h-4 text-primary" /> Main Image <span className="text-red-500">*</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground mb-4">This image will appear on the product card.</p>
            <ImageUpload 
              value={image ? [image] : []} 
              onChange={(url) => setImage(url)}
              onRemove={() => setImage("")}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4 border-b">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2 text-muted-foreground">
              <Upload className="w-4 h-4 text-primary" /> Gallery Images
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground mb-4">Add multiple images for the product detail page.</p>
            <ImageUpload 
              value={gallery} 
              onChange={(url) => setGallery((prev) => [...prev, url])}
              onRemove={(url) => setGallery((prev) => prev.filter((img) => img !== url))}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4 border-b">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Features</CardTitle>
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
                placeholder={`Feature ${i + 1}`}
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
            className="gap-1.5 mt-2" 
            onClick={() => setFeatures([...features, ""])}
          >
            <Plus className="w-3.5 h-3.5" /> Add Feature
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-4 border-b">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Specifications</CardTitle>
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
                  placeholder="Key (e.g. Power)"
                  className="w-1/3"
                />
                <Input
                  value={s.value}
                  onChange={(e) => {
                    const updated = [...specs];
                    updated[i] = { ...updated[i], value: e.target.value };
                    setSpecs(updated);
                  }}
                  placeholder="Value (e.g. 1500W)"
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
              className="gap-1.5 mt-2" 
              onClick={() => setSpecs([...specs, { key: "", value: "" }])}
            >
              <Plus className="w-3.5 h-3.5" /> Add Spec
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4 border-b">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Highlights</CardTitle>
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
                  <SelectTrigger className="w-[140px]">
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
                  <SelectContent>
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
                  placeholder="Text (e.g. Warranty)"
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
              className="gap-1.5 mt-2" 
              onClick={() => setHighlights([...highlights, { icon: "", text: "" }])}
            >
              <Plus className="w-3.5 h-3.5" /> Add Highlight
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t md:left-64 z-10 flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button 
          size="lg" 
          className="gap-2 px-8 bg-primary hover:bg-primary/90" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Creating...
            </>
          ) : (
            <>
              <PackagePlus className="w-4 h-4" /> Create Product
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AdminAddProduct;