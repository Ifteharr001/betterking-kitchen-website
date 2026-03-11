"use client";

import { useEffect, useState } from "react";
import { Package, FileText, ShoppingCart, Loader2, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalQuotes: number;
  pendingQuotes: number;
  totalOrders: number;
  processingOrders: number;
}

interface Quote {
  _id: string;
  fullName: string; 
  email: string;
  subject: string;
  status: string;
  createdAt: string;
}

interface Order {
  _id: string;
  orderId: string;
  customerName: string;
  total: number;
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
  });
  
  const [recentQuotes, setRecentQuotes] = useState<Quote[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  const fetchDashboardData = async () => {
    try {
      const [prodRes, orderRes, contactRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/orders").catch(() => ({ json: () => [] })),
        fetch("/api/contact") 
      ]);

      const products = await prodRes.json();
      const orders = await (orderRes as any).json();
      const contacts = await contactRes.json();

      const activeProds = Array.isArray(products) ? products.length : 0; 
      const processingOrds = Array.isArray(orders) ? orders.filter((o: any) => o.status === "processing").length : 0;
      
      const totalContacts = Array.isArray(contacts) ? contacts.length : 0;
      const pendingContacts = Array.isArray(contacts) ? contacts.filter((c: any) => c.status === "unread").length : 0;
      
      setStats({
        totalProducts: Array.isArray(products) ? products.length : 0,
        activeProducts: activeProds,
        totalQuotes: totalContacts,
        pendingQuotes: pendingContacts, 
        totalOrders: Array.isArray(orders) ? orders.length : 0,
        processingOrders: processingOrds,
      });

      if (Array.isArray(contacts)) {
        setRecentQuotes(contacts.slice(0, 5));
      }

      if (Array.isArray(orders)) {
        setRecentOrders(orders.slice(0, 5));
      }

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
      title: "Total Inquiries", 
      value: stats.totalQuotes, 
      sub: `${stats.pendingQuotes} new messages`, 
      icon: MessageSquare, 
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="pb-4 border-b border-gray-100 px-6 pt-6">
            <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> 
              Recent Inquiries
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-6">
            {recentQuotes.length > 0 ? (
              recentQuotes.map((q) => (
                <div key={q._id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200 group">
                  <div>
                    <p className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">{q.fullName}</p>
                    <p className="text-xs text-gray-500 mt-0.5 font-medium">
                      {q.subject === "general" ? "General Inquiry" :
                       q.subject === "quote" ? "Request a Quote" :
                       q.subject === "support" ? "Technical Support" :
                       q.subject === "partnership" ? "Partnership" :
                       q.subject === "other" ? "Other" : q.subject || "N/A"}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">{q.email}</p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide ${
                      q.status === "unread" ? "bg-red-100 text-red-700" :
                      q.status === "replied" ? "bg-green-100 text-green-700" :
                      q.status === "read" ? "bg-blue-100 text-blue-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {q.status}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-2">
                      {new Date(q.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 text-sm py-4">No recent inquiries.</p>
            )}
          </CardContent>
        </Card>

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
                      #{o.orderId} 
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