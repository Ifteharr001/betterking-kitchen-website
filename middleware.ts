import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isLoginPage = path === "/admin/login";

  if (isLoginPage && token) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.nextUrl));
  }

  if (!isLoginPage && !token) {
    return NextResponse.redirect(new URL("/admin/login", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};