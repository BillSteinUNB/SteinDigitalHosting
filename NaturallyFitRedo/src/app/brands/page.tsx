"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Container, SectionHeading, SearchInput } from "@/components/ui";
import { useQuery } from "@tanstack/react-query";
import { getWooBrands } from "@/lib/woocommerce/brands";
import type { BrandWithDetails } from "@/lib/mock/brands";

// ============================================
// BRAND CARD COMPONENT
// ============================================

interface BrandCardProps {
  brand: BrandWithDetails;
}

function BrandCard({ brand }: BrandCardProps) {
  const [imageError, setImageError] = useState(false);
  const [showLogo, setShowLogo] = useState(false);

  return (
    <Link
      href={`/brands/${brand.slug}`}
      className={cn(
        "group flex flex-col items-center p-6",
        "bg-white border border-gray-border",
        "hover:shadow-lg hover:border-red-primary",
        "transition-all duration-200"
      )}
    >
      {/* Brand Logo */}
      <div className="relative w-full aspect-[3/2] mb-4 flex items-center justify-center">
        {showLogo && brand.logo && !imageError ? (
          <Image
            src={brand.logo.sourceUrl}
            alt={brand.logo.altText || brand.name}
            fill
            className="object-contain p-2 grayscale group-hover:grayscale-0 transition-all duration-200"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
            onError={() => {
              setImageError(true);
              setShowLogo(false);
            }}
          />
        ) : (
          <span className="font-heading text-lg uppercase text-gray-medium group-hover:text-red-primary transition-colors">
            {brand.name}
          </span>
        )}
      </div>

      {/* Brand Name */}
      <h3 className="font-heading text-small uppercase text-center text-black group-hover:text-red-primary transition-colors">
        {brand.name}
      </h3>

      {/* Product Count */}
      <p className="text-tiny text-gray-medium mt-1">
        {brand.productCount} Products
      </p>
    </Link>
  );
}

// ============================================
// ALPHABET FILTER
// ============================================

interface AlphabetFilterProps {
  brands: BrandWithDetails[];
  activeLetter: string | null;
  onLetterClick: (letter: string | null) => void;
}

function AlphabetFilter({ brands, activeLetter, onLetterClick }: AlphabetFilterProps) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Get letters that have brands
  const lettersWithBrands = useMemo(() => {
    const letters = new Set<string>();
    brands.forEach((brand) => {
      const firstLetter = brand.name.charAt(0).toUpperCase();
      letters.add(firstLetter);
    });
    return letters;
  }, [brands]);

  return (
    <div className="flex flex-wrap items-center justify-center gap-1 mb-8">
      {/* All button */}
      <button
        type="button"
        onClick={() => onLetterClick(null)}
        className={cn(
          "w-9 h-9 min-w-[36px] min-h-[36px]",
          "text-small font-heading",
          "transition-colors duration-200",
          activeLetter === null
            ? "bg-black text-white"
            : "bg-gray-light text-gray-dark hover:bg-red-primary hover:text-white"
        )}
      >
        ALL
      </button>

      {/* Letter buttons */}
      {alphabet.map((letter) => {
        const hasProducts = lettersWithBrands.has(letter);

        return (
          <button
            key={letter}
            type="button"
            onClick={() => hasProducts && onLetterClick(letter)}
            disabled={!hasProducts}
            className={cn(
              "w-9 h-9 min-w-[36px] min-h-[36px]",
              "text-small font-heading",
              "transition-colors duration-200",
              activeLetter === letter
                ? "bg-black text-white"
                : hasProducts
                ? "bg-gray-light text-gray-dark hover:bg-red-primary hover:text-white"
                : "bg-gray-light text-gray-medium opacity-40 cursor-not-allowed"
            )}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
}

// ============================================
// BRANDS PAGE COMPONENT
// ============================================

export default function BrandsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  const { data: wooBrands } = useQuery({
    queryKey: ["woo-brands"],
    queryFn: getWooBrands,
  });

  const brandList = useMemo<BrandWithDetails[]>(() => {
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

  // Filter brands
  const filteredBrands = useMemo(() => {
    let result = brandList;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((brand) =>
        brand.name.toLowerCase().includes(query)
      );
    }

    // Filter by letter
    if (activeLetter) {
      result = result.filter(
        (brand) => brand.name.charAt(0).toUpperCase() === activeLetter
      );
    }

    return result;
  }, [searchQuery, activeLetter]);

  // Group brands by first letter
  const groupedBrands = useMemo(() => {
    const groups: Record<string, BrandWithDetails[]> = {};

    filteredBrands.forEach((brand) => {
      const firstLetter = brand.name.charAt(0).toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(brand);
    });

    return groups;
  }, [filteredBrands]);

  const sortedLetters = Object.keys(groupedBrands).sort();

  return (
    <main className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="bg-gray-light py-8 md:py-12">
        <Container>
          <div className="text-center">
            <SectionHeading centered>ALL BRANDS</SectionHeading>
            <p className="text-body text-gray-medium mt-2">
              Shop by your favorite supplement brands
            </p>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <Container className="py-8 md:py-12">
        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <SearchInput
            placeholder="Search brands..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setActiveLetter(null); // Clear letter filter when searching
            }}
          />
        </div>

        {/* Alphabet Filter */}
        {!searchQuery && (
          <AlphabetFilter
            brands={brandList}
            activeLetter={activeLetter}
            onLetterClick={setActiveLetter}
          />
        )}

        {/* Brands Grid */}
        {filteredBrands.length > 0 ? (
          <div className="space-y-12">
            {sortedLetters.map((letter) => (
              <section key={letter}>
                <h2 className="font-heading text-h2 uppercase text-red-primary mb-4 pb-2 border-b border-gray-border">
                  {letter}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {groupedBrands[letter].map((brand) => (
                    <BrandCard key={brand.id} brand={brand} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-body text-gray-medium">
              No brands found{searchQuery ? ` for "${searchQuery}"` : ""}.
            </p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-red-primary hover:underline mt-2"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </Container>
    </main>
  );
}
