import { Flame, Thermometer, ChefHat, Coffee, Sparkles, Package } from "lucide-react";

const categories = [
  { icon: Flame, name: "Cooking Range", count: 42 },
  { icon: Thermometer, name: "Refrigeration", count: 28 },
  { icon: ChefHat, name: "Food Prep", count: 35 },
  { icon: Coffee, name: "Beverage", count: 18 },
  { icon: Sparkles, name: "Dishwashing", count: 12 },
  { icon: Package, name: "Storage", count: 24 },
];

const Categories = () => {
  return (
    <section className="py-12 md:py-20 bg-gray-50 relative overflow-hidden">
     
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} 
      />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-gray-900 mb-3 md:mb-4">
            Browse by Category
          </h2>
          <p className="text-sm md:text-lg max-w-2xl mx-auto text-gray-600">
            Explore our comprehensive range of professional kitchen solutions tailored for efficiency.
          </p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-4 md:p-6 text-center group border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 cursor-pointer"
            >
              <div className="w-10 h-10 md:w-14 md:h-14 mx-auto mb-2 md:mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <category.icon className="w-5 h-5 md:w-7 md:h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-0.5 md:mb-1 text-xs md:text-base">
                {category.name}
              </h3>
              <p className="text-[10px] md:text-sm text-gray-500">
                {category.count} Products
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;