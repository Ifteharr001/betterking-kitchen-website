import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import createIntlMiddleware from "next-intl/middleware";

const locales = ['en', 'bn', 'zh', 'es', 'fr', 'ar'];

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'en'
});

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isAdminPath = path.startsWith('/admin') || locales.some(locale => path.startsWith(`/${locale}/admin`));

  if (isAdminPath) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const isLoginPage = path.endsWith("/admin/login");

    const currentLocale = locales.find(loc => path.startsWith(`/${loc}`)) || 'en';

    if (isLoginPage && token) {
      return NextResponse.redirect(new URL(`/${currentLocale}/admin/dashboard`, request.nextUrl));
    }

    if (!isLoginPage && !token) {
      return NextResponse.redirect(new URL(`/${currentLocale}/admin/login`, request.nextUrl));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/',
    '/(en|bn|zh|es|fr|ar)/:path*', 
    '/((?!api|_next|.*\\..*).*)' 
  ],
};