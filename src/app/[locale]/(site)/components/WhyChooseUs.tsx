import { Shield, Zap, Target, Headphones } from "lucide-react";
import { useTranslations } from "next-intl"; 

const WhyChooseUs = () => {
  const t = useTranslations("WhyChooseUs"); 

  const features = [
    {
      icon: Shield,
      title: t("features.f1_title"),
      description: t("features.f1_desc"),
    },
    {
      icon: Zap,
      title: t("features.f2_title"),
      description: t("features.f2_desc"),
    },
    {
      icon: Target,
      title: t("features.f3_title"),
      description: t("features.f3_desc"),
    },
    {
      icon: Headphones,
      title: t("features.f4_title"),
      description: t("features.f4_desc"),
    },
  ];

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
            {t("title1")}
          </h2>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3 md:mb-4 leading-tight">
            <span className="gradient-headline">{t("title2")}</span>
          </h2>
          <p className="text-sm md:text-lg max-w-2xl mx-auto text-gray-600">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="text-center p-4 md:p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/80 shadow-sm hover:shadow-md hover:bg-white/80 transition-all duration-300"
            >
              <div className="w-10 h-10 md:w-14 h-14 mx-auto mb-3 md:mb-5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
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