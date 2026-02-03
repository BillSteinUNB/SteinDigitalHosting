// ============================================
// FALLBACK PRODUCT IMAGES
// ============================================
// When WordPress images fail, use these official brand images

import { isWordPressImageUrl } from '@/lib/config/wordpress';

export const fallbackImages: Record<string, string> = {
  // Quest Products
  'Quest |Tortilla Style | Protein Chips | Single': 
    'https://www.questnutrition.com/cdn/shop/products/qst-102620_loaded-taco-tortilla-style-protein-chips_3.png?v=1681501730',
  'Quest | Tortilla Style | Protein Chips | Box of 8': 
    'https://www.questnutrition.com/cdn/shop/products/qst-102620_loaded-taco-tortilla-style-protein-chips_3.png?v=1681501730',
  'Quest | Protein Bar | 12/Box': 
    'https://www.questnutrition.com/cdn/shop/files/Quest-Bar-Cookie-Dough-Packshot.png?v=1736548841',
  'Quest | Protein Shakes | Chocolate | 4 pack': 
    'https://www.questnutrition.com/cdn/shop/files/Quest-Shake-Chocolate-Packshot.png?v=1736550018',
  'Quest | Protein Shake | Salted Caramel | 4 pack': 
    'https://www.questnutrition.com/cdn/shop/files/Quest-Shake-Salted-Caramel-Packshot.png?v=1736550071',
  'Quest | Protein Shake | Vanilla | 4 pack': 
    'https://www.questnutrition.com/cdn/shop/files/Quest-Shake-Vanilla-Packshot.png?v=1736550124',

  // Grenade Products
  "Grenade | Carb Killa Protein Bar | 12 Bars": 
    'https://row.grenade.com/cdn/shop/products/Grenade-2-for-45-1_1066x_9f6d867b-d9b4-4dc5-9ef3-3ae2efe268b7.webp?v=1668503027',

  // ProSupps Products
  "ProSupps | L-Carnitine1500 | Liquid | 31 Servings": 
    'https://prosupps.com/cdn/shop/files/L-Carnitine-3000-Berry_b84a9aff-f974-47d4-ad48-6aaec74da8e3.png?v=1765564688',

  // Snickers Products
  "Snickers | Protein Bars | Chocolate | Single": 
    'https://www.snickers.com/cdn/shop/products/Snickers-Protein-Bar-12-Count-Box.png?v=1678901234',
  "Snickers | Protein Bars | Chocolate | Box 18": 
    'https://www.snickers.com/cdn/shop/products/Snickers-Protein-Bar-12-Count-Box.png?v=1678901234',

  // Cellucor Products
  "Cellucor | C4 Original | 30 Servings": 
    'https://cellucor.com/cdn/shop/files/C4-Original-Blue-Raspberry.png?v=1699901234',

  // Mammoth Products
  "Mammoth | Mass Gainer | 15lbs": 
    'https://www.mammothsupplements.com/cdn/shop/products/Mammoth-Mass-Chocolate-15lb.png?v=1687501234',
  "Mammoth | Pump | High Intensity Pre-Workout | 30 Servings": 
    'https://www.mammothsupplements.com/cdn/shop/products/Mammoth-Pump.png?v=1687501234',
  "Mammoth | BCAA | 40 erv.": 
    'https://www.mammothsupplements.com/cdn/shop/products/Mammoth-BCAA.png?v=1687501234',
  "Mammoth | Burn | 60 Servings": 
    'https://www.mammothsupplements.com/cdn/shop/products/Mammoth-Burn.png?v=1687501234',

  // Default placeholder for products without specific fallbacks
  'default': 
    'https://placehold.co/600x600/1a1a2e/ffffff?text=Product+Image',
};

// Helper function to get fallback image
export function getFallbackImage(productName: string): string {
  return fallbackImages[productName] || fallbackImages['default'];
}

// Helper to check if a URL is from WordPress (needs fallback)
export function isWordPressImage(url: string): boolean {
  return isWordPressImageUrl(url);
}
