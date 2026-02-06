// ============================================
// NEXTAUTH CONFIGURATION
// ============================================

import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import type { UserRole } from "@/types/user";
import { fetchGraphQL, fetchGraphQLAuth } from "@/lib/graphql/client";

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
// GRAPHQL AUTH CONFIG
// ============================================

const WHOLESALEX_ROLE = process.env.WHOLESALEX_ROLE_NAME || "wholesale_customer";

const LOGIN_MUTATION = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      authToken
      refreshToken
      user {
        databaseId
        email
        firstName
        lastName
        roles {
          nodes {
            name
          }
        }
      }
    }
  }
`;

const VIEWER_QUERY = `
  query Viewer {
    viewer {
      databaseId
      email
      firstName
      lastName
      roles {
        nodes {
          name
        }
      }
    }
  }
`;

type GraphqlRoleNode = { name?: string | null };

interface GraphqlLoginResponse {
  login: {
    authToken: string;
    refreshToken?: string | null;
    user: {
      databaseId: number;
      email: string;
      firstName?: string | null;
      lastName?: string | null;
      roles?: { nodes?: GraphqlRoleNode[] | null } | null;
    };
  };
}

interface GraphqlViewerResponse {
  viewer: {
    databaseId: number;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    roles?: { nodes?: GraphqlRoleNode[] | null } | null;
  };
}

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isWholesale: boolean;
  accessToken?: string;
  refreshToken?: string;
}

// ============================================
// AUTH HELPER FUNCTIONS
// ============================================

/**
 * Authenticate user with credentials
 * In production, this would call WooCommerce GraphQL API
 */
function normalizeRole(roleName: string | undefined | null): UserRole {
  const normalized = normalizeRoleName(roleName);
  switch (normalized) {
    case "administrator":
    case "shop_manager":
    case "wholesale_customer":
    case "customer":
      return normalized;
    default:
      return "customer";
  }
}

function normalizeRoleName(roleName: string | undefined | null): string {
  return (roleName || "")
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

function extractRoles(nodes?: GraphqlRoleNode[] | null): string[] {
  return (nodes || [])
    .map((node) => node.name || "")
    .map((name) => normalizeRoleName(name))
    .filter(Boolean);
}

async function authenticateUser(
  email: string,
  password: string
): Promise<AuthUser | null> {
  const loginData = await fetchGraphQL<GraphqlLoginResponse>(LOGIN_MUTATION, {
    input: {
      username: email,
      password,
    },
  });

  const accessToken = loginData.login.authToken;
  const refreshToken = loginData.login.refreshToken || undefined;

  const viewerData = await fetchGraphQLAuth<GraphqlViewerResponse>(
    VIEWER_QUERY,
    undefined,
    accessToken
  );

  const roleNames = extractRoles(viewerData.viewer.roles?.nodes);
  const primaryRole = roleNames[0];
  const role = normalizeRole(primaryRole);
  const normalizedWholesaleRole = normalizeRoleName(WHOLESALEX_ROLE);
  const isWholesale =
    roleNames.includes(normalizedWholesaleRole) || roleNames.includes("wholesale_customer");

  return {
    id: String(viewerData.viewer.databaseId),
    email: viewerData.viewer.email,
    firstName: viewerData.viewer.firstName || "",
    lastName: viewerData.viewer.lastName || "",
    role,
    isWholesale,
    accessToken,
    refreshToken,
  };
}

/**
 * Refresh access token
 * In production, this would refresh the WooCommerce JWT token
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    if (!token.refreshToken) {
      return {
        ...token,
        error: "RefreshAccessTokenError",
      };
    }
    // TODO: implement refresh token mutation if enabled in WPGraphQL JWT Auth
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
