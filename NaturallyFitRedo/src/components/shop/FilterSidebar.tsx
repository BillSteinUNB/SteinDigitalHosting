"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, Input, Drawer } from "@/components/ui";
import type { CategoryWithCount } from "@/lib/graphql/categories";
import { buildAllowedCategoryTree, type CategoryTreeNode } from "@/lib/shop-categories";
import type { BrandWithDetails } from "@/lib/mock/brands";
import { getPriceRange } from "@/lib/mock";
import type { ProductFilters } from "@/types/product";

// ============================================
// TYPES
// ============================================

export interface FilterSidebarProps {
  filters: ProductFilters;
  onFilterChange: (filters: Partial<ProductFilters>) => void;
  onClearFilters: () => void;
  className?: string;
  categories?: CategoryWithCount[];
  brands?: BrandWithDetails[];
}

export interface MobileFilterDrawerProps extends FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// ============================================
// FILTER SECTION COMPONENT
// ============================================

interface FilterSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function FilterSection({ title, defaultOpen = true, children }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-border pb-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between w-full py-3",
          "font-heading text-small uppercase tracking-wide",
          "hover:text-red-primary transition-colors",
          "min-h-[44px]"
        )}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        {isOpen ? (
          <ChevronUp size={20} strokeWidth={1.5} />
        ) : (
          <ChevronDown size={20} strokeWidth={1.5} />
        )}
      </button>
      
      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="py-2">{children}</div>
      </div>
    </div>
  );
}

// ============================================
// CHECKBOX FILTER ITEM
// ============================================

