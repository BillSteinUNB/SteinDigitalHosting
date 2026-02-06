// Test script to check WordPress banner API response

const WP_URL = 'https://wp.naturallyfit.ca';

async function testBanners() {
  console.log('Testing WordPress Banner API...\n');
  
  try {
    // Test banner_type taxonomy
    console.log('1. Fetching banner_type taxonomy...');
    const typeRes = await fetch(`${WP_URL}/wp-json/wp/v2/banner_type?per_page=100`);
    const types = await typeRes.json();
    console.log('   Banner types:', types.map(t => ({ id: t.id, slug: t.slug, name: t.name })));
    
    // Test banners endpoint
    console.log('\n2. Fetching banners...');
    const bannerRes = await fetch(`${WP_URL}/wp-json/wp/v2/banners?per_page=20&orderby=menu_order&order=asc&status=publish&_embed`);
    const banners = await bannerRes.json();
    
    if (banners.length === 0) {
      console.log('   No banners found!');
    } else {
      console.log(`   Found ${banners.length} banner(s):\n`);
      banners.forEach((banner, i) => {
        console.log(`   Banner ${i + 1}:`);
        console.log(`     ID: ${banner.id}`);
        console.log(`     Title: ${banner.title?.rendered}`);
        console.log(`     Banner Type IDs: ${banner.banner_type?.join(', ') || 'none'}`);
        console.log(`     Featured Image URL: ${banner.featured_image_url || 'NOT SET'}`);
        console.log(`     Meta banner_link: ${banner.meta?.banner_link || 'NOT SET'}`);
        console.log(`     Menu Order: ${banner.menu_order}`);
        
        // Check if image URL is accessible
        if (banner.featured_image_url) {
          console.log(`     Image URL check: ${banner.featured_image_url}`);
        }
        console.log('');
      });
    }
    
    // Test if images are accessible
    console.log('\n3. Testing image accessibility...');
    const testUrls = [
      `${WP_URL}/wp-content/uploads/Mammoth-Slider-1.png`,
    ];
    
    for (const url of testUrls) {
      try {
        const imgRes = await fetch(url, { method: 'HEAD' });
        console.log(`   ${url}: ${imgRes.status} ${imgRes.statusText}`);
      } catch (e) {
        console.log(`   ${url}: ERROR - ${e.message}`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testBanners();
