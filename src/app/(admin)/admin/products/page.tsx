"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Package, 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2, 
  AlertCircle 
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string; 
  _id: string; 
  name: string;
  category: string;
  price: number | string;
  image: string;
}

const AdminProducts = () => {
  const router = useRouter();
  const { toast } = useToast();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null); 

 
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      setDeleteLoading(id); 
      
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete product");
      }

      setProducts((prev) => prev.filter((p) => p.id !== id));
      
      toast({
        title: "Success",
        description: "Product deleted successfully.",
      });

    } catch (error: any) {
      console.error("Delete Error:", error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(null); // লোডিং শেষ
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
     
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your product inventory</p>
        </div>
        <Link href="/admin/products/add">
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        </Link>
      </div>

      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle className="text-base font-semibold flex items-center gap-2 text-gray-800">
            <Package className="w-4 h-4 text-primary" /> All Products ({products.length})
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-gray-100 p-3 rounded-full mb-3">
                <AlertCircle className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No products found.</p>
              <p className="text-xs text-gray-400 mt-1">Add a new product to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.id} className="hover:bg-gray-50/50">
               
                    <TableCell>
                      <div className="h-12 w-12 rounded-md border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
                        {p.image ? (
                          <img 
                            src={p.image} 
                            alt={p.name} 
                            className="h-full w-full object-cover"
                            onError={(e) => {
                             
                              (e.target as HTMLImageElement).src = "https://placehold.co/100?text=No+Image";
                            }}
                          />
                        ) : (
                          <Package className="h-6 w-6 text-gray-300" />
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell className="font-semibold text-gray-900">
                      {p.name}
                    </TableCell>
                    
                    <TableCell className="text-gray-500 capitalize">
                      {p.category}
                    </TableCell>
                    
                    <TableCell className="font-medium text-gray-900">
                      ৳{Number(p.price).toLocaleString()}
                    </TableCell>
                    
                    <TableCell className="text-xs text-gray-400 font-mono">
                      {p.id}
                    </TableCell>
                    
                 
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                       
                        <Link href={`/admin/products/edit/${p.id}`}>
                          <Button size="sm" variant="outline" className="h-8 gap-1.5 border-gray-300 hover:bg-gray-100">
                            <Pencil className="w-3.5 h-3.5 text-gray-600" /> 
                            <span className="sr-only sm:not-sr-only">Edit</span>
                          </Button>
                        </Link>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 gap-1.5 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                              disabled={deleteLoading === p.id}
                            >
                              {deleteLoading === p.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                              <span className="sr-only sm:not-sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete <span className="font-bold text-gray-900">"{p.name}"</span> from the database. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(p.id)} 
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                {deleteLoading === p.id ? "Deleting..." : "Yes, Delete Product"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProducts;