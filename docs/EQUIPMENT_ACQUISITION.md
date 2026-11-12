# Equipment Acquisition Source Contract — v0.7.9

## What the interface verifies

The Equipment Index matches gear by numeric ID from [Fernando2603/AzurLane equipment.json](https://github.com/Fernando2603/AzurLane/blob/main/equipment.json). When you first open an equipment record, AVALON loads **one dated snapshot of where gear can be obtained**:

- **Source:** [Linuxxy0/AzurLaneData-2026-5-2-16-08-11 / data/equip_drops.json](https://github.com/Linuxxy0/AzurLaneData-2026-5-2-16-08-11/blob/main/data/equip_drops.json)
- **Snapshot date:** May 2, 2026. This is not a real-time game-server or event availability feed.
- **Content:** Exact equipment ID, available documented `locations` (research series, tech boxes, shops, campaigns, etc.), and `lab_from` / `lab_to` Gear Lab relationships.
- **Load behavior:** Fetched only when an equipment detail is opened; kept in memory for the current page session. If the download fails, the drawer says so and offers a retry. We do not guess a farming location when an ID cannot be matched.

At the repository cross-check, **874 of the 936** equipment ID keys in Fernando's static `equipment_icon.json` overlap the acquisition dataset; the live catalog may contain newer or editorial entries that are not present in either source. Overlap is a source-ID coverage measure, not independently verified drop availability.

## Interpretation

- **Locations**: show only exact `locations` entries for the corresponding numeric source ID. No name/icon-based fuzzy join.
- **Gear Lab**: the acquisition dataset records craftable output in `lab_from` by ID; display a minimal recipe-available flag only. Full material costs and upgrade tree remain future tasks.
- **Missing entries**: show *No verified acquisition location in this snapshot*. This does not mean unobtainable, and no alternative is invented.
- **Events / shops / research**: sources can be temporary, server-specific or superseded. Every acquisition card explicitly states the May 2, 2026 snapshot date and advises verification before farming.
- **Editorial or malformed records**: no source lookup is shown as a verified acquisition fact. Input locations are length-limited and HTML-escaped.

**Illustrative cross-check:** equipment source ID `44320` (Prototype Quadruple 305mm SKC39 Main Gun Mount) maps to **Research (Series 8)** in the dataset, consistent with the game publisher's Research Series 8 announcement. This is evidence for that record, not permission to automatically classify other prototype weapons as research drops.

## Known gaps and next steps

This source does not establish current availability, blueprint costs, farming probability, event rerun availability, required gear lab materials, or ship-specific optimal equipment. Future coverage can be added through the official in-game UI and vetted current community/wiki resources, with identity checks, timestamps, and individual provenance. The UI must continue to distinguish `sourced`, `unverified` and `unavailable` rather than synthesizing answers.
