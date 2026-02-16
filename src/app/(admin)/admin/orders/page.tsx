"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { 
  ShoppingCart, Eye, Upload, FileCheck, Package, Calendar, 
  CreditCard, Loader2, Building2, Utensils 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OrderType {
  _id: string;
  orderId: string;
  customerName: string;
  email: string;
  productName: string;
  total: number; 
  status: "pending" | "processing" | "shipped" | "in-transit" | "delivered" | "cancelled";
  paymentStatus: "paid" | "pending" | "refunded";
  date: string; 
  invoiceUrl?: string;
  details?: {
    businessType?: string;
    kitchenSize?: string;
    message?: string;
  };
}

const statusColors: Record<string, string> = {
  processing: "bg-amber-100 text-amber-700",
  shipped: "bg-blue-100 text-blue-700",
  "in-transit": "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  pending: "bg-gray-100 text-gray-700",
};

const paymentColors: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  refunded: "bg-red-100 text-red-700",
};

const allStatuses = ["pending", "processing", "shipped", "in-transit", "delivered", "cancelled"];

const AdminOrders = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<OrderType | null>(null);
  const [uploading, setUploading] = useState<string | null>(null); 
  const invoiceRef = useRef<HTMLInputElement>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      const data = await res.json();
      
   
      const mappedOrders = data.map((o: any) => ({
        ...o,
        id: o.orderId, 
        total: o.amount || 0,
        date: new Date(o.createdAt).toLocaleDateString(),
        products: [o.productName], 
        paymentStatus: o.paymentStatus || "pending"
      }));
      
      setOrders(mappedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ২. স্ট্যাটাস আপডেট
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    // অপটিমিস্টিক আপডেট (UI আগে আপডেট হবে)
    setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, status: newStatus as any } : o));
    if (selected && selected.orderId === orderId) {
      setSelected(prev => prev ? { ...prev, status: newStatus as any } : null);
    }

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Update failed");
      
      toast({ title: "Status Updated", description: `Order ${orderId} is now ${newStatus}.` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status on server.", variant: "destructive" });
      fetchOrders(); // রিভার্ট করার জন্য আবার ফেচ
    }
  };

  // ৩. ইনভয়েস আপলোড
  const handleInvoiceUpload = async (orderId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(orderId);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/invoice`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const newUrl = data.url;
      setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, invoiceUrl: newUrl } : o));
      
     
      if (selected && selected.orderId === orderId) {
        setSelected(prev => prev ? { ...prev, invoiceUrl: newUrl } : null);
      }

      toast({ title: "Success", description: "Invoice uploaded successfully." });

    } catch (error: any) {
      toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
    } finally {
      setUploading(null);
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
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Orders</h1>
        <p className="text-muted-foreground text-sm mt-1">Track and manage customer orders</p>
      </div>

      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle className="text-base font-semibold flex items-center gap-2 text-gray-800">
            <ShoppingCart className="w-4 h-4 text-primary" /> All Orders ({orders.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-b border-gray-100/30">
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o._id} className="hover:bg-gray-50/50 border-b border-gray-100/20">
                  <TableCell className="font-bold text-sm text-gray-900">{o.orderId}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{o.customerName}</span>
                      <span className="text-[10px] text-gray-500">{o.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs max-w-[150px] truncate" title={o.productName}>
                    {o.productName}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    {o.total > 0 ? `৳${o.total.toLocaleString()}` : <span className="text-muted-foreground text-xs">TBD</span>}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">{o.date}</TableCell>
                  <TableCell>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${paymentColors[o.paymentStatus] || "bg-gray-100 text-gray-600"}`}>
                      {o.paymentStatus}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={o.status}
                      onValueChange={(val) => updateOrderStatus(o.orderId, val)}
                    >
                      <SelectTrigger className={`h-7 text-[10px] font-bold uppercase w-[110px] border-0 focus:ring-0 ${statusColors[o.status] || "bg-gray-100"}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border z-50">
                        {allStatuses.map((s) => (
                          <SelectItem key={s} value={s} className="text-xs capitalize">{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1.5 border-gray-200 text-white hover:text-white hover:border-primary/30" 
                      onClick={() => setSelected(o)}
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Detail Modal */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-lg bg-white p-0 overflow-hidden">
          {selected && (
            <>
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                <DialogHeader>
                  <DialogTitle className="text-lg font-bold text-gray-900">Order Details</DialogTitle>
                  <DialogDescription className="text-xs text-gray-500">
                    ID: <span className="font-mono text-gray-700 font-medium">#{selected.orderId}</span> • Placed on {selected.date}
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="p-6 space-y-5">
                {/* Info grid */}
                <div className="grid grid-cols-2 gap-3">
                  <InfoRow icon={<Package className="w-4 h-4" />} label="Customer" value={selected.customerName} />
                  <InfoRow icon={<Calendar className="w-4 h-4" />} label="Date" value={selected.date} />
                  <InfoRow icon={<CreditCard className="w-4 h-4" />} label="Total Amount" value={selected.total > 0 ? `৳${selected.total.toLocaleString()}` : "To Be Decided"} />
                  <InfoRow icon={<CreditCard className="w-4 h-4" />} label="Payment Status" value={selected.paymentStatus} />
                </div>

                {/* Additional Details (from Quote) */}
                {selected.details && (
                  <div className="grid grid-cols-2 gap-3">
                    <InfoRow icon={<Building2 className="w-4 h-4" />} label="Business Type" value={selected.details.businessType || "N/A"} />
                    <InfoRow icon={<Utensils className="w-4 h-4" />} label="Kitchen Size" value={selected.details.kitchenSize || "N/A"} />
                  </div>
                )}

                {/* Product Info */}
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-2">Product Ordered</p>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-sm font-medium text-gray-900">{selected.productName}</span>
                  </div>
                  {selected.details?.message && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500 italic">"{selected.details.message}"</p>
                    </div>
                  )}
                </div>

                {/* Status Control in Modal */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50/50 border border-blue-100">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-blue-600 font-bold">Current Status</p>
                    <span className={`text-xs px-2.5 py-1 text-black rounded-full font-bold capitalize inline-block mt-1 ${statusColors[selected.status] || ""}`}>
                      {selected.status}
                    </span>
                  </div>
                  <Select
                    value={selected.status}
                    onValueChange={(val) => updateOrderStatus(selected.orderId, val)}
                  >
                    <SelectTrigger className="h-8 text-xs w-[140px] bg-white border-blue-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border z-50">
                      {allStatuses.map((s) => (
                        <SelectItem key={s} value={s} className="text-xs capitalize">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Invoice Section */}
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-3">Invoice Management</p>
                  
                  <input
                    type="file"
                    ref={invoiceRef}
                    accept=".pdf,.jpg,.png,.jpeg"
                    className="hidden"
                    onChange={(e) => handleInvoiceUpload(selected.orderId, e)}
                  />
                  
                  <div className="flex items-center gap-3">
                    {uploading === selected.orderId ? (
                      <Button disabled variant="outline" size="sm" className="gap-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...
                      </Button>
                    ) : selected.invoiceUrl ? (
                      <>
                        <div className="flex items-center gap-2 text-sm text-green-600 font-medium bg-green-50 px-3 py-1.5 rounded-md border border-green-100">
                          <FileCheck className="w-4 h-4" /> Invoice Available
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => invoiceRef.current?.click()}>
                            Replace
                          </Button>
                          <Button variant="default" size="sm" asChild className="bg-primary hover:bg-primary/90 text-white">
                            <a href={selected.invoiceUrl} target="_blank" rel="noopener noreferrer">Download / View</a>
                          </Button>
                        </div>
                      </>
                    ) : (
                      <Button variant="outline" size="sm" className="gap-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 hover:text-primary transition-colors w-full justify-start text-gray-500" onClick={() => invoiceRef.current?.click()}>
                        <Upload className="w-4 h-4" /> Click to Upload Invoice (PDF/Image)
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-3 p-3 rounded-lg bg-white border border-gray-100 shadow-sm">
    <div className="text-primary mt-0.5 p-1.5 bg-primary/10 rounded-md">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{label}</p>
      <p className="text-sm font-semibold text-gray-800 truncate" title={value}>{value}</p>
    </div>
  </div>
);

export default AdminOrders;