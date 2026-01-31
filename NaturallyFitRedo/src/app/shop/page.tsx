"use client";

import { useState, useMemo, useCallback } from "react";
import { SlidersHorizontal } from "lucide-react";

import { Container, SectionHeading, Button, EmptyState } from "@/components/ui";
import { ProductGrid } from "@/components/product";
import {
  FilterSidebar,
  MobileFilterDrawer,
  ActiveFilters,
  ResultsCount,
  SortSelect,
  ViewToggle,
  PerPageSelect,
  Pagination,
} from "@/components/shop";
import { getPaginatedProducts } from "@/lib/mock";
import type { ProductFilters, ProductSortOption } from "@/types/product";

// ============================================
// SHOP PAGE COMPONENT
// ============================================

export default function ShopPage() {
  // State
  const [filters, setFilters] = useState<ProductFilters>({});
  const [sortBy, setSortBy] = useState<ProductSortOption>("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Get paginated products based on filters and sort
  const { products, pageInfo } = useMemo(() => {
    return getPaginatedProducts({
      filters,
      sortBy,
      page: currentPage,
      perPage,
    });
  }, [filters, sortBy, currentPage, perPage]);

  // Handler: Update filters
  const handleFilterChange = useCallback((newFilters: Partial<ProductFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  // Handler: Clear all filters
  const handleClearFilters = useCallback(() => {
    setFilters({});
    setCurrentPage(1);
  }, []);

  // Handler: Remove single filter
  const handleRemoveFilter = useCallback((key: keyof ProductFilters) => {
    setFilters((prev) => {
      const updated = { ...prev };
      delete updated[key];
      // Also clear related filters
      if (key === "minPrice" || key === "maxPrice") {
        delete updated.minPrice;
        delete updated.maxPrice;
      }
      return updated;
    });
    setCurrentPage(1);
  }, []);

  // Handler: Sort change
  const handleSortChange = useCallback((newSort: ProductSortOption) => {
    setSortBy(newSort);
    setCurrentPage(1);
  }, []);

  // Handler: Per page change
  const handlePerPageChange = useCallback((newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  }, []);

  // Handler: Page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Check if any filters are active
  const hasActiveFilters =
    filters.category ||
    filters.brand ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.onSale ||
    filters.inStock;

  return (
    <main className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="bg-gray-light py-8 md:py-12">
        <Container>
          <div className="text-center">
            <SectionHeading centered>SHOP ALL PRODUCTS</SectionHeading>
            <p className="text-body text-gray-medium mt-2">
              Browse our complete selection of premium supplements
            </p>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <Container className="py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </aside>

          {/* Products Section */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-border">
              {/* Left: Mobile filter button + Results count */}
              <div className="flex items-center gap-4">
                {/* Mobile Filter Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFilterDrawerOpen(true)}
                  className="lg:hidden flex items-center gap-2"
                >
                  <SlidersHorizontal size={18} strokeWidth={1.5} />
                  <span>FILTERS</span>
                  {hasActiveFilters && (
                    <span className="w-2 h-2 bg-red-primary rounded-full" />
                  )}
                </Button>

                {/* Results Count */}
                <ResultsCount
                  total={pageInfo.total}
                  currentPage={pageInfo.currentPage}
                  perPage={perPage}
                  className="hidden sm:block"
                />
              </div>

              {/* Right: Sort, View, PerPage */}
              <div className="flex items-center gap-3 flex-wrap">
                <PerPageSelect
                  value={perPage}
                  onChange={handlePerPageChange}
                  className="hidden md:flex"
                />
                <ViewToggle
                  view={viewMode}
                  onViewChange={setViewMode}
                  className="hidden sm:flex"
                />
                <SortSelect value={sortBy} onChange={handleSortChange} />
              </div>
            </div>

            {/* Mobile Results Count */}
            <div className="sm:hidden mb-4">
              <ResultsCount
                total={pageInfo.total}
                currentPage={pageInfo.currentPage}
                perPage={perPage}
              />
            </div>

            {/* Active Filters (Desktop) */}
            {hasActiveFilters && (
              <div className="hidden lg:block mb-6">
                <ActiveFilters
                  filters={filters}
                  onRemoveFilter={handleRemoveFilter}
                  onClearAll={handleClearFilters}
                />
              </div>
            )}

            {/* Products Grid/List */}
            {products.length > 0 ? (
              <>
                <ProductGrid
                  products={products}
                  columns={viewMode === "list" ? 2 : 4}
                  className="py-0"
                />

                {/* Pagination */}
                {pageInfo.totalPages > 1 && (
                  <div className="mt-8 pt-8 border-t border-gray-border">
                    <Pagination
                      currentPage={pageInfo.currentPage}
                      totalPages={pageInfo.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                title="No Products Found"
                description="Try adjusting your filters or search criteria to find what you're looking for."
                action={
                  hasActiveFilters ? (
                    <Button variant="primary" onClick={handleClearFilters}>
                      CLEAR ALL FILTERS
                    </Button>
                  ) : undefined
                }
              />
            )}
          </div>
        </div>
      </Container>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />
    </main>
  );
}
