"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useParams, useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, SlidersHorizontal, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

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
import { getPaginatedProductsGraphQL } from "@/lib/graphql/products";
import { getBrandBySlug, type BrandWithDetails } from "@/lib/mock/brands";
import { getCategories } from "@/lib/graphql/categories";
import { getWooBrands } from "@/lib/woocommerce/brands";
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const brandSlug = params.brand as string;

  // Get brand data (keep using mock data for brands)
  const brand = getBrandBySlug(brandSlug);

  // Initialize state from URL params
  const [filters, setFilters] = useState<ProductFilters>(() => {
    const initialFilters: ProductFilters = { brand: brandSlug };
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const onSale = searchParams.get("on_sale");
    const inStock = searchParams.get("in_stock");

    if (category) initialFilters.category = category;
    if (minPrice) initialFilters.minPrice = parseFloat(minPrice);
    if (maxPrice) initialFilters.maxPrice = parseFloat(maxPrice);
    if (onSale === "true") initialFilters.onSale = true;
    if (inStock === "true") initialFilters.inStock = true;

    return initialFilters;
  });

  const [sortBy, setSortBy] = useState<ProductSortOption>(
    (searchParams.get("sort") as ProductSortOption) || "default"
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1", 10)
  );
  const [perPage, setPerPage] = useState(
    parseInt(searchParams.get("perPage") || "12", 10)
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">(
    (searchParams.get("view") as "grid" | "list") || "grid"
  );
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const { data: wooBrands } = useQuery({
    queryKey: ["woo-brands"],
    queryFn: getWooBrands,
  });
  const brandFilters = useMemo<BrandWithDetails[]>(() => {
    if (!wooBrands) return [];
    return [...wooBrands]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((wooBrand) => ({
        id: String(wooBrand.id),
        name: wooBrand.name,
        slug: wooBrand.slug,
        productCount: wooBrand.count ?? 0,
        featured: false,
      }));
  }, [wooBrands]);

  // Fetch products from GraphQL using React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["brand-products", filters, sortBy, currentPage, perPage],
    queryFn: () =>
      getPaginatedProductsGraphQL(filters, sortBy, currentPage, perPage),
  });

  const products = data?.products || [];
  const pageInfo = data?.pageInfo || {
    total: 0,
    totalPages: 0,
    currentPage: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  // Update URL when state changes
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();

    if (filters.category) params.set("category", filters.category);
    if (filters.minPrice !== undefined)
      params.set("minPrice", filters.minPrice.toString());
    if (filters.maxPrice !== undefined)
      params.set("maxPrice", filters.maxPrice.toString());
    if (filters.onSale) params.set("on_sale", "true");
    if (filters.inStock) params.set("in_stock", "true");
    if (sortBy !== "default") params.set("sort", sortBy);
    if (currentPage > 1) params.set("page", currentPage.toString());
    if (perPage !== 12) params.set("perPage", perPage.toString());
    if (viewMode !== "grid") params.set("view", viewMode);

    const newURL = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    router.replace(newURL, { scroll: false });
  }, [filters, sortBy, currentPage, perPage, viewMode, pathname, router]);

  // Update URL when state changes
  useEffect(() => {
    updateURL();
  }, [updateURL]);

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
              categories={categories || []}
              brands={brandFilters}
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

            {/* Loading State */}
            {isLoading && (
              <div className="py-12 text-center">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="h-64 bg-gray-100 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <EmptyState
                title="Error Loading Products"
                description="There was a problem loading the products. Please try again."
                action={
                  <Button
                    variant="primary"
                    onClick={() => window.location.reload()}
                  >
                    RETRY
                  </Button>
                }
              />
            )}

            {/* Products Grid */}
            {!isLoading && !error && (
              <>
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
              </>
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
        categories={categories || []}
        brands={brandFilters}
      />
    </main>
  );
}
