"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Lock, Mail, ChefHat, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
  email,
  password,
  redirect: true, 
  callbackUrl: "/admin/dashboard",
});

      if (result?.error) {
        toast({
          title: "Login Failed",
          description: "Invalid email or password.",
          variant: "destructive",
        });
        setLoading(false);
      } else {
        toast({
          title: "Welcome back!",
          description: "Login successful.",
        });
        router.push("/admin/dashboard");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left - Branding */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-[#0a1628]"
        style={{ 
          background: "linear-gradient(135deg, hsl(216 54% 8%) 0%, hsl(216 52% 15%) 50%, hsl(216 54% 10%) 100%)" 
        }}
      >
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute top-20 left-20 w-72 h-72 rounded-full" 
            style={{ background: "radial-gradient(circle, hsl(43 68% 52% / 0.3), transparent)" }} 
          />
          <div 
            className="absolute bottom-32 right-16 w-96 h-96 rounded-full" 
            style={{ background: "radial-gradient(circle, hsl(43 68% 52% / 0.15), transparent)" }} 
          />
        </div>

        <div className="relative z-10 text-center px-12">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8">
            <ChefHat className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            <span className="text-[#D4AF37]">Better</span>King
          </h1>
          <p className="text-gray-400 text-lg max-w-md mx-auto">
            Commercial Kitchen Equipment — Admin Control Panel
          </p>
          
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-sm mx-auto">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">150+</p>
              <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Products</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">500+</p>
              <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Clients</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">10+</p>
              <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Years</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
              <ChefHat className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              <span className="text-primary">Better</span>King
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-500 text-sm mt-2">Sign in to access the admin panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
         
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@betterking.com"
                  className="pl-10 h-11 border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password"className="text-sm font-medium text-gray-700">Password</Label>
                <a href="#" className="text-xs text-primary hover:underline font-medium">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-11 border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-sm font-bold bg-[#D4AF37] hover:bg-[#b89628] text-black transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In to Dashboard"
              )}
            </Button>
          </form>

         
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;