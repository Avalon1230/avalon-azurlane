#!/usr/bin/env python3
"""Read-only low-volume check of Koumakan MediaWiki image metadata (no scraping or downloads)."""
import json
import urllib.parse
import urllib.request
import urllib.error

ENDPOINT = "https://azurlane.koumakan.jp/w/api.php"
UA = "AVALON-AzurLane-Research/0.7 (noncommercial fan wiki metadata audit)"


def query(**params):
    url = ENDPOINT + "?" + urllib.parse.urlencode({"action": "query", "format": "json", "formatversion": "2", **params})
    request = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    try:
        with urllib.request.urlopen(request, timeout=14) as response:
            raw = response.read(400_000)
            print("MediaWiki response", response.status, response.headers.get("Content-Type"), response.headers.get("Access-Control-Allow-Origin"))
        payload = json.loads(raw)
        if "error" in payload:
            print("API error:", payload["error"].get("code"), payload["error"].get("info"))
        return payload
    except (ValueError, urllib.error.URLError, TimeoutError) as error:
        print("Wiki request unavailable:", type(error).__name__, str(error)[:160])
        return {}


def main():
    site = query(meta="siteinfo", siprop="rightsinfo")
    print("Rights metadata:", json.dumps(site.get("query", {}), ensure_ascii=False)[:1000])
    page = query(prop="images", titles="New Jersey|Kingdom of Tulipa|Liga de Pedrería", imlimit="50")
    for record in page.get("query", {}).get("pages", []):
        print("Page:", record.get("title"), "missing:", bool(record.get("missing")))
        names = [file.get("title") for file in record.get("images", [])]
        print("Images (first 25):", names[:25])
    files = query(prop="imageinfo", titles="File:New Jersey.png|File:New_Jersey.png|File:Camplogo 郁金王国.png",
                  iiprop="url|mime|size|extmetadata")
    for record in files.get("query", {}).get("pages", []):
        info = record.get("imageinfo", [])
        print("Candidate:", record.get("title"), "missing:", bool(record.get("missing")))
        for item in info[:1]:
            print("File metadata:", json.dumps({k: item.get(k) for k in ("url", "mime", "size")})[:450])
    print("Read-only audit complete; API access does not establish copyright reuse rights.")


if __name__ == "__main__":
    main()
