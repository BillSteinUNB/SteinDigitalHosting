// ============================================
// USER & AUTH TYPES
// ============================================

export type UserRole =
  | "customer"
  | "wholesale_customer"
  | "administrator"
  | "shop_manager";

export interface User {
  id: string;
  databaseId: number;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  role: UserRole;
  // Wholesale specific
  isWholesaleCustomer: boolean;
  wholesaleStatus?: WholesaleStatus;
  // Avatar
  avatar?: {
    url: string;
  };
  // Addresses
  billing?: Address;
  shipping?: Address;
}

export type WholesaleStatus = "pending" | "approved" | "rejected" | "inactive";

export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone?: string;
  email?: string;
}

// Session type for NextAuth
export interface UserSession {
  user: {
    id: string;
    email: string;
    name: string;
    image?: string;
    role: UserRole;
    isWholesale: boolean;
  };
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
}

// Auth forms
export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface WholesaleApplicationData {
  // Business info
  businessName: string;
  businessType: string;
  taxId?: string;
  website?: string;
  // Contact info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // Address
  address: Address;
  // Additional info
  howDidYouHear?: string;
  additionalNotes?: string;
}

// Auth state
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isWholesale: boolean;
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  refreshSession: () => Promise<void>;
}
