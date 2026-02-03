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
 * Best Creatine Banner: 980px × 201px
 * 3 for $99 Banner: 410px × 107px
 */
export function SplitPromo({ leftPromo, rightPromo, className }: SplitPromoProps) {
  return (
    <section className={cn("py-8", className)}>
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-6">
          <PromoBlock promo={leftPromo} size="small" />
          <PromoBlock promo={rightPromo} size="large" />
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
  size?: 'small' | 'large';
}

function PromoBlock({ promo, size = 'small' }: PromoBlockProps) {
  // Small banner: 410px × 107px (3 for $99)
  // Large banner: 980px × 201px (Best Creatine)
  const dimensions = size === 'large' 
    ? { width: '980px', height: '201px' }
    : { width: '410px', height: '107px' };

  return (
    <Link
      href={promo.ctaLink}
      className="group relative block overflow-hidden"
      style={{ width: dimensions.width, height: dimensions.height }}
    >
      {/* Background Image */}
      <Image
        src={promo.image}
        alt={promo.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes={size === 'large' ? '980px' : '410px'}
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
// THREE BANNER ROW (Tab 1 style promo banners)
// ============================================

export interface ThreeBannerRowProps {
  banners: {
    image: string;
    alt: string;
    link: string;
  }[];
  className?: string;
}

// Default banners - fallback when no ACF data
const defaultMiniBanners = [
  {
    image: "https://nftest.dreamhosters.com/wp-content/uploads/2026/02/NF_3_for_99-2026.png",
    alt: "Bundles 3 for $99",
    link: "/product/mix-and-match-for-99/",
  },
  {
    image: "https://nftest.dreamhosters.com/wp-content/uploads/2026/02/shipping-2.png",
    alt: "Beat ANY Price by 10%",
    link: "/price-guarantee/",
  },
  {
    image: "https://nftest.dreamhosters.com/wp-content/uploads/2026/02/shipping.png",
    alt: "Free Shipping / Free Hoodie / Free Shaker",
    link: "/shop/",
  },
];

/**
 * ThreeBannerRow Component
 *
 * Three promotional banners in a row (Tab 1 style):
 * - Bundles 3 for $99
 * - Beat ANY Price by 10%
 * - Free Shipping / Free Hoodie / Free Shaker
 */
export function ThreeBannerRow({ banners, className }: ThreeBannerRowProps) {
  // Use default banners if none provided
  const displayBanners = banners.length > 0 ? banners : defaultMiniBanners;

  if (displayBanners.length !== 3) {
    console.warn("ThreeBannerRow expects exactly 3 banners");
  }

  return (
    <section className={cn("py-6 bg-white", className)}>
      <div className="container mx-auto px-4">
        <div className="flex flex-nowrap justify-center gap-2 md:gap-4">
          {displayBanners.map((banner, index) => (
            <Link
              key={index}
              href={banner.link}
              className="block overflow-hidden hover:opacity-90 transition-opacity flex-shrink-0 rounded-xl"
              style={{ width: 'calc(33.333% - 8px)', maxWidth: '410px', aspectRatio: '410/107' }}
            >
              <Image
                src={banner.image}
                alt={banner.alt}
                width={410}
                height={107}
                className="w-full h-full object-cover rounded-xl"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// MEDIUM BANNER (Single large promo banner)
// ============================================

export interface MediumBannerProps {
  image: string;
  alt: string;
  link: string;
  className?: string;
}

// Default medium banner - fallback
const defaultMediumBanner = {
  image: "https://nftest.dreamhosters.com/wp-content/uploads/2026/02/BEST-CREATINE-PRICES-1.png",
  alt: "Best Creatine Prices",
  link: "/shop/creatine",
};

/**
 * MediumBanner Component
 *
 * Single medium-width promotional banner (980px)
 * Used for featured promotions like "Best Creatine Prices"
 */
export function MediumBanner({ 
  image, 
  alt, 
  link, 
  className 
}: MediumBannerProps) {
  // Use default if no image provided
  const bannerImage = image || defaultMediumBanner.image;
  const bannerAlt = alt || defaultMediumBanner.alt;
  const bannerLink = link || defaultMediumBanner.link;

  return (
    <section className={cn("py-8 bg-white", className)}>
      <div className="container mx-auto px-4">
        <Link 
          href={bannerLink}
          className="block mx-auto" 
          style={{ maxWidth: '980px', borderRadius: '12px', overflow: 'hidden', lineHeight: 0 }}
        >
          <Image
            src={bannerImage}
            alt={bannerAlt}
            width={980}
            height={201}
            className="w-full h-auto"
            style={{ display: 'block' }}
          />
        </Link>
      </div>
    </section>
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
