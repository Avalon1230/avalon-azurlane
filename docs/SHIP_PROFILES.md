# Ship Index Gallery and Source-backed Ship Profiles (v0.7.0)

## User experience

The Ship Index remains nation-first. Selecting a nation or searching globally now shows a **dense grid of clickable ship portraits** (rather than three oversized cards per row). Every portrait opens an in-app ship profile. Use **← Back to roster** to return to the same filtering context.

The roster offers immediate hull/index buttons (individual hull codes plus Vanguard/Main/Sub/Misc groups) and source-supported sort buttons for Name, Rarity and Hull, with ascending/descending direction. Do not display invented sorts such as owned ship level, affinity or morale until user-specific game-state data exists.

Direct profile links use `#/ships/<source-id>`, e.g. `#/ships/30715` for Amagi(CV). The URL refers to a source ID, not an unstable editorial array position.

## Data contract

The lightweight catalog still reads [Lycoris ship-list.json](https://github.com/iujab/Lycoris-AzurAPI/blob/main/data/ship-list.json).

When a ship profile is opened, the browser downloads the **full** [Lycoris ships.json](https://github.com/iujab/Lycoris-AzurAPI/blob/main/data/ships.json) and caches the parsed object in memory for that session. The roughly 5 MB file contains 894 records as verified on 2026-11-10. It is NOT bundled into this repository or downloaded on every roster navigation.

Rendered fields come from the full source, when present:

- Identification, rarity, class, hull and nation.
- Game-authored skin illustrations from allowlisted iujab paint assets.
- Level 100 and 120 stats (plus retrofit stat variants when provided).
- Equipment slot types and minimum/maximum efficiencies.
- English skill descriptions at source-supported level.
- Limit breaks, available construction information, acquisition sources and fleet technology when available.
- Direct, domain-validated Koumakan entry links for follow-up.

Imported values and text must be HTML-escaped, and image host/path validated. Missing data is missing—not an inferred zero, a made-up gear type, or a guessed skill.

## Coverage limitations and next phases

The full Lycoris model does **not yet supply every item shown in detailed Koumakan pages**. Specifically: verified ship-specific augment eligibility, certain limit-break slot conversion rules, level 125 and multiple affinity/awakening variants, detailed barrage hit coefficients, exact equipment loadout legality, historical acquisition availability, and numerical skill synergy need independent source ingestion and validation.

The ship profile contains source reference data and links, NOT a claim of mathematically optimized AVALON combat performance. Next: enrich with independently verified Koumakan/MW or game-data facts, then build exact ship-specific equipment legality and synergy reasoning without copying a tier list.

## Technical location

- `src/ship-roster.js`: compact accessible portrait tile.
- `src/catalog-index.js`: nation selection, filters, sort, pagination.
- `src/ship-factions.js`: nation grouping and source-supported hull/sort rules.
- `src/ship-profiles.js`: complete profile sections with escaped source data.
- `src/remote.js`: lazy full source loading and session caching.
- `src/app.js`: profile navigation, deep links, asynchronous data state and preserved roster state.
- `assets/styles.css`: responsive gallery and dossier layouts.

All changes require Node syntax verification and tests before merge. Unknown source records and unavailable full-data requests must fail visibly rather than silently inventing profiles.
