// ============================================
// CHECKOUT STORE (Zustand)
// ============================================

import { create } from "zustand";
import type { Address } from "@/types/user";

// ============================================
// TYPES
// ============================================

export type CheckoutStep = "information" | "shipping" | "payment" | "review";

export interface CustomerInfo {
  email: string;
  phone: string;
  createAccount: boolean;
  password?: string;
}

export interface ShippingInfo {
  shippingAddress: Address;
  billingAddress: Address;
  sameAsShipping: boolean;
  shippingMethod: string;
  shippingNotes?: string;
}

export interface PaymentInfo {
  paymentMethod: "credit_card" | "paypal" | "afterpay";
  // Credit card (in production, use Stripe Elements - this is for mock)
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
  cardName?: string;
  // Save for later
  savePaymentMethod: boolean;
}

export interface CheckoutState {
  // Current step
  currentStep: CheckoutStep;
  completedSteps: CheckoutStep[];

  // Form data
  customerInfo: CustomerInfo;
  shippingInfo: ShippingInfo;
  paymentInfo: PaymentInfo;

  // Order processing
  isProcessing: boolean;
  orderError: string | null;
  orderId: string | null;

  // Actions
  setStep: (step: CheckoutStep) => void;
  completeStep: (step: CheckoutStep) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;

  // Form updates
  updateCustomerInfo: (info: Partial<CustomerInfo>) => void;
  updateShippingInfo: (info: Partial<ShippingInfo>) => void;
  updatePaymentInfo: (info: Partial<PaymentInfo>) => void;

  // Order processing
  processOrder: () => Promise<boolean>;
  setOrderError: (error: string | null) => void;

  // Reset
  resetCheckout: () => void;
}

// ============================================
// DEFAULT VALUES
// ============================================

const emptyAddress: Address = {
  firstName: "",
  lastName: "",
  company: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  postcode: "",
  country: "CA",
  phone: "",
  email: "",
};

const defaultCustomerInfo: CustomerInfo = {
  email: "",
  phone: "",
  createAccount: false,
};

const defaultShippingInfo: ShippingInfo = {
  shippingAddress: { ...emptyAddress },
  billingAddress: { ...emptyAddress },
  sameAsShipping: true,
  shippingMethod: "",
};

const defaultPaymentInfo: PaymentInfo = {
  paymentMethod: "credit_card",
  savePaymentMethod: false,
};

// ============================================
// STEP ORDER
// ============================================

const stepOrder: CheckoutStep[] = ["information", "shipping", "payment", "review"];

// ============================================
// STORE
// ============================================

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
  // Initial state
  currentStep: "information",
  completedSteps: [],
  customerInfo: defaultCustomerInfo,
  shippingInfo: defaultShippingInfo,
  paymentInfo: defaultPaymentInfo,
  isProcessing: false,
  orderError: null,
  orderId: null,

  // Set current step
  setStep: (step) => {
    const { completedSteps } = get();
    const stepIndex = stepOrder.indexOf(step);
    const currentIndex = stepOrder.indexOf(get().currentStep);

    // Can only go to completed steps or the next step
    const canGo =
      completedSteps.includes(step) ||
      stepIndex <= currentIndex ||
      stepIndex === completedSteps.length;

    if (canGo) {
      set({ currentStep: step });
    }
  },

  // Mark step as completed
  completeStep: (step) => {
    set((state) => ({
      completedSteps: state.completedSteps.includes(step)
        ? state.completedSteps
        : [...state.completedSteps, step],
    }));
  },

  // Go to next step
  goToNextStep: () => {
    const { currentStep, completedSteps } = get();
    const currentIndex = stepOrder.indexOf(currentStep);

    if (currentIndex < stepOrder.length - 1) {
      const nextStep = stepOrder[currentIndex + 1];

      // Mark current step as completed
      const newCompletedSteps = completedSteps.includes(currentStep)
        ? completedSteps
        : [...completedSteps, currentStep];

      set({
        currentStep: nextStep,
        completedSteps: newCompletedSteps,
      });
    }
  },

  // Go to previous step
  goToPreviousStep: () => {
    const { currentStep } = get();
    const currentIndex = stepOrder.indexOf(currentStep);

    if (currentIndex > 0) {
      set({ currentStep: stepOrder[currentIndex - 1] });
    }
  },

  // Update customer info
  updateCustomerInfo: (info) => {
    set((state) => ({
      customerInfo: { ...state.customerInfo, ...info },
    }));
  },

  // Update shipping info
  updateShippingInfo: (info) => {
    set((state) => ({
      shippingInfo: { ...state.shippingInfo, ...info },
    }));
  },

  // Update payment info
  updatePaymentInfo: (info) => {
    set((state) => ({
      paymentInfo: { ...state.paymentInfo, ...info },
    }));
  },

  // Process order
  processOrder: async () => {
    set({ isProcessing: true, orderError: null });

    try {
      // Simulate order processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate mock order ID
      const orderId = `NF-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      set({ orderId, isProcessing: false });
      return true;
    } catch (error) {
      set({
        orderError: error instanceof Error ? error.message : "An error occurred",
        isProcessing: false,
      });
      return false;
    }
  },

  // Set order error
  setOrderError: (error) => {
    set({ orderError: error });
  },

  // Reset checkout
  resetCheckout: () => {
    set({
      currentStep: "information",
      completedSteps: [],
      customerInfo: defaultCustomerInfo,
      shippingInfo: defaultShippingInfo,
      paymentInfo: defaultPaymentInfo,
      isProcessing: false,
      orderError: null,
      orderId: null,
    });
  },
}));

// ============================================
// SELECTORS
// ============================================

export const selectCurrentStep = (state: CheckoutState) => state.currentStep;
export const selectCompletedSteps = (state: CheckoutState) => state.completedSteps;
export const selectIsStepCompleted = (step: CheckoutStep) => (state: CheckoutState) =>
  state.completedSteps.includes(step);
export const selectCanProceed = (state: CheckoutState) => {
  const { currentStep, customerInfo, shippingInfo, paymentInfo } = state;

  switch (currentStep) {
    case "information":
      return customerInfo.email.length > 0 && customerInfo.phone.length > 0;
    case "shipping":
      return (
        shippingInfo.shippingAddress.firstName.length > 0 &&
        shippingInfo.shippingAddress.address1.length > 0 &&
        shippingInfo.shippingMethod.length > 0
      );
    case "payment":
      return paymentInfo.paymentMethod.length > 0;
    case "review":
      return true;
    default:
      return false;
  }
};
