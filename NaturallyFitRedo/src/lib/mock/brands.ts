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
// WORDPRESS BRAND LOGO REFERENCES
// ============================================
const WP_BRAND_LOGOS = {
  advancedGenetics: "https://naturallyfit.ca/wp-content/uploads/2024/04/Advanced-Genetics.png",
  alaniNu: "https://naturallyfit.ca/wp-content/uploads/2024/04/alani-nu.png",
  anabar: "https://naturallyfit.ca/wp-content/uploads/2024/04/Anabar.png",
  cellucor: "https://naturallyfit.ca/wp-content/uploads/2024/04/Cellucor.png",
  nutraphase: "https://naturallyfit.ca/wp-content/uploads/2024/04/nutraphase.png",
  tcNutrition: "https://naturallyfit.ca/wp-content/uploads/2024/04/TC-Nutrition.png",
  ams: "https://naturallyfit.ca/wp-content/uploads/2024/04/AMS.png",
  believe: "https://naturallyfit.ca/wp-content/uploads/2024/04/Believe.png",
  c4: "https://naturallyfit.ca/wp-content/uploads/2024/04/C4.png",
  mammoth: "https://naturallyfit.ca/wp-content/uploads/2024/04/Mammoth-1.png",
  mutant: "https://naturallyfit.ca/wp-content/uploads/2024/04/Mutant-1.png",
  perfect: "https://naturallyfit.ca/wp-content/uploads/2024/04/Perfect.png",
  teNutrition: "https://naturallyfit.ca/wp-content/uploads/2024/04/te-nutrition.png",
  vandel: "https://naturallyfit.ca/wp-content/uploads/2024/04/Vandel.png",
  yummy: "https://naturallyfit.ca/wp-content/uploads/2024/04/Yummy.png",
  batch: "https://naturallyfit.ca/wp-content/uploads/2024/04/batch-21.png",
};

// ============================================
// ALL BRANDS
// ============================================

export const brands: BrandWithDetails[] = [
  {
    id: "brand-1",
    name: "Advanced Genetics",
    slug: "advanced-genetics",
    logo: {
      sourceUrl: WP_BRAND_LOGOS.advancedGenetics,
      altText: "Advanced Genetics Logo",
    },
    description:
      "Advanced Genetics is a premium Canadian supplement brand known for high-quality formulations.",
    productCount: 45,
    featured: true,
    website: "https://www.advancedgenetics.com",
  },
  {
    id: "brand-2",
    name: "Alani Nu",
    slug: "alani-nu",
    logo: {
      sourceUrl: WP_BRAND_LOGOS.alaniNu,
      altText: "Alani Nu Logo",
    },
    description:
      "Alani Nu creates supplements designed with women in mind, featuring great-tasting products with effective formulations.",
    productCount: 38,
    featured: true,
    website: "https://www.alaninu.com",
  },
  {
    id: "brand-3",
    name: "Cellucor",
    slug: "cellucor",
    logo: {
      sourceUrl: WP_BRAND_LOGOS.cellucor,
      altText: "Cellucor Logo",
    },
    description:
      "Cellucor is the maker of America's #1 selling pre-workout, C4. Known for explosive energy formulas and quality supplements that deliver results.",
    productCount: 32,
    featured: true,
    website: "https://www.cellucor.com",
  },
  {
    id: "brand-4",
    name: "Mammoth",
    slug: "mammoth",
    logo: {
      sourceUrl: WP_BRAND_LOGOS.mammoth,
      altText: "Mammoth Logo",
    },
    description:
      "Mammoth Supplements is a Canadian brand known for mass gainers and muscle building supplements.",
    productCount: 28,
    featured: true,
    website: "https://www.mammothsupplements.com",
  },
  {
    id: "brand-5",
    name: "Believe Supplements",
    slug: "believe",
    logo: {
      sourceUrl: WP_BRAND_LOGOS.believe,
      altText: "Believe Supplements Logo",
    },
    description:
      "Believe Supplements offers premium quality supplements with transparent labeling and effective formulas.",
    productCount: 26,
    featured: true,
    website: "https://www.believesupplements.com",
  },
  {
    id: "brand-6",
    name: "TC Nutrition",
    slug: "tc-nutrition",
    logo: {
      sourceUrl: WP_BRAND_LOGOS.tcNutrition,
      altText: "TC Nutrition Logo",
    },
    description:
      "TC Nutrition creates high-quality sports supplements designed to help athletes evolve their training.",
    productCount: 22,
    featured: true,
    website: "https://www.tcnutrition.com",
  },
  {
    id: "brand-7",
    name: "Nutraphase",
    slug: "nutraphase",
    logo: {
      sourceUrl: WP_BRAND_LOGOS.nutraphase,
      altText: "Nutraphase Logo",
    },
    description:
      "Nutraphase is dedicated to creating clean, effective supplements with transparent ingredient lists.",
    productCount: 24,
    featured: true,
    website: "https://www.nutraphase.com",
  },
  {
    id: "brand-8",
    name: "Yummy Sports",
    slug: "yummy-sports",
    logo: {
      sourceUrl: WP_BRAND_LOGOS.yummy,
      altText: "Yummy Sports Logo",
    },
    description:
      "Yummy Sports creates supplements with amazing flavors and effective formulations.",
    productCount: 18,
    featured: true,
    website: "https://www.yummysports.com",
  },
  {
    id: "brand-9",
    name: "Perfect Sports",
    slug: "perfect-sports",
    logo: {
      sourceUrl: WP_BRAND_LOGOS.perfect,
      altText: "Perfect Sports Logo",
    },
    description:
      "Perfect Sports creates high-quality Canadian supplements with a focus on purity and effectiveness.",
    productCount: 16,
    featured: false,
    website: "https://www.perfectsports.com",
  },
  {
    id: "brand-10",
    name: "Mutant",
    slug: "mutant",
    logo: {
      sourceUrl: WP_BRAND_LOGOS.mutant,
      altText: "Mutant Logo",
    },
    description:
      "Mutant creates hardcore supplements for serious athletes looking to build mass and strength.",
    productCount: 14,
    featured: false,
  },
  {
    id: "brand-11",
    name: "VNDL Project",
    slug: "vndl",
    logo: {
      sourceUrl: WP_BRAND_LOGOS.vandel,
      altText: "VNDL Project Logo",
    },
    description:
      "VNDL Project creates performance-driven supplements for athletes seeking next-level results.",
    productCount: 20,
    featured: false,
  },
  {
    id: "brand-12",
    name: "Anabar",
    slug: "anabar",
    logo: {
      sourceUrl: WP_BRAND_LOGOS.anabar,
      altText: "Anabar Logo",
    },
    description:
      "Anabar creates delicious, protein-packed snack bars with real food ingredients.",
    productCount: 30,
    featured: true,
    website: "https://www.anabar.com",
  },
  {
    id: "brand-13",
    name: "AMS",
    slug: "ams",
    logo: {
      sourceUrl: WP_BRAND_LOGOS.ams,
      altText: "AMS Logo",
    },
    description:
      "AMS produces pharmaceutical-grade supplements with strict quality control.",
    productCount: 22,
    featured: false,
  },
  {
    id: "brand-14",
    name: "Batch 27",
    slug: "batch-27",
    logo: {
      sourceUrl: WP_BRAND_LOGOS.batch,
      altText: "Batch 27 Logo",
    },
    description:
      "Batch 27 creates premium supplements with innovative formulations.",
    productCount: 18,
    featured: false,
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
