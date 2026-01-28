#!/usr/bin/env python3
"""Download raw address data from government sources.

This script downloads the latest address data files from:
- Japan Post (KEN_ALL postal code data, Jigyosyo business office data)
- MLIT (Ministry of Land position reference information) [optional]

The downloaded files are used by the tree generation scripts
(create_tree_file_kenall.py, create_tree_file_kokudo.py) to build
the dictionary files that power the Jusho API.

Usage:
    python scripts/download_sources.py --output-dir backend/data/

Environment variables:
    SKIP_MLIT: Set to 'true' to skip MLIT data download (large, ~1GB)

Data sources:
    KEN_ALL:  https://www.post.japanpost.jp/zipcode/dl/utf/zip/utf_ken_all.zip
    Jigyosyo: https://www.post.japanpost.jp/zipcode/dl/jigyosyo/zip/jigyosyo.zip
    MLIT:     https://nlftp.mlit.go.jp/isj/dls/data/{version}/{pref_code}-{version}.zip
"""

import argparse
import io
import os
import sys
import tempfile
import zipfile
from pathlib import Path

import requests

# Japan Post data URLs
KEN_ALL_URL = "https://www.post.japanpost.jp/zipcode/dl/utf/zip/utf_ken_all.zip"
JIGYOSYO_URL = "https://www.post.japanpost.jp/zipcode/dl/jigyosyo/zip/jigyosyo.zip"

# MLIT data version and URL template
# NOTE: These versions may need to be updated when MLIT publishes new data.
# Check https://nlftp.mlit.go.jp/isj/ for the latest version numbers.
MLIT_VERSION_GAIKU = "23.0a"     # Street block level (gaiku)
MLIT_VERSION_OAZA = "18.0b"      # Town area level (oaza)
MLIT_URL_TEMPLATE = "https://nlftp.mlit.go.jp/isj/dls/data/{version}/{pref_code}-{version}.zip"


def download_file(url: str, description: str) -> bytes:
    """Download a file from a URL and return its content."""
    print(f"  Downloading: {description}")
    print(f"  URL: {url}")
    try:
        response = requests.get(url, timeout=300)
        response.raise_for_status()
        size_mb = len(response.content) / (1024 * 1024)
        print(f"  Downloaded: {size_mb:.1f} MB")
        return response.content
    except requests.RequestException as e:
        print(f"  ERROR: Failed to download {url}: {e}", file=sys.stderr)
        raise


def download_ken_all(output_dir: str) -> None:
    """Download and verify KEN_ALL postal code data from Japan Post.

    This downloads the UTF-8 version of KEN_ALL (all prefectures combined).
    The create_tree_file_kenall.py script handles downloading internally,
    but this function pre-downloads the file for verification and caching.
    """
    print("\n=== Downloading KEN_ALL (Japan Post Postal Code Data) ===")
    print("Source: Japan Post (日本郵便)")
    print(f"URL: {KEN_ALL_URL}")

    content = download_file(KEN_ALL_URL, "KEN_ALL postal code data (UTF-8)")

    # Verify it's a valid ZIP file
    try:
        with zipfile.ZipFile(io.BytesIO(content)) as zf:
            names = zf.namelist()
            print(f"  ZIP contents: {names}")
            if "utf_ken_all.csv" not in names:
                print("  WARNING: utf_ken_all.csv not found in ZIP archive")
            else:
                csv_size = zf.getinfo("utf_ken_all.csv").file_size
                print(f"  utf_ken_all.csv: {csv_size / (1024 * 1024):.1f} MB (uncompressed)")
    except zipfile.BadZipFile:
        print("  ERROR: Downloaded file is not a valid ZIP archive")
        raise

    # Save to output directory for reference
    output_path = os.path.join(output_dir, "ken_all.zip")
    with open(output_path, "wb") as f:
        f.write(content)
    print(f"  Saved to: {output_path}")


def download_jigyosyo(output_dir: str) -> None:
    """Download and verify Jigyosyo (business office) postal code data.

    This data contains dedicated postal codes for large-volume mail offices
    such as government agencies, corporations, etc.
    """
    print("\n=== Downloading Jigyosyo (Business Office Postal Codes) ===")
    print("Source: Japan Post (日本郵便)")
    print(f"URL: {JIGYOSYO_URL}")

    content = download_file(JIGYOSYO_URL, "Jigyosyo business office data")

    # Verify it's a valid ZIP file
    try:
        with zipfile.ZipFile(io.BytesIO(content)) as zf:
            names = zf.namelist()
            print(f"  ZIP contents: {names}")
            if "JIGYOSYO.CSV" not in names:
                print("  WARNING: JIGYOSYO.CSV not found in ZIP archive")
            else:
                csv_size = zf.getinfo("JIGYOSYO.CSV").file_size
                print(f"  JIGYOSYO.CSV: {csv_size / (1024 * 1024):.1f} MB (uncompressed)")
    except zipfile.BadZipFile:
        print("  ERROR: Downloaded file is not a valid ZIP archive")
        raise

    # Save to output directory for reference
    output_path = os.path.join(output_dir, "jigyosyo.zip")
    with open(output_path, "wb") as f:
        f.write(content)
    print(f"  Saved to: {output_path}")


