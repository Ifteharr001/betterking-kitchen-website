"use client";


import { 
  ChevronRight, Building2, UtensilsCrossed, GraduationCap, Hospital, Cake, 
  Coffee, Briefcase, Ruler, Wrench, Truck, Headphones, DollarSign, Shield, ArrowRight 
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

const businessTypes = [
  {
    title: "Star-Rated Hotels",
    description: "Equip your property with high-performance systems trusted by global leaders like Marriott and Hilton.",
    icon: Building2,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80",
  },
  {
    title: "Fine-Dining & Casual Restaurants",
    description: "Custom 2D/3D layouts designed to optimize every inch of your workflow from prep to pass.",
    icon: UtensilsCrossed,
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
  },
  {
    title: "School & University Catering",
    description: "Reliable, heavy-duty equipment built for high-volume efficiency serving thousands daily.",
    icon: GraduationCap,
    image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&q=80",
  },
  {
    title: "Hospital Foodservice",
    description: "Meet strict HACCP standards with solutions designed for total hygiene and traceability.",
    icon: Hospital,
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80",
  },
  {
    title: "Bakery Operations",
    description: "Professional-grade equipment engineered for fast turnaround and superior consistency.",
    icon: Cake,
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&q=80",
  },
  {
    title: "Café & Bar",
    description: "Stylish, efficient equipment setups for modern café and bar environments.",
    icon: Coffee,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
  },
];

const services = [
  { title: "Project Costing", description: "Transparent budgeting and cost optimization for your project.", icon: DollarSign },
  { title: "Planning & Design", description: "Custom 2D/3D kitchen layouts tailored to your space.", icon: Ruler },
  { title: "Equipment Manufacturing", description: "Premium equipment built to international standards.", icon: Wrench },
  { title: "Logistics & Delivery", description: "Global shipping and on-time delivery guaranteed.", icon: Truck },
  { title: "Installation & Setup", description: "Professional on-site installation by expert technicians.", icon: Briefcase },
  { title: "After-Sales Support", description: "24/7 maintenance and technical support worldwide.", icon: Headphones },
];

const trustedPartnerPoints = [
  { title: "Global Industry Experience", description: "15+ years, 50+ countries, supporting 8,000+ professional kitchens.", position: "top-left" },
  { title: "Expert Service Team", description: "Consultant, designer, and project manager working closely with you.", position: "top-right" },
  { title: "Guaranteed Handover Quality", description: "Strict QC inspection ensures your kitchen performs perfectly.", position: "mid-left" },
  { title: "One-Stop Equipment Supply", description: "Full product line from cooking equipment to small utensils.", position: "mid-right" },
  { title: "Quality Tiers CE Certified", description: "Offering Standard, Premium, and Premium Plus options.", position: "bottom-left" },
  { title: "Complete Turnkey Solution", description: "Design, supply, installation, and 24/7 service for all sectors.", position: "bottom-right" },
];

const equipmentRange = [
  { title: "Cooking Equipment", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80" },
  { title: "Commercial Refrigeration", image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&q=80" },
  { title: "Bakery Equipment", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80" },
  { title: "Food Processors", image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&q=80" },
  { title: "Commercial Dishwashers", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80" },
  { title: "Stainless Steel Fabrication", image: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=400&q=80" },
  { title: "Fast Food Equipment", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80" },
  { title: "Bar & Coffee Appliances", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80" },
];

const certifications = [
  { name: "CE Certified", desc: "European Conformity" },
  { name: "ISO 9001", desc: "Quality Management" },
  { name: "ISO 14001", desc: "Environmental Management" },
  { name: "HACCP", desc: "Food Safety System" },
  { name: "NSF", desc: "Public Health Standard" },
  { name: "RoHS", desc: "Hazardous Substances" },
  { name: "SGS", desc: "Inspection & Certification" },
  { name: "UL Listed", desc: "Safety Certification" },
];

// Before/After Slider Component
const BeforeAfterSlider = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) handleMove(e.clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging.current) handleMove(e.touches[0].clientX);
    };
    const handleUp = () => { isDragging.current = false; };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchend", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchend", handleUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-4xl mx-auto aspect-[16/9] rounded-2xl overflow-hidden cursor-col-resize select-none shadow-2xl"
      onMouseDown={() => { isDragging.current = true; }}
      onTouchStart={() => { isDragging.current = true; }}
    >
      {/* After (full) */}
      <img
        src="https://i.ibb.co.com/v4QPffdS/220120-055.jpg"
        alt="After - Modern Kitchen"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Before (clipped) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPosition}%` }}>
        <img
          src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=1200&q=80"
          alt="Before - Old Kitchen"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100vw', maxWidth: 'none' }}
        />
      </div>
      {/* Slider line */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10" style={{ left: `${sliderPosition}%` }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center">
          <div className="flex items-center gap-0.5">
            <ChevronRight className="w-4 h-4 text-gray-800 rotate-180" />
            <ChevronRight className="w-4 h-4 text-gray-800" />
          </div>
        </div>
      </div>
      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full z-20">BEFORE</div>
      <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full z-20">AFTER</div>
    </div>
  );
};

const Solutions = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">

      <main>
        {/* Hero - Dark */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/60 to-background" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)", backgroundSize: "40px 40px" }} />
          <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
            <span className="badge-gold mb-4 inline-block">Our Solutions</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-5">
              Complete Kitchen <span className="gradient-headline">Solutions</span>
            </h1>
            <p className="section-subtitle mx-auto max-w-xl">
              End-to-end commercial kitchen design, equipment supply, and installation for every hospitality sector worldwide.
            </p>
          </div>
        </section>

        {/* Business Types - White */}
        <section className="bg-white">
          <div className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
            <div className="text-center mb-12">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Industries</span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-2 mb-3 text-gray-900">Business Type</h2>
              <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">Tailored kitchen solutions for every sector of the hospitality and food service industry.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businessTypes.map((b, i) => (
                <div key={i} className="group rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer bg-white">
                  <div className="relative h-48 overflow-hidden">
                    <img src={b.image} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                      <b.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 mb-2">{b.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{b.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Before & After - Dark */}
        <section className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
          <div className="text-center mb-10">
            <span className="badge-gold mb-4 inline-block">Transformation</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">Kitchen <span className="gradient-headline">Before & After</span></h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">Drag the slider to see the dramatic transformation we deliver for our clients.</p>
          </div>
          <BeforeAfterSlider />
        </section>

        {/* Our Services - White */}
        <section className="bg-white">
          <div className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
            <div className="text-center mb-12">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">What We Do</span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-2 mb-3 text-gray-900">Our Services</h2>
              <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">From concept to completion — we handle every step of your kitchen project.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
              {services.map((s, i) => (
                <div key={i} className="group text-center p-5 rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all duration-300 bg-gray-50/50">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <s.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 mb-1.5">{s.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Betterking - Trusted Partner - Dark */}
        <section className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Why Betterking</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-2 mb-3">Your Trusted Kitchen <span className="gradient-headline">Partner</span></h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">15+ years global commercial kitchen expertise: Trusted by 8000+ chefs, end-to-end solutions, multi-tier quality.</p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Center image with circular border */}
            <div className="flex justify-center mb-8 md:mb-0">
              <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-primary/30 shadow-2xl mx-auto md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-10">
                <img src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=600&q=80" alt="Betterking Kitchen" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              {/* Circular orbit ring - desktop only */}
              <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border border-dashed border-primary/20" />
            </div>

            {/* Points grid */}
            <div className="grid md:grid-cols-2 gap-x-80 gap-y-8">
              {trustedPartnerPoints.map((p, i) => (
                <div key={i} className={`flex items-start gap-3 ${i % 2 === 1 ? 'md:text-left' : 'md:text-right md:flex-row-reverse'}`}>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-foreground">{i + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-1">{p.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{p.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Equipment Range - White */}
        <section className="bg-white">
          <div className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
            <div className="text-center mb-12">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Our Products</span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-2 mb-3 text-gray-900">Commercial Kitchen Equipment Range</h2>
              <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">Full product line covering every aspect of commercial kitchen operations.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {equipmentRange.map((e, i) => (
                <div key={i} className="group rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer bg-white">
                  <div className="relative h-40 md:h-48 overflow-hidden">
                    <img src={e.image} alt={e.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-bold text-sm text-gray-900">{e.title}</h3>
                    <button className="mt-2 text-xs font-semibold text-primary hover:underline flex items-center gap-1 mx-auto">
                      Details <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications - Dark */}
        <section className="border-y border-border">
          <div className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
            <div className="text-center mb-12">
              <span className="badge-gold mb-4 inline-block">Quality Assurance</span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">Our <span className="gradient-headline">Certifications</span></h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">All our products meet the highest international quality and safety standards.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {certifications.map((c, i) => (
                <div key={i} className="feature-card p-6 text-center group hover:border-primary/50 transition-all">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <Shield className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-sm mb-1">{c.name}</h3>
                  <p className="text-xs text-muted-foreground">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Steps - White */}
        <section className="bg-white">
          <div className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
            <div className="text-center mb-12">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">How It Works</span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-2 mb-3 text-gray-900">Our Process</h2>
              <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">A seamless journey from initial consultation to final handover.</p>
            </div>
            <div className="grid md:grid-cols-4 gap-6 relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gray-200" />
              {[
                { step: "01", title: "Consultation", desc: "We understand your needs, budget, and space requirements." },
                { step: "02", title: "Design & Planning", desc: "Custom 2D/3D kitchen layouts optimized for your workflow." },
                { step: "03", title: "Manufacturing", desc: "Equipment built to spec with rigorous quality control." },
                { step: "04", title: "Installation", desc: "Professional setup, testing, and staff training on-site." },
              ].map((s, i) => (
                <div key={i} className="text-center relative">
                  <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-lg font-bold relative z-10 shadow-lg">
                    {s.step}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA - Dark */}
        <section className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
          <div className="relative rounded-2xl overflow-hidden p-8 md:p-14 text-center bg-gradient-to-br from-card to-secondary">
            <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Build Your <span className="gradient-headline">Dream Kitchen?</span></h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto mb-6">
                Let our experts design the perfect commercial kitchen solution for your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="/contact" className="btn-gold gap-2">
                  Get a Free Quote <ChevronRight className="w-4 h-4" />
                </a>
                <a href="tel:+18005550123" className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border text-foreground rounded-lg hover:border-primary hover:text-primary transition-colors text-sm font-semibold">
                  <Building2 className="w-4 h-4" /> Talk to an Expert
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
     
    </div>
  );
};

export default Solutions;