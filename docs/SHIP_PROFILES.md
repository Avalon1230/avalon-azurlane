# Ship Index Gallery and Source-backed Ship Profiles (v0.7.2)

## User experience

The Ship Index remains nation-first. Selecting a nation or searching globally now shows a **dense grid of clickable ship portraits** (rather than three oversized cards per row). Every portrait opens an in-app ship profile. Use **← Back to roster** to return to the same filtering context.

The roster offers immediate hull/index buttons (individual hull codes plus Vanguard/Main/Sub/Misc groups) and source-supported sort buttons for Name, Rarity and Hull, with ascending/descending direction. Do not display invented sorts such as owned ship level, affinity or morale until user-specific game-state data exists.

Direct profile links use `#/ships/<source-id>`, e.g. `#/ships/30715` for Amagi(CV). The URL refers to a source ID, not an unstable editorial array position.

## Reconstructed painting source (v0.7.2)

The raw WebP skin files provided by iujab can include a background and effects **without the character** (verified by the New Jersey screenshots). Changing `_rw.webp` to another raw variant was not sufficient.

AVALON now uses a deliberately small, locally versioned **metadata index** `data/ship-artwork.json` built from [Fernando2603/AzurLane `ship_skin.json`](https://github.com/Fernando2603/AzurLane/blob/main/ship_skin.json): **894 ship IDs and 2,613 named skin IDs** matched exactly against the existing Lycoris index on 2026-11-10. The upstream community project reconstructed `images/skin/<skin_id>/painting.png` for display. For entries that also list `painting_n.png`, this image may be tried on network failure. The viewer never falls back to the incomplete raw WebP render layer.

No artwork binaries are copied to AVALON. All image URLs are constrained to the verified Fernando game-asset path; the manifest itself contains only numeric IDs, names, and source-listed `painting_n` availability. The browser lazily fetches the ~89 KB index after a ship profile is opened. The profile then uses original game-client artwork links from the independent source. Full image containment and smaller non-stretched identity cards reduce cropping and dead space.

**Koumakan as research authority:** The wiki is excellent for complete ship mechanics and accurate gallery validation, but previously tested direct page retrieval had restrictions. A GitHub Actions read-only MediaWiki API audit checks per-file metadata and reuse information. We will not assert unrestricted wiki scraping or republication rights without verification. The Lycoris data remains the source for current ship statistics, gear slots and skill text until a validated wiki-backed ingestion pipeline is implemented.

## Artwork behavior (v0.7.1)

The source shipyard portrait is fixed in the profile identity panel; selecting a skin does not change the portrait. A **separate Artwork panel** displays the selected original game illustration with high-contrast skin buttons. Clicking the art opens a centered lightbox with a native-browser **Fullscreen / Exit fullscreen** toggle, Close control and Escape handling. If an artwork fails to load, the viewer tries an explicitly source-listed alternate; otherwise it displays a clear unavailable message. Profile stats and fleet information remain accessible.

Some game-client paintings with `_rw.webp` suffix contain isolated Live2D rendering layers or effects rather than the full assembled character. These raw assets are no longer chosen in the gallery. Source-listed reconstructed PNG paintings are used instead. Source URLs remain allowlisted and escaped. This does **not** mean every upstream artwork is complete; additional visual audits can improve coverage.

Nation logos no longer have source-name abbreviations superimposed. If the source emblem is unavailable, a neutral placeholder is shown instead of inventing a faction insignia.

## Data contract

The lightweight catalog still reads [Lycoris ship-list.json](https://github.com/iujab/Lycoris-AzurAPI/blob/main/data/ship-list.json).

When a ship profile is opened, the browser downloads the **full** [Lycoris ships.json](https://github.com/iujab/Lycoris-AzurAPI/blob/main/data/ships.json) and caches the parsed object in memory for that session. The roughly 5 MB file contains 894 records as verified on 2026-11-10. It is NOT bundled into this repository or downloaded on every roster navigation.

Rendered fields come from the full source, when present:

- Identification, rarity, class, hull and nation.
- Reconstructed original game-client illustrations from the source-ID-linked Fernando skin catalog.
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
- `src/artwork-catalog.js` + `data/ship-artwork.json`: verified reconstructed skin IDs and lazily loaded artwork metadata.
- `src/remote.js`: lazy full source loading and session caching.
- `src/app.js`: profile navigation, deep links, asynchronous data state and preserved roster state.
- `assets/styles.css`: responsive gallery and dossier layouts.

All changes require Node syntax verification and tests before merge. Unknown source records and unavailable full-data requests must fail visibly rather than silently inventing profiles.
