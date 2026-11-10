# Nation and equipment/hull filters

**AVALON v0.6.0** · audited November 10, 2026 (Asia/Manila)

## Full catalog navigation

The Ship Index and Equipment Index no longer silently stop at the first 72 entries. Both provide nation chips, full-catalog search, type filters, grouped results and **60 cards per page**, with previous/next buttons and a page selector. Page count and total matching records are explicit. Images remain lazy-loaded to avoid opening hundreds of asset requests at once.

### Ship nationality

The lightweight `ship-list.json` supplied by [Lycoris-AzurAPI](https://github.com/iujab/Lycoris-AzurAPI) has 894 ship identities, but does **not** include nationality. Instead, the data source's [full `data/ships.json`](https://github.com/iujab/Lycoris-AzurAPI/blob/main/data/ships.json) provides game-derived `nationality` alongside stable numeric ship IDs.

To avoid downloading an additional ~4.95 MB on every page load, we compiled **a small ID→nationality snapshot** into `src/catalog-filters.js`, using the upstream November 9, 2026 ship data. That snapshot covers all **894** source IDs. Live `ship-list.json` records attach nation by source ID; unmatched/newly released IDs are marked **Unclassified**, not guessed from ship names, flags or hulls. The original fallback entries keep their established internal IDs for saved fleets.

Nation examples: Eagle Union, Royal Navy, Sakura Empire, Iron Blood, Dragon Empery, Sardegna Empire, Northern Parliament, Iris Libre, Vichya Dominion, Tempesta, META and separate collaboration groups.

**Provenance/license:** The source project identifies its software/data as GPL-3.0. This mapping is derived from source facts, and attribution and applicable license obligations should be respected if redistributing or modifying the snapshot. No upstream software source code or full ship profiles are copied. See upstream [LICENSE](https://github.com/iujab/Lycoris-AzurAPI/blob/main/LICENSE). Updates to the index should refresh the mapping rather than infer factions from names.

### Equipment nation of origin

The [Fernando2603/AzurLane `equipment.json`](https://github.com/Fernando2603/AzurLane/blob/main/equipment.json) records **936 equipment variants** with a numeric `nationality` field. A compact nationality-code table is derived from the source's [`nationality.json`](https://github.com/Fernando2603/AzurLane/blob/main/nationality.json), with missing recent collaboration codes cross-referenced against ship names and nationalities. Missing/unknown codes are **Unclassified**.

Nation of origin does **not** mean faction-exclusive equipability. A ship from another nation may use equipment if its actual slot and restrictions allow it.

### Equipment *potentially equippable by hull*

The `equipment.json` source provides each item's numeric `type` and `ship_type_forbidden` hull exclusions. The linked [`ship.json`](https://github.com/Fernando2603/AzurLane/blob/main/ship.json) provides observed `equipment[slot].type[]` arrays per ship, and [`hulltype.json`](https://github.com/Fernando2603/AzurLane/blob/main/hulltype.json) names hull codes (DD, CL, CA, CV, etc.).

AVALON derives the set of hull types for which **at least one recorded ship has a compatible equipment-slot type**. For each specific equipment item, explicit `ship_type_forbidden` entries are then excluded. The equipment filter only includes an item if the selected hull remains possible.

**Important:** The filter indicates *potential compatibility for some members of a class*. It is not a verified per-ship, per-slot fit test. Ships can have unusual slots, faction-only equipment, retrofit changes, unique gear restrictions and other special cases. Empty compatibility means **not established by the available data**, not necessarily unusable. Do not equip based solely on the hull filter; exact ship-slot validation belongs in the planned fleet optimizer.

### Data gaps and refresh

- The two source repositories are independently maintained and may not update simultaneously; equipment nation and ship information are not guaranteed to be fully synchronized.
- `src/catalog-filters.js` is a dated mapping snapshot; names/factions for post-snapshot releases remain unclassified until refreshed.
- Original game-client thumbnails remain an optional external asset service and not all ships have corresponding art.
- The frontend supports large catalogs through pagination. It does not imply that every ship has a verified combat tier or equipment recommendation.
- The equipment slot map includes only observed ship-slot possibilities in the currently referenced `ship.json` snapshot, and intentionally avoids inferring unknown hull subclasses.
