// ============================================
// NAVIGATION DATA
// ============================================

export interface NavItem {
  label: string;
  href: string;
  highlight?: boolean; // For special styling (e.g., 24 Hour Gym)
  children?: NavItem[];
}

export interface MegaMenuCategory {
  title: string;
  href: string;
  items: {
    label: string;
    href: string;
  }[];
}

// Main navigation items
export const mainNavItems: NavItem[] = [
  {
    label: "Shop",
    href: "/shop",
    // Has mega menu - handled separately
  },
  {
    label: "Brands",
    href: "/brands",
    children: [
      { label: "Optimum Nutrition", href: "/brands/optimum-nutrition" },
      { label: "MuscleTech", href: "/brands/muscletech" },
      { label: "BSN", href: "/brands/bsn" },
      { label: "Cellucor", href: "/brands/cellucor" },
      { label: "EVL Nutrition", href: "/brands/evl-nutrition" },
      { label: "Ghost", href: "/brands/ghost" },
      { label: "Dymatize", href: "/brands/dymatize" },
      { label: "View All Brands", href: "/brands" },
    ],
  },
  {
    label: "Sale Items",
    href: "/shop?on_sale=true",
  },
  {
    label: "Rewards",
    href: "/rewards",
  },
  {
    label: "Franchise Opportunities",
    href: "/franchise",
  },
  {
    label: "Wholesale",
    href: "/wholesale",
    children: [
      { label: "Wholesale Program", href: "/wholesale" },
      { label: "Apply Now", href: "/wholesale#apply" },
      { label: "Wholesale Login", href: "/login?callbackUrl=%2Fshop" },
    ],
  },
  {
    label: "Contact",
    href: "/contact",
  },
  {
    label: "24 Hour Gym",
    href: "/gym",
    highlight: true,
  },
];

// Mega menu categories (SHOP dropdown)
export const megaMenuCategories: MegaMenuCategory[][] = [
  // Row 1
  [
    {
      title: "Apparel",
      href: "/shop/apparel",
      items: [
        { label: "Hoodies", href: "/shop/apparel/hoodies" },
        { label: "T-Shirts", href: "/shop/apparel/t-shirts" },
      ],
    },
    {
      title: "Fat Burners",
      href: "/shop/fat-burners",
      items: [
        { label: "Fat Loss", href: "/shop/fat-burners/fat-loss" },
        { label: "Weight Loss", href: "/shop/fat-burners/weight-loss" },
        { label: "Energy", href: "/shop/fat-burners/energy" },
        { label: "Thermogenics", href: "/shop/fat-burners/thermogenics" },
      ],
    },
    {
      title: "Health & Balance",
      href: "/shop/health-balance",
      items: [
        { label: "Detox/Cleanse", href: "/shop/health-balance/detox-cleanse" },
        { label: "Greens", href: "/shop/health-balance/greens" },
        { label: "Omega 3", href: "/shop/health-balance/omega-3" },
        { label: "Nootropic", href: "/shop/health-balance/nootropic" },
        { label: "Testosterone Boosters", href: "/shop/health-balance/testosterone-boosters" },
        { label: "Gluten Free", href: "/shop/health-balance/gluten-free" },
      ],
    },
    {
      title: "Dietary Supplements",
      href: "/shop/dietary-supplements",
      items: [
        { label: "Joint Health/Repair", href: "/shop/dietary-supplements/joint-health" },
        { label: "Amino Acids", href: "/shop/dietary-supplements/amino-acids" },
      ],
    },
    {
      title: "Weight Gainer",
      href: "/shop/weight-gainer",
      items: [
        { label: "Gainers", href: "/shop/weight-gainer/gainers" },
        { label: "Muscle Builders", href: "/shop/weight-gainer/muscle-builders" },
        { label: "Mass", href: "/shop/weight-gainer/mass" },
      ],
    },
  ],
  // Row 2
  [
    {
      title: "Protein",
      href: "/shop/protein",
      items: [
        { label: "Protein Bars", href: "/shop/protein/protein-bars" },
        { label: "Protein Chips", href: "/shop/protein/protein-chips" },
        { label: "Protein Coffee", href: "/shop/protein/protein-coffee" },
        { label: "Protein Cookies", href: "/shop/protein/protein-cookies" },
        { label: "Protein Drinks", href: "/shop/protein/protein-drinks" },
        { label: "Protein Powder", href: "/shop/protein/protein-powder" },
        { label: "Whey Isolate", href: "/shop/protein/whey-isolate" },
      ],
    },
    {
      title: "Pre-Workout",
      href: "/shop/pre-workout",
      items: [
        { label: "Caffeine", href: "/shop/pre-workout/caffeine" },
        { label: "Energy Drinks", href: "/shop/pre-workout/energy-drinks" },
        { label: "Beta-Alanine", href: "/shop/pre-workout/beta-alanine" },
        { label: "Pump", href: "/shop/pre-workout/pump" },
      ],
    },
    {
      title: "Recovery",
      href: "/shop/recovery",
      items: [
        { label: "Electrolytes", href: "/shop/recovery/electrolytes" },
        { label: "BCAA's/EAA's", href: "/shop/recovery/bcaas-eaas" },
        { label: "Post-Workout", href: "/shop/recovery/post-workout" },
      ],
    },
    {
      title: "Vegan",
      href: "/shop/vegan",
      items: [
        { label: "Plant Based Products", href: "/shop/vegan/plant-based" },
      ],
    },
    {
      title: "Snacks & Drinks",
      href: "/shop/snacks-drinks",
      items: [
        { label: "Bars", href: "/shop/snacks-drinks/bars" },
        { label: "Chips", href: "/shop/snacks-drinks/chips" },
        { label: "Syrups", href: "/shop/snacks-drinks/syrups" },
        { label: "Snacks & Foods", href: "/shop/snacks-drinks/snacks-foods" },
      ],
    },
  ],
];

// Footer navigation
export const footerNavigation = {
  shop: {
    title: "Shop",
    links: [
      { label: "All Products", href: "/shop" },
      { label: "Protein", href: "/shop/protein" },
      { label: "Pre-Workout", href: "/shop/pre-workout" },
      { label: "Fat Burners", href: "/shop/fat-burners" },
      { label: "Recovery", href: "/shop/recovery" },
      { label: "Sale Items", href: "/shop?on_sale=true" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Franchise Opportunities", href: "/franchise" },
      { label: "Wholesale Program", href: "/wholesale" },
      { label: "Rewards Program", href: "/rewards" },
    ],
  },
  support: {
    title: "Support",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Shipping Info", href: "/shipping" },
      { label: "Returns & Refunds", href: "/returns" },
      { label: "Track Order", href: "/account/orders" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
  account: {
    title: "Account",
    links: [
      { label: "My Account", href: "/account" },
      { label: "Order History", href: "/account/orders" },
      { label: "Wishlist", href: "/account/wishlist" },
      { label: "Login", href: "/login" },
      { label: "Register", href: "/register" },
    ],
  },
};

// Contact information
export const contactInfo = {
  phone: "(506) 451-8707",
  email: "info@naturallyfit.ca",
  address: {
    street: "123 Main Street",
    city: "Fredericton",
    province: "New Brunswick",
    postalCode: "E3B 1A1",
    country: "Canada",
  },
  hours: {
    weekdays: "Mon-Fri: 9am - 8pm",
    saturday: "Sat: 10am - 6pm",
    sunday: "Sun: 12pm - 5pm",
  },
  social: {
    facebook: "https://facebook.com/naturallyfit",
    instagram: "https://instagram.com/naturallyfit",
    twitter: "https://twitter.com/naturallyfit",
  },
};
