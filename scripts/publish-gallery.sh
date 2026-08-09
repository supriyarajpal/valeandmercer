#!/usr/bin/env bash
#
# publish-gallery.sh <slug>
#
# Step 3 of the brochure -> gallery pipeline (see scripts/README.md). Run AFTER
# you've reviewed the contact sheet and pruned/ordered image-selects.txt.
#
# Reads content/properties/<slug>/image-selects.txt (approved filenames, one per
# line, in DISPLAY ORDER), copies ONLY those images from extracted-images/ into
# public/images/developments/<slug>/ renumbered 1..N, and points that property's
# data.json "gallery" array at the new files.
#
# It only publishes what's listed in image-selects.txt. It replaces this slug's
# own published gallery photos (keeping floorplan.*), and touches nothing else.
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

if [ "$#" -ne 1 ]; then
  echo "usage: scripts/publish-gallery.sh <slug>" >&2
  exit 2
fi
command -v python3 >/dev/null 2>&1 || { echo "ERROR: python3 not found." >&2; exit 1; }

slug="$1"
selects="$ROOT/content/properties/$slug/image-selects.txt"
extracted="$ROOT/content/properties/$slug/extracted-images"
dest="$ROOT/public/images/developments/$slug"
data="$ROOT/content/properties/$slug/data.json"

[ -f "$selects" ]   || { echo "ERROR: no image-selects.txt for $slug — run extract-gallery.sh first." >&2; exit 1; }
[ -d "$extracted" ] || { echo "ERROR: no extracted-images/ for $slug — run extract-gallery.sh first." >&2; exit 1; }
[ -f "$data" ]      || { echo "ERROR: no data.json for $slug." >&2; exit 1; }

# Read approved filenames in order (skip blank lines and #comments).
approved=()
while IFS= read -r line || [ -n "$line" ]; do
  line="${line%%$'\r'}"                       # strip CR (in case of CRLF)
  case "$line" in ''|\#*) continue ;; esac    # skip blanks/comments
  trimmed="$(echo "$line" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"
  [ -z "$trimmed" ] && continue
  if [ ! -f "$extracted/$trimmed" ]; then
    echo "ERROR: approved image not found: extracted-images/$trimmed" >&2
    exit 1
  fi
  approved+=("$trimmed")
done < "$selects"

if [ "${#approved[@]}" -eq 0 ]; then
  echo "ERROR: image-selects.txt for $slug has no approved images (all lines removed?)." >&2
  exit 1
fi

echo "→ $slug — publishing ${#approved[@]} approved image(s)…"
mkdir -p "$dest"

# Replace this slug's prior published GALLERY photos (numbered files) while
# leaving floorplan.* and anything non-numbered untouched.
find "$dest" -maxdepth 1 -type f -name '[0-9]*.png' -delete 2>/dev/null || true
find "$dest" -maxdepth 1 -type f -name '[0-9]*.jpg' -delete 2>/dev/null || true
find "$dest" -maxdepth 1 -type f -name '[0-9]*.jpeg' -delete 2>/dev/null || true

gallery_paths=()
i=0
for name in "${approved[@]}"; do
  i=$((i + 1))
  cp "$extracted/$name" "$dest/$i.png"
  gallery_paths+=("/images/developments/$slug/$i.png")
done

# Point data.json "gallery" at the new files (data.json is otherwise untouched).
python3 "$SCRIPT_DIR/gallery_publish_data.py" "$data" "${gallery_paths[@]}"

echo "✓ $slug — published $i image(s) to public/images/developments/$slug/ and updated data.json gallery."
