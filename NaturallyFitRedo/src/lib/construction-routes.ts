/**
 * Under Construction Routes Configuration
 * 
 * This file centralizes the management of pages that are still under construction.
 * 
 * To mark a page as under construction:
 * 1. Add the route path to the UNDER_CONSTRUCTION_ROUTES array below
 * 2. OR create a page.tsx in that route that redirects to /under-construction
 * 
 * Routes listed here will automatically redirect visitors to the 
 * /under-construction page instead of showing incomplete content.
 */

export const UNDER_CONSTRUCTION_ROUTES: string[] = [
  // ============================================
  // PAGES CURRENTLY UNDER CONSTRUCTION
  // ============================================
  
  // "/franchise",      // Franchise opportunities page
  // "/blog",           // Blog section
  // "/careers",        // Careers/jobs page
  // "/affiliates",     // Affiliate program
  // "/events",         // Events calendar
  // "/gallery",        // Photo gallery
  
  // Add more routes here as needed...
];

/**
 * Check if a given pathname is under construction
 */
export function isUnderConstruction(pathname: string): boolean {
  return UNDER_CONSTRUCTION_ROUTES.some((route) => {
    // Exact match
    if (pathname === route) return true;
    // Prefix match (for sub-routes)
    if (pathname.startsWith(`${route}/`)) return true;
    return false;
  });
}

/**
 * Get the redirect URL for under-construction pages
 */
export function getUnderConstructionRedirect(): string {
  return "/under-construction";
}
