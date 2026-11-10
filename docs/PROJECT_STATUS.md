# Project AVALON — Azur Lane Development Status

_Last updated: 2026-11-10 (Asia/Manila). This file is the permanent cross-conversation development handoff. Verify GitHub branch history and CI before treating reported status as shipped._

## Source of truth and current development

- Repository: https://github.com/Avalon1230/avalon-azurlane
- v0.7.0 delivered by [PR #4](https://github.com/Avalon1230/avalon-azurlane/pull/4), merged into main. **93/93 tests passed**, JavaScript syntax checks passed on feature branch [Actions run 42809749844](https://github.com/Avalon1230/avalon-azurlane/actions/runs/42809749844). GitHub Pages release deployment must be independently confirmed. See `docs/SHIP_PROFILES.md`.
- Live site: https://avalon1230.github.io/avalon-azurlane/
- Current release: **main / v0.7.2 / bd47e82ef1dd3d70d558d5be1bb34d9a4941adb8** (wiki-first default paintings, reconstructed skin gallery, faction icon completion, and profile-space fix, 2026-11-10).
- v0.7.2 merged in [PR #6](https://github.com/Avalon1230/avalon-azurlane/pull/6). **105/105 automated tests passed** and wiki metadata diagnostic succeeded on the feature branch ([quality run 42819356511](https://github.com/Avalon1230/avalon-azurlane/actions/runs/42819356511)). GitHub Pages publishing and browser visual confirmation need separate checking. The full 894-ship/2,613-skin artwork manifest is source-ID linked, wiki-backed default file metadata is preferred when verified, and Tulipa/Liga icons are now mapped. Lycoris remains the ship mechanics source pending provenance-aware wiki ingestion.
- v0.7.1 delivered in [PR #5](https://github.com/Avalon1230/avalon-azurlane/pull/5). **97/97 tests passed** and JavaScript syntax checks passed on [GitHub Actions run 42812385606](https://github.com/Avalon1230/avalon-azurlane/actions/runs/42812385606). Changes are merged; deployment and browser visual verification should be checked independently.
- Release PR [#2](https://github.com/Avalon1230/avalon-azurlane/pull/2) merged into `main`. Main factions → META → Bulins → Collab; authentic emblems enlarged and contrasted; routine source disclaimers consolidated under Sources while functional warnings remain.
- Previous PR [#1](https://github.com/Avalon1230/avalon-azurlane/pull/1) shipped v0.6.1, now superseded by v0.6.2.
- Verified v0.6.2 PR checks: **80/80 tests passed** and `npm run check` succeeded ([GitHub Actions #42804415298](https://github.com/Avalon1230/avalon-azurlane/actions/runs/42804415298)); merge succeeded. Verify merged main build/deployment separately.
- Last baseline upstream coverage: 894 Lycoris source IDs and 936 Fernando equipment records. One UI screenshot displayed 890 indexed ships; **investigate, do not assume cause**.

## Product objective and decisions

AVALON is an **independent**, explainable Azur Lane intelligence platform covering the full game (campaign, OpSi, META, PvP, events, guild, submarines, progression and future modes). It is not ECTL, a wiki clone, or a Chapter 15-only project. Analysis must be independently reasoned, transparently sourced, mode-aware, and uncertainty-labeled. Combat ranks are not crowdsourced user drafts. Character favorites remain independent and childlike/minor-presenting portrayals are excluded from sexualized ranking. Use genuine game artwork/assets, not AI-generated substitutes. Make actual repository changes rather than mockups when implementation is requested.

## Architecture

- GitHub Pages static site, ES modules, no front-end framework/build step.
- `index.html`: shell and navigation; `assets/styles.css`: design system.
- `src/app.js`: navigation, state, event delegation, local persistence, data loading, rendering.
- `src/catalog.js`, `src/remote.js`, `src/catalog-filters.js`: editorial data, optional remote normalization/merge, nation and equipment filters.
- `src/catalog-index.js`: ship/equipment index display, search, pagination and nation selection.
- `src/ship-roster.js`: dense accessible ship portrait tiles; `src/ship-profiles.js`: ship data, profile rendering, stats/skills/gear/acquisition; `src/remote.js`: lazy full ship data fetch and caching.
- `src/nation-emblems.js`: authentic nation-emblem mapping, safe markup, unsupported-icon fallbacks (v0.6.1 candidate).
- `src/media.js`: ship/equipment image host validation and fallback.
- `src/fleet-suggest.js`, `src/fleet-suggest-view.js`: first deterministic, qualitative, role-based fleet suggestions.
- `src/assessments.js`, `src/tiers.js`: evidence-linked combat assessments and separate personal character boards.
- `tests/`: Node built-in `node:test`. CI `.github/workflows/quality.yml` runs `npm run check` and `npm test` on PRs and main.

## Completed and planned behavior

**Shipped in v0.6.0:**
- Large browsable ship/equipment catalogs with dynamic source records and 60-item pagination.
- Source-backed nation and hull/category filters.
- Full-game mode registry and browser-local Fleet Lab planning with four OpSi surface fleets.
- Suggested formations using 39 curated candidate profiles, review-before-apply flow, duplicate prevention, and owned-only preferences.
- Original game-asset thumbnails and equipment icons with source attribution and fallbacks.
- Provisional, context-specific, evidence-linked AVALON combat assessments and independent character favorite boards.

**Delivered in v0.6.1–v0.7.0:**
- Replace initial Ship Index grid with compact nation/faction selection cards.
- Show original game-client nationality emblems (independent community host), dynamic counts, global search, and text fallback for unverified factions.
- Open filtered ship roster on nation click; keep hull filtering, search, pagination, inspect/assign, and a return-to-nations control.
- Preserve the existing Equipment Index behavior.
- Add new tests, docs, release notes and this handoff.
- Quality workflow verified; PR #1 merged. Visual browser/phone inspection of live deployment is still recommended.
- v0.7.0 Ship Index nation rosters now use dense, rarity-accented clickable portraits; ship dossiers have direct source-ID links and real sourced stats, skills, equipment efficiencies, acquisition, skins, limit breaks and fleet tech. Full detail feed is requested lazily on opening a ship. Button filters include hull groups, rarity and sort by name/rarity/hull. Duplicate-name source IDs now remain distinct; 890-vs-894 import bug corrected.

## Research data / external integration

- Lycoris-AzurAPI: ship identities and nationality snapshot.
- Fernando2603/AzurLane: equipment records and original equipment/nationality icons; see `docs/IMAGE_ASSETS.md`, `docs/CATALOG_FILTERS.md`.
- iujab/azurlane-images: original ship thumbnails; coverage at previous audit 746 of 894.
- Koumakan Wiki: source confirmation via MediaWiki API was previously demonstrated by GitHub Actions. Automatic ingestion remains disabled pending validated access, schema and reuse rights. See `docs/KOUMAKAN_ACCESS.md`.
- Community guides and expert assessments are evidence, **not** an unexamined AVALON ranking.

## Known limitations and unresolved work

1. Resolved in v0.7.0 candidate: 890 vs 894 resulted from four same-name pairs (Enterprise, Neptune, Fubuki, Kasumi) merged by name instead of distinct source IDs. Source-ID-aware importer now preserves all four pairs; validate live count after deployment.
2. No complete ship-specific equipment slot/restriction model. "Equippable by hull" means potentially eligible for some ships of that class, not verified for all.
3. **Augment Modules need their own category and data integration**, not treatment as generic auxiliary equipment.
4. Skill timing, interactions, exact fleet synergy, full numerical damage/eHP modeling, optimized automatic gear loadouts, gear ownership, and Gear Lab workflows are not yet implemented.
5. Many ships lack complete portraits/reviewed assessments; faction icons for special nations without verified game data fall back to initials.
6. External art and data are third-party mirrors and may be incomplete, removed or out of date.

## Next development steps

0. v0.7.0 PR passed 93/93 tests and merged. Confirm final GitHub Pages deployment and visually inspect desktop/mobile gallery and profiles, including bookmarked ship links, skins, sorting/filtering and roster return.

0. Verify v0.6.2 GitHub Pages deployment and inspect live desktop/mobile visuals, particularly enlarged faction emblem contrast, category navigation, Collab search, Bulins and the Sources panel. Automated quality checks passed.
1. Confirm GitHub Pages deployment for the merged v0.6.1 version and visually verify the nation-first interface on desktop/mobile.
2. Confirm navigation and layouts in the live site at desktop/mobile widths, all recorded factions, search, hull filtering, all pages and ship actions.
3. Investigate 890 vs 894 index count with reproducible normalization/merge tests.
4. Add Augment Modules as their own equipment category with trusted source data and correct eligibility.
5. Begin exact ship-specific slot/loadout compatibility and richer ship profiles; preserve source provenance.
6. Build the cross-ship skill/equipment synergy model and improve fleet optimizer, following `docs/FLEET_OPTIMIZER_SPEC.md`.

## Continuity protocol

When a new conversation starts: retrieve relevant prior decisions, inspect latest commits/branches/PRs, read this file and CHANGELOG, compare code against claims, and resume the current task. Never silently reset to older milestones or claim tests/deployment without verification. Update this handoff after substantial development.

## Artwork UI follow-up

- Confirm images for New Jersey (`10517`), Amagi(CV) (`30715`), and other static/Live2D skins in a browser. Static alternatives may not exist for every source painting; do not claim visual completeness without review.
- On mobile and desktop, confirm artwork lightbox opens, closes and enters/exits fullscreen; the base ship portrait must never change with skin selection.
