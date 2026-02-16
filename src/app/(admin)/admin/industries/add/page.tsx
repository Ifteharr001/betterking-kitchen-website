"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Save, Upload, Loader2, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "@/components/ImageUpload";

const AddIndustry = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    details: "",
  });
  const [image, setImage] = useState("");

  const handleSubmit = async () => {
    if (!formData.name || !formData.description || !image) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields and upload an image.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/industries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, image }),
      });

      if (!res.ok) throw new Error("Failed to create industry");

      toast({ title: "Success", description: "Industry added successfully." });
      router.push("/admin/industries");
      router.refresh();
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Add Industry</h1>
        <p className="text-muted-foreground text-sm mt-1">Create a new industry sector</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Image */}
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="pb-4 border-b border-gray-100/30">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2 text-muted-foreground">
                <Upload className="w-4 h-4 text-primary" /> Cover Image
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
        </div>

        {/* Right Column - Form */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="pb-4 border-b border-gray-100/30">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2 text-muted-foreground">
                <Building2 className="w-4 h-4 text-primary" /> Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-700">Industry Name <span className="text-red-500">*</span></Label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  placeholder="e.g. Fine Dining" 
                  className="bg-white text-black border-gray-200" 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-700">Short Description <span className="text-red-500">*</span></Label>
                <Input 
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                  placeholder="Short summary for the card view" 
                  className="bg-white text-black border-gray-200" 
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="pb-4 border-b border-gray-100/30">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider flex items-center gap-2 text-muted-foreground">
                <FileText className="w-4 h-4 text-primary" /> Detailed Content
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Label className="text-xs font-medium text-gray-700 mb-2 block">Full Details</Label>
              <Textarea 
                value={formData.details} 
                onChange={(e) => setFormData({ ...formData, details: e.target.value })} 
                placeholder="Write detailed information here (this will show on the details page)..." 
                rows={10} 
                className="bg-white text-black border-gray-200" 
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-4">
        <Button variant="outline" onClick={() => router.back()} className="px-8 border-gray-200 text-gray-100 hover:bg-gray-50">
          Cancel
        </Button>
        <Button 
          size="lg" 
          className="gap-2 px-8 bg-primary hover:bg-primary/90 text-white font-bold" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Industry
        </Button>
      </div>
    </div>
  );
};

export default AddIndustry;