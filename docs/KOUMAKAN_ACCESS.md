# Koumakan access and AVALON's evidence pipeline

Last reviewed: 2026-11-10 (Asia/Manila)

## Problem

Our model-facing web retrieval indexed apparently unrelated literary prose under
Koumakan ship and homepage URLs, often from cached crawls months old. That
**does not prove** the live site serves that content or is down. The user
reports normal browsing access. Direct probes through the assistant's execution
environment failed DNS resolution for multiple public domains, not just Koumakan;
that environment is not a usable indicator of Koumakan's availability.

**Resolved November 10, 2026:** a GitHub Actions runner successfully requested
`https://azurlane.koumakan.jp/w/api.php` using MediaWiki's Action API and received
HTTP 200, `application/json`, and `sitename: Azur Lane Wiki`. The `/api.php` root
returned HTTP 404 and ordinary `/wiki/...` pages returned 403 for that runner.

A second run confirmed `action=query&prop=info` returns Musashi (page 59391)
and Unicorn (page 465), and `action=parse&page=Musashi&prop=wikitext` returns
4,385 characters of page source. This proves the API allows selected
read-only page retrieval; it does not establish unrestricted bulk access,
site licensing, or that the page data has been accurately parsed. See the
[successful diagnostic run](https://github.com/Avalon1230/avalon-azurlane/actions/runs/42780862193).

## Diagnosis from an independent runner

Use the `Koumakan connectivity diagnosis` GitHub Actions workflow
(`.github/workflows/koumakan-connectivity.yml`). It makes **six read-only,
low-volume** requests from GitHub infrastructure, reports DNS/IP and response
status/content type/title or JSON site identity, and writes a compact GitHub
Action summary. It does **not** commit or reproduce site content. A successful
workflow execution means the probe ran, **not** necessarily that Koumakan was
reachable. Read the classifications in the run summary.

- `MEDIAWIKI_API`: a valid MediaWiki `action=query&meta=siteinfo` response; this
  is the preferred starting point for documented structured API access.
- `PAGE_METADATA` or `WIKITEXT_AVAILABLE`: wiki pages were found and their page source can be read; template interpretation is still required.
- `POSSIBLE_WIKI_PAGE`: page body looks relevant; check HTTP status and title.
- `UNRELATED_CONTENT`, `UNRECOGNIZED_HTML`, `POSSIBLE_CHALLENGE`:
  investigate response/cache behavior; do not ingest.
- `HTTP_ERROR`, `CONNECTION_ERROR`: check code, redirect, DNS and host policy.

A blocked route must not be evaded by spoofing a login session, CAPTCHA bypass,
or aggressive repeated requests. If automation is disallowed, seek permission
or use human-reviewed data already lawfully available under suitable terms.

## Confirmed limited artwork integration (2026-11-10)

A new read-only GitHub Actions probe (`.github/workflows/wiki-assets-audit.yml`) successfully used the Koumakan MediaWiki Action API at `/w/api.php` with `origin=*`. Responses were HTTP 200, JSON, with CORS `Access-Control-Allow-Origin: *`. The API's site `rightsinfo` advertises Creative Commons Attribution-NonCommercial-ShareAlike 4.0 for wiki content; this does not itself grant copyright permissions over extracted game art.

AVALON's `src/wiki-artwork.js` now performs only **on-demand** artwork metadata lookups for a ship being viewed. It verifies the ship's MediaWiki page references the exact matching `File:<Ship Title>.png` before requesting the file's `imageinfo` URL. URLs are strictly restricted to the wiki's recognized image CDNs. New Jersey's verified default illustration is `https://azurlane.netojuu.com/images/9/9e/New_Jersey.png`.

The same API supplied verified source image URLs for faction emblems previously missing from the Ship Index:
- Kingdom of Tulipa: `File:Nl 1.png` → `https://azurlane.netojuu.com/images/4/4c/Nl_1.png`.
- Liga de Pedrería: `File:Ldp 1.png` → `https://azurlane.netojuu.com/images/1/1b/Ldp_1.png`.

**Boundary:** The API metadata lookup is *not* an audited bulk importer of ship stats, skills, barrage tables, equipment data, or complete skin galleries. Those fields continue to use existing source datasets and reconstructed painting links until access terms, provenance, game-version reconciliation and data structure are reviewed. Do not describe the complete AVALON database as wiki-hosted yet.

## Ship template enrichment (2026-11-10)

AVALON now retrieves *individual* ship info via MediaWiki `action=parse&page=<ship title>&prop=wikitext&origin=*`. A limited schema audit verified Amagi(CV) (GroupID 30715) and New Jersey (GroupID 10517) expose regular `{{Ship}}` parameters for stats through Lv.125, armor, oil consumption, equipment types/mount counts/efficiencies, skill icon IDs, constructor timing, and limit breaks. Because the wiki and Lycoris present different affinity/enhancement bases, wiki stat figures are preferred only for explicitly validated GroupIDs and labeled accordingly. Page content remains attributed to its original wiki; the runtime keeps only per-session data and does not build a bulk mirror.

Current limitations include page templates that do not match the observed schema and unparsed barrage HTML tables. If a wiki response is invalid or unavailable, the app continues with existing Lycoris data and displays its source basis. Original wiki art rights remain distinct from the site's CC BY-NC-SA 4.0 text rights metadata.

## Proposed analysis architecture (not yet implemented)

1. **Versioned game facts:** use attributed original game data when legally
   reusable (EN vs CN/JP, game version, update date). Capture ship skills,
   efficiencies, barrage coefficients, stats, equip slots, weapons, armor,
   enemy data and crafting recipes. Keep game facts separate from opinions.
2. **Wiki corroboration:** use confirmed MediaWiki API access to verify English
   mechanics, page revision IDs, nomenclature, equipment availability and
   counterexamples. Observe wiki API etiquette, license and robots/access terms.
3. **Independent evidence:** compare multiple current specialist guides,
   testing notes, logs and source context; do not equate popularity with proof.
4. **AVALON assessments:** evaluate *mode + role + enemy + investment*; explain
   relative damage/survivability/utility, assumptions, alternatives and
   confidence. Mark unreviewed combinations `Not Yet Evaluated`.
5. **Publication:** produce audited, timestamped outputs with source IDs,
   source revisions/versions and reproducible tests; never silently upgrade
   unverified guesses into authoritative scores.

Until a legitimate structured feed exists, do not link a stale third-party
snapshot to a current combat recommendation as if it were live game data.