export const DEFAULT_WORDPRESS_URL = 'https://slategray-squirrel-389391.hostingersite.com';

const LEGACY_WORDPRESS_URLS = [
  'https://nftest.dreamhosters.com',
  'http://nftest.dreamhosters.com',
  'https://naturallyfit.ca',
  'http://naturallyfit.ca',
  'https://www.naturallyfit.ca',
  'http://www.naturallyfit.ca',
];

function normalizeSourceUrl(url: string): string {
  const trimmed = url.trim();

  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }

  return trimmed;
}

function normalizeBaseUrl(url: string): string {
  if (!url) {
    return DEFAULT_WORDPRESS_URL;
  }

  return url.replace(/\/+$/, '');
}

export function getWordPressBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || '';
  return normalizeBaseUrl(normalizeSourceUrl(envUrl));
}

export function getWordPressGraphqlUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || '';
  if (envUrl) {
    return normalizeBaseUrl(normalizeSourceUrl(envUrl));
  }

  return `${getWordPressBaseUrl()}/graphql`;
}

export function wpAsset(path: string): string {
  const base = getWordPressBaseUrl();
  const trimmedPath = path.replace(/^\/+/, '');
  return `${base}/wp-content/uploads/${trimmedPath}`;
}

export function replaceWordPressBase(url: string): string {
  const base = getWordPressBaseUrl();

  if (!url) {
    return url;
  }

  const normalized = normalizeBaseUrl(normalizeSourceUrl(url));
  const httpBase = base.startsWith('https://') ? `http://${base.slice(8)}` : base;

  if (normalized.startsWith(base)) {
    return normalized;
  }

  if (normalized.startsWith(httpBase)) {
    return normalized.replace(httpBase, base);
  }
  const legacyBases = LEGACY_WORDPRESS_URLS;

  for (const legacyBase of legacyBases) {
    if (normalized.startsWith(legacyBase)) {
      return normalized.replace(legacyBase, base);
    }
  }

  return url;
}

export function isWordPressImageUrl(url: string): boolean {
  if (!url) {
    return false;
  }

  const base = getWordPressBaseUrl();
  const httpBase = base.startsWith('https://') ? `http://${base.slice(8)}` : base;
  const legacyBases = [...LEGACY_WORDPRESS_URLS, base, httpBase];
  const normalized = normalizeBaseUrl(normalizeSourceUrl(url));
  return legacyBases.some((origin) => normalized.startsWith(origin));
}
