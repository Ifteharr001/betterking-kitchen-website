"use client";

import { Package, FileText, ShoppingCart, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockProducts = [
  { id: "1", name: "Oven X200", status: "active", price: 50000 },
  { id: "2", name: "Mixer Pro", status: "active", price: 25000 },
  { id: "3", name: "Fridge Z1", status: "draft", price: 80000 },
  { id: "4", name: "Grill Master", status: "active", price: 45000 },
  { id: "5", name: "Blender 3000", status: "active", price: 12000 },
  { id: "6", name: "Coffee Maker", status: "active", price: 35000 },
];

const mockQuotes = [
  { id: "q1", customerName: "Rahim Store", productName: "Oven X200", status: "pending", date: "2024-02-10" },
  { id: "q2", customerName: "Karim Kitchen", productName: "Mixer Pro", status: "approved", date: "2024-02-09" },
  { id: "q3", customerName: "Dhaka Hotel", productName: "Fridge Z1", status: "rejected", date: "2024-02-08" },
  { id: "q4", customerName: "Cafe BD", productName: "Grill Master", status: "pending", date: "2024-02-07" },
  { id: "q5", customerName: "Foodies", productName: "Blender 3000", status: "reviewed", date: "2024-02-06" },
];

const mockOrders = [
  { id: "#ORD-001", customerName: "Sultan's Dine", total: 120000, status: "processing", paymentStatus: "paid" },
  { id: "#ORD-002", customerName: "Kacchi Bhai", total: 45000, status: "delivered", paymentStatus: "paid" },
  { id: "#ORD-003", customerName: "Star Kabab", total: 85000, status: "shipped", paymentStatus: "pending" },
  { id: "#ORD-004", customerName: "Chillox", total: 15000, status: "cancelled", paymentStatus: "failed" },
  { id: "#ORD-005", customerName: "Takeout", total: 32000, status: "processing", paymentStatus: "paid" },
];


const AdminDashboard = () => {
  const totalProducts = mockProducts.length;
  const activeProducts = mockProducts.filter((p) => p.status === "active").length;
  
  const totalQuotes = mockQuotes.length;
  const pendingQuotes = mockQuotes.filter((q) => q.status === "pending").length;
  
  const totalOrders = mockOrders.length;
  const totalRevenue = mockOrders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { 
      title: "Total Products", 
      value: totalProducts, 
      sub: `${activeProducts} active`, 
      icon: Package, 
      color: "bg-blue-100 text-blue-600" 
    },
    { 
      title: "Total Quotes", 
      value: totalQuotes, 
      sub: `${pendingQuotes} pending`, 
      icon: FileText, 
      color: "bg-amber-100 text-amber-600" 
    },
    { 
      title: "Total Orders", 
      value: totalOrders, 
      sub: `${mockOrders.filter((o) => o.status === "processing").length} processing`, 
      icon: ShoppingCart, 
      color: "bg-green-100 text-green-600" 
    },
    { 
      title: "Revenue", 
      value: `৳${(totalRevenue / 1000).toFixed(0)}K`, 
      sub: "Paid orders", 
      icon: DollarSign, 
      color: "bg-purple-100 text-purple-600" 
    },
  ];

  const recentQuotes = mockQuotes.slice(0, 4);
  const recentOrders = mockOrders.slice(0, 4);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's your overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.color}`}>
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
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-4 border-b border-gray-100">
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> 
              Recent Quotes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {recentQuotes.map((q) => (
              <div key={q.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{q.customerName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{q.productName}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${
                  q.status === "pending" ? "bg-amber-100 text-amber-700" :
                  q.status === "approved" ? "bg-green-100 text-green-700" :
                  q.status === "reviewed" ? "bg-blue-100 text-blue-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {q.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Orders Card */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-4 border-b border-gray-100">
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary" /> 
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {recentOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{o.customerName}</p>
                  <p className="text-xs text-gray-500 mt-0.5 font-mono">
                    {o.id} • ৳{o.total.toLocaleString()}
                  </p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${
                  o.status === "delivered" ? "bg-green-100 text-green-700" :
                  o.status === "shipped" || o.status === "in-transit" ? "bg-blue-100 text-blue-700" :
                  o.status === "processing" ? "bg-amber-100 text-amber-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {o.status.replace("-", " ")}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;