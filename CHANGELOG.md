# Changelog

All notable AVALON — Azur Lane Intelligence updates are recorded here. Dates are in the Asia/Manila timezone. Version numbers track the fan application's development, not Azur Lane game versions.

## [0.8.5] - 2026-11-11

### Added
- First-class **Augments** directory with 239 sourced modules and five October publisher-announced name-only entries, searchable by text, ID, compatible type and rarity, with progressive browsing.
- Original in-game augment icons from the explicit source `icon` field and 12 exact filename aliases. Art is shared across loadout tiles, alternatives and details. The independent MrLar CDN is not publisher-hosted.

### Corrected
- Escape and backdrop behavior in augment details; missing Progression navigation target; overstated Equipment Index search placeholder.
- Six additional published gear assessment instances are pinned to source equipment IDs and expected source titles/aliases. One newer Ta 152 review remains unpinned, so its icon is withheld instead of guessed.

### Verification scope
- Regression coverage for 239 source ID/icon mappings, all 12 source aliases, five announcement placeholders, directory/filters, dialog art, progression and source identity.
- CI and Pages deployment are pending verification. Live CDN success, numerical battle optimization, full augment skill effects and current acquisition costs are not claimed.

## [0.8.4] - 2026-11-11

### Corrected
- Aquila's assessment now follows her imported skill condition: **Fighter in aircraft slot two activates healing/shielding**, while **Dive Bomber activates preload/damage**. Both configurations are explicitly described, and a conflicting secondary guide is identified rather than treated as authoritative skill text.
- Replaced a mislabeled MK7 equipment assessment with the **Prototype Quadruple 305mm SKC39 Main Gun Mount**, source equipment ID **44320**, for the Series 8 Mecklenburg gun. Its displayed icon is accepted only when the catalog name and exact source ID agree.
- The lower ship **Equipment slots** section uses the same resolved source-backed slot model as the six-position planner, with source/provisional labels; stale Lycoris fallback names no longer contradict verified wiki/game slots.
- Each filled gear tile distinguishes a **Compatible candidate** from a saved **Personal pick**, without claiming reviewed best-in-slot quality. This is not an equipment-optimization release.

### Usability
- Removed the 50-choice dead end in the equipment alternatives drawer. Search by item name, type, rarity or ID and progressively reveal every eligible option without leaving the ship and slot.
- Constrained intrinsic grid widths and improved responsive ship profile, compact loadout, equipment filters and navigation at narrow widths. Desktop planner tiles gain width instead of forcing unreadable three-column names.
- Refreshed outdated Sources, README and app text about selective GroupID-verified wiki facts and existing limitations.

