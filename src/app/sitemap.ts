import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://betterkingkitchen.com';
  
  const locales = ['en', 'zh', 'bn', 'es', 'fr', 'ar'];

  const getAlternates = (path: string) => {
    const languages: Record<string, string> = {};
    
    locales.forEach((locale) => {
      languages[locale] = `${baseUrl}/${locale}${path}`;
    });
    
    languages['x-default'] = `${baseUrl}${path}`;
    
    return { languages };
  };

  let categories: any[] = [];
  try {
    const res = await fetch(`${baseUrl}/api/categories`); 
    if (res.ok) {
      const data = await res.json();
      categories = Array.isArray(data) ? data : data.data || data.categories || [];
    }
  } catch (error) {
    console.error("Sitemap Category Fetch Error:", error);
  }

  const categoryUrls = categories.map((cat: any) => {
    const path = `/categories/${cat.slug || cat._id}`;
    return {
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: getAlternates(path),
    };
  });

  let products: any[] = [];
  try {
    const res = await fetch(`${baseUrl}/api/products`); 
    if (res.ok) {
      const data = await res.json();
      products = Array.isArray(data) ? data : data.data || data.products || [];
    }
  } catch (error) {
    console.error("Sitemap Product Fetch Error:", error);
  }

  const productUrls = products.map((prod: any) => {
    const path = `/product/${prod.id}`; 
    return {
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
      alternates: getAlternates(path),
    };
  });

  let blogs: any[] = [];
  try {
    const res = await fetch(`${baseUrl}/api/admin/news`);
    if (res.ok) {
      const data = await res.json();
      blogs = Array.isArray(data) ? data : data.data || data.news || data.blogs || [];
    }
  } catch (error) {
    console.error("Sitemap Blog Fetch Error:", error);
  }

  const blogUrls = blogs.map((blog: any) => {
    
    let safeSlug = blog.slug 
      ? blog.slug.toString().trim().replace(/\s+/g, '-') 
      : blog._id;

    const path = `/news/${safeSlug}`; 
    return {
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7, 
      alternates: getAlternates(path),
    };
  });

  const staticRoutes = [
    '', 
    '/products',
    '/solutions',
    '/industries',
    '/projects',
    '/news',
    '/track-order',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/cookies'
  ];

  const staticUrls = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' as const : 'monthly' as const,
    priority: route === '' ? 1.0 : 0.8,
    alternates: getAlternates(route),
  }));

  return [...staticUrls, ...categoryUrls, ...productUrls, ...blogUrls];
}