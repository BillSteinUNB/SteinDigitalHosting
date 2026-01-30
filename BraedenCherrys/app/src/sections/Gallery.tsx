import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { galleryItems } from '@/data';

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const { ref: sectionRef, isVisible } = useScrollAnimation<HTMLElement>();

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = '';
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;
    const newIndex =
      direction === 'prev'
        ? selectedImage === 0
          ? galleryItems.length - 1
          : selectedImage - 1
        : selectedImage === galleryItems.length - 1
        ? 0
        : selectedImage + 1;
    setSelectedImage(newIndex);
  };

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-noir-rich"
    >
      <div className="w-full section-padding">
        {/* Section Header */}
        <div
          className={`flex items-end justify-between mb-12 transition-all duration-700 ${
            isVisible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-8 opacity-0'
          }`}
          style={{ transitionTimingFunction: 'var(--ease-sharp)' }}
        >
          <div>
            <h2 className="font-display text-display text-white tracking-tight">
              THE WORK
            </h2>
            <p className="font-body text-gray-text mt-2">
              Portfolio of precision.
            </p>
          </div>
          <button className="hidden md:block font-body text-sm text-white/60 hover:text-cherry transition-colors duration-200">
            View All →
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {galleryItems.map((item, index) => (
            <div
              key={item.id}
              className={`cut-card aspect-[3/4] rounded-sm cursor-pointer group transition-all duration-700 ${
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-12 opacity-0'
              }`}
              style={{
                transitionDelay: `${index * 0.1}s`,
                transitionTimingFunction: 'var(--ease-sharp)',
              }}
              onClick={() => openLightbox(index)}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Overlay Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="font-mono text-xs text-white/60 tracking-ultra mb-1">
                  {item.category.toUpperCase()}
                </span>
                <h3 className="font-display text-2xl text-white">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 text-center md:hidden">
          <button className="font-body text-sm text-white/60 hover:text-cherry transition-colors duration-200">
            View All →
          </button>
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-fade-in"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-2 text-white/60 hover:text-white transition-colors z-10"
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox('prev');
            }}
            className="absolute left-4 md:left-8 p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox('next');
            }}
            className="absolute right-4 md:right-8 p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Image */}
          <div
            className="max-w-4xl max-h-[80vh] px-16"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryItems[selectedImage].image}
              alt={galleryItems[selectedImage].title}
              className="max-w-full max-h-[80vh] object-contain animate-scale-in"
            />
            <div className="mt-4 text-center">
              <span className="font-mono text-xs text-white/60 tracking-ultra">
                {galleryItems[selectedImage].category.toUpperCase()}
              </span>
              <h3 className="font-display text-2xl text-white mt-1">
                {galleryItems[selectedImage].title}
              </h3>
            </div>
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-sm text-white/40">
            {selectedImage + 1} / {galleryItems.length}
          </div>
        </div>
      )}
    </section>
  );
}