### Verification
- Added targeted regression tests for Aquila, exact equipment identity, all 152 slot candidates, slot consistency, selection status and escaping.
- Added a browser-based viewport smoke suite covering ship profiles, equipment filters and the alternatives drawer at **360, 390, 768, 1024 and 1280 px**. [PR checks](https://github.com/Avalon1230/avalon-azurlane/actions/runs/43043473875) and [merged-main checks](https://github.com/Avalon1230/avalon-azurlane/actions/runs/43043704582) passed: **178/178 unit tests, 15/15 five-viewport browser fixture checks**. [GitHub Pages deployment](https://github.com/Avalon1230/avalon-azurlane/actions/runs/43043703810) succeeded for v0.8.4 commit `65bec712`. Full live-site and complete-catalog visual certification were not performed.

## [0.8.3] - 2026-11-11

### Fixed
- Prefer exact ship, fully limit-broken slot arrays over lossy Lycoris display labels when wiki data is unavailable. Restores mixed aircraft mounts and corrects Langley's second slot from a destroyer gun to a fighter.
- Require equipment type/category agreement and preserve item hull exclusions. Exact ship slot arrays establish type eligibility without an additional broad hull-map exclusion.
- Parse exact Tempesta subclasses from GroupID-checked wiki facts. Unknown subclasses remain unfilled with a reason until verified, instead of pooling incompatible classes.
- Enforce source equipment limit groups across defaults, saved choices and alternatives; reserve valid personal choices before filling remaining slots.

### Verification
- Added real-source fixtures spanning 21 ships, multiple factions, unusual hulls and six wiki pages. All 170 tests pass locally.
- Reproducible audit checks all 894 ships, 936 equipment records and four modes, plus source identity of all 860 slot records and 239 augment records. With the verified wiki pages, 5,363/5,364 positions populate; Royal Fortune's augment remains unsupported. See docs/LOADOUT_AUDIT.md for conditional source coverage and provenance.

## [0.8.2] - 2026-11-11

### Fixed
- **Roster-wide ship loadout completion:** corrected the shared matcher for all 13 Lycoris equipment-slot labels (especially `Artillery (Destroyer)`, `Artillery (Pocket Battleship)`, `Torpedo (Submarine)`, and `Reconnaissance`), plus Koumakan wiki variants such as `CB Main Guns`, `DD Main Guns`, and limit-break suffixes. Previously 1,582/2,682 primary slot labels were unrecognized by the old dictionary.
- Added compact **exact numeric GroupID-matched five-slot metadata** from the May 2, 2026 AzurLaneData game snapshot: 860 verified source records, matching 852 of the current 894 indexed ships. These include both actual auxiliary slot types and exact hull codes, resolving Sailing Frigate subclasses in the dated source. The newer Lycoris roster continues to cover missing entries with conservative class-based fallbacks.
- Default source-matched candidates now populate primary and auxiliary equipment positions without repeating the same automatic auxiliary item. Choices are **planning candidates, not proven legal for every ship or best-in-slot**; ambiguous newer Sailing Frigate classes stay marked provisional.

### Added
- Dedicated **augment candidate support** using 239 source augments, exact internal ship-collection-ID exclusives and generic hull-type eligibility, with separate sourced stats/crafting details instead of treating augment IDs as ordinary equipment icons.
- Officially announced October 22, 2026 modules for five new Tempesta ships are surfaced by name and exact public ship GroupID, with item IDs, images and stats explicitly unverified because they postdate the May source snapshot.
- Roster-wide audit over 894 ships and 936 source equipment records: **893/894 ships now have six populated loadout choices (5,363/5,364 positions)**. Royal Fortune's augment remains unfilled because an eligible module could not be verified. Coverage represents candidate selection, **not** combat optimization, current availability or guaranteed item-specific legality.

### Tests
- New source-snapshot identity and slot coverage checks, all original Lycoris descriptor variants, multi-faction/hull matchers (CB, CV, SSV, Tempesta), augment type and ship-exclusivity, markup safety, and sixth-position fidelity.

## [0.8.1] - 2026-11-11

### Changed
- Replaced the tall ship loadout card stack with a responsive **three-column, two-row six-position planner** for standard ships: three source-described combat positions, two potential auxiliary positions and one separate augment position. Ship records with explicitly documented extra slots retain them rather than being forced into an incorrect six-slot template.
- Moved detailed per-slot reasoning, evidence, eligibility caveats, and source-matched alternatives into an on-demand slot intelligence drawer. Equipment icons still open the original equipment stats/acquisition drawer.
- Auxiliary positions not individually confirmed by the current ship dataset are clearly **provisional**, not auto-equipped; manually selected source/hull-matched auxiliaries remain labeled potential until verified. Augments are **not** inferred from generic gear: a Koumakan augment type is shown only as a category, never a specific recommended module.
- Preserved General/Boss/Mobbing/OpSi tabs, source-only recommendation gating, personal picks, official ship artwork, and ship profile identity card.

### Tests
- Added coverage for six visible positions, two provisional auxiliary slots, unknown augments, explicit extra source slots, manually chosen auxiliary candidates, responsive grid markup and on-demand evidence.

## [0.8.0] - 2026-11-11

### Added
- **Tactical Loadout Intelligence** panel beneath every detailed ship's fixed portrait/identity card. The separate official artwork gallery remains unchanged. Four switchable mission contexts: General, Boss, Mobbing, and OpSi.
- Equipment-slot-specific **source-matched candidates** generated from Lycoris ship slot categories and exact GroupID-verified Koumakan mount/efficiency facts when present. Eligible gear must match the original Fernando equipment type, source ID and recorded hull class after forbidden-hull restrictions; unknown/unsupported slots are marked unverified instead of filled with fictional gear.
- Real, clickable original equipment icons, explanations of verified slot/category/efficiency and available enhancement attributes, and an alternative selection drawer. Clicking equipment opens the existing source-stat/acquisition intelligence drawer **without navigating away** from the ship profile.
- Personal equipment picks saved in browser localStorage independently for each ship ID, mode and slot. Restored picks are revalidated against the current source category/hull constraints; users can reset a mode's picks.
- Source-confirmed wiki augment *type* may appear as a placeholder; actual augment eligibility and effects need separate verification.

### Evidence boundary
- Candidate ordering uses available source enhancement attributes (HIT for Boss, RLD for Mobbing, Anti-Siren for OpSi) when reported, with source rarity as a fallback. **These are NOT calculated damage, best-in-slot gear, validated slot exceptions, skill-timing synergy or simulated fleet optimization.** Every panel labels its evidence limitations and missing coverage.
- See `docs/TACTICAL_LOADOUTS.md` for the data contract and v0.8.1/v0.8.2 research requirements.

### Tests
- Added validation for exact slot aliases, wiki/ship identity matching, forbidden hulls, mode attribute evidence, saved override validation, safe fallback, fixed portrait/artwork layout, original icon actions and alternative drawer behavior.

## [0.7.9] - 2026-11-11

### Fixed
- Equipment inspection drawer now preserves the complete information table and other tall content through a dedicated, viewport-height scroll region. Flex children no longer shrink under `overflow:hidden`, fixing clipped stats rows at desktop and short/mobile viewports. Header and Close footer remain accessible while the body scrolls.
- Re-rendering the drawer after an acquisition lookup now retains its previous scroll position, including equipment opened through Tier Boards.

### Added
- Lazy, source-ID-specific **Where to obtain** section in equipment inspection. The read-only [AzurLaneData May 2, 2026 equipment-drop snapshot](https://github.com/Linuxxy0/AzurLaneData-2026-5-2-16-08-11/blob/main/data/equip_drops.json) supplies documented locations, tech boxes, research-series sources and Gear Lab recipe availability where recorded. Dataset ID 44320 (Prototype Quadruple 305mm SKC39) lists **Research (Series 8)**.
- Strict validation prevents guessing acquisition for unlisted, editorial, or malformed records. Loading failures have retry; the source date and event/server caveat always accompany acquisition text. This is not a live availability check or a complete/current farming guide.
- Ship Index nation rosters now use a compact, sticky search/sort toolbar with quick All/Vanguard/Main/Sub hull tabs and collapsible detailed hull/rarity filters. Existing nation-first landing, all hull types, rarity, sort direction, search and progressive scrolling remain available.

### Tests
- Validate acquisition lookup, source provenance, Gear Lab flags, missing data, safe escaping, viewport overflow styles and preserved ship filter options.

## [0.7.8] - 2026-11-11

### Changed
- Replaced the Equipment Index's large nation, type, hull, rarity, and sorting control rows with a **compact sticky search/sort toolbar** and eight broad equipment tabs: All, Guns, Torpedoes, Aircraft, AA, Auxiliary, ASW, and Special.
- Moved detailed nation-of-origin, potentially-compatible hull, source rarity, and exact equipment-type filters into a **collapsible advanced panel**, keeping active selections visible as removable chips and providing a reset control. No filters were discarded.
- Equipment now defaults to grouping by **specific equipment type** rather than nation; sorting is within each explicit group. Optional **All items (global sort)** compares source rarity (or name/type) across all nations and types. Also added Nation and Rarity grouping modes.
- Added optional conservative **Exact-name families**: multiple Fernando source records may be collapsed only when their normalized source name, equipment type, and nation agree. Shared icon filenames alone never create a family. Family inspection shows each original item and ID; no upgrade-tree or equivalence claim is made.
- Preserved original game artwork, accurate source rarity, 60-entry progressive scroll, ship browsing, existing equipment detail inspections, and mode-aware source disclaimers.

### Tests
- Added focused checks for broad type classification, exact-source family identification, global versus grouped ordering, filter visibility and escaping, family inspection, and scroll reachability.

## [0.7.7] - 2026-11-11

### Fixed
- Corrected original equipment icon resolution across the full index using Fernando2603/AzurLane's source `equipment_icon.json`, rather than assuming that an equipment item with ID `X` always uses `X.png`. **417 of 936** records intentionally share a different base icon filename. All 936 referenced icon filenames were verified against the host's Git image tree; network/display success remains subject to the third-party host.

### Changed
- Converted Equipment Index from large text-heavy cards and numbered pages to a dense, clickable gallery of genuine game equipment icons with rarity-appropriate colors. Selecting an item still opens the existing source-backed equipment inspection panel.
- Defaults to descending rarity (UR → SR → Elite → Rare → Common), with name/type sorting, reverse-order control, and source-only rarity filtering.
- Loads equipment in continuous 60-item batches on scroll, with an accessible Load More fallback; all matching records remain reachable without page navigation.
- Retains nation-of-origin browsing plus equipment-type and potentially compatible-hull filters, now presented as compact buttons. Hull eligibility remains source-supported *potential* compatibility, not a promise for every individual ship.

### Tests
- Verified icon alias mappings, safe source-ID validation, correct rarity ordering, filtering, compact card rendering, and full 936-record scroll reachability.

## [0.7.6] - 2026-11-10

### Fixed
- Repaired missing ship portraits throughout the **entire Ship Index**, not just Eagle Union. The previous iujab ship thumbnail inventory only matched 746 of 894 indexed ships.
- Added original in-game `shipyard.png` asset URLs using **source-ID-verified base skin IDs for all 894 ships** from the existing Fernando2603/AzurLane skin manifest; the images remain on the third-party host.
- Retained lightweight existing thumbnails where mapped and added automatic, single-retry original shipyard image fallback if the first image fails. Unknown or blocked assets still display readable hull/name placeholders instead of unrelated artwork.

### Verification
- Confirmed upstream `shipyard.png` filenames for missing Eagle Union examples: Collett, Vicksburg and Bennington, plus Royal Navy Griffin.
- Added regression checks for every indexed ship's base skin ID, exceptional cross-linked skin ordering and missing thumbnails from multiple factions.
- The 894 count refers to **verified source-ID mappings**, not 894 separately HTTP-validated or visually inspected remote PNG files.

## [0.7.5] - 2026-11-10

### Changed
- Ship rosters now open **sorted by rarity, highest first** (UR/DR → SR/PR → Elite → Rare → Common). Name and hull sorts and reverse direction remain available.
- Removed numbered ship pages: scrolling automatically reveals successive 60-portrait batches until every matching ship is accessible, with a manual load-more fallback for browsers without intersection observation.
- Reset the visible ship batch when nation/hull/rarity/search/sort filters change; preserve the loaded roster and scroll position when returning from a ship dossier.
- Equipment catalog pagination remains unchanged.

### Tests
- Verify rarity-first default, continuous reachability of all 894 sample ships, no ship page controls, and continued equipment pagination.

## [0.7.4] - 2026-11-10

### Fixed
- Strip MediaWiki HTML editor comments, including multiline and unterminated comments, before parsing ship infobox fields. Preserve original line boundaries so commented-out template fields cannot overwrite live data.
- Apply the wiki-comment cleanup to **all ship profiles**, preventing editorial section dividers and commented-out template fields from leaking into voice-actor names or other wiki-derived metadata. Guam was one reported example, not the scope of the fix.

### Tests
- Added regression cases using Guam as one example, plus hidden field assignments inside comments and stray trailing wiki comments. This tests the shared parser, not a ship-specific exception.

## [0.7.3] - 2026-11-10

### Fixed
- Corrected the Ship Index's **Ultra Rare/Decisive** card presentation to a distinct prismatic game-inspired gradient; **Elite remains purple** and Super Rare/Priority stays gold.
- Moved **Back to roster** and **Assign to fleet** into a separate top-level profile toolbar, outside the ship's portrait/identity card.

### Added
- Bounded, on-demand Koumakan MediaWiki `{{Ship}}`-template data resolver, validated against each ship's numeric **GroupID** before any wiki information is displayed.
- Wiki-verified **base, level 100, level 120, and level 125 stats** (where present), including additional ASW and oil consumption fields, armor, construction timer, illustrator, voice actor, and more useful identity facts.
- Equipment slot **maximum mount/aircraft counts**, unlocked equipment categories and efficiencies as the wiki specifies, wiki corroborated skill icons, fleet tech values, limit breaks, and availability history notes.
- Source annotations distinguish wiki 100-affinity/max-enhancement stat conventions from earlier Lycoris values. Unverified wiki records never overwrite existing fallback data.
- Regression coverage for stat discrepancies, source-ID validation, presentation and safer wiki loading.

### Still pending
- Fully parsed barrage damage tables, augment-module legality, alternative affinity/retrofit variants and comprehensive mechanical synergy modeling remain separate research work.
- Wiki data is loaded on demand per viewed ship; it is not a mass scrape or a permanently mirrored wiki database.

## [0.7.2] - 2026-11-10

### Fixed
- Replaced raw `*_rw.webp` and other incomplete game-client rendering layers in ship galleries with reconstructed, display-ready PNG paintings from a dedicated verified skin source. This corrects the New Jersey background-only example.
- Built an ID-keyed artwork manifest covering **894 ships and 2,613 skins** from Fernando2603/AzurLane, linking original extracted game artwork without storing image binaries. The skin index is lazily loaded on profile open.
- The art viewer now uses full-image contain scaling without cutting the illustration; the identity card no longer stretches to match the artwork panel's height.
- Broken primary paintings fall back only to an explicitly available `painting_n.png` variant, never to raw effect layers.

### Research
- Validated Koumakan's MediaWiki API from GitHub Actions (HTTP 200, CORS `*`, site-content rights metadata), and added a low-volume, on-demand **wiki-first default ship artwork resolver**. It queries image metadata only for a file referenced by the ship's wiki page; reconstructed PNGs remain fallbacks.
- Mapped the two formerly missing faction insignias using actual wiki imageinfo URLs: Kingdom of Tulipa (`Nl 1.png`) and Liga de Pedrería (`Ldp 1.png`). No invented symbols.
- Existing ship skills and stats remain sourced from Lycoris until a verified, permission-compatible wiki data pipeline exists.

## [0.7.1] - 2026-11-10

### Changed
- The ship profile now keeps the original shipyard portrait permanently visible, independent of selected skins.
- Artwork has its own in-profile display window with readable skin selectors. Selecting the artwork opens a larger overlay viewer with optional browser fullscreen and Close/Exit controls.
- The artwork viewer supports keyboard Escape, click-outside dismissal, viewport-responsive scaling, and graceful fallback text when images are unavailable.
- Ship image variants ending in `_rw.webp` may contain game-client render effects/layers rather than complete illustrations. When the source also provides a distinct static variant, AVALON prefers that image and attempts the other only if loading fails.
- Nation emblem initials no longer overlap translucent source insignias; unknown insignias use a neutral non-letter placeholder instead.
- Skin/level selection controls now use accessible, high-contrast buttons instead of near-white-on-white browser styles.

### Preserved
- All source artworks remain original game images; no AI substitutes.
- Existing ship profiles, deep links, stats, skill and equipment sections, roster browsing, and fleet assignments remain unchanged.

## [0.7.0] - 2026-11-10

### Changed
- Replaced the oversized three-column Ship Index roster cards with a dense, rarity-accented shipyard portrait gallery; selecting any ship opens its dedicated information page rather than a small inspection drawer.
- Converted ship hull selection, rarity filtering and source-supported sorting into compact, immediately accessible buttons (fleet groups/individual hulls; Common/Rare/Elite/SR/UR; Name/Rarity/Hull with reversible direction), while preserving nation-first navigation, search, and pagination.
- Individual ship profile URLs can be bookmarked as `#/ships/<source-id>`; returning to the roster retains the current nation and filtering state.

### Fixed
- Corrected the long-standing 890-vs-894 source-count discrepancy: four pairs of unrelated ships with identical display names (Enterprise, Neptune, Fubuki, Kasumi) were being merged incorrectly. Source numeric ID now determines identity, preserving all 894 records.

### Added
- Lazy on-demand loading of the full 894-record Lycoris-AzurAPI `ships.json` source only when a ship profile is requested (roughly 5 MB, cached for the browser session). This avoids delaying the initial gallery.
- Detailed ship profiles with original character art, optional skin selection, Lv.100/Lv.120 and available retrofit statistics, equipment slots/efficiencies, source skill descriptions, limit breaks, acquisition/construction, fleet-tech points, and links to Koumakan and source data.
- Fail-safe handling of unavailable detailed data, safe asset URL validation, escaped external text, and source ID-based lookup.
- Regression tests for compact ship cards, filtering/sorting, full profile data, loading and unavailable states, and unsafe content.

### Limitations
- This is source-backed **reference information**, not yet AVALON's own numerical synergy or loadout optimizer. Per-ship augment rules, barrage coefficients, certain equipment-slot exceptions and full Lv.125/affinity variations require additional verified datasets.
- The externally hosted full source file may be temporarily unavailable; the minimal ship gallery still works, and full profiles can be retried.

## [0.6.2] - 2026-11-10

### Changed
- Ship Index hierarchy: main game factions first, then META, Bulins (the source's Universal utility ships), and a single Collab roster containing all known crossover franchises.
- Preserve each crossover's original nationality/franchise in individual ship details, full-roster searching, and data records. No source nationality is overwritten.
- Enlarge faction insignias and place them against contrasting light panels with reduced padding, better legibility, and responsive card layouts. More scrolling is intentional.
- Remove repetitive source status, artwork and methodology disclaimers from the Overview, Ship Index, Equipment Index, Fleet Lab and Tier Boards. Full provenance, image rights, compatibility caveats, and data status remain accessible from Sources; brief warnings still appear if live data is unavailable.
- Move secondary assessment methodology into expandable help and simplify repeated labels on catalog cards and page headings.

### Added
- Regression tests covering source-preserving main/META/Bulins/Collab grouping, crossover search, icon mapping, lossless 894-source aggregation, and uncluttered catalog views.

### Unchanged
- Equipment nation/category/hull filtering, ship inspection/assignment, complete roster search and pagination, contextual rankings, provenance trails, browser-local plans, and documented data limitations.

## [0.6.1] - 2026-11-10

### Added
- Nation-first Ship Index: a compact faction registry with dynamically counted ship rosters, a cross-nation search box, and large clickable nation cards.
- Authentic in-game faction emblems from the Fernando2603/AzurLane nationality icon collection, with non-invented typographic fallbacks for factions without verified icon mappings.
- Dedicated ship-roster view after faction selection, including a one-click return to all nations.
- Regression tests for landing versus roster behavior, real emblem mappings, global search, no-result searches, and pagination.
- `docs/PROJECT_STATUS.md` for permanent GitHub-based development continuity.

### Preserved
- Ship hull filters, search, pagination, inspection, fleet assignment, and the existing Equipment Index's nation/category/hull filters.
- The original game image handling, deferred thumbnail loading, and source/provenance conventions.

### Limitations
- Faction icons are original game assets redistributed by an independent fan-data host, not first-party publisher-hosted media.
- Some newly introduced or special factions have no verified emblem mapping and display readable initials instead.
- Separate Augment Module categorization, ship-specific equipment legality, and numerical fleet optimization remain future work.

## [0.6.0] - 2026-11-10

### Fixed
- Removed the arbitrary 72-card Ship Index and Equipment Index cutoff. All 894+ ship records and 936 equipment records are now browseable through searchable, directly selectable pages.

### Added
- Nation/faction selector and nation-grouped results for ship and equipment indexes.
- Ship hull-type filter with full-roster search and combined filtering.
- Equipment nation-of-origin, equipment category and **potentially equippable by hull** filters, based on item type, forbidden hulls and actual ship slot-type data.
- Stable 60-record pagination with previous/next buttons, page jump, matching record totals, and persistent browsing within each index.
- Dated compact nationality snapshot across all 894 Lycoris ship IDs, plus sourced equipment origin and slot compatibility maps.
- Regression tests for missing/unknown nationalities, equipment forbidden hulls, filter combinations, and accessing records past item 72.
- [Catalog provenance and interpretation](docs/CATALOG_FILTERS.md).

### Limitations
- Potential hull compatibility means **at least one ship of that hull type has a matching equipment-slot type** and no explicit hull-level exclusion. Individual ship slot restrictions, gear-specific restrictions and unusual hulls still require verification.
- Nation snapshot is dated 2026-11-09; source data may advance independently. No new combat scores or assumed gear synergy are introduced.

## [0.5.1] - 2026-11-10

### Added
- Actual Azur Lane game-client **shipyard thumbnails** in ship catalogs, Fleet Lab slots, selection drawers, tier boards, reviewed assessments, and suggested fleet previews; no AI-generated illustrations.
- Original in-game **equipment icons** in the searchable equipment catalog, detail panel, and equipment assessment cards.
- Trusted-host, ID-validated image URLs with lazy loading and text fallbacks for missing/broken images.
- Documented rights, independent asset hosting, image coverage, privacy, and attribution in [docs/IMAGE_ASSETS.md](docs/IMAGE_ASSETS.md).
- Artwork mapping and HTML-safety regression tests.

### Fixed
- Connected the existing v0.5 Suggested Fleet module to Fleet Lab so users can generate, inspect, and apply suggestions from the website. The shipped module previously lacked the app entrypoint wiring.
- Connected owned-ship controls, scenario selection, and preview invalidation to the existing local-state workflow.

### Limitations
- These are game-authored images **extracted and independently hosted by fan projects**. The assets are not served by an official publisher site, nor does their availability grant a publisher license.
- Ship thumbnail audit: **746 of 894** indexed ships; equipment icons: **936 of 936** source records. Missing images show readable placeholders. Some retrofit names use their base-ship icons.
- Default ship portraits and gear icons are visual identification aids, not verified combat assessment inputs.

## [0.5.0] - 2026-11-10

### Added
- **Suggest a Fleet** interface in Fleet Lab: scenario selection, preview, review, and explicit Apply additions.
- A deterministic, global, **constraint-aware role-matching engine** using 39 manually reviewed candidate ships (including 17 added fallback catalog identities).
- Four-fleet Operation Siren joint assignments, submarine team, and source-linked role notes; no duplicate ships and correct hull compatibility.
- Owned-only ship pool, per-ship availability checkboxes, persistent availability preferences, and preservation of all existing manual fleet assignments.
- Incomplete-roster handling, role mismatch warnings, equipment-check advisories and safe stale-preview rejection.
- Source-based design notes and automated tests for matching, locked slots, owned-only constraints, duplicate prevention, fallback catalog integration and HTML safety.

### Limits and planned work
- **Qualitative prototype only**, not a simulated or verified strongest fleet. Skill timing, equipment-slot assignments, gear inventory, actual encounter modifiers and full Koumakan skill import remain unimplemented.
- Every ship's role tags are provisional; no numerical tier scores or fabricated DPS were added.
- The longer-term automatic skill/equipment synergy specification is in [docs/FLEET_OPTIMIZER_SPEC.md](docs/FLEET_OPTIMIZER_SPEC.md).

## [0.4.1] - 2026-11-10

### Added
- A low-volume, read-only Koumakan connectivity check in GitHub Actions that tests actual DNS, two wiki pages, and both candidate MediaWiki API locations.
- A workflow summary classifying genuine MediaWiki API responses, normal wiki pages, unrelated content, access challenges, and networking failures.
- A [documented ingestion strategy](docs/KOUMAKAN_ACCESS.md) separating wiki corroboration, versioned game facts, community research, and independent AVALON combat judgments.

### Verified
- A GitHub Actions runner successfully resolved Koumakan and accessed `/w/api.php` with HTTP 200 JSON. Musashi and Unicorn page IDs and Musashi page wikitext were returned from read-only API requests. Ordinary wiki URLs returned 403 and root `/api.php` returned 404.

### Clarified
- Previous crawler results are not proof that the live Koumakan wiki is broken; container DNS restrictions are not necessarily origin-server problems.
- Automated ingestion remains disabled until a valid access method and compatible reuse terms are verified. The diagnostic does not scrape or store wiki content.

## [0.4.0] - 2026-11-10

### Fixed
- Ship and Equipment boards now **tell readers what AVALON recommends**, instead of showing only source-grades or asking players to provide their own rankings.
- Kept the original two subjective boards editable; combat boards remain read-only and distinct.

### Added
- Initial **15 ship-scenario assessments and 8 gear-scenario assessments**, ordered by context-bound EX/S/A/B editorial grades.
- Role-based explanations, limiting conditions, alternative picks, multiple source links where available, confidence descriptors and review dates on each assessment.
- Game-mode filtering, search, and clear **Not Yet Evaluated** treatment for the many catalog entries without reviewed evidence.
- New provenance and rendering tests covering source integrity, mode boundaries, and untrusted text escaping.

### Limitations
- These are **provisional AVALON editorial syntheses**, not simulated damage/eHP, measured performance, or a universal tier list. Uncovered modes (for example PvP) intentionally show no ratings.
- Gear crafting recipes, complete roster coverage, detailed combat simulations, and an automated review/update pipeline are still not implemented.

## [0.3.1] - 2026-11-10

### Fixed
- Corrected combat tier list ownership: **ship and equipment recommendations are made by the system**, not manually ranked by the player. Their old personal-draft controls have been removed.
- Published combat recommendation pages are read-only. Earlier personal combat-tier draft assignments are ignored, preserving the separately stored Waifu and Headpats boards.

### Added
- Select, source-attributed REGAL single-wave boss assessments and Suchiguma campaign/research equipment recommendations, each shown with original source label, context, caveat, checked date, and link.
- Research scenarios, search, and explicit **Not Yet Evaluated** status for the remaining catalog.
- Tests enforcing read-only combat research, source attribution, and continued independence of personal character boards.

### Clarified
- External specialist grades are not independent AVALON calculations or universal tiers. Full mode-specific AVALON evaluation, validation and acquisition-cost scoring remain future work.

## [0.3.0] - 2026-11-10

### Added
- Four independent tier boards: Ship Combat, Equipment, Waifu Favorites, and Must Protect! — Headpats Division.
- Drag-and-drop tier placement with dropdown controls for keyboard/touch use.
- Search and type/hull filtering, separate browser-local persistence, clear-board confirmation, and per-board JSON export.
- Individually curated character eligibility: adult-portrayed favorites only in Waifu; wholesome, platonic Headpats division for the little ones. Childlike and unreviewed portrayals are excluded from the Waifu board by default.
- Automated tier model, character eligibility, sanitization, rendering, and state validation tests.

### Clarified
- No auto-assigned combat tiers. All ships and equipment begin unranked; the boards contain **personal drafts**, not independently validated AVALON rankings.
- Ship class is not an age or portrayal classifier. Both character eligibility catalogs are deliberately incomplete and subject to manual review.
- Character art and sprites remain excluded pending licensing/attribution checks.

## [0.2.1] - 2026-11-10

### Added
- Added this canonical changelog to track releases, fixes, and documentation changes.
- Added an **Updates** view to the live website, reading entries directly from this file.

### Clarified
- Corrected the Koumakan Wiki access warning: web crawler results showed unrelated literary text, but that does not establish the live wiki is broken. The cause is unverified, and user-side browser access works.
- Kept automated Koumakan ingestion paused pending reliable, repeatable API checks and reuse/attribution review.

## [0.2.0] - 2026-11-10

### Added
- Optional runtime ship index with up to 894 entries from the independent Lycoris-AzurAPI project.
- Optional runtime equipment index with up to 936 records from Fernando2603/AzurLane.
- Source-linked ship and equipment details, enhancement attributes, and data-source status indicators.
- Context-specific evaluation criteria across eight game modes; no fabricated scores.
- Data source contracts and extraction/licensing limitations documentation.

### Improved
- Preserved previous fleet assignments while external ship data is unavailable or still loading.
- Expanded automated test coverage to 12 checks.
- Published one feature commit and deployed successfully on GitHub Pages.

## [0.1.0] - 2026-11-10

### Added
- Initial responsive AVALON web interface, hosted on GitHub Pages.
- Eight game-mode categories: Campaign, Operation Siren, META Showdown, Exercises, Events & Archives, Challenge Mode, Daily Raids, and Guild Operations.
- Searchable unranked editorial catalog containing 22 example ships and 11 equipment entries.
- Interactive formation planner with hull-slot validation, duplicate-ship prevention, four OpSi fleets, local browser persistence, and JSON export.
- Project documentation, provenance standards, and automated tests.

### Notes
- Independent fan project. Historical ECTL is a reference only, not the name or endorsement of this site.
- Ratings, automated fleet optimization, audited skill calculations, and complete equipment-acquisition data are not implemented.
