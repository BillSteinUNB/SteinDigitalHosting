import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// ============================================
// BUTTON COMPONENT
// ============================================

export type ButtonVariant = "primary" | "secondary" | "highlight" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-red-primary text-white hover:bg-red-hover",
  secondary: "bg-black text-white hover:bg-gray-dark",
  highlight: "bg-yellow-highlight text-black hover:brightness-95",
  outline: "bg-transparent border-2 border-black text-black hover:bg-black hover:text-white",
  ghost: "bg-transparent text-black hover:bg-gray-light",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-tiny min-h-[36px]",
  md: "px-6 py-3 text-small min-h-[44px]",
  lg: "px-8 py-4 text-body min-h-[52px]",
};

/**
 * Button Component
 * 
 * Primary interactive element following NF design system.
 * Sharp corners, Oswald font, uppercase text.
 * 
 * @example
 * <Button variant="primary">Shop Now</Button>
 * <Button variant="highlight">24 Hour Gym</Button>
 * <Button variant="outline" size="sm">Learn More</Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center gap-2",
          "font-heading font-bold uppercase tracking-button",
          "border-0 rounded-none cursor-pointer",
          "transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-primary focus-visible:ring-offset-2",
          // Variant & size
          variantStyles[variant],
          sizeStyles[size],
          // States
          isDisabled && "opacity-50 cursor-not-allowed",
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {/* Loading spinner */}
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        {/* Left icon */}
        {!isLoading && leftIcon && (
          <span className="flex-shrink-0">{leftIcon}</span>
        )}
        
        {/* Button text */}
        <span>{children}</span>
        
        {/* Right icon */}
        {rightIcon && (
          <span className="flex-shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

// ============================================
// ICON BUTTON VARIANT
// ============================================

export interface IconButtonProps extends Omit<ButtonProps, "leftIcon" | "rightIcon" | "children"> {
  icon: React.ReactNode;
  "aria-label": string;
}

/**
 * Icon Button Component
 * 
 * Square button for icon-only interactions.
 * Requires aria-label for accessibility.
 * 
 * @example
 * <IconButton icon={<Heart />} aria-label="Add to wishlist" />
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, size = "md", icon, ...props }, ref) => {
    const iconSizeStyles: Record<ButtonSize, string> = {
      sm: "w-9 h-9 p-0",
      md: "w-11 h-11 p-0",
      lg: "w-14 h-14 p-0",
    };

    return (
      <Button
        ref={ref}
        size={size}
        className={cn(iconSizeStyles[size], "px-0", className)}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = "IconButton";
