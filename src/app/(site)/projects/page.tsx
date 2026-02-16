
import { ChevronRight, MapPin, Calendar, Award, Users, Building2, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import connectDB from "@/lib/db";
import Industry from "@/models/Industry";

const featuredProjects = [
  {
    title: "The Grand Marriott Kitchen",
    location: "New York, USA",
    category: "Hotel & Resort",
    year: "2024",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    description: "Complete commercial kitchen overhaul for a 500-room luxury hotel, featuring state-of-the-art cooking stations and refrigeration systems.",
  },
  {
    title: "Peninsula Fine Dining",
    location: "Hong Kong",
    category: "Restaurant",
    year: "2024",
    image: "https://images.unsplash.com/photo-1571167366136-b57e07761625?w=800&q=80",
    description: "Designed and equipped a Michelin-star fine dining kitchen with precision cooking equipment and custom ventilation.",
  },
  {
    title: "Hilton Convention Center",
    location: "London, UK",
    category: "Convention & Events",
    year: "2023",
    image: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=800&q=80",
    description: "Large-scale banquet kitchen installation serving 2,000+ guests daily with industrial-grade equipment.",
  },
];

// ২. Stats (Static)
const stats = [
  { value: "500+", label: "Projects Completed", icon: Award },
  { value: "50+", label: "Countries Worldwide", icon: MapPin },
  { value: "200+", label: "Happy Clients", icon: Users },
  { value: "15+", label: "Years Experience", icon: Calendar },
];

// ৩. Testimonials (Static)
const testimonials = [
  {
    quote: "Betterking transformed our kitchen into a world-class culinary workspace. The attention to detail and quality of equipment exceeded our expectations.",
    name: "James Chen",
    role: "Executive Chef, The Grand Marriott",
    rating: 5,
  },
  {
    quote: "From design consultation to final installation, the team delivered an exceptional experience. Our kitchen efficiency improved by 40%.",
    name: "Sarah Williams",
    role: "Operations Director, Hilton Group",
    rating: 5,
  },
  {
    quote: "Professional, reliable, and truly knowledgeable. They understood our unique requirements and delivered a kitchen that our team loves working in.",
    name: "Marco Rossi",
    role: "Head Chef, Peninsula Fine Dining",
    rating: 5,
  },
];

async function getMoreProjects() {
  try {
    await connectDB();
    const industries = await Industry.find({}).lean();
    return industries.map((ind: any) => ({
      ...ind,
      _id: ind._id.toString(),
    }));
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

const Projects = async () => {
  const moreProjects = await getMoreProjects();

  return (
    <div className="min-h-screen bg-background text-foreground">
    
      <main>
        {/* Hero - Dark */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/60 to-background" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)", backgroundSize: "40px 40px" }} />
          <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
            <span className="badge-gold mb-4 inline-block">Our Portfolio</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-5">
              Featured <span className="gradient-headline">Projects</span>
            </h1>
            <p className="section-subtitle mx-auto max-w-xl">
              Explore our world-class commercial kitchen installations trusted by leading hotels, restaurants, and institutions globally.
            </p>
          </div>
        </section>

        {/* Featured Projects - White */}
        <section className="bg-white">
          <div className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
            <div className="text-center mb-12">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Spotlight</span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-2 mb-3 text-gray-900">Our Finest Work</h2>
              <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">Each project is a testament to our commitment to excellence in commercial kitchen design and equipment.</p>
            </div>

            <div className="space-y-8 md:space-y-12">
              {featuredProjects.map((project, i) => (
                <div key={i} className={`grid md:grid-cols-2 gap-6 md:gap-10 items-center ${i % 2 === 1 ? "md:direction-rtl" : ""}`}>
                  <div className={`rounded-2xl overflow-hidden border border-gray-100 shadow-sm ${i % 2 === 1 ? "md:order-2" : ""}`}>
                    <div className="relative w-full h-64 md:h-80">
                      <Image 
                        src={project.image} 
                        alt={project.title} 
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-700" 
                      />
                    </div>
                  </div>
                  <div className={i % 2 === 1 ? "md:order-1" : ""}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[11px] font-semibold uppercase tracking-wider bg-primary/10 text-primary px-3 py-1 rounded-full">{project.category}</span>
                      <span className="text-[11px] text-gray-400 flex items-center gap-1"><Calendar className="w-3 h-3" />{project.year}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{project.title}</h3>
                    <p className="text-sm text-gray-400 flex items-center gap-1 mb-4"><MapPin className="w-3.5 h-3.5" />{project.location}</p>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-5">{project.description}</p>
                    <Button variant="outline" className="gap-2 border-gray-200 text-gray-700 hover:border-primary hover:text-primary">
                      View Details <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats - Dark */}
        <section className="border-y border-border bg-card/50">
          <div className="container mx-auto px-4 lg:px-8 py-12 md:py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((s, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <s.icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-3xl md:text-4xl font-bold gradient-headline">{s.value}</p>
                  <p className="text-sm text-muted-foreground mt-1 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* More Projects (Dynamic from Industries) - White */}
        <section className="bg-white">
          <div className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
            <div className="text-center mb-10">
              <span className="badge-gold mb-4 inline-block">Gallery</span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-gray-900">More Projects</h2>
              <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto">A glimpse into the diverse range of kitchens we've designed and equipped worldwide.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {moreProjects.length > 0 ? (
                moreProjects.map((p: any) => (
                  <Link href={`/industries/${p._id}`} key={p._id} className="block">
                    <div className="group rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer relative h-48 md:h-56 w-full">
                      <Image 
                        src={p.image} 
                        alt={p.name} 
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <p className="text-white font-semibold text-sm">{p.name}</p>
                        <p className="text-white/70 text-xs line-clamp-1">{p.description}</p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-gray-400">
                  More projects coming soon...
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Testimonials - Dark */}
        <section className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
          <div className="text-center mb-10">
            <span className="badge-gold mb-4 inline-block">Testimonials</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">What Our <span className="gradient-headline">Clients Say</span></h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">Trusted by top chefs and hospitality leaders around the world.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div key={i} className="feature-card p-6 md:p-8 flex flex-col">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed flex-1 mb-6">"{t.quote}"</p>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA - White */}
        <section className="bg-white">
          <div className="container mx-auto px-4 lg:px-8 py-16 md:py-24">
            <div className="relative rounded-2xl overflow-hidden p-8 md:p-14 text-center bg-gray-900">
              <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">Have a Project in Mind?</h2>
                <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto mb-6">
                  Let's discuss how we can design and equip the perfect commercial kitchen for your business.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a href="/contact" className="btn-gold gap-2">
                    Get Started <ChevronRight className="w-4 h-4" />
                  </a>
                  <a href="tel:+18005550123" className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-600 text-white rounded-lg hover:border-primary hover:text-primary transition-colors text-sm font-semibold">
                    <Building2 className="w-4 h-4" /> Talk to an Expert
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
};

export default Projects;