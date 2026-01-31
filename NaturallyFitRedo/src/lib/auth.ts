// ============================================
// NEXTAUTH CONFIGURATION
// ============================================

import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import type { UserRole } from "@/types/user";

// ============================================
// TYPES
// ============================================

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      firstName: string;
      lastName: string;
      role: UserRole;
      isWholesale: boolean;
      image?: string;
    };
    accessToken?: string;
    error?: string;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isWholesale: boolean;
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isWholesale: boolean;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
  }
}

// ============================================
// MOCK USER DATABASE (for development)
// Will be replaced with WooCommerce GraphQL auth
// ============================================

interface MockUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isWholesale: boolean;
}

const mockUsers: MockUser[] = [
  {
    id: "1",
    email: "customer@example.com",
    password: "password123",
    firstName: "John",
    lastName: "Doe",
    role: "customer",
    isWholesale: false,
  },
  {
    id: "2",
    email: "wholesale@example.com",
    password: "password123",
    firstName: "Jane",
    lastName: "Smith",
    role: "wholesale_customer",
    isWholesale: true,
  },
  {
    id: "3",
    email: "admin@example.com",
    password: "admin123",
    firstName: "Admin",
    lastName: "User",
    role: "administrator",
    isWholesale: false,
  },
];

// ============================================
// AUTH HELPER FUNCTIONS
// ============================================

/**
 * Authenticate user with credentials
 * In production, this would call WooCommerce GraphQL API
 */
async function authenticateUser(
  email: string,
  password: string
): Promise<MockUser | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Find user by email
  const user = mockUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  // Check password
  if (user && user.password === password) {
    return user;
  }

  return null;
}

/**
 * Refresh access token
 * In production, this would refresh the WooCommerce JWT token
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    // In production: call WooCommerce refresh token endpoint
    // For now, just return the existing token
    return {
      ...token,
      accessTokenExpires: Date.now() + 60 * 60 * 1000, // 1 hour
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

// ============================================
// NEXTAUTH OPTIONS
// ============================================

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password");
        }

        const user = await authenticateUser(
          credentials.email,
          credentials.password
        );

        if (!user) {
          throw new Error("Invalid email or password");
        }

        // Return user object for JWT
        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isWholesale: user.isWholesale,
          accessToken: `mock-access-token-${user.id}`,
          refreshToken: `mock-refresh-token-${user.id}`,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isWholesale: user.isWholesale,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: Date.now() + 60 * 60 * 1000, // 1 hour
        };
      }

      // Handle session update (e.g., profile changes)
      if (trigger === "update" && session) {
        return {
          ...token,
          ...session,
        };
      }

      // Return previous token if the access token has not expired
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Access token has expired, try to refresh it
      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      // Send properties to the client
      session.user = {
        id: token.id,
        email: token.email,
        name: token.name,
        firstName: token.firstName,
        lastName: token.lastName,
        role: token.role,
        isWholesale: token.isWholesale,
      };
      session.accessToken = token.accessToken;
      session.error = token.error;

      return session;
    },
  },

  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
    newUser: "/account",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  debug: process.env.NODE_ENV === "development",
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Check if user has required role
 */
export function hasRole(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(userRole);
}

/**
 * Check if user is admin
 */
export function isAdmin(role: UserRole): boolean {
  return role === "administrator" || role === "shop_manager";
}

/**
 * Check if user is wholesale customer
 */
export function isWholesaleCustomer(role: UserRole): boolean {
  return role === "wholesale_customer";
}
