// ============================================
// MOCK USER DATA
// ============================================

import type { User, Address } from "@/types/user";

// ============================================
// SAMPLE ADDRESSES
// ============================================

export const sampleBillingAddress: Address = {
  firstName: "John",
  lastName: "Smith",
  company: "Fitness First Gym",
  address1: "123 Main Street",
  address2: "Suite 456",
  city: "Fredericton",
  state: "NB",
  postcode: "E3B 1A1",
  country: "CA",
  phone: "(506) 555-1234",
  email: "john.smith@example.com",
};

export const sampleShippingAddress: Address = {
  firstName: "John",
  lastName: "Smith",
  address1: "123 Main Street",
  address2: "Suite 456",
  city: "Fredericton",
  state: "NB",
  postcode: "E3B 1A1",
  country: "CA",
  phone: "(506) 555-1234",
};

// ============================================
// MOCK USERS
// ============================================

export const mockUsers: User[] = [
  {
    id: "user-1",
    databaseId: 101,
    email: "john.smith@example.com",
    firstName: "John",
    lastName: "Smith",
    displayName: "John Smith",
    role: "customer",
    isWholesaleCustomer: false,
    avatar: {
      url: "/images/avatars/default.png",
    },
    billing: sampleBillingAddress,
    shipping: sampleShippingAddress,
  },
  {
    id: "user-2",
    databaseId: 102,
    email: "sarah.jones@gymowner.com",
    firstName: "Sarah",
    lastName: "Jones",
    displayName: "Sarah Jones",
    role: "wholesale_customer",
    isWholesaleCustomer: true,
    wholesaleStatus: "approved",
    avatar: {
      url: "/images/avatars/default.png",
    },
    billing: {
      firstName: "Sarah",
      lastName: "Jones",
      company: "Iron Paradise Gym",
      address1: "456 Fitness Avenue",
      city: "Moncton",
      state: "NB",
      postcode: "E1C 4Z5",
      country: "CA",
      phone: "(506) 555-5678",
      email: "sarah.jones@gymowner.com",
    },
    shipping: {
      firstName: "Sarah",
      lastName: "Jones",
      company: "Iron Paradise Gym",
      address1: "456 Fitness Avenue",
      city: "Moncton",
      state: "NB",
      postcode: "E1C 4Z5",
      country: "CA",
      phone: "(506) 555-5678",
    },
  },
  {
    id: "user-3",
    databaseId: 103,
    email: "mike.wilson@pending.com",
    firstName: "Mike",
    lastName: "Wilson",
    displayName: "Mike Wilson",
    role: "customer",
    isWholesaleCustomer: false,
    wholesaleStatus: "pending",
  },
];

// ============================================
// MOCK ORDERS (for order history display)
// ============================================

