import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES: Record<string, string[]> = {
  "/admin": ["admin"],
  "/tutor": ["tutor"],
  "/dashboard": ["orangtua", "admin"],
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Find if this path falls under any protected prefix
  const matchedRoute = Object.keys(PROTECTED_ROUTES).find(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );

  if (!matchedRoute) {
    return NextResponse.next();
  }

  const sessionToken = req.cookies.get("ahe_token")?.value || req.cookies.get("ahe_session")?.value;
  const role = req.cookies.get("ahe_role")?.value;

  // If not authenticated, redirect to login
  if (!sessionToken || !role) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const allowedRoles = PROTECTED_ROUTES[matchedRoute];

  // If user role is not allowed on this path, redirect to their home portal
  if (!allowedRoles.includes(role)) {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    if (role === "tutor") {
      return NextResponse.redirect(new URL("/tutor", req.url));
    }
    if (role === "orangtua") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/tutor/:path*",
    "/dashboard/:path*",
  ],
};
