#!/usr/bin/env python3
"""
Check CSV Product Images Against Uploads Folder
================================================
Compares image URLs in WooCommerce CSV against actual files in uploads folder.
Identifies missing images and suggests fixes.

Usage:
  python check_csv_images.py "C:/path/to/products.csv" "C:/path/to/uploads-originals"
"""

import os
import csv
import re
from pathlib import Path
from urllib.parse import urlparse, unquote
from collections import defaultdict


def extract_image_path(url):
    """Extract the relative path from a WordPress image URL."""
    if not url or not url.strip():
        return None

    # Parse URL and get path
    parsed = urlparse(url.strip())
    path = unquote(parsed.path)

    # Extract everything after /wp-content/uploads/
    match = re.search(r"/wp-content/uploads/(.+)$", path)
    if match:
        return match.group(1)

    # Try just /uploads/
    match = re.search(r"/uploads/(.+)$", path)
    if match:
        return match.group(1)

    return path


def scan_uploads_folder(uploads_path):
    """Scan uploads folder and return set of relative paths."""
    uploads_path = Path(uploads_path)
    files = {}

    for root, dirs, filenames in os.walk(uploads_path):
        for filename in filenames:
            filepath = Path(root) / filename
            rel_path = str(filepath.relative_to(uploads_path)).replace("\\", "/")
            # Store both with and without extension variants
            files[rel_path.lower()] = rel_path

            # Also store just the filename for fuzzy matching
            files[filename.lower()] = rel_path

    return files


def find_similar_files(target_name, available_files, uploads_path):
    """Find files with similar names (different extension or size suffix)."""
    target_stem = Path(target_name).stem.lower()
    target_dir = str(Path(target_name).parent).replace("\\", "/")

    suggestions = []

    for rel_path_lower, rel_path in available_files.items():
        file_stem = Path(rel_path).stem.lower()
        file_dir = str(Path(rel_path).parent).replace("\\", "/")

        # Same directory, similar name
        if target_dir.lower() == file_dir.lower():
            # Exact stem match (different extension)
            if file_stem == target_stem:
                suggestions.append(("exact_stem", rel_path))
            # Stem starts with target (might have size suffix removed)
            elif file_stem.startswith(target_stem):
                suggestions.append(("starts_with", rel_path))
            # Target starts with file stem (file might be base, target has suffix)
            elif target_stem.startswith(file_stem):
                suggestions.append(("base_match", rel_path))

    return suggestions


