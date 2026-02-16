"use client";

import { useEffect, useState } from "react";
import { Package, FileText, ShoppingCart, DollarSign, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalQuotes: number;
  pendingQuotes: number;
  totalOrders: number;
  processingOrders: number;
  revenue: number;
}

interface Quote {
  _id: string;
  name: string; // Customer Name
  productName: string;
  status: string;
}

interface Order {
  _id: string;
  orderId: string;
  customerName: string;
  total: number; // amount
  status: string;
}

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    activeProducts: 0,
    totalQuotes: 0,
    pendingQuotes: 0,
    totalOrders: 0,
    processingOrders: 0,
    revenue: 0,
  });
  const [recentQuotes, setRecentQuotes] = useState<Quote[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  const fetchDashboardData = async () => {
    try {
      const prodRes = await fetch("/api/admin/products");
      const products = await prodRes.json();
      
      
      const quoteRes = await fetch("/api/admin/quotes");
      const quotes = await quoteRes.json();

      const orderRes = await fetch("/api/admin/orders");
      const orders = await orderRes.json();
const activeProds = Array.isArray(products) ? products.length : 0; 
      const pendingQts = Array.isArray(quotes) ? quotes.filter((q: any) => q.status === "pending").length : 0;
      const processingOrds = Array.isArray(orders) ? orders.filter((o: any) => o.status === "processing").length : 0;
      
    
      const totalRev = Array.isArray(orders) 
        ? orders.reduce((sum: number, o: any) => sum + (o.amount || 0), 0) 
        : 0;

      setStats({
        totalProducts: Array.isArray(products) ? products.length : 0,
        activeProducts: activeProds,
        totalQuotes: Array.isArray(quotes) ? quotes.length : 0,
        pendingQuotes: pendingQts,
        totalOrders: Array.isArray(orders) ? orders.length : 0,
        processingOrders: processingOrds,
        revenue: totalRev,
      });

      if (Array.isArray(quotes)) setRecentQuotes(quotes.slice(0, 5));
      if (Array.isArray(orders)) setRecentOrders(orders.slice(0, 5));

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    { 
      title: "Total Products", 
      value: stats.totalProducts, 
      sub: `${stats.activeProducts} items in catalog`, 
      icon: Package, 
      color: "bg-blue-50 text-blue-600",
      iconBg: "bg-blue-100"
    },
    { 
      title: "Total Quotes", 
      value: stats.totalQuotes, 
      sub: `${stats.pendingQuotes} pending review`, 
      icon: FileText, 
      color: "bg-amber-50 text-amber-600",
      iconBg: "bg-amber-100"
    },
    { 
      title: "Total Orders", 
      value: stats.totalOrders, 
      sub: `${stats.processingOrders} in process`, 
      icon: ShoppingCart, 
      color: "bg-green-50 text-green-600",
      iconBg: "bg-green-100"
    },
    { 
      title: "Revenue", 
      value: `৳${(stats.revenue / 1000).toFixed(1)}K`, 
      sub: "Total earnings", 
      icon: DollarSign, 
      color: "bg-purple-50 text-purple-600",
      iconBg: "bg-purple-100"
    },
  ];

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1 font-medium">Overview of your business performance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <Card key={i} className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                  <p className="text-xs text-gray-400 mt-1 font-medium">{stat.sub}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.iconBg} ${stat.color.split(" ")[1]}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Quotes & Orders Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Quotes Card */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="pb-4 border-b border-gray-100 px-6 pt-6">
            <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> 
              Recent Quotes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-6">
            {recentQuotes.length > 0 ? (
              recentQuotes.map((q) => (
                <div key={q._id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200 group">
                  <div>
                    <p className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">{q.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 font-medium">{q.productName}</p>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide ${
                    q.status === "pending" ? "bg-amber-100 text-amber-700" :
                    q.status === "accepted" ? "bg-green-100 text-green-700" :
                    q.status === "reviewed" ? "bg-blue-100 text-blue-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {q.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 text-sm py-4">No quotes found.</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders Card */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="pb-4 border-b border-gray-100 px-6 pt-6">
            <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary" /> 
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-6">
            {recentOrders.length > 0 ? (
              recentOrders.map((o) => (
                <div key={o._id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200 group">
                  <div>
                    <p className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">{o.customerName}</p>
                    <p className="text-xs text-gray-500 mt-0.5 font-mono font-medium">
                      #{o.orderId} • ৳{o.total ? o.total.toLocaleString() : "0"}
                    </p>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide ${
                    o.status === "delivered" ? "bg-green-100 text-green-700" :
                    o.status === "shipped" || o.status === "in-transit" ? "bg-blue-100 text-blue-700" :
                    o.status === "processing" ? "bg-amber-100 text-amber-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {o.status ? o.status.replace("-", " ") : "Pending"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 text-sm py-4">No orders found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;