def download_mlit_data(output_dir: str) -> None:
    """Download MLIT position reference information for all 47 prefectures.

    This downloads two types of data per prefecture:
    - Type A (gaiku): Street block level with lat/lng coordinates
    - Type B (oaza): Town area level with administrative codes

    WARNING: This is a large download (~1GB total) and may take 30-60 minutes.

    NOTE: The MLIT data versions (MLIT_VERSION_GAIKU, MLIT_VERSION_OAZA) may
    need to be updated when new data is published. Check:
    https://nlftp.mlit.go.jp/isj/
    """
    print("\n=== Downloading MLIT Position Reference Data (国土交通省 位置参照情報) ===")
    print("Source: Ministry of Land, Infrastructure, Transport and Tourism")
    print(f"Gaiku version: {MLIT_VERSION_GAIKU}")
    print(f"Oaza version: {MLIT_VERSION_OAZA}")
    print("NOTE: This is a large download (~1GB) and may take 30-60 minutes.")
    print("")

    mlit_dir = os.path.join(output_dir, "mlit_raw")
    os.makedirs(mlit_dir, exist_ok=True)

    # Download for all 47 prefectures
    for pref_code in range(1, 48):
        pref_str = str(pref_code).zfill(2)

        # Type A: Street block level (gaiku)
        gaiku_url = MLIT_URL_TEMPLATE.format(
            version=MLIT_VERSION_GAIKU,
            pref_code=f"{pref_str}000",
        )
        gaiku_filename = f"{pref_str}000-{MLIT_VERSION_GAIKU}.zip"
        gaiku_path = os.path.join(mlit_dir, gaiku_filename)

        if not os.path.exists(gaiku_path):
            try:
                content = download_file(gaiku_url, f"Prefecture {pref_str} (gaiku)")
                with open(gaiku_path, "wb") as f:
                    f.write(content)
            except Exception as e:
                print(f"  WARNING: Failed to download gaiku data for pref {pref_str}: {e}")
                continue

        # Type B: Town area level (oaza)
        oaza_url = MLIT_URL_TEMPLATE.format(
            version=MLIT_VERSION_OAZA,
            pref_code=f"{pref_str}000",
        )
        oaza_filename = f"{pref_str}000-{MLIT_VERSION_OAZA}.zip"
        oaza_path = os.path.join(mlit_dir, oaza_filename)

        if not os.path.exists(oaza_path):
            try:
                content = download_file(oaza_url, f"Prefecture {pref_str} (oaza)")
                with open(oaza_path, "wb") as f:
                    f.write(content)
            except Exception as e:
                print(f"  WARNING: Failed to download oaza data for pref {pref_str}: {e}")
                continue

    # Count downloaded files
    downloaded = [f for f in os.listdir(mlit_dir) if f.endswith(".zip")]
    print(f"\n  Downloaded {len(downloaded)} files to {mlit_dir}")


def main():
    parser = argparse.ArgumentParser(
        description="Download raw address data from government sources"
    )
    parser.add_argument(
        "--output-dir",
        default="backend/data",
        help="Output directory for downloaded data (default: backend/data)",
    )
    parser.add_argument(
        "--skip-mlit",
        action="store_true",
        default=os.environ.get("SKIP_MLIT", "false").lower() == "true",
        help="Skip MLIT data download (large, ~1GB)",
    )
    parser.add_argument(
        "--skip-japan-post",
        action="store_true",
        help="Skip Japan Post data download",
    )
    args = parser.parse_args()

    output_dir = os.path.abspath(args.output_dir)
    os.makedirs(output_dir, exist_ok=True)

    print("=" * 60)
    print("  Jusho Data Source Downloader")
    print("=" * 60)
    print(f"Output directory: {output_dir}")
    print(f"Skip MLIT: {args.skip_mlit}")
    print(f"Skip Japan Post: {args.skip_japan_post}")

    # Download Japan Post data
    if not args.skip_japan_post:
        download_ken_all(output_dir)
        download_jigyosyo(output_dir)
    else:
        print("\nSkipping Japan Post data download (--skip-japan-post)")

    # Download MLIT data (optional, large download)
    if not args.skip_mlit:
        download_mlit_data(output_dir)
    else:
        print("\nSkipping MLIT data download (--skip-mlit)")
        print("  The kenall tree generation will still work without MLIT data.")
        print("  The kokudo tree generation requires MLIT data and will download it")
        print("  automatically when create_tree_file_kokudo.py runs.")

    print("\n" + "=" * 60)
    print("  Download complete!")
    print("=" * 60)
    print(f"\nFiles saved to: {output_dir}")
    print("\nNext steps:")
    print("  1. Generate kenall trees:")
    print('     python -c "from address_kokudo_kenall.create_tree_file_kenall import create_trees; create_trees(\'data/\')"')
    print("  2. Generate kokudo trees:")
    print('     python -c "from address_kokudo_kenall.create_tree_file_kokudo import create_trees; create_trees(\'data/\')"')
    print("  Or use the master update script:")
    print("     ./scripts/update_data.sh")


if __name__ == "__main__":
    main()
