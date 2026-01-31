// ============================================
// MOCK PRODUCTS DATA
// ============================================

import type {
  SimpleProduct,
  VariableProduct,
  Product,
  ProductCardData,
} from "@/types/product";

// Placeholder image URLs (using placeholder service)
const placeholderImage = (id: number, name: string) => ({
  sourceUrl: `/images/products/placeholder-${id}.jpg`,
  altText: name,
  id: `img-${id}`,
});

// ============================================
// SIMPLE PRODUCTS
// ============================================

export const simpleProducts: SimpleProduct[] = [
  {
    id: "prod-1",
    databaseId: 1001,
    slug: "optimum-nutrition-gold-standard-whey-chocolate",
    name: "Optimum Nutrition Gold Standard 100% Whey - Double Rich Chocolate",
    type: "SIMPLE",
    image: placeholderImage(1, "ON Gold Standard Whey Chocolate"),
    galleryImages: [
      placeholderImage(1, "ON Gold Standard Whey Chocolate - Front"),
      placeholderImage(2, "ON Gold Standard Whey Chocolate - Back"),
      placeholderImage(3, "ON Gold Standard Whey Chocolate - Nutrition Facts"),
    ],
    description:
      "<p>Gold Standard 100% Whey™ delivers 24g of whey protein, has 5.5g of naturally occurring BCAAs, and is made with whey protein isolates as the primary ingredient. Whether you're a seasoned athlete or just starting out, Gold Standard 100% Whey supports your training goals.</p><p>The World's Best-Selling Whey Protein Powder for a reason. For over 20 years, Gold Standard 100% Whey has set the standard for quality, taste, and purity.</p>",
    shortDescription:
      "24g protein per serving. 5.5g BCAAs. World's #1 selling whey protein powder.",
    sku: "ON-GS-WHEY-CHOC-5LB",
    stockStatus: "IN_STOCK",
    stockQuantity: 150,
    averageRating: 4.8,
    reviewCount: 2847,
    productCategories: [
      { id: "cat-1", name: "Protein", slug: "protein" },
      { id: "cat-2", name: "Whey Protein", slug: "whey-protein" },
    ],
    productBrands: [
      {
        id: "brand-1",
        name: "Optimum Nutrition",
        slug: "optimum-nutrition",
      },
    ],
    featured: true,
    onSale: false,
    price: "$79.99",
    regularPrice: "$79.99",
    wholesalePrice: "$59.99",
  },
  {
    id: "prod-2",
    databaseId: 1002,
    slug: "muscletech-nitro-tech-whey-gold",
    name: "MuscleTech Nitro-Tech Whey Gold - Cookies & Cream",
    type: "SIMPLE",
    image: placeholderImage(4, "MuscleTech Nitro-Tech Whey Gold"),
    description:
      "<p>NITRO-TECH® Whey Gold is a premium whey protein formula featuring whey peptides and whey isolate for superior quality. Each serving delivers 24g of ultra-premium protein with added creatine and amino acids for enhanced muscle building.</p>",
    shortDescription:
      "24g protein with whey peptides and isolate. Enhanced with creatine.",
    sku: "MT-NTWHEY-CC-5LB",
    stockStatus: "IN_STOCK",
    stockQuantity: 85,
    averageRating: 4.6,
    reviewCount: 1523,
    productCategories: [
      { id: "cat-1", name: "Protein", slug: "protein" },
      { id: "cat-2", name: "Whey Protein", slug: "whey-protein" },
    ],
    productBrands: [
      {
        id: "brand-2",
        name: "MuscleTech",
        slug: "muscletech",
      },
    ],
    featured: true,
    onSale: true,
    price: "$64.99",
    regularPrice: "$74.99",
    salePrice: "$64.99",
    wholesalePrice: "$54.99",
  },
  {
    id: "prod-3",
    databaseId: 1003,
    slug: "cellucor-c4-original-pre-workout-fruit-punch",
    name: "Cellucor C4 Original Pre-Workout - Fruit Punch",
    type: "SIMPLE",
    image: placeholderImage(5, "Cellucor C4 Original"),
    description:
      "<p>C4 Original is America's #1 selling pre-workout brand. Formulated with a signature explosive energy blend to help you train harder and longer. Contains CarnoSyn® Beta-Alanine, caffeine, and arginine for performance enhancement.</p>",
    shortDescription:
      "America's #1 pre-workout. Explosive energy and enhanced endurance.",
    sku: "CEL-C4-FP-60SRV",
    stockStatus: "IN_STOCK",
    stockQuantity: 200,
    averageRating: 4.5,
    reviewCount: 3421,
    productCategories: [
      { id: "cat-3", name: "Pre-Workout", slug: "pre-workout" },
    ],
    productBrands: [
      {
        id: "brand-3",
        name: "Cellucor",
        slug: "cellucor",
      },
    ],
    featured: true,
    onSale: false,
    price: "$39.99",
    regularPrice: "$39.99",
    wholesalePrice: "$29.99",
  },
  {
    id: "prod-4",
    databaseId: 1004,
    slug: "ghost-legend-pre-workout-sour-watermelon",
    name: "GHOST Legend Pre-Workout - Sour Watermelon Warheads",
    type: "SIMPLE",
    image: placeholderImage(6, "GHOST Legend Pre-Workout"),
    description:
      "<p>GHOST® LEGEND® is the world's first fully transparent, fully dosed, fully loaded pre-workout. Featuring premium ingredients and legendary collaborations with iconic candy brands. Feel the energy, focus, and pump with every scoop.</p>",
    shortDescription:
      "Fully transparent, fully loaded pre-workout with legendary flavor.",
    sku: "GHOST-LEG-SWWH-25SRV",
    stockStatus: "IN_STOCK",
    stockQuantity: 120,
    averageRating: 4.9,
    reviewCount: 987,
    productCategories: [
      { id: "cat-3", name: "Pre-Workout", slug: "pre-workout" },
    ],
    productBrands: [
      {
        id: "brand-4",
        name: "Ghost",
        slug: "ghost",
      },
    ],
    featured: true,
    onSale: true,
    price: "$44.99",
    regularPrice: "$49.99",
    salePrice: "$44.99",
    wholesalePrice: "$36.99",
  },
  {
    id: "prod-5",
    databaseId: 1005,
    slug: "bsn-syntha-6-chocolate-milkshake",
    name: "BSN Syntha-6 Protein - Chocolate Milkshake",
    type: "SIMPLE",
    image: placeholderImage(7, "BSN Syntha-6"),
    description:
      "<p>SYNTHA-6® is an ultra-premium protein powder with 22g of protein per serving and a signature taste that is consistently unrivaled. Features a multi-functional protein matrix that provides a sustained release of amino acids.</p>",
    shortDescription:
      "22g ultra-premium protein with signature great taste. Multi-functional protein matrix.",
    sku: "BSN-S6-CHOC-5LB",
    stockStatus: "IN_STOCK",
    stockQuantity: 95,
    averageRating: 4.7,
    reviewCount: 1876,
    productCategories: [
      { id: "cat-1", name: "Protein", slug: "protein" },
      { id: "cat-2", name: "Whey Protein", slug: "whey-protein" },
    ],
    productBrands: [
      {
        id: "brand-5",
        name: "BSN",
        slug: "bsn",
      },
    ],
    featured: false,
    onSale: false,
    price: "$69.99",
    regularPrice: "$69.99",
    wholesalePrice: "$52.99",
  },
  {
    id: "prod-6",
    databaseId: 1006,
    slug: "evl-leanmode-stimulant-free-fat-burner",
    name: "EVL LeanMode Stimulant-Free Fat Burner",
    type: "SIMPLE",
    image: placeholderImage(8, "EVL LeanMode"),
    description:
      "<p>LeanMode is a stimulant-free weight loss support featuring 5 key modes of action. With CLA, Garcinia Cambogia, Green Coffee Bean Extract, and more. Perfect for those sensitive to stimulants or for evening use.</p>",
    shortDescription:
      "5-in-1 stimulant-free fat burner. Perfect for caffeine-sensitive individuals.",
    sku: "EVL-LEANMODE-150CAP",
    stockStatus: "IN_STOCK",
    stockQuantity: 180,
    averageRating: 4.3,
    reviewCount: 756,
    productCategories: [
      { id: "cat-4", name: "Fat Burners", slug: "fat-burners" },
      { id: "cat-5", name: "Weight Loss", slug: "weight-loss" },
    ],
    productBrands: [
      {
        id: "brand-6",
        name: "EVL Nutrition",
        slug: "evl-nutrition",
      },
    ],
    featured: false,
    onSale: true,
    price: "$24.99",
    regularPrice: "$34.99",
    salePrice: "$24.99",
    wholesalePrice: "$19.99",
  },
  {
    id: "prod-7",
    databaseId: 1007,
    slug: "dymatize-iso100-hydrolyzed-gourmet-vanilla",
    name: "Dymatize ISO100 Hydrolyzed Whey - Gourmet Vanilla",
    type: "SIMPLE",
    image: placeholderImage(9, "Dymatize ISO100"),
    description:
      "<p>ISO100 is one of the most advanced and effective proteins available. Each serving delivers 25g of hydrolyzed 100% whey protein isolate with less than 1g of sugar and zero fat. Engineered for fast absorption.</p>",
    shortDescription:
      "25g hydrolyzed whey isolate. Zero fat, <1g sugar. Fast absorbing.",
    sku: "DYM-ISO100-VAN-5LB",
    stockStatus: "IN_STOCK",
    stockQuantity: 110,
    averageRating: 4.8,
    reviewCount: 2156,
    productCategories: [
      { id: "cat-1", name: "Protein", slug: "protein" },
      { id: "cat-6", name: "Whey Isolate", slug: "whey-isolate" },
    ],
    productBrands: [
      {
        id: "brand-7",
        name: "Dymatize",
        slug: "dymatize",
      },
    ],
    featured: true,
    onSale: false,
    price: "$89.99",
    regularPrice: "$89.99",
    wholesalePrice: "$67.99",
  },
  {
    id: "prod-8",
    databaseId: 1008,
    slug: "optimum-nutrition-creatine-powder",
    name: "Optimum Nutrition Micronized Creatine Powder",
    type: "SIMPLE",
    image: placeholderImage(10, "ON Creatine Powder"),
    description:
      "<p>Micronized Creatine Powder features Creapure®, the purest and finest creatine monohydrate available. Supports muscle strength, power, and size when combined with high-intensity exercise.</p>",
    shortDescription:
      "Pure Creapure® creatine monohydrate. Supports strength and power.",
    sku: "ON-CREATINE-600G",
    stockStatus: "IN_STOCK",
    stockQuantity: 250,
    averageRating: 4.9,
    reviewCount: 4521,
    productCategories: [
      { id: "cat-7", name: "Recovery", slug: "recovery" },
      { id: "cat-8", name: "Muscle Builders", slug: "muscle-builders" },
    ],
    productBrands: [
      {
        id: "brand-1",
        name: "Optimum Nutrition",
        slug: "optimum-nutrition",
      },
    ],
    featured: true,
    onSale: false,
    price: "$29.99",
    regularPrice: "$29.99",
    wholesalePrice: "$22.99",
  },
  {
    id: "prod-9",
    databaseId: 1009,
    slug: "ghost-whey-protein-chips-ahoy",
    name: "GHOST Whey Protein - Chips Ahoy!",
    type: "SIMPLE",
    image: placeholderImage(11, "GHOST Whey Chips Ahoy"),
    description:
      "<p>GHOST® WHEY is a 100% whey protein blend combining whey protein isolate, concentrate, and hydrolysate. Legendary collaborations with iconic brands bring you authentic flavors you have to taste to believe.</p>",
    shortDescription:
      "25g protein per serving. Authentic Chips Ahoy! flavor collaboration.",
    sku: "GHOST-WHEY-CA-2LB",
    stockStatus: "IN_STOCK",
    stockQuantity: 75,
    averageRating: 4.9,
    reviewCount: 1234,
    productCategories: [
      { id: "cat-1", name: "Protein", slug: "protein" },
      { id: "cat-2", name: "Whey Protein", slug: "whey-protein" },
    ],
    productBrands: [
      {
        id: "brand-4",
        name: "Ghost",
        slug: "ghost",
      },
    ],
    featured: true,
    onSale: false,
    price: "$49.99",
    regularPrice: "$49.99",
    wholesalePrice: "$39.99",
  },
  {
    id: "prod-10",
    databaseId: 1010,
    slug: "muscletech-hydroxycut-hardcore-elite",
    name: "MuscleTech Hydroxycut Hardcore Elite",
    type: "SIMPLE",
    image: placeholderImage(12, "Hydroxycut Hardcore Elite"),
    description:
      "<p>Hydroxycut Hardcore Elite delivers extreme energy and powerful weight loss support. Features a scientifically tested key ingredient that has been shown to help subjects lose weight in multiple studies.</p>",
    shortDescription:
      "Extreme energy and weight loss support. Scientifically researched formula.",
    sku: "MT-HCHE-100CAP",
    stockStatus: "IN_STOCK",
    stockQuantity: 145,
    averageRating: 4.2,
    reviewCount: 892,
    productCategories: [
      { id: "cat-4", name: "Fat Burners", slug: "fat-burners" },
      { id: "cat-9", name: "Energy", slug: "energy" },
    ],
    productBrands: [
      {
        id: "brand-2",
        name: "MuscleTech",
        slug: "muscletech",
      },
    ],
    featured: false,
    onSale: true,
    price: "$29.99",
    regularPrice: "$39.99",
    salePrice: "$29.99",
    wholesalePrice: "$24.99",
  },
  {
    id: "prod-11",
    databaseId: 1011,
    slug: "bsn-no-xplode-pre-workout-grape",
    name: "BSN N.O.-XPLODE Pre-Workout - Grape",
    type: "SIMPLE",
    image: placeholderImage(13, "BSN NO-XPLODE"),
    description:
      "<p>N.O.-XPLODE is the legendary pre-workout formula that started it all. Re-engineered with clinically studied ingredients for explosive energy, enhanced endurance, and maximum performance.</p>",
    shortDescription:
      "The legendary pre-workout. Explosive energy and enhanced endurance.",
    sku: "BSN-NOX-GRAPE-60SRV",
    stockStatus: "IN_STOCK",
    stockQuantity: 90,
    averageRating: 4.4,
    reviewCount: 1567,
    productCategories: [
      { id: "cat-3", name: "Pre-Workout", slug: "pre-workout" },
    ],
    productBrands: [
      {
        id: "brand-5",
        name: "BSN",
        slug: "bsn",
      },
    ],
    featured: false,
    onSale: false,
    price: "$44.99",
    regularPrice: "$44.99",
    wholesalePrice: "$34.99",
  },
  {
    id: "prod-12",
    databaseId: 1012,
    slug: "optimum-nutrition-gold-standard-bcaa",
    name: "Optimum Nutrition Gold Standard BCAA Train + Recover",
    type: "SIMPLE",
    image: placeholderImage(14, "ON Gold Standard BCAA"),
    description:
      "<p>Gold Standard BCAA provides the 2:1:1 ratio of leucine, isoleucine, and valine along with rhodiola, electrolytes, and vitamin C to help support muscle recovery, endurance, and performance.</p>",
    shortDescription:
      "5g BCAAs in 2:1:1 ratio. Enhanced with rhodiola and electrolytes.",
    sku: "ON-GSBCAA-STRAW-28SRV",
    stockStatus: "IN_STOCK",
    stockQuantity: 165,
    averageRating: 4.6,
    reviewCount: 743,
    productCategories: [
      { id: "cat-7", name: "Recovery", slug: "recovery" },
      { id: "cat-10", name: "BCAAs/EAAs", slug: "bcaas-eaas" },
    ],
    productBrands: [
      {
        id: "brand-1",
        name: "Optimum Nutrition",
        slug: "optimum-nutrition",
      },
    ],
    featured: false,
    onSale: true,
    price: "$27.99",
    regularPrice: "$34.99",
    salePrice: "$27.99",
    wholesalePrice: "$22.99",
  },
];

