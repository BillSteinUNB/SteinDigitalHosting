"use client";

import { useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  X,
  ChevronDown,
  Phone,
  User,
  Heart,
  ShoppingCart,
  LogOut,
  Package,
  MapPin,
  Settings,
} from "lucide-react";
import { IconButton } from "@/components/ui/Button";
import {
  mainNavItems,
  megaMenuCategories,
  contactInfo,
} from "@/lib/navigation";

// ============================================
// MOBILE MENU COMPONENT
// ============================================

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * MobileMenu Component
 *
 * Full-screen slide-out navigation drawer for mobile devices.
 * Features:
 * - Accordion-style expandable categories
 * - Account/Wishlist/Cart links
 * - Contact information
 * - Smooth animations
 */
export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { data: session } = useSession();
  const menuRef = useRef<HTMLDivElement>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle escape key and body scroll lock
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Reset expanded item when menu closes
  useEffect(() => {
    if (!isOpen) {
      setExpandedItem(null);
    }
  }, [isOpen]);

  // Toggle accordion item
  const toggleExpanded = (label: string) => {
    setExpandedItem((prev) => (prev === label ? null : label));
  };

  // Handle sign out
  const handleSignOut = async () => {
    onClose();
    await signOut({ callbackUrl: "/" });
  };

  // Don't render on server or if not mounted
  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-modal lg:hidden" role="presentation">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        className={cn(
          "absolute top-0 left-0 h-full w-[300px] max-w-[85vw]",
          "bg-white flex flex-col",
          "animate-[slideInLeft_200ms_ease-out]"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-border bg-black">
          <span className="font-heading text-h4 text-white uppercase tracking-wide">
            Menu
          </span>
          <IconButton
            icon={<X size={24} strokeWidth={1.5} />}
            aria-label="Close menu"
            variant="ghost"
            size="md"
            onClick={onClose}
            className="text-white hover:bg-white/10"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="py-2">
            {/* Shop - with mega menu categories */}
            <MobileNavAccordion
              label="Shop"
              href="/shop"
              isExpanded={expandedItem === "Shop"}
              onToggle={() => toggleExpanded("Shop")}
              onClose={onClose}
            >
              {megaMenuCategories.flat().map((category) => (
                <div key={category.title} className="mb-4">
                  <Link
                    href={category.href}
                    onClick={onClose}
                    className="block px-6 py-2 font-heading text-sm uppercase text-red-primary hover:bg-gray-light"
                  >
                    {category.title}
                  </Link>
                  <ul>
                    {category.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className="block px-8 py-2 text-sm text-gray-dark hover:bg-gray-light"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </MobileNavAccordion>

            {/* Other nav items */}
            {mainNavItems
              .filter((item) => item.label !== "Shop")
              .map((item) =>
                item.children ? (
                  <MobileNavAccordion
                    key={item.label}
                    label={item.label}
                    href={item.href}
                    isExpanded={expandedItem === item.label}
                    onToggle={() => toggleExpanded(item.label)}
                    onClose={onClose}
                    highlight={item.highlight}
                  >
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={onClose}
                          className="block px-8 py-3 text-sm text-gray-dark hover:bg-gray-light"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </MobileNavAccordion>
                ) : (
                  <MobileNavLink
                    key={item.label}
                    href={item.href}
                    label={item.label}
                    onClick={onClose}
                    highlight={item.highlight}
                  />
                )
              )}
          </ul>

          {/* Divider */}
          <div className="border-t border-gray-border my-2" />

          {/* Account Links */}
          <ul className="py-2">
            {session?.user ? (
              // Authenticated User
              <>
                {/* User Info */}
                <li className="px-4 py-3 bg-gray-light">
                  <p className="text-sm font-semibold truncate">
                    {session.user.name}
                  </p>
                  <p className="text-xs text-gray-medium truncate">
                    {session.user.email}
                  </p>
                  {session.user.isWholesale && (
                    <span className="inline-flex mt-1 px-2 py-0.5 text-tiny font-semibold bg-red-primary text-white">
                      WHOLESALE
                    </span>
                  )}
                </li>
                <li>
                  <Link
                    href="/account"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-gray-light"
                  >
                    <User size={20} strokeWidth={1.5} className="text-gray-dark" />
                    <span>My Account</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account/orders"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-gray-light"
                  >
                    <Package size={20} strokeWidth={1.5} className="text-gray-dark" />
                    <span>Orders</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account/addresses"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-gray-light"
                  >
                    <MapPin size={20} strokeWidth={1.5} className="text-gray-dark" />
                    <span>Addresses</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account/settings"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-gray-light"
                  >
                    <Settings size={20} strokeWidth={1.5} className="text-gray-dark" />
                    <span>Settings</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account/wishlist"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-gray-light"
                  >
                    <Heart size={20} strokeWidth={1.5} className="text-gray-dark" />
                    <span>Wishlist</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cart"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-gray-light"
                  >
                    <ShoppingCart size={20} strokeWidth={1.5} className="text-gray-dark" />
                    <span>Cart</span>
                  </Link>
                </li>
                <li className="border-t border-gray-border mt-2 pt-2">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-gray-light w-full text-left text-red-primary"
                  >
                    <LogOut size={20} strokeWidth={1.5} />
                    <span>Sign Out</span>
                  </button>
                </li>
              </>
            ) : (
              // Guest User
              <>
                <li>
                  <Link
                    href="/login"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-gray-light"
                  >
                    <User size={20} strokeWidth={1.5} className="text-gray-dark" />
                    <span>Login / Register</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account/wishlist"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-gray-light"
                  >
                    <Heart size={20} strokeWidth={1.5} className="text-gray-dark" />
                    <span>Wishlist</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cart"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-gray-light"
                  >
                    <ShoppingCart
                      size={20}
                      strokeWidth={1.5}
                      className="text-gray-dark"
                    />
                    <span>Cart</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Footer - Contact Info */}
        <div className="border-t border-gray-border p-4 bg-gray-light">
          <a
            href={`tel:${contactInfo.phone.replace(/[^0-9]/g, "")}`}
            className="flex items-center gap-2 text-sm font-medium text-red-primary"
          >
            <Phone size={18} strokeWidth={1.5} />
            <span>{contactInfo.phone}</span>
          </a>
          <p className="mt-2 text-xs text-gray-medium">
            {contactInfo.hours.weekdays}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ============================================
// MOBILE NAV ACCORDION
// ============================================

interface MobileNavAccordionProps {
  label: string;
  href: string;
  isExpanded: boolean;
  onToggle: () => void;
  onClose: () => void;
  children: React.ReactNode;
  highlight?: boolean;
}

function MobileNavAccordion({
  label,
  href,
  isExpanded,
  onToggle,
  onClose,
  children,
  highlight,
}: MobileNavAccordionProps) {
  return (
    <li>
      <div
        className={cn(
          "flex items-center border-b border-gray-border/50",
          highlight && "bg-yellow"
        )}
      >
        {/* Main link */}
        <Link
          href={href}
          onClick={onClose}
          className={cn(
            "flex-1 px-4 py-4 font-heading text-sm uppercase tracking-wide min-w-0",
            highlight ? "text-black" : "text-gray-dark hover:text-red-primary"
          )}
        >
          {label}
        </Link>

        {/* Expand button */}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isExpanded}
          aria-label={`Expand ${label} submenu`}
          className={cn(
            "p-4 min-h-[44px] min-w-[44px] flex items-center justify-center",
            "transition-colors",
            highlight ? "hover:bg-black/10" : "hover:bg-gray-light"
          )}
        >
          <ChevronDown
            size={20}
            strokeWidth={1.5}
            className={cn(
              "transition-transform duration-200",
              isExpanded && "rotate-180"
            )}
          />
        </button>
      </div>

      {/* Submenu */}
      <ul
        className={cn(
          "overflow-hidden bg-gray-light/50 transition-all duration-200",
          isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        {children}
      </ul>
    </li>
  );
}

// ============================================
// MOBILE NAV LINK
// ============================================

interface MobileNavLinkProps {
  href: string;
  label: string;
  onClick: () => void;
  highlight?: boolean;
}

function MobileNavLink({
  href,
  label,
  onClick,
  highlight,
}: MobileNavLinkProps) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          "block px-4 py-4 font-heading text-sm uppercase tracking-wide",
          "border-b border-gray-border/50",
          highlight
            ? "bg-yellow text-black"
            : "text-gray-dark hover:text-red-primary hover:bg-gray-light"
        )}
      >
        {label}
      </Link>
    </li>
  );
}
