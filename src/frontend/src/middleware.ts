import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { UserRole } from "./lib/open-api-client/token-manager";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect Admin Routes
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("accessToken");
    const role = request.cookies.get("userRole")?.value;
    // If no token or not admin, redirect to home
    if (!token || role === UserRole.GUEST) {
      const url = request.nextUrl.clone();
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};