// ============================================
// VARIABLE PRODUCTS
// ============================================

export const variableProducts: VariableProduct[] = [
  {
    id: "prod-13",
    databaseId: 1013,
    slug: "optimum-nutrition-gold-standard-whey",
    name: "Optimum Nutrition Gold Standard 100% Whey",
    type: "VARIABLE",
    image: placeholderImage(15, "ON Gold Standard Whey"),
    galleryImages: [
      placeholderImage(15, "ON Gold Standard Whey - Multiple Flavors"),
      placeholderImage(16, "ON Gold Standard Whey - Nutrition"),
    ],
    description:
      "<p>Gold Standard 100% Whey™ delivers 24g of whey protein, has 5.5g of naturally occurring BCAAs, and is made with whey protein isolates as the primary ingredient. Available in a variety of delicious flavors and sizes.</p>",
    shortDescription:
      "24g protein per serving. 5.5g BCAAs. Multiple flavors and sizes available.",
    sku: "ON-GS-WHEY-VAR",
    stockStatus: "IN_STOCK",
    averageRating: 4.8,
    reviewCount: 5621,
    productCategories: [
      { id: "cat-1", name: "Protein", slug: "protein" },
      { id: "cat-2", name: "Whey Protein", slug: "whey-protein" },
    ],
    productBrands: [
      {
        id: "brand-1",
        name: "Optimum Nutrition",
        slug: "optimum-nutrition",
      },
    ],
    featured: true,
    onSale: false,
    price: "$34.99 - $89.99",
    regularPrice: "$34.99 - $89.99",
    attributes: [
      {
        name: "Size",
        options: ["2 LB", "5 LB", "10 LB"],
        variation: true,
      },
      {
        name: "Flavor",
        options: [
          "Double Rich Chocolate",
          "Vanilla Ice Cream",
          "Strawberry Banana",
          "Cookies & Cream",
          "Extreme Milk Chocolate",
        ],
        variation: true,
      },
    ],
    variations: [
      {
        id: "var-1",
        databaseId: 10131,
        name: "2 LB - Double Rich Chocolate",
        price: "$34.99",
        regularPrice: "$34.99",
        wholesalePrice: "$27.99",
        stockStatus: "IN_STOCK",
        stockQuantity: 50,
        attributes: [
          { name: "Size", value: "2 LB" },
          { name: "Flavor", value: "Double Rich Chocolate" },
        ],
      },
      {
        id: "var-2",
        databaseId: 10132,
        name: "5 LB - Double Rich Chocolate",
        price: "$79.99",
        regularPrice: "$79.99",
        wholesalePrice: "$59.99",
        stockStatus: "IN_STOCK",
        stockQuantity: 75,
        attributes: [
          { name: "Size", value: "5 LB" },
          { name: "Flavor", value: "Double Rich Chocolate" },
        ],
      },
      {
        id: "var-3",
        databaseId: 10133,
        name: "10 LB - Double Rich Chocolate",
        price: "$89.99",
        regularPrice: "$89.99",
        wholesalePrice: "$69.99",
        stockStatus: "IN_STOCK",
        stockQuantity: 25,
        attributes: [
          { name: "Size", value: "10 LB" },
          { name: "Flavor", value: "Double Rich Chocolate" },
        ],
      },
      {
        id: "var-4",
        databaseId: 10134,
        name: "5 LB - Vanilla Ice Cream",
        price: "$79.99",
        regularPrice: "$79.99",
        wholesalePrice: "$59.99",
        stockStatus: "IN_STOCK",
        stockQuantity: 60,
        attributes: [
          { name: "Size", value: "5 LB" },
          { name: "Flavor", value: "Vanilla Ice Cream" },
        ],
      },
      {
        id: "var-5",
        databaseId: 10135,
        name: "5 LB - Cookies & Cream",
        price: "$79.99",
        regularPrice: "$79.99",
        wholesalePrice: "$59.99",
        stockStatus: "OUT_OF_STOCK",
        stockQuantity: 0,
        attributes: [
          { name: "Size", value: "5 LB" },
          { name: "Flavor", value: "Cookies & Cream" },
        ],
      },
    ],
    wholesalePriceRange: {
      min: "$27.99",
      max: "$69.99",
    },
  },
  {
    id: "prod-14",
    databaseId: 1014,
    slug: "ghost-legend-pre-workout",
    name: "GHOST Legend Pre-Workout",
    type: "VARIABLE",
    image: placeholderImage(17, "GHOST Legend Pre-Workout"),
    description:
      "<p>GHOST® LEGEND® is the world's first fully transparent, fully dosed pre-workout. Available in legendary collaboration flavors and classic options for every taste preference.</p>",
    shortDescription:
      "Fully transparent pre-workout. Available in multiple legendary flavors.",
    sku: "GHOST-LEG-VAR",
    stockStatus: "IN_STOCK",
    averageRating: 4.9,
    reviewCount: 2341,
    productCategories: [
      { id: "cat-3", name: "Pre-Workout", slug: "pre-workout" },
    ],
    productBrands: [
      {
        id: "brand-4",
        name: "Ghost",
        slug: "ghost",
      },
    ],
    featured: true,
    onSale: true,
    price: "$44.99 - $49.99",
    regularPrice: "$49.99",
    salePrice: "$44.99",
    attributes: [
      {
        name: "Flavor",
        options: [
          "Sour Watermelon Warheads",
          "Welch's Grape",
          "Sonic Cherry Limeade",
          "Blue Raspberry",
          "Lemon Crush",
        ],
        variation: true,
      },
    ],
    variations: [
      {
        id: "var-6",
        databaseId: 10141,
        name: "Sour Watermelon Warheads",
        price: "$44.99",
        regularPrice: "$49.99",
        salePrice: "$44.99",
        wholesalePrice: "$36.99",
        stockStatus: "IN_STOCK",
        stockQuantity: 45,
        attributes: [{ name: "Flavor", value: "Sour Watermelon Warheads" }],
      },
      {
        id: "var-7",
        databaseId: 10142,
        name: "Welch's Grape",
        price: "$44.99",
        regularPrice: "$49.99",
        salePrice: "$44.99",
        wholesalePrice: "$36.99",
        stockStatus: "IN_STOCK",
        stockQuantity: 38,
        attributes: [{ name: "Flavor", value: "Welch's Grape" }],
      },
      {
        id: "var-8",
        databaseId: 10143,
        name: "Sonic Cherry Limeade",
        price: "$44.99",
        regularPrice: "$49.99",
        salePrice: "$44.99",
        wholesalePrice: "$36.99",
        stockStatus: "IN_STOCK",
        stockQuantity: 52,
        attributes: [{ name: "Flavor", value: "Sonic Cherry Limeade" }],
      },
    ],
    wholesalePriceRange: {
      min: "$36.99",
      max: "$36.99",
    },
  },
];

