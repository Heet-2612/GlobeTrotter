#!/usr/bin/env python3
"""
fetch_city_images.py

Reads city names from cities.txt (one per line) and, for each city,
resolves a REAL, API-verified Wikimedia image URL (never a guessed/
constructed URL) using the public Wikipedia/MediaWiki API.

Strategy per city
------------------
1. Resolve the city name to an actual Wikipedia article title
   (following redirects). If the exact title doesn't exist, fall back
   to Wikipedia's search API to find the best-matching article.
2. Ask the API for that page's lead "page image" (the same image
   shown in the article's infobox) via prop=pageimages, requesting
   the ORIGINAL (full resolution) file -- this URL comes directly
   from the API response, never guessed.
3. If that lead image is portrait-oriented (or missing), look through
   the other images actually used on that page (prop=images), fetch
   each candidate's real metadata via prop=imageinfo (which returns
   the true upload.wikimedia.org URL + dimensions), and prefer the
   first landscape-oriented, reasonably large photo. Generic files
   (icons, logos, maps, flags, svg diagrams, audio) are filtered out
   by filename heuristics.
4. Every candidate URL is verified with a live HTTP request before
   being accepted. If nothing reliable is found, the row is written
   with EMPTY.

Only Python standard library is used (urllib, json, csv, time, re).

Output
------
- city_images.csv       columns: City,DirectWikimediaImageURL
- Progress printed to stdout as each city is processed, plus a final
  summary count.
"""

import csv
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

INPUT_FILE = "cities.txt"
OUTPUT_FILE = "city_images.csv"

WIKIPEDIA_API = "https://en.wikipedia.org/w/api.php"

# Wikimedia's API etiquette requires a descriptive User-Agent identifying
# the tool and a contact point. Replace the email with your own contact
# if you plan to run this at any real volume: https://meta.wikimedia.org/wiki/User-Agent_policy
USER_AGENT = "CityImageFetcher/1.0 (contact: your-email@example.com)"

REQUEST_DELAY_SECONDS = 0.4          # delay between API calls (rate-limit friendly)
MIN_LANDSCAPE_WIDTH = 500            # minimum acceptable width for a landscape candidate
MAX_IMAGE_CANDIDATES_TO_CHECK = 8    # how many in-page images to inspect before giving up
HTTP_TIMEOUT_SECONDS = 15

# Filenames matching these patterns are skipped -- they are essentially
# never a representative "photo of the city" (icons, logos, flags, maps,
# coat of arms, diagrams, audio pronunciation files, etc.)
SKIP_FILENAME_PATTERNS = re.compile(
    r"(flag|coat_of_arms|seal_of|logo|icon|map|locator|location_map|"
    r"symbol|emblem|\.svg$|\.ogg$|\.oga$|\.wav$|\.gif$|pronunciation|"
    r"wiktionary|wikimedia|commons-logo|edit-icon|question_mark|"
    r"disambig)",
    re.IGNORECASE,
)


# ---------------------------------------------------------------------------
# Low-level HTTP helpers
# ---------------------------------------------------------------------------

def api_get(params: dict) -> dict:
    """Call the MediaWiki API and return the parsed JSON response."""
    params = dict(params)
    params["format"] = "json"
    url = WIKIPEDIA_API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=HTTP_TIMEOUT_SECONDS) as resp:
        return json.loads(resp.read().decode("utf-8"))


def url_is_accessible(url: str) -> bool:
    """Verify a direct image URL actually resolves with a live request."""
    if not url:
        return False
    try:
        req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=HTTP_TIMEOUT_SECONDS) as resp:
            return 200 <= resp.status < 300
    except urllib.error.HTTPError as e:
        # Some servers don't support HEAD -- retry with a ranged GET.
        if e.code == 405:
            try:
                req = urllib.request.Request(
                    url,
                    headers={"User-Agent": USER_AGENT, "Range": "bytes=0-0"},
                )
                with urllib.request.urlopen(req, timeout=HTTP_TIMEOUT_SECONDS) as resp:
                    return 200 <= resp.status < 300 or resp.status == 206
            except Exception:
                return False
        return False
    except Exception:
        return False


# ---------------------------------------------------------------------------
# City -> Wikipedia article resolution
# ---------------------------------------------------------------------------

def resolve_article_title(city: str) -> str | None:
    """
    Return the best-matching real Wikipedia article title for a city name,
    following redirects. Falls back to the search API if there's no exact
    (or redirect-resolved) title match.
    """
    # Step 1: try the exact title, following redirects.
    try:
        data = api_get(
            {
                "action": "query",
                "titles": city,
                "redirects": 1,
            }
        )
        pages = data.get("query", {}).get("pages", {})
        for page_id, page in pages.items():
            if page_id != "-1" and "missing" not in page:
                return page.get("title", city)
    except Exception:
        pass

    # Step 2: fall back to full-text search and take the top hit.
    try:
        data = api_get(
            {
                "action": "query",
                "list": "search",
                "srsearch": city,
                "srlimit": 1,
            }
        )
        results = data.get("query", {}).get("search", [])
        if results:
            return results[0]["title"]
    except Exception:
        pass

    return None


