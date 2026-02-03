// ============================================
// PODS Types (was ACF)
// For WordPress Homepage Content Management via Pods
// ============================================

// Hero Slide (Pods repeatable field)
export interface PodsHeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  cta_text: string;
  cta_link: string;
  secondary_cta_text?: string;
  secondary_cta_link?: string;
  image: {
    url: string;
    alt: string;
  };
  text_position?: 'left' | 'center' | 'right';
  overlay?: boolean;
}

// Mini Banner (for 3-banner row)
export interface PodsMiniBanner {
  image: {
    url: string;
    alt: string;
  };
  link: string;
}

// Medium Banner
export interface PodsMediumBanner {
  image: {
    url: string;
    alt: string;
  };
  link: string;
}

// Brand Logo (for brand carousel)
export interface PodsBrandLogo {
  name: string;
  logo: {
    url: string;
    alt: string;
  };
  link: string;
  description?: string;
}

// Customer Review
export interface PodsCustomerReview {
  name: string;
  rating: number;
  text: string;
  avatar?: {
    url: string;
    alt: string;
  };
}

// Newsletter Section
export interface PodsNewsletterSection {
  title: string;
  description: string;
  placeholder?: string;
  button_text?: string;
}

// Product Showcase Section
export interface PodsProductShowcase {
  title: string;
  subtitle?: string;
  type: 'featured' | 'bestsellers' | 'sale' | 'category';
  category_slug?: string;
  product_ids?: number[];
  limit?: number;
  view_all_link?: string;
  view_all_text?: string;
}

// Complete Homepage Content
export interface PodsHomepageContent {
  // Hero Carousel
  hero_slides: PodsHeroSlide[];
  
  // Three Mini Banners
  mini_banners: PodsMiniBanner[];
  
  // Medium Banner (Creatine/Featured)
  medium_banner: PodsMediumBanner;
  
  // Brand Logos Section
  brand_logos: {
    title: string;
    brands: PodsBrandLogo[];
  };
  
  // Customer Reviews
  reviews: {
    title: string;
    items: PodsCustomerReview[];
  };
  
  // Newsletter
  newsletter: PodsNewsletterSection;
  
  // Product Showcases
  product_showcases: PodsProductShowcase[];
  
  // SEO
  seo?: {
    title?: string;
    description?: string;
  };
}

// Pods API Response - Pods stores fields in meta or as direct properties
export interface PodsPageResponse {
  id: number;
  title: {
    rendered: string;
  };
  // Pods fields are typically in meta or as custom properties
  meta?: Record<string, unknown>;
  // Alternative: Pods might add fields directly to the object
  [key: string]: unknown;
  date: string;
  modified: string;
}

// Default/Fallback content
export const defaultHomepageContent: PodsHomepageContent = {
  hero_slides: [],
  mini_banners: [],
  medium_banner: {
    image: { url: '', alt: '' },
    link: '/shop',
  },
  brand_logos: {
    title: 'Discover Brands You\'ll Love',
    brands: [],
  },
  reviews: {
    title: 'What Customers Say',
    items: [],
  },
  newsletter: {
    title: 'Sign Up For Newsletter',
    description: 'Stay up to date with recent news, advice and weekly offers.',
    placeholder: 'Enter your email address',
    button_text: 'Subscribe',
  },
  product_showcases: [],
};

// Keep ACF types for backward compatibility (they're the same structure)
export type ACFHeroSlide = PodsHeroSlide;
export type ACFMiniBanner = PodsMiniBanner;
export type ACFMediumBanner = PodsMediumBanner;
export type ACFBrandLogo = PodsBrandLogo;
export type ACFCustomerReview = PodsCustomerReview;
export type ACFNewsletterSection = PodsNewsletterSection;
export type ACFProductShowcase = PodsProductShowcase;
export type ACFHomepageContent = PodsHomepageContent;
export type ACFPageResponse = PodsPageResponse;
