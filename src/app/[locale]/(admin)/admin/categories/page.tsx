"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FolderPlus, Plus, Pencil, Trash2, ImagePlus, X, Layers, Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast"; 

export type SubCategory = { _id: string; name: any; description: any; image: string; categoryId: string; };
export type Category = { _id: string; name: any; description: any; image: string; subCategories: SubCategory[]; };

const getEnText = (val: any) => {
  if (!val) return "";
  if (typeof val === 'string') return val;
  return val.en || "";
};

const AdminCategories = () => {
  const { toast } = useToast(); 
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catImage, setCatImage] = useState<string | null>(null);
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const catImageRef = useRef<HTMLInputElement>(null);

  // Sub-category form state
  const [subName, setSubName] = useState("");
  const [subDesc, setSubDesc] = useState("");
  const [subImage, setSubImage] = useState<string | null>(null);
  const [subDialogOpen, setSubDialogOpen] = useState(false);
  const [subParentCatId, setSubParentCatId] = useState<string | null>(null);
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const subImageRef = useRef<HTMLInputElement>(null);

  // Fetch Data from API
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (res.ok) setCategories(data.categories || []);
    } catch (error) {
      console.error("Failed to fetch categories", error);
      toast({ title: "Error", description: "Failed to fetch categories", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCatImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCatImage(reader.result as string); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSubImage(reader.result as string); 
      };
      reader.readAsDataURL(file);
    }
  };

  const resetCatForm = () => {
    setCatName(""); setCatDesc(""); setCatImage(null); setEditingCat(null);
  };

  const resetSubForm = () => {
    setSubName(""); setSubDesc(""); setSubImage(null); setSubParentCatId(null); setEditingSubId(null);
  };

  const handleSaveCategory = async () => {
    if (!catName.trim()) return;
    
    try {
      
      const payload = { name: catName, description: catDesc, image: catImage || "" };
      const url = editingCat ? `/api/admin/categories/${editingCat}` : "/api/admin/categories";
      const method = editingCat ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast({ title: "Success", description: `Category ${editingCat ? 'updated' : 'created'} successfully!` });
        setCatDialogOpen(false);
        resetCatForm();
        fetchCategories();
      } else {
        toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error saving category", error);
      toast({ title: "Error", description: "Failed to save category", variant: "destructive" });
    }
  };

  const handleEditCategory = (cat: Category) => {
    setEditingCat(cat._id);
    setCatName(getEnText(cat.name));
    setCatDesc(getEnText(cat.description));
    setCatImage(cat.image && cat.image !== "/placeholder.svg" ? cat.image : null);
    setCatDialogOpen(true);
  };

  // Delete Category
  const deleteCategory = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast({ title: "Success", description: "Category deleted successfully!" });
        fetchCategories();
      } else {
        toast({ title: "Error", description: "Failed to delete category", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error deleting category", error);
      toast({ title: "Error", description: "Failed to delete category", variant: "destructive" });
    }
  };

  // Save SubCategory (POST / PUT)
  const handleSaveSubCategory = async () => {
    if (!subName.trim() || !subParentCatId) return;
    
    try {
      const payload = { categoryId: subParentCatId, name: subName, description: subDesc, image: subImage || "" };
      const url = editingSubId ? `/api/admin/subcategories/${editingSubId}` : "/api/admin/subcategories";
      const method = editingSubId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast({ title: "Success", description: `Sub-Category ${editingSubId ? 'updated' : 'created'} successfully!` });
        setSubDialogOpen(false);
        resetSubForm();
        fetchCategories();
      } else {
        toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error saving sub-category", error);
      toast({ title: "Error", description: "Failed to save sub-category", variant: "destructive" });
    }
  };

  const handleEditSubCategory = (catId: string, sub: SubCategory) => {
    setSubParentCatId(catId);
    setEditingSubId(sub._id);
    setSubName(getEnText(sub.name));
    setSubDesc(getEnText(sub.description));
    setSubImage(sub.image && sub.image !== "/placeholder.svg" ? sub.image : null);
    setSubDialogOpen(true);
  };

  // Delete SubCategory
  const deleteSubCategory = async (catId: string, subId: string) => {
    try {
      const res = await fetch(`/api/admin/subcategories/${subId}`, { method: "DELETE" });
      if (res.ok) {
        toast({ title: "Success", description: "Sub-Category deleted successfully!" });
        fetchCategories();
      } else {
        toast({ title: "Error", description: "Failed to delete sub-category", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error deleting sub-category", error);
      toast({ title: "Error", description: "Failed to delete sub-category", variant: "destructive" });
    }
  };

  const openAddSub = (catId: string) => {
    resetSubForm();
    setSubParentCatId(catId);
    setSubDialogOpen(true);
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-black font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage product categories and sub-categories</p>
        </div>
        <Dialog open={catDialogOpen} onOpenChange={(open) => { setCatDialogOpen(open); if (!open) resetCatForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => { resetCatForm(); setCatDialogOpen(true); }}>
              <FolderPlus className="w-4 h-4" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingCat ? "Edit Category" : "Add New Category"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Category Name</Label>
                <Input value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="e.g. Ovens" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Description</Label>
                <Textarea value={catDesc} onChange={(e) => setCatDesc(e.target.value)} placeholder="Short description..." rows={2} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Image</Label>
                <input type="file" ref={catImageRef} accept="image/*" className="hidden" onChange={handleCatImage} />
                {catImage ? (
                  <div className="relative w-32 h-32 group">
                    <img src={catImage} alt="Category" className="w-full h-full object-cover rounded-lg border border-border" />
                    <button onClick={() => setCatImage(null)} className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => catImageRef.current?.click()} className="w-32 h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer">
                    <ImagePlus className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Upload</span>
                  </button>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleSaveCategory} disabled={!catName.trim()}>
                  {editingCat ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sub-Category Dialog */}
      <Dialog open={subDialogOpen} onOpenChange={(open) => { setSubDialogOpen(open); if (!open) resetSubForm(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingSubId ? "Edit Sub-Category" : "Add Sub-Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Sub-Category Name</Label>
              <Input value={subName} onChange={(e) => setSubName(e.target.value)} placeholder="e.g. Smart Ovens" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Description</Label>
              <Textarea value={subDesc} onChange={(e) => setSubDesc(e.target.value)} placeholder="Short description..." rows={2} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Image</Label>
              <input type="file" ref={subImageRef} accept="image/*" className="hidden" onChange={handleSubImage} />
              {subImage ? (
                <div className="relative w-32 h-32 group">
                  <img src={subImage} alt="Sub-category" className="w-full h-full object-cover rounded-lg border border-border" />
                  <button onClick={() => setSubImage(null)} className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button onClick={() => subImageRef.current?.click()} className="w-32 h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer">
                  <ImagePlus className="w-6 h-6" />
                  <span className="text-[10px] font-medium">Upload</span>
                </button>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setSubDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveSubCategory} disabled={!subName.trim()}>
                {editingSubId ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Categories List */}
      {categories.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Layers className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No categories yet</p>
            <p className="text-sm">Click "Add Category" to get started</p>
          </CardContent>
        </Card>
      ) : (
        <Accordion type="multiple" className="space-y-3">
          {categories.map((cat) => (
            <AccordionItem key={cat._id} value={cat._id} className="border border-border rounded-lg overflow-hidden bg-card">
              <AccordionTrigger className="px-5 py-4 hover:no-underline">
                <div className="flex items-center gap-4 flex-1 text-left">
                  <img src={cat.image || "/placeholder.svg"} alt={getEnText(cat.name)} className="w-12 h-12 rounded-lg object-cover border border-border flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm">{getEnText(cat.name)}</h3>
                      <Badge variant="secondary" className="text-[10px]">
                        {cat.subCategories?.length || 0} sub
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{getEnText(cat.description)}</p>
                  </div>
                  <div className="flex items-center gap-1 mr-2" onClick={(e) => e.stopPropagation()}>
                    <div role="button" className="h-8 w-8 text-muted-foreground hover:text-primary flex items-center justify-center cursor-pointer" onClick={(e) => { e.stopPropagation(); handleEditCategory(cat); }}>
                      <Pencil className="w-3.5 h-3.5" />
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <div role="button" className="h-8 w-8 text-muted-foreground hover:text-destructive flex items-center justify-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </div>
                      </AlertDialogTrigger>
                      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete "{getEnText(cat.name)}"?</AlertDialogTitle>
                          <AlertDialogDescription>This will also delete all sub-categories. This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteCategory(cat._id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-4">
                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sub-Categories</p>
                    <Button variant="outline" size="sm" className="gap-1.5 h-7 text-xs" onClick={() => openAddSub(cat._id)}>
                      <Plus className="w-3 h-3" /> Add Sub-Category
                    </Button>
                  </div>
                  {cat.subCategories?.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">No sub-categories yet</p>
                  ) : (
                    <div className="grid gap-2">
                      {cat.subCategories?.map((sub) => (
                        <div key={sub._id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border/50">
                          <img src={sub.image || "/placeholder.svg"} alt={getEnText(sub.name)} className="w-10 h-10 rounded-md object-cover border border-border flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{getEnText(sub.name)}</p>
                            <p className="text-xs text-muted-foreground truncate">{getEnText(sub.description)}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <div role="button" className="h-8 w-8 text-muted-foreground hover:text-primary flex items-center justify-center cursor-pointer" onClick={() => handleEditSubCategory(cat._id, sub)}>
                              <Pencil className="w-3 h-3" />
                            </div>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <div role="button" className="h-8 w-8 text-muted-foreground hover:text-destructive flex items-center justify-center cursor-pointer">
                                  <Trash2 className="w-3 h-3" />
                                </div>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete "{getEnText(sub.name)}"?</AlertDialogTitle>
                                  <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteSubCategory(cat._id, sub._id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default AdminCategories;