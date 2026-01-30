// TypeScript Type Definitions for Sanity Documents
// These types match the Sanity schemas

import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Base Sanity Document
interface SanityDocument {
  _id: string;
  _type: string;
  _createdAt?: string;
  _updatedAt?: string;
}

// Image with alt text
export interface SanityImage extends SanityImageSource {
  alt?: string;
  caption?: string;
}

// Hero Slide
export interface HeroSlide extends SanityDocument {
  title: string;
  subtitle?: string;
  image: SanityImage;
  ctaText?: string;
  ctaLink?: string;
  order?: number;
  active?: boolean;
}

// Service
export interface Service extends SanityDocument {
  title: string;
  slug: { current: string };
  shortDescription?: string;
  description?: string;
  startingPrice?: string;
  pricingTiers?: PricingTier[];
  icon?: string;
  featuredImage?: SanityImage;
  gallery?: SanityImage[];
  order?: number;
}

export interface PricingTier {
  name: string;
  priceRange: string;
  description?: string;
}

// Gallery Item
export interface GalleryItem extends SanityDocument {
  title: string;
  category: GalleryCategory;
  image: SanityImage;
  beforeImage?: SanityImage;
  description?: string;
  client?: string;
  featured?: boolean;
  dateCreated?: string;
}

export type GalleryCategory =
  | 'sports'
  | 'corporate'
  | 'apparel'
  | 'signs'
  | 'engraving'
  | 'promo'
  | 'other';

export const categoryLabels: Record<GalleryCategory, string> = {
  sports: 'Sports Awards',
  corporate: 'Corporate Awards',
  apparel: 'Apparel',
  signs: 'Signs & Banners',
  engraving: 'Engraving',
  promo: 'Promotional Products',
  other: 'Other',
};

// Testimonial
export interface Testimonial extends SanityDocument {
  quote: string;
  author: string;
  organization?: string;
  role?: string;
  image?: SanityImage;
  featured?: boolean;
  rating?: number;
}

// About
export interface About {
  story?: string;
  mission?: string;
  yearsInBusiness?: number;
  foundedYear?: number;
  teamImage?: SanityImage;
  exteriorImage?: SanityImage;
  workshopImage?: SanityImage;
  ownerName?: string;
  ownerBio?: string;
}

// Site Settings
export interface SiteSettings {
  siteName?: string;
  tagline?: string;
  phone?: string;
  email?: string;
  address?: {
    street?: string;
    city?: string;
    province?: string;
    postalCode?: string;
  };
  hours?: Array<{
    days: string;
    hours: string;
  }>;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    google?: string;
  };
  googleMapsEmbed?: string;
}

// Quote Form
export interface QuoteFormData {
  name: string;
  email: string;
  phone?: string;
  service: string;
  message: string;
  attachments?: string[];
}
