import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware to redirect incomplete pages to under-construction
 * 
 * Add routes to the UNDER_CONSTRUCTION_ROUTES array to redirect them
 * to the under-construction page.
 */

// List of routes that should show the under-construction page
// These can be exact paths or path prefixes (for redirecting entire sections)
const UNDER_CONSTRUCTION_ROUTES: string[] = [
  // Add routes here that are not yet complete
  // Examples:
  // "/franchise",  // Already handled at page level
  // "/blog",       // If blog isn't ready yet
  // "/careers",    // If careers page isn't ready
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path matches any under-construction route
  const isUnderConstruction = UNDER_CONSTRUCTION_ROUTES.some((route) => {
    // Exact match
    if (pathname === route) return true;
    // Prefix match (for sub-routes)
    if (pathname.startsWith(`${route}/`)) return true;
    return false;
  });

  if (isUnderConstruction) {
    // Redirect to under-construction page
    const url = request.nextUrl.clone();
    url.pathname = "/under-construction";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     * - api routes
     * - under-construction page itself
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api|under-construction).*)",
  ],
};
