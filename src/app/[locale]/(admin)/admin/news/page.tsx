"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

export default function NewsAdminPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/admin/news");
      const data = await res.json();
      if (res.ok) {
        setBlogs(data);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    
    try {
      const res = await fetch(`/api/admin/news/${id}`, { 
        method: "DELETE" 
      });
      
      if (res.ok) {
        toast({ title: "Deleted successfully" });
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));
      } else {
        toast({ title: "Error", description: "Failed to delete blog", variant: "destructive" });
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">News & Blogs</h1>
          <p className="text-sm text-gray-500">Manage your articles here.</p>
        </div>
        <Link href="/admin/news/add">
          <Button className="gap-2 bg-primary text-white hover:bg-primary/90">
            <Plus className="w-4 h-4" /> Add New Blog
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-base text-white">
            <FileText className="w-5 h-5 text-primary" /> All Blogs ({blogs.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {blogs.length === 0 ? (
            <div className="py-12 text-center text-gray-500">No blogs found. Start by adding a new one.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-[#101e32]">
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs.map((blog: any) => {
                  const displayTitle = typeof blog.title === 'string' ? blog.title : blog.title?.en || "No Title";
                  const displayCategory = typeof blog.category === 'string' ? blog.category : blog.category?.en || "No Category";

                  return (
                    <TableRow key={blog._id} className="hover:bg-gray-50/50">
                      <TableCell>
                        <img 
                          src={blog.image || "https://placehold.co/100"} 
                          alt={displayTitle} 
                          className="w-12 h-12 object-cover rounded-md border border-gray-200" 
                        />
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-white line-clamp-1">{displayTitle}</span>
                        <span className="text-xs text-gray-400 mt-1 block">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-medium">
                          {displayCategory}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/news/edit/${blog._id}`}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-primary hover:bg-primary/10">
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </Link>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(blog._id)} 
                            className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}