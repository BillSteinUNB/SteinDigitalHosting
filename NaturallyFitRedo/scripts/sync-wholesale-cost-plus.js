#!/usr/bin/env node
/**
 * Backfill/sync WholesaleX price meta for all WooCommerce products.
 *
 * Rule:
 *   wholesale_price = my_cost * (1 + markupPercent/100)
 *
 * Usage:
 *   node scripts/sync-wholesale-cost-plus.js --dry-run
 *   node scripts/sync-wholesale-cost-plus.js --apply
 *   node scripts/sync-wholesale-cost-plus.js --apply --markup=20
 *   node scripts/sync-wholesale-cost-plus.js --apply --cost-key=_wc_cog_cost
 *   node scripts/sync-wholesale-cost-plus.js --apply --wholesale-key=wholesalex_b2b_role_123_base_price
 */

/* eslint-disable no-console */

const DEFAULT_MARKUP_PERCENT = 20;
const PER_PAGE = 100;
const WHOLESALE_KEY_PATTERN = /^wholesalex_b2b_role_\d+_base_price$/i;
const COST_KEY_CANDIDATES = [
  "mycost",
  "_mycost",
  "_my_cost",
  "cost",
  "_cost",
  "_wc_cog_cost",
  "wc_cog_cost",
  "_alg_wc_cog_cost",
  "alg_wc_cog_cost",
];

function parseArgs(argv) {
  const args = {
    dryRun: true,
    apply: false,
    markup: DEFAULT_MARKUP_PERCENT,
    costKey: process.env.MY_COST_META_KEY || "",
    wholesaleKey: process.env.WHOLESALEX_PRICE_META_KEY || "",
    onlyMissing: false,
  };

  for (const raw of argv) {
    if (raw === "--dry-run") {
      args.dryRun = true;
      args.apply = false;
      continue;
    }
    if (raw === "--apply") {
      args.apply = true;
      args.dryRun = false;
      continue;
    }
    if (raw === "--only-missing") {
      args.onlyMissing = true;
      continue;
    }
    if (raw.startsWith("--markup=")) {
      const n = Number(raw.split("=")[1]);
      if (!Number.isFinite(n) || n < 0) {
        throw new Error(`Invalid markup value: ${raw}`);
      }
      args.markup = n;
      continue;
    }
    if (raw.startsWith("--cost-key=")) {
      args.costKey = raw.split("=")[1] || "";
      continue;
    }
    if (raw.startsWith("--wholesale-key=")) {
      args.wholesaleKey = raw.split("=")[1] || "";
      continue;
    }
    if (raw === "--help" || raw === "-h") {
      printHelp();
      process.exit(0);
    }
  }

  return args;
}

function printHelp() {
  console.log(`
sync-wholesale-cost-plus.js

Required environment variables:
  WOOCOMMERCE_REST_URL
  WOOCOMMERCE_CONSUMER_KEY
  WOOCOMMERCE_CONSUMER_SECRET

Optional environment variables:
  MY_COST_META_KEY
  WHOLESALEX_PRICE_META_KEY

Flags:
  --dry-run            Preview changes only (default)
  --apply              Write changes to WooCommerce
  --markup=20          Markup percent over MyCost
  --cost-key=<key>     Override cost meta key detection
  --wholesale-key=<k>  Override WholesaleX meta key detection
  --only-missing       Only set wholesale meta when it is currently missing
`);
}

function getEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function createWooClient() {
  const baseUrl = getEnv("WOOCOMMERCE_REST_URL").replace(/\/+$/, "");
  const key = getEnv("WOOCOMMERCE_CONSUMER_KEY");
  const secret = getEnv("WOOCOMMERCE_CONSUMER_SECRET");
  const authHeader = `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}`;

  async function request(path, init = {}) {
    const url = `${baseUrl}/wp-json/wc/v3${path}`;
    const res = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
        ...(init.headers || {}),
      },
    });
    const text = await res.text();
    const data = text ? tryParseJson(text) : null;
    if (!res.ok) {
      const msg = data && typeof data.message === "string" ? data.message : text || `HTTP ${res.status}`;
      throw new Error(`Woo API error ${res.status}: ${msg}`);
    }
    return data;
  }

  return { request };
}

function tryParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function parseMetaNumber(metaValue) {
  if (metaValue === null || metaValue === undefined) return null;
  const parsed = Number(String(metaValue).replace(/[^0-9.-]/g, ""));
  if (!Number.isFinite(parsed)) return null;
  return parsed;
}

