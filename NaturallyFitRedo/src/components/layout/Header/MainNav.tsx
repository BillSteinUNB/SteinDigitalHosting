"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ChevronDown, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { mainNavItems, megaMenuCategories } from "@/lib/navigation";
import MegaMenu from "./MegaMenu";

/**
 * MainNav Component
 *
 * Row 2 of Header (Height: 50px):
 * - Navigation items with dropdowns
 * - Red bottom border (3px)
 * - Red skewed accent after dropdown items
 * - 24 Hour Gym button in yellow
 * - Auth status (Login/Register or User dropdown)
 */
export default function MainNav() {
  const { data: session, status } = useSession();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleMouseEnter = (label: string) => {
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  // Check if nav item should have red skewed accent
  const hasRedAccent = (label: string) => {
    return label === "Shop" || label === "Brands" || label === "Wholesale";
  };

  return (
    <nav
      className="hidden lg:block border-b-[3px] border-red-primary bg-white"
      aria-label="Main navigation"
    >
      <div className="container">
        <ul className="flex items-center h-[50px] gap-1">
          {mainNavItems.map((item) => {
            const isShop = item.label === "Shop";
            const hasDropdown = isShop || (item.children && item.children.length > 0);
            const isActive = activeDropdown === item.label;
            const showRedAccent = hasRedAccent(item.label);

            return (
              <li
                key={item.label}
                className="relative h-full"
                onMouseEnter={() => hasDropdown && handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Nav Item */}
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 h-full px-3",
                    "font-heading font-semibold text-small uppercase tracking-heading",
                    "transition-colors",
                    // Highlight style (24 Hour Gym)
                    item.highlight
                      ? "bg-yellow-highlight text-black hover:brightness-95 font-bold"
                      : "text-black hover:text-red-primary",
                    // Active state
                    isActive && !item.highlight && "text-red-primary"
                  )}
                >
                  {item.label}
                  {showRedAccent && (
                    /* Red skewed rectangular accent */
                    <span 
                      className="inline-block w-2 h-3 bg-red-primary ml-1"
                      style={{ transform: "skewX(-15deg)" }}
                      aria-hidden="true"
                    />
                  )}
                  {hasDropdown && !showRedAccent && (
                    <ChevronDown
                      size={14}
                      strokeWidth={2}
                      className={cn(
                        "transition-transform",
                        isActive && "rotate-180"
                      )}
                    />
                  )}
                </Link>

                {/* Mega Menu (SHOP only) */}
                {isShop && isActive && (
                  <MegaMenu
                    categories={megaMenuCategories}
                    onClose={() => setActiveDropdown(null)}
                  />
                )}

                {/* Standard Dropdown */}
                {!isShop && item.children && isActive && (
                  <div
                    className={cn(
                      "absolute left-0 top-full",
                      "min-w-[220px] bg-white",
                      "border border-gray-border shadow-dropdown",
                      "animate-slide-down",
                      "z-dropdown"
                    )}
                  >
                    <ul className="py-2">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={cn(
                              "block px-4 py-2",
                              "text-small text-gray-dark hover:text-red-primary hover:bg-gray-light",
                              "transition-colors"
                            )}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}

          {/* Spacer to push Auth to the right */}
          <li className="flex-1" />

          {/* Auth Section */}
          <li className="h-full relative">
            {status === "loading" ? (
              // Loading state
              <div className="flex items-center h-full px-3">
                <div className="w-20 h-4 bg-gray-light animate-pulse" />
              </div>
            ) : session?.user ? (
              // Authenticated - User Dropdown
              <div
                className="relative h-full"
                onMouseEnter={() => setShowUserMenu(true)}
                onMouseLeave={() => setShowUserMenu(false)}
              >
                <button
                  className={cn(
                    "flex items-center gap-2 h-full px-3",
                    "font-heading font-semibold text-small uppercase tracking-heading",
                    "text-black hover:text-red-primary transition-colors",
                    showUserMenu && "text-red-primary"
                  )}
                >
                  <User size={18} strokeWidth={1.5} />
                  <span className="max-w-[100px] truncate">
                    {session.user.firstName || session.user.name?.split(" ")[0] || "Account"}
                  </span>
                  <ChevronDown
                    size={14}
                    strokeWidth={2}
                    className={cn(
                      "transition-transform",
                      showUserMenu && "rotate-180"
                    )}
                  />
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div
                    className={cn(
                      "absolute right-0 top-full",
                      "min-w-[200px] bg-white",
                      "border border-gray-border shadow-dropdown",
                      "animate-slide-down",
                      "z-dropdown"
                    )}
                  >
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-border bg-gray-light">
                      <p className="text-small font-semibold truncate">
                        {session.user.name}
                      </p>
                      <p className="text-tiny text-gray-medium truncate">
                        {session.user.email}
                      </p>
                      {session.user.isWholesale && (
                        <span className="inline-flex mt-1 px-2 py-0.5 text-tiny font-semibold bg-red-primary text-white">
                          WHOLESALE
                        </span>
                      )}
                    </div>

                    {/* Menu Items */}
                    <ul className="py-2">
                      <li>
                        <Link
                          href="/account"
                          className="block px-4 py-2 text-small text-gray-dark hover:text-red-primary hover:bg-gray-light transition-colors"
                        >
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/account/orders"
                          className="block px-4 py-2 text-small text-gray-dark hover:text-red-primary hover:bg-gray-light transition-colors"
                        >
                          Orders
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/account/addresses"
                          className="block px-4 py-2 text-small text-gray-dark hover:text-red-primary hover:bg-gray-light transition-colors"
                        >
                          Addresses
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/account/settings"
                          className="block px-4 py-2 text-small text-gray-dark hover:text-red-primary hover:bg-gray-light transition-colors"
                        >
                          Settings
                        </Link>
                      </li>
                    </ul>

                    {/* Sign Out */}
                    <div className="py-2 border-t border-gray-border">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 w-full px-4 py-2 text-small text-gray-dark hover:text-red-primary hover:bg-gray-light transition-colors"
                      >
                        <LogOut size={16} strokeWidth={1.5} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Unauthenticated - Login/Register Link
              <Link
                href="/login"
                className={cn(
                  "flex items-center h-full px-3",
                  "font-heading font-semibold text-small uppercase tracking-heading",
                  "text-black hover:text-red-primary transition-colors"
                )}
              >
                Login / Register
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
