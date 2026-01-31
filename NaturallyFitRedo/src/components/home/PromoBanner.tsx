import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

// ============================================
// PROMO BANNER COMPONENT
// ============================================

export interface PromoBannerProps {
  title: string;
  subtitle?: string;
  description?: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage?: string;
  backgroundColor?: "red" | "black" | "gray";
  textColor?: "white" | "black";
  align?: "left" | "center" | "right";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const bgColors = {
  red: "bg-red-primary",
  black: "bg-black",
  gray: "bg-gray-dark",
};

const sizeStyles = {
  sm: "py-8",
  md: "py-12",
  lg: "py-16",
};

/**
 * PromoBanner Component
 *
 * Full-width promotional banner with CTA.
 * Can be used for sales, special offers, etc.
 */
export default function PromoBanner({
  title,
  subtitle,
  description,
  ctaText,
  ctaLink,
  backgroundImage,
  backgroundColor = "red",
  textColor = "white",
  align = "center",
  size = "md",
  className,
}: PromoBannerProps) {
  const alignClass = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  }[align];

  const textColorClass = textColor === "white" ? "text-white" : "text-black";

  return (
    <section
      className={cn(
        "relative overflow-hidden",
        !backgroundImage && bgColors[backgroundColor],
        sizeStyles[size],
        className
      )}
    >
      {/* Background Image */}
      {backgroundImage && (
        <>
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/60" />
        </>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className={cn("flex flex-col max-w-2xl mx-auto", alignClass)}>
          {/* Subtitle */}
          {subtitle && (
            <span
              className={cn(
                "text-sm font-heading uppercase tracking-wider mb-2",
                textColorClass,
                "opacity-80"
              )}
            >
              {subtitle}
            </span>
          )}

          {/* Title */}
          <h2
            className={cn(
              "font-heading font-bold uppercase",
              "text-2xl md:text-3xl lg:text-4xl",
              "mb-4",
              textColorClass
            )}
          >
            {title}
          </h2>

          {/* Description */}
          {description && (
            <p className={cn("text-base md:text-lg mb-6", textColorClass, "opacity-90")}>
              {description}
            </p>
          )}

          {/* CTA */}
          <Link
            href={ctaLink}
            className={cn(
              "inline-flex items-center justify-center",
              "px-8 py-4 min-h-[52px]",
              "font-heading font-bold uppercase tracking-button text-body",
              textColor === "white"
                ? "bg-white text-black hover:bg-gray-light"
                : "bg-black text-white hover:bg-gray-dark",
              "transition-all duration-200"
            )}
          >
            {ctaText}
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================
// SALE BANNER (Specific promo variant)
// ============================================

export interface SaleBannerProps {
  saleText?: string;
  discountText: string;
  endDate?: string;
  ctaText?: string;
  ctaLink?: string;
  className?: string;
}

/**
 * SaleBanner Component
 *
 * Eye-catching sale banner with countdown urgency.
 */
export function SaleBanner({
  saleText = "Limited Time Offer",
  discountText,
  endDate,
  ctaText = "Shop Sale",
  ctaLink = "/shop?on_sale=true",
  className,
}: SaleBannerProps) {
  return (
    <section className={cn("bg-red-primary py-4", className)}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          {/* Sale Label */}
          <span className="text-sm font-heading uppercase tracking-wider text-white/80">
            {saleText}
          </span>

          {/* Discount */}
          <span className="text-xl md:text-2xl font-heading font-bold uppercase text-white">
            {discountText}
          </span>

          {/* End Date */}
          {endDate && (
            <span className="text-sm text-white/80">Ends {endDate}</span>
          )}

          {/* CTA */}
          <Link
            href={ctaLink}
            className={cn(
              "inline-flex items-center justify-center",
              "px-6 py-2 min-h-[40px]",
              "font-heading font-bold uppercase tracking-button text-sm",
              "bg-white text-red-primary hover:bg-gray-light",
              "transition-all duration-200"
            )}
          >
            {ctaText}
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================
// SPLIT PROMO (Two-column promo)
// ============================================

export interface SplitPromoProps {
  leftPromo: {
    title: string;
    subtitle?: string;
    ctaText: string;
    ctaLink: string;
    image: string;
  };
  rightPromo: {
    title: string;
    subtitle?: string;
    ctaText: string;
    ctaLink: string;
    image: string;
  };
  className?: string;
}

/**
 * SplitPromo Component
 *
 * Two side-by-side promotional blocks.
 */
export function SplitPromo({ leftPromo, rightPromo, className }: SplitPromoProps) {
  return (
    <section className={cn("py-8", className)}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PromoBlock promo={leftPromo} />
          <PromoBlock promo={rightPromo} />
        </div>
      </div>
    </section>
  );
}

interface PromoBlockProps {
  promo: {
    title: string;
    subtitle?: string;
    ctaText: string;
    ctaLink: string;
    image: string;
  };
}

function PromoBlock({ promo }: PromoBlockProps) {
  return (
    <Link
      href={promo.ctaLink}
      className="group relative block aspect-[16/9] md:aspect-[2/1] overflow-hidden"
    >
      {/* Background Image */}
      <Image
        src={promo.image}
        alt={promo.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-8">
        {promo.subtitle && (
          <span className="text-sm font-heading uppercase tracking-wider text-white/80 mb-1">
            {promo.subtitle}
          </span>
        )}
        <h3 className="text-xl md:text-2xl font-heading font-bold uppercase text-white mb-4">
          {promo.title}
        </h3>
        <span className="inline-flex text-sm font-heading uppercase tracking-wide text-white group-hover:text-red-primary transition-colors">
          {promo.ctaText} →
        </span>
      </div>
    </Link>
  );
}

// ============================================
// FEATURES BAR (Value props)
// ============================================

export interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description?: string;
}

export interface FeaturesBarProps {
  features: FeatureItem[];
  className?: string;
}

/**
 * FeaturesBar Component
 *
 * Horizontal bar showcasing key store features/benefits.
 */
export function FeaturesBar({ features, className }: FeaturesBarProps) {
  return (
    <section className={cn("py-6 bg-gray-light border-y border-gray-border", className)}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-3 justify-center md:justify-start"
            >
              <span className="flex-shrink-0 text-red-primary">{feature.icon}</span>
              <div className="min-w-0">
                <p className="font-heading text-sm uppercase tracking-wide text-black truncate">
                  {feature.title}
                </p>
                {feature.description && (
                  <p className="text-tiny text-gray-medium truncate">
                    {feature.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