function roundMoney(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function findMeta(metaData, key) {
  return (metaData || []).find((m) => m && m.key === key);
}

function getMetaValue(metaData, key) {
  const meta = findMeta(metaData, key);
  return meta ? meta.value : undefined;
}

function findWholesaleKey(metaData) {
  for (const m of metaData || []) {
    if (m && typeof m.key === "string" && WHOLESALE_KEY_PATTERN.test(m.key)) {
      return m.key;
    }
  }
  return null;
}

function findCostKey(metaData, preferredKey) {
  if (preferredKey) {
    const preferred = findMeta(metaData, preferredKey);
    if (preferred && parseMetaNumber(preferred.value) !== null) {
      return preferredKey;
    }
  }

  for (const key of COST_KEY_CANDIDATES) {
    const value = getMetaValue(metaData, key);
    if (parseMetaNumber(value) !== null) {
      return key;
    }
  }

  return null;
}

async function fetchAllProducts(woo) {
  const products = [];
  let page = 1;

  while (true) {
    const batch = await woo.request(`/products?per_page=${PER_PAGE}&page=${page}&status=any`);
    if (!Array.isArray(batch) || batch.length === 0) break;
    products.push(...batch);
    if (batch.length < PER_PAGE) break;
    page += 1;
  }

  return products;
}

async function fetchAllVariations(woo, productId) {
  const variations = [];
  let page = 1;

  while (true) {
    const batch = await woo.request(
      `/products/${productId}/variations?per_page=${PER_PAGE}&page=${page}&status=any`
    );
    if (!Array.isArray(batch) || batch.length === 0) break;
    variations.push(...batch);
    if (batch.length < PER_PAGE) break;
    page += 1;
  }

  return variations;
}

function buildMetaUpdate(metaData, key, value) {
  const existing = findMeta(metaData, key);
  if (existing && existing.id) {
    return [{ id: existing.id, key, value: String(value) }];
  }
  return [{ key, value: String(value) }];
}

function formatMoney(n) {
  return roundMoney(n).toFixed(2);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const woo = createWooClient();

  console.log(`Mode: ${args.dryRun ? "DRY RUN" : "APPLY"}`);
  console.log(`Markup: ${args.markup}%`);

  const products = await fetchAllProducts(woo);
  console.log(`Loaded ${products.length} products`);

  let detectedWholesaleKey = args.wholesaleKey || "";
  let detectedCostKey = args.costKey || "";

  for (const p of products) {
    if (!detectedWholesaleKey) {
      const key = findWholesaleKey(p.meta_data || []);
      if (key) detectedWholesaleKey = key;
    }
    if (!detectedCostKey) {
      const key = findCostKey(p.meta_data || [], "");
      if (key) detectedCostKey = key;
    }
    if (detectedWholesaleKey && detectedCostKey) break;
  }

  if (!detectedWholesaleKey) {
    throw new Error(
      "Could not detect WholesaleX meta key. Pass --wholesale-key=<key>."
    );
  }

  if (!detectedCostKey) {
    throw new Error(
      "Could not detect cost meta key. Pass --cost-key=<key> (for example _wc_cog_cost or mycost)."
    );
  }

  console.log(`Wholesale key: ${detectedWholesaleKey}`);
  console.log(`Cost key: ${detectedCostKey}`);

  const stats = {
    simpleReviewed: 0,
    simpleMissingCost: 0,
    simpleNeedsUpdate: 0,
    simpleUpdated: 0,
    variationReviewed: 0,
    variationMissingCost: 0,
    variationNeedsUpdate: 0,
    variationUpdated: 0,
  };

  for (const product of products) {
    const type = (product.type || "").toLowerCase();
    if (type === "variable") {
      const variations = await fetchAllVariations(woo, product.id);
      for (const variation of variations) {
        stats.variationReviewed += 1;
        const cost = parseMetaNumber(getMetaValue(variation.meta_data, detectedCostKey));
        if (cost === null) {
          stats.variationMissingCost += 1;
          continue;
        }

        const desired = roundMoney(cost * (1 + args.markup / 100));
        const current = parseMetaNumber(
          getMetaValue(variation.meta_data, detectedWholesaleKey)
        );
        const needsUpdate = current === null || Math.abs(current - desired) > 0.009;
        if (!needsUpdate) continue;
        if (args.onlyMissing && current !== null) continue;

        stats.variationNeedsUpdate += 1;
        if (!args.dryRun) {
          const payload = {
            meta_data: buildMetaUpdate(variation.meta_data, detectedWholesaleKey, formatMoney(desired)),
          };
          await woo.request(`/products/${product.id}/variations/${variation.id}`, {
            method: "PUT",
            body: JSON.stringify(payload),
          });
          stats.variationUpdated += 1;
        }
      }
      continue;
    }

    stats.simpleReviewed += 1;
    const cost = parseMetaNumber(getMetaValue(product.meta_data, detectedCostKey));
    if (cost === null) {
      stats.simpleMissingCost += 1;
      continue;
    }

    const desired = roundMoney(cost * (1 + args.markup / 100));
    const current = parseMetaNumber(getMetaValue(product.meta_data, detectedWholesaleKey));
    const needsUpdate = current === null || Math.abs(current - desired) > 0.009;
    if (!needsUpdate) continue;
    if (args.onlyMissing && current !== null) continue;

    stats.simpleNeedsUpdate += 1;
    if (!args.dryRun) {
      const payload = {
        meta_data: buildMetaUpdate(product.meta_data, detectedWholesaleKey, formatMoney(desired)),
      };
      await woo.request(`/products/${product.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      stats.simpleUpdated += 1;
    }
  }

  console.log("");
  console.log("Summary:");
  console.log(`  simple reviewed:        ${stats.simpleReviewed}`);
  console.log(`  simple missing cost:    ${stats.simpleMissingCost}`);
  console.log(`  simple needs update:    ${stats.simpleNeedsUpdate}`);
  console.log(`  simple updated:         ${stats.simpleUpdated}`);
  console.log(`  variations reviewed:    ${stats.variationReviewed}`);
  console.log(`  variations missing cost:${stats.variationMissingCost}`);
  console.log(`  variations needs update:${stats.variationNeedsUpdate}`);
  console.log(`  variations updated:     ${stats.variationUpdated}`);

  if (args.dryRun) {
    console.log("");
    console.log("Dry run complete. Re-run with --apply to write changes.");
  }
}

main().catch((err) => {
  console.error("");
  console.error("[sync-wholesale-cost-plus] Failed:");
  console.error(err && err.message ? err.message : err);
  process.exit(1);
});
