"use client";

import { useState } from "react";
import TopBar from "./TopBar";
import MainNav from "./MainNav";
import MobileMenu from "./MobileMenu";

/**
 * Header Component
 *
 * Two-row sticky header:
 * - Row 1: TopBar (logos, tagline, phone, search, cart/wishlist)
 * - Row 2: MainNav (navigation items with mega menu)
 */
export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-sticky bg-white">
      {/* Row 1: Top Bar */}
      <TopBar onMobileMenuToggle={() => setIsMobileMenuOpen(true)} />

      {/* Row 2: Main Navigation */}
      <MainNav />

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
}