export interface MockOrder {
  id: string;
  orderNumber: string;
  date: string;
  status: "pending" | "processing" | "completed" | "cancelled" | "refunded";
  total: number;
  itemCount: number;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

export const mockOrders: MockOrder[] = [
  {
    id: "order-1",
    orderNumber: "NF-10045",
    date: "2024-01-15T10:30:00Z",
    status: "completed",
    total: 159.97,
    itemCount: 3,
    items: [
      { name: "ON Gold Standard Whey - Chocolate (5 LB)", quantity: 1, price: 79.99 },
      { name: "C4 Original Pre-Workout - Fruit Punch", quantity: 1, price: 39.99 },
      { name: "ON Creatine Powder (600g)", quantity: 1, price: 29.99 },
    ],
  },
  {
    id: "order-2",
    orderNumber: "NF-10089",
    date: "2024-01-28T14:15:00Z",
    status: "processing",
    total: 94.98,
    itemCount: 2,
    items: [
      { name: "GHOST Legend Pre-Workout - Sour Watermelon", quantity: 1, price: 44.99 },
      { name: "GHOST Whey - Chips Ahoy!", quantity: 1, price: 49.99 },
    ],
  },
  {
    id: "order-3",
    orderNumber: "NF-9987",
    date: "2023-12-20T09:45:00Z",
    status: "completed",
    total: 234.96,
    itemCount: 4,
    items: [
      { name: "Dymatize ISO100 - Gourmet Vanilla (5 LB)", quantity: 1, price: 89.99 },
      { name: "BSN Syntha-6 - Chocolate Milkshake (5 LB)", quantity: 1, price: 69.99 },
      { name: "EVL LeanMode (150 caps)", quantity: 2, price: 24.99 },
    ],
  },
];

// ============================================
// MOCK WISHLIST
// ============================================

export interface WishlistItem {
  productId: number;
  addedAt: string;
}

export const mockWishlist: WishlistItem[] = [
  { productId: 1001, addedAt: "2024-01-10T08:00:00Z" },
  { productId: 1004, addedAt: "2024-01-12T15:30:00Z" },
  { productId: 1007, addedAt: "2024-01-20T11:00:00Z" },
  { productId: 1009, addedAt: "2024-01-25T17:45:00Z" },
];

// ============================================
// MOCK REVIEWS
// ============================================

export interface MockReview {
  id: string;
  productId: number;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
  helpful: number;
}

export const mockReviews: MockReview[] = [
  {
    id: "review-1",
    productId: 1001,
    userId: "user-1",
    userName: "John S.",
    rating: 5,
    title: "Best protein I've ever used",
    content: "Gold Standard Whey is my go-to protein. Mixes perfectly, tastes great, and I've seen real results. The Double Rich Chocolate flavor is amazing!",
    date: "2024-01-10T12:00:00Z",
    verified: true,
    helpful: 24,
  },
  {
    id: "review-2",
    productId: 1001,
    userId: "user-4",
    userName: "Mike T.",
    rating: 5,
    title: "Consistent quality",
    content: "Been using ON Gold Standard for years. Never disappoints. Fast shipping from Naturally Fit too!",
    date: "2024-01-08T09:30:00Z",
    verified: true,
    helpful: 18,
  },
  {
    id: "review-3",
    productId: 1004,
    userId: "user-5",
    userName: "Amanda K.",
    rating: 5,
    title: "Incredible flavor!",
    content: "The Sour Watermelon Warheads flavor is EXACTLY like the candy. GHOST killed it with this collab. Great energy and pump too.",
    date: "2024-01-15T16:45:00Z",
    verified: true,
    helpful: 31,
  },
  {
    id: "review-4",
    productId: 1003,
    userId: "user-6",
    userName: "Chris B.",
    rating: 4,
    title: "Good energy, solid pre-workout",
    content: "C4 is a reliable pre-workout. Not too intense but gets the job done. Fruit Punch flavor is decent.",
    date: "2024-01-05T14:00:00Z",
    verified: true,
    helpful: 12,
  },
  {
    id: "review-5",
    productId: 1007,
    userId: "user-7",
    userName: "Jessica M.",
    rating: 5,
    title: "Cleanest protein out there",
    content: "ISO100 is worth every penny. Zero bloating, mixes instantly, and the Gourmet Vanilla is delicious. Perfect for my macros.",
    date: "2024-01-20T10:15:00Z",
    verified: true,
    helpful: 27,
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getMockUserByEmail(email: string): User | undefined {
  return mockUsers.find((user) => user.email === email);
}

export function getMockUserById(id: string): User | undefined {
  return mockUsers.find((user) => user.id === id);
}

export function getMockOrdersByUserId(_userId: string): MockOrder[] {
  // In a real app, orders would be filtered by userId
  // For mock data, we return all orders
  return mockOrders;
}

export function getMockReviewsByProductId(productId: number): MockReview[] {
  return mockReviews.filter((review) => review.productId === productId);
}

export function getMockWishlistByUserId(_userId: string): WishlistItem[] {
  // In a real app, wishlist would be filtered by userId
  return mockWishlist;
}
