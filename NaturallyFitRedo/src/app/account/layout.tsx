"use client";

// ============================================
// ACCOUNT LAYOUT
// ============================================

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  User,
  Package,
  MapPin,
  Settings,
  LogOut,
  Heart,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Container, Spinner } from "@/components/ui";

// ============================================
// TYPES
// ============================================

interface AccountLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  description: string;
}

// ============================================
// NAVIGATION ITEMS
// ============================================

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/account",
    icon: <User size={20} strokeWidth={1.5} />,
    description: "Overview of your account",
  },
  {
    label: "Orders",
    href: "/account/orders",
    icon: <Package size={20} strokeWidth={1.5} />,
    description: "View and track your orders",
  },
  {
    label: "Addresses",
    href: "/account/addresses",
    icon: <MapPin size={20} strokeWidth={1.5} />,
    description: "Manage shipping & billing",
  },
  {
    label: "Wishlist",
    href: "/account/wishlist",
    icon: <Heart size={20} strokeWidth={1.5} />,
    description: "Your saved products",
  },
  {
    label: "Payment Methods",
    href: "/account/payment",
    icon: <CreditCard size={20} strokeWidth={1.5} />,
    description: "Manage payment options",
  },
  {
    label: "Settings",
    href: "/account/settings",
    icon: <Settings size={20} strokeWidth={1.5} />,
    description: "Account preferences",
  },
];

// ============================================
// ACCOUNT LAYOUT COMPONENT
// ============================================

export default function AccountLayout({ children }: AccountLayoutProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Show loading state
  if (status === "loading") {
    return (
      <main className="py-12 lg:py-16 min-h-[60vh]">
        <Container>
          <div className="flex items-center justify-center py-20">
            <Spinner size="lg" />
          </div>
        </Container>
      </main>
    );
  }

  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    if (typeof window !== "undefined") {
      window.location.href = `/login?callbackUrl=${encodeURIComponent(pathname)}`;
    }
    return null;
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <main className="py-8 lg:py-12">
      <Container>
        {/* Breadcrumb */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-small flex-wrap">
            <li>
              <Link
                href="/"
                className="text-gray-medium hover:text-red-primary transition-colors"
              >
                Home
              </Link>
            </li>
            <li className="text-gray-medium">/</li>
            <li className="text-black font-semibold">My Account</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-heading font-bold text-h1 uppercase mb-2">
            My Account
          </h1>
          {session?.user && (
            <p className="text-body text-gray-medium">
              Welcome back, <span className="font-semibold text-black">{session.user.firstName || session.user.name}</span>
              {session.user.isWholesale && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 text-tiny font-semibold bg-red-primary text-white">
                  WHOLESALE
                </span>
              )}
            </p>
          )}
        </div>

        {/* Layout Grid */}
        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
          {/* Sidebar Navigation */}
          <aside className="mb-8 lg:mb-0">
            <nav className="bg-gray-light p-4 lg:sticky lg:top-4">
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const isActive =
                    item.href === "/account"
                      ? pathname === "/account"
                      : pathname.startsWith(item.href);

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 transition-colors",
                          isActive
                            ? "bg-white text-red-primary font-semibold"
                            : "text-gray-dark hover:bg-white/50"
                        )}
                      >
                        <span className="flex-shrink-0">{item.icon}</span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-small">{item.label}</span>
                          <span className="block text-tiny text-gray-medium font-normal">
                            {item.description}
                          </span>
                        </span>
                        <ChevronRight
                          size={16}
                          strokeWidth={1.5}
                          className={cn(
                            "flex-shrink-0 transition-transform",
                            isActive && "text-red-primary"
                          )}
                        />
                      </Link>
                    </li>
                  );
                })}

                {/* Sign Out */}
                <li className="pt-4 border-t border-gray-border mt-4">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-dark hover:bg-white/50 transition-colors"
                  >
                    <LogOut size={20} strokeWidth={1.5} className="flex-shrink-0" />
                    <span className="text-small">Sign Out</span>
                  </button>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="min-w-0">{children}</div>
        </div>
      </Container>
    </main>
  );
}
