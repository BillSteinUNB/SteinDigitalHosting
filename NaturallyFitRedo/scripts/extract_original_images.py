#!/usr/bin/env python3
"""
Extract Original Images from WordPress Uploads
===============================================
This script scans a WordPress wp-content/uploads folder and copies ONLY
the original uploaded images, skipping all auto-generated thumbnails and WebP files.

WordPress auto-generates files like:
  - product-image-150x150.jpg (thumbnail)
  - product-image-300x300.jpg (medium)
  - product-image-768x768.jpg (medium-large)
  - product-image-1024x1024.jpg (large)
  - product-image.webp (WebP conversion)
  - product-image-150x150.webp (WebP thumbnail)
  - etc.

This script keeps ONLY the original: product-image.jpg

Usage:
  python extract_original_images.py "C:/path/to/uploads" "C:/path/to/output"

Optional flags:
  --flatten         Put all images in one folder (no year/month structure)
  --dry-run         Show what would be copied without copying
  --include-webp    Also copy original WebP files (not just jpg/png)
"""

import os
import re
import shutil
import argparse
from pathlib import Path
from collections import defaultdict

# Regex to match WordPress thumbnail suffixes like -150x150, -300x300, -1024x768, etc.
THUMBNAIL_PATTERN = re.compile(r"-\d+x\d+$")

# Image extensions to process
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff"}
WEBP_EXTENSION = {".webp"}


def is_thumbnail(filename):
    """Check if a filename is a WordPress-generated thumbnail."""
    stem = Path(filename).stem  # filename without extension
    return bool(THUMBNAIL_PATTERN.search(stem))


def is_scaled(filename):
    """Check if a filename is a WordPress 'scaled' version (WP 5.3+)."""
    stem = Path(filename).stem
    return stem.endswith("-scaled")


def get_original_name(filename):
    """Get the base name without thumbnail suffix."""
    stem = Path(filename).stem
    ext = Path(filename).suffix
    # Remove thumbnail suffix if present
    clean_stem = THUMBNAIL_PATTERN.sub("", stem)
    # Remove -scaled suffix if present
    if clean_stem.endswith("-scaled"):
        clean_stem = clean_stem[:-7]
    return clean_stem + ext


def scan_uploads(uploads_path, include_webp=False):
    """
    Scan uploads folder and return dict of original images.
    Returns: {relative_path: absolute_path}
    """
    uploads_path = Path(uploads_path)
    originals = {}
    thumbnails_skipped = 0
    webp_skipped = 0

    valid_extensions = IMAGE_EXTENSIONS.copy()
    if include_webp:
        valid_extensions.update(WEBP_EXTENSION)

    for root, dirs, files in os.walk(uploads_path):
        for filename in files:
            filepath = Path(root) / filename
            ext = filepath.suffix.lower()

            # Skip non-image files
            if ext not in valid_extensions and ext not in WEBP_EXTENSION:
                continue

            # Skip WebP files unless explicitly included
            if ext in WEBP_EXTENSION and not include_webp:
                webp_skipped += 1
                continue

            # Skip thumbnails
            if is_thumbnail(filename):
                thumbnails_skipped += 1
                continue

            # Skip scaled versions (keep original instead if it exists)
            if is_scaled(filename):
                thumbnails_skipped += 1
                continue

            # This is an original image
            rel_path = filepath.relative_to(uploads_path)
            originals[str(rel_path)] = str(filepath)

    return originals, thumbnails_skipped, webp_skipped


def copy_images(originals, output_path, flatten=False, dry_run=False):
    """Copy original images to output folder."""
    output_path = Path(output_path)
    copied = 0
    errors = []

    for rel_path, abs_path in originals.items():
        if flatten:
            # Put all files in root of output
            dest = output_path / Path(rel_path).name
            # Handle duplicates by prepending folder structure
            if dest.exists():
                safe_name = rel_path.replace("/", "_").replace("\\", "_")
                dest = output_path / safe_name
        else:
            # Preserve year/month structure
            dest = output_path / rel_path

        if dry_run:
            print(f"  Would copy: {rel_path}")
        else:
            dest.parent.mkdir(parents=True, exist_ok=True)
            try:
                shutil.copy2(abs_path, dest)
                copied += 1
            except Exception as e:
                errors.append((rel_path, str(e)))

    return copied, errors


