#!/usr/bin/env python3
"""Set a development data.json's "gallery" array to the given image paths.

usage: gallery_publish_data.py <data.json> <path1> <path2> ...

Only the "gallery" key is changed; every other field and the key order are
preserved (gallery is appended if it doesn't already exist). Called by
publish-gallery.sh — not meant to be run by hand.
"""
import json
import sys


def main():
    if len(sys.argv) < 3:
        print("usage: gallery_publish_data.py <data.json> <path...>", file=sys.stderr)
        sys.exit(2)
    data_path = sys.argv[1]
    paths = sys.argv[2:]

    with open(data_path, encoding="utf-8") as fh:
        data = json.load(fh)

    data["gallery"] = paths  # preserves existing key order; appends if new

    with open(data_path, "w", encoding="utf-8") as fh:
        json.dump(data, fh, ensure_ascii=False, indent=2)
        fh.write("\n")


if __name__ == "__main__":
    main()
