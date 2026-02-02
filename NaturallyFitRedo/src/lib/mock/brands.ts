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
  {
    id: "brand-10",
    name: "Quest Nutrition",
    slug: "quest",
    logo: {
      sourceUrl: "https://nftest.dreamhosters.com/wp-content/uploads/2026/02/Quest.png",
      altText: "Quest Nutrition Logo",
    },
    description: "High-protein snacks and supplements for fitness enthusiasts.",
    productCount: 28,
    featured: true,
    website: "https://www.questnutrition.com",
  },
  {
    id: "brand-11",
    name: "TC Nutrition",
    slug: "tc-nutrition",
    logo: {
      sourceUrl: "https://nftest.dreamhosters.com/wp-content/uploads/2026/02/TC-Nutrition.png",
      altText: "TC Nutrition Logo",
    },
    description: "Premium Canadian sports nutrition supplements.",
    productCount: 16,
    featured: true,
    website: "https://www.tcnutrition.ca",
  },
  {
    id: "brand-12",
    name: "Work Water",
    slug: "work-water",
    logo: {
      sourceUrl: "https://nftest.dreamhosters.com/wp-content/uploads/2026/02/Work-Water.png",
      altText: "Work Water Logo",
    },
    description: "Hydration products for active lifestyles.",
    productCount: 6,
    featured: true,
    website: "https://www.workwater.com",
  },
  {
    id: "brand-13",
    name: "Yummy Sports",
    slug: "yummy-sports",
    logo: {
      sourceUrl: "https://nftest.dreamhosters.com/wp-content/uploads/2026/02/YummySports.png",
      altText: "Yummy Sports Logo",
    },
    description: "Delicious tasting sports nutrition supplements.",
    productCount: 12,
    featured: true,
    website: "https://www.yummysports.com",
  },
  {
    id: "brand-14",
    name: "VNDL Project",
    slug: "vndl",
    logo: {
      sourceUrl: "https://nftest.dreamhosters.com/wp-content/uploads/2026/02/VNDL.png",
      altText: "VNDL Project Logo",
    },
    description: "Performance driven supplements for serious athletes.",
    productCount: 19,
    featured: true,
    website: "https://www.vndlproject.com",
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
