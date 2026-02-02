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
 * Row 1 of Header (Height: 64px):
 * - Left: Two logos (placeholders) + tagline
 * - Right: Phone number, search, wishlist, cart
 * Style: Dark background, light text
 */
export default function TopBar({ onMobileMenuToggle }: TopBarProps) {
  // TODO: Get from cart store
  const cartCount = 0;
  const wishlistCount = 0;

  return (
    <div className="bg-[#2b2b2b] text-[#e6e6e6]">
      <div className="container">
        <div className="flex items-center justify-between h-[64px] gap-4">
          {/* Left: Logos & Tagline */}
          <div className="flex items-center gap-4">
            {/* Mobile menu toggle */}
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 -ml-2 hover:bg-white/10 transition-colors"
              aria-label="Open menu"
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>

            {/* Logos */}
            <Link href="/" className="flex items-center gap-3">
              {/* Veteran Shield Logo */}
              <div className="hidden sm:flex items-center justify-center w-[46px] h-[46px] bg-[#3a3a3a]">
                <span className="text-tiny text-[#bdbdbd] text-center">Shield</span>
              </div>

              {/* NF Logo */}
              <div className="flex items-center justify-center min-w-[84px] h-[46px] bg-black text-white px-3">
                <span className="font-heading font-bold text-h4">NF</span>
              </div>
            </Link>

            {/* Tagline - Hidden on mobile */}
            <div className="hidden md:block">
              <p className="font-body font-semibold text-[13px] uppercase tracking-[0.02em]">
                Canada&apos;s Supplement Store
              </p>
              <p className="text-tiny text-[#bdbdbd]">
                Serving Canada&apos;s Supplement Needs Since 1999
              </p>
            </div>
          </div>

          {/* Right: Phone, Search, Icons */}
          <div className="flex items-center gap-4">
            {/* Phone - Hidden on small screens */}
            <a
              href={`tel:${contactInfo.phone.replace(/[^0-9]/g, "")}`}
              className="hidden lg:flex items-center gap-2 text-red-primary hover:text-red-hover transition-colors font-body font-semibold uppercase text-[13px]"
            >
              <Phone size={18} strokeWidth={1.5} />
              <span className="font-body font-semibold text-[13px] uppercase tracking-[0.02em]">
                {contactInfo.phone}
              </span>
            </a>

            {/* Search - Hidden on mobile */}
            <div className="hidden md:block w-[240px] lg:w-[320px]">
              <SearchInput placeholder="Search products..." />
            </div>

            {/* Wishlist */}
            <Link
              href="/account/wishlist"
              className="relative p-2 text-white hover:text-red-primary hover:bg-white/10 transition-colors"
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
            <MiniCart cartCount={cartCount} darkMode iconClassName="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
