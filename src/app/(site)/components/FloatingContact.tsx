"use client"; // Next.js App Router-এর জন্য এটি প্রয়োজন

import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const FloatingContact = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.message) {
      toast({ title: "Please fill in required fields", variant: "destructive" });
      return;
    }
    toast({ title: "Message sent successfully!", description: "We'll get back to you soon." });
    setFormData({ fullName: "", email: "", phone: "", company: "", subject: "", message: "" });
    setOpen(false);
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
                <span className="text-primary font-semibold text-sm tracking-wider uppercase">Send a Message</span>
              </div>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                We'd Love to Hear From You
              </DialogTitle>
            </DialogHeader>
          </div>

          <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                placeholder="Full Name *"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="border-gray-200 focus:border-primary bg-gray-50/50 text-black"
                maxLength={100}
                required
              />
              <Input
                placeholder="Email Address *"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="border-gray-200 focus:border-primary bg-gray-50/50 text-black"
                maxLength={255}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="border-gray-200 focus:border-primary bg-gray-50/50 text-black"
                maxLength={20}
              />
              <Input
                placeholder="Company Name"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="border-gray-200 focus:border-primary bg-gray-50/50 text-black"
                maxLength={100}
              />
            </div>
            <Select value={formData.subject} onValueChange={(val) => setFormData({ ...formData, subject: val })}>
              <SelectTrigger className="border-gray-200 bg-gray-50/50 text-black">
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="general">General Inquiry</SelectItem>
                <SelectItem value="quote">Request a Quote</SelectItem>
                <SelectItem value="support">Technical Support</SelectItem>
                <SelectItem value="partnership">Partnership</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Your Message *"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="border-gray-200 focus:border-primary bg-gray-50/50 min-h-[120px] text-black"
              maxLength={1000}
              required
            />
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2 w-full sm:w-auto">
              <Send className="w-4 h-4" />
              Send Message
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingContact;