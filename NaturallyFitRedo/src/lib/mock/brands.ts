// ============================================
// MOCK BRANDS DATA
// ============================================

import type { ProductBrand } from "@/types/product";

export interface BrandWithDetails extends ProductBrand {
  description?: string;
  productCount: number;
  featured: boolean;
  website?: string;
}

// ============================================
// ALL BRANDS
// ============================================

export const brands: BrandWithDetails[] = [
  {
    id: "brand-1",
    name: "Alani Nu",
    slug: "alani-nu",
    logo: {
      sourceUrl: "https://nftest.dreamhosters.com/wp-content/uploads/2026/02/alani-nu.png",
      altText: "Alani Nu Logo",
    },
    description: "Premium supplements designed with women in mind.",
    productCount: 25,
    featured: true,
    website: "https://www.alaninu.com",
  },
  {
    id: "brand-2",
    name: "Cellucor",
    slug: "cellucor",
    logo: {
      sourceUrl: "https://nftest.dreamhosters.com/wp-content/uploads/2026/02/Cellucor.png",
      altText: "Cellucor Logo",
    },
    description: "Maker of America's #1 selling pre-workout, C4.",
    productCount: 32,
    featured: true,
    website: "https://www.cellucor.com",
  },
  {
    id: "brand-3",
    name: "Mammoth",
    slug: "mammoth",
    logo: {
      sourceUrl: "https://nftest.dreamhosters.com/wp-content/uploads/2026/02/Mammoth-1.png",
      altText: "Mammoth Logo",
    },
    description: "Canadian supplement brand with premium quality products.",
    productCount: 18,
    featured: true,
    website: "https://www.mammothsupplements.com",
  },
  {
    id: "brand-4",
    name: "Believe Supplements",
    slug: "believe-supplements",
    logo: {
      sourceUrl: "https://nftest.dreamhosters.com/wp-content/uploads/2026/02/Believe.png",
      altText: "Believe Supplements Logo",
    },
    description: "High-quality Canadian supplements for athletes.",
    productCount: 22,
    featured: true,
    website: "https://www.believesupplements.com",
  },
  {
    id: "brand-5",
    name: "Nutraphase",
    slug: "nutraphase",
    logo: {
      sourceUrl: "https://nftest.dreamhosters.com/wp-content/uploads/2026/02/nutraphase.png",
      altText: "Nutraphase Logo",
    },
    description: "Clean, effective supplements for everyday athletes.",
    productCount: 20,
    featured: true,
    website: "https://www.nutraphase.com",
  },
  {
    id: "brand-6",
    name: "Ghost",
    slug: "ghost",
    logo: {
      sourceUrl: "https://nftest.dreamhosters.com/wp-content/uploads/2026/02/Ghost_Logo.png",
      altText: "Ghost Logo",
    },
    description: "Be seen® - Premium lifestyle supplements.",
    productCount: 18,
    featured: true,
    website: "https://www.ghostlifestyle.com",
  },
  {
    id: "brand-7",
    name: "Grenade",
    slug: "grenade",
    logo: {
      sourceUrl: "https://nftest.dreamhosters.com/wp-content/uploads/2026/02/Grenade_Logo.png",
      altText: "Grenade Logo",
    },
    description: "High-protein snacks and supplements.",
    productCount: 15,
    featured: true,
    website: "https://www.grenade.com",
  },
  {
    id: "brand-8",
    name: "Anabar",
    slug: "anabar",
    logo: {
      sourceUrl: "https://nftest.dreamhosters.com/wp-content/uploads/2026/02/Anabar.png",
      altText: "Anabar Logo",
    },
    description: "Protein bars that taste like candy.",
    productCount: 8,
    featured: true,
    website: "https://www.anabar.com",
  },
  {
    id: "brand-9",
    name: "Advanced Genetics",
    slug: "advanced-genetics",
    logo: {
      sourceUrl: "https://nftest.dreamhosters.com/wp-content/uploads/2026/02/Advanced-Genetics.png",
      altText: "Advanced Genetics Logo",
    },
    description: "Hardcore bodybuilding supplements for serious athletes.",
    productCount: 14,
    featured: true,
    website: "https://www.advancedgenetics.com",
  },
];

// ============================================
// BRAND HELPERS
// ============================================

export function getBrandBySlug(slug: string): BrandWithDetails | undefined {
  return brands.find((brand) => brand.slug === slug);
}

export function getBrandById(id: string): BrandWithDetails | undefined {
  return brands.find((brand) => brand.id === id);
}

// ============================================
// FEATURED BRANDS
// ============================================

export const featuredBrands: BrandWithDetails[] = brands.filter(
  (brand) => brand.featured
);

// ============================================
// BRANDS SORTED BY PRODUCT COUNT
// ============================================

export const popularBrands: BrandWithDetails[] = [...brands]
  .sort((a, b) => b.productCount - a.productCount)
  .slice(0, 10);

// ============================================
// BRANDS SORTED ALPHABETICALLY
// ============================================

export const alphabeticalBrands: BrandWithDetails[] = [...brands].sort((a, b) =>
  a.name.localeCompare(b.name)
);
