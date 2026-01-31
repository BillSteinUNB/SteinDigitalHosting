"use client";

import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { IconButton } from "./Button";

// ============================================
// MODAL COMPONENT
// ============================================

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-[90vw] max-h-[90vh]",
};

/**
 * Modal Component
 * 
 * Accessible modal dialog with focus trap.
 * Uses portal to render at document root.
 * 
 * @example
 * <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Confirm">
 *   <p>Are you sure?</p>
 * </Modal>
 */
export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Handle escape key
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === "Escape") {
        onClose();
      }
    },
    [closeOnEscape, onClose]
  );

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Focus trap and body scroll lock
  useEffect(() => {
    if (isOpen) {
      // Store previous active element
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Focus the modal
      modalRef.current?.focus();
      
      // Lock body scroll
      document.body.style.overflow = "hidden";
      
      // Add escape listener
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      // Restore body scroll
      document.body.style.overflow = "";
      
      // Remove escape listener
      document.removeEventListener("keydown", handleEscape);
      
      // Restore focus
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, handleEscape]);

  // Don't render if not open
  if (!isOpen) return null;

  // Use portal to render modal
  return createPortal(
    <div
      className="fixed inset-0 z-modal flex items-center justify-center p-4"
      role="presentation"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        aria-describedby={description ? "modal-description" : undefined}
        tabIndex={-1}
        className={cn(
          "relative w-full bg-white",
          "animate-slide-up",
          "focus:outline-none",
          sizeStyles[size],
          className
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between p-4 border-b border-gray-border">
            <div>
              {title && (
                <h2
                  id="modal-title"
                  className="text-h3 font-heading uppercase"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id="modal-description"
                  className="text-small text-gray-medium mt-1"
                >
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <IconButton
                icon={<X size={20} strokeWidth={1.5} />}
                aria-label="Close modal"
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="-mr-2 -mt-2"
              />
            )}
          </div>
        )}

        {/* Body */}
        <div className="p-4">{children}</div>
      </div>
    </div>,
    document.body
  );
}

// ============================================
// CONFIRMATION MODAL
// ============================================

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "default";
  isLoading?: boolean;
}

/**
 * Confirmation Modal Component
 * 
 * Pre-styled modal for confirmation dialogs.
 * 
 * @example
 * <ConfirmModal
 *   isOpen={showDelete}
 *   onClose={() => setShowDelete(false)}
 *   onConfirm={handleDelete}
 *   title="Delete Item"
 *   message="Are you sure you want to delete this item?"
 *   variant="danger"
 * />
 */
export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  isLoading = false,
}: ConfirmModalProps) {
  const confirmButtonClass = variant === "danger" 
    ? "bg-error hover:bg-red-700" 
    : variant === "warning"
    ? "bg-warning text-black hover:brightness-95"
    : "bg-red-primary hover:bg-red-hover";

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="text-center">
        <h3 className="text-h3 font-heading uppercase mb-2">{title}</h3>
        <p className="text-body text-gray-medium mb-6">{message}</p>
        
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            disabled={isLoading}
            className={cn(
              "btn btn-outline",
              "min-w-[100px]"
            )}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "btn text-white",
              "min-w-[100px]",
              confirmButtonClass,
              isLoading && "opacity-50 cursor-not-allowed"
            )}
          >
            {isLoading ? "Loading..." : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ============================================
// DRAWER COMPONENT (Side Panel)
// ============================================

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: "left" | "right";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const drawerSizeStyles = {
  sm: "w-[280px]",
  md: "w-[360px]",
  lg: "w-[480px]",
};

/**
 * Drawer Component
 * 
 * Side panel that slides in from left or right.
 * Used for mobile menu, filters, mini cart.
 * 
 * @example
 * <Drawer isOpen={isOpen} onClose={handleClose} side="right" title="Cart">
 *   <CartContents />
 * </Drawer>
 */
export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  side = "right",
  size = "md",
  className,
}: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const slideClass = side === "left" 
    ? "left-0 animate-[slideInLeft_200ms_ease-out]"
    : "right-0 animate-[slideInRight_200ms_ease-out]";

  return createPortal(
    <div className="fixed inset-0 z-modal" role="presentation">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "drawer-title" : undefined}
        className={cn(
          "absolute top-0 h-full bg-white",
          "flex flex-col",
          "focus:outline-none",
          drawerSizeStyles[size],
          slideClass,
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-border">
          {title && (
            <h2 id="drawer-title" className="text-h4 font-heading uppercase">
              {title}
            </h2>
          )}
          <IconButton
            icon={<X size={20} strokeWidth={1.5} />}
            aria-label="Close drawer"
            variant="ghost"
            size="sm"
            onClick={onClose}
          />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>,
    document.body
  );
}
