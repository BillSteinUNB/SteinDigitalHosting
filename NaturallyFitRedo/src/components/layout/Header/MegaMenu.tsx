"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { replaceWordPressBase } from "@/lib/config/wordpress";
import type { MegaMenuCategory } from "@/lib/navigation";

// ============================================
// WORDPRESS MEGA MENU IMAGE REFERENCES
// ============================================
const WP_MENU_IMAGES = {
  menuImg1: replaceWordPressBase("https://naturallyfit.ca/wp-content/uploads/2022/05/Menu_img.png"),
  menuImg2: replaceWordPressBase("https://naturallyfit.ca/wp-content/uploads/2022/05/Menu_img1.png"),
  menuImg3: replaceWordPressBase("https://naturallyfit.ca/wp-content/uploads/2022/05/Menu_img2.png"),
  // Category feature images
  categoryFeature1: replaceWordPressBase("https://naturallyfit.ca/wp-content/uploads/2019/05/Untitled-design-3.png"),
  categoryFeature2: replaceWordPressBase("https://naturallyfit.ca/wp-content/uploads/2023/11/Untitled-design-8.png"),
  categoryFeature3: replaceWordPressBase("https://naturallyfit.ca/wp-content/uploads/2023/12/81vSatsWL._AC_UF8941000_QL80_.jpg"),
};

interface MegaMenuProps {
  categories: MegaMenuCategory[][];
  onClose: () => void;
}

/**
 * MegaMenu Component
 *
 * Full-width dropdown for SHOP navigation.
 * Rows of category columns showing categories and subcategories.
 * Includes promotional images from WordPress.
 */
export default function MegaMenu({ categories, onClose }: MegaMenuProps) {
  const getColumnsClass = (count: number) => {
    if (count >= 5) return "grid-cols-5";
    if (count === 4) return "grid-cols-4";
    if (count === 3) return "grid-cols-3";
    if (count === 2) return "grid-cols-2";
    return "grid-cols-1";
  };

  return (
    <div
      className={cn(
        "fixed left-4 right-4 top-[206px] mx-auto",
        "max-w-[1400px] bg-white",
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
              "grid gap-8",
              getColumnsClass(row.length),
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

        {/* Promotional Images Row */}
        <div className="mt-6 pt-6 border-t border-gray-border">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Link href="/shop" onClick={onClose} className="group relative aspect-[2/1] overflow-hidden">
              <Image
                src={WP_MENU_IMAGES.menuImg1}
                alt="Shop Promotion"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 1400px) 33vw, 450px"
              />
            </Link>
            <Link href="/shop" onClick={onClose} className="group relative aspect-[2/1] overflow-hidden">
              <Image
                src={WP_MENU_IMAGES.menuImg2}
                alt="Shop Promotion"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 1400px) 33vw, 450px"
              />
            </Link>
            <Link href="/shop" onClick={onClose} className="group relative aspect-[2/1] overflow-hidden">
              <Image
                src={WP_MENU_IMAGES.menuImg3}
                alt="Shop Promotion"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 1400px) 33vw, 450px"
              />
            </Link>
          </div>

          {/* Shop All Link */}
          <div className="text-center">
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
    </div>
  );
}
