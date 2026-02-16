"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Building2, 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2, 
  AlertCircle,
  ImageIcon
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

interface Industry {
  _id: string;
  name: string;
  description: string;
  image: string;
}

const AdminIndustries = () => {
  const { toast } = useToast();
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  
  const fetchIndustries = async () => {
    try {
      const res = await fetch("/api/admin/industries", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setIndustries(data);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to load industries.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndustries();
  }, []);


  const handleDelete = async (id: string) => {
    try {
      setDeleteLoading(id);
      const res = await fetch(`/api/admin/industries/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setIndustries((prev) => prev.filter((item) => item._id !== id));
      
      toast({
        title: "Success",
        description: "Industry deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not delete industry.",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(null);
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
          <h1 className="text-2xl font-bold text-gray-900">Industries</h1>
          <p className="text-gray-500 text-sm mt-1">Manage industry sectors and content</p>
        </div>
        <Link href="/admin/industries/add">
          <Button className="gap-2 bg-primary font-bold hover:bg-primary/90 text-white">
            <Plus className="w-4 h-4 font-bold" /> Add New
          </Button>
        </Link>
      </div>

      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle className="text-base font-semibold flex items-center gap-2 text-gray-800">
            <Building2 className="w-4 h-4 text-primary" /> All Industries ({industries.length})
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          {industries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-gray-100 p-3 rounded-full mb-3">
                <AlertCircle className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No industries found.</p>
              <p className="text-xs text-gray-400 mt-1">Add a new industry to show on the website.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-b border-gray-100/30">
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Industry Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {industries.map((item) => (
                  <TableRow key={item._id} className="hover:bg-gray-50/50 border-b border-gray-100/20">
                    <TableCell>
                      <div className="h-12 w-12 rounded-md border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-gray-300" />
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <span className="font-semibold text-gray-900">{item.name}</span>
                    </TableCell>
                    
                    <TableCell className="text-gray-500 text-sm max-w-[250px] truncate">
                      {item.description}
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/industries/edit/${item._id}`}>
                          <Button size="sm" className="h-8 gap-1.5 bg-primary hover:bg-primary/90 text-white border-none shadow-sm">
                            <Pencil className="w-3.5 h-3.5" /> 
                            <span className="sr-only sm:not-sr-only">Edit</span>
                          </Button>
                        </Link>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 gap-1.5 border-red-100 text-red-500 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                              disabled={deleteLoading === item._id}
                            >
                              {deleteLoading === item._id ? (
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
                                This will permanently delete <strong>{item.name}</strong>. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(item._id)} 
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                Delete
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

export default AdminIndustries;