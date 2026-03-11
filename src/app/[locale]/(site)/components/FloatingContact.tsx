"use client"; 

import { useState, useEffect } from "react";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl"; 

const FloatingContact = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false); 
  const { toast } = useToast();
  const t = useTranslations("FloatingContact"); 
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    const handleOpenModal = () => setOpen(true);
    window.addEventListener("openContactModal", handleOpenModal);
    return () => {
      window.removeEventListener("openContactModal", handleOpenModal);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.message) {
      toast({ title: t("toastRequired"), variant: "destructive" });
      return;
    }

    try {
      setLoading(true); 

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      toast({ 
        title: t("toastSuccessTitle"), 
        description: t("toastSuccessDesc") 
      });
      
      setFormData({ fullName: "", email: "", phone: "", company: "", subject: "", message: "" });
      setOpen(false);

    } catch (error: any) {
      console.error("Submission Error:", error);
      toast({ 
        title: t("toastErrorTitle"), 
        description: error.message || t("toastErrorDesc"),
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform flex items-center justify-center group"
        aria-label="Send a message"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
      </button>

      {/* Modal / Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white p-0 overflow-hidden border-0 shadow-2xl">
          <div className="p-6 pb-0">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <MessageCircle className="w-5 h-5 text-primary" />
                <span className="text-primary font-semibold text-sm tracking-wider uppercase">{t("sendMessageSubtitle")}</span>
              </div>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {t("title")}
              </DialogTitle>
            </DialogHeader>
          </div>

          <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                placeholder={t("fullName")}
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="border-gray-200 focus:border-primary bg-gray-50/50 text-black"
                maxLength={100}
                required
                disabled={loading}
              />
              <Input
                placeholder={t("email")}
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="border-gray-200 focus:border-primary bg-gray-50/50 text-black"
                maxLength={255}
                required
                disabled={loading}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                placeholder={t("phone")}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="border-gray-200 focus:border-primary bg-gray-50/50 text-black"
                maxLength={20}
                disabled={loading}
              />
              <Input
                placeholder={t("company")}
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="border-gray-200 focus:border-primary bg-gray-50/50 text-black"
                maxLength={100}
                disabled={loading}
              />
            </div>
            <Select 
              value={formData.subject} 
              onValueChange={(val) => setFormData({ ...formData, subject: val })}
              disabled={loading}
            >
              <SelectTrigger className="border-gray-100 bg-gray-50/50 text-black">
                <SelectValue placeholder={t("selectSubject")} />
              </SelectTrigger>
              <SelectContent className="bg-white text-black z-50">
                <SelectItem value="general">{t("general")}</SelectItem>
                <SelectItem value="quote">{t("quote")}</SelectItem>
                <SelectItem value="support">{t("support")}</SelectItem>
                <SelectItem value="partnership">{t("partnership")}</SelectItem>
                <SelectItem value="other">{t("other")}</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder={t("message")}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="border-gray-200 focus:border-primary bg-gray-50/50 min-h-[120px] text-black"
              maxLength={1000}
              required
              disabled={loading}
            />
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2 w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("sending")}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {t("sendMessageBtn")}
                </>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingContact;