// ============================================
// Banners Fetcher - WordPress Custom Post Type
// Fetches banners from "banners" post type
// ============================================

import { fetchREST } from './rest/client';
import { wpAsset } from '@/lib/config/wordpress';

// Banner types matching WordPress categories (your actual slugs)
export type BannerType = 'hero-slide' | 'mini-banner-1' | 'mini-banner-2' | 'mini-banner-3' | 'mini-banner-4' | 'discover-product';

export interface Banner {
  id: number;
  title: string;
  imageUrl: string;
  link: string;
  alt: string;
  type: BannerType;
  order: number;
}

// Cache for banner type ID to slug mapping
let bannerTypeCache: Map<number, string> | null = null;

/**
 * Clear the banner type cache (useful when new types are added)
 */
export function clearBannerTypeCache(): void {
  bannerTypeCache = null;
}

/**
 * Rewrite old image URLs (with year/month) to flat structure (root uploads)
 * e.g., "https://.../2026/02/image.png" -> "https://.../image.png"
 */
function rewriteImageUrl(url: string): string {
  if (!url) return url;
  // Remove year/month pattern: /YYYY/MM/ or /2026/02/
  return url.replace(/\/\d{4}\/\d{2}\//g, '/');
}

/**
 * Decode HTML entities in text
 * e.g., "Alani Nu &#8211; Hero Banner" -> "Alani Nu - Hero Banner"
 */
function decodeHtmlEntities(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, '--')
    .replace(/&#8216;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8230;/g, '...')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#038;/g, '&')
    .replace(/&#039;/g, "'");
}

/**
 * Fetch banner type taxonomy terms to build ID -> slug mapping
 */
async function getBannerTypeMapping(): Promise<Map<number, string>> {
  // DEBUG: Log cache state
  if (bannerTypeCache) {
    console.log('[Banners] Using cached banner types:', Array.from(bannerTypeCache.entries()));
    return bannerTypeCache;
  }

  try {
    console.log('[Banners] Fetching banner types from API...');
    const response = await fetchREST<Array<{
      id: number;
      slug: string;
    }>>('/banner_type', {
      per_page: 100,
      hide_empty: false, // Include banner types even if they have no banners
    });

    console.log('[Banners] Banner types fetched:', response.length);
    
    const mapping = new Map<number, string>();
    for (const term of response) {
      mapping.set(term.id, term.slug);
      console.log(`[Banners] Mapping: ${term.id} -> ${term.slug}`);
    }

    bannerTypeCache = mapping;
    return mapping;
  } catch (error) {
    console.error('[Banners] Failed to fetch banner types:', error);
    return new Map<number, string>();
  }
}

/**
 * Fetch all published banners from WordPress
 */
export async function getBanners(): Promise<Banner[]> {
  try {
    // Clear cache for debugging (remove in production)
    bannerTypeCache = null;
    
    // Get banner type mapping first
    const typeMapping = await getBannerTypeMapping();
    console.log('[Banners] Type mapping size:', typeMapping.size);

    // Fetch from custom post type "banners"
    const response = await fetchREST<Array<{
      id: number;
      title: { rendered: string };
      link: string;
      meta?: {
        banner_link?: string;
      };
      banner_type?: number[];
      menu_order: number;
      featured_image_url?: string;
    }>>('/banners', {
      per_page: 20,
      orderby: 'menu_order',
      order: 'asc',
      status: 'publish',
    });

    console.log('[Banners] Fetched', response.length, 'banners from WordPress');
    
    return response.map((banner) => {
      // Get banner type ID and convert to slug
      const typeId = banner.banner_type?.[0];
      const typeSlug = typeId ? typeMapping.get(typeId) : '';
      
      // DEBUG
      if (!typeSlug) {
        console.log(`[Banners] Warning: No slug for typeId=${typeId} on banner ${banner.id}`);
      }
      
      // Decode HTML entities in title
      const decodedTitle = decodeHtmlEntities(banner.title.rendered);
      
      // Rewrite image URL to flat structure
      const imageUrl = rewriteImageUrl(banner.featured_image_url || '');
      
      return {
        id: banner.id,
        title: decodedTitle,
        imageUrl: imageUrl,
        link: banner.meta?.banner_link || '/shop',
        alt: decodedTitle,
        type: (typeSlug as BannerType) || 'hero-slide',
        order: banner.menu_order || 0,
      };
    }).filter(banner => banner.imageUrl);

  } catch (error) {
    console.error('Failed to fetch banners:', error);
    return [];
  }
}

/**
 * Get banners by type
 */
export async function getBannersByType(type: BannerType): Promise<Banner[]> {
  console.log(`[Banners] Getting banners by type: ${type}`);
  const allBanners = await getBanners();
  console.log(`[Banners] Total banners: ${allBanners.length}`);
  
  const filtered = allBanners
    .filter(banner => banner.type === type)
    .sort((a, b) => a.order - b.order);
  
  console.log(`[Banners] Found ${filtered.length} banners of type ${type}`);
  filtered.forEach(b => console.log(`  - ${b.title} (${b.imageUrl})`));
  
  return filtered;
}

/**
 * Get hero slides (multiple hero banners)
 */
export async function getHeroSlides(): Promise<Banner[]> {
  console.log('[Banners] getHeroSlides() called');
  try {
    const banners = await getBannersByType('hero-slide');
    console.log('[Banners] getHeroSlides() returning', banners.length, 'banners');
    return banners;
  } catch (error) {
    console.error('[Banners] getHeroSlides() ERROR:', error);
    return [];
  }
}

/**
 * Get mini banners (3 banners)
 */
export async function getMiniBanners(): Promise<Banner[]> {
  const types: BannerType[] = ['mini-banner-1', 'mini-banner-2', 'mini-banner-3'];
  const allBanners = await getBanners();
  
  return types
    .map(type => allBanners.find(b => b.type === type))
    .filter((b): b is Banner => b !== undefined);
}

/**
 * Get medium banner (mini-banner-4)
 */
export async function getMediumBanner(): Promise<Banner | null> {
  const banners = await getBannersByType('mini-banner-4');
  return banners[0] || null;
}

/**
 * Get product banners (for Discover Products carousel)
 * Returns all banners of type 'discover-product' sorted by order
 */
export async function getProductBanners(): Promise<Banner[]> {
  return getBannersByType('discover-product');
}

// Default banner as fallback - MAMMOTH ONLY (for testing)
// Using flat URL structure (wp-content/uploads/filename.jpg - no year/month subfolders)
export const defaultHeroSlides: Omit<Banner, 'id' | 'type' | 'order'>[] = [
  {
    title: 'Mammoth Supplements',
    imageUrl: wpAsset('Mammoth-Slider-1.png'),
    link: '/brands/mammoth',
    alt: 'Mammoth Supplements',
  },
];

export const defaultMiniBanners: Omit<Banner, 'id' | 'type' | 'order'>[] = [
  {
    title: '3 for $99',
    imageUrl: wpAsset('NF_3_for_99-2026.png'),
    link: '/product/mix-and-match-for-99/',
    alt: 'Bundles 3 for $99',
  },
  {
    title: 'Beat Any Price',
    imageUrl: wpAsset('shipping-2.png'),
    link: '/price-guarantee/',
    alt: 'Beat ANY Price by 10%',
  },
  {
    title: 'Free Shipping',
    imageUrl: wpAsset('shipping.png'),
    link: '/shop/',
    alt: 'Free Shipping / Free Hoodie / Free Shaker',
  },
];

export const defaultMediumBanner: Omit<Banner, 'id' | 'type' | 'order'> = {
  title: 'Best Creatine Prices',
  imageUrl: wpAsset('BEST-CREATINE-PRICES-1.png'),
  link: '/shop/creatine',
  alt: 'Best Creatine Prices',
};
