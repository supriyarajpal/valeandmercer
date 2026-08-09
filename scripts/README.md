# Ingestion scripts

Tools for turning a developer's brochure PDF into a reviewed, published photo
gallery for a `/buy` development.

## The pipeline

```
drop brochure.pdf into content/properties/<slug>/
        │
        ▼
1. scripts/extract-gallery.sh <slug> <path-to-brochure.pdf>
        │   → content/properties/<slug>/extracted-images/1.png … N.png
        │   → content/properties/<slug>/extracted-images/contact-sheet.html
        │   → content/properties/<slug>/image-selects.txt   (pre-filled)
        ▼
2. REVIEW (manual)
        │   open the contact sheet, then edit image-selects.txt:
        │   delete the lines you don't want, and order the rest for display.
        ▼
3. scripts/publish-gallery.sh <slug>
        │   → copies approved images to public/images/developments/<slug>/1.png … N.png
        │   → sets that property's data.json "gallery" array
        ▼
   the /buy card + detail page now show the approved gallery.
```

Nothing reaches the live site until step 3. Steps 1–2 only write inside
`content/properties/<slug>/`, which is not committed to the repo — it's the raw
source/working area.

## 1. extract-gallery.sh

```
scripts/extract-gallery.sh <slug> <path-to-brochure.pdf>
```

Runs `pdfimages` to pull every embedded raster image out of the PDF (as PNG),
then filters them down to review-worthy photographs and writes the survivors,
numbered in brochure order, to `content/properties/<slug>/extracted-images/`,
along with:

- **`contact-sheet.html`** — a single page showing every survivor as a
  thumbnail with its filename and pixel dimensions. Open it in a browser to
  review.
- **`image-selects.txt`** — pre-filled with every survivor (one per line). This
  is what you edit in step 2. (A prior version is backed up to
  `image-selects.txt.bak` on re-run.)

**Filters applied** (see `gallery_extract.py` for the thresholds):

1. **Too small** — anything under **400px on its shorter side** is dropped.
2. **Extreme aspect** — anything more extreme than **3:1** (banner strips,
   rules, hairlines) is dropped.
3. **Recurring identical** — any image that is **byte-identical to another** is
   dropped entirely (logos and icons recur across pages; real photos don't).
4. **Near-duplicate** — the same photo embedded at several
   resolutions/crops is collapsed via a perceptual hash, **keeping the
   highest-resolution copy**.

## 2. Review (manual)

Open `content/properties/<slug>/extracted-images/contact-sheet.html`. In
`content/properties/<slug>/image-selects.txt`:

- **Delete** the lines for images you don't want (partial floor plans, awkward
  crops, anything with a logo baked in, stock/lifestyle shots you'd rather not
  use).
- **Order** the remaining lines in the site's photo-order convention — the
  publish step renders them in exactly this order:

  > **communal → living → kitchen → bedroom → bathroom → floor plan (last)**

Blank lines and `#` comments are ignored. Filenames are relative to
`extracted-images/`.

## 3. publish-gallery.sh

```
scripts/publish-gallery.sh <slug>
```

Reads `image-selects.txt` and, for the approved lines **in order**:

- copies each image from `extracted-images/` into
  `public/images/developments/<slug>/` renumbered `1.png … N.png`;
- points that property's `data.json` **`gallery`** array at the new files.

It publishes **only** what's listed in `image-selects.txt`. It replaces this
slug's own previously-published gallery photos (leaving `floorplan.*` and
anything non-numbered in place) and touches nothing else — no other property,
and no file that isn't part of the approved set.

The `/buy` pages read `data.json.gallery` when present (authoritative, ordered);
otherwise they fall back to the asset manifest
(`lib/developmentAssets.generated.json`). So publishing a gallery makes it live
with no code change.

## Requirements

- **poppler-utils** (`pdfimages`) — `brew install poppler`
- **Python 3** with **Pillow** — `pip3 install Pillow`

## Related

- `extract-brochures.sh` — the older, separate ingestion pass that runs
  `pdftotext` + `pdfimages` over each `brochure.pdf` into
  `content/properties/extracted/` for copywriting reference. That's for reading
  the brochure's text/spec; this gallery pipeline is for choosing and publishing
  its photographs.
