import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
      {
        protocol: "https",
        hostname: "i.ibb.co.com", 
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
          protocol: "https",
          hostname: "cdn.example.com",
        }
    ],
  },
};

export default withNextIntl(nextConfig);