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
 * Row 2 of Header (Height: 50-60px, Horizontal Padding: 30px each side):
 * - Navigation items with dropdowns
 * - Light gray background
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

  return (
    <nav
      className="hidden lg:block bg-[#F4F4F4] border-b border-gray-border"
      aria-label="Main navigation"
    >
      <div className="container max-w-[2158px]">
        <div className="flex items-center h-[96px]">
          {/* Nav Items */}
          <ul className="flex items-center gap-6 flex-1 justify-center">
            {mainNavItems.map((item) => {
              const isShop = item.label === "Shop";
              const hasDropdown = isShop || (item.children && item.children.length > 0);
              const isActive = activeDropdown === item.label;

              return (
                <li
                  key={item.label}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => hasDropdown && handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Nav Item */}
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1",
                      "font-body font-medium text-[13px] uppercase tracking-[0.02em]",
                      "transition-colors",
                      item.highlight
                        ? "h-[44px] px-5 bg-yellow-highlight text-[#151515] hover:brightness-95"
                        : "h-full px-1 text-[#151515] hover:text-red-primary",
                      isActive && !item.highlight && "text-red-primary"
                    )}
                  >
                    {item.label}
                    {hasDropdown && (
                      <ChevronDown
                        size={14}
                        strokeWidth={2}
                        className={cn("transition-transform", isActive && "rotate-180")}
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
          </ul>

          {/* Auth Section (right aligned) */}
          <div className="flex-shrink-0 pl-8">
            {status === "loading" ? (
              <div className="flex items-center h-[96px]">
                <div className="w-24 h-4 bg-gray-light animate-pulse" />
              </div>
            ) : session?.user ? (
              <div
                className="relative h-[96px] flex items-center"
                onMouseEnter={() => setShowUserMenu(true)}
                onMouseLeave={() => setShowUserMenu(false)}
              >
                <button
                  className={cn(
                    "flex items-center gap-2 h-full",
                    "font-body font-medium text-[13px] uppercase tracking-[0.02em]",
                    "text-[#151515] hover:text-red-primary transition-colors",
                    showUserMenu && "text-red-primary"
                  )}
                >
                  <User size={18} strokeWidth={1.5} />
                  <span className="max-w-[120px] truncate">
                    {session.user.firstName ||
                      session.user.name?.split(" ")[0] ||
                      "Account"}
                  </span>
                  <ChevronDown
                    size={14}
                    strokeWidth={2}
                    className={cn("transition-transform", showUserMenu && "rotate-180")}
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
              <Link
                href="/login"
                className={cn(
                  "flex items-center h-[96px]",
                  "font-body font-medium text-[13px] uppercase tracking-[0.02em]",
                  "text-[#151515] hover:text-red-primary transition-colors"
                )}
              >
                Login / Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
