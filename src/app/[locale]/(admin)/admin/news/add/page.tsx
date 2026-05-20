"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic"; 
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "@/components/ImageUpload"; 

// @ts-ignore
import "react-quill-new/dist/quill.snow.css"; 

const ReactQuill = dynamic(() => import("react-quill-new"), { 
  ssr: false, 
  loading: () => <p className="text-gray-500 text-sm">Loading editor...</p> 
}) as React.ComponentType<any>;

export default function AddNewsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    location: "",
    image: "",
    shortDesc: "",
    description: "",
  });

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'blockquote'],
      ['clean']
    ],
  }), []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const handleTitleBlur = () => {
    if (!formData.slug && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.image) {
      toast({ title: "Error", description: "Image is required", variant: "destructive" });
      setLoading(false);
      return;
    }

    if (formData.description === '<p><br></p>' || !formData.description) {
      toast({ title: "Error", description: "Content cannot be empty", variant: "destructive" });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast({ title: "Success", description: "Blog created successfully!" });
        router.push("/admin/news");
        router.refresh();
      } else {
        toast({ 
          title: "Error", 
          description: data.message || "Failed to create blog", 
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 bg-gray-50 min-h-screen">
      
      <div className="flex items-center gap-4">
        <Link href="/admin/news">
           <Button variant="outline" size="icon" className="h-9 w-9">
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Blog</h1>
          <p className="text-sm text-gray-500">Create a new article for your website.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-gray-200 shadow-sm bg-white">
          <CardHeader className="bg-white border-b border-gray-100">
            <CardTitle className="text-base font-semibold text-gray-900">Blog Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 bg-white p-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-700">Blog Title <span className="text-red-500">*</span></Label>
                <Input 
                  id="title" name="title" 
                  value={formData.title} onChange={handleChange} onBlur={handleTitleBlur}
                  placeholder="e.g. Turnkey Kitchen Solutions" required 
                  className="bg-white text-black border-gray-300 focus:ring-primary focus:border-primary placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug" className="text-gray-700">Slug (URL) <span className="text-red-500">*</span></Label>
                <Input 
                  id="slug" name="slug" 
                  value={formData.slug} onChange={handleChange}
                  placeholder="e.g. turnkey-kitchen-solutions" required 
                  className="bg-white text-black border-gray-300 focus:ring-primary focus:border-primary placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-gray-700">Category <span className="text-red-500">*</span></Label>
                <Input 
                  id="category" name="category" 
                  value={formData.category} onChange={handleChange}
                  placeholder="e.g. Kitchen Design" required 
                  className="bg-white text-black border-gray-300 focus:ring-primary focus:border-primary placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-700">Location (Optional)</Label>
                <Input 
                  id="location" name="location" 
                  value={formData.location} onChange={handleChange}
                  placeholder="e.g. Dhaka, BD" 
                  className="bg-white text-black border-gray-300 focus:ring-primary focus:border-primary placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Featured Image <span className="text-red-500">*</span></Label>
              <ImageUpload 
                value={formData.image ? [formData.image] : []}
                onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                onRemove={() => setFormData((prev) => ({ ...prev, image: "" }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDesc" className="text-gray-700">Short Description <span className="text-red-500">*</span></Label>
              <Textarea 
                id="shortDesc" name="shortDesc" 
                value={formData.shortDesc} onChange={handleChange}
                placeholder="Brief summary..." rows={3} required 
                className="bg-white text-black border-gray-300 focus:ring-primary focus:border-primary placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2 pb-12"> 
              <Label className="text-gray-700">Full Content <span className="text-red-500">*</span></Label>
              <div className="bg-white text-black border-gray-300 focus:ring-primary focus:border-primary placeholder:text-gray-400 [&_.ql-editor]:min-h-[300px] [&_.ql-editor]:text-base [&_.ql-container]:border-gray-300 [&_.ql-toolbar]:border-gray-300 rounded-md overflow-hidden pb-12">
  <ReactQuill

    theme="snow"
    value={formData.description} 
    onChange={handleDescriptionChange} 
    modules={modules} 
    className="h-full rounded-md"
    placeholder="Write your full article here..."
  />
</div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-white gap-2 w-full md:w-auto font-semibold">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Publishing...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Publish Blog
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