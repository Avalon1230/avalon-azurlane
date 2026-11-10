# AVALON v0.2 — Runtime catalog data contracts

## Scope and ownership

The static website optionally requests two **independently maintained, third-party datasets directly from their GitHub raw endpoints at runtime**. They are not bundled, cached persistently by AVALON, included in source commits, or represented as officially verified game facts. The upstream owners remain responsible for their respective content. Data subjects and game artwork remain subject to their owners' rights. No ship portraits or gear sprites are copied by this version.

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
- The interface caps simultaneous rendered results to 72 catalog cards (100 picker choices) for performance; type a search term to refine.
- Equipment enhancement attributes are read from the highest source-reported enhancement level per record. This is **not** a claim about the best upgrade, damage, or compatibility.

## Evidence and scoring boundary

**Source identity ≠ verified performance ≠ tier.** This release does not calculate damage, tier rankings, best-in-slot choices, Gear Lab recipes, or acquisition costs. The `src/criteria.js` module lists data requirements for all eight supported game-mode categories. It does not turn these dimensions into invented numerical evaluations.

Production scoring would additionally require reliable enemy tables, skill descriptions, enhancement/loadout validation, uptime and targeting assumptions, mode mechanics, tests, uncertainty and reproducible calculations. Every assessment must be dated and attributed. Community opinions are citations to consider, **not votes that define truth**.

## Known limitations / future work

- Source fetches may fail due to GitHub availability, CORS restrictions, upstream schema changes, or network policy.
- English ship list may contain collaboration and support units or variants for which fleet slot eligibility cannot be resolved from hull family alone.
- The equipment data lacks complete, independently audited acquisition locations / recipes; the UI labels these as unverified rather than guessing.
- Rarity from the source may reflect a ship's base form, even if the curated label includes "(Retrofit)".
- Indexed game records are not an endorsement from their authors; the AVALON application remains unaffiliated with game developers, maintainers and the original ECTL.