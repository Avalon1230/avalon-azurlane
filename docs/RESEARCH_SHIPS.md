# Research ships — v0.8.8

Research brings PR and DR ships together in one Ship Index filter. It works with nation, hull, rarity, collaboration and text filters; a Series selector narrows the same results. Exact game GroupIDs in the research registry identify ships. Rarity alone never enables a research frame or modal.

The gold PR and prismatic DR frames are original AVALON SVG ornaments: compass crowns, stepped rails and corner filigree. They sit over the portrait edges without replacing official character art. No REGAL assets are included.

## What works

- 47 research identities across Series 1–9, with classification and series labels on profiles.
- Research & Development opens from Acquisition. All 376 shipyard missions show objectives, Commander-level requirements, prerequisite task IDs and time gates from the same pinned client revision.
- Manual research start time, countdowns and mission completion checkboxes persist in `avalon.research.v1`. Time gates count from the ship's research start, not from completing the previous task. A passed gate never checks off a task. The last two missions can share a gate.
- Dev 0–30 controls, with Fate 0–5 only for the 34 ships whose client records list Fate stages. Fate requires Dev 30. These are local planning selections, not a game-account connection.
- 41 ship-specific milestone sets from the licensed May snapshot. Missing milestone descriptions stay missing, including Champagne and the five Series 9 ships. Later client Fate availability does not manufacture missing milestone descriptions.
- Scrollable dialogs, Close/Back/Escape, focus return and a keyboard focus loop; four responsive application interaction widths are exercised in CI.

## Deliberate limits

**Completed-stage progression stats are implemented for all 47 ships.** The selected Dev/Fate state updates statistics, weapon mounts/preloads/efficiencies and unlocked skill descriptions. Level tabs use exact per-form growth at 100 affinity; impossible combinations and missing data show an explanation. [Formula, source identities and numerical QA references](RESEARCH_STATISTICS.md). Blueprint totals/costs, partial blueprint progress, other affinity settings and partial per-objective XP/count tracking remain unimplemented.

For research ships, the existing combat comparison is available only at the reference selection, Dev 30 / Fate 0. Other selections add `combatUnsupportedReason` to the shared loadout model. The evaluator checks that reason before producing numbers. This does not certify every reference ship or add unsupported equipment families: all v0.8.7 data checks still apply. Saved gear is never rewritten by a progression change.

Research Academy projects and Shipyard missions are distinct. Some Shipyard objectives require completing Academy projects; the dialog shows that requirement without turning Academy project durations into Shipyard mission timers. Completion tracking is manual and can record progress already made in-game.

## Sources, dates and permissions

Checked **2026-11-12**. Exact IDs and SHA-256 checksums live in `src/research-manifest.js`.

| Source | Pinned version | Use |
| --- | --- | --- |
| [EN client blueprint records](https://github.com/AzurLaneTools/AzurLaneLuaScripts/blob/3fb6befa2f969bd879de2341cdf41a571852a95f/EN/sharecfg/ship_data_blueprint.lua) | `3fb6befa2f969bd879de2341cdf41a571852a95f`; Git blob `9e1fdddd1abbd53e48deed9b11938dc76ff4c17a` | GroupIDs, series, unlock requirements, mission IDs/gates, Fate stage IDs |
| [Matching client tasks](https://github.com/AzurLaneTools/AzurLaneLuaScripts/blob/3fb6befa2f969bd879de2341cdf41a571852a95f/EN/sharecfgdata/task_data_template.lua) | Same commit; Git blob `f7d69a4f364508b58cefbd7fa3c657e20bf9c399` | Task objectives, Commander levels and prerequisites |
| [MrLar-derived ship snapshot](https://github.com/Linuxxy0/AzurLaneData-2026-5-2-16-08-11/blob/3deb898433a03ed3d7d7ff877f0d1a9b505dfd44/data/ships.json) | `3deb898433a03ed3d7d7ff877f0d1a9b505dfd44`, May 2, 2026 | 41 exact-ID `plan-class` records, PR/DR corroboration and milestone descriptions; MIT attribution in THIRD_PARTY_NOTICES |
| Existing Lycoris ship records | Existing 894-ship catalog snapshot | English display identities, classification and R&D acquisition metadata, joined to exact client GroupID |
| [Official Series 8 announcement](https://azurlane.yo-star.com/news/2025/07/09/maintenance-notice-7-10-12-a-m-utc-7/) and [Series 9 announcement](https://azurlane.yo-star.com/news/2026/07/08/maintenance-notice-7-9-12-a-m-utc-7-2/) | Published July 2025 / July 2026 | Independent release/classification corroboration |

The client extraction repository has no LICENSE at the checked root. This project includes only selected factual identifiers, gate values, progression attributes and functional requirements/skill descriptions, not a copy of the client scripts, flavor text or proprietary graphics. This is **not** a claim that the client code is openly licensed. The MIT snapshot's license does not grant rights to game artwork. Existing official-art sourcing is unchanged. See `THIRD_PARTY_NOTICES.md`.

These are pinned snapshots, not a live guarantee of current server behavior. Wiki searches were attempted but did not return reliable research pages in this environment; no new wiki-derived values are claimed. Conflicting, missing or later data requires another source review.

## Verification and handoff

`node scripts/verify-research-source.mjs` downloads and checks all three pinned datasets, then compares 47 blueprint records, 376 objectives/gates/prerequisites and 41 milestone sets. `--local` uses the ignored `.audit` source cache. It checks extraction accuracy, not real-game battle behavior.

`tests/research-ships.test.js` covers exact identity, intersecting filters, ornaments, malformed state, Fate availability, milestone gaps, timers, storage isolation and combat rejection. `scripts/research-interaction-smoke.mjs` runs actual app handlers at 360, 390, 768 and 1280 pixels using isolated catalog fixtures. Existing combat and responsive suites still run. CI also runs two profiles against live catalogs and official portraits (Neptune at 1280px and Drake at 390px), and publishes screenshots for independent visual review. The dialog regression checks scroll and focused control after completing its last mission. `verify-research-progression.mjs` checks ten pinned client files and reproduces all calculated source records. Original ornaments remain the fallback because no isolated in-game PR/DR frame asset with verified identity and provenance is available in the checked project catalog; this is not a claim of an exhaustive asset search.

QA should compare mission gates against the game, review whether the original ornaments meet the intended portrait style, exercise manual dates/reload and keyboard navigation, and challenge the numerical reference cases and stage-specific skill replacements. Progression-aware battle calculations and blueprint totals remain follow-up work; v0.9 fleet timing and equipment competition remain separate work. No merge without Commander authorization after independent QA.
