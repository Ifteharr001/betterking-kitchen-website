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

  let categories = [];
  try {
    const res = await fetch(`${baseUrl}/api/categories`); 
    if (res.ok) {
      categories = await res.json();
    }
  } catch (error) {
    console.error("Sitemap Category Fetch Error:", error);
  }

  const categoryUrls = categories.map((cat: any) => {
    const path = `/categories/${cat.slug}`;
    return {
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: getAlternates(path),
    };
  });

  const staticRoutes = [
    '', // Home page
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

  return [...staticUrls, ...categoryUrls];
}