#!/usr/bin/env bash
#
# extract-gallery.sh <slug> <path-to-brochure.pdf>
#
# Step 1 of the brochure -> gallery pipeline (see scripts/README.md).
# Extracts the raster images from a brochure PDF, filters them down to
# review-worthy photographs, and writes:
#
#   content/properties/<slug>/extracted-images/1.png ... N.png
#   content/properties/<slug>/extracted-images/contact-sheet.html   (review these)
#   content/properties/<slug>/image-selects.txt                     (edit, then publish)
#
# Nothing is published to the live site here — that's publish-gallery.sh, run
# after you've reviewed the contact sheet and pruned image-selects.txt.
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

if [ "$#" -ne 2 ]; then
  echo "usage: scripts/extract-gallery.sh <slug> <path-to-brochure.pdf>" >&2
  exit 2
fi

slug="$1"
pdf="$2"

if [ ! -f "$pdf" ]; then
  echo "ERROR: brochure not found: $pdf" >&2
  exit 1
fi
command -v pdfimages >/dev/null 2>&1 || { echo "ERROR: pdfimages (poppler-utils) not found." >&2; exit 1; }
command -v python3   >/dev/null 2>&1 || { echo "ERROR: python3 (with Pillow) not found." >&2; exit 1; }
python3 -c "import PIL" 2>/dev/null || { echo "ERROR: Python 'Pillow' (PIL) is required: pip3 install Pillow" >&2; exit 1; }

out="$ROOT/content/properties/$slug/extracted-images"
selects="$ROOT/content/properties/$slug/image-selects.txt"
mkdir -p "$ROOT/content/properties/$slug"

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

echo "→ $slug — extracting raster images from $(basename "$pdf")…"
# -png: write every embedded image as PNG (soft masks composited into alpha),
# so the filter below works on one consistent, lossless format.
pdfimages -png "$pdf" "$tmp/img"

echo "→ filtering…"
python3 "$SCRIPT_DIR/gallery_extract.py" --src "$tmp" --out "$out" --selects "$selects" --slug "$slug"

echo ""
echo "✓ $slug done."
echo "  Contact sheet : content/properties/$slug/extracted-images/contact-sheet.html"
echo "  Selects file  : content/properties/$slug/image-selects.txt"
echo "  Next: review the contact sheet, prune/order image-selects.txt, then:"
echo "        scripts/publish-gallery.sh $slug"
