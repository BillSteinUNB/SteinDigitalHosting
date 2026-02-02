// ============================================
// MOCK CATEGORIES DATA - WooCommerce Structure
// ============================================

import type { ProductCategory } from "@/types/product";

export interface CategoryWithCount extends ProductCategory {
  productCount: number;
  description?: string;
  children?: CategoryWithCount[];
}

// ============================================
// WORDPRESS CATEGORY IMAGE REFERENCES
// ============================================
const WP_CATEGORY_IMAGES = {
  nfCategory: "https://naturallyfit.ca/wp-content/uploads/2018/02/categories-nf.jpg",
  featuredProduct1: "https://naturallyfit.ca/wp-content/uploads/2024/11/Untitled-design-14.png",
  featuredProduct2: "https://naturallyfit.ca/wp-content/uploads/2024/11/Untitled-design-15.png",
  featuredProduct3: "https://naturallyfit.ca/wp-content/uploads/2024/11/Untitled-design-16.png",
  featuredProduct4: "https://naturallyfit.ca/wp-content/uploads/2024/11/Untitled-design-17.png",
  featuredProduct5: "https://naturallyfit.ca/wp-content/uploads/2024/11/Untitled-design-18.png",
  featuredProduct6: "https://naturallyfit.ca/wp-content/uploads/2024/11/Untitled-design-19.png",
  featuredProduct7: "https://naturallyfit.ca/wp-content/uploads/2024/11/Untitled-design-20.png",
  featuredProduct8: "https://naturallyfit.ca/wp-content/uploads/2024/11/Untitled-design-21.png",
};

// ============================================
// MAIN CATEGORIES (Matching WooCommerce CSV Export)
// ============================================