def analyze_folder(uploads_path):
    """Analyze uploads folder and print statistics."""
    uploads_path = Path(uploads_path)

    stats = {
        "total_files": 0,
        "total_size": 0,
        "images": 0,
        "thumbnails": 0,
        "webp": 0,
        "originals": 0,
        "original_size": 0,
        "by_year": defaultdict(int),
        "by_extension": defaultdict(int),
    }

    for root, dirs, files in os.walk(uploads_path):
        for filename in files:
            filepath = Path(root) / filename
            ext = filepath.suffix.lower()
            size = filepath.stat().st_size

            stats["total_files"] += 1
            stats["total_size"] += size
            stats["by_extension"][ext] += 1

            # Track by year
            rel_path = filepath.relative_to(uploads_path)
            parts = rel_path.parts
            if len(parts) >= 1 and parts[0].isdigit():
                stats["by_year"][parts[0]] += 1

            if ext in IMAGE_EXTENSIONS or ext in WEBP_EXTENSION:
                stats["images"] += 1

                if ext in WEBP_EXTENSION:
                    stats["webp"] += 1
                elif is_thumbnail(filename) or is_scaled(filename):
                    stats["thumbnails"] += 1
                else:
                    stats["originals"] += 1
                    stats["original_size"] += size

    return stats


def format_size(size_bytes):
    """Format bytes to human readable size."""
    for unit in ["B", "KB", "MB", "GB"]:
        if size_bytes < 1024:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024
    return f"{size_bytes:.1f} TB"


def main():
    parser = argparse.ArgumentParser(
        description="Extract original images from WordPress uploads folder"
    )
    parser.add_argument("uploads_path", help="Path to wp-content/uploads folder")
    parser.add_argument("output_path", nargs="?", help="Output folder for originals")
    parser.add_argument(
        "--flatten",
        action="store_true",
        help="Put all images in one folder (no year/month structure)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be copied without copying",
    )
    parser.add_argument(
        "--include-webp", action="store_true", help="Also copy original WebP files"
    )
    parser.add_argument(
        "--analyze", action="store_true", help="Only analyze folder, don't copy"
    )

    args = parser.parse_args()

    uploads_path = Path(args.uploads_path)

    if not uploads_path.exists():
        print(f"Error: Uploads folder not found: {uploads_path}")
        return 1

    print("=" * 60)
    print("WordPress Uploads - Original Image Extractor")
    print("=" * 60)
    print(f"\nScanning: {uploads_path}\n")

    # Analyze folder
    stats = analyze_folder(uploads_path)

    print("FOLDER ANALYSIS:")
    print("-" * 40)
    print(f"  Total files:        {stats['total_files']:,}")
    print(f"  Total size:         {format_size(stats['total_size'])}")
    print(f"  Image files:        {stats['images']:,}")
    print(f"    - Thumbnails:     {stats['thumbnails']:,} (will skip)")
    print(f"    - WebP files:     {stats['webp']:,} (will skip)")
    print(f"    - ORIGINALS:      {stats['originals']:,} (will copy)")
    print(f"  Original size:      {format_size(stats['original_size'])}")

    if stats["by_year"]:
        print(f"\n  Files by year:")
        for year in sorted(stats["by_year"].keys()):
            print(f"    {year}: {stats['by_year'][year]:,} files")

    reduction = (
        (1 - stats["original_size"] / stats["total_size"]) * 100
        if stats["total_size"] > 0
        else 0
    )
    print(f"\n  Size reduction:     {reduction:.1f}%")
    print(
        f"  ({format_size(stats['total_size'])} -> {format_size(stats['original_size'])})"
    )

    if args.analyze:
        print("\n[Analyze only mode - no files copied]")
        return 0

    if not args.output_path:
        print("\nTo extract originals, run with output path:")
        print(
            f'  python extract_original_images.py "{uploads_path}" "C:/path/to/output"'
        )
        print("\nOptions:")
        print("  --flatten      Put all images in one folder")
        print("  --dry-run      Preview without copying")
        print("  --include-webp Also copy WebP originals")
        return 0

    output_path = Path(args.output_path)

    print("\n" + "=" * 60)
    print("EXTRACTING ORIGINAL IMAGES")
    print("=" * 60)

    # Scan for originals
    print("\nFinding original images...")
    originals, thumb_skip, webp_skip = scan_uploads(
        uploads_path, include_webp=args.include_webp
    )

    print(f"  Found {len(originals):,} original images")
    print(f"  Skipping {thumb_skip:,} thumbnails")
    print(f"  Skipping {webp_skip:,} WebP files")

    if args.dry_run:
        print(f"\n[DRY RUN - showing first 20 files]")
        for i, rel_path in enumerate(list(originals.keys())[:20]):
            print(f"  {rel_path}")
        if len(originals) > 20:
            print(f"  ... and {len(originals) - 20} more")
        return 0

    # Copy files
    print(f"\nCopying to: {output_path}")
    if args.flatten:
        print("  Mode: Flattened (all files in one folder)")
    else:
        print("  Mode: Preserve year/month structure")

    copied, errors = copy_images(
        originals, output_path, flatten=args.flatten, dry_run=args.dry_run
    )

    print(f"\nDONE!")
    print(f"  Copied: {copied:,} files")
    if errors:
        print(f"  Errors: {len(errors)}")
        for path, err in errors[:5]:
            print(f"    - {path}: {err}")

    print(f"\nOriginal images saved to: {output_path}")
    print("Upload this folder to your new WordPress site's wp-content/uploads/")

    return 0


if __name__ == "__main__":
    exit(main())
