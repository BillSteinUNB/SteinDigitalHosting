# WordPress Banner Integration Fix - AI Agent Prompt

## Problem Summary
Hero banners from WordPress custom post type are not displaying on the Next.js homepage. Instead, a hardcoded fallback (Mammoth banner) shows. Product banners (Discover Products section) ARE working correctly with 13 banners.

## Architecture

### WordPress Setup
- **Host:** https://slategray-squirrel-389391.hostingersite.com
- **Plugin:** SteinDigital_BannerPlugin (custom post type "banners")
- **Post Type:** `banners` (REST API enabled at `/wp-json/wp/v2/banners`)
- **Taxonomy:** `banner_type` with terms:
  - `hero-slide` (ID: 456) - NOT WORKING
  - `mini-banner-1` (ID: 458)
  - `mini-banner-2` (ID: 459)  
  - `mini-banner-3` (ID: 460)
  - `mini-banner-4` (ID: 461)
  - `discover-product` (ID: 492) - WORKING (13 banners)

### Banner Data Structure
```typescript
interface Banner {
  id: number;
  title: string;
  imageUrl: string;
  link: string;
  alt: string;
  type: BannerType;
  order: number;
}
```

### WordPress API Response
- REST endpoint: `GET /wp-json/wp/v2/banners?per_page=100&status=publish`
- Returns: Array of banners with `banner_type` (array of IDs), `featured_image_url`, `meta.banner_link`
- Images stored flat in `/wp-content/uploads/` (no year/month subfolders)

## Current State

### What's Working
✅ **Product Banners (discover-product type)**
- 13 banners successfully fetched and displayed
- Carousel works with auto-scroll
- Images load correctly

### What's Broken
❌ **Hero Banners (hero-slide type)**
- 5 banners exist in WordPress (IDs: 5603, 5606, 5607, 5608, 5609)
- API returns them correctly with featured_image_url
- But Next.js shows fallback instead: `defaultHeroSlides` (Mammoth banner)

## Code Structure

### File: `src/lib/wordpress/banners.ts`
Key functions:
- `getBanners()` - Fetches all banners, maps banner_type ID to slug
- `getHeroSlides()` - Calls `getBannersByType('hero-slide')`
- `getProductBanners()` - Calls `getBannersByType('discover-product')` ✅ Works
- URL rewriting: Old paths `/2026/02/` converted to flat `/`

### File: `src/app/page.tsx`
```typescript
const [wpHeroSlides, wpMiniBanners, wpMediumBanner, wpProductBanners] = await Promise.all([
  getHeroSlides(),      // Returns [] (should return 5)
  getMiniBanners(),
  getMediumBanner(),
  getProductBanners(),  // Returns 13 ✅
]);

// Fallback logic
const heroSlides = (wpHeroSlides.length > 0 ? wpHeroSlides : defaultHeroSlides).map(bannerToHeroSlide);
```

### File: `src/components/home/Hero.tsx`
- Receives `slides` prop from page.tsx
- If no slides or empty array, shows `defaultSlides` (Mammoth)

## Debug Information

### API Test Results (confirmed working via direct API calls):
```bash
# Hero banners exist and return data
GET /wp-json/wp/v2/banners?banner_type=456&per_page=10
→ Returns 5 banners with featured_image_url

# Banner type mapping works
GET /wp-json/wp/v2/banner_type?per_page=100&hide_empty=false
→ Returns all 7 types including hero-slide (ID: 456)
```

### Logs from Vercel Functions:
```
[Page] Starting banner fetch...
[Banners] Getting banners by type: discover-product
[Banners] Found 13 banners of type discover-product
[Page] Product banners: 13

# MISSING: No logs for getHeroSlides or hero-slide filtering
```

## Issues to Investigate

1. **Silent Failure:** `getHeroSlides()` seems to return empty array without error logs
2. **Missing Logs:** No "getHeroSlides() called" or "Found X banners of type hero-slide" in logs
3. **Type Mapping:** Cache or mapping issue for banner_type ID 456 → "hero-slide"
4. **Image URL Rewriting:** Code rewrites `/2026/02/` to flat `/` - may be affecting hero banners differently

## Expected Behavior
- `getHeroSlides()` should return 5 Banner objects
- Hero component should display 5 slides in carousel
- No Mammoth fallback should show

## Files to Review/Fix
- `src/lib/wordpress/banners.ts` - Main fetching logic
- `src/lib/wordpress/rest/client.ts` - REST API client
- `src/app/page.tsx` - Page component
- `src/components/home/Hero.tsx` - Hero display component

## Testing Checklist
After fix, verify:
- [ ] `getHeroSlides()` returns 5 banners
- [ ] Hero carousel shows WordPress banners (not Mammoth)
- [ ] Images load correctly (200 status)
- [ ] Carousel auto-scrolls through all 5 slides
- [ ] Product banners still work (13 banners)
- [ ] Mini banners and medium banner still work

## Environment
- Next.js 14 with App Router
- TypeScript
- Deployment: Vercel
- Dynamic rendering enabled (`export const dynamic = 'force-dynamic'`)
- Cache disabled for debugging
