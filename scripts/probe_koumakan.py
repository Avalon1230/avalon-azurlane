"""Low-volume Koumakan connectivity diagnosis; no scraping or saved wiki body."""
from __future__ import annotations

import hashlib
import html
import json
import os
import re
import socket
import urllib.error
import urllib.request
from urllib.parse import urlencode

HOST = "azurlane.koumakan.jp"
BASE = "https://" + HOST
API_QUERY = urlencode({"action": "query", "meta": "siteinfo", "format": "json"})
PROBES = [
    ("wiki home", BASE + "/wiki/Azur_Lane_Wiki", "html"),
    ("ship page", BASE + "/wiki/Musashi", "html"),
    ("root API", BASE + "/api.php?" + API_QUERY, "api"),
    ("/w API", BASE + "/w/api.php?" + API_QUERY, "api"),
    ("ship metadata", BASE + "/w/api.php?" + urlencode({
        "action": "query", "prop": "info", "titles": "Musashi|Unicorn", "format": "json"
    }), "api-page"),
    ("ship wikitext", BASE + "/w/api.php?" + urlencode({
        "action": "parse", "page": "Musashi", "prop": "wikitext", "format": "json"
    }), "api-wikitext"),
]


def status_of_response(body: bytes, content_type: str, expectation: str) -> tuple[str, str]:
    if expectation.startswith("api"):
        try:
            obj = json.loads(body.decode("utf-8-sig"))
        except (UnicodeError, json.JSONDecodeError) as exc:
            return "INVALID_JSON", str(exc)[:80]
        if isinstance(obj, dict) and isinstance(obj.get("query"), dict) and "general" in obj["query"]:
            site = obj["query"]["general"]
            return "MEDIAWIKI_API", str(site.get("sitename", "?"))[:90]
        if expectation == "api-page" and isinstance(obj, dict) and isinstance(obj.get("query"), dict):
            pages = obj["query"].get("pages", {})
            found = [f"{v.get('title','?')} #{v.get('pageid','?')}" for v in pages.values()
                     if isinstance(v, dict) and "missing" not in v]
            return ("PAGE_METADATA", ", ".join(found)[:130]) if found else ("PAGE_NOT_FOUND", "No matching title")
        if expectation == "api-wikitext" and isinstance(obj, dict) and isinstance(obj.get("parse"), dict):
            parsed = obj["parse"]
            body = parsed.get("wikitext", {})
            text = body.get("*", "") if isinstance(body, dict) else ""
            return ("WIKITEXT_AVAILABLE", f"page={parsed.get('title','?')}, chars={len(text)}") if text else ("EMPTY_WIKITEXT", "No text returned")
        return "UNEXPECTED_JSON", ", ".join(obj.keys())[:80] if isinstance(obj, dict) else "Not a JSON object"
    text = body.decode("utf-8", errors="replace")
    title_match = re.search(r"<title[^>]*>(.*?)</title>", text, re.I | re.S)
    title = html.unescape(re.sub(r"\s+", " ", title_match.group(1))).strip() if title_match else "(no title tag)"
    if re.search(r"mustapha mond|winston smith|body is like|tarians or the law", text, re.I):
        return "UNRELATED_CONTENT", title[:100]
    if re.search(r"captcha|just a moment|checking your browser|cloudflare challenge", text, re.I):
        return "POSSIBLE_CHALLENGE", title[:100]
    if "azur lane" in text.lower() or "koumakan" in text.lower() or "musashi" in text.lower():
        return "POSSIBLE_WIKI_PAGE", title[:100]
    return "UNRECOGNIZED_HTML", title[:100]


def run() -> None:
    rows = []
    print(f"Target host: {HOST}")
    try:
        answers = sorted({x[4][0] for x in socket.getaddrinfo(HOST, 443, proto=socket.IPPROTO_TCP)})
        print("DNS addresses:", ", ".join(answers[:8]))
    except OSError as exc:
        print("DNS lookup failed:", type(exc).__name__, str(exc)[:180])
    for title, url, expected in PROBES:
        print("\nPROBE:", title, url)
        req = urllib.request.Request(url, headers={
            "User-Agent": "AVALON-AzurLane-Research/0.1 (GitHub: Avalon1230/avalon-azurlane; low-volume connectivity check)",
            "Accept": "application/json" if expected.startswith("api") else "text/html",
        })
        try:
            with urllib.request.urlopen(req, timeout=12) as response:
                code = response.status
                final_url = response.url
                content_type = response.headers.get("Content-Type", "")
                body = response.read(300_001)
            kind, detail = status_of_response(body, content_type, expected)
            print(f"HTTP: {code}, final URL: {final_url}, type: {content_type}")
            print(f"Bytes examined: {len(body)}, SHA-256: {hashlib.sha256(body).hexdigest()}")
            print(f"Classification: {kind}, detail: {detail}")
            rows.append((title, str(code), kind, detail))
        except urllib.error.HTTPError as exc:
            print("HTTP error:", exc.code, exc.reason)
            rows.append((title, str(exc.code), "HTTP_ERROR", str(exc.reason)[:80]))
        except (urllib.error.URLError, OSError, TimeoutError) as exc:
            print("Connection failed:", type(exc).__name__, str(exc)[:180])
            rows.append((title, "—", "CONNECTION_ERROR", type(exc).__name__))

    summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        with open(summary, "a", encoding="utf-8") as f:
            f.write("## Koumakan connectivity (diagnosis, not data ingestion)\n\n")
            f.write("| Check | HTTP | Classification | Detail |\n|---|---|---|---|\n")
            for check, code, kind, detail in rows:
                safe_detail = detail.replace("|", "\\|").replace("\n", " ")
                f.write(f"| {check} | {code} | {kind} | {safe_detail} |\n")
            f.write("\nNo page bodies are saved or committed. Classification is heuristic.\n")


if __name__ == "__main__":
    run()