# NATURALLY FIT - GO-LIVE CHECKLIST

This document tracks all items requiring manual implementation before launching the site.

---

## TABLE OF CONTENTS
1. [Critical - Must Fix Before Launch](#1-critical---must-fix-before-launch)
2. [Environment Variables](#2-environment-variables)
3. [Mock Data to Replace](#3-mock-data-to-replace)
4. [Payment Integration](#4-payment-integration)
5. [Authentication](#5-authentication)
6. [Email/Notifications](#6-emailnotifications)
7. [Analytics](#7-analytics)
8. [Missing Pages to Create](#8-missing-pages-to-create)
9. [Incomplete Features](#9-incomplete-features)
10. [Images to Add](#10-images-to-add)
11. [URLs to Verify](#11-urls-to-verify)
12. [Security Checklist](#12-security-checklist)

---

## 1. CRITICAL - MUST FIX BEFORE LAUNCH

### Environment Variables (Production)
- [ ] Change `NEXTAUTH_SECRET` from development value to secure production secret
- [ ] Set `NEXT_PUBLIC_USE_MOCK_DATA=false`
- [ ] Update `NEXTAUTH_URL` to production URL
- [ ] Update `NEXT_PUBLIC_SITE_URL` to production URL
- [ ] Configure `NEXT_PUBLIC_WORDPRESS_URL` for production WordPress
- [ ] Configure `NEXT_PUBLIC_GRAPHQL_ENDPOINT` for production GraphQL

### Data Integration
- [ ] Implement WooCommerce GraphQL data fetching (replace all mock data)
- [ ] Implement real authentication with WooCommerce JWT
- [ ] Connect cart to WooCommerce cart API
- [ ] Connect checkout to WooCommerce order API

### Payment Processing
- [ ] Implement Stripe Elements for credit card payments
- [ ] Configure production Stripe keys

---

## 2. ENVIRONMENT VARIABLES

### `.env.local` - Required Changes for Production

```env
# WordPress/WooCommerce
NEXT_PUBLIC_WORDPRESS_URL=https://naturallyfit.ca
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://naturallyfit.ca/graphql

# Wholesale Inquiry Form (WooCommerce REST - server-side)
# Create keys in WooCommerce Admin → Settings → Advanced → REST API (Read/Write)
WOOCOMMERCE_REST_URL=https://naturallyfit.ca
WOOCOMMERCE_CONSUMER_KEY=ck_live_...
WOOCOMMERCE_CONSUMER_SECRET=cs_live_...

# Authentication - CHANGE THIS!
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=https://naturallyfit.ca

# Site URL
NEXT_PUBLIC_SITE_URL=https://naturallyfit.ca

# DISABLE mock data
NEXT_PUBLIC_USE_MOCK_DATA=false

# Stripe (add these)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Google Analytics (add this)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 3. MOCK DATA TO REPLACE

All mock data is in `src/lib/mock/`. This needs to be replaced with real WooCommerce GraphQL queries.

### Mock Data Files
| File | Replace With |
|------|--------------|
| `src/lib/mock/products.ts` | WooCommerce Products GraphQL query |
| `src/lib/mock/categories.ts` | WooCommerce Product Categories query |
| `src/lib/mock/brands.ts` | WooCommerce Product Attributes (brand) query |
| `src/lib/mock/users.ts` | WooCommerce Customer API |

### Components Using Mock Data
| File | Lines | What to Update |
|------|-------|----------------|
| `src/app/page.tsx` | 21-23 | Fetch featured/new products from GraphQL |
| `src/app/shop/page.tsx` | 18 | Fetch paginated products from GraphQL |
| `src/app/shop/[category]/page.tsx` | 20-21 | Fetch category products from GraphQL |
| `src/app/product/[slug]/page.tsx` | 17-18 | Fetch single product from GraphQL |
| `src/app/brands/page.tsx` | 8 | Fetch brands from GraphQL |
| `src/app/brands/[brand]/page.tsx` | 21-22 | Fetch brand products from GraphQL |
| `src/app/account/page.tsx` | 22-53 | Fetch real user orders/stats |
| `src/app/account/orders/page.tsx` | 15-65 | Fetch real orders from WooCommerce |
| `src/app/account/addresses/page.tsx` | 13-61 | Fetch real addresses from WooCommerce |
| `src/components/shop/FilterSidebar.tsx` | 7-9 | Use real categories/brands/prices |
| `src/components/shop/ActiveFilters.tsx` | 7-8 | Use real category/brand data |
| `src/components/product/ProductReviews.tsx` | 15 | Fetch real reviews from WooCommerce |

### GraphQL Implementation Needed
Create these files:
- [ ] `src/lib/graphql/client.ts` - GraphQL request client
- [ ] `src/lib/graphql/queries/products.ts` - Product queries
- [ ] `src/lib/graphql/queries/categories.ts` - Category queries
- [ ] `src/lib/graphql/queries/cart.ts` - Cart queries/mutations
- [ ] `src/lib/graphql/queries/orders.ts` - Order queries
- [ ] `src/lib/graphql/queries/customer.ts` - Customer queries

---

## 4. PAYMENT INTEGRATION

### Current State
The checkout payment form at `src/components/checkout/CheckoutPayment.tsx` is a **mock form** that collects card data directly. This is **NOT PCI compliant** and must be replaced.

### Required Implementation

#### Stripe Elements Integration
- [ ] Install `@stripe/stripe-js` and `@stripe/react-stripe-js`
- [ ] Create Stripe context provider
- [ ] Replace `CheckoutPayment.tsx` with Stripe Elements `CardElement`
- [ ] Implement payment intent creation on server
- [ ] Handle payment confirmation

#### Files to Create/Modify
| File | Action |
|------|--------|
| `src/lib/stripe.ts` | Create - Stripe client initialization |
| `src/components/checkout/StripeProvider.tsx` | Create - Stripe Elements provider |
| `src/components/checkout/CheckoutPayment.tsx` | Replace - Use Stripe CardElement |
| `src/app/api/stripe/create-payment-intent/route.ts` | Create - Server-side payment intent |

#### PayPal Integration (Optional)
- [ ] Implement PayPal checkout SDK
- [ ] Create PayPal button component

#### Afterpay Integration (Optional)
- [ ] Implement Afterpay/Clearpay SDK if desired

### Checkout Store Updates
File: `src/stores/checkout-store.ts`
- Line 31: Remove mock card handling comment
- Lines 213-217: Replace mock order processing with real WooCommerce order creation

---

## 5. AUTHENTICATION

### Current State
Authentication uses mock users defined in `src/lib/auth.ts`. This needs to connect to WooCommerce.

### Files to Update
| File | Lines | What to Change |
|------|-------|----------------|
| `src/lib/auth.ts` | 61-103 | Replace mock user database with WooCommerce lookup |
| `src/lib/auth.ts` | 110-131 | Implement real WooCommerce JWT authentication |
| `src/lib/auth.ts` | 137-152 | Implement real token refresh |
| `src/lib/auth.ts` | 189-190 | Use real WooCommerce JWT tokens |

### WooCommerce Auth Implementation
- [ ] Install WooCommerce JWT Authentication plugin on WordPress
- [ ] Configure JWT secret in WordPress
- [ ] Implement login against WooCommerce `/wp-json/jwt-auth/v1/token`
- [ ] Implement token refresh
- [ ] Implement registration via WooCommerce Customer API

### Password Reset
- [ ] Implement `/forgot-password` page
- [ ] Connect to WooCommerce password reset endpoint

---

## 6. EMAIL/NOTIFICATIONS

### Newsletter Signup
File: `src/components/home/Newsletter.tsx`
- Lines 58-69: Replace mock `setTimeout` with real email service integration
- Lines 202-208: Same for `InlineNewsletter` component

#### Options
- [ ] Mailchimp integration
- [ ] Klaviyo integration
- [ ] WooCommerce email list integration

### Contact Form
File: `src/app/contact/page.tsx`
- Form submits but has no backend
- [ ] Create API route `src/app/api/contact/route.ts`
- [ ] Send email via nodemailer, SendGrid, or similar
- [ ] Or integrate with WordPress contact form plugin

### Wholesale Application Form
File: `src/app/wholesale/page.tsx`
- Form submits to `POST /api/wholesale-inquiry` and stores the inquiry in WooCommerce (Customer meta)
- [ ] Configure `WOOCOMMERCE_CONSUMER_KEY` / `WOOCOMMERCE_CONSUMER_SECRET` in production
- [ ] (Optional) Send notification email to staff on submission

### Order Confirmation Emails
- [ ] Configure WooCommerce to send order confirmation emails
- [ ] Or implement custom email sending in checkout flow

---

## 7. ANALYTICS

### Google Analytics 4
- [ ] Get GA4 Measurement ID (G-XXXXXXXXXX)
- [ ] Add to `.env.local` as `NEXT_PUBLIC_GA_ID`
- [ ] Add GA script to `src/app/layout.tsx`

#### Implementation
Add to `src/app/layout.tsx` in `<head>`:
```tsx
{process.env.NEXT_PUBLIC_GA_ID && (
  <>
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
      strategy="afterInteractive"
    />
    <Script id="google-analytics" strategy="afterInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
      `}
    </Script>
  </>
)}
```

### E-commerce Tracking (Optional)
- [ ] Implement GA4 e-commerce events (view_item, add_to_cart, purchase, etc.)

---

## 8. MISSING PAGES TO CREATE

These pages are referenced in navigation but don't exist:

### High Priority
| Page | URL | Description |
|------|-----|-------------|
| Forgot Password | `/forgot-password` | Password reset flow |
| Returns Policy | `/returns` | Return policy page (or redirect to /shipping) |

### Medium Priority
| Page | URL | Description |
|------|-----|-------------|
| Rewards Program | `/rewards` | Loyalty program info |
| Franchise Info | `/franchise` | Franchise opportunities |
| 24 Hour Gym | `/gym` | Gym information/hours |
| Payment Methods | `/account/payment` | Saved payment methods |
| Wholesale Application | `/wholesale/apply` | ✅ Redirects to `/wholesale#apply` (no 404) |
| Wholesale Account | `/account/wholesale` | ✅ Redirects to `/login?callbackUrl=/shop` (no 404) |

### Navigation Files to Update
If pages won't be created, remove links from:
- `src/lib/navigation.ts` - Main navigation data
- `src/components/layout/Footer.tsx` - Footer links

---

## 9. INCOMPLETE FEATURES

### Address Form Modal
File: `src/app/account/addresses/page.tsx`
- Lines 283-295: "Address form will be implemented here"
- [ ] Create address form with validation
- [ ] Connect to WooCommerce Customer address API
- [ ] Implement add/edit/delete functionality

### Google Maps Integration
File: `src/app/contact/page.tsx`
- Line 432: "Interactive Map Coming Soon"
- Line 435: "Google Maps integration will be added here"
- [ ] Get Google Maps API key
- [ ] Add `@react-google-maps/api` package
- [ ] Implement map with store locations

### Wishlist Backend Sync
Currently uses local mock data only.
- [ ] Decide if wishlist needs backend persistence
- [ ] If yes, create API for wishlist CRUD operations

### Order Tracking
Currently shows mock orders.
- [ ] Fetch real orders from WooCommerce
- [ ] Implement tracking number display
- [ ] Link to carrier tracking pages

### TODO Comments in Code
| File | Line | Comment |
|------|------|---------|
| `src/components/layout/Header/TopBar.tsx` | 21 | `// TODO: Get from cart store` |

---

## 10. IMAGES TO ADD

### Product Images
Current placeholder function in `src/lib/mock/products.ts` generates placeholder URLs.
- [ ] Upload real product images to WordPress media library
- [ ] Ensure WooCommerce products have proper images
- [ ] Images will come from GraphQL once connected

### Placeholder Image Fallback
File: `src/components/product/ProductGallery.tsx`
- Line 57: Fallback path `/images/products/placeholder.jpg`
- [ ] Create `/public/images/products/placeholder.jpg` fallback image

### Brand Logos (Optional)
If displaying brand logos:
- [ ] Upload brand logos to `/public/images/brands/`
- [ ] Or fetch from WooCommerce brand taxonomy

---

## 11. URLS TO VERIFY

### Social Media Links
File: `src/lib/navigation.ts` (lines 243-245)
- [ ] Verify Facebook URL: `https://facebook.com/naturallyfit`
- [ ] Verify Instagram URL: `https://instagram.com/naturallyfit`
- [ ] Verify Twitter URL: `https://twitter.com/naturallyfit`

### Brand Website Links
File: `src/lib/mock/brands.ts`
- Mock brand data includes website URLs
- [ ] These will be replaced with real data from WooCommerce

### Production URL
File: `src/app/layout.tsx` (line 50)
- Hardcoded: `https://naturallyfit.ca`
- [ ] Verify this is correct production URL

---

## 12. SECURITY CHECKLIST

### Before Launch
- [ ] Change `NEXTAUTH_SECRET` to production value
- [ ] Remove/disable development login hints in `src/components/auth/LoginForm.tsx`
- [ ] Ensure no test credentials in production code
- [ ] Enable HTTPS on production server
- [ ] Configure proper CORS settings if needed
- [ ] Review CSP (Content Security Policy) headers

### Stripe Security
- [ ] Use Stripe Elements (never handle raw card data)
- [ ] Store only Stripe customer/payment method IDs
- [ ] Use webhook signatures for payment events

### Authentication
- [ ] Use secure, httpOnly cookies for session
- [ ] Implement rate limiting on login endpoint
- [ ] Add CSRF protection

---

## QUICK START CHECKLIST

For the absolute minimum to go live:

1. [ ] Set production environment variables
2. [ ] Generate secure `NEXTAUTH_SECRET`
3. [ ] Set `NEXT_PUBLIC_USE_MOCK_DATA=false`
4. [ ] Implement GraphQL product fetching
5. [ ] Implement WooCommerce authentication
6. [ ] Implement Stripe payment processing
7. [ ] Connect cart/checkout to WooCommerce
8. [ ] Add real product images
9. [ ] Test full checkout flow
10. [ ] Deploy to production

---

*Last Updated: January 31, 2026*
