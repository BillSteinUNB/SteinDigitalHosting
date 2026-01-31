// ============================================
// UI STORE (Zustand)
// ============================================

import { create } from "zustand";
import type { ProductFilters, ProductSortOption } from "@/types/product";

// ============================================
// TYPES
// ============================================

interface UIStore {
  // Mobile Menu
  isMobileMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;

  // Search
  isSearchOpen: boolean;
  searchQuery: string;
  openSearch: () => void;
  closeSearch: () => void;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;

  // Filters (Shop Page)
  isFilterDrawerOpen: boolean;
  filters: ProductFilters;
  sortBy: ProductSortOption;
  openFilterDrawer: () => void;
  closeFilterDrawer: () => void;
  setFilters: (filters: Partial<ProductFilters>) => void;
  clearFilters: () => void;
  setSortBy: (sort: ProductSortOption) => void;

  // Quick View Modal
  quickViewProductId: string | null;
  openQuickView: (productId: string) => void;
  closeQuickView: () => void;

  // Auth Modal
  authModalMode: "login" | "register" | "forgot" | null;
  openAuthModal: (mode: "login" | "register" | "forgot") => void;
  closeAuthModal: () => void;
  setAuthModalMode: (mode: "login" | "register" | "forgot") => void;

  // Toast Notifications
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // Loading States
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
}

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
}

// ============================================
// DEFAULT VALUES
// ============================================

const defaultFilters: ProductFilters = {
  category: undefined,
  brand: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  search: undefined,
  onSale: undefined,
  inStock: undefined,
};

// ============================================
// STORE
// ============================================

export const useUIStore = create<UIStore>()((set, get) => ({
  // Mobile Menu
  isMobileMenuOpen: false,
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  // Search
  isSearchOpen: false,
  searchQuery: "",
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  clearSearch: () => set({ searchQuery: "", isSearchOpen: false }),

  // Filters
  isFilterDrawerOpen: false,
  filters: defaultFilters,
  sortBy: "default",
  openFilterDrawer: () => set({ isFilterDrawerOpen: true }),
  closeFilterDrawer: () => set({ isFilterDrawerOpen: false }),
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  clearFilters: () => set({ filters: defaultFilters }),
  setSortBy: (sort) => set({ sortBy: sort }),

  // Quick View
  quickViewProductId: null,
  openQuickView: (productId) => set({ quickViewProductId: productId }),
  closeQuickView: () => set({ quickViewProductId: null }),

  // Auth Modal
  authModalMode: null,
  openAuthModal: (mode) => set({ authModalMode: mode }),
  closeAuthModal: () => set({ authModalMode: null }),
  setAuthModalMode: (mode) => set({ authModalMode: mode }),

  // Toasts
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = { ...toast, id };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto-remove toast after duration
    const duration = toast.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  clearToasts: () => set({ toasts: [] }),

  // Global Loading
  globalLoading: false,
  setGlobalLoading: (loading) => set({ globalLoading: loading }),
}));

// ============================================
// SELECTORS
// ============================================

export const selectIsMobileMenuOpen = (state: UIStore) => state.isMobileMenuOpen;
export const selectIsSearchOpen = (state: UIStore) => state.isSearchOpen;
export const selectSearchQuery = (state: UIStore) => state.searchQuery;
export const selectFilters = (state: UIStore) => state.filters;
export const selectSortBy = (state: UIStore) => state.sortBy;
export const selectToasts = (state: UIStore) => state.toasts;
export const selectQuickViewProductId = (state: UIStore) => state.quickViewProductId;
export const selectAuthModalMode = (state: UIStore) => state.authModalMode;

// ============================================
// HELPER HOOKS (combining store with actions)
// ============================================

export function useToast() {
  const addToast = useUIStore((state) => state.addToast);

  return {
    success: (title: string, message?: string) =>
      addToast({ type: "success", title, message }),
    error: (title: string, message?: string) =>
      addToast({ type: "error", title, message }),
    warning: (title: string, message?: string) =>
      addToast({ type: "warning", title, message }),
    info: (title: string, message?: string) =>
      addToast({ type: "info", title, message }),
  };
}
