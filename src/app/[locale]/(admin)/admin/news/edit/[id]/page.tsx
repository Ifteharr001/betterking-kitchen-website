"use client";

import React, { useEffect, useState } from "react";
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
    if (!id) {
      setFetching(false);
      return;
    }

    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/admin/news/${id}`);
        const data = await res.json();
        
        if (res.ok) {
          setFormData({
            title: typeof data.title === 'string' ? data.title : data.title?.en || "",
            slug: data.slug || "",
            category: typeof data.category === 'string' ? data.category : data.category?.en || "",
            location: typeof data.location === 'string' ? data.location : data.location?.en || "",
            image: data.image || "",
            shortDesc: typeof data.shortDesc === 'string' ? data.shortDesc : data.shortDesc?.en || "",
            description: typeof data.description === 'string' ? data.description : data.description?.en || "",
          });
        } else {
          toast({ title: "Error", description: "Blog not found", variant: "destructive" });
          router.push("/admin/news");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        toast({ title: "Error", description: "Failed to fetch blog details", variant: "destructive" });
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
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <Link href="/admin/news">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Blog</h1>
          <p className="text-sm text-gray-500">Update article details.</p>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit}>
        <Card className="border-gray-200 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Edit Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="grid grid-cols-1 text-black md:grid-cols-2 gap-6">
              <div className="space-y-2 text-black">
                <Label htmlFor="title">Blog Title</Label>
                <Input 
                  id="title" name="title" 
                  className="text-black border-gray-300 focus:ring-primary focus:border-primary"
                  value={formData.title} onChange={handleChange}
                  placeholder="e.g. Turnkey Kitchen Solutions" required 
                />
              </div>

              <div className="space-y-2 text-black">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input 
                  id="slug" name="slug" 
                   className="text-black border-gray-300 focus:ring-primary focus:border-primary"
                  value={formData.slug} onChange={handleChange}
                  placeholder="e.g. turnkey-kitchen-solutions" required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 text-black md:grid-cols-2 gap-6">
              <div className="space-y-2 text-black">
                <Label htmlFor="category">Category</Label>
                <Input 
                  id="category" name="category" 
                   className="text-black border-gray-300 focus:ring-primary focus:border-primary"
                  value={formData.category} onChange={handleChange}
                  placeholder="e.g. Kitchen Design" required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location (Optional)</Label>
                <Input 
                  id="location" name="location" 
                   className="text-black border-gray-300 focus:ring-primary focus:border-primary"
                  value={formData.location} onChange={handleChange}
                  placeholder="e.g. Dhaka, BD" 
                />
              </div>
            </div>

            <div className="space-y-2 text-black">
              <Label className="text-gray-700">Featured Image</Label>
              <ImageUpload 
                value={formData.image ? [formData.image] : []}
                onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                onRemove={() => setFormData((prev) => ({ ...prev, image: "" }))}
              />
            </div>

            <div className="space-y-2 text-black">
              <Label htmlFor="shortDesc">Short Description</Label>
              <Textarea 
                id="shortDesc" name="shortDesc" 
                value={formData.shortDesc} onChange={handleChange}
                placeholder="Brief summary..." rows={3} required 
                className="text-black border-gray-300 focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="space-y-2 text-black">
              <Label htmlFor="description">Full Content</Label>
              <Textarea 
                id="description" name="description" 
                value={formData.description} onChange={handleChange}
                placeholder="Write your full article here..." rows={10} required 
                className="text-black font-mono text-sm border-gray-300 focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-white gap-2 w-full md:w-auto">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Update Blog
                  </>
                )}
              </Button>
            </div>

          </CardContent>
        </Card>
      </form>
    </div>
  );
}