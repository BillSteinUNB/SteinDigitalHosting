#!/usr/bin/env node
/**
 * Audit wholesale price coverage for WooCommerce products and variations.
 *
 * Usage:
 *   node scripts/audit-wholesale-prices.js
 *   node scripts/audit-wholesale-prices.js --json
 *   node scripts/audit-wholesale-prices.js --csv
 *   node scripts/audit-wholesale-prices.js --list-missing
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

const STATUS = {
  COMPLETE: "complete",
  FIXABLE: "fixable",
  MISSING_COST: "missing_cost",
};

function parseArgs(argv) {
  const args = {
    markup: DEFAULT_MARKUP_PERCENT,
    costKey: process.env.MY_COST_META_KEY || "",
    wholesaleKey: process.env.WHOLESALEX_PRICE_META_KEY || "",
    json: false,
    csv: false,
    listMissing: false,
  };

  for (const raw of argv) {
    if (raw === "--json") {
      args.json = true;
      continue;
    }
    if (raw === "--csv") {
      args.csv = true;
      continue;
    }
    if (raw === "--list-missing") {
      args.listMissing = true;
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

  if (args.json && args.csv) {
    throw new Error("Use either --json or --csv, not both.");
  }

  return args;
}

function printHelp() {
  console.log(`
audit-wholesale-prices.js

Required environment variables:
  WOOCOMMERCE_REST_URL
  WOOCOMMERCE_CONSUMER_KEY
  WOOCOMMERCE_CONSUMER_SECRET

Optional environment variables:
  MY_COST_META_KEY
  WHOLESALEX_PRICE_META_KEY

Flags:
  --json                Output JSON report
  --csv                 Output CSV rows
  --list-missing        Console report only: list missing-cost items in detail
  --markup=20           Markup percent over cost (default 20)
  --cost-key=<key>      Override cost meta key detection
  --wholesale-key=<k>   Override WholesaleX meta key detection
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
      const msg =
        data && typeof data.message === "string"
          ? data.message
          : text || `HTTP ${res.status}`;
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

function formatMoney(n) {
  if (n === null || n === undefined) return "(none)";
  return `$${roundMoney(Number(n)).toFixed(2)}`;
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

function classifyMeta(metaData, costKey, wholesaleKey, markupPercent) {
  const cost = parseMetaNumber(getMetaValue(metaData, costKey));
  const wholesale = parseMetaNumber(getMetaValue(metaData, wholesaleKey));

  if (cost === null) {
    return {
      status: STATUS.MISSING_COST,
      reason: "No cost meta found",
      cost: null,
      currentWholesale: wholesale,
      expectedWholesale: null,
    };
  }

  const expectedWholesale = roundMoney(cost * (1 + markupPercent / 100));
  if (wholesale === null) {
    return {
      status: STATUS.FIXABLE,
      reason: "Missing wholesale price",
      cost,
      currentWholesale: null,
      expectedWholesale,
    };
  }

  if (Math.abs(wholesale - expectedWholesale) > 0.01) {
    return {
      status: STATUS.FIXABLE,
      reason: `Incorrect wholesale: ${wholesale} vs expected ${expectedWholesale}`,
      cost,
      currentWholesale: wholesale,
      expectedWholesale,
    };
  }

  return {
    status: STATUS.COMPLETE,
    reason: "Wholesale price matches expected",
    cost,
    currentWholesale: wholesale,
    expectedWholesale,
  };
}

function padLeft(value, len) {
  return String(value).padStart(len, " ");
}

function percent(part, total) {
  if (!total) return "0%";
  return `${Math.round((part / total) * 100)}%`;
}

function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsv(rows) {
  const header = [
    "entityType",
    "id",
    "parentId",
    "productType",
    "sku",
    "name",
    "status",
    "reason",
    "cost",
    "currentWholesale",
    "expectedWholesale",
  ];
  const lines = [header.join(",")];
  for (const row of rows) {
    lines.push(
      [
        row.entityType,
        row.id,
        row.parentId || "",
        row.productType || "",
        row.sku || "",
        row.name || "",
        row.status,
        row.reason || "",
        row.cost ?? "",
        row.currentWholesale ?? "",
        row.expectedWholesale ?? "",
      ]
        .map(csvEscape)
        .join(",")
    );
  }
  return lines.join("\n");
}

function printConsoleReport(report, args) {
  const { generatedAt, config, summary, missingCostProducts, fixableProducts } = report;
  const total = summary.totalProducts + summary.totalVariations;
  const totalComplete = summary.complete.products + summary.complete.variations;
  const totalFixable = summary.fixable.products + summary.fixable.variations;
  const totalMissing = summary.missingCost.products + summary.missingCost.variations;

  console.log("=".repeat(80));
  console.log("                    WHOLESALE PRICE AUDIT REPORT");
  console.log("=".repeat(80));
  console.log(`Generated: ${generatedAt}`);
  console.log(`Markup: ${config.markupPercent}%`);
  console.log("Detected Keys:");
  console.log(`  Cost Key:      ${config.costKey}`);
  console.log(`  Wholesale Key: ${config.wholesaleKey}`);
  console.log("-".repeat(80));
  console.log("                              SUMMARY");
  console.log("-".repeat(80));
  console.log(
    `                          Products    Variations    Total`
  );
  console.log(
    `Complete                ${padLeft(summary.complete.products, 9)}    ${padLeft(summary.complete.variations, 10)}    ${padLeft(totalComplete, 5)} (${percent(
      totalComplete,
      total
    )})`
  );
  console.log(
    `Fixable                 ${padLeft(summary.fixable.products, 9)}    ${padLeft(summary.fixable.variations, 10)}    ${padLeft(totalFixable, 5)} (${percent(
      totalFixable,
      total
    )})`
  );
  console.log(
    `Missing Cost            ${padLeft(summary.missingCost.products, 9)}    ${padLeft(summary.missingCost.variations, 10)}    ${padLeft(totalMissing, 5)} (${percent(
      totalMissing,
      total
    )})`
  );
  console.log("-".repeat(80));
  console.log(
    `TOTAL                   ${padLeft(summary.totalProducts, 9)}    ${padLeft(summary.totalVariations, 10)}    ${padLeft(total, 5)}`
  );
  console.log("-".repeat(80));

  if (args.listMissing) {
    console.log("                    PRODUCTS MISSING COST DATA");
    console.log("-".repeat(80));
    if (missingCostProducts.length === 0) {
      console.log("No products or variations are missing cost data.");
    } else {
      for (const item of missingCostProducts) {
        const label =
          item.entityType === "variation"
            ? `Variation ID: ${item.id} (Parent: ${item.parentId})`
            : `Product ID: ${item.id}`;
        const sku = item.sku ? `SKU: ${item.sku}` : "SKU: (none)";
        console.log(`  ${label}  ${sku}  Name: ${item.name}`);
      }
    }
    console.log("-".repeat(80));
  }

  console.log("                    FIXABLE PRODUCTS (Preview)");
  console.log("-".repeat(80));
  console.log(
    "These products have cost data but missing/incorrect wholesale prices."
  );
  console.log("Run `node scripts/sync-wholesale-cost-plus.js --apply` to fix.");
  if (fixableProducts.length === 0) {
    console.log("No fixable products found.");
  } else {
    console.log("First 10 fixable entries:");
    for (const item of fixableProducts.slice(0, 10)) {
      const idLabel =
        item.entityType === "variation"
          ? `Variation ID: ${item.id} (Parent: ${item.parentId})`
          : `Product ID: ${item.id}`;
      console.log(
        `  ${idLabel}  Cost: ${formatMoney(item.cost)}  Current: ${formatMoney(
          item.currentWholesale
        )}  Expected: ${formatMoney(item.expectedWholesale)}`
      );
    }
  }
  console.log("=".repeat(80));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const woo = createWooClient();
  const generatedAt = new Date().toISOString();

  const products = await fetchAllProducts(woo);
  const variationMap = new Map();
  const errors = [];

  let detectedWholesaleKey = args.wholesaleKey || "";
  let detectedCostKey = args.costKey || "";
  let totalVariations = 0;

  for (const product of products) {
    const productMeta = product.meta_data || [];
    if (!detectedWholesaleKey) {
      const k = findWholesaleKey(productMeta);
      if (k) detectedWholesaleKey = k;
    }
    if (!detectedCostKey) {
      const k = findCostKey(productMeta, "");
      if (k) detectedCostKey = k;
    }

    if ((product.type || "").toLowerCase() !== "variable") {
      continue;
    }

    try {
      const variations = await fetchAllVariations(woo, product.id);
      variationMap.set(product.id, variations);
      totalVariations += variations.length;

      if (!detectedWholesaleKey || !detectedCostKey) {
        for (const variation of variations) {
          const meta = variation.meta_data || [];
          if (!detectedWholesaleKey) {
            const wholesaleKey = findWholesaleKey(meta);
            if (wholesaleKey) detectedWholesaleKey = wholesaleKey;
          }
          if (!detectedCostKey) {
            const costKey = findCostKey(meta, "");
            if (costKey) detectedCostKey = costKey;
          }
          if (detectedWholesaleKey && detectedCostKey) break;
        }
      }
    } catch (err) {
      const message = err && err.message ? err.message : String(err);
      errors.push({
        type: "variation_fetch_error",
        productId: product.id,
        productName: product.name || "",
        message,
      });
      variationMap.set(product.id, []);
    }
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

  const summary = {
    totalProducts: products.length,
    totalVariations,
    complete: { products: 0, variations: 0 },
    fixable: { products: 0, variations: 0 },
    missingCost: { products: 0, variations: 0 },
  };

  const detailRows = [];
  const missingCostProducts = [];
  const fixableProducts = [];

  for (const product of products) {
    const type = (product.type || "").toLowerCase();
    const baseRow = {
      sku: product.sku || "",
      name: product.name || "",
      productType: type || "simple",
    };

    if (type === "variable") {
      const variations = variationMap.get(product.id) || [];

      if (variations.length === 0) {
        const row = {
          entityType: "product",
          id: product.id,
          parentId: "",
          ...baseRow,
          status: STATUS.MISSING_COST,
          reason: "No variation data loaded",
          cost: null,
          currentWholesale: null,
          expectedWholesale: null,
        };
        detailRows.push(row);
        summary.missingCost.products += 1;
        missingCostProducts.push(row);
        continue;
      }

      let fixableCount = 0;
      let missingCostCount = 0;

      for (const variation of variations) {
        const result = classifyMeta(
          variation.meta_data || [],
          detectedCostKey,
          detectedWholesaleKey,
          args.markup
        );

        const vRow = {
          entityType: "variation",
          id: variation.id,
          parentId: product.id,
          productType: "variation",
          sku: variation.sku || "",
          name: variation.name || product.name || "",
          status: result.status,
          reason: result.reason,
          cost: result.cost,
          currentWholesale: result.currentWholesale,
          expectedWholesale: result.expectedWholesale,
        };
        detailRows.push(vRow);

        if (result.status === STATUS.COMPLETE) summary.complete.variations += 1;
        if (result.status === STATUS.FIXABLE) {
          summary.fixable.variations += 1;
          fixableCount += 1;
          fixableProducts.push(vRow);
        }
        if (result.status === STATUS.MISSING_COST) {
          summary.missingCost.variations += 1;
          missingCostCount += 1;
          missingCostProducts.push(vRow);
        }
      }

      let productStatus = STATUS.COMPLETE;
      let productReason = "All variations complete";
      if (fixableCount > 0) {
        productStatus = STATUS.FIXABLE;
        productReason = `${fixableCount}/${variations.length} variations missing or incorrect wholesale`;
        summary.fixable.products += 1;
      } else if (missingCostCount > 0) {
        productStatus = STATUS.MISSING_COST;
        productReason = `${missingCostCount}/${variations.length} variations missing cost`;
        summary.missingCost.products += 1;
      } else {
        summary.complete.products += 1;
      }

      detailRows.push({
        entityType: "product",
        id: product.id,
        parentId: "",
        ...baseRow,
        status: productStatus,
        reason: productReason,
        cost: null,
        currentWholesale: null,
        expectedWholesale: null,
      });

      continue;
    }

    const result = classifyMeta(
      product.meta_data || [],
      detectedCostKey,
      detectedWholesaleKey,
      args.markup
    );
    const row = {
      entityType: "product",
      id: product.id,
      parentId: "",
      ...baseRow,
      status: result.status,
      reason: result.reason,
      cost: result.cost,
      currentWholesale: result.currentWholesale,
      expectedWholesale: result.expectedWholesale,
    };
    detailRows.push(row);

    if (result.status === STATUS.COMPLETE) summary.complete.products += 1;
    if (result.status === STATUS.FIXABLE) {
      summary.fixable.products += 1;
      fixableProducts.push(row);
    }
    if (result.status === STATUS.MISSING_COST) {
      summary.missingCost.products += 1;
      missingCostProducts.push(row);
    }
  }

  const report = {
    generatedAt,
    config: {
      markupPercent: args.markup,
      costKey: detectedCostKey,
      wholesaleKey: detectedWholesaleKey,
    },
    summary,
    missingCostProducts,
    fixableProducts,
    errors,
    details: detailRows,
  };

  if (args.json) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  if (args.csv) {
    const rows = args.listMissing
      ? detailRows.filter((row) => row.status === STATUS.MISSING_COST)
      : detailRows;
    console.log(toCsv(rows));
    return;
  }

  printConsoleReport(report, args);
}

main().catch((err) => {
  console.error("");
  console.error("[audit-wholesale-prices] Failed:");
  console.error(err && err.message ? err.message : err);
  process.exit(1);
});
