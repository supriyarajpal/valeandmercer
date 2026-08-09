#!/usr/bin/env python3
"""Publish approved gallery images for a development.

usage: gallery_publish.py <data.json> <dest-dir> <url-prefix> <src1> <src2> ...

For each source image, in order, writes a web-optimised copy to
<dest-dir>/<N>.jpg (downscaled so the longest side is <= MAX px, re-encoded as
sRGB JPEG so anything the browser couldn't render — CMYK/16-bit PNGs — becomes
displayable and much smaller). Then sets the property's data.json "gallery"
array to the published paths, preserving every other field and key order.

Called by publish-gallery.sh — not meant to be run by hand.
"""
import json
import os
import sys

from PIL import Image, ImageOps

MAX = 2000       # longest side, px
QUALITY = 82     # JPEG quality (matches the rest of the site's imagery)

RESAMPLE = Image.Resampling.LANCZOS if hasattr(Image, "Resampling") else Image.LANCZOS


def main():
    if len(sys.argv) < 5:
        print("usage: gallery_publish.py <data.json> <dest-dir> <url-prefix> <src...>", file=sys.stderr)
        sys.exit(2)
    data_path, dest, prefix = sys.argv[1], sys.argv[2], sys.argv[3].rstrip("/")
    srcs = sys.argv[4:]

    os.makedirs(dest, exist_ok=True)
    gallery = []
    for i, src in enumerate(srcs, 1):
        im = Image.open(src)
        im = ImageOps.exif_transpose(im)      # honour any EXIF rotation
        if im.mode != "RGB":
            im = im.convert("RGB")            # flatten CMYK / palette / RGBA → sRGB
        im.thumbnail((MAX, MAX), RESAMPLE)    # only ever downscales
        out = os.path.join(dest, f"{i}.jpg")
        im.save(out, "JPEG", quality=QUALITY, optimize=True)
        gallery.append(f"{prefix}/{i}.jpg")

    with open(data_path, encoding="utf-8") as fh:
        data = json.load(fh)
    data["gallery"] = gallery
    with open(data_path, "w", encoding="utf-8") as fh:
        json.dump(data, fh, ensure_ascii=False, indent=2)
        fh.write("\n")

    print(f"  wrote {len(gallery)} optimised image(s) to {dest}")


if __name__ == "__main__":
    main()
