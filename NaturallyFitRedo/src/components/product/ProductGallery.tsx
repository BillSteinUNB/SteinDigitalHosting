"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, FreeMode, Zoom } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { SaleBadge, StockBadge, Modal } from "@/components/ui";
import type { ProductImage, StockStatus } from "@/types/product";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import "swiper/css/zoom";

// ============================================
// PRODUCT GALLERY COMPONENT
// ============================================

export interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
  onSale?: boolean;
  stockStatus?: StockStatus;
  className?: string;
}

/**
 * ProductGallery Component
 *
 * Main product image gallery with thumbnail navigation.
 * Features:
 * - Large main image with Swiper
 * - Thumbnail strip navigation
 * - Zoom modal on click
 * - Navigation arrows
 * - Sale/Stock badges
 */
export default function ProductGallery({
  images,
  productName,
  onSale = false,
  stockStatus = "IN_STOCK",
  className,
}: ProductGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const mainSwiperRef = useRef<SwiperType | null>(null);

  // Handle case with no images
  const galleryImages = images.length > 0 ? images : [
    { sourceUrl: "https://placehold.co/600x600/1a1a2e/eee?text=No+Image", altText: productName }
  ];
  const gallerySignature = galleryImages.map((img) => img.sourceUrl).join("|");

  const isOutOfStock = stockStatus === "OUT_OF_STOCK";

  useEffect(() => {
    setActiveIndex(0);
    mainSwiperRef.current?.slideTo(0, 0);
  }, [gallerySignature]);

  return (
    <div className={cn("flex flex-col gap-4 min-w-0", className)}>
      {/* Main Image Container */}
      <div className="relative aspect-square bg-gray-light border border-gray-border">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {onSale && <SaleBadge />}
          {isOutOfStock && <StockBadge status="OUT_OF_STOCK" />}
        </div>

        {/* Zoom Button */}
        <button
          type="button"
          onClick={() => setIsZoomModalOpen(true)}
          className={cn(
            "absolute top-3 right-3 z-10",
            "w-10 h-10 min-w-[44px] min-h-[44px]",
            "flex items-center justify-center",
            "bg-white/90 hover:bg-white",
            "text-black transition-colors",
            "border border-gray-border"
          )}
          aria-label="Zoom image"
        >
          <ZoomIn size={20} strokeWidth={1.5} />
        </button>

        {/* Main Swiper */}
        <Swiper
          key={`main-${gallerySignature}`}
          modules={[Navigation, Thumbs, Zoom]}
          onSwiper={(swiper) => {
            mainSwiperRef.current = swiper;
          }}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          spaceBetween={0}
          slidesPerView={1}
          className="w-full h-full"
        >
          {galleryImages.map((image, index) => (
            <SwiperSlide key={image.id || `${image.sourceUrl}-${index}`}>
              <div
                className="relative w-full h-full cursor-zoom-in"
                onClick={() => setIsZoomModalOpen(true)}
              >
                <Image
                  src={image.sourceUrl}
                  alt={image.altText || `${productName} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={index === 0}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Arrows (only show if more than 1 image) */}
        {galleryImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => mainSwiperRef.current?.slidePrev()}
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 z-10",
                "w-10 h-10 min-w-[44px] min-h-[44px]",
                "flex items-center justify-center",
                "bg-white/90 hover:bg-white",
                "text-black transition-colors",
                "border border-gray-border"
              )}
              aria-label="Previous image"
            >
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>

            <button
              type="button"
              onClick={() => mainSwiperRef.current?.slideNext()}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 z-10",
                "w-10 h-10 min-w-[44px] min-h-[44px]",
                "flex items-center justify-center",
                "bg-white/90 hover:bg-white",
                "text-black transition-colors",
                "border border-gray-border"
              )}
              aria-label="Next image"
            >
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>
          </>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center pointer-events-none z-[5]">
            <span className="font-heading text-lg uppercase text-gray-dark">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {galleryImages.length > 1 && (
        <div className="relative">
          <Swiper
            key={`thumbs-${gallerySignature}`}
            modules={[FreeMode, Navigation, Thumbs]}
            onSwiper={setThumbsSwiper}
            spaceBetween={8}
            slidesPerView={4}
            freeMode
            watchSlidesProgress
            breakpoints={{
              640: { slidesPerView: 5 },
              1024: { slidesPerView: 6 },
            }}
            className="thumbnails-swiper"
          >
            {galleryImages.map((image, index) => (
              <SwiperSlide key={image.id || `${image.sourceUrl}-thumb-${index}`}>
                <button
                  type="button"
                  className={cn(
                    "relative aspect-square w-full",
                    "border-2 transition-colors",
                    "min-h-[60px] min-w-[60px]",
                    activeIndex === index
                      ? "border-red-primary"
                      : "border-gray-border hover:border-gray-dark"
                  )}
                  onClick={() => {
                    mainSwiperRef.current?.slideTo(index);
                    setActiveIndex(index);
                  }}
                  aria-label={`View image ${index + 1}`}
                  aria-current={activeIndex === index ? "true" : "false"}
                >
                  <Image
                    src={image.sourceUrl}
                    alt={image.altText || `${productName} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Zoom Modal */}
      <ZoomModal
        isOpen={isZoomModalOpen}
        onClose={() => setIsZoomModalOpen(false)}
        images={galleryImages}
        activeIndex={activeIndex}
        productName={productName}
      />
    </div>
  );
}

// ============================================
// ZOOM MODAL COMPONENT
// ============================================

interface ZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: ProductImage[];
  activeIndex: number;
  productName: string;
}

function ZoomModal({
  isOpen,
  onClose,
  images,
  activeIndex,
  productName,
}: ZoomModalProps) {
  const [currentIndex, setCurrentIndex] = useState(activeIndex);
  const modalSwiperRef = useRef<SwiperType | null>(null);

  // Update currentIndex when activeIndex changes from parent
  useEffect(() => {
    setCurrentIndex(activeIndex);
  }, [activeIndex]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      title={productName}
      className="bg-black"
    >
      <div className="relative w-full h-full min-h-[400px] md:min-h-[600px]">
        <Swiper
          modules={[Navigation, Zoom]}
          onSwiper={(swiper) => {
            modalSwiperRef.current = swiper;
          }}
          initialSlide={activeIndex}
          onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
          spaceBetween={0}
          slidesPerView={1}
          zoom={{
            maxRatio: 3,
            minRatio: 1,
          }}
          className="w-full h-full"
        >
          {images.map((image, index) => (
            <SwiperSlide key={image.id || `zoom-${index}`}>
              <div className="swiper-zoom-container w-full h-full flex items-center justify-center">
                <Image
                  src={image.sourceUrl}
                  alt={image.altText || `${productName} - Image ${index + 1}`}
                  width={1000}
                  height={1000}
                  className="object-contain max-h-[80vh]"
                  priority
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => modalSwiperRef.current?.slidePrev()}
              className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 z-10",
                "w-12 h-12 min-w-[44px] min-h-[44px]",
                "flex items-center justify-center",
                "bg-white hover:bg-gray-100",
                "text-black transition-colors"
              )}
              aria-label="Previous image"
            >
              <ChevronLeft size={24} strokeWidth={1.5} />
            </button>

            <button
              type="button"
              onClick={() => modalSwiperRef.current?.slideNext()}
              className={cn(
                "absolute right-4 top-1/2 -translate-y-1/2 z-10",
                "w-12 h-12 min-w-[44px] min-h-[44px]",
                "flex items-center justify-center",
                "bg-white hover:bg-gray-100",
                "text-black transition-colors"
              )}
              aria-label="Next image"
            >
              <ChevronRight size={24} strokeWidth={1.5} />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <span className="px-4 py-2 bg-black/70 text-white text-sm font-heading">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      </div>
    </Modal>
  );
}

// ============================================
// PRODUCT GALLERY SKELETON
// ============================================

export function ProductGallerySkeleton() {
  return (
    <div className="flex flex-col gap-4 min-w-0 animate-pulse">
      {/* Main Image Skeleton */}
      <div className="aspect-square bg-gray-200 border border-gray-border" />

      {/* Thumbnail Strip Skeleton */}
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-[60px] h-[60px] bg-gray-200" />
        ))}
      </div>
    </div>
  );
}
