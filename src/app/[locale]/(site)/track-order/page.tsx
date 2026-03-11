"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Package, Truck, CheckCircle, Clock, Download, MapPin, AlertCircle, Info, HelpCircle } from "lucide-react";
import { useTranslations, useLocale } from "next-intl"; 
import Link from "next/link";

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

const TrackOrder = () => {
  const t = useTranslations("TrackOrderPage");
  const locale = useLocale();

  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const statusSteps = [
    { key: "processing", label: t("statusProcessing"), icon: Clock },
    { key: "shipped", label: t("statusShipped"), icon: Package },
    { key: "in-transit", label: t("statusInTransit"), icon: Truck },
    { key: "delivered", label: t("statusDelivered"), icon: CheckCircle },
  ];

  const handleSearch = async () => {
    if (!orderId.trim()) return;

    setIsSearching(true);
    setError("");
    setOrder(null);
    
    try {
      const res = await fetch(`/api/track-order?id=${orderId.trim()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t("errorNotFound"));
      }

      const formattedOrder: OrderDetails = {
        orderId: data.orderId,
        status: data.status,
        date: new Date(data.createdAt).toLocaleDateString(),
        estimatedDelivery: new Date(new Date(data.createdAt).setDate(new Date(data.createdAt).getDate() + 7)).toLocaleDateString(),
        productName: data.productName,
        shippingAddress: data.companyName ? `${data.companyName}, ${data.mobile}` : t("addressProtected"), 
        invoiceUrl: data.invoiceUrl,
        amount: data.amount || 0
      };

      setOrder(formattedOrder);
    } catch (err: any) {
      setError(err.message || t("errorNotFound"));
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
    <div className="min-h-screen bg-gray-900 text-foreground mt-8">
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-100">
              {t("title1")} <span className="text-primary">{t("title2")}</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </div>

          <Card className="max-w-3xl mx-auto mb-12 border border-gray-200 shadow-md">
            <CardContent className="p-4 md:p-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder={t("searchPlaceholder")}
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="pl-12 h-14 text-base border-gray-300 focus:border-primary bg-gray-700"
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <Button 
                  onClick={handleSearch} 
                  className="bg-primary hover:bg-primary/90 text-white h-14 px-8 font-bold text-base"
                  disabled={!orderId.trim() || isSearching}
                >
                  {isSearching ? t("searching") : t("searchBtn")}
                </Button>
              </div>
              
              {error && (
                <div className="flex items-center justify-center gap-2 mt-5 text-red-600 bg-red-50 p-4 rounded-lg border border-red-100">
                  <AlertCircle className="w-5 h-5" />
                  <p className="font-medium">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {!order && !isSearching && !error && (
            <div className="max-w-4xl mx-auto animate-in fade-in duration-700">
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-sm text-center flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-gray-100 mb-2">{t("step1Title")}</h3>
                  <p className="text-sm text-gray-300">{t("step1Desc")}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-sm text-center flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Truck className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-gray-100 mb-2">{t("step2Title")}</h3>
                  <p className="text-sm text-gray-300">{t("step2Desc")}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-sm text-center flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Download className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-gray-100 mb-2">{t("step3Title")}</h3>
                  <p className="text-sm text-gray-300">{t("step3Desc")}</p>
                </div>
              </div>

              <div className="bg-blue-100 border border-blue-100 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                    <HelpCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{t("supportTitle")}</h3>
                    <p className="text-sm text-gray-600">{t("supportDesc")}</p>
                  </div>
                </div>
                <Link href={`/${locale}/contact`}>
                  <Button variant="outline" className="bg-white border-blue-200 text-blue-600 hover:bg-blue-50 whitespace-nowrap">
                    {t("contactSupport")}
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {order && (
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              <Card className="border-gray-100 shadow-md bg-white">
                <CardHeader className="text-gray-800 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900">Order #{order.orderId}</CardTitle>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {t("placedOn")} {order.date}
                      </p>
                    </div>
                    <Button onClick={handleDownloadInvoice} variant="outline" className="gap-2 border-gray-300 text-gray-100 hover:bg-gray-50 hover:text-primary">
                      <Download className="w-4 h-4" />
                      {order.invoiceUrl ? t("downloadInvoice") : t("downloadSummary")}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-8 pb-10">
                 
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
               
                <Card className="border-gray-100 shadow-md bg-white">
                  <CardHeader className="border-b border-gray-50 pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
                      <Package className="w-5 h-5 text-primary" />
                      {t("orderDetails")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start py-3 border-b border-dashed border-gray-200">
                        <div>
                          <p className="font-semibold text-gray-800">{order.productName}</p>
                          <p className="text-sm text-gray-500 mt-1">{t("qty")}: 1</p>
                        </div>
                        <p className="font-bold text-gray-700">
                          {order.amount ? `৳${order.amount.toLocaleString()}` : t("tbd")}
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2">
                        <p className="font-bold text-lg text-gray-700">{t("total")}</p>
                        <p className="font-bold text-xl text-primary">
                          {order.amount ? `৳${order.amount.toLocaleString()}` : t("tbd")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-100 shadow-md bg-white">
                  <CardHeader className="border-b border-gray-50 pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
                      <MapPin className="w-5 h-5 text-primary" />
                      {t("shippingInfo")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5 pt-6">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t("deliveryTo")}</p>
                      <p className="font-medium text-gray-800">{order.shippingAddress}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t("orderDate")}</p>
                        <p className="font-semibold text-gray-900">{order.date}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t("estDelivery")}</p>
                        <p className="font-semibold text-gray-900">{order.estimatedDelivery}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t("currentStatus")}</p>
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