# v0.8.11 CHRONICLE — developer verification and independent QA handoff

[PR #34](https://github.com/Avalon1230/avalon-azurlane/pull/34) is unmerged. These are developer verification results; independent QA and Commander authorization are still required.

## Reproduction and provenance

- Application implementation: `990d82f0def3c16e48cb86b1824b205eaf6d3b39`.
- [Passing full CI run 43815396818](https://github.com/Avalon1230/avalon-azurlane/actions/runs/43815396818); screenshot artifact `14202317207` (`chronicle-ui-screenshots`). The next commit adds evidence/documentation only; check the PR's head run for its final status.
- Captured by `scripts/events-interaction-smoke.mjs`, Chromium at 390×900 and 1280×900. Full-page images have a taller canvas. No composited mockups or generated artwork.
- Clock frozen at **2026-11-16 04:00:00 UTC / 12:00 Asia/Manila**. Screenshots use the unchanged production seed: eight identities, 34 occurrences. The separate synthetic launch/unlock/end fixture is never published as event data.
- Optional upstream JSON feeds are blocked deliberately. Ririsa/Mikari's owned profiles remain available; equipment choices may be empty in these offline captures. Artwork is requested from real source URLs with the production fallbacks. Missing banners retain neutral placeholders.
- All 18 captures were visually inspected. [Capture manifest](capture-manifest.json) records dimensions and SHA-256 hashes; [interaction report](report.json) records scenarios.

## Screenshot gallery

| Scene | Desktop (1280px) | Mobile (390px) |
| --- | --- | --- |
| Events: ongoing, upcoming and archive | [Full page](events-1280.png) | [Full page](events-390.png) |
| Featured event viewport | [View](featured-1280.png) | [View](featured-390.png) |
| Event detail and regional controls | [View](detail-1280.png) | [View](detail-390.png) |
| Obtainable ships, augments and cosmetics | [View](rewards-1280.png) | [View](rewards-390.png) |
| JP upcoming permanent addition, date TBA | [View](upcoming-jp-1280.png) | [View](upcoming-jp-390.png) |
| Historical occurrence timeline | [View](archive-1280.png) | [View](archive-390.png) |
| Original releases and reruns under one identity | [View](history-1280.png) | [View](history-390.png) |
| Ririsa profile and original artwork | [View](ririsa-1280.png) | [View](ririsa-390.png) |
| Mikari profile and original artwork | [View](mikari-1280.png) | [View](mikari-390.png) |

## Verified behavior

- 313 Node tests pass. Schema/source validation, ID reconciliation, regional offsets, date-only boundaries, TBA, maintenance, delays, revisions, expired events, hidden-tab resume, cosmetic separation and isolated persistence are covered.
- Actual application checks at 360/390/768/1280px cover navigation, search/filter/sort, archive/history, keyboard interaction, augment dialog focus/Escape, failed artwork, offline profiles, catalog failure/retry, no horizontal page overflow and unchanged saved-loadout storage.
- Controlled browser clocks cross exact launch, mission unlock and end boundaries; countdowns never become negative. Tests do not wait for real deadlines.
- Full existing CI passes: 63 viewport cases, ten combat sessions, four research sessions, ten current and ten baseline original-art sessions; syntax/generated-data, combat, research, research progression, portrait and CHRONICLE pinned-source checks.
- Original augment probes downloaded 16/16 images. Two external franchise logos downloaded; five returned HTTP 429 and are **not certified**. Neutral placeholders/fallbacks remain expected for unavailable external art.

## Review focus and coverage boundaries

Verify the [source audit and coverage ledger](../../EVENTS.md), especially separate EN/JP/CN end times, JP cosmetic sales expiry, CN-only exact midnight unlocks and the absence of predicted launch times. Challenge Ririsa/Mikari acquisition, skills and stats against the linked wiki revisions/client records. Confirm cosmetic gear skins remain outside combat equipment and reruns cannot revive an expired exchange shop.

Review desktop/mobile readability, long canonical ship-name wrapping, original art and navigation in the existing application. Approved PR/DR/META rules, research/statistics calculations, six-slot loadouts and Fleet Lab remain covered by the existing suites; these screenshots do not independently certify game combat performance.

Still missing: the full historical catalog, most regional permanent-addition dates, detailed stage/enemy/boss/drop/shop records, the featured story synopsis and furniture inventory, and exact unannounced EN/JP unlock hours. Outfit identities are recorded; additional outfit artwork galleries await verification. No unverified currency shop, drop rate or claim grace period is invented. Event-specific fleet recommendations remain deferred behind the existing evidence/simulation contracts.

Next maintenance steps: review official regional notices at each announced maintenance; append source-attributed schedule revisions; expand history in small audited year/event batches; reconcile upstream IDs without changing AVALON identities; run the documented CI and independent QA process for each update. No automatic announcement ingestion or scheduled maintenance job is claimed.
