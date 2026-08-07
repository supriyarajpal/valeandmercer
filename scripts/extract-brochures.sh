#!/usr/bin/env bash
#
# extract-brochures.sh — repeatable brochure ingestion (text + images).
#
# For every content/properties/<slug>/ that holds a brochure.pdf, this runs, from
# inside that folder:
#
#   pdftotext -layout brochure.pdf ../extracted/<slug>.txt
#   pdfimages -all -p brochure.pdf ../extracted/<slug>/img
#
# Reruns are cheap: any slug whose ../extracted/<slug>.txt already exists is
# skipped, so re-running only picks up newly-added brochures.
#
set -euo pipefail

# Resolve repo paths from this script's own location so it runs from anywhere.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PROPS_DIR="$ROOT/content/properties"
EXTRACT_DIR="$PROPS_DIR/extracted"

# --- Ensure poppler-utils (pdftotext + pdfimages) is installed ---------------
if ! command -v pdftotext >/dev/null 2>&1 || ! command -v pdfimages >/dev/null 2>&1; then
  echo "poppler-utils not found — attempting to install…"
  if command -v brew >/dev/null 2>&1; then
    brew install poppler
  elif command -v apt-get >/dev/null 2>&1; then
    sudo apt-get update && sudo apt-get install -y poppler-utils
  elif command -v dnf >/dev/null 2>&1; then
    sudo dnf install -y poppler-utils
  else
    echo "ERROR: could not auto-install poppler-utils. Install it manually:" >&2
    echo "  macOS:  brew install poppler" >&2
    echo "  Debian: sudo apt-get install poppler-utils" >&2
    exit 1
  fi
fi

if [ ! -d "$PROPS_DIR" ]; then
  echo "No $PROPS_DIR directory found — nothing to extract."
  exit 0
fi

processed=0
skipped=0
missing=0

for dir in "$PROPS_DIR"/*/; do
  slug="$(basename "$dir")"
  # `extracted/` is our own output folder, never a property.
  [ "$slug" = "extracted" ] && continue

  if [ ! -f "$dir/brochure.pdf" ]; then
    echo "·  $slug — no brochure.pdf, skipping"
    missing=$((missing + 1))
    continue
  fi

  if [ -f "$EXTRACT_DIR/$slug.txt" ]; then
    echo "·  $slug — already extracted, skipping"
    skipped=$((skipped + 1))
    continue
  fi

  echo "→  $slug — extracting text + images…"
  mkdir -p "$EXTRACT_DIR/$slug"
  # Run from inside the property folder so the relative output paths below match
  # the pipeline contract exactly (../extracted is a sibling of the slug folders).
  (
    cd "$dir"
    pdftotext -layout brochure.pdf "../extracted/$slug.txt"
    pdfimages -all -p brochure.pdf "../extracted/$slug/img"
  )
  processed=$((processed + 1))
done

echo ""
echo "Done — extracted $processed new, skipped $skipped already-done, $missing folder(s) without a brochure.pdf."
if [ "$processed" -gt 0 ]; then
  echo "Total extracted text size:"
  du -sh "$EXTRACT_DIR"/*.txt 2>/dev/null | tail -n +1 || true
fi
