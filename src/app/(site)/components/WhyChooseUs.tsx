import { Shield, Zap, Target, Headphones } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Durability Guaranteed",
    description: "Built with marine-grade stainless steel to withstand the harshest kitchen environments for years.",
  },
  {
    icon: Zap,
    title: "Energy Efficient",
    description: "Advanced insulation and motor technologies reduce energy consumption by up to 30%.",
  },
  {
    icon: Target,
    title: "Precision Control",
    description: "Digital interfaces offering degree-perfect temperature and timing control for consistent results.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our dedicated support team is always available to ensure your kitchen never stops running.",
  },
];

const WhyChooseUs = () => {
  return (
    <section 
      className="py-12 md:py-20 relative overflow-hidden" 
      style={{
        background: 'linear-gradient(135deg, #fafbfc 0%, #f0f4f8 50%, #e8f0f8 100%)'
      }}
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-100/50 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }} 
      />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-2 leading-tight">
            Why Industry Leaders Choose
          </h2>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3 md:mb-4 leading-tight">
            <span className="gradient-headline">Betterking</span>
          </h2>
          <p className="text-sm md:text-lg max-w-2xl mx-auto text-gray-600">
            We don't just sell equipment; we provide the backbone of your culinary operation.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="text-center p-4 md:p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/80 shadow-sm hover:shadow-md hover:bg-white/80 transition-all duration-300"
            >
              <div className="w-10 h-10 md:w-14 md:h-14 mx-auto mb-3 md:mb-5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <feature.icon className="w-5 h-5 md:w-7 md:h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-sm md:text-lg text-gray-900 mb-2 md:mb-3">
                {feature.title}
              </h3>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;