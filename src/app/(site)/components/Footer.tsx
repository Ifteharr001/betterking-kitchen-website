import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import Link from "next/link"; // Next.js Link component

const Footer = () => {
  return (
    <footer className="bg-[#0a1628] text-white">
      <div className="container mx-auto px-4 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 md:mb-6 w-fit">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded flex items-center justify-center">
                <span className="font-black text-primary-foreground text-lg md:text-xl">B</span>
              </div>
              <span className="font-black text-xl md:text-2xl tracking-tight">BETTERKING</span>
            </Link>
            <p className="text-white/70 text-xs md:text-sm mb-4 md:mb-6 leading-relaxed">
              Delivering premium commercial kitchen equipment to industry leaders worldwide since 1985.
            </p>
            <div className="flex gap-2 md:gap-3">
              {[
                { Icon: Facebook, href: "#" },
                { Icon: Twitter, href: "#" },
                { Icon: Instagram, href: "#" },
                { Icon: Linkedin, href: "#" },
                { Icon: Youtube, href: "#" }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  <social.Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-base md:text-lg text-primary mb-4 md:mb-6">Quick Links</h4>
            <ul className="space-y-2 md:space-y-3 text-xs md:text-sm">
              {[
                { name: "Products", href: "/products" },
                { name: "Solutions", href: "/solutions" },
                { name: "Projects", href: "/projects" },
                { name: "Support", href: "/support" },
                { name: "About Us", href: "/about" }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-white/70 hover:text-primary font-medium transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-base md:text-lg text-primary mb-4 md:mb-6">Categories</h4>
            <ul className="space-y-2 md:space-y-3 text-xs md:text-sm">
              {[
                { name: "Cooking Equipment", href: "/category/cooking" },
                { name: "Refrigeration", href: "/category/refrigeration" },
                { name: "Food Preparation", href: "/category/food-prep" },
                { name: "Beverage Systems", href: "/category/beverage" },
                { name: "Dishwashing", href: "/category/dishwashing" }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-white/70 hover:text-primary font-medium transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h4 className="font-bold text-base md:text-lg text-primary mb-4 md:mb-6">Contact Us</h4>
            <ul className="space-y-3 md:space-y-4 text-xs md:text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-white/70 font-medium">1234 Kitchen Lane, Culinary District, NY 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0" />
                <a href="tel:+18005550123" className="text-white/70 hover:text-primary font-medium transition-colors">
                  +1 (800) 555-0123
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0" />
                <a href="mailto:sales@betterking.com" className="text-white/70 hover:text-primary font-medium transition-colors">
                  sales@betterking.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#060e1a]">
        <div className="container mx-auto px-4 lg:px-8 py-4 md:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 text-xs md:text-sm text-white/60">
            <p className="font-medium text-center md:text-left">© {new Date().getFullYear()} Betterking. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Link href="/privacy" className="hover:text-primary font-medium transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-primary font-medium transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="hover:text-primary font-medium transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;