def main():
    import argparse

    parser = argparse.ArgumentParser(
        description="Check CSV images against uploads folder"
    )
    parser.add_argument("csv_path", help="Path to WooCommerce products CSV")
    parser.add_argument("uploads_path", help="Path to uploads-originals folder")
    parser.add_argument(
        "--fix", action="store_true", help="Generate fixed CSV with corrected paths"
    )
    parser.add_argument(
        "--verbose", "-v", action="store_true", help="Show detailed output"
    )

    args = parser.parse_args()

    csv_path = Path(args.csv_path)
    uploads_path = Path(args.uploads_path)

    if not csv_path.exists():
        print(f"Error: CSV not found: {csv_path}")
        return 1

    if not uploads_path.exists():
        print(f"Error: Uploads folder not found: {uploads_path}")
        return 1

    print("=" * 70)
    print("CSV Image Checker for WooCommerce Import")
    print("=" * 70)

    # Scan uploads folder
    print(f"\nScanning uploads folder: {uploads_path}")
    available_files = scan_uploads_folder(uploads_path)
    print(
        f"  Found {len(available_files) // 2} files"
    )  # Divide by 2 because we store both path and filename

    # Read CSV and extract image URLs
    print(f"\nReading CSV: {csv_path}")

    # Try to detect delimiter
    with open(csv_path, "r", encoding="utf-8-sig") as f:
        sample = f.read(4096)
        dialect = csv.Sniffer().sniff(sample)

    products = []
    image_column = None

    with open(csv_path, "r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f, delimiter=dialect.delimiter)

        # Find image column
        for col in reader.fieldnames:
            if "image" in col.lower():
                image_column = col
                break

        if not image_column:
            print("  Error: No image column found in CSV")
            print(f"  Columns: {reader.fieldnames}")
            return 1

        print(f"  Image column: '{image_column}'")

        for row in reader:
            products.append(row)

    print(f"  Found {len(products)} products")

    # Check each image
    print("\n" + "=" * 70)
    print("CHECKING IMAGES")
    print("=" * 70)

    found = []
    missing = []
    empty = []
    webp_issues = []
    fixable = []

    for i, product in enumerate(products):
        image_url = product.get(image_column, "").strip()
        product_name = product.get("Name", product.get("name", f"Row {i + 1}"))
        sku = product.get("SKU", product.get("sku", ""))

        if not image_url:
            empty.append((sku, product_name))
            continue

        rel_path = extract_image_path(image_url)
        if not rel_path:
            missing.append((sku, product_name, image_url, "Could not parse URL"))
            continue

        # Check if file exists
        rel_path_lower = rel_path.lower()

        if rel_path_lower in available_files:
            found.append((sku, product_name, rel_path))
        else:
            # Check for WebP that should be JPG/PNG
            if rel_path.endswith(".webp"):
                webp_issues.append((sku, product_name, rel_path))

            # Try to find similar files
            suggestions = find_similar_files(rel_path, available_files, uploads_path)

            if suggestions:
                # Prefer exact stem matches
                exact = [s for s in suggestions if s[0] == "exact_stem"]
                if exact:
                    fixable.append(
                        (sku, product_name, rel_path, exact[0][1], image_url)
                    )
                else:
                    fixable.append(
                        (sku, product_name, rel_path, suggestions[0][1], image_url)
                    )
            else:
                missing.append((sku, product_name, rel_path, "File not found"))

    # Print results
    print(f"\n RESULTS:")
    print(f"  Found:              {len(found)}")
    print(f"  Missing:            {len(missing)}")
    print(f"  Empty (no image):   {len(empty)}")
    print(f"  WebP references:    {len(webp_issues)}")
    print(f"  Fixable:            {len(fixable)}")

    if missing and args.verbose:
        print(f"\n MISSING IMAGES ({len(missing)}):")
        print("-" * 70)
        for sku, name, path, reason in missing[:30]:
            print(f"  [{sku}] {name[:40]}")
            print(f"         Path: {path}")
            print(f"         Reason: {reason}")
        if len(missing) > 30:
            print(f"  ... and {len(missing) - 30} more")

    if webp_issues:
        print(f"\n WEBP REFERENCES ({len(webp_issues)}):")
        print("-" * 70)
        print("  These reference .webp files but we only extracted jpg/png originals.")
        print("  The original jpg/png might exist - checking...")

        webp_fixable = 0
        for sku, name, path in webp_issues[:10]:
            # Check for jpg/png version
            base = path.rsplit(".", 1)[0]
            for ext in [".jpg", ".jpeg", ".png"]:
                test_path = base + ext
                if test_path.lower() in available_files:
                    print(f"  [{sku}] {path}")
                    print(f"         -> Found: {available_files[test_path.lower()]}")
                    webp_fixable += 1
                    break

        if webp_fixable > 0:
            print(
                f"\n  {webp_fixable} WebP references can be fixed by using jpg/png instead"
            )

    if fixable:
        print(f"\n FIXABLE ({len(fixable)}):")
        print("-" * 70)
        for sku, name, old_path, new_path, url in fixable[:20]:
            print(f"  [{sku}] {name[:40]}")
            print(f"         CSV:   {old_path}")
            print(f"         Found: {new_path}")
        if len(fixable) > 20:
            print(f"  ... and {len(fixable) - 20} more")

    # Generate fixed CSV if requested
    if args.fix and (fixable or webp_issues):
        print("\n" + "=" * 70)
        print("GENERATING FIXED CSV")
        print("=" * 70)

        # Build replacement map
        replacements = {}

        # Add fixable paths
        for sku, name, old_path, new_path, old_url in fixable:
            # Build new URL from old URL structure
            new_url = old_url.replace(old_path, new_path)
            replacements[old_url] = new_url

        # Add WebP -> jpg/png fixes
        for sku, name, path in webp_issues:
            base = path.rsplit(".", 1)[0]
            for ext in [".jpg", ".jpeg", ".png"]:
                test_path = base + ext
                if test_path.lower() in available_files:
                    actual_path = available_files[test_path.lower()]
                    # Find original URL for this product
                    for product in products:
                        if product.get("SKU", product.get("sku", "")) == sku:
                            old_url = product.get(image_column, "")
                            new_url = old_url.rsplit(".", 1)[0] + ext
                            replacements[old_url] = new_url
                            break
                    break

        # Write fixed CSV
        fixed_csv_path = csv_path.parent / (csv_path.stem + "_fixed" + csv_path.suffix)

        fixes_applied = 0
        with open(csv_path, "r", encoding="utf-8-sig", newline="") as f_in:
            with open(fixed_csv_path, "w", encoding="utf-8", newline="") as f_out:
                reader = csv.DictReader(f_in, delimiter=dialect.delimiter)
                writer = csv.DictWriter(
                    f_out, fieldnames=reader.fieldnames, delimiter=dialect.delimiter
                )
                writer.writeheader()

                for row in reader:
                    old_url = row.get(image_column, "")
                    if old_url in replacements:
                        row[image_column] = replacements[old_url]
                        fixes_applied += 1
                    writer.writerow(row)

        print(f"  Fixed CSV saved to: {fixed_csv_path}")
        print(f"  Fixes applied: {fixes_applied}")

    # Summary
    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)

    total = len(products)
    ok = len(found)
    problems = len(missing) + len(webp_issues)

    print(f"  Total products:     {total}")
    print(f"  Images OK:          {ok} ({ok * 100 // total}%)")
    print(f"  Issues:             {problems} ({problems * 100 // total}%)")

    if problems > 0:
        print(f"\n  To generate a fixed CSV, run with --fix flag:")
        print(f'    python check_csv_images.py "{csv_path}" "{uploads_path}" --fix')

    return 0


if __name__ == "__main__":
    exit(main())