// ============================================
// ALL PRODUCTS COMBINED
// ============================================

export const allProducts: Product[] = [...simpleProducts, ...variableProducts];

// ============================================
// PRODUCT CARD DATA (Minimal for listings)
// ============================================

export function getProductCardData(product: Product): ProductCardData {
  return {
    id: product.id,
    databaseId: product.databaseId,
    slug: product.slug,
    name: product.name,
    image: product.image,
    price: product.price,
    regularPrice: product.regularPrice,
    salePrice: product.type === "SIMPLE" ? product.salePrice : undefined,
    wholesalePrice:
      product.type === "SIMPLE" ? product.wholesalePrice : undefined,
    averageRating: product.averageRating,
    reviewCount: product.reviewCount,
    productCategories: product.productCategories.map((c) => ({
      name: c.name,
      slug: c.slug,
    })),
    productBrands: product.productBrands.map((b) => ({
      name: b.name,
      slug: b.slug,
    })),
    onSale: product.onSale,
    stockStatus: product.stockStatus,
  };
}

export const allProductCards: ProductCardData[] = allProducts.map(getProductCardData);

// ============================================
// FEATURED PRODUCTS
// ============================================

export const featuredProducts: ProductCardData[] = allProducts
  .filter((p) => p.featured)
  .map(getProductCardData);

// ============================================
// SALE PRODUCTS
// ============================================

export const saleProducts: ProductCardData[] = allProducts
  .filter((p) => p.onSale)
  .map(getProductCardData);

// ============================================
// NEW ARRIVALS (simulated by taking last few products)
// ============================================

export const newArrivals: ProductCardData[] = allProducts
  .slice(-6)
  .map(getProductCardData);

// ============================================
// BEST SELLERS (simulated by review count)
// ============================================

export const bestSellers: ProductCardData[] = [...allProducts]
  .sort((a, b) => b.reviewCount - a.reviewCount)
  .slice(0, 8)
  .map(getProductCardData);
