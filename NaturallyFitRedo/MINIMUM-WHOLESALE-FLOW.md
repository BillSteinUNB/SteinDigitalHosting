# Minimum Wholesale Flow (WooCommerce + WholesaleX + ClickShip)

This is the fastest stable setup for go-live:
- Use Next.js as the marketing/catalog entrypoint and login/wholesale pricing UI.
- Use WordPress/WooCommerce for shipping and payment.
- Let ClickShip run inside WooCommerce checkout/shipping methods.

## 1) Required Environment Variables (Vercel)

Set these in Vercel Project Settings:

```env
NEXT_PUBLIC_WORDPRESS_URL=https://wp.naturallyfit.ca
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://wp.naturallyfit.ca/graphql

WOOCOMMERCE_REST_URL=https://wp.naturallyfit.ca
WOOCOMMERCE_CONSUMER_KEY=ck_...
WOOCOMMERCE_CONSUMER_SECRET=cs_...
WOO_HANDOFF_SECRET=replace-with-long-random-secret

NEXT_PUBLIC_WHOLESALE_LOGIN_URL=/wholesale/login
NEXT_PUBLIC_WHOLESALE_ORDER_URL=/shop
```

If you want wholesale login or ordering to happen on WordPress instead, override these URLs accordingly.

## 2A) Install Cart Handoff Endpoint in WordPress

1. Copy `WP-CART-HANDOFF-PLUGIN.php` into a new plugin folder in WordPress, then activate it.
2. In `wp-config.php`, add:

```php
define('NF_WOO_HANDOFF_SECRET', 'same-value-as-WOO_HANDOFF_SECRET-in-vercel');
```

3. Keep endpoint URL as default:

`https://wp.naturallyfit.ca/wp-admin/admin-post.php?action=nf_cart_handoff`

The frontend now posts signed cart payloads to that endpoint, and WordPress redirects to Woo checkout.

## 2B) Install Automatic Wholesale Cost Sync Hook

1. Copy `WP-WHOLESALE-COST-HOOK-PLUGIN.php` into a new plugin folder in WordPress, then activate it.
2. In `wp-config.php`, set these constants:

```php
define('NF_WHOLESALE_MARKUP_PERCENT', 20);
define('NF_WHOLESALE_COST_META_KEY', 'mycost'); // change if your cost field key differs
define('NF_WHOLESALEX_PRICE_META_KEY', 'wholesalex_b2b_role_1770160918371_base_price');
```

3. Save any product (or run a bulk quick edit) to trigger sync.

What it does:
- On product save and variation save, sets wholesale price meta = `MyCost * 1.20`.
- Also updates when the cost meta key changes.
- Falls back to parent product cost for variations if variation cost is empty.

## 2) WordPress / WooCommerce Setup

1. Ensure products are published and visible to wholesale users.
2. In WholesaleX:
   1. Confirm wholesale role name (usually `wholesale_customer`).
   2. Confirm wholesale pricing rules are active.
   3. Confirm approved users can log in and see wholesale prices.
3. In WooCommerce:
   1. Confirm checkout works on WordPress domain.
   2. Confirm payment gateway (Stripe) is enabled and tested.

## 3) ClickShip Setup (inside WooCommerce)

1. Install/activate ClickShip plugin in WordPress.
2. Connect ClickShip account/API key.
3. Configure shipping origin address.
4. Enable shipping services and package defaults.
5. Add/enable the ClickShip shipping method in Woo shipping zones.
6. Run a test checkout in WordPress and confirm live rates appear.
7. Place a test order and confirm label + tracking generation flow.

## 4) User Flow After These Changes

1. User clicks wholesale login from Next.js.
2. `/wholesale/login` redirects to WooCommerce `my-account`.
3. User logs in through WholesaleX/Woo.
4. User clicks wholesale order.
5. `/wholesale/shop` redirects to Woo shop/WholesaleX order page.
6. Cart + checkout + shipping rates + payment run in WooCommerce (ClickShip + Stripe).

## 5) Recommended Test Checklist

1. Wholesale user login succeeds.
2. Wholesale pricing is visible after login.
3. Add to cart and reach Woo checkout.
4. ClickShip rates load at checkout.
5. Stripe payment succeeds.
6. Order appears in Woo admin with expected shipping method and totals.

## 6) Backfill Wholesale Price Meta From MyCost (+20%)

If products show wholesale UI but the same retail value, wholesale meta may not be populated on all products.

Run an audit first:

```bash
node scripts/sync-wholesale-cost-plus.js --dry-run
```

Then write values:

```bash
node scripts/sync-wholesale-cost-plus.js --apply --markup=20
```

Required env vars:
- `WOOCOMMERCE_REST_URL`
- `WOOCOMMERCE_CONSUMER_KEY`
- `WOOCOMMERCE_CONSUMER_SECRET`

Optional flags:
- `--cost-key=<meta_key>` to force your `MyCost` field key
- `--wholesale-key=wholesalex_b2b_role_<id>_base_price` to force WholesaleX key
- `--only-missing` to only fill missing wholesale values
