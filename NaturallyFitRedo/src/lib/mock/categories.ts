// ============================================
// MOCK CATEGORIES DATA
// ============================================

import type { ProductCategory } from "@/types/product";

export interface CategoryWithCount extends ProductCategory {
  productCount: number;
  description?: string;
  children?: CategoryWithCount[];
}

// ============================================
// MAIN CATEGORIES
// ============================================

export const categories: CategoryWithCount[] = [
  {
    id: "cat-1",
    name: "Protein",
    slug: "protein",
    productCount: 156,
    description: "High-quality protein powders, bars, and supplements to fuel your gains.",
    image: {
      sourceUrl: "https://placehold.co/400x300/1a1a2e/eee?text=Protein",
      altText: "Protein Supplements",
    },
    children: [
      {
        id: "cat-2",
        name: "Whey Protein",
        slug: "whey-protein",
        productCount: 78,
        description: "Fast-absorbing whey protein for post-workout recovery.",
        parent: { id: "cat-1", name: "Protein", slug: "protein" },
      },
      {
        id: "cat-6",
        name: "Whey Isolate",
        slug: "whey-isolate",
        productCount: 34,
        description: "Ultra-pure whey isolate with minimal fat and carbs.",
        parent: { id: "cat-1", name: "Protein", slug: "protein" },
      },
      {
        id: "cat-11",
        name: "Casein Protein",
        slug: "casein-protein",
        productCount: 18,
        description: "Slow-release protein perfect for overnight recovery.",
        parent: { id: "cat-1", name: "Protein", slug: "protein" },
      },
      {
        id: "cat-12",
        name: "Plant Protein",
        slug: "plant-protein",
        productCount: 26,
        description: "Vegan-friendly plant-based protein options.",
        parent: { id: "cat-1", name: "Protein", slug: "protein" },
      },
      {
        id: "cat-13",
        name: "Protein Bars",
        slug: "protein-bars",
        productCount: 45,
        description: "Convenient protein-packed snack bars.",
        parent: { id: "cat-1", name: "Protein", slug: "protein" },
      },
    ],
  },
  {
    id: "cat-3",
    name: "Pre-Workout",
    slug: "pre-workout",
    productCount: 89,
    description: "Boost your energy and performance before training.",
    image: {
      sourceUrl: "https://placehold.co/400x300/1a1a2e/eee?text=Pre-Workout",
      altText: "Pre-Workout Supplements",
    },
    children: [
      {
        id: "cat-14",
        name: "Stimulant Pre-Workout",
        slug: "stimulant-pre-workout",
        productCount: 52,
        description: "High-caffeine formulas for maximum energy.",
        parent: { id: "cat-3", name: "Pre-Workout", slug: "pre-workout" },
      },
      {
        id: "cat-15",
        name: "Stim-Free Pre-Workout",
        slug: "stim-free-pre-workout",
        productCount: 22,
        description: "Caffeine-free options for evening workouts.",
        parent: { id: "cat-3", name: "Pre-Workout", slug: "pre-workout" },
      },
      {
        id: "cat-16",
        name: "Pump Products",
        slug: "pump-products",
        productCount: 15,
        description: "Nitric oxide boosters for maximum muscle pumps.",
        parent: { id: "cat-3", name: "Pre-Workout", slug: "pre-workout" },
      },
    ],
  },
  {
    id: "cat-4",
    name: "Fat Burners",
    slug: "fat-burners",
    productCount: 67,
    description: "Thermogenic and metabolic support for weight management.",
    image: {
      sourceUrl: "https://placehold.co/400x300/1a1a2e/eee?text=Fat+Burners",
      altText: "Fat Burner Supplements",
    },
    children: [
      {
        id: "cat-5",
        name: "Weight Loss",
        slug: "weight-loss",
        productCount: 34,
        description: "Comprehensive weight loss support formulas.",
        parent: { id: "cat-4", name: "Fat Burners", slug: "fat-burners" },
      },
      {
        id: "cat-9",
        name: "Energy",
        slug: "energy",
        productCount: 23,
        description: "Energy-boosting supplements and drinks.",
        parent: { id: "cat-4", name: "Fat Burners", slug: "fat-burners" },
      },
      {
        id: "cat-17",
        name: "Thermogenics",
        slug: "thermogenics",
        productCount: 28,
        description: "Heat-generating fat burners for increased calorie burn.",
        parent: { id: "cat-4", name: "Fat Burners", slug: "fat-burners" },
      },
    ],
  },
  {
    id: "cat-7",
    name: "Recovery",
    slug: "recovery",
    productCount: 94,
    description: "Optimize your recovery and reduce muscle soreness.",
    image: {
      sourceUrl: "https://placehold.co/400x300/1a1a2e/eee?text=Recovery",
      altText: "Recovery Supplements",
    },
    children: [
      {
        id: "cat-10",
        name: "BCAAs/EAAs",
        slug: "bcaas-eaas",
        productCount: 38,
        description: "Essential amino acids for muscle recovery.",
        parent: { id: "cat-7", name: "Recovery", slug: "recovery" },
      },
      {
        id: "cat-18",
        name: "Post-Workout",
        slug: "post-workout",
        productCount: 24,
        description: "Complete post-workout recovery formulas.",
        parent: { id: "cat-7", name: "Recovery", slug: "recovery" },
      },
      {
        id: "cat-19",
        name: "Electrolytes",
        slug: "electrolytes",
        productCount: 19,
        description: "Replenish minerals lost during intense training.",
        parent: { id: "cat-7", name: "Recovery", slug: "recovery" },
      },
      {
        id: "cat-8",
        name: "Muscle Builders",
        slug: "muscle-builders",
        productCount: 31,
        description: "Creatine and other muscle-building supplements.",
        parent: { id: "cat-7", name: "Recovery", slug: "recovery" },
      },
    ],
  },
  {
    id: "cat-20",
    name: "Weight Gainers",
    slug: "weight-gainers",
    productCount: 32,
    description: "High-calorie formulas for building mass.",
    image: {
      sourceUrl: "https://placehold.co/400x300/1a1a2e/eee?text=Weight+Gainers",
      altText: "Weight Gainer Supplements",
    },
    children: [
      {
        id: "cat-21",
        name: "Mass Gainers",
        slug: "mass-gainers",
        productCount: 18,
        description: "Maximum calorie shakes for serious mass.",
        parent: { id: "cat-20", name: "Weight Gainers", slug: "weight-gainers" },
      },
      {
        id: "cat-22",
        name: "Lean Gainers",
        slug: "lean-gainers",
        productCount: 14,
        description: "Lower calorie options for lean muscle gains.",
        parent: { id: "cat-20", name: "Weight Gainers", slug: "weight-gainers" },
      },
    ],
  },
  {
    id: "cat-23",
    name: "Health & Wellness",
    slug: "health-wellness",
    productCount: 128,
    description: "Vitamins, minerals, and general health supplements.",
    image: {
      sourceUrl: "https://placehold.co/400x300/1a1a2e/eee?text=Health+%26+Wellness",
      altText: "Health & Wellness Supplements",
    },
    children: [
      {
        id: "cat-24",
        name: "Multivitamins",
        slug: "multivitamins",
        productCount: 34,
        description: "Complete daily vitamin and mineral formulas.",
        parent: { id: "cat-23", name: "Health & Wellness", slug: "health-wellness" },
      },
      {
        id: "cat-25",
        name: "Omega-3",
        slug: "omega-3",
        productCount: 22,
        description: "Fish oil and omega fatty acid supplements.",
        parent: { id: "cat-23", name: "Health & Wellness", slug: "health-wellness" },
      },
      {
        id: "cat-26",
        name: "Joint Support",
        slug: "joint-support",
        productCount: 28,
        description: "Glucosamine, collagen, and joint health formulas.",
        parent: { id: "cat-23", name: "Health & Wellness", slug: "health-wellness" },
      },
      {
        id: "cat-27",
        name: "Greens",
        slug: "greens",
        productCount: 19,
        description: "Superfood and greens powder blends.",
        parent: { id: "cat-23", name: "Health & Wellness", slug: "health-wellness" },
      },
      {
        id: "cat-28",
        name: "Sleep & Recovery",
        slug: "sleep-recovery",
        productCount: 15,
        description: "Natural sleep aids and recovery support.",
        parent: { id: "cat-23", name: "Health & Wellness", slug: "health-wellness" },
      },
    ],
  },
  {
    id: "cat-29",
    name: "Snacks & Drinks",
    slug: "snacks-drinks",
    productCount: 76,
    description: "Healthy snacks, drinks, and on-the-go nutrition.",
    image: {
      sourceUrl: "https://placehold.co/400x300/1a1a2e/eee?text=Snacks+%26+Drinks",
      altText: "Healthy Snacks and Drinks",
    },
    children: [
      {
        id: "cat-30",
        name: "Energy Drinks",
        slug: "energy-drinks",
        productCount: 28,
        description: "Low-calorie energy drinks and RTDs.",
        parent: { id: "cat-29", name: "Snacks & Drinks", slug: "snacks-drinks" },
      },
      {
        id: "cat-31",
        name: "Protein Snacks",
        slug: "protein-snacks",
        productCount: 32,
        description: "Protein cookies, chips, and healthy snacks.",
        parent: { id: "cat-29", name: "Snacks & Drinks", slug: "snacks-drinks" },
      },
      {
        id: "cat-32",
        name: "Sugar-Free Syrups",
        slug: "sugar-free-syrups",
        productCount: 16,
        description: "Zero-calorie syrups and flavor enhancers.",
        parent: { id: "cat-29", name: "Snacks & Drinks", slug: "snacks-drinks" },
      },
    ],
  },
  {
    id: "cat-33",
    name: "Apparel",
    slug: "apparel",
    productCount: 48,
    description: "Naturally Fit branded clothing and accessories.",
    image: {
      sourceUrl: "https://placehold.co/400x300/1a1a2e/eee?text=Apparel",
      altText: "Naturally Fit Apparel",
    },
    children: [
      {
        id: "cat-34",
        name: "T-Shirts",
        slug: "t-shirts",
        productCount: 18,
        description: "Athletic t-shirts and tank tops.",
        parent: { id: "cat-33", name: "Apparel", slug: "apparel" },
      },
      {
        id: "cat-35",
        name: "Hoodies",
        slug: "hoodies",
        productCount: 12,
        description: "Comfortable hoodies and sweatshirts.",
        parent: { id: "cat-33", name: "Apparel", slug: "apparel" },
      },
      {
        id: "cat-36",
        name: "Accessories",
        slug: "accessories",
        productCount: 18,
        description: "Shaker bottles, gym bags, and more.",
        parent: { id: "cat-33", name: "Apparel", slug: "apparel" },
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

export const featuredCategories: CategoryWithCount[] = [
  categories[0], // Protein
  categories[1], // Pre-Workout
  categories[3], // Recovery
  categories[2], // Fat Burners
  categories[5], // Health & Wellness
  categories[6], // Snacks & Drinks
];
