// ============================================
// NAVIGATION DATA
// ============================================

import { wholesaleLinks } from "@/lib/wholesale/links";

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
    href: "/shop",
    children: [
      { label: "Optimum Nutrition", href: "/shop?brand=optimum-nutrition" },
      { label: "MuscleTech", href: "/shop?brand=muscletech" },
      { label: "BSN", href: "/shop?brand=bsn" },
      { label: "Cellucor", href: "/shop?brand=cellucor" },
      { label: "EVL Nutrition", href: "/shop?brand=evl-nutrition" },
      { label: "Ghost", href: "/shop?brand=ghost" },
      { label: "Dymatize", href: "/shop?brand=dymatize" },
      { label: "View All Brands", href: "/shop" },
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
      { label: "Wholesale Login", href: wholesaleLinks.login },
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
  email: "customercare@naturallyfit.ca",
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
