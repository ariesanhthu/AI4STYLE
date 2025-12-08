import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ✅ DISABLED: Auth check moved to client-side RequireAuth component
// Middleware can't access localStorage (only available in browser)
// RequireAuth component handles authentication properly on client-side

export function middleware(request: NextRequest) {
  // Just allow all requests through
  // Protected routes are handled by RequireAuth component
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};


