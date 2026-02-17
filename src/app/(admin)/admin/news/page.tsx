"use client";

import React, { useEffect, useState } from "react"; // ✅ React ইমপোর্ট করা হয়েছে
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "@/components/ImageUpload";

export default function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { toast } = useToast();
  
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    location: "",
    image: "",
    shortDesc: "",
    description: "",
  });

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return; 

      try {
        const res = await fetch(`/api/admin/news/${id}`);
        const data = await res.json();
        
        if (res.ok) {
          setFormData({
            title: data.title,
            slug: data.slug,
            category: data.category,
            location: data.location || "",
            image: data.image,
            shortDesc: data.shortDesc,
            description: data.description,
          });
        } else {
          toast({ title: "Error", description: "Blog not found", variant: "destructive" });
          router.push("/admin/news");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchBlog();
  }, [id, router, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/news/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast({ title: "Success", description: "Blog updated successfully!" });
        router.push("/admin/news");
        router.refresh();
      } else {
        toast({ title: "Error", description: "Failed to update blog", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 bg-white min-h-screen">
      <div className="flex items-center gap-4">
        <Link href="/admin/news">
          <Button variant="outline" size="icon" className="h-9 w-9 bg-white text-black">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-black">Edit Blog</h1>
          <p className="text-sm text-gray-500">Update article details.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-gray-200 shadow-sm bg-white">
          <CardHeader className="bg-white border-b border-gray-100">
            <CardTitle className="text-base font-semibold text-black">Edit Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 bg-white p-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-black">Blog Title</Label>
                <Input 
                  id="title" name="title" 
                  value={formData.title} onChange={handleChange}
                  className="bg-white text-black border-gray-300" required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug" className="text-black">Slug (URL)</Label>
                <Input 
                  id="slug" name="slug" 
                  value={formData.slug} onChange={handleChange}
                  className="bg-white text-black border-gray-300" required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-black">Category</Label>
                <Input 
                  id="category" name="category" 
                  value={formData.category} onChange={handleChange}
                  className="bg-white text-black border-gray-300" required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-black">Location</Label>
                <Input 
                  id="location" name="location" 
                  value={formData.location} onChange={handleChange}
                  className="bg-white text-black border-gray-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-black">Featured Image</Label>
              <ImageUpload 
                value={formData.image ? [formData.image] : []}
                onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                onRemove={() => setFormData((prev) => ({ ...prev, image: "" }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDesc" className="text-black">Short Description</Label>
              <Textarea 
                id="shortDesc" name="shortDesc" 
                value={formData.shortDesc} onChange={handleChange}
                className="bg-white text-black border-gray-300" rows={3} required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-black">Full Content</Label>
              <Textarea 
                id="description" name="description" 
                value={formData.description} onChange={handleChange}
                className="font-mono text-sm bg-white text-black border-gray-300" rows={10} required 
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <Button type="submit" disabled={loading} className="bg-primary text-white gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Update Blog
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}