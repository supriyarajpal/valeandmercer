#!/usr/bin/env python3
"""Filter pdfimages output down to review-worthy gallery photos.

Invoked by scripts/extract-gallery.sh (which runs pdfimages first). Reads every
PNG in --src, drops non-photo assets, deduplicates, and writes the survivors to
--out numbered sequentially, plus a contact sheet and a pre-filled selects file.

Filters (in order):
  1. Size      — reject anything under MIN_SHORT px on its shorter side.
  2. Aspect    — reject anything more extreme than MAX_ASPECT:1 (banner strips,
                 hairlines, rules).
  3. Recurring — reject every copy of any image that is byte-identical to
                 another (logos/icons recur across pages; real photos don't).
  4. Near-dup  — collapse near-identical images (same photo embedded at several
                 resolutions/crops) via a perceptual dHash, keeping the
                 highest-resolution copy of each group.
"""
import argparse
import glob
import hashlib
import html
import os
import shutil
from collections import Counter

from PIL import Image

MIN_SHORT = 400          # px, shorter side
MAX_ASPECT = 3.0         # longer / shorter
NEAR_THRESHOLD = 6       # max Hamming distance (of a 64-bit dHash) to treat as the same photo

RESAMPLE = Image.Resampling.LANCZOS if hasattr(Image, "Resampling") else Image.LANCZOS


def dhash(img, size=8):
    """64-bit difference hash — robust to scaling, so the same photo at different
    embedded resolutions hashes to (near-)identical values."""
    g = img.convert("L").resize((size + 1, size), RESAMPLE)
    px = list(g.getdata())
    bits = 0
    for row in range(size):
        base = row * (size + 1)
        for col in range(size):
            bits = (bits << 1) | (1 if px[base + col] > px[base + col + 1] else 0)
    return bits


def hamming(a, b):
    return bin(a ^ b).count("1")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", required=True, help="dir of raw pdfimages PNGs")
    ap.add_argument("--out", required=True, help="dir to write numbered survivors + contact sheet")
    ap.add_argument("--selects", required=True, help="path to the image-selects.txt to (re)generate")
    ap.add_argument("--slug", required=True)
    args = ap.parse_args()

    raw = sorted(glob.glob(os.path.join(args.src, "*.png")))
    recs = []
    for f in raw:
        try:
            im = Image.open(f)
            im.load()
        except Exception:
            continue
        w, h = im.size
        with open(f, "rb") as fh:
            digest = hashlib.md5(fh.read()).hexdigest()
        recs.append({"file": f, "w": w, "h": h, "byte": digest, "phash": dhash(im), "area": w * h})

    byte_counts = Counter(r["byte"] for r in recs)

    reasons = Counter()
    kept = []
    for r in recs:
        short, long = min(r["w"], r["h"]), max(r["w"], r["h"])
        if short < MIN_SHORT:
            reasons["too_small"] += 1
            continue
        if long / short > MAX_ASPECT:
            reasons["extreme_aspect"] += 1
            continue
        if byte_counts[r["byte"]] > 1:
            reasons["recurring_identical"] += 1
            continue
        kept.append(r)

    # Near-dup collapse: process highest-resolution first so the copy we keep for
    # each group is the largest one.
    survivors = []
    for r in sorted(kept, key=lambda x: -x["area"]):
        if any(hamming(r["phash"], s["phash"]) <= NEAR_THRESHOLD for s in survivors):
            reasons["near_duplicate"] += 1
            continue
        survivors.append(r)

    # Number in document (extraction) order — the natural top-to-bottom brochure
    # order, easiest to review; the reviewer reorders in image-selects.txt.
    order = {f: i for i, f in enumerate(raw)}
    survivors.sort(key=lambda r: order[r["file"]])

    # Fresh output: clear prior numbered survivors + contact sheet only.
    os.makedirs(args.out, exist_ok=True)
    for old in glob.glob(os.path.join(args.out, "*.png")) + glob.glob(os.path.join(args.out, "contact-sheet.html")):
        os.remove(old)

    written = []
    for i, r in enumerate(survivors, 1):
        name = f"{i}.png"
        shutil.copy(r["file"], os.path.join(args.out, name))
        written.append((name, r["w"], r["h"]))

    write_contact_sheet(os.path.join(args.out, "contact-sheet.html"), args.slug, written)
    write_selects(args.selects, args.slug, written)

    print(f"  raw extracted : {len(recs)}")
    print(f"  too small     : {reasons['too_small']}  (< {MIN_SHORT}px short side)")
    print(f"  extreme aspect: {reasons['extreme_aspect']}  (> {MAX_ASPECT:.0f}:1)")
    print(f"  recurring dup : {reasons['recurring_identical']}  (byte-identical, appears >1x)")
    print(f"  near-duplicate: {reasons['near_duplicate']}  (same photo, lower-res copy)")
    print(f"SURVIVED={len(written)} RAW={len(recs)}")


def write_contact_sheet(path, slug, written):
    cells = []
    for name, w, h in written:
        cells.append(
            f'<figure><a href="{html.escape(name)}" target="_blank">'
            f'<img src="{html.escape(name)}" loading="lazy" alt="{html.escape(name)}"></a>'
            f'<figcaption>{html.escape(name)}<span>{w}&times;{h}</span></figcaption></figure>'
        )
    doc = f"""<!doctype html>
<meta charset="utf-8">
<title>Contact sheet — {html.escape(slug)}</title>
<style>
  body {{ font-family: -apple-system, system-ui, sans-serif; background:#1b1712; color:#ece7df; margin:0; padding:24px; }}
  h1 {{ font-weight:400; font-size:18px; letter-spacing:.02em; margin:0 0 4px; }}
  p.sub {{ color:#8b8175; font-size:12px; margin:0 0 24px; }}
  .grid {{ display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:20px; }}
  figure {{ margin:0; background:#241f18; border:1px solid #352e24; border-radius:8px; overflow:hidden; }}
  figure img {{ display:block; width:100%; height:200px; object-fit:contain; background:#120f0c; }}
  figcaption {{ display:flex; justify-content:space-between; gap:8px; padding:8px 12px; font-size:12px; color:#b3a99b; }}
  figcaption span {{ color:#8b8175; }}
  a {{ color:inherit; text-decoration:none; }}
</style>
<h1>{html.escape(slug)} — {len(written)} images survived the filter</h1>
<p class="sub">Review these, then delete the ones you don't want from image-selects.txt (and order the rest for display) before running publish-gallery.sh.</p>
<div class="grid">
{os.linesep.join(cells)}
</div>
"""
    with open(path, "w") as fh:
        fh.write(doc)


def write_selects(path, slug, written):
    # Back up any prior (possibly hand-edited) selects file before regenerating.
    if os.path.exists(path):
        shutil.copy(path, path + ".bak")
    lines = [
        f"# image-selects.txt — {slug}",
        "# One approved image per line, in DISPLAY ORDER.",
        "# Convention: communal -> living -> kitchen -> bedroom -> bathroom -> floor plan LAST.",
        "# Delete the lines you don't want; reorder the rest. Blank lines and #comments are ignored.",
        "# Filenames are relative to extracted-images/. Then run: scripts/publish-gallery.sh " + slug,
        "",
    ]
    lines += [name for name, _w, _h in written]
    with open(path, "w") as fh:
        fh.write(os.linesep.join(lines) + os.linesep)


if __name__ == "__main__":
    main()
