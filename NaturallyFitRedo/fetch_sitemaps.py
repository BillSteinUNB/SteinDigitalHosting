#!/usr/bin/env python3
"""Fetch sitemaps from naturallyfit.ca and extract all URLs."""

import cloudscraper
import xml.etree.ElementTree as ET
from collections import defaultdict

# Create a cloudscraper session to bypass Cloudflare
session = cloudscraper.create_scraper()

# List of sitemaps to fetch
SITEMAPS = [
    "https://naturallyfit.ca/post-sitemap.xml",
    "https://naturallyfit.ca/page-sitemap.xml",
    "https://naturallyfit.ca/attachment-sitemap.xml",
    "https://naturallyfit.ca/attachment-sitemap2.xml",
    "https://naturallyfit.ca/attachment-sitemap3.xml",
    "https://naturallyfit.ca/product-sitemap.xml",
    "https://naturallyfit.ca/elementor-hf-sitemap.xml",
    "https://naturallyfit.ca/nutritix-breadcrumb-sitemap.xml",
    "https://naturallyfit.ca/category-sitemap.xml",
    "https://naturallyfit.ca/post_tag-sitemap.xml",
    "https://naturallyfit.ca/product_brand-sitemap.xml",
    "https://naturallyfit.ca/product_cat-sitemap.xml",
    "https://naturallyfit.ca/product_tag-sitemap.xml",
    "https://naturallyfit.ca/product_shipping_class-sitemap.xml",
    "https://naturallyfit.ca/pa_color-sitemap.xml",
    "https://naturallyfit.ca/pa_flavor-sitemap.xml",
    "https://naturallyfit.ca/pa_flavour-sitemap.xml",
    "https://naturallyfit.ca/pa_size-sitemap.xml",
    "https://naturallyfit.ca/pa_title-sitemap.xml",
]

def fetch_and_parse_sitemap(url, timeout=30):
    """Fetch a sitemap and extract all URLs from it."""
    try:
        response = session.get(url, timeout=timeout)
        response.raise_for_status()
        
        # Parse XML
        root = ET.fromstring(response.content)
        
        # Extract URLs - handle both standard sitemap format and WordPress sitemap format
        urls = []
        
        # Define namespace mapping
        namespaces = {
            'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
            'xhtml': 'http://www.w3.org/1999/xhtml'
        }
        
        # Try with namespace first (standard sitemap format)
        for url_elem in root.findall('.//ns:url/ns:loc', namespaces):
            if url_elem.text:
                urls.append(url_elem.text.strip())
        
        # If no URLs found, try without namespace (raw element search)
        if not urls:
            for url_elem in root.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}url/{http://www.sitemaps.org/schemas/sitemap/0.9}loc'):
                if url_elem.text:
                    urls.append(url_elem.text.strip())
        
        # Try with simple tag name (no namespace)
        if not urls:
            for elem in root.iter():
                if elem.tag.endswith('loc') or elem.tag == 'loc':
                    if elem.text:
                        urls.append(elem.text.strip())
        
        return {
            'success': True,
            'url': url,
            'urls': urls,
            'count': len(urls),
            'error': None
        }
        
    except Exception as e:
        error_msg = str(e)
        if 'Timeout' in error_msg or 'timed out' in error_msg.lower():
            return {
                'success': False,
                'url': url,
                'urls': [],
                'count': 0,
                'error': 'Timeout (30s exceeded)'
            }
        elif 'ParseError' in error_msg or 'XML' in error_msg:
            return {
                'success': False,
                'url': url,
                'urls': [],
                'count': 0,
                'error': f'XML parse error: {error_msg}'
            }
        else:
            return {
                'success': False,
                'url': url,
                'urls': [],
                'count': 0,
                'error': f'Request error: {error_msg}'
            }

def main():
    print("=" * 80)
    print("FETCHING SITEMAPS FROM naturallyfit.ca")
    print("=" * 80)
    print()
    
    # Create a fresh cloudscraper session
    global session
    session = cloudscraper.create_scraper()
    
    # First, visit the main site to get any cookies
    print("Initializing session by visiting main site...")
    try:
        session.get('https://naturallyfit.ca/', timeout=10)
        print("Session initialized successfully.")
    except Exception as e:
        print(f"Warning: Could not initialize session: {e}")
    print()
    
    results = []
    failed_sitemaps = []
    total_urls = 0
    
    for sitemap_url in SITEMAPS:
        print(f"Fetching: {sitemap_url} ...", end=' ', flush=True)
        result = fetch_and_parse_sitemap(sitemap_url)
        results.append(result)
        
        if result['success']:
            print(f"OK ({result['count']} URLs)")
            total_urls += result['count']
        else:
            print(f"FAILED: {result['error']}")
            failed_sitemaps.append(result)
    
    print()
    print("=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print()
    
    # Print results by sitemap type
    for result in results:
        sitemap_name = result['url'].split('/')[-1]
        print(f"FILE: {sitemap_name}")
        print(f"   Total URLs: {result['count']}")
        
        if result['success'] and result['urls']:
            sample_size = min(20, len(result['urls']))
            print(f"   First {sample_size} URLs:")
            for i, url in enumerate(result['urls'][:sample_size], 1):
                print(f"      {i}. {url}")
            if len(result['urls']) > sample_size:
                print(f"      ... and {len(result['urls']) - sample_size} more")
        elif not result['success']:
            print(f"   ERROR: {result['error']}")
        
        print()
    
    # Print statistics
    print("=" * 80)
    print("STATISTICS")
    print("=" * 80)
    print(f"Total sitemaps processed: {len(SITEMAPS)}")
    print(f"Successful: {len([r for r in results if r['success']])}")
    print(f"Failed: {len(failed_sitemaps)}")
    print(f"Total URLs extracted: {total_urls}")
    print()
    
    if failed_sitemaps:
        print("FAILED SITEMAPS:")
        for fs in failed_sitemaps:
            print(f"   - {fs['url']}: {fs['error']}")
        print()
    
    # Save all URLs to a file for reference
    all_urls_file = 'all_sitemap_urls.txt'
    with open(all_urls_file, 'w', encoding='utf-8') as f:
        for result in results:
            if result['success']:
                f.write(f"\n{'='*60}\n")
                f.write(f"{result['url']}\n")
                f.write(f"Count: {result['count']}")
                f.write(f"{'='*60}\n")
                for url in result['urls']:
                    f.write(f"{url}\n")
    
    print(f"All URLs saved to: {all_urls_file}")
    
    # Return summary dictionary
    return {
        'results': results,
        'failed': failed_sitemaps,
        'total_urls': total_urls
    }

if __name__ == "__main__":
    main()
