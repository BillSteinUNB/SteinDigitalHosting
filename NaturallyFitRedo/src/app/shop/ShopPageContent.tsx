"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
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
import { getCategories, type CategoryWithCount } from "@/lib/graphql/categories";
import type { ProductFilters, ProductSortOption } from "@/types/product";

// ============================================
// BREADCRUMB COMPONENT
// ============================================

function Breadcrumb() {
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
          <span className="text-black font-medium">Shop</span>
        </li>
      </ol>
    </nav>
  );
}

// ============================================
// POPULAR CATEGORIES COMPONENT
// ============================================

interface PopularCategoriesProps {
  categories: CategoryWithCount[];
}

function PopularCategories({ categories }: PopularCategoriesProps) {
  if (categories.length === 0) return null;

  // Show top 6 categories by product count
  const topCategories = [...categories]
    .filter((cat) => !cat.parent)
    .sort((a, b) => (b.productCount || 0) - (a.productCount || 0))
    .slice(0, 6);

  return (
    <div className="mb-6">
      <h3 className="text-small font-heading uppercase tracking-wide text-gray-medium mb-3">
        Popular Categories
      </h3>
      <div className="flex flex-wrap gap-2">
        {topCategories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop/${cat.slug}`}
            className={cn(
              "px-4 py-2 text-small",
              "border border-gray-border",
              "hover:border-red-primary hover:text-red-primary",
              "transition-colors duration-200"
            )}
          >
            {cat.name}
            <span className="text-tiny text-gray-medium ml-1">({cat.productCount})</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ============================================
// SHOP PAGE CONTENT COMPONENT
// ============================================

export default function ShopPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Fetch categories for popular categories section
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // Initialize state from URL params
  const [filters, setFilters] = useState<ProductFilters>(() => {
    const initialFilters: ProductFilters = {};
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const onSale = searchParams.get("on_sale");
    const inStock = searchParams.get("in_stock");

    if (category) initialFilters.category = category;
    if (brand) initialFilters.brand = brand;
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

  // Fetch products from GraphQL using React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["shop-products", filters, sortBy, currentPage, perPage],
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
    if (filters.brand) params.set("brand", filters.brand);
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
          <Breadcrumb />
          <div className="text-center">
            <SectionHeading centered>SHOP ALL PRODUCTS</SectionHeading>
            <p className="text-body text-gray-medium mt-2 max-w-2xl mx-auto">
              Browse our complete collection of natural health and wellness products
            </p>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <Container className="py-8 md:py-12">
        {/* Popular Categories */}
        {categories && categories.length > 0 && !hasActiveFilters && (
          <PopularCategories categories={categories} />
        )}

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
                  filters={filters}
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
                    description="No products match your current filters. Try adjusting your criteria."
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
      />
    </main>
  );
}
