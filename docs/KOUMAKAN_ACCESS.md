# Koumakan access and AVALON's evidence pipeline

Last reviewed: 2026-11-10 (Asia/Manila)

## Problem

Our model-facing web retrieval indexed apparently unrelated literary prose under
Koumakan ship and homepage URLs, often from cached crawls months old. That
**does not prove** the live site serves that content or is down. The user
reports normal browsing access. Direct probes through the assistant's execution
environment failed DNS resolution for multiple public domains, not just Koumakan;
that environment is not a usable indicator of Koumakan's availability.

The website's MediaWiki API base path has not yet been established. The standard
possibilities are `https://azurlane.koumakan.jp/api.php` and
`https://azurlane.koumakan.jp/w/api.php`. Find the actual endpoint on the wiki's
Special:Version page rather than assuming either path.

## Diagnosis from an independent runner

Use the `Koumakan connectivity diagnosis` GitHub Actions workflow
(`.github/workflows/koumakan-connectivity.yml`). It makes **four read-only,
low-volume** requests from GitHub infrastructure, reports DNS/IP and response
status/content type/title or JSON site identity, and writes a compact GitHub
Action summary. It does **not** commit or reproduce site content. A successful
workflow execution means the probe ran, **not** necessarily that Koumakan was
reachable. Read the classifications in the run summary.

- `MEDIAWIKI_API`: a valid MediaWiki `action=query&meta=siteinfo` response; this
  is the preferred starting point for documented structured API access.
- `POSSIBLE_WIKI_PAGE`: page body looks relevant; check HTTP status and title.
- `UNRELATED_CONTENT`, `UNRECOGNIZED_HTML`, `POSSIBLE_CHALLENGE`:
  investigate response/cache behavior; do not ingest.
- `HTTP_ERROR`, `CONNECTION_ERROR`: check code, redirect, DNS and host policy.

A blocked route must not be evaded by spoofing a login session, CAPTCHA bypass,
or aggressive repeated requests. If automation is disallowed, seek permission
or use human-reviewed data already lawfully available under suitable terms.

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