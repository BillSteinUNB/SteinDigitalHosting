import { cn } from "@/lib/utils";

// ============================================
// SPINNER COMPONENT
// ============================================

export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "white" | "black";
  className?: string;
}

const sizeStyles = {
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-10 h-10 border-3",
};

const colorStyles = {
  primary: "border-red-primary border-t-transparent",
  white: "border-white border-t-transparent",
  black: "border-black border-t-transparent",
};

/**
 * Spinner Component
 * 
 * Animated loading spinner.
 * 
 * @example
 * <Spinner />
 * <Spinner size="lg" color="white" />
 */
export function Spinner({
  size = "md",
  color = "primary",
  className,
}: SpinnerProps) {
  return (
    <div
      className={cn(
        "rounded-full animate-spin",
        sizeStyles[size],
        colorStyles[color],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// ============================================
// LOADING OVERLAY
// ============================================

export interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  className?: string;
}

/**
 * Loading Overlay Component
 * 
 * Full overlay with spinner for loading states.
 * 
 * @example
 * <div className="relative">
 *   <Content />
 *   <LoadingOverlay isLoading={isSubmitting} message="Processing..." />
 * </div>
 */
export function LoadingOverlay({
  isLoading,
  message,
  className,
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div
      className={cn(
        "absolute inset-0 z-10",
        "flex flex-col items-center justify-center gap-3",
        "bg-white/80",
        className
      )}
    >
      <Spinner size="lg" />
      {message && (
        <p className="text-small font-semibold text-gray-dark">{message}</p>
      )}
    </div>
  );
}

// ============================================
// VISUAL DIVIDER
// ============================================

export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

/**
 * Divider Component
 * 
 * Visual separator line.
 * 
 * @example
 * <Divider />
 * <Divider orientation="vertical" />
 */
export function Divider({
  orientation = "horizontal",
  className,
}: DividerProps) {
  return (
    <div
      className={cn(
        "bg-gray-border",
        orientation === "horizontal" ? "h-px w-full" : "w-px h-full",
        className
      )}
      role="separator"
      aria-orientation={orientation}
    />
  );
}

// ============================================
// VISUALLY HIDDEN (Screen Reader Only)
// ============================================

export interface VisuallyHiddenProps {
  children: React.ReactNode;
}

/**
 * Visually Hidden Component
 * 
 * Hides content visually but keeps it accessible to screen readers.
 * 
 * @example
 * <VisuallyHidden>Close menu</VisuallyHidden>
 */
export function VisuallyHidden({ children }: VisuallyHiddenProps) {
  return (
    <span className="sr-only">{children}</span>
  );
}

// ============================================
// CONTAINER COMPONENT
// ============================================

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "main";
}

/**
 * Container Component
 * 
 * Centered content container with max-width.
 * 
 * @example
 * <Container>
 *   <h1>Page Title</h1>
 * </Container>
 */
export function Container({
  children,
  className,
  as: Component = "div",
}: ContainerProps) {
  return (
    <Component className={cn("container", className)}>
      {children}
    </Component>
  );
}

// ============================================
// SECTION HEADING COMPONENT
// ============================================

export interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4";
  showAccent?: boolean;
  centered?: boolean;
}

/**
 * Section Heading Component
 * 
 * Heading with red square accent.
 * 
 * @example
 * <SectionHeading>Latest Deals</SectionHeading>
 * <SectionHeading centered>Shop by Category</SectionHeading>
 */
export function SectionHeading({
  children,
  className,
  as: Component = "h2",
  showAccent = true,
  centered = false,
}: SectionHeadingProps) {
  return (
    <Component
      className={cn(
        showAccent ? "section-heading" : "font-heading font-bold uppercase text-h2",
        centered && "text-center justify-center",
        className
      )}
    >
      {children}
    </Component>
  );
}

// ============================================
// QUANTITY SELECTOR
// ============================================

export interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
}

/**
 * Quantity Selector Component
 * 
 * +/- buttons with number input for quantity.
 * 
 * @example
 * <QuantitySelector value={qty} onChange={setQty} min={1} max={10} />
 */
export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  size = "md",
  className,
}: QuantitySelectorProps) {
  const decrease = () => {
    if (value > min) onChange(value - 1);
  };

  const increase = () => {
    if (value < max) onChange(value + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  const buttonClass = size === "sm" 
    ? "w-8 h-8 text-body" 
    : "w-10 h-10 text-h4";
  const inputClass = size === "sm"
    ? "w-10 h-8 text-small"
    : "w-12 h-10 text-body";

  return (
    <div
      className={cn(
        "inline-flex items-center border border-gray-border",
        disabled && "opacity-50",
        className
      )}
    >
      <button
        type="button"
        onClick={decrease}
        disabled={disabled || value <= min}
        className={cn(
          "flex items-center justify-center",
          "font-bold text-gray-dark",
          "hover:bg-gray-light disabled:opacity-50 disabled:cursor-not-allowed",
          "transition-colors",
          buttonClass
        )}
        aria-label="Decrease quantity"
      >
        -
      </button>
      
      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        disabled={disabled}
        min={min}
        max={max}
        className={cn(
          "text-center font-semibold",
          "border-x border-gray-border",
          "focus:outline-none",
          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          inputClass
        )}
        aria-label="Quantity"
      />
      
      <button
        type="button"
        onClick={increase}
        disabled={disabled || value >= max}
        className={cn(
          "flex items-center justify-center",
          "font-bold text-gray-dark",
          "hover:bg-gray-light disabled:opacity-50 disabled:cursor-not-allowed",
          "transition-colors",
          buttonClass
        )}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}

// ============================================
// EMPTY STATE COMPONENT
// ============================================

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * Empty State Component
 * 
 * Placeholder for empty lists/states.
 * 
 * @example
 * <EmptyState
 *   icon={<ShoppingCart />}
 *   title="Your cart is empty"
 *   description="Add some products to get started"
 *   action={<Button>Shop Now</Button>}
 * />
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("text-center py-12", className)}>
      {icon && (
        <div className="flex justify-center mb-4 text-gray-medium">
          {icon}
        </div>
      )}
      <h3 className="text-h3 font-heading uppercase mb-2">{title}</h3>
      {description && (
        <p className="text-body text-gray-medium mb-6 max-w-sm mx-auto">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
