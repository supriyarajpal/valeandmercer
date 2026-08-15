#!/usr/bin/env bash
#
# extract-brochures.sh — repeatable MULTI-DOCUMENT text ingestion (standing default).
#
# For every content/properties/<slug>/ folder this discovers EVERY PDF in the
# folder (recursively) — not just the one matched as "brochure" — including spec
# sheets, fact sheets / fact-finds, investor decks, additional brochures, rental
# letters and floorplan PDFs, and extracts each to a layout-preserving text file
# under content/properties/extracted/:
#
#   <slug>/brochure.pdf   ->  extracted/<slug>.txt          (+ embedded images)
#   <slug>/**/<doc>.pdf   ->  extracted/<slug>-<doc>.txt
#
# Identical PDFs (same md5) are extracted once. Extraction is per-document
# idempotent: a document whose .txt already exists is skipped, so a re-run only
# picks up newly-added documents. Pass --force to re-extract everything.
#
# IMPORTANT — authoring data.json: merge facts across ALL of a property's texts.
# When two documents conflict on the same fact, DO NOT silently pick one — record
# both with their source document and flag it (the same display-suppression
# approach used for Fountain Court's disputed unit split; see
# lib/developmentDisplay.ts / SUPPRESS_UNITMIX). Nothing is inferred or
# back-filled: a field the documents don't state is simply omitted.
#
set -euo pipefail

FORCE=0
[ "${1:-}" = "--force" ] && FORCE=1

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
mkdir -p "$EXTRACT_DIR"

# md5 of a file (macOS `md5 -q` vs GNU `md5sum`).
md5of() { if command -v md5 >/dev/null 2>&1; then md5 -q "$1"; else md5sum "$1" | awk '{print $1}'; fi; }

# doc-name from a PDF basename: lowercase, non-alnum → single hyphen, trimmed.
sanitize() { printf '%s' "$1" | tr '[:upper:]' '[:lower:]' | sed -E 's/\.pdf$//; s/[^a-z0-9]+/-/g; s/^-+//; s/-+$//'; }

total_docs=0; total_extracted=0; total_skipped=0; total_dupe=0; total_failed=0

for dir in "$PROPS_DIR"/*/; do
  slug="$(basename "$dir")"
  [ "$slug" = "extracted" ] && continue

  seen_md5=""            # newline-delimited hashes already extracted for this slug
  found=0; extracted=0; skipped=0; dupe=0

  while IFS= read -r -d '' pdf; do
    found=$((found + 1)); total_docs=$((total_docs + 1))

    h="$(md5of "$pdf")"
    if printf '%s\n' "$seen_md5" | grep -qxF "$h"; then
      echo "·  $slug — duplicate content, skipping: ${pdf#$dir}"
      dupe=$((dupe + 1)); total_dupe=$((total_dupe + 1)); continue
    fi
    seen_md5="$seen_md5"$'\n'"$h"

    # Primary brochure keeps the legacy <slug>.txt name (+ image extraction);
    # every other document becomes <slug>-<doc>.txt.
    if [ "$(basename "$pdf")" = "brochure.pdf" ] && [ "$(dirname "$pdf")" = "${dir%/}" ]; then
      out="$EXTRACT_DIR/$slug.txt"; is_brochure=1
    else
      out="$EXTRACT_DIR/$slug-$(sanitize "$(basename "$pdf")").txt"; is_brochure=0
    fi

    if [ "$FORCE" -eq 0 ] && [ -f "$out" ]; then
      echo "·  $slug — already extracted: $(basename "$out")"
      skipped=$((skipped + 1)); total_skipped=$((total_skipped + 1)); continue
    fi

    echo "→  $slug — ${pdf#$dir}  →  $(basename "$out")"
    # A single malformed PDF must not abort the whole run (set -e); skip it.
    if ! pdftotext -layout "$pdf" "$out" 2>/dev/null; then
      echo "!  $slug — pdftotext FAILED (corrupt/unreadable), skipping: ${pdf#$dir}"
      rm -f "$out"
      total_failed=$((total_failed + 1)); continue
    fi
    extracted=$((extracted + 1)); total_extracted=$((total_extracted + 1))

    if [ "$is_brochure" -eq 1 ]; then
      mkdir -p "$EXTRACT_DIR/$slug"
      pdfimages -all -p "$pdf" "$EXTRACT_DIR/$slug/img" 2>/dev/null || true
    fi
  done < <(find "$dir" -type f -iname '*.pdf' -print0)

  echo "   $slug: $found pdf(s) — $extracted extracted, $skipped already-done, $dupe duplicate(s)"
done

echo ""
echo "Done — $total_docs pdf(s) scanned: $total_extracted extracted, $total_skipped already-done, $total_dupe duplicate(s), $total_failed unreadable."
