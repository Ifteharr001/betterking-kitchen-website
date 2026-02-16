import { ArrowRight, Eye, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import connectDB from "@/lib/db";
import ProductModel from "@/models/Product"; 

interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number | string;
}

async function getProducts() {
  try {
    await connectDB();

    const products = await ProductModel.find({})
      .sort({ createdAt: -1 }) 
      .limit(8)
      .lean(); 

    return products.map((product: any) => ({
      ...product,
      id: product.id || product._id.toString(),
      _id: product._id.toString(),
    }));

  } catch (error) {
    console.error("Error loading products:", error);
    return [];
  }
}

const ProductGrid = async () => {
  const products: Product[] = await getProducts();

  return (
    <section className="py-12 md:py-20" style={{ background: "hsl(216, 54%, 10%)" }}>
      <div className="container mx-auto px-4 lg:px-8">
  
        <div className="text-center mb-10 md:mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-0.5 bg-primary" />
            <p className="text-primary font-bold text-xs md:text-sm tracking-wider uppercase">
              Our Products
            </p>
            <div className="w-8 h-0.5 bg-primary" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Explore Our{" "}
            <span className="text-[#D4AF37]">Product Range</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-3 md:mt-4 leading-relaxed text-sm md:text-base">
            Discover high-performance commercial kitchen equipment built for
            durability and precision across every category.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {products.length > 0 ? (
            products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="product-card group flex flex-col bg-white border border-gray-800 rounded-xl overflow-hidden hover:border-[#D4AF37]/50 transition-colors"
              >
                <div className="bg-gray-100 flex items-center justify-center p-4 aspect-square overflow-hidden relative">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                </div>

                <div className="p-3 md:p-4 pb-2 md:pb-3 flex-1 flex flex-col bg-white">
                  <span className="text-[9px] md:text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest mb-1">
                    {product.category}
                  </span>
                  <h3 className="font-semibold text-gray-900 text-xs md:text-sm leading-snug group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 font-bold mt-2 text-sm">
                    ৳ {Number(product.price).toLocaleString()}
                  </p>
                </div>

                <div className="px-3 md:px-4 pb-3 md:pb-4 mt-auto bg-white">
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <div className="flex-1 flex items-center justify-center gap-1 md:gap-1.5 py-1.5 md:py-2 rounded-md bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] md:text-xs font-semibold group-hover:bg-[#D4AF37] group-hover:text-black transition-all duration-300">
                      View Details
                      <ArrowRight className="w-3 h-3 md:w-3.5 md:h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    
                    <button 
                      className="w-7 h-7 md:w-8 md:h-8 rounded-md border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all duration-200 bg-white"
                    >
                      <Eye className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    </button>
                    
                    <button
                      className="w-7 h-7 md:w-8 md:h-8 rounded-md border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all duration-200 hidden sm:flex bg-white"
                    >
                      <ExternalLink className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    </button>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center text-white/50 py-10">
              No products found. Please add products from Admin Panel.
            </div>
          )}
        </div>

        <div className="text-center mt-8 md:mt-12">
          <Link href="/products" className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-3.5 text-sm md:text-base bg-[#D4AF37] text-black font-bold rounded hover:bg-[#b89628] transition-colors">
            Browse All Products
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;