import type { Metadata } from "next";
import Script from 'next/script';
import { Inter } from "next/font/google";
import '../globals.css';
import NextTopLoader from 'nextjs-toploader';
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Betterking Kitchen",
  description: "Betterking Kitchen",
  icons: {
    icon: "/white-logo.webp", 
  },
  verification: {
    google: "VhJlRr3WFXCWlOhxiSQeKsvQ8kxzI_NhPWBA-5ktwLw",
  },
};


export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'bn' }, { locale: 'fr' }, { locale: 'es' }, { locale: 'ar' }, { locale: 'zh' }]; 
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>; 
}>) {
  const { locale } = await params;
  
  setRequestLocale(locale);
  
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={cn(inter.className, "antialiased")} suppressHydrationWarning>
        
      <!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-8MVLDN3L5D"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-8MVLDN3L5D');
</script>

        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
          <NextTopLoader color="#D4AF37" height={3} showSpinner={false} />
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}