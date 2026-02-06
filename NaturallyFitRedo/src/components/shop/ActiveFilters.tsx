"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

import type { ProductFilters as ProductFiltersType } from "@/types/product";
import { getCategoryBySlug } from "@/lib/mock/categories";
import { getAllowedCategoryLabel } from "@/lib/shop-categories";
import { getBrandBySlug } from "@/lib/mock/brands";
import { formatPrice } from "@/lib/utils";

// ============================================
// TYPES
// ============================================

export interface ActiveFiltersProps {
  filters: ProductFiltersType;
  onRemoveFilter: (key: keyof ProductFiltersType, value?: string | number) => void;
  onClearAll: () => void;
  className?: string;
}

// ============================================
// FILTER TAG COMPONENT
// ============================================

interface FilterTagProps {
  label: string;
  onRemove: () => void;
}

function FilterTag({ label, onRemove }: FilterTagProps) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5",
        "bg-gray-light text-small text-gray-dark",
        "hover:bg-red-primary hover:text-white",
        "transition-colors duration-200",
        "min-h-[32px]"
      )}
      aria-label={`Remove filter: ${label}`}
    >
      <span>{label}</span>
      <X size={14} strokeWidth={1.5} />
    </button>
  );
}

// ============================================
// ACTIVE FILTERS COMPONENT
// ============================================

/**
 * ActiveFilters Component
 *
 * Displays currently active filters as removable tags.
 * Shows "Clear All" button when filters are active.
 */
export default function ActiveFilters({
  filters,
  onRemoveFilter,
  onClearAll,
  className,
}: ActiveFiltersProps) {
  // Build array of active filter tags
  const tags: { key: keyof ProductFiltersType; label: string; value?: string | number }[] = [];

  // Category filter
  if (filters.category) {
    const category = getCategoryBySlug(filters.category);
    const allowedLabel = getAllowedCategoryLabel(filters.category);
    tags.push({
      key: "category",
      label: `Category: ${category?.name || allowedLabel || filters.category}`,
    });
  }

  // Brand filter
  if (filters.brand) {
    const brand = getBrandBySlug(filters.brand);
    tags.push({
      key: "brand",
      label: `Brand: ${brand?.name || filters.brand}`,
    });
  }

  // Price range filters
  if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
    tags.push({
      key: "minPrice",
      label: `Price: ${formatPrice(filters.minPrice)} - ${formatPrice(filters.maxPrice)}`,
    });
  } else if (filters.minPrice !== undefined) {
    tags.push({
      key: "minPrice",
      label: `Min Price: ${formatPrice(filters.minPrice)}`,
    });
  } else if (filters.maxPrice !== undefined) {
    tags.push({
      key: "maxPrice",
      label: `Max Price: ${formatPrice(filters.maxPrice)}`,
    });
  }

  // On sale filter
  if (filters.onSale) {
    tags.push({
      key: "onSale",
      label: "On Sale",
    });
  }

  // Search filter
  if (filters.search) {
    tags.push({
      key: "search",
      label: `Search: "${filters.search}"`,
    });
  }

  // Don't render if no active filters
  if (tags.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="text-small text-gray-medium font-medium mr-1">
        Active Filters:
      </span>
      
      {tags.map((tag) => (
        <FilterTag
          key={`${tag.key}-${tag.value || ''}`}
          label={tag.label}
          onRemove={() => onRemoveFilter(tag.key, tag.value)}
        />
      ))}

      {tags.length > 1 && (
        <button
          type="button"
          onClick={onClearAll}
          className={cn(
            "text-small text-red-primary hover:underline",
            "ml-2 min-h-[32px] flex items-center"
          )}
        >
          Clear All
        </button>
      )}
    </div>
  );
}

// ============================================
// RESULTS COUNT COMPONENT
// ============================================

export interface ResultsCountProps {
  total: number;
  currentPage: number;
  perPage: number;
  className?: string;
}

/**
 * ResultsCount Component
 *
 * Shows the current results count (e.g., "Showing 1-12 of 45 results")
 */
export function ResultsCount({
  total,
  currentPage,
  perPage,
  className,
}: ResultsCountProps) {
  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, total);

  if (total === 0) {
    return (
      <p className={cn("text-small text-gray-medium", className)}>
        No products found
      </p>
    );
  }

  return (
    <p className={cn("text-small text-gray-medium", className)}>
      Showing <span className="font-semibold text-black">{start}-{end}</span> of{" "}
      <span className="font-semibold text-black">{total}</span> results
    </p>
  );
}
