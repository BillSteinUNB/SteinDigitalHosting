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
    name: "Optimum Nutrition",
    slug: "optimum-nutrition",
    logo: {
      sourceUrl: "/images/brands/optimum-nutrition.png",
      altText: "Optimum Nutrition Logo",
    },
    description:
      "Optimum Nutrition is the world's most awarded sports nutrition brand. Since 1986, ON has been setting the standard with high-quality products like Gold Standard 100% Whey.",
    productCount: 45,
    featured: true,
    website: "https://www.optimumnutrition.com",
  },
  {
    id: "brand-2",
    name: "MuscleTech",
    slug: "muscletech",
    logo: {
      sourceUrl: "/images/brands/muscletech.png",
      altText: "MuscleTech Logo",
    },
    description:
      "MuscleTech is America's #1 selling bodybuilding supplement brand. For over 20 years, MuscleTech has been developing cutting-edge formulas backed by science.",
    productCount: 38,
    featured: true,
    website: "https://www.muscletech.com",
  },
  {
    id: "brand-3",
    name: "Cellucor",
    slug: "cellucor",
    logo: {
      sourceUrl: "/images/brands/cellucor.png",
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
    name: "Ghost",
    slug: "ghost",
    logo: {
      sourceUrl: "/images/brands/ghost.png",
      altText: "GHOST Logo",
    },
    description:
      "GHOST is a lifestyle sports nutrition brand that believes in full label transparency. Known for legendary flavor collaborations with iconic candy and food brands.",
    productCount: 28,
    featured: true,
    website: "https://www.ghostlifestyle.com",
  },
  {
    id: "brand-5",
    name: "BSN",
    slug: "bsn",
    logo: {
      sourceUrl: "/images/brands/bsn.png",
      altText: "BSN Logo",
    },
    description:
      "BSN (Bio-Engineered Supplements and Nutrition) is a global leader in sports nutrition. Makers of legendary products like N.O.-XPLODE and SYNTHA-6.",
    productCount: 26,
    featured: true,
    website: "https://www.bsnonline.com",
  },
  {
    id: "brand-6",
    name: "EVL Nutrition",
    slug: "evl-nutrition",
    logo: {
      sourceUrl: "/images/brands/evl.png",
      altText: "EVL Nutrition Logo",
    },
    description:
      "EVL Nutrition creates high-quality sports supplements designed to help athletes evolve their training. Known for effective formulas at competitive prices.",
    productCount: 22,
    featured: true,
    website: "https://www.evlnutrition.com",
  },
  {
    id: "brand-7",
    name: "Dymatize",
    slug: "dymatize",
    logo: {
      sourceUrl: "/images/brands/dymatize.png",
      altText: "Dymatize Logo",
    },
    description:
      "Dymatize is dedicated to creating the highest quality sports nutrition products. ISO100, their flagship protein, is one of the most advanced whey isolates available.",
    productCount: 24,
    featured: true,
    website: "https://www.dymatize.com",
  },
  {
    id: "brand-8",
    name: "JYM Supplement Science",
    slug: "jym",
    logo: {
      sourceUrl: "/images/brands/jym.png",
      altText: "JYM Supplement Science Logo",
    },
    description:
      "JYM Supplement Science was founded by Dr. Jim Stoppani to create supplements based on real science with no proprietary blends and full transparency.",
    productCount: 18,
    featured: false,
    website: "https://www.jymsupplementscience.com",
  },
  {
    id: "brand-9",
    name: "Rule One Proteins",
    slug: "rule-one",
    logo: {
      sourceUrl: "/images/brands/rule-one.png",
      altText: "Rule One Proteins Logo",
    },
    description:
      "Rule One Proteins was founded by the original founders of Optimum Nutrition. Focused on quality proteins and supplements with simple, effective formulas.",
    productCount: 16,
    featured: false,
    website: "https://www.ruleoneproteins.com",
  },
  {
    id: "brand-10",
    name: "PEScience",
    slug: "pescience",
    logo: {
      sourceUrl: "/images/brands/pescience.png",
      altText: "PEScience Logo",
    },
    description:
      "PEScience creates innovative sports nutrition products focused on great taste and effective ingredients. Known for their Select Protein line.",
    productCount: 14,
    featured: false,
  },
  {
    id: "brand-11",
    name: "Nutrex Research",
    slug: "nutrex",
    logo: {
      sourceUrl: "/images/brands/nutrex.png",
      altText: "Nutrex Research Logo",
    },
    description:
      "Nutrex Research creates hardcore supplements for serious athletes. Known for LIPO-6 fat burners and Outlift pre-workouts.",
    productCount: 20,
    featured: false,
  },
  {
    id: "brand-12",
    name: "Redcon1",
    slug: "redcon1",
    logo: {
      sourceUrl: "/images/brands/redcon1.png",
      altText: "Redcon1 Logo",
    },
    description:
      "Redcon1 is a military-inspired supplement brand creating the highest state of readiness. Known for Total War pre-workout and MRE meal replacements.",
    productCount: 30,
    featured: true,
    website: "https://www.redcon1.com",
  },
  {
    id: "brand-13",
    name: "Allmax Nutrition",
    slug: "allmax",
    logo: {
      sourceUrl: "/images/brands/allmax.png",
      altText: "Allmax Nutrition Logo",
    },
    description:
      "Allmax Nutrition produces pharmaceutical-grade supplements with strict quality control. Canadian brand known for IsoFlex protein.",
    productCount: 22,
    featured: false,
  },
  {
    id: "brand-14",
    name: "GAT Sport",
    slug: "gat-sport",
    logo: {
      sourceUrl: "/images/brands/gat.png",
      altText: "GAT Sport Logo",
    },
    description:
      "GAT Sport creates clinically-dosed supplements for athletes seeking peak performance. Known for Nitraflex pre-workout.",
    productCount: 18,
    featured: false,
  },
  {
    id: "brand-15",
    name: "Quest Nutrition",
    slug: "quest",
    logo: {
      sourceUrl: "/images/brands/quest.png",
      altText: "Quest Nutrition Logo",
    },
    description:
      "Quest Nutrition revolutionized the protein bar category. Known for high-protein, low-sugar snacks that taste like treats.",
    productCount: 35,
    featured: true,
    website: "https://www.questnutrition.com",
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
