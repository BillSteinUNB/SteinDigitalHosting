"use client";

import Link from "next/link";
import { Phone, Heart, Menu } from "lucide-react";
import { SearchInput, CountBadge } from "@/components/ui";
import { contactInfo } from "@/lib/navigation";
import MiniCart from "./MiniCart";

interface TopBarProps {
  onMobileMenuToggle: () => void;
}

/**
 * TopBar Component
 *
 * Row 1 of Header (Height: 70px):
 * - Left: Two logos (veteran shield + NF logo) + tagline
 * - Right: Phone number, search, wishlist icon, cart icon
 */
export default function TopBar({ onMobileMenuToggle }: TopBarProps) {
  // TODO: Get from cart store
  const cartCount = 0;
  const wishlistCount = 0;

  return (
    <div className="border-b border-gray-border">
      <div className="container">
        <div className="flex items-center justify-between h-[70px] gap-4">
          {/* Left: Logos & Tagline */}
          <div className="flex items-center gap-4">
            {/* Mobile menu toggle */}
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 -ml-2 hover:bg-gray-light transition-colors"
              aria-label="Open menu"
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>

            {/* Logos */}
            <Link href="/" className="flex items-center gap-3">
              {/* Veteran Shield Logo */}
              <div className="hidden sm:flex items-center justify-center w-[50px] h-[50px] bg-gray-light">
                <span className="text-tiny text-gray-medium text-center">Shield</span>
              </div>

              {/* NF Logo */}
              <div className="flex items-center justify-center min-w-[80px] h-[50px] bg-black text-white px-3">
                <span className="font-heading font-bold text-h4">NF</span>
              </div>
            </Link>

            {/* Tagline - Hidden on mobile */}
            <div className="hidden md:block">
              <p className="font-heading font-bold text-small uppercase tracking-heading">
                Canada&apos;s Supplement Store
              </p>
              <p className="text-tiny text-gray-medium">
                Serving Canada&apos;s Supplement Needs Since 1999
              </p>
            </div>
          </div>

          {/* Right: Phone, Search, Icons */}
          <div className="flex items-center gap-4">
            {/* Phone - Hidden on small screens */}
            <a
              href={`tel:${contactInfo.phone.replace(/[^0-9]/g, "")}`}
              className="hidden lg:flex items-center gap-2 text-red-primary hover:text-red-hover transition-colors"
            >
              <Phone size={18} strokeWidth={1.5} />
              <span className="font-heading font-semibold text-small uppercase">
                {contactInfo.phone}
              </span>
            </a>

            {/* Search - Hidden on mobile */}
            <div className="hidden md:block w-[200px] lg:w-[280px]">
              <SearchInput placeholder="Search products..." />
            </div>

            {/* Wishlist */}
            <Link
              href="/account/wishlist"
              className="relative p-2 hover:bg-gray-light transition-colors"
              aria-label={`Wishlist (${wishlistCount} items)`}
            >
              <Heart size={24} strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <CountBadge
                  count={wishlistCount}
                  size="sm"
                  className="absolute -top-1 -right-1"
                />
              )}
            </Link>

            {/* Cart */}
            <MiniCart cartCount={cartCount} />
          </div>
        </div>
      </div>
    </div>
  );
}