export const categories: CategoryWithCount[] = [
  {
    id: "cat-brands",
    name: "Brands",
    slug: "brands",
    productCount: 245,
    description: "Shop by your favorite supplement brands.",
    image: {
      sourceUrl: WP_CATEGORY_IMAGES.nfCategory,
      altText: "Supplement Brands",
    },
    children: [
      {
        id: "cat-brand-1",
        name: "Advanced Genetics",
        slug: "advanced-genetics",
        productCount: 12,
        description: "Premium Canadian supplement brand.",
        parent: { id: "cat-brands", name: "Brands", slug: "brands" },
      },
      {
        id: "cat-brand-2",
        name: "Perfect Sports",
        slug: "perfect-sports",
        productCount: 18,
        description: "High-quality sports nutrition products.",
        parent: { id: "cat-brands", name: "Brands", slug: "brands" },
      },
      {
        id: "cat-brand-3",
        name: "Mammoth",
        slug: "mammoth",
        productCount: 15,
        description: "Mass gainers and muscle building supplements.",
        parent: { id: "cat-brands", name: "Brands", slug: "brands" },
      },
      {
        id: "cat-brand-4",
        name: "ANS",
        slug: "ans",
        productCount: 22,
        description: "Advanced Nutrition Systems performance supplements.",
        parent: { id: "cat-brands", name: "Brands", slug: "brands" },
      },
      {
        id: "cat-brand-5",
        name: "Quest",
        slug: "quest",
        productCount: 28,
        description: "Protein bars and healthy snacks.",
        parent: { id: "cat-brands", name: "Brands", slug: "brands" },
      },
      {
        id: "cat-brand-6",
        name: "Mars Inc.",
        slug: "mars-inc",
        productCount: 14,
        description: "Popular protein snack products.",
        parent: { id: "cat-brands", name: "Brands", slug: "brands" },
      },
      {
        id: "cat-brand-7",
        name: "Grenade",
        slug: "grenade",
        productCount: 16,
        description: "High-protein snacks and supplements.",
        parent: { id: "cat-brands", name: "Brands", slug: "brands" },
      },
      {
        id: "cat-brand-8",
        name: "P2B Peanut Butter",
        slug: "p2b-peanut-butter",
        productCount: 8,
        description: "Powdered peanut butter products.",
        parent: { id: "cat-brands", name: "Brands", slug: "brands" },
      },
      {
        id: "cat-brand-9",
        name: "Lenny & Larry's",
        slug: "lenny-larrys",
        productCount: 10,
        description: "Protein cookies and baked snacks.",
        parent: { id: "cat-brands", name: "Brands", slug: "brands" },
      },
      {
        id: "cat-brand-10",
        name: "NutraPhase",
        slug: "nutraphase",
        productCount: 20,
        description: "Clean and effective supplements.",
        parent: { id: "cat-brands", name: "Brands", slug: "brands" },
      },
      {
        id: "cat-brand-11",
        name: "Cellucor",
        slug: "cellucor",
        productCount: 24,
        description: "C4 pre-workout and performance products.",
        parent: { id: "cat-brands", name: "Brands", slug: "brands" },
      },
      {
        id: "cat-brand-12",
        name: "ProSupps",
        slug: "prosupps",
        productCount: 18,
        description: "High-quality pre-workout and protein.",
        parent: { id: "cat-brands", name: "Brands", slug: "brands" },
      },
    ],
  },
  {
    id: "cat-protein",
    name: "Protein",
    slug: "protein",
    productCount: 156,
    description: "High-quality protein powders, bars, and drinks to fuel your gains.",
    image: {
      sourceUrl: "https://nftest.dreamhosters.com/wp-content/uploads/2026/02/perfect-sports-perfect-whey-4-4lb-triple-rich-dark-chocolate-mixed-source-whey-protein-11978618470479.png",
      altText: "Protein Supplements",
    },
    children: [
      {
        id: "cat-protein-1",
        name: "Protein Powder",
        slug: "protein-powder",
        productCount: 78,
        description: "Whey, isolate, and plant-based protein powders.",
        parent: { id: "cat-protein", name: "Protein", slug: "protein" },
      },
      {
        id: "cat-protein-2",
        name: "Protein Bars",
        slug: "protein-bars",
        productCount: 45,
        description: "Convenient protein-packed snack bars.",
        parent: { id: "cat-protein", name: "Protein", slug: "protein" },
      },
      {
        id: "cat-protein-3",
        name: "Protein Chips",
        slug: "protein-chips",
        productCount: 18,
        description: "High-protein savory snack chips.",
        parent: { id: "cat-protein", name: "Protein", slug: "protein" },
      },
      {
        id: "cat-protein-4",
        name: "Protein Drinks",
        slug: "protein-drinks",
        productCount: 15,
        description: "Ready-to-drink protein shakes.",
        parent: { id: "cat-protein", name: "Protein", slug: "protein" },
      },
    ],
  },
  {
    id: "cat-preworkout",
    name: "Pre-Workout",
    slug: "pre-workout",
    productCount: 89,
    description: "Boost your energy and performance before training.",
    image: {
      sourceUrl: WP_CATEGORY_IMAGES.featuredProduct2,
      altText: "Pre-Workout Supplements",
    },
    children: [
      {
        id: "cat-preworkout-1",
        name: "Caffeine",
        slug: "caffeine",
        productCount: 42,
        description: "Energy-boosting caffeine supplements and pre-workouts.",
        parent: { id: "cat-preworkout", name: "Pre-Workout", slug: "pre-workout" },
      },
      {
        id: "cat-preworkout-2",
        name: "Pump",
        slug: "pump",
        productCount: 35,
        description: "Nitric oxide boosters and pump enhancers.",
        parent: { id: "cat-preworkout", name: "Pre-Workout", slug: "pre-workout" },
      },
    ],
  },
  {
    id: "cat-fatburners",
    name: "Fat Burners",
    slug: "fat-burners",
    productCount: 67,
    description: "Thermogenic and metabolic support for weight management.",
    image: {
      sourceUrl: "https://nftest.dreamhosters.com/wp-content/uploads/2026/02/cherryslushy1_900x.webp",
      altText: "Fat Burner Supplements",
    },
    children: [
      {
        id: "cat-fatburners-1",
        name: "Energy",
        slug: "energy",
        productCount: 23,
        description: "Energy-boosting fat burners.",
        parent: { id: "cat-fatburners", name: "Fat Burners", slug: "fat-burners" },
      },
      {
        id: "cat-fatburners-2",
        name: "Fat Loss",
        slug: "fat-loss",
        productCount: 28,
        description: "Targeted fat loss support formulas.",
        parent: { id: "cat-fatburners", name: "Fat Burners", slug: "fat-burners" },
      },
      {
        id: "cat-fatburners-3",
        name: "Weight Loss",
        slug: "weight-loss",
        productCount: 16,
        description: "Comprehensive weight loss solutions.",
        parent: { id: "cat-fatburners", name: "Fat Burners", slug: "fat-burners" },
      },
    ],
  },
  {
    id: "cat-recovery",
    name: "Recovery",
    slug: "recovery",
    productCount: 94,
    description: "Optimize your recovery and reduce muscle soreness.",
    image: {
      sourceUrl: "https://nftest.dreamhosters.com/wp-content/uploads/2026/02/mammoth-bcaa-40-servings-white-grape-Naturally-Fit.webp",
      altText: "Recovery Supplements",
    },
    children: [
      {
        id: "cat-recovery-1",
        name: "Post-Workout",
        slug: "post-workout",
        productCount: 45,
        description: "Complete post-workout recovery formulas.",
        parent: { id: "cat-recovery", name: "Recovery", slug: "recovery" },
      },
      {
        id: "cat-recovery-2",
        name: "BCAA's/EAA's",
        slug: "bcaas-eaas",
        productCount: 38,
        description: "Essential amino acids for muscle recovery.",
        parent: { id: "cat-recovery", name: "Recovery", slug: "recovery" },
      },
    ],
  },
  {
    id: "cat-weightgainer",
    name: "Weight Gainer",
    slug: "weight-gainer",
    productCount: 52,
    description: "High-calorie formulas for building mass and muscle.",
    image: {
      sourceUrl: WP_CATEGORY_IMAGES.featuredProduct5,
      altText: "Weight Gainer Supplements",
    },
    children: [
      {
        id: "cat-weightgainer-1",
        name: "Gainers",
        slug: "gainers",
        productCount: 22,
        description: "High-calorie mass gainers.",
        parent: { id: "cat-weightgainer", name: "Weight Gainer", slug: "weight-gainer" },
      },
      {
        id: "cat-weightgainer-2",
        name: "Mass",
        slug: "mass",
        productCount: 18,
        description: "Serious mass building formulas.",
        parent: { id: "cat-weightgainer", name: "Weight Gainer", slug: "weight-gainer" },
      },
      {
        id: "cat-weightgainer-3",
        name: "Muscle Builders",
        slug: "muscle-builders",
        productCount: 12,
        description: "Creatine and muscle building supplements.",
        parent: { id: "cat-weightgainer", name: "Weight Gainer", slug: "weight-gainer" },
        image: {
          sourceUrl: "https://nftest.dreamhosters.com/wp-content/uploads/2026/02/musclemeds-carnivor-4lb-vanilla-caramel-Naturally-Fit.webp",
          altText: "Muscle Builder Supplements",
        },
      },
    ],
  },
  {
    id: "cat-snacks",
    name: "Snacks & Drinks",
    slug: "snacks-drinks",
    productCount: 128,
    description: "Healthy snacks, drinks, and on-the-go nutrition.",
    image: {
      sourceUrl: WP_CATEGORY_IMAGES.featuredProduct6,
      altText: "Healthy Snacks and Drinks",
    },
    children: [
      {
        id: "cat-snacks-1",
        name: "Snacks & Foods",
        slug: "snacks-foods",
        productCount: 45,
        description: "Protein-packed snacks and healthy foods.",
        parent: { id: "cat-snacks", name: "Snacks & Drinks", slug: "snacks-drinks" },
      },
      {
        id: "cat-snacks-2",
        name: "Chips",
        slug: "chips",
        productCount: 24,
        description: "Protein chips and savory snacks.",
        parent: { id: "cat-snacks", name: "Snacks & Drinks", slug: "snacks-drinks" },
      },
      {
        id: "cat-snacks-3",
        name: "Bars",
        slug: "bars",
        productCount: 59,
        description: "Protein bars and snack bars.",
        parent: { id: "cat-snacks", name: "Snacks & Drinks", slug: "snacks-drinks" },
      },
    ],
  },
  {
    id: "cat-dietary",
    name: "Dietary Supplement",
    slug: "dietary-supplement",
    productCount: 76,
    description: "Specialized dietary supplements for health and performance.",
    image: {
      sourceUrl: WP_CATEGORY_IMAGES.featuredProduct7,
      altText: "Dietary Supplements",
    },
    children: [
      {
        id: "cat-dietary-1",
        name: "Amino Acids",
        slug: "amino-acids",
        productCount: 38,
        description: "Essential and non-essential amino acid supplements.",
        parent: { id: "cat-dietary", name: "Dietary Supplement", slug: "dietary-supplement" },
      },
      {
        id: "cat-dietary-2",
        name: "Joint Health/Repair",
        slug: "joint-health-repair",
        productCount: 28,
        description: "Glucosamine, collagen, and joint support formulas.",
        parent: { id: "cat-dietary", name: "Dietary Supplement", slug: "dietary-supplement" },
      },
    ],
  },
  {
    id: "cat-health",
    name: "Health & Balance",
    slug: "health-balance",
    productCount: 112,
    description: "Vitamins, minerals, and wellness supplements for overall health.",
    image: {
      sourceUrl: "https://nftest.dreamhosters.com/wp-content/uploads/2026/02/CAN-Multivitamin-scaled.png",
      altText: "Health and Balance Supplements",
    },
    children: [
      {
        id: "cat-health-1",
        name: "Greens",
        slug: "greens",
        productCount: 24,
        description: "Superfood and greens powder blends.",
        parent: { id: "cat-health", name: "Health & Balance", slug: "health-balance" },
      },
      {
        id: "cat-health-2",
        name: "Detox/Cleanse",
        slug: "detox-cleanse",
        productCount: 18,
        description: "Detox and cleanse support supplements.",
        parent: { id: "cat-health", name: "Health & Balance", slug: "health-balance" },
      },
      {
        id: "cat-health-3",
        name: "Nootropic",
        slug: "nootropic",
        productCount: 22,
        description: "Cognitive enhancement and brain health supplements.",
        parent: { id: "cat-health", name: "Health & Balance", slug: "health-balance" },
      },
      {
        id: "cat-health-4",
        name: "Testosterone Boosters",
        slug: "testosterone-boosters",
        productCount: 15,
        description: "Natural testosterone support formulas.",
        parent: { id: "cat-health", name: "Health & Balance", slug: "health-balance" },
      },
    ],
  },
  {
    id: "cat-featured",
    name: "Featured Products",
    slug: "featured-products",
    productCount: 24,
    description: "Special featured products and exclusive bundles.",
    image: {
      sourceUrl: WP_CATEGORY_IMAGES.nfCategory,
      altText: "Featured Products",
    },
    children: [
      {
        id: "cat-featured-1",
        name: "Bundle",
        slug: "bundle",
        productCount: 12,
        description: "Curated supplement bundles at great prices.",
        parent: { id: "cat-featured", name: "Featured Products", slug: "featured-products" },
      },
    ],
  },
];

