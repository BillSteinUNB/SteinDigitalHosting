import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui";
import type { CategoryWithCount } from "@/lib/graphql/categories";

// ============================================
// CATEGORY GRID COMPONENT
// ============================================

export interface CategoryGridProps {
  title?: string;
  categories: CategoryWithCount[];
  showProductCount?: boolean;
  columns?: 3 | 4 | 5 | 6;
  className?: string;
}

/**
 * CategoryGrid Component
 *
 * Displays categories in a grid with images.
 * Used on homepage and shop page sidebar.
 */
export default function CategoryGrid({
  title = "Shop by Category",
  categories,
  showProductCount = true,
  columns = 6,
  className,
}: CategoryGridProps) {
  const gridCols = {
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
  };

  return (
    <section className={cn("py-12 bg-gray-light", className)}>
      <div className="container mx-auto px-4">
        {title && (
          <div className="text-center mb-10">
            <SectionHeading centered>{title}</SectionHeading>
          </div>
        )}

        <div className={cn("grid gap-4 md:gap-6", gridCols[columns])}>
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              showProductCount={showProductCount}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// CATEGORY CARD
// ============================================

interface CategoryCardProps {
  category: CategoryWithCount;
  showProductCount?: boolean;
}

function CategoryCard({ category, showProductCount }: CategoryCardProps) {
  const { name, slug, image, productCount } = category;

  return (
    <Link
      href={`/shop/${slug}`}
      className={cn(
        "group relative flex flex-col items-center",
        "p-4",
        
        "transition-all duration-200",
        "hover:shadow-lg"
      )}
    >
      {/* Category Image - 200px × 120px display size */}
      <div className="relative w-[200px] h-[120px] mb-3">
        {image ? (
          <Image
            src={image.sourceUrl}
            alt={image.altText || name}
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-110"
            sizes="200px"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-2xl text-gray-400">📦</span>
          </div>
        )}
      </div>

      {/* Category Name */}
      <h3 className="font-heading text-sm uppercase text-center tracking-wide text-black group-hover:text-red-primary transition-colors">
        {name}
      </h3>

      {/* Product Count */}
      {showProductCount && productCount > 0 && (
        <span className="text-tiny text-gray-medium mt-1">
          {productCount} Products
        </span>
      )}

      {/* Hover accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </Link>
  );
}

// ============================================
// FEATURED CATEGORIES (Larger cards)
// ============================================

export interface FeaturedCategoriesProps {
  title?: string;
  categories: CategoryWithCount[];
  className?: string;
}

/**
 * FeaturedCategories Component
 *
 * Larger category cards with images and descriptions.
 * Shows 3-4 featured categories prominently.
 */
export function FeaturedCategories({
  title = "Popular Categories",
  categories,
  className,
}: FeaturedCategoriesProps) {
  // Take first 4 categories
  const featuredCats = categories.slice(0, 4);

  return (
    <section className={cn("py-12", className)}>
      <div className="container mx-auto px-4">
        {title && (
          <div className="text-center mb-10">
            <SectionHeading centered>{title}</SectionHeading>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCats.map((category) => (
            <FeaturedCategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedCategoryCard({ category }: { category: CategoryWithCount }) {
  const { name, slug, image, description, productCount } = category;

  return (
    <Link
      href={`/shop/${slug}`}
      className={cn(
        "group relative overflow-hidden",
        "bg-black aspect-[4/3]",
        "flex flex-col justify-end p-6"
      )}
    >
      {/* Background Image */}
      {image && (
        <Image
          src={image.sourceUrl}
          alt={image.altText || name}
          fill
          className="object-cover opacity-60 transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      )}

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10">
        <h3 className="font-heading text-xl uppercase text-white mb-2 group-hover:text-red-primary transition-colors">
          {name}
        </h3>
        {description && (
          <p className="text-sm text-white/80 line-clamp-2 mb-3">
            {description}
          </p>
        )}
        <span className="inline-flex items-center text-tiny uppercase tracking-wide text-white group-hover:text-red-primary transition-colors">
          Shop Now →
        </span>
      </div>

      {/* Product count badge */}
      {productCount > 0 && (
        <span className="absolute top-4 right-4 px-2 py-1 bg-red-primary text-white text-tiny font-bold">
          {productCount}+
        </span>
      )}
    </Link>
  );
}

// ============================================
// CATEGORY SKELETON
// ============================================

export function CategoryCardSkeleton() {
  return (
    <div className="flex flex-col items-center bg-white p-6 border border-gray-border animate-pulse">
      <div className="w-20 h-20 bg-gray-200 rounded mb-4" />
      <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
      <div className="h-3 w-16 bg-gray-200 rounded" />
    </div>
  );
}