# ---------------------------------------------------------------------------
# Image resolution
# ---------------------------------------------------------------------------

def get_lead_image(title: str) -> dict | None:
    """
    Return the article's lead/infobox image at full resolution via
    prop=pageimages (piprop=original). This is a real API-resolved URL.
    """
    try:
        data = api_get(
            {
                "action": "query",
                "titles": title,
                "prop": "pageimages",
                "piprop": "original",
                "redirects": 1,
            }
        )
        pages = data.get("query", {}).get("pages", {})
        for page in pages.values():
            original = page.get("original")
            if original and original.get("source"):
                return {
                    "url": original["source"],
                    "width": original.get("width", 0),
                    "height": original.get("height", 0),
                }
    except Exception:
        pass
    return None


def list_page_images(title: str) -> list:
    """Return candidate File: filenames actually used on the article page."""
    try:
        data = api_get(
            {
                "action": "query",
                "titles": title,
                "prop": "images",
                "imlimit": 20,
                "redirects": 1,
            }
        )
        pages = data.get("query", {}).get("pages", {})
        filenames = []
        for page in pages.values():
            for img in page.get("images", []):
                name = img.get("title", "")
                if name and not SKIP_FILENAME_PATTERNS.search(name):
                    filenames.append(name)
        return filenames
    except Exception:
        return []


def get_file_info(filename: str) -> dict | None:
    """Resolve a File: title to its real direct URL + dimensions."""
    try:
        data = api_get(
            {
                "action": "query",
                "titles": filename,
                "prop": "imageinfo",
                "iiprop": "url|size|mediatype",
            }
        )
        pages = data.get("query", {}).get("pages", {})
        for page in pages.values():
            infos = page.get("imageinfo", [])
            if infos:
                info = infos[0]
                if info.get("mediatype") == "BITMAP" and info.get("url"):
                    return {
                        "url": info["url"],
                        "width": info.get("width", 0),
                        "height": info.get("height", 0),
                    }
    except Exception:
        pass
    return None


def find_best_image_for_city(title: str) -> str | None:
    """
    Try the lead image first; if it's missing or portrait-oriented,
    scan other real images used on the page for a landscape candidate.
    Returns a verified, accessible direct image URL, or None.
    """
    candidates = []

    lead = get_lead_image(title)
    if lead:
        candidates.append(lead)

    is_landscape = (
        lead is not None
        and lead["width"] > 0
        and lead["height"] > 0
        and lead["width"] >= lead["height"]
        and lead["width"] >= MIN_LANDSCAPE_WIDTH
    )

    if not is_landscape:
        time.sleep(REQUEST_DELAY_SECONDS)
        filenames = list_page_images(title)
        checked = 0
        for filename in filenames:
            if checked >= MAX_IMAGE_CANDIDATES_TO_CHECK:
                break
            time.sleep(REQUEST_DELAY_SECONDS)
            info = get_file_info(filename)
            checked += 1
            if not info:
                continue
            candidates.append(info)
            if (
                info["width"] > 0
                and info["height"] > 0
                and info["width"] >= info["height"]
                and info["width"] >= MIN_LANDSCAPE_WIDTH
            ):
                # Found a good landscape candidate -- verify and use it.
                if url_is_accessible(info["url"]):
                    return info["url"]

    # No landscape candidate confirmed -- fall back to the best
    # available candidate (e.g. the lead image, even if portrait),
    # as long as it's a real, verified, accessible URL.
    for info in candidates:
        if url_is_accessible(info["url"]):
            return info["url"]

    return None


# ---------------------------------------------------------------------------
# Main driver
# ---------------------------------------------------------------------------

def load_cities(path: str) -> list:
    with open(path, "r", encoding="utf-8") as f:
        return [line.strip() for line in f if line.strip()]


def main():
    try:
        cities = load_cities(INPUT_FILE)
    except FileNotFoundError:
        print(f"ERROR: could not find '{INPUT_FILE}' in the current directory.")
        sys.exit(1)

    total = len(cities)
    success_count = 0
    empty_count = 0

    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as csv_file:
        writer = csv.writer(csv_file)
        writer.writerow(["City", "DirectWikimediaImageURL"])

        for idx, city in enumerate(cities, start=1):
            image_url = ""
            try:
                title = resolve_article_title(city)
                time.sleep(REQUEST_DELAY_SECONDS)

                if title:
                    found_url = find_best_image_for_city(title)
                    if found_url:
                        image_url = found_url
            except Exception as e:
                # Never let one city's failure stop the whole run.
                print(f"[{idx}/{total}] {city} -> ERROR ({e})")
                writer.writerow([city, ""])
                empty_count += 1
                time.sleep(REQUEST_DELAY_SECONDS)
                continue

            writer.writerow([city, image_url])
            csv_file.flush()

            if image_url:
                success_count += 1
                print(f"[{idx}/{total}] {city} -> OK")
            else:
                empty_count += 1
                print(f"[{idx}/{total}] {city} -> EMPTY")

            time.sleep(REQUEST_DELAY_SECONDS)

    print()
    print(f"Total cities: {total}")
    print(f"Successful: {success_count}")
    print(f"Empty/failed: {empty_count}")
    print(f"\nOutput written to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
