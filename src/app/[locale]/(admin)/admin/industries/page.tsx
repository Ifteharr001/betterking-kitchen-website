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
import { useLocale } from "next-intl";

interface Industry {
  _id: string;
  name: any;
  description: any;
  image: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const getEnText = (val: any) => {
  if (!val) return "";
  if (typeof val === 'string') return val;
  return val.en || "";
};

const AdminIndustries = () => {
  const { toast } = useToast();
  const locale = useLocale();
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  
  const fetchIndustries = async (page: number = 1, search: string = "") => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '10');
      if (search) params.set('search', search);

      const res = await fetch(`/api/admin/industries?${params}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setIndustries(data.industries || []);
      setPagination(data.pagination);
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
    fetchIndustries(currentPage, searchQuery);
  }, [currentPage]);


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchIndustries(1, searchQuery);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
        <Link href={`/${locale}/admin/industries/add`}>
          <Button className="gap-2 bg-primary font-bold hover:bg-primary/90 text-white">
            <Plus className="w-4 h-4 font-bold" /> Add New
          </Button>
        </Link>
      </div>

      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle className="text-base font-semibold flex items-center gap-2 text-gray-800">
            <Building2 className="w-4 h-4 text-primary" /> All Industries ({pagination?.totalItems || 0})
          </CardTitle>
        </CardHeader>
        
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search industries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Button type="submit" variant="outline" size="sm">
              Search
            </Button>
          </form>
        </div>
        
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
                            alt={getEnText(item.name)} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-gray-300" />
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <span className="font-semibold text-gray-900">{getEnText(item.name)}</span>
                    </TableCell>
                    
                    <TableCell className="text-gray-500 text-sm max-w-[250px] truncate">
                      {getEnText(item.description)}
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/${locale}/admin/industries/edit/${item._id}`}>
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
                                This will permanently delete <strong>{getEnText(item.name)}</strong>. This action cannot be undone.
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

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} industries
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrev}
                  >
                    Previous
                  </Button>

                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(pagination.totalPages - 4, pagination.currentPage - 2)) + i;
                    if (pageNum > pagination.totalPages) return null;

                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === pagination.currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNext}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminIndustries;