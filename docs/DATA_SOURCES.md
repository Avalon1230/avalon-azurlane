# AVALON v0.2 — Runtime catalog data contracts

## Scope and ownership

The static website optionally requests two **independently maintained, third-party datasets directly from their GitHub raw endpoints at runtime**. Their large JSON payloads are not bundled or persistently cached by AVALON. From v0.8.2, **two compact, dated, source-attributed metadata extracts** for five-slot eligibility and augment records are also checked into the repository; these are not full copies of the upstream game datasets, live feeds, or publisher-certified performance claims. The upstream owners remain responsible for their respective content. Data subjects and game artwork remain subject to their owners' rights. No ship portraits or gear sprites are copied by this version.

| Domain | Runtime URL | Fields imported | Source as checked November 10, 2026 |
| --- | --- | --- | --- |
| Ships | [Lycoris-AzurAPI ship-list.json](https://github.com/iujab/Lycoris-AzurAPI/blob/main/data/ship-list.json) | upstream ID, English name, hull name, rarity | 894 entries, version.json reported generated Nov 9, 2026; repo GPL-3.0 |
| Equipment | [Fernando2603 equipment.json](https://github.com/Fernando2603/AzurLane/blob/main/equipment.json) | upstream ID, name, source equipment type, rarity code, maximum enhancement attributes | 936 entries, upstream JSON last changed Nov 6, 2026; source repository has no published license seen in review |

Primary upstream projects: [iujab/Lycoris-AzurAPI](https://github.com/iujab/Lycoris-AzurAPI) and [Fernando2603/AzurLane](https://github.com/Fernando2603/AzurLane). AVALON's independently authored adapter code does not incorporate their source code. If upstream owners restrict these fetches, we must stop ingesting or obtain authorization.

## Why not mirror the original Koumakan wiki?

A web crawler's cached/indexed response for Koumakan (`https://azurlane.koumakan.jp/wiki/Azur_Lane_Wiki`) contained unrelated literature on November 10, 2026; another wiki route behaved similarly. This **does not establish a live website failure**, and the user reports normal browser access. The exact cause is unknown. An independent GitHub Actions runner has since confirmed valid read-only JSON access at `/w/api.php` and successful Musashi wikitext retrieval, while HTML pages gave HTTP 403. Automatic data ingestion remains paused pending schema interpretation and reuse/attribution review. The separate fan-run wiki remains a supplementary manual reference, not a Koumakan mirror.

## Loading contract

- The browser loads independently from each source. If either feed fails, the other may still work.
- A 15-second timeout, 7 MB limit and basic size/shape validations reject unexpectedly malformed data.
- The small built-in unranked catalog stays available when offline. User-facing status differentiates full, partial, and failed loading.
- Source IDs are prefixed (`lyc-` and `fer-`). Legacy local fleet IDs are preserved when a new ship name matches an existing curated entry. `localStorage` fleet plans are normalized after load.
- The source hull types are mapped to display-compatible hull codes. An unqualified "Sailing Frigate" source entry is **not** assigned a main/vanguard placement automatically because a precise role subtype is needed.
- Equipment `type` and `rarity` numbers use mappings verified against representative upstream records. An unrecognized value remains explicitly marked Other/Unknown.
- All user-visible remote fields are escaped as HTML; links go to controlled source domains or encoded wiki search pages.
- The ship and equipment indices initially display 60 records and progressively reveal more as the user scrolls, without artificial dataset cutoff; type a search term to refine.
- Equipment enhancement attributes are read from the highest source-reported enhancement level per record. This is **not** a claim about the best upgrade, damage, or compatibility.

## Evidence and scoring boundary

**Source identity ≠ verified performance ≠ tier.** This release does not calculate damage, tier rankings, best-in-slot choices, Gear Lab recipes, or acquisition costs. The `src/criteria.js` module lists data requirements for all eight supported game-mode categories. It does not turn these dimensions into invented numerical evaluations.

Production scoring would additionally require reliable enemy tables, skill descriptions, enhancement/loadout validation, uptime and targeting assumptions, mode mechanics, tests, uncertainty and reproducible calculations. Every assessment must be dated and attributed. Community opinions are citations to consider, **not votes that define truth**.

## Ship loadout and augment snapshots (v0.8.2)

- [Linuxxy0/AzurLaneData May 2, 2026 ship records](https://github.com/Linuxxy0/AzurLaneData-2026-5-2-16-08-11/blob/main/data/ships.json) provide the collection ID, numeric hull, fully limit-broken equipment slot types, efficiency and mounts. AVALON retains a compact 860-record exact GroupID manifest (`src/game-slot-manifest.js`); **852/894 current roster ships match**. The complete 8.9 MB ship JSON is *not* loaded into the page.
- [May 2, 2026 augment records](https://github.com/Linuxxy0/AzurLaneData-2026-5-2-16-08-11/blob/main/data/augments.json) provide the separate 239-entry augment manifest (`src/augment-manifest.js`), with exact internal ship-ID exclusivity or generic type/hull restrictions. No augment image binaries are hosted.
- For five modules announced in October 2026, AVALON includes only the [officially announced names](https://azurlane.yo-star.com/news/2026/10/21/maintenance-notice-10-22-12-a-m-utc-7-2/) and exact ship identities. Item IDs, artwork and stats remain unknown.
- The source snapshots cannot establish current event availability, actual player inventory, hidden item-level exceptions, optimal upgrades, damage, skill timing or a simulated loadout. See [Tactical Loadout Intelligence](TACTICAL_LOADOUTS.md).

## Optional equipment acquisition provenance (v0.7.9)

- [Linuxxy0/AzurLaneData May 2, 2026 snapshot — equipment drops](https://github.com/Linuxxy0/AzurLaneData-2026-5-2-16-08-11/blob/main/data/equip_drops.json): a separate, read-only dataset used lazily when inspecting equipment.
- Original numeric source IDs are matched exactly. In the audited static input, 874/936 Fernando image-record IDs also have acquisition records; the rest remain explicitly **not verified**.
- Snapshot locations, Gear Lab recipe flags, and source timestamps are reference information only; event windows, availability by server and material costs are not live or fully audited.

## Known limitations / future work

- Source fetches may fail due to GitHub availability, CORS restrictions, upstream schema changes, or network policy.
- English ship list may contain collaboration and support units or variants for which fleet slot eligibility cannot be resolved from hull family alone.
- The base Fernando equipment source does not contain complete acquisition routes. From v0.7.9, equipment details optionally load the dated May 2, 2026 AzurLaneData `equip_drops.json` snapshot on demand by exact numeric source ID. Known locations and Gear Lab recipe flags are displayed with source provenance; unknown, offline, outdated, or server-dependent availability is **not guessed**. See [Equipment Acquisition Data](EQUIPMENT_ACQUISITION.md).
- Rarity from the source may reflect a ship's base form, even if the curated label includes "(Retrofit)".
- Indexed game records are not an endorsement from their authors; the AVALON application remains unaffiliated with game developers, maintainers and the original ECTL.