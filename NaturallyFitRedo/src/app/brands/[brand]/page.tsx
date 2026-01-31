"use client";

import { useState, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, SlidersHorizontal, ExternalLink } from "lucide-react";

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
import { getBrandBySlug, type BrandWithDetails } from "@/lib/mock/brands";
import type { ProductFilters, ProductSortOption } from "@/types/product";

// ============================================
// BREADCRUMB COMPONENT
// ============================================

interface BreadcrumbProps {
  brand: BrandWithDetails;
}

function Breadcrumb({ brand }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center flex-wrap gap-1 text-small">
        <li>
          <Link href="/" className="text-gray-medium hover:text-red-primary transition-colors">
            Home
          </Link>
        </li>
        <ChevronRight size={14} className="text-gray-medium" />
        <li>
          <Link href="/brands" className="text-gray-medium hover:text-red-primary transition-colors">
            Brands
          </Link>
        </li>
        <ChevronRight size={14} className="text-gray-medium" />
        <li>
          <span className="text-black font-medium">{brand.name}</span>
        </li>
      </ol>
    </nav>
  );
}

// ============================================
// BRAND HEADER COMPONENT
// ============================================

interface BrandHeaderProps {
  brand: BrandWithDetails;
}

function BrandHeader({ brand }: BrandHeaderProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
      {/* Brand Logo */}
      {brand.logo && !imageError && (
        <div className="relative w-32 h-24 md:w-40 md:h-28 flex-shrink-0">
          <Image
            src={brand.logo.sourceUrl}
            alt={brand.logo.altText || brand.name}
            fill
            className="object-contain"
            sizes="160px"
            onError={() => setImageError(true)}
            priority
          />
        </div>
      )}

      {/* Brand Info */}
      <div className="flex-1 min-w-0">
        <SectionHeading>{brand.name.toUpperCase()}</SectionHeading>
        {brand.description && (
          <p className="text-body text-gray-medium mt-2 max-w-3xl">
            {brand.description}
          </p>
        )}
        {brand.website && (
          <a
            href={brand.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-small text-red-primary hover:underline mt-2"
          >
            Visit Official Website
            <ExternalLink size={14} strokeWidth={1.5} />
          </a>
        )}
      </div>
    </div>
  );
}

// ============================================
// SINGLE BRAND PAGE COMPONENT
// ============================================

export default function BrandPage() {
  const params = useParams();
  const brandSlug = params.brand as string;

  // Get brand data
  const brand = getBrandBySlug(brandSlug);

  // State
  const [filters, setFilters] = useState<ProductFilters>({
    brand: brandSlug,
  });
  const [sortBy, setSortBy] = useState<ProductSortOption>("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Get paginated products
  const { products, pageInfo } = useMemo(() => {
    return getPaginatedProducts({
      filters,
      sortBy,
      page: currentPage,
      perPage,
    });
  }, [filters, sortBy, currentPage, perPage]);

  // Handler: Update filters
  const handleFilterChange = useCallback(
    (newFilters: Partial<ProductFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      setCurrentPage(1);
    },
    []
  );

  // Handler: Clear all filters (keep brand)
  const handleClearFilters = useCallback(() => {
    setFilters({ brand: brandSlug });
    setCurrentPage(1);
  }, [brandSlug]);

  // Handler: Remove single filter
  const handleRemoveFilter = useCallback((key: keyof ProductFilters) => {
    // Don't allow removing brand filter on brand page
    if (key === "brand") return;

    setFilters((prev) => {
      const updated = { ...prev };
      delete updated[key];
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

  // Check if non-brand filters are active
  const hasActiveFilters =
    filters.category ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.onSale ||
    filters.inStock;

  // 404 for unknown brand
  if (!brand) {
    return (
      <main className="min-h-screen bg-white">
        <Container className="py-16">
          <EmptyState
            title="Brand Not Found"
            description="The brand you're looking for doesn't exist or has been removed."
            action={
              <Link href="/brands">
                <Button variant="primary">VIEW ALL BRANDS</Button>
              </Link>
            }
          />
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="bg-gray-light py-8 md:py-12">
        <Container>
          <Breadcrumb brand={brand} />
          <BrandHeader brand={brand} />
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
              {/* Left */}
              <div className="flex items-center gap-4">
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
                <ResultsCount
                  total={pageInfo.total}
                  currentPage={pageInfo.currentPage}
                  perPage={perPage}
                  className="hidden sm:block"
                />
              </div>

              {/* Right */}
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

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="hidden lg:block mb-6">
                <ActiveFilters
                  filters={{ ...filters, brand: undefined }}
                  onRemoveFilter={handleRemoveFilter}
                  onClearAll={handleClearFilters}
                />
              </div>
            )}

            {/* Products Grid */}
            {products.length > 0 ? (
              <>
                <ProductGrid
                  products={products}
                  columns={viewMode === "list" ? 2 : 4}
                  className="py-0"
                />

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
                description={`No ${brand.name} products match your current filters.`}
                action={
                  hasActiveFilters ? (
                    <Button variant="primary" onClick={handleClearFilters}>
                      CLEAR FILTERS
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
