import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
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
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
          <NextTopLoader color="#D4AF37" height={3} showSpinner={false} />
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}