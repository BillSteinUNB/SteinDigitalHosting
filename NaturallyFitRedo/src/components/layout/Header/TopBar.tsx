"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Menu, Search } from "lucide-react";
import { CountBadge } from "@/components/ui";
import { contactInfo } from "@/lib/navigation";
import MiniCart from "./MiniCart";

interface TopBarProps {
  onMobileMenuToggle: () => void;
}

/**
 * TopBar Component
 *
 * Row 1 of Header (Height: 70px):
 * - Left: Logo with tagline (47px × 53px display size)
 * - Center: Search bar (330px × 41px)
 * - Right: Phone number, wishlist, account, cart icons + Veteran badge (47px × 53px)
 * 
 * Style: Black background, white text
 */
export default function TopBar({ onMobileMenuToggle }: TopBarProps) {
  // TODO: Get from cart store
  const cartCount = 0;
  const wishlistCount = 0;

  return (
    <div className="bg-black">
      <div className="container">
        <div className="flex items-center justify-between h-[70px] gap-4">
          {/* Left: Logo & Tagline */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Mobile menu toggle */}
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 -ml-2 text-white hover:bg-white/10 transition-colors"
              aria-label="Open menu"
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>

            {/* Logo - 47px × 53px display size */}
            <Link href="/" className="flex items-center gap-3">
              <div className="flex items-center">
                <Image
                  src="https://nftest.dreamhosters.com/wp-content/uploads/2026/02/canadassupplementstore.webp"
                  alt="Naturally Fit - Canada's Supplement Store"
                  width={47}
                  height={53}
                  className="w-[47px] h-[53px] object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Tagline - Hidden on mobile */}
            <div className="hidden md:block">
              <p className="font-heading font-bold text-small uppercase tracking-heading text-white">
                Canada&apos;s Supplement Store
              </p>
              <p className="text-tiny text-gray-400">
                Serving Canada&apos;s Supplement Needs Since 1999
              </p>
            </div>
          </div>

          {/* Center: Search Bar - 330px × 41px, Font 15px, Padding 8px 55px 12px 25px */}
          <div className="hidden md:flex flex-1 justify-center mx-4">
            <div className="relative w-[330px]">
              <input
                type="search"
                placeholder="Search products..."
                className="w-[330px] h-[41px] pl-[25px] pr-[55px] py-[8px] pb-[12px] text-[15px] font-body text-black bg-white border-0 rounded-full placeholder:text-gray-medium focus:outline-none focus:ring-2 focus:ring-red-primary/50"
              />
              {/* Search icon on the RIGHT */}
              <button 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-medium hover:text-black transition-colors"
                aria-label="Search"
              >
                <Search size={18} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Right: Phone, Icons, Veteran Badge */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {/* Phone - Hidden on small screens, with LOCAL: prefix */}
            <a
              href={`tel:${contactInfo.phone.replace(/[^0-9]/g, "")}`}
              className="hidden lg:block font-heading font-semibold text-small uppercase text-red-primary hover:text-red-hover transition-colors"
            >
              LOCAL: {contactInfo.phone}
            </a>

            {/* Veteran Owned Badge - 47px × 53px */}
            <div className="hidden lg:block">
              <Image
                src="https://nftest.dreamhosters.com/wp-content/uploads/2026/02/veteran-owned-badge.png"
                alt="Veteran Owned Business"
                width={47}
                height={53}
                className="w-[47px] h-[53px] object-contain"
              />
            </div>

            {/* Wishlist - Always show badge with 0 if empty */}
            <Link
              href="/account/wishlist"
              className="relative p-2 text-white hover:bg-white/10 transition-colors"
              aria-label={`Wishlist (${wishlistCount} items)`}
            >
              <Heart size={24} strokeWidth={1.5} />
              <CountBadge
                count={wishlistCount}
                size="sm"
                className="absolute -top-1 -right-1"
              />
            </Link>

            {/* Cart - Always show badge with 0 if empty */}
            <MiniCart cartCount={cartCount} darkMode={true} iconClassName="text-white" showBadgeAlways />
          </div>
        </div>
      </div>
    </div>
  );
}
