#!/usr/bin/env python3
"""
Image Optimization Script for Gallery
Optimizes images for web use and copies them to the gallery folder
"""

import os
import sys
from PIL import Image
from pathlib import Path

# Configuration
MAX_WIDTH = 1920
MAX_HEIGHT = 1080
QUALITY = 85  # JPEG quality (0-100)
OUTPUT_DIR = Path(__file__).parent / "assets" / "images" / "gallery"

def optimize_image(input_path, output_path):
    """Optimize a single image"""
    try:
        # Open image
        img = Image.open(input_path)

        # Convert RGBA to RGB if necessary
        if img.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = background

        # Resize if needed while maintaining aspect ratio
        img.thumbnail((MAX_WIDTH, MAX_HEIGHT), Image.Resampling.LANCZOS)

        # Save optimized image
        img.save(output_path, 'JPEG', quality=QUALITY, optimize=True)

        # Get file sizes
        original_size = os.path.getsize(input_path)
        optimized_size = os.path.getsize(output_path)
        reduction = ((original_size - optimized_size) / original_size) * 100

        print(f"✓ {input_path.name}")
        print(f"  Original: {original_size / 1024:.1f} KB → Optimized: {optimized_size / 1024:.1f} KB ({reduction:.1f}% reduction)")

        return True
    except Exception as e:
        print(f"✗ Error processing {input_path.name}: {e}")
        return False

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 optimize_images.py <path_to_photos>")
        print("\nExample:")
        print("  python3 optimize_images.py /path/to/hackathon/photos")
        print("  python3 optimize_images.py ~/Downloads/event_photos")
        sys.exit(1)

    input_dir = Path(sys.argv[1])

    if not input_dir.exists() or not input_dir.is_dir():
        print(f"Error: {input_dir} is not a valid directory")
        sys.exit(1)

    # Create output directory if it doesn't exist
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Supported image extensions
    extensions = ('.jpg', '.jpeg', '.png', '.heic', '.HEIC')

    # Find all image files
    image_files = [f for f in input_dir.iterdir() if f.suffix.lower() in extensions]

    if not image_files:
        print(f"No image files found in {input_dir}")
        sys.exit(1)

    print(f"\n🖼️  Found {len(image_files)} images")
    print(f"📁 Output directory: {OUTPUT_DIR}")
    print(f"⚙️  Settings: Max size {MAX_WIDTH}x{MAX_HEIGHT}, Quality {QUALITY}%\n")

    # Process images
    success_count = 0
    for idx, img_path in enumerate(sorted(image_files), 1):
        output_filename = f"event-{idx:03d}.jpg"
        output_path = OUTPUT_DIR / output_filename

        if optimize_image(img_path, output_path):
            success_count += 1

    print(f"\n✅ Successfully optimized {success_count}/{len(image_files)} images")
    print(f"📂 Images saved to: {OUTPUT_DIR}")

    # Generate the JavaScript array
    print("\n📝 Copy this into assets/js/main.js (loadPhotos function):")
    print("\nconst photoFiles = [")
    for idx in range(1, success_count + 1):
        print(f"    'event-{idx:03d}.jpg',")
    print("];\n")

if __name__ == "__main__":
    main()
