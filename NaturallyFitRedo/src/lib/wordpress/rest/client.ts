// ============================================
// WordPress REST API Client
// For fetching Pods fields via REST API
// ============================================

import { getWordPressBaseUrl } from '@/lib/config/wordpress';

const WORDPRESS_URL = getWordPressBaseUrl();
const REST_ENDPOINT = `${WORDPRESS_URL}/wp-json/wp/v2`;
const PODS_ENDPOINT = `${WORDPRESS_URL}/wp-json/pods/v1`;

/**
 * Fetch data from WordPress REST API
 */
export async function fetchREST<T>(
  endpoint: string,
  params?: Record<string, string | number | boolean>
): Promise<T> {
  const url = new URL(`${REST_ENDPOINT}${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
    next: { revalidate: 60 }, // Cache for 60 seconds
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`REST API Error (${response.status}):`, errorText);
    throw new Error(`REST API request failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Fetch Pods fields for a specific page
 * Tries multiple methods to get Pods data
 */
export async function fetchPodsFields(pageId: number): Promise<Record<string, unknown>> {
  try {
    // Method 1: Try fetching with _embed to get all meta
    const page = await fetchREST<{
      id: number;
      meta?: Record<string, unknown>;
      [key: string]: unknown;
    }>(`/pages/${pageId}`, { _embed: true });
    
    // Pods typically stores fields in meta or directly on the object
    const fields = extractPodsFields(page);
    return fields;
  } catch (error) {
    console.error(`Failed to fetch Pods fields for page ${pageId}:`, error);
    return {};
  }
}

/**
 * Fetch Pods fields for a page by slug
 */
export async function fetchPodsFieldsBySlug(slug: string): Promise<Record<string, unknown>> {
  try {
    // Method 1: Try standard WordPress REST API with meta
    const pages = await fetchREST<Array<{
      id: number;
      meta?: Record<string, unknown>;
      [key: string]: unknown;
    }>>(`/pages`, { slug, _embed: true });
    
    if (pages && pages.length > 0) {
      const fields = extractPodsFields(pages[0]);
      return fields;
    }
    
    return {};
  } catch (error) {
    console.error(`Failed to fetch Pods fields for page slug "${slug}":`, error);
    return {};
  }
}

/**
 * Extract Pods fields from a page object
 * Pods can store fields in various formats depending on configuration
 */
function extractPodsFields(page: Record<string, unknown>): Record<string, unknown> {
  const fields: Record<string, unknown> = {};
  
  // Method 1: Fields in meta object
  if (page.meta && typeof page.meta === 'object') {
    Object.assign(fields, page.meta);
  }
  
  // Method 2: Fields with pods_ prefix
  Object.entries(page).forEach(([key, value]) => {
    if (key.startsWith('pods_') || 
        ['hero_slides', 'mini_banners', 'medium_banner', 'brand_logos', 
         'brand_logos_title', 'customer_reviews', 'reviews_title', 
         'newsletter_section', 'product_showcases', 'seo_title', 'seo_description'
        ].includes(key)) {
      fields[key] = value;
    }
  });
  
  return fields;
}

/**
 * Try to fetch from Pods REST API directly
 * This requires the Pods REST API to be enabled
 */
export async function fetchFromPodsAPI(podName: string, params?: Record<string, string | number>): Promise<unknown[]> {
  try {
    const url = new URL(`${PODS_ENDPOINT}/${podName}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Pods API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch from Pods API (${podName}):`, error);
    return [];
  }
}

// Keep ACF function names for backward compatibility
export const fetchACFFields = fetchPodsFields;
export const fetchACFFieldsBySlug = fetchPodsFieldsBySlug;

// Legacy fetchACFOptions - not typically used with Pods but kept for compatibility
export async function fetchACFOptions(): Promise<Record<string, unknown>> {
  try {
    // Pods doesn't have a direct equivalent to ACF Options pages
    // You'd typically create a custom post type for global settings
    return {};
  } catch (error) {
    console.error('Failed to fetch options:', error);
    return {};
  }
}
