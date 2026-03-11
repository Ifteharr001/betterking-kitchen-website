"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { 
  FileText, Eye, CheckCircle, XCircle, Building2, Phone, Mail, 
  Briefcase, Calendar, Package, Loader2, Utensils, Users 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface QuoteType {
  _id: string;
  orderId: string;
  name: string;
  email: string;
  mobile: string;
  companyName: string;
  productName: string;
  productImage: string;
  businessType: string;
  hotelStarRating: string;
  kitchenSize: string;
  seatingCapacity: string;
  openingDate: string;
  dailyProduction: string;
  message: string;
  layoutImage?: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

const AdminQuotes = () => {
  const { toast } = useToast();
  const [quotes, setQuotes] = useState<QuoteType[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selected, setSelected] = useState<QuoteType | null>(null);

  // ১. সব কোট ফেচ করা
  const fetchQuotes = async () => {
    try {
      const res = await fetch("/api/admin/quotes", { cache: "no-store" });
      const data = await res.json();
      setQuotes(data);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleAccept = async (quote: QuoteType) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/quotes/${quote._id}/accept`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Failed to accept quote");

      toast({
        title: "Success",
        description: "Quote accepted and moved to Orders.",
      });

      setQuotes((prev) => prev.map(q => q._id === quote._id ? { ...q, status: "accepted" } : q));
      setSelected(null); 
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // ৩. অর্ডার রিজেক্ট করা
  const handleReject = async (id: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/quotes/${id}/reject`, {
        method: "PUT",
      });

      if (!res.ok) throw new Error("Failed to reject");

      toast({
        title: "Rejected",
        description: "Quote request has been rejected.",
      });

      setQuotes((prev) => prev.map(q => q._id === id ? { ...q, status: "rejected" } : q));
      setSelected(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject quote.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
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
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Quote Requests</h1>
        <p className="text-muted-foreground text-sm mt-1">View and manage customer quote requests</p>
      </div>

      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="pb-3 border-b border-gray-100/50">
          <CardTitle className="text-base font-semibold flex items-center gap-2 text-gray-800">
            <FileText className="w-4 h-4 text-primary" /> All Quotes ({quotes.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                <TableHead>Tracking ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotes.map((q) => (
                <TableRow key={q._id} className="hover:bg-gray-50/50 border-b border-gray-100/50">
                  <TableCell className="text-gray-500 text-xs font-mono">{q.orderId}</TableCell>
                  <TableCell>
                    <p className="font-bold text-sm text-gray-900">{q.name}</p>
                    <p className="text-xs text-gray-500">{q.email}</p>
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm">{q.companyName || "N/A"}</TableCell>
                  <TableCell className="font-medium text-gray-800">{q.productName}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                      q.status === 'accepted' ? 'bg-green-100 text-green-700' :
                      q.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {q.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-400 text-xs">
                    {new Date(q.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1.5 border-gray-200 text-white hover:text-primary hover:border-primary/30" 
                      onClick={() => setSelected(q)}
                    >
                      <Eye className="w-3.5 h-3.5" /> View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quote Detail Modal */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-2xl bg-white p-0 overflow-hidden">
          {selected && (
            <>
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100/40">
                <DialogHeader>
                  <DialogTitle className="text-lg font-bold flex justify-between items-center text-gray-900">
                    <span>Quote Details</span>
                    <span className="text-sm font-mono font-normal text-gray-500">#{selected.orderId}</span>
                  </DialogTitle>
                  <DialogDescription className="text-xs text-gray-400">
                    Submitted on {new Date(selected.createdAt).toLocaleString()}
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Product Info */}
                <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center p-2">
                     <Image 
                        src={selected.productImage || "/placeholder.png"} 
                        alt={selected.productName} 
                        width={60} 
                        height={60} 
                        className="object-contain"
                     />
                  </div>
                  <div>
                    <p className="text-xs text-primary font-bold uppercase tracking-wider">Product Interest</p>
                    <h3 className="font-bold text-gray-900 text-lg">{selected.productName}</h3>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoRow icon={<Building2 className="w-4 h-4" />} label="Company" value={selected.companyName} />
                  <InfoRow icon={<Briefcase className="w-4 h-4" />} label="Business Type" value={selected.businessType} />
                  <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={selected.email} />
                  <InfoRow icon={<Phone className="w-4 h-4" />} label="Mobile" value={selected.mobile} />
                  <InfoRow icon={<Utensils className="w-4 h-4" />} label="Kitchen Size" value={selected.kitchenSize} />
                  <InfoRow icon={<Users className="w-4 h-4" />} label="Seating" value={selected.seatingCapacity} />
                  <InfoRow icon={<Calendar className="w-4 h-4" />} label="Opening Date" value={selected.openingDate} />
                  <InfoRow icon={<Package className="w-4 h-4" />} label="Daily Production" value={selected.dailyProduction} />
                </div>

                {/* Message */}
                {selected.message && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Additional Message</p>
                    <p className="text-sm text-gray-700">{selected.message}</p>
                  </div>
                )}

                {selected.layoutImage && (
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Attached Layout</p>
                    <div className="relative h-48 w-full rounded-lg overflow-hidden border border-gray-200">
                      <Image 
                        src={selected.layoutImage} 
                        alt="Layout" 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <a href={selected.layoutImage} target="_blank" className="text-xs text-primary hover:underline mt-1 block">
                      View Full Image
                    </a>
                  </div>
                )}

                {/* Actions */}
                {selected.status === "pending" && (
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <Button 
                      className="flex-1 gap-2 bg-green-600 hover:bg-green-700 text-white" 
                      onClick={() => handleAccept(selected)}
                      disabled={actionLoading}
                    >
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                      Accept & Move to Order
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 gap-2 text-red-600 border-red-200 hover:bg-red-50" 
                      onClick={() => handleReject(selected._id)}
                      disabled={actionLoading}
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </Button>
                  </div>
                )}

                {selected.status === "accepted" && (
                  <div className="p-3 bg-green-50 text-green-700 border border-green-100 rounded-lg flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold text-sm">Quote Accepted. Visit Orders page to manage.</span>
                  </div>
                )}

                {selected.status === "rejected" && (
                  <div className="p-3 bg-red-50 text-red-700 border border-red-100 rounded-lg flex items-center justify-center gap-2">
                    <XCircle className="w-5 h-5" />
                    <span className="font-semibold text-sm">This quote request was rejected.</span>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-3 p-3 rounded-lg bg-white border border-gray-100">
    <div className="p-2 rounded-full bg-gray-50 text-primary">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{label}</p>
      <p className="text-sm font-semibold text-gray-800 truncate">{value || "N/A"}</p>
    </div>
  </div>
);

export default AdminQuotes;