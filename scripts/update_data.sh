#!/bin/bash
# =============================================================================
# Master data update script for Jusho address dictionary data
#
# This script downloads the latest government address data and regenerates
# all dictionary files used by the Jusho API.
#
# Usage:
#   ./scripts/update_data.sh [DATA_DIR]
#
# Arguments:
#   DATA_DIR  Output directory for data files (default: backend/data)
#
# Steps:
#   1. Download latest KEN_ALL data from Japan Post
#   2. Download latest Jigyosyo data from Japan Post
#   3. (Optional) Download latest MLIT data
#   4. Generate kenall tree files (kenall_tree.json, kenall_city_tree.json,
#      kenall_building_dict.json, jigyosyo_dict.json)
#   5. Generate kokudo tree files (kokudo_tree.json, kokudo_city_tree.json)
#   6. Run tests to verify data quality
#
# Prerequisites:
#   - Python 3.9+ with Poetry
#   - Internet access (to download government data)
#   - ~2GB disk space for temporary downloads
#
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"
DATA_DIR="${1:-$BACKEND_DIR/data}"

echo "============================================"
echo "  Jusho Data Update Script"
echo "============================================"
echo ""
echo "Project:  $PROJECT_DIR"
echo "Backend:  $BACKEND_DIR"
echo "Data dir: $DATA_DIR"
echo ""

# Ensure data directory exists
mkdir -p "$DATA_DIR"

# Navigate to backend directory for Python imports
cd "$BACKEND_DIR"

# Step 1: Download source data
echo ">>> Step 1: Downloading source data..."
python "$SCRIPT_DIR/download_sources.py" --output-dir "$DATA_DIR"
echo ""

# Step 2: Generate KEN_ALL dictionary files
echo ">>> Step 2: Generating KEN_ALL dictionary files..."
echo "  This downloads KEN_ALL.zip and JIGYOSYO.zip from Japan Post,"
echo "  then generates:"
echo "    - kenall_tree.json"
echo "    - kenall_city_tree.json"
echo "    - kenall_building_dict.json"
echo "    - kenall_df.csv"
echo "    - jigyosyo_dict.json"
echo ""
python -c "
from address_kokudo_kenall.create_tree_file_kenall import create_trees
create_trees('$DATA_DIR')
print('kenall tree files generated successfully.')
"
echo ""

# Step 3: Generate KOKUDO dictionary files
echo ">>> Step 3: Generating KOKUDO dictionary files..."
echo "  This downloads MLIT position reference data for all 47 prefectures,"
echo "  then generates:"
echo "    - kokudo_tree.json"
echo "    - kokudo_city_tree.json"
echo "    - kokudo_df.csv"
echo "  NOTE: This step takes 30-60 minutes due to large downloads."
echo ""
python -c "
from address_kokudo_kenall.create_tree_file_kokudo import create_trees
create_trees('$DATA_DIR')
print('kokudo tree files generated successfully.')
"
echo ""

# Step 4: Verify generated files
echo ">>> Step 4: Verifying generated data files..."
EXPECTED_FILES=(
  "kenall_tree.json"
  "kenall_city_tree.json"
  "kenall_building_dict.json"
  "kenall_df.csv"
  "jigyosyo_dict.json"
  "kokudo_tree.json"
  "kokudo_city_tree.json"
  "kokudo_df.csv"
)

ALL_OK=true
for f in "${EXPECTED_FILES[@]}"; do
  filepath="$DATA_DIR/$f"
  if [ -f "$filepath" ]; then
    size=$(ls -lh "$filepath" | awk '{print $5}')
    echo "  OK: $f ($size)"
  else
    echo "  MISSING: $f"
    ALL_OK=false
  fi
done
echo ""

if [ "$ALL_OK" = false ]; then
  echo "ERROR: Some data files are missing. Check the logs above."
  exit 1
fi

# Step 5: Run tests
echo ">>> Step 5: Running tests to verify data quality..."
cd "$BACKEND_DIR"
python -m pytest tests/ -v --tb=short -x
echo ""

echo "============================================"
echo "  Data update completed successfully!"
echo "============================================"
echo ""
echo "Generated files in: $DATA_DIR"
for f in "${EXPECTED_FILES[@]}"; do
  filepath="$DATA_DIR/$f"
  if [ -f "$filepath" ]; then
    size=$(ls -lh "$filepath" | awk '{print $5}')
    echo "  $f ($size)"
  fi
done
echo ""
echo "Next steps:"
echo "  1. Review the changes: git diff --stat"
echo "  2. Commit: git add backend/data/ && git commit -m 'data: update address dictionaries'"
echo "  3. Deploy: ./backend/deploy.sh"