// ============================================
// FLAT CATEGORIES (for filters/selects)
// ============================================

export function flattenCategories(
  cats: CategoryWithCount[],
  result: CategoryWithCount[] = []
): CategoryWithCount[] {
  for (const cat of cats) {
    result.push(cat);
    if (cat.children) {
      flattenCategories(cat.children, result);
    }
  }
  return result;
}

export const allCategories: CategoryWithCount[] = flattenCategories(categories);

// ============================================
// TOP-LEVEL CATEGORIES ONLY
// ============================================

export const topLevelCategories: CategoryWithCount[] = categories;

// ============================================
// CATEGORY HELPERS
// ============================================

export function getCategoryBySlug(slug: string): CategoryWithCount | undefined {
  return allCategories.find((cat) => cat.slug === slug);
}

export function getCategoryById(id: string): CategoryWithCount | undefined {
  return allCategories.find((cat) => cat.id === id);
}

export function getSubcategories(parentSlug: string): CategoryWithCount[] {
  const parent = getCategoryBySlug(parentSlug);
  return parent?.children || [];
}

// ============================================
// HOMEPAGE FEATURED CATEGORIES
// ============================================

// Muscle Builders category (main level)
export const muscleBuildersCategory: CategoryWithCount = {
  id: "cat-musclebuilders",
  name: "Muscle Builders",
  slug: "muscle-builders",
  productCount: 45,
  description: "Creatine and muscle building supplements.",
  image: {
    sourceUrl: "https://nftest.dreamhosters.com/wp-content/uploads/2026/02/musclemeds-carnivor-4lb-vanilla-caramel-Naturally-Fit.webp",
    altText: "Muscle Builder Supplements",
  },
};

export const featuredCategories: CategoryWithCount[] = [
  categories[1], // Protein
  categories[3], // Fat Burners
  muscleBuildersCategory, // Muscle Builders
  categories[4], // Recovery
  categories[8], // Health & Balance
];
