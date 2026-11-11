# Loadout source correctness audit — 2026-11-11

Started from verified main `67489e9cd9eb1e2ee8d0be7fa5ffc8ff9cc9c15b` after PR #17 landed during this audit. v0.8.3 corrects remaining source precedence and restriction issues; it does not add combat rankings.

## Results

The full audit runs General, Boss, Mobbing and OpSi over **894 ships and 936 equipment records**. Each mode produces **893 complete loadouts / 5,363 populated positions of 5,364**, with the six checked wiki pages present. Royal Fortune's augment remains unfilled because no eligible source module is established.

Without wiki data, the five October 2026 Tempesta ships have unknown exact hull subclasses: their 25 regular positions remain empty, with explicit explanations. That fallback yields **888 complete loadouts / 5,338 populated positions**. Previously these were filled from the union of three incompatible subclasses. The existing on-demand wiki loader now supplies exact GroupID-checked subclass facts; no class is inferred from a name or faction.

The audit verifies bundled slot arrays against all **860** snapshot ship records and augment identity/type/exclusivity against all **239** source modules. Source hashes, wiki revisions, counts and every remaining empty slot are recorded in [the machine-readable report](LOADOUT_AUDIT_2026-11-11.json). Offline regression fixtures retain minimal fields from 21 representative ships, source equipment records and six wiki pages, covering Eagle Union, Royal Navy, Sakura Empire, Iron Blood, Dragon Empery, Sardegna, Northern Parliament, Iris, Vichya, Tempesta, META and collaboration ships.

## Sources and precedence

- [Lycoris ships](https://github.com/iujab/Lycoris-AzurAPI/blob/main/data/ships.json): roster identity and fallback text slots. All 13 observed slot descriptions normalize. Its single type labels can omit MLB alternatives; Langley's second label is inconsistent with the exact slot snapshot.
- [AzurLaneData ships, pinned snapshot](https://github.com/Linuxxy0/AzurLaneData-2026-5-2-16-08-11/blob/3deb898433a03ed3d7d7ff877f0d1a9b505dfd44/data/ships.json): internal collection ID, hull number and last limit-break slot arrays. This models the source base form at MLB, not retrofit transformations or the user's actual progression.
- [Fernando equipment](https://github.com/Fernando2603/AzurLane/blob/main/equipment.json): type, category, forbidden hulls and `equip_limit`. Positive limit groups may occur only once across a ship's selected equipment; zero is unrestricted by this field. Missing values do not establish other unmodeled restrictions.
- [Augments, pinned snapshot](https://github.com/Linuxxy0/AzurLaneData-2026-5-2-16-08-11/blob/3deb898433a03ed3d7d7ff877f0d1a9b505dfd44/data/augments.json): exclusive `limit_group` uses internal collection ID, never GroupID. Existing dedicated augment rendering stays separate from equipment icons.
- Koumakan ship templates for [Guam](https://azurlane.koumakan.jp/wiki/Guam), [Merkuriy](https://azurlane.koumakan.jp/wiki/Merkuriy), [Járnbarðinn](https://azurlane.koumakan.jp/wiki/J%C3%A1rnbar%C3%B0inn), [Selimiye](https://azurlane.koumakan.jp/wiki/Selimiye), [Ormrinn Langi](https://azurlane.koumakan.jp/wiki/Ormrinn_Langi), and [Riyala Bey](https://azurlane.koumakan.jp/wiki/Riyala_Bey): read through `/w/api.php`, checked against GroupID. Explicit Submarine/Vanguard/Main frigate types map to hull 22/23/24.
- [Publisher notice](https://azurlane.yo-star.com/news/2026/10/21/maintenance-notice-10-22-12-a-m-utc-7-2/): reconfirmed the five newer augment names already integrated in v0.8.2. No new item IDs, effects or icons are inferred.

Primary slot precedence is now **exact-ID parseable wiki slot → exact-ID MLB snapshot → Lycoris text label**. Actual snapshot type arrays establish ship-slot type eligibility; every candidate still obeys its forbidden-hull list. Text-only slots retain the conservative hull possibility check. Saved limit-conflicting choices are rejected deterministically, and alternatives exclude groups selected in other positions.

## Reproduction

Download the four JSON sources above into an ignored `.audit` folder as `ships.json`, `equipment.json`, `augment-ships.json`, and `augments.json`. Optional MediaWiki parse responses are named `wiki-*.json` and include `parse.wikitext`. Run `node scripts/audit_loadouts.mjs .audit`. The report includes SHA-256 hashes, making source changes distinguishable from matching regressions. `node --test` runs the committed offline regression suite; CI additionally runs the package syntax checks.

This verifies source matching and known restrictions, not inventory, present-day event availability, retrofit legality, player limit-break state, numerical damage, or best-in-slot performance. Browser visual verification is separate.
