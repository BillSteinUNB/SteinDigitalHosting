"use client";

// ============================================
// CHECKOUT REVIEW & PLACE ORDER
// ============================================

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit2,
  MapPin,
  CreditCard,
  Truck,
  Lock,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useCheckoutStore } from "@/stores/checkout-store";
import { useCartStore } from "@/stores/cart-store";

// ============================================
// REVIEW SECTION COMPONENT
// ============================================

interface ReviewSectionProps {
  title: string;
  icon: React.ReactNode;
  onEdit: () => void;
  children: React.ReactNode;
}

function ReviewSection({ title, icon, onEdit, children }: ReviewSectionProps) {
  return (
    <div className="border border-gray-border">
      <div className="flex items-center justify-between p-4 bg-gray-light border-b border-gray-border">
        <div className="flex items-center gap-3">
          <span className="text-gray-medium">{icon}</span>
          <h3 className="font-heading font-bold uppercase text-sm">{title}</h3>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1 text-small text-red-primary hover:underline"
        >
          <Edit2 size={14} strokeWidth={1.5} />
          Edit
        </button>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

// ============================================
// COMPONENT
// ============================================

export function CheckoutReview() {
  const router = useRouter();
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);

  const {
    customerInfo,
    shippingInfo,
    paymentInfo,
    isProcessing,
    orderError,
    processOrder,
    setStep,
    goToPreviousStep,
  } = useCheckoutStore();

  const { cart, clearCart } = useCartStore();

  // Calculate totals
  const subtotal = cart.subtotal;
  const discount = cart.discountTotal;
  const shipping = cart.shippingTotal;
  const tax = cart.taxTotal;
  const total = subtotal - discount + shipping + tax;

  // Get selected shipping method label
  const selectedShippingMethod = cart.shippingMethods?.find(
    (m) => m.id === cart.selectedShippingMethod
  );

  // Get payment method label
  const paymentMethodLabels = {
    credit_card: "Credit Card",
    paypal: "PayPal",
    afterpay: "Afterpay",
  };

  // Handle place order
  const handlePlaceOrder = async () => {
    if (!agreeTerms) {
      setTermsError(true);
      return;
    }

    setTermsError(false);
    const success = await processOrder();

    if (success) {
      clearCart();
      router.push("/checkout/confirmation");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="font-heading font-bold uppercase text-xl mb-6">
        Review Your Order
      </h2>

      {/* Order Error */}
      {orderError && (
        <div className="flex items-center gap-3 p-4 bg-error/10 border border-error">
          <AlertCircle size={20} strokeWidth={1.5} className="text-error flex-shrink-0" />
          <div>
            <p className="font-semibold text-error">Order could not be processed</p>
            <p className="text-small text-error">{orderError}</p>
          </div>
        </div>
      )}

      {/* Review Sections */}
      <div className="space-y-4">
        {/* Contact Information */}
        <ReviewSection
          title="Contact Information"
          icon={<CreditCard size={18} strokeWidth={1.5} />}
          onEdit={() => setStep("information")}
        >
          <p className="text-gray-dark">{customerInfo.email}</p>
          <p className="text-gray-dark">{customerInfo.phone}</p>
        </ReviewSection>

        {/* Shipping Address */}
        <ReviewSection
          title="Shipping Address"
          icon={<MapPin size={18} strokeWidth={1.5} />}
          onEdit={() => setStep("shipping")}
        >
          <address className="not-italic text-gray-dark">
            <p className="font-semibold">
              {shippingInfo.shippingAddress.firstName} {shippingInfo.shippingAddress.lastName}
            </p>
            {shippingInfo.shippingAddress.company && (
              <p>{shippingInfo.shippingAddress.company}</p>
            )}
            <p>{shippingInfo.shippingAddress.address1}</p>
            {shippingInfo.shippingAddress.address2 && (
              <p>{shippingInfo.shippingAddress.address2}</p>
            )}
            <p>
              {shippingInfo.shippingAddress.city}, {shippingInfo.shippingAddress.state}{" "}
              {shippingInfo.shippingAddress.postcode}
            </p>
            <p>Canada</p>
          </address>
        </ReviewSection>

        {/* Shipping Method */}
        <ReviewSection
          title="Shipping Method"
          icon={<Truck size={18} strokeWidth={1.5} />}
          onEdit={() => setStep("shipping")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{selectedShippingMethod?.label || "Standard Shipping"}</p>
              <p className="text-small text-gray-medium">
                {selectedShippingMethod?.description}
              </p>
            </div>
            <span className="font-bold">
              {shipping === 0 ? "FREE" : formatPrice(shipping)}
            </span>
          </div>
          {shippingInfo.shippingNotes && (
            <div className="mt-3 pt-3 border-t border-gray-border">
              <p className="text-small text-gray-medium">
                <span className="font-semibold">Delivery notes:</span> {shippingInfo.shippingNotes}
              </p>
            </div>
          )}
        </ReviewSection>

        {/* Payment Method */}
        <ReviewSection
          title="Payment Method"
          icon={<CreditCard size={18} strokeWidth={1.5} />}
          onEdit={() => setStep("payment")}
        >
          <div className="flex items-center gap-3">
            <span className="font-semibold">
              {paymentMethodLabels[paymentInfo.paymentMethod]}
            </span>
            {paymentInfo.paymentMethod === "credit_card" && paymentInfo.cardNumber && (
              <span className="text-gray-medium">
                ending in {paymentInfo.cardNumber.slice(-4)}
              </span>
            )}
          </div>
        </ReviewSection>
      </div>

      {/* Order Items */}
      <div className="border border-gray-border">
        <div className="p-4 bg-gray-light border-b border-gray-border">
          <h3 className="font-heading font-bold uppercase text-sm">
            Order Items ({cart.itemCount})
          </h3>
        </div>
        <div className="divide-y divide-gray-border">
          {cart.items.map((item) => (
            <div key={item.key} className="p-4 flex gap-4">
              {/* Product Image */}
              <div className="relative w-16 h-16 bg-gray-light flex-shrink-0">
                {item.image ? (
                  <Image
                    src={item.image.sourceUrl}
                    alt={item.image.altText || item.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-medium text-tiny">
                    No image
                  </div>
                )}
                {/* Quantity badge */}
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-primary text-white text-tiny font-bold flex items-center justify-center">
                  {item.quantity}
                </span>
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-small truncate">{item.name}</p>
                {item.variation && (
                  <p className="text-tiny text-gray-medium mt-0.5">
                    {item.variation.attributes?.map((attr) => attr.value).join(" / ")}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="text-right flex-shrink-0">
                <p className="font-bold">{formatPrice(item.subtotal)}</p>
                {item.quantity > 1 && (
                  <p className="text-tiny text-gray-medium">
                    {formatPrice(item.price)} each
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-light p-6">
        <h3 className="font-heading font-bold uppercase text-lg mb-4">Order Total</h3>

        <div className="space-y-3 pb-4 border-b border-gray-border">
          <div className="flex justify-between">
            <span className="text-gray-dark">Subtotal</span>
            <span className="font-semibold">{formatPrice(subtotal)}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-success">
              <span>Discount</span>
              <span className="font-semibold">-{formatPrice(discount)}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-gray-dark">Shipping</span>
            <span className="font-semibold">
              {shipping === 0 ? "FREE" : formatPrice(shipping)}
            </span>
          </div>

          {tax > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-dark">Tax</span>
              <span className="font-semibold">{formatPrice(tax)}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <span className="font-heading font-bold text-xl uppercase">Total</span>
          <span className="font-bold text-2xl">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Terms Agreement */}
      <div className="border-t border-gray-border pt-6">
        <label className={cn(
          "flex items-start gap-3 cursor-pointer",
          termsError && "text-error"
        )}>
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => {
              setAgreeTerms(e.target.checked);
              setTermsError(false);
            }}
            className="mt-1 w-5 h-5 accent-red-primary"
          />
          <span className="text-small">
            I have read and agree to the{" "}
            <Link href="/terms" className="text-red-primary hover:underline" target="_blank">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-red-primary hover:underline" target="_blank">
              Privacy Policy
            </Link>
            . I understand that my order is final and cannot be changed after submission.
          </span>
        </label>
        {termsError && (
          <p className="text-error text-small mt-2">
            Please agree to the terms and conditions to continue
          </p>
        )}
      </div>

      {/* Place Order Button */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          size="lg"
          leftIcon={<ArrowLeft size={18} strokeWidth={1.5} />}
          onClick={goToPreviousStep}
          disabled={isProcessing}
        >
          Back
        </Button>

        <Button
          type="button"
          variant="primary"
          size="lg"
          leftIcon={<Lock size={18} strokeWidth={1.5} />}
          isLoading={isProcessing}
          onClick={handlePlaceOrder}
          className="sm:ml-auto"
        >
          {isProcessing ? "Processing..." : `Place Order • ${formatPrice(total)}`}
        </Button>
      </div>

      {/* Security Note */}
      <div className="text-center pt-4">
        <p className="text-tiny text-gray-medium">
          <Lock size={12} strokeWidth={1.5} className="inline mr-1" />
          Your payment information is encrypted and secure. We never store your full card details.
        </p>
      </div>
    </div>
  );
}

export default CheckoutReview;
