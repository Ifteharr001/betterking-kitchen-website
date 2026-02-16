"use client";

import { useState } from "react";
import AdminSidebar from "./components/AdminSidebar";
import { Providers } from "@/components/Providers";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);


  return (
    <Providers>
      <div className="flex min-h-screen bg-gray-50 w-full">
      
        <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        
        <main 
          className={`flex-1 p-6 lg:p-8 overflow-auto transition-all duration-300 ${
            collapsed ? "ml-20" : "ml-64" 
          }`}
        >
          
       {children}
    
        </main>
      </div>
      </Providers>
    // </AdminProvider>
  );
}