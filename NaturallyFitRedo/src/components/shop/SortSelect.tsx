"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductSortOption } from "@/types/product";

// ============================================
// TYPES
// ============================================

export interface SortSelectProps {
  value: ProductSortOption;
  onChange: (value: ProductSortOption) => void;
  className?: string;
}

// ============================================
// SORT OPTIONS
// ============================================

interface SortOptionConfig {
  value: ProductSortOption;
  label: string;
}

const sortOptions: SortOptionConfig[] = [
  { value: "default", label: "Default Sorting" },
  { value: "popularity", label: "Sort by Popularity" },
  { value: "rating", label: "Sort by Rating" },
  { value: "date-desc", label: "Sort by Newest" },
  { value: "price-asc", label: "Sort by Price: Low to High" },
  { value: "price-desc", label: "Sort by Price: High to Low" },
  { value: "name-asc", label: "Sort by Name: A to Z" },
  { value: "name-desc", label: "Sort by Name: Z to A" },
];

// ============================================
// SORT SELECT COMPONENT
// ============================================

/**
 * SortSelect Component
 *
 * Dropdown for selecting product sort order.
 * Styled to match NF design system with sharp corners.
 */
export default function SortSelect({
  value,
  onChange,
  className,
}: SortSelectProps) {
  return (
    <div className={cn("relative inline-block", className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ProductSortOption)}
        className={cn(
          // Base styles
          "appearance-none cursor-pointer",
          "px-4 py-2.5 pr-10 min-h-[44px]",
          "text-small font-body text-black",
          "bg-white border border-gray-border rounded-none",
          "transition-colors duration-200",
          // Focus state
          "focus:outline-none focus:border-black",
          // Hover state
          "hover:border-gray-dark"
        )}
        aria-label="Sort products"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {/* Custom dropdown arrow */}
      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-medium">
        <ChevronDown size={18} strokeWidth={1.5} />
      </span>
    </div>
  );
}

// ============================================
// GRID/LIST VIEW TOGGLE (Bonus)
// ============================================

export interface ViewToggleProps {
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
  className?: string;
}

/**
 * ViewToggle Component
 *
 * Toggle between grid and list view for product listings.
 */
export function ViewToggle({ view, onViewChange, className }: ViewToggleProps) {
  return (
    <div className={cn("flex", className)}>
      {/* Grid View Button */}
      <button
        type="button"
        onClick={() => onViewChange("grid")}
        className={cn(
          "p-2.5 min-w-[44px] min-h-[44px]",
          "border border-gray-border border-r-0",
          "transition-colors duration-200",
          view === "grid"
            ? "bg-black text-white"
            : "bg-white text-gray-medium hover:text-black"
        )}
        aria-label="Grid view"
        aria-pressed={view === "grid"}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      </button>
      
      {/* List View Button */}
      <button
        type="button"
        onClick={() => onViewChange("list")}
        className={cn(
          "p-2.5 min-w-[44px] min-h-[44px]",
          "border border-gray-border",
          "transition-colors duration-200",
          view === "list"
            ? "bg-black text-white"
            : "bg-white text-gray-medium hover:text-black"
        )}
        aria-label="List view"
        aria-pressed={view === "list"}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      </button>
    </div>
  );
}

// ============================================
// PER PAGE SELECT
// ============================================

export interface PerPageSelectProps {
  value: number;
  onChange: (value: number) => void;
  options?: number[];
  className?: string;
}

/**
 * PerPageSelect Component
 *
 * Dropdown for selecting how many products to show per page.
 */
export function PerPageSelect({
  value,
  onChange,
  options = [12, 24, 36, 48],
  className,
}: PerPageSelectProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-small text-gray-medium">Show:</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className={cn(
            "appearance-none cursor-pointer",
            "px-3 py-2 pr-8 min-h-[40px]",
            "text-small font-body text-black",
            "bg-white border border-gray-border rounded-none",
            "transition-colors duration-200",
            "focus:outline-none focus:border-black",
            "hover:border-gray-dark"
          )}
          aria-label="Products per page"
        >
          {options.map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
        <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-medium">
          <ChevronDown size={16} strokeWidth={1.5} />
        </span>
      </div>
    </div>
  );
}
