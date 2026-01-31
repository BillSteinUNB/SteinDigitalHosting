"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { MegaMenuCategory } from "@/lib/navigation";

interface MegaMenuProps {
  categories: MegaMenuCategory[][];
  onClose: () => void;
}

/**
 * MegaMenu Component
 *
 * Full-width dropdown for SHOP navigation.
 * Two rows of 5 columns each showing categories and subcategories.
 */
export default function MegaMenu({ categories, onClose }: MegaMenuProps) {
  return (
    <div
      className={cn(
        "absolute left-1/2 -translate-x-1/2 top-full",
        "w-screen max-w-container bg-white",
        "border border-gray-border shadow-dropdown",
        "animate-slide-down",
        "z-dropdown"
      )}
    >
      <div className="p-8">
        {/* Two rows of categories */}
        {categories.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={cn(
              "grid grid-cols-5 gap-8",
              rowIndex < categories.length - 1 && "mb-8 pb-8 border-b border-gray-border"
            )}
          >
            {row.map((category) => (
              <div key={category.title}>
                {/* Category Header */}
                <Link
                  href={category.href}
                  className="group block mb-4"
                  onClick={onClose}
                >
                  <h3 className="font-heading font-bold text-body uppercase text-black group-hover:text-red-primary transition-colors">
                    {category.title}
                  </h3>
                  {/* Underline accent */}
                  <div className="w-10 h-0.5 bg-black mt-2 group-hover:bg-red-primary transition-colors" />
                </Link>

                {/* Subcategory Links */}
                <ul className="space-y-2">
                  {category.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-small text-gray-medium hover:text-red-primary transition-colors"
                        onClick={onClose}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}

        {/* Shop All Link */}
        <div className="mt-6 pt-6 border-t border-gray-border text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 font-heading font-bold text-small uppercase text-red-primary hover:text-red-hover transition-colors"
            onClick={onClose}
          >
            View All Products
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
