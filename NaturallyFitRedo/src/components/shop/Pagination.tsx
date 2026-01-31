"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================
// TYPES
// ============================================

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  siblingCount?: number;
  className?: string;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generate array of page numbers to display with ellipsis
 */
function getPageNumbers(
  currentPage: number,
  totalPages: number,
  siblingCount: number = 1
): (number | "ellipsis")[] {
  const totalPageNumbers = siblingCount * 2 + 5; // siblings + first + last + current + 2 ellipsis

  // Case 1: Total pages is less than page numbers we want to show
  if (totalPages <= totalPageNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;

  // Case 2: No left ellipsis, but right ellipsis
  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, "ellipsis", totalPages];
  }

  // Case 3: Left ellipsis, but no right ellipsis
  if (showLeftEllipsis && !showRightEllipsis) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + 1 + i
    );
    return [1, "ellipsis", ...rightRange];
  }

  // Case 4: Both left and right ellipsis
  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i
  );
  return [1, "ellipsis", ...middleRange, "ellipsis", totalPages];
}

// ============================================
// PAGINATION BUTTON COMPONENT
// ============================================

interface PageButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  "aria-label"?: string;
}

function PageButton({
  children,
  onClick,
  disabled,
  active,
  "aria-label": ariaLabel,
}: PageButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center justify-center",
        "min-w-[44px] min-h-[44px] px-3",
        "text-small font-medium",
        "border border-gray-border",
        "transition-colors duration-200",
        // Active state
        active && "bg-black text-white border-black",
        // Default state
        !active && !disabled && "bg-white text-gray-dark hover:bg-gray-light hover:border-gray-dark",
        // Disabled state
        disabled && "bg-gray-light text-gray-medium cursor-not-allowed opacity-50"
      )}
    >
      {children}
    </button>
  );
}

// ============================================
// PAGINATION COMPONENT
// ============================================

/**
 * Pagination Component
 *
 * Accessible pagination with page numbers and navigation.
 * Supports ellipsis for large page counts.
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  siblingCount = 1,
  className,
}: PaginationProps) {
  const pages = getPageNumbers(currentPage, totalPages, siblingCount);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleFirst = () => {
    onPageChange(1);
  };

  const handleLast = () => {
    onPageChange(totalPages);
  };

  // Don't render if only one page
  if (totalPages <= 1) return null;

  return (
    <nav
      className={cn("flex items-center justify-center gap-1", className)}
      aria-label="Pagination"
    >
      {/* First page button */}
      {showFirstLast && (
        <PageButton
          onClick={handleFirst}
          disabled={currentPage === 1}
          aria-label="Go to first page"
        >
          <ChevronsLeft size={18} strokeWidth={1.5} />
        </PageButton>
      )}

      {/* Previous button */}
      <PageButton
        onClick={handlePrevious}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
      >
        <ChevronLeft size={18} strokeWidth={1.5} />
      </PageButton>

      {/* Page numbers */}
      {pages.map((page, index) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="flex items-center justify-center min-w-[44px] min-h-[44px] text-gray-medium"
            aria-hidden="true"
          >
            ...
          </span>
        ) : (
          <PageButton
            key={page}
            onClick={() => onPageChange(page)}
            active={currentPage === page}
            aria-label={`Go to page ${page}`}
          >
            {page}
          </PageButton>
        )
      )}

      {/* Next button */}
      <PageButton
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
      >
        <ChevronRight size={18} strokeWidth={1.5} />
      </PageButton>

      {/* Last page button */}
      {showFirstLast && (
        <PageButton
          onClick={handleLast}
          disabled={currentPage === totalPages}
          aria-label="Go to last page"
        >
          <ChevronsRight size={18} strokeWidth={1.5} />
        </PageButton>
      )}
    </nav>
  );
}

// ============================================
// SIMPLE PAGINATION (Prev/Next only)
// ============================================

export interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * SimplePagination Component
 *
 * Minimal pagination with just previous/next buttons.
 * Good for infinite scroll or simpler interfaces.
 */
export function SimplePagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
  className,
}: SimplePaginationProps) {
  return (
    <nav
      className={cn("flex items-center justify-between", className)}
      aria-label="Pagination"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPreviousPage}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 min-h-[44px]",
          "text-small font-heading uppercase",
          "transition-colors duration-200",
          hasPreviousPage
            ? "text-black hover:text-red-primary"
            : "text-gray-medium cursor-not-allowed"
        )}
      >
        <ChevronLeft size={18} strokeWidth={1.5} />
        <span>Previous</span>
      </button>

      <span className="text-small text-gray-medium">
        Page {currentPage} of {totalPages}
      </span>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 min-h-[44px]",
          "text-small font-heading uppercase",
          "transition-colors duration-200",
          hasNextPage
            ? "text-black hover:text-red-primary"
            : "text-gray-medium cursor-not-allowed"
        )}
      >
        <span>Next</span>
        <ChevronRight size={18} strokeWidth={1.5} />
      </button>
    </nav>
  );
}
