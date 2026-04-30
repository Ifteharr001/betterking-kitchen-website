"use client";

import Link from "next/link";
import Image from "next/image"; 
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { 
  LayoutDashboard, 
  Package, 
  PackagePlus, 
  FileText, 
  ShoppingCart, 
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  ChefHat, 
  User, 
  FolderOpen,
  MessageSquare,
  NewspaperIcon
} from "lucide-react";

import { cn } from "@/lib/utils";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

const navItems = [
  { title: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Categories", path: "/admin/categories", icon: FolderOpen },
  { title: "Products", path: "/admin/products", icon: Package },
  { title: "Add Product", path: "/admin/products/add", icon: PackagePlus },
  { title: "Quotes", path: "/admin/quotes", icon: FileText },
  { title: "Orders", path: "/admin/orders", icon: ShoppingCart },
  { title: "Industries & Projects", path: "/admin/industries", icon: ChefHat },
  { title: "News & Blog", path: "/admin/news", icon: NewspaperIcon },
  { title: "Messages", path: "/admin/messages", icon: MessageSquare },
];

interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

const AdminSidebar = ({ collapsed, setCollapsed }: AdminSidebarProps) => {
  const pathname = usePathname();
  const { data: session } = useSession(); 

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-20 flex flex-col bg-card border-r border-border transition-all duration-300",
          collapsed ? "w-[72px]" : "w-64"
        )}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-7 z-50 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        <div className={cn("border-b border-border flex items-center transition-all duration-300 h-[70px]", collapsed ? "justify-center" : "px-6")}>
          <div className={cn("relative transition-all duration-300", collapsed ? "w-10 h-8" : "w-32 h-10")}>
            <Image 
              src="/white-logo.webp" 
              alt="BetterKing Admin" 
              fill
              className={cn("object-contain", collapsed ? "object-center" : "object-left")}
              priority
            />
          </div>
        </div>

        <nav className={cn("flex-1 space-y-1 transition-all duration-300 overflow-y-auto", collapsed ? "px-2 py-4" : "p-4")}>
          <p className={cn("text-[10px] uppercase tracking-widest text-muted-foreground mb-3 font-semibold", collapsed ? "text-center" : "px-3")}>
            {collapsed ? "•••" : "Menu"}
          </p>
          
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            
            const linkContent = (
              <Link
                href={item.path}
                prefetch={true}
                className={cn(
                  "flex items-center rounded-lg text-sm font-medium transition-all duration-200 group",
                  collapsed ? "justify-center p-3" : "gap-3 px-4 py-2.5",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <item.icon className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-[18px] h-[18px]")} />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.path} delayDuration={0}>
                  <TooltipTrigger asChild>
                    {linkContent}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-card border-border text-foreground ml-2">
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              );
            }
            
            return <div key={item.path}>{linkContent}</div>;
          })}
        </nav>

        <div className={cn("border-t border-border mt-auto", collapsed ? "p-2" : "p-4")}>
          {!collapsed && (
            <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-lg bg-secondary/50 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div className="overflow-hidden min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {session?.user?.name || "Admin"}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {session?.user?.email || "admin@betterking.com"}
                </p>
              </div>
            </div>
          )}

          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                className={cn(
                  "flex items-center rounded-lg text-sm font-medium text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all w-full",
                  collapsed ? "justify-center p-3" : "gap-3 px-4 py-2.5"
                )}
              >
                <LogOut className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-[18px] h-[18px]")} />
                {!collapsed && <span>Logout</span>}
              </button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right" className="bg-card border-border text-foreground ml-2">
                Logout
              </TooltipContent>
            )}
          </Tooltip>

          {!collapsed && (
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-2.5 mt-1 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            >
              <ChevronLeft className="w-[18px] h-[18px]" />
              <span>Back to Site</span>
            </Link>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
};

export default AdminSidebar;