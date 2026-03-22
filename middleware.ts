import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected routes
  const isProtected = pathname.startsWith("/subjects") || pathname.startsWith("/profile");

  if (!isProtected) return NextResponse.next();

  // If protected, check for token
  const hasAccessToken = request.cookies.has("lms_access_token");
  if (hasAccessToken) return NextResponse.next();

  // Redirect to login if not authenticated
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/subjects/:path*", "/profile/:path*"],
};
