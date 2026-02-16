"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Package, Truck, CheckCircle, Clock, Download, MapPin, AlertCircle } from "lucide-react";

interface OrderDetails {
  orderId: string;
  status: "pending" | "processing" | "shipped" | "in-transit" | "delivered" | "cancelled";
  date: string; 
  estimatedDelivery?: string;
  productName: string; 
  shippingAddress?: string; 
  invoiceUrl?: string; 
  amount?: number;
}

const statusSteps = [
  { key: "processing", label: "Processing", icon: Clock },
  { key: "shipped", label: "Shipped", icon: Package },
  { key: "in-transit", label: "In Transit", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
];

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!orderId.trim()) return;

    setIsSearching(true);
    setError("");
    setOrder(null);
    
    try {
      const res = await fetch(`/api/track-order?id=${orderId.trim()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Order not found");
      }

      const formattedOrder: OrderDetails = {
        orderId: data.orderId,
        status: data.status,
        date: new Date(data.createdAt).toLocaleDateString(),
       
        estimatedDelivery: new Date(new Date(data.createdAt).setDate(new Date(data.createdAt).getDate() + 7)).toLocaleDateString(),
        productName: data.productName,
        shippingAddress: data.companyName ? `${data.companyName}, ${data.mobile}` : "Address details protected", // সিম্পল এড্রেস লজিক
        invoiceUrl: data.invoiceUrl,
        amount: data.amount || 0
      };

      setOrder(formattedOrder);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check your Order ID.");
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusIndex = (status: string) => {
    if (status === "pending") return 0;
    return statusSteps.findIndex((step) => step.key === status);
  };

  const handleDownloadInvoice = () => {
    if (!order) return;
    
    if (order.invoiceUrl) {
      window.open(order.invoiceUrl, "_blank");
      return;
    }
    
    const invoiceContent = `
BETTERKING - ORDER SUMMARY
================================
Order ID: ${order.orderId}
Order Date: ${order.date}
Status: ${order.status.toUpperCase()}

PRODUCT:
${order.productName}

--------------------------------
TOTAL AMOUNT: ${order.amount ? `৳${order.amount.toLocaleString()}` : "TBD"}

Note: This is a system generated summary. 
For official tax invoice, please contact support.
================================
    `;
    
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `summary-${order.orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
   
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-primary">Track Your Order</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enter your Order ID to track your shipment status and download your invoice
            </p>
          </div>

          {/* Search Section */}
          <Card className="max-w-2xl mx-auto mb-12 border-2 border-gray-100 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter Order ID (e.g., QT-7823)"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="pl-10 h-12 text-base border-gray-200 focus:border-primary"
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <Button 
                  onClick={handleSearch} 
                  className="bg-primary hover:bg-primary/90 text-white h-12 px-8 font-bold"
                  disabled={!orderId.trim() || isSearching}
                >
                  {isSearching ? "Searching..." : "Track Order"}
                </Button>
              </div>
              
              {error && (
                <div className="flex items-center justify-center gap-2 mt-4 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  <p>{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Details */}
          {order && (
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Status Timeline */}
              <Card className="border-gray-100 shadow-md">
                <CardHeader className="text-gray-800 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl font-bold text-white">Order #{order.orderId}</CardTitle>
                      <p className="text-muted-foreground mt-1 text-sm">
                        Placed on {order.date}
                      </p>
                    </div>
                    <Button onClick={handleDownloadInvoice} variant="outline" className="gap-2 border-gray-300 text-white hover:bg-white hover:text-primary">
                      <Download className="w-4 h-4" />
                      {order.invoiceUrl ? "Download Invoice" : "Download Summary"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-8 pb-10">
                  {/* Progress Steps */}
                  <div className="relative px-4">
                    <div className="flex justify-between items-center relative z-10">
                      {statusSteps.map((step, index) => {
                        const currentIndex = getStatusIndex(order.status);
                        const isCompleted = index <= currentIndex;
                        const isCurrent = index === currentIndex;
                        const Icon = step.icon;
                        
                        return (
                          <div key={step.key} className="flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                              isCompleted 
                                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                                : "bg-gray-100 text-gray-400"
                            } ${isCurrent ? "ring-4 ring-primary/20 scale-110" : ""}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className={`mt-3 text-xs sm:text-sm font-semibold text-center transition-colors ${
                              isCompleted ? "text-primary" : "text-gray-400"
                            }`}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="absolute top-6 left-4 right-4 h-1 bg-gray-100 -z-0 rounded-full" />
                    
                    <div 
                      className="absolute top-6 left-4 h-1 bg-primary transition-all duration-1000 ease-out -z-0 rounded-full"
                      style={{ 
                        width: `calc(${(getStatusIndex(order.status) / (statusSteps.length - 1)) * 100}% - 2rem)` 
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
        
                <Card className="border-gray-100 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Package className="w-5 h-5 text-primary" />
                      Order Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-start py-3 border-b border-dashed border-gray-200">
                        <div>
                          <p className="font-semibold text-gray-100">{order.productName}</p>
                          <p className="text-sm text-gray-500 mt-1">Quantity: 1</p>
                        </div>
                        <p className="font-bold text-gray-500">
                          {order.amount ? `৳${order.amount.toLocaleString()}` : "TBD"}
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2">
                        <p className="font-bold text-lg text-gray-700">Total</p>
                        <p className="font-bold text-xl text-primary">
                          {order.amount ? `৳${order.amount.toLocaleString()}` : "TBD"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-100 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MapPin className="w-5 h-5 text-primary" />
                      Shipping Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Delivery To</p>
                      <p className="font-medium text-gray-100">{order.shippingAddress}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Order Date</p>
                        <p className="font-semibold text-gray-900">{order.date}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Est. Delivery</p>
                        <p className="font-semibold text-gray-900">{order.estimatedDelivery}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Current Status</p>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold capitalize ${
                        order.status === "delivered" 
                          ? "bg-green-100 text-green-700" 
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-50 text-blue-700"
                      }`}>
                        {order.status === "delivered" && <CheckCircle className="w-4 h-4" />}
                        {order.status === "in-transit" && <Truck className="w-4 h-4" />}
                        {order.status === "processing" && <Clock className="w-4 h-4" />}
                        {order.status === "shipped" && <Package className="w-4 h-4" />}
                        {order.status.replace("-", " ")}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

    </div>
  );
};

export default TrackOrder;