// ============================================
// Banners Fetcher - WordPress Custom Post Type
// Fetches banners from "banners" post type
// ============================================

import { fetchREST } from './rest/client';
import { wpAsset } from '@/lib/config/wordpress';

// Banner types matching WordPress categories (your actual slugs)
export type BannerType = 'hero-slides' | 'mini-banner-1' | 'mini-banner-2' | 'mini-banner-3' | 'mini-banner-4';

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
  if (bannerTypeCache) {
    return bannerTypeCache;
  }

  try {
    const response = await fetchREST<Array<{
      id: number;
      slug: string;
    }>>('/banner_type', {
      per_page: 100,
    });

    const mapping = new Map<number, string>();
    for (const term of response) {
      mapping.set(term.id, term.slug);
    }

    bannerTypeCache = mapping;
    return mapping;
  } catch (error) {
    console.error('Failed to fetch banner types:', error);
    return new Map<number, string>();
  }
}

/**
 * Fetch all published banners from WordPress
 */
export async function getBanners(): Promise<Banner[]> {
  try {
    // Get banner type mapping first
    const typeMapping = await getBannerTypeMapping();

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

    return response.map((banner) => {
      // Get banner type ID and convert to slug
      const typeId = banner.banner_type?.[0];
      const typeSlug = typeId ? typeMapping.get(typeId) : '';
      
      // Decode HTML entities in title
      const decodedTitle = decodeHtmlEntities(banner.title.rendered);
      
      return {
        id: banner.id,
        title: decodedTitle,
        imageUrl: banner.featured_image_url || '',
        link: banner.meta?.banner_link || '/shop',
        alt: decodedTitle,
        type: (typeSlug as BannerType) || 'hero-slides',
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
  const allBanners = await getBanners();
  return allBanners
    .filter(banner => banner.type === type)
    .sort((a, b) => a.order - b.order);
}

/**
 * Get hero slides (multiple hero banners)
 */
export async function getHeroSlides(): Promise<Banner[]> {
  return getBannersByType('hero-slides');
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

// Default banner as fallback - MAMMOTH ONLY (for testing)
export const defaultHeroSlides: Omit<Banner, 'id' | 'type' | 'order'>[] = [
  {
    title: 'Mammoth Supplements',
    imageUrl: wpAsset('2026/02/Mammoth-Slider-1.png'),
    link: '/brands/mammoth',
    alt: 'Mammoth Supplements',
  },
];

export const defaultMiniBanners: Omit<Banner, 'id' | 'type' | 'order'>[] = [
  {
    title: '3 for $99',
    imageUrl: wpAsset('2026/02/NF_3_for_99-2026.png'),
    link: '/product/mix-and-match-for-99/',
    alt: 'Bundles 3 for $99',
  },
  {
    title: 'Beat Any Price',
    imageUrl: wpAsset('2026/02/shipping-2.png'),
    link: '/price-guarantee/',
    alt: 'Beat ANY Price by 10%',
  },
  {
    title: 'Free Shipping',
    imageUrl: wpAsset('2026/02/shipping.png'),
    link: '/shop/',
    alt: 'Free Shipping / Free Hoodie / Free Shaker',
  },
];

export const defaultMediumBanner: Omit<Banner, 'id' | 'type' | 'order'> = {
  title: 'Best Creatine Prices',
  imageUrl: wpAsset('2026/02/BEST-CREATINE-PRICES-1.png'),
  link: '/shop/creatine',
  alt: 'Best Creatine Prices',
};
