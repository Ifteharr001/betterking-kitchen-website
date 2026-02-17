"use client";

import { useState } from "react";
import { 
  Phone, Mail, MapPin, Clock, Send, MessageSquare, 
  Headphones, Building2, ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Accordion, AccordionContent, AccordionItem, AccordionTrigger 
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

const contactCards = [
  { icon: Phone, title: "Call Us", value: "+1 (800) 555-0123", sub: "Mon–Fri, 9AM–6PM EST", href: "tel:+18005550123" },
  { icon: Mail, title: "Email Us", value: "sales@betterking.com", sub: "We reply within 24 hours", href: "mailto:sales@betterking.com" },
  { icon: MapPin, title: "Visit Us", value: "1234 Kitchen Lane", sub: "Culinary District, NY 10001", href: "#" },
  { icon: Clock, title: "Business Hours", value: "Mon – Fri: 9AM–6PM", sub: "Sat: 10AM–2PM", href: "#" },
];

const faqs = [
  { q: "What is the typical lead time for orders?", a: "Standard orders are processed within 5–7 business days. Custom or bulk orders may take 2–4 weeks depending on specifications and inventory availability." },
  { q: "Do you offer installation services?", a: "Yes, we provide professional installation services for all major equipment. Our certified technicians ensure proper setup and calibration for optimal performance." },
  { q: "What warranty do your products come with?", a: "All products come with a minimum 2-year manufacturer warranty. Extended warranty packages of up to 5 years are available for purchase at checkout." },
  { q: "Can I request a custom quote for bulk orders?", a: "Absolutely! Use our 'Get a Quote' form or contact our sales team directly. We offer competitive pricing for bulk and institutional orders." },
  { q: "Do you ship internationally?", a: "Yes, we ship to over 50 countries worldwide. International shipping rates and delivery times vary by destination. Contact us for a detailed estimate." },
  { q: "What payment methods do you accept?", a: "We accept all major credit cards, bank transfers, and purchase orders for verified business accounts. Financing options are also available for qualifying orders." },
];

const stats = [
  { value: "15K+", label: "Products Delivered" },
  { value: "50+", label: "Countries Served" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "24/7", label: "Support Available" },
];

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", company: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message Sent!", description: "We'll get back to you within 24 hours." });
    setFormData({ name: "", email: "", phone: "", company: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
   
      <main>
        {/* Hero - Dark */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/60 to-background" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)", backgroundSize: "40px 40px" }} />
          <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
            <span className="badge-gold mb-4 inline-block">Get In Touch</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-5">
              Let's <span className="gradient-headline">Connect</span>
            </h1>
            <p className="section-subtitle mx-auto max-w-xl">
              Have a question or need a custom solution? Our expert team is ready to help you build the perfect commercial kitchen.
            </p>
          </div>
        </section>

        {/* Contact Cards - Dark */}
        <section className="container mx-auto px-4 lg:px-8 -mt-8 relative z-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {contactCards.map((c, i) => (
              <a key={i} href={c.href} className="feature-card group flex flex-col items-center text-center p-5 md:p-7 hover:border-primary transition-all">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <c.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-sm md:text-base mb-1">{c.title}</h3>
                <p className="text-xs md:text-sm font-medium text-foreground/90">{c.value}</p>
                <p className="text-[11px] md:text-xs text-muted-foreground mt-0.5">{c.sub}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Form + Map - White Section */}
        <section className="bg-white">
          <div className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
            <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
              {/* Form */}
              <div className="lg:col-span-3">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">Send a Message</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">We'd Love to Hear From You</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Full Name *" required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="bg-gray-50 border-gray-200 h-12 text-gray-900 placeholder:text-gray-400" />
                    <Input type="email" placeholder="Email Address *" required value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className="bg-gray-50 border-gray-200 h-12 text-gray-900 placeholder:text-gray-400" />
                    <Input placeholder="Phone Number" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} className="bg-gray-50 border-gray-200 h-12 text-gray-900 placeholder:text-gray-400" />
                    <Input placeholder="Company Name" value={formData.company} onChange={e => setFormData(p => ({ ...p, company: e.target.value }))} className="bg-gray-50 border-gray-200 h-12 text-gray-900 placeholder:text-gray-400" />
                  </div>
                  <Select value={formData.subject} onValueChange={v => setFormData(p => ({ ...p, subject: v }))}>
                    <SelectTrigger className="bg-gray-50 border-gray-200 h-12 text-gray-900">
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="quote">Request a Quote</SelectItem>
                      <SelectItem value="support">Technical Support</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea placeholder="Your Message *" required rows={5} value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))} className="bg-gray-50 border-gray-200 resize-none text-gray-900 placeholder:text-gray-400" />
                  <Button type="submit" className="btn-gold gap-2 w-full md:w-auto">
                    <Send className="w-4 h-4" /> Send Message
                  </Button>
                </form>
              </div>

              {/* Map / Info Side */}
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-xl overflow-hidden border border-gray-200 h-64 lg:h-72 bg-gray-50 flex items-center justify-center">
                  <iframe
                    title="Betterking Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1841334460677!2d-73.98773128459413!3d40.75797457932688!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes+Square!5e0!3m2!1sen!2sus!4v1560467776412!5m2!1sen!2sus"
                    className="w-full h-full border-0 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                    loading="lazy"
                    allowFullScreen
                  />
                </div>

                <div className="p-6 rounded-xl border border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-2 mb-4">
                    <Headphones className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-gray-900">Need Immediate Help?</h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Our dedicated support team is available to assist you with any urgent inquiries or technical issues.
                  </p>
                  <a href="tel:+18005550123" className="btn-gold text-sm w-full justify-center gap-2">
                    <Phone className="w-4 h-4" /> Call Now
                  </a>
                </div>

                <div className="p-6 rounded-xl border border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-gray-900">Corporate Office</h3>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Min Hang Qu, Shang Hai Shi<br />
                    6111 Zhongchun Rd<br />
                    China, 201100
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats - Dark */}
        <section className="border-y border-border bg-card/50">
          <div className="container mx-auto px-4 lg:px-8 py-12 md:py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((s, i) => (
                <div key={i}>
                  <p className="text-3xl md:text-4xl font-bold gradient-headline">{s.value}</p>
                  <p className="text-sm text-muted-foreground mt-1 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ - White Section */}
        <section className="bg-white">
          <div className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <span className="badge-gold mb-4 inline-block">FAQ</span>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-gray-900">Frequently Asked Questions</h2>
                <p className="text-gray-500 text-sm md:text-base">Find quick answers to the most common inquiries about our products and services.</p>
              </div>
              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((f, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="border border-gray-200 rounded-xl px-5 bg-gray-50 data-[state=open]:border-primary/40 transition-colors">
                    <AccordionTrigger className="text-sm md:text-base font-semibold hover:no-underline py-5 text-gray-900">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-gray-500 leading-relaxed pb-5">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA - Dark */}
        <section className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
          <div className="relative rounded-2xl overflow-hidden p-8 md:p-14 text-center" style={{ background: "linear-gradient(135deg, hsl(var(--secondary)) 0%, hsl(var(--card)) 100%)" }}>
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Upgrade Your Kitchen?</h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto mb-6">
                Let our experts help you find the perfect equipment for your commercial kitchen needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="/" className="btn-gold gap-2">
                  Browse Products <ChevronRight className="w-4 h-4" />
                </a>
                <a href="tel:+18005550123" className="btn-outline gap-2">
                  <Phone className="w-4 h-4" /> Call Us Now
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
   
    </div>
  );
};

export default Contact;