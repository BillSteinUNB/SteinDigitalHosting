import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const {
    items,
    isOpen,
    totalItems,
    totalPrice,
    removeFromCart,
    updateQuantity,
    clearCart,
    closeCart,
  } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 animate-fade-in"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full w-full max-w-md z-50 bg-noir-elevated shadow-lift animate-slide-up"
        style={{
          animation: 'slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-cherry" />
            <h2 className="font-display text-xl text-white">
              YOUR BAG ({totalItems})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-sm transition-all duration-200"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-[calc(100%-180px)] overflow-hidden">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <ShoppingBag className="w-16 h-16 text-white/20 mb-4" />
              <p className="font-body text-white/60">Your bag is empty</p>
              <p className="font-body text-sm text-white/40 mt-2">
                Add some products to get started
              </p>
              <button
                onClick={closeCart}
                className="btn-primary mt-6"
              >
                CONTINUE SHOPPING
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-noir-rich rounded-sm group"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-noir-elevated rounded-sm flex-shrink-0 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-display text-sm text-white truncate">
                          {item.name}
                        </h3>
                        <p className="font-mono text-xs text-white/40 mt-1">
                          {item.category}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-white/40 hover:text-cherry transition-colors duration-200 opacity-0 group-hover:opacity-100"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-7 h-7 flex items-center justify-center bg-noir-elevated text-white/60 hover:text-white rounded-sm transition-colors duration-200"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-sm text-white w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-7 h-7 flex items-center justify-center bg-noir-elevated text-white/60 hover:text-white rounded-sm transition-colors duration-200"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="font-mono text-sm text-cherry">
                        ${item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-noir-elevated border-t border-white/10">
            {/* Subtotal */}
            <div className="flex items-center justify-between mb-4">
              <span className="font-body text-white/60">Subtotal</span>
              <span className="font-mono text-lg text-white">
                ${totalPrice}
              </span>
            </div>

            {/* Shipping */}
            <div className="flex items-center justify-between mb-6">
              <span className="font-body text-white/60">Shipping</span>
              <span className="font-mono text-sm text-white/40">
                Calculated at checkout
              </span>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => alert('Checkout coming soon!')}
                className="w-full btn-primary justify-center"
              >
                CHECKOUT →
              </button>
              <div className="flex items-center justify-between">
                <button
                  onClick={clearCart}
                  className="font-body text-sm text-white/40 hover:text-cherry transition-colors duration-200"
                >
                  Clear bag
                </button>
                <button
                  onClick={closeCart}
                  className="font-body text-sm text-white/60 hover:text-white transition-colors duration-200"
                >
                  Continue shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
