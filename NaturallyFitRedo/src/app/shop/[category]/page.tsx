"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useParams, useSearchParams, useRouter, usePathname } from "next/navigation";
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
import {
  getCategoryBySlug,
  getCategories,
  getCategoryScopeSlugs,
  type CategoryWithCount,
} from "@/lib/graphql/categories";
import type { BrandWithDetails } from "@/lib/mock/brands";
import { getWooBrands } from "@/lib/woocommerce/brands";
import { filterAllowedCategories, isAllowedCategorySlug } from "@/lib/shop-categories";
import type { ProductFilters, ProductSortOption } from "@/types/product";

// ============================================
// BREADCRUMB COMPONENT
// ============================================

interface BreadcrumbProps {
  category: CategoryWithCount;
}

function Breadcrumb({ category }: BreadcrumbProps) {
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
          <Link href="/shop" className="text-gray-medium hover:text-red-primary transition-colors">
            Shop
          </Link>
        </li>
        {category.parent && (
          <>
            <ChevronRight size={14} className="text-gray-medium" />
            <li>
              <Link
                href={`/shop/${category.parent.slug}`}
                className="text-gray-medium hover:text-red-primary transition-colors"
              >
                {category.parent.name}
              </Link>
            </li>
          </>
        )}
        <ChevronRight size={14} className="text-gray-medium" />
        <li>
          <span className="text-black font-medium">{category.name}</span>
        </li>
      </ol>
    </nav>
  );
}

// ============================================
// SUBCATEGORIES COMPONENT
// ============================================

interface SubcategoriesProps {
  subcategories: CategoryWithCount[];
  currentSlug: string;
}

function Subcategories({ subcategories, currentSlug }: SubcategoriesProps) {
  if (subcategories.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-small font-heading uppercase tracking-wide text-gray-medium mb-3">
        Subcategories
      </h3>
      <div className="flex flex-wrap gap-2">
        {subcategories.map((sub) => (
          <Link
            key={sub.id}
            href={`/shop/${sub.slug}`}
            className={cn(
              "px-4 py-2 text-small",
              "border border-gray-border",
              "hover:border-red-primary hover:text-red-primary",
              "transition-colors duration-200",
              sub.slug === currentSlug && "bg-red-primary text-white border-red-primary"
            )}
          >
            {sub.name}
            <span className="text-tiny text-gray-medium ml-1">({sub.productCount})</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ============================================
// CATEGORY PAGE COMPONENT
// ============================================

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categorySlug = params.category as string;

  // Fetch category data
  const { data: category, isLoading: isLoadingCategory, error: categoryError } = useQuery({
    queryKey: ["category", categorySlug],
    queryFn: () => getCategoryBySlug(categorySlug),
  });

  // Fetch all categories to find subcategories
  const { data: allCategories } = useQuery({
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
      .map((brand) => ({
        id: String(brand.id),
        name: brand.name,
        slug: brand.slug,
        productCount: brand.count ?? 0,
        featured: false,
      }));
  }, [wooBrands]);
  const allowedCategories = useMemo(
    () => (allCategories ? filterAllowedCategories(allCategories) : []),
    [allCategories]
  );

  // Derive subcategories from all categories
  const subcategories = allowedCategories.filter(
    (cat: CategoryWithCount) => cat.parent?.slug === categorySlug
  );

  // Initialize state from URL params
  const [filters, setFilters] = useState<ProductFilters>(() => {
    const initialFilters: ProductFilters = { category: categorySlug };
    const brand = searchParams.get("brand");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const onSale = searchParams.get("on_sale");

    if (brand) initialFilters.brand = brand;
    if (minPrice) initialFilters.minPrice = parseFloat(minPrice);
    if (maxPrice) initialFilters.maxPrice = parseFloat(maxPrice);
    if (onSale === "true") initialFilters.onSale = true;

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
  const categoryScopeSlugs = useMemo(() => {
    return getCategoryScopeSlugs(allowedCategories, categorySlug);
  }, [allowedCategories, categorySlug]);

  // Fetch products from GraphQL using React Query
  const { data, isLoading, error } = useQuery({
    queryKey: [
      "category-products",
      filters,
      categoryScopeSlugs,
      sortBy,
      currentPage,
      perPage,
    ],
    queryFn: () =>
      getPaginatedProductsGraphQL(
        { ...filters, categorySlugs: categoryScopeSlugs },
        sortBy,
        currentPage,
        perPage
      ),
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

    if (filters.brand) params.set("brand", filters.brand);
    if (filters.minPrice !== undefined)
      params.set("minPrice", filters.minPrice.toString());
    if (filters.maxPrice !== undefined)
      params.set("maxPrice", filters.maxPrice.toString());
    if (filters.onSale) params.set("on_sale", "true");
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

  // Handler: Clear all filters (keep category)
  const handleClearFilters = useCallback(() => {
    setFilters({ category: categorySlug });
    setCurrentPage(1);
  }, [categorySlug]);

  // Handler: Remove single filter
  const handleRemoveFilter = useCallback(
    (key: keyof ProductFilters) => {
      // Don't allow removing category filter on category page
      if (key === "category") return;

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
    },
    []
  );

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

  // Check if non-category filters are active
  const hasActiveFilters =
    filters.brand ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.onSale;

  // Loading state for category
  if (isLoadingCategory) {
    return (
      <main className="min-h-screen bg-white">
        <section className="bg-gray-light py-8 md:py-12">
          <Container>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto"></div>
            </div>
          </Container>
        </section>
        <Container className="py-8 md:py-12">
          <div className="animate-pulse">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-100 rounded"></div>
              ))}
            </div>
          </div>
        </Container>
      </main>
    );
  }

  // 404 for unknown/unsupported category
  if (!category || categoryError || !isAllowedCategorySlug(categorySlug)) {
    return (
      <main className="min-h-screen bg-white">
        <Container className="py-16">
          <EmptyState
            title="Category Not Found"
            description="The category you're looking for doesn't exist or has been removed."
            action={
              <Link href="/shop">
                <Button variant="primary">BROWSE ALL PRODUCTS</Button>
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
          <Breadcrumb category={category} />
          <div className="text-center">
            <SectionHeading centered>{category.name.toUpperCase()}</SectionHeading>
            {category.description && (
              <p className="text-body text-gray-medium mt-2 max-w-2xl mx-auto">
                {category.description}
              </p>
            )}
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <Container className="py-8 md:py-12">
        {/* Subcategories */}
          <Subcategories subcategories={subcategories} currentSlug={categorySlug} />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              categories={allCategories || []}
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
                  filters={{ ...filters, category: undefined }}
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
        categories={allCategories || []}
        brands={brandFilters}
      />
    </main>
  );
}
