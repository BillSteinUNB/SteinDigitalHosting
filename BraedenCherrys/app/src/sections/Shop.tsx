import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useCart } from '@/context/CartContext';
import { products } from '@/data';

export default function Shop() {
  const { ref: sectionRef, isVisible } = useScrollAnimation<HTMLElement>();
  const { addToCart } = useCart();
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart(product);
    setAddedProducts((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedProducts((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 1500);
  };

  return (
    <section
      id="shop"
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
              THE SHOP
            </h2>
            <p className="font-body text-gray-text mt-2">
              Premium products we use and recommend.
            </p>
          </div>
          <button className="hidden md:block font-body text-sm text-white/60 hover:text-cherry transition-colors duration-200">
            View All →
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`product-card bg-noir-elevated rounded-sm overflow-hidden group transition-all duration-700 ${
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-12 opacity-0'
              }`}
              style={{
                transitionDelay: `${index * 0.1}s`,
                transitionTimingFunction: 'var(--ease-sharp)',
              }}
            >
              {/* Product Image */}
              <div className="aspect-square bg-gradient-to-b from-noir-elevated to-noir-rich p-8 flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                  style={{ transitionTimingFunction: 'var(--ease-sharp)' }}
                />
              </div>

              {/* Product Info */}
              <div className="p-6">
                <span className="font-mono text-xs text-white/40 tracking-ultra">
                  {product.category.toUpperCase()}
                </span>
                <h3 className="font-display text-lg text-white mt-1 mb-1">
                  {product.name}
                </h3>
                <p className="font-body text-sm text-gray-text mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg text-cherry">
                    ${product.price}
                  </span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-sm font-body text-sm font-medium transition-all duration-200 ${
                      addedProducts.has(product.id)
                        ? 'bg-green-500 text-white'
                        : 'bg-cherry text-white hover:bg-cherry-bright'
                    }`}
                    style={{ transitionTimingFunction: 'var(--ease-sharp)' }}
                  >
                    {addedProducts.has(product.id) ? (
                      <>
                        <Check className="w-4 h-4" />
                        ADDED
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        ADD
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-8 text-center md:hidden">
          <button className="font-body text-sm text-white/60 hover:text-cherry transition-colors duration-200">
            View All →
          </button>
        </div>
      </div>
    </section>
  );
}