interface FilterCheckboxProps {
  label: string;
  count?: number;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function FilterCheckbox({ label, count, checked, onChange }: FilterCheckboxProps) {
  return (
    <label
      className={cn(
        "flex items-center gap-3 py-1.5 cursor-pointer group min-h-[36px]",
        "text-small text-gray-dark hover:text-black transition-colors"
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={cn(
          "w-4 h-4 rounded-none border border-gray-border",
          "text-red-primary focus:ring-red-primary focus:ring-offset-0",
          "cursor-pointer"
        )}
      />
      <span className="flex-1 min-w-0 truncate">{label}</span>
      {count !== undefined && (
        <span className="text-tiny text-gray-medium">({count})</span>
      )}
    </label>
  );
}

// ============================================
// CATEGORY FILTER
// ============================================

interface CategoryFilterProps {
  categories: CategoryTreeNode[];
  selectedCategory?: string;
  onSelect: (slug: string | undefined) => void;
  activeCategoryPath: Set<string>;
}

function CategoryFilter({
  categories: cats,
  selectedCategory,
  onSelect,
  activeCategoryPath,
}: CategoryFilterProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleExpanded = (slug: string) => {
    setExpandedCategories((prev) =>
      prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug]
    );
  };

  const renderCategory = (category: CategoryTreeNode, level: number = 0) => {
    const hasChildren = Boolean(category.children && category.children.length > 0);
    const isInActivePath = activeCategoryPath.has(category.slug);
    const isExpanded = expandedCategories.includes(category.slug) || isInActivePath;
    const isSelected = selectedCategory === category.slug;
    const isSelectable = !hasChildren;

    return (
      <div key={category.id} className={cn(level > 0 && "ml-4")}>
        <div className="flex items-center">
          {hasChildren && (
            <button
              type="button"
              onClick={() => toggleExpanded(category.slug)}
              disabled={isInActivePath}
              className="p-1 mr-1 hover:bg-gray-light transition-colors min-w-[28px] min-h-[28px] flex items-center justify-center"
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? (
                <ChevronUp size={16} strokeWidth={1.5} />
              ) : (
                <ChevronDown size={16} strokeWidth={1.5} />
              )}
            </button>
          )}
          
          {isSelectable ? (
            <button
              type="button"
              onClick={() => onSelect(isSelected ? undefined : category.slug)}
              className={cn(
                "flex-1 flex items-center justify-between py-1.5 text-left min-h-[36px]",
                "text-small transition-colors",
                isSelected
                  ? "text-red-primary font-semibold"
                  : "text-gray-dark hover:text-black",
                !hasChildren && "ml-7"
              )}
            >
              <span className="truncate">{category.name}</span>
              <span className="text-tiny text-gray-medium ml-2">
                ({category.productCount})
              </span>
            </button>
          ) : (
            <div
              className={cn(
                "flex-1 flex items-center justify-between py-1.5 text-left min-h-[36px]",
                "text-small",
                isSelected ? "text-red-primary font-semibold" : "text-gray-dark"
              )}
            >
              <span className="truncate">{category.name}</span>
              <span className="text-tiny text-gray-medium ml-2">
                ({category.productCount})
              </span>
            </div>
          )}
        </div>

        {hasChildren && (isExpanded || isInActivePath) && category.children && (
          <div className="mt-1">
            {category.children.map((child) => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {cats.map((category) => renderCategory(category))}
    </div>
  );
}

// ============================================
// BRAND FILTER
// ============================================

interface BrandFilterProps {
  brands: BrandWithDetails[];
  selectedBrand?: string;
  onSelect: (slug: string | undefined) => void;
}

function BrandFilter({ brands: brandList, selectedBrand, onSelect }: BrandFilterProps) {
  const [showAll, setShowAll] = useState(false);
  const sortedBrands = useMemo(
    () => [...brandList].sort((a, b) => a.name.localeCompare(b.name)),
    [brandList]
  );
  const displayedBrands = showAll ? sortedBrands : sortedBrands.slice(0, 8);

  return (
    <div className="space-y-1">
      {displayedBrands.map((brand) => (
        <FilterCheckbox
          key={brand.id}
          label={brand.name}
          count={brand.productCount}
          checked={selectedBrand === brand.slug}
          onChange={(checked) => onSelect(checked ? brand.slug : undefined)}
        />
      ))}
      
      {brandList.length > 8 && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="text-small text-red-primary hover:underline mt-2 min-h-[44px] flex items-center"
        >
          {showAll ? "Show Less" : `Show All (${brandList.length})`}
        </button>
      )}
    </div>
  );
}

// ============================================
// PRICE RANGE FILTER
// ============================================

interface PriceRangeFilterProps {
  minPrice?: number;
  maxPrice?: number;
  priceRange: { min: number; max: number };
  onChange: (min?: number, max?: number) => void;
}

function PriceRangeFilter({
  minPrice,
  maxPrice,
  priceRange,
  onChange,
}: PriceRangeFilterProps) {
  const [localMin, setLocalMin] = useState(minPrice?.toString() || "");
  const [localMax, setLocalMax] = useState(maxPrice?.toString() || "");

  const handleApply = () => {
    const min = localMin ? parseFloat(localMin) : undefined;
    const max = localMax ? parseFloat(localMax) : undefined;
    onChange(min, max);
  };

  const handleClear = () => {
    setLocalMin("");
    setLocalMax("");
    onChange(undefined, undefined);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <Input
            type="number"
            placeholder={`$${priceRange.min}`}
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
            className="text-small py-2"
            aria-label="Minimum price"
          />
        </div>
        <span className="text-gray-medium">—</span>
        <div className="flex-1 min-w-0">
          <Input
            type="number"
            placeholder={`$${priceRange.max}`}
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
            className="text-small py-2"
            aria-label="Maximum price"
          />
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleApply}
          className="flex-1"
        >
          APPLY
        </Button>
        {(localMin || localMax) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
          >
            CLEAR
          </Button>
        )}
      </div>
    </div>
  );
}

// ============================================
// ADDITIONAL FILTERS
// ============================================

interface AdditionalFiltersProps {
  onSale?: boolean;
  inStock?: boolean;
  onChange: (filters: Partial<ProductFilters>) => void;
}

function AdditionalFilters({ onSale, inStock, onChange }: AdditionalFiltersProps) {
  return (
    <div className="space-y-1">
      <FilterCheckbox
        label="On Sale"
        checked={onSale || false}
        onChange={(checked) => onChange({ onSale: checked || undefined })}
      />
      <FilterCheckbox
        label="In Stock Only"
        checked={inStock || false}
        onChange={(checked) => onChange({ inStock: checked || undefined })}
      />
    </div>
  );
}

// ============================================
// FILTER SIDEBAR (DESKTOP)
// ============================================

/**
 * FilterSidebar Component
 *
 * Desktop sidebar for filtering products on the shop page.
 * Includes category, brand, price range, and additional filters.
 */
export default function FilterSidebar({
  filters,
  onFilterChange,
  onClearFilters,
  className,
  categories = [],
  brands = [],
}: FilterSidebarProps) {
  const priceRange = useMemo(() => getPriceRange(), []);
  const allowedCategoryTree = useMemo(
    () => buildAllowedCategoryTree(categories),
    [categories]
  );
  const activeCategoryPath = useMemo(() => {
    const path = new Set<string>();
    const selected = filters.category;
    if (!selected) {
      return path;
    }

    const matches = (node: CategoryTreeNode) =>
      node.slug === selected ||
      Boolean(node.children?.some((child) => child.slug === selected));

    const traverse = (nodes: CategoryTreeNode[], ancestors: string[] = []) => {
      for (const node of nodes) {
        const nextAncestors = [...ancestors, node.slug];
        if (matches(node)) {
          nextAncestors.forEach((slug) => path.add(slug));
          return true;
        }
        if (node.children && traverse(node.children, nextAncestors)) {
          return true;
        }
      }
      return false;
    };

    traverse(allowedCategoryTree);
    return path;
  }, [allowedCategoryTree, filters.category]);

  const hasActiveFilters =
    filters.category ||
    filters.brand ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.onSale ||
    filters.inStock;

  return (
    <aside className={cn("w-full", className)}>
      {/* Header with Clear All */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-border mb-4">
        <h2 className="font-heading text-h4 uppercase">FILTERS</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="text-small text-red-primary hover:underline min-h-[44px] flex items-center"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Category Filter */}
      <FilterSection title="Category">
        <CategoryFilter
          categories={allowedCategoryTree}
          selectedCategory={filters.category}
          activeCategoryPath={activeCategoryPath}
          onSelect={(slug) => onFilterChange({ category: slug })}
        />
      </FilterSection>

      {/* Brand Filter */}
      <FilterSection title="Brand">
        <BrandFilter
          brands={brands}
          selectedBrand={filters.brand}
          onSelect={(slug) => onFilterChange({ brand: slug })}
        />
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price">
        <PriceRangeFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          priceRange={priceRange}
          onChange={(min, max) => onFilterChange({ minPrice: min, maxPrice: max })}
        />
      </FilterSection>

      {/* Additional Filters */}
      <FilterSection title="Other">
        <AdditionalFilters
          onSale={filters.onSale}
          inStock={filters.inStock}
          onChange={onFilterChange}
        />
      </FilterSection>
    </aside>
  );
}

// ============================================
// MOBILE FILTER DRAWER
// ============================================

/**
 * MobileFilterDrawer Component
 *
 * Mobile-friendly drawer version of the filter sidebar.
 * Slides in from the left on mobile devices.
 */
export function MobileFilterDrawer({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onClearFilters,
  categories = [],
  brands = [],
}: MobileFilterDrawerProps) {
  const priceRange = useMemo(() => getPriceRange(), []);
  const allowedCategoryTree = useMemo(
    () => buildAllowedCategoryTree(categories),
    [categories]
  );
  const activeCategoryPath = useMemo(() => {
    const path = new Set<string>();
    const selected = filters.category;
    if (!selected) {
      return path;
    }

    const matches = (node: CategoryTreeNode) =>
      node.slug === selected ||
      Boolean(node.children?.some((child) => child.slug === selected));

    const traverse = (nodes: CategoryTreeNode[], ancestors: string[] = []) => {
      for (const node of nodes) {
        const nextAncestors = [...ancestors, node.slug];
        if (matches(node)) {
          nextAncestors.forEach((slug) => path.add(slug));
          return true;
        }
        if (node.children && traverse(node.children, nextAncestors)) {
          return true;
        }
      }
      return false;
    };

    traverse(allowedCategoryTree);
    return path;
  }, [allowedCategoryTree, filters.category]);

  const hasActiveFilters =
    filters.category ||
    filters.brand ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.onSale ||
    filters.inStock;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} side="left" title="FILTERS">
      <div className="flex flex-col h-full">
        {/* Scrollable filter content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {/* Clear All button at top if filters active */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="text-small text-red-primary hover:underline mb-4 min-h-[44px] flex items-center"
            >
              Clear All Filters
            </button>
          )}

          {/* Category Filter */}
          <FilterSection title="Category">
            <CategoryFilter
              categories={allowedCategoryTree}
              selectedCategory={filters.category}
              activeCategoryPath={activeCategoryPath}
              onSelect={(slug) => onFilterChange({ category: slug })}
            />
          </FilterSection>

          {/* Brand Filter */}
          <FilterSection title="Brand">
            <BrandFilter
              brands={brands}
              selectedBrand={filters.brand}
              onSelect={(slug) => onFilterChange({ brand: slug })}
            />
          </FilterSection>

          {/* Price Range */}
          <FilterSection title="Price">
            <PriceRangeFilter
              minPrice={filters.minPrice}
              maxPrice={filters.maxPrice}
              priceRange={priceRange}
              onChange={(min, max) => onFilterChange({ minPrice: min, maxPrice: max })}
            />
          </FilterSection>

          {/* Additional Filters */}
          <FilterSection title="Other">
            <AdditionalFilters
              onSale={filters.onSale}
              inStock={filters.inStock}
              onChange={onFilterChange}
            />
          </FilterSection>
        </div>

        {/* Fixed footer with apply button */}
        <div className="border-t border-gray-border p-4">
          <Button variant="primary" fullWidth onClick={onClose}>
            VIEW RESULTS
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
