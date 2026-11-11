# AVALON Tactical Loadout Intelligence — v0.8.5

## v0.8.6 selection audits and research-informed alternatives

The item displayed by the default picker is still selected from compatible source items using rarity, source HIT/RLD bonus or Anti-Siren attribute. These values are **not** weapon firing cycles, actual armor damage, skill activation rates or fleet effectiveness. The drawer now presents this ranking basis explicitly, comparing concrete reported values with a compatible alternative when possible, and flags the absence of an independent combat comparison. User choices remain labeled Personal pick.

Six exact source gear IDs have additional attributed expert guidance with conditions and alternatives. This research does not automatically replace the candidate or assert universal best-in-slot; unsupported gear retains an honest unreviewed status. Aquila's second aircraft slot receives a specific skill-condition explanation. See [Recommendation Evidence](RECOMMENDATION_EVIDENCE.md) for sourced eligibility, skill, armor, timing, and independent benchmark requirements before a future verified recommendation badge.
## v0.8.5 augment icons and directory

The May 2026 augment manifest supplies 239 verified item identities and explicit original icon keys. Twelve modules alias another original image filename rather than their own ID; the dedicated JforPlay/data_for_toy `spweapon` asset directory contains exact images for all 239 source keys. Initial v0.8.5 mistakenly used MrLar's ordinary `equips` path, leading to 404s and unrelated icons for overlapping IDs; this hotfix corrects that defect. Source-backed icons appear in the six-position planner, alternatives, dedicated Augments catalog and details; five October name-only official announcements remain without verified art, IDs or stats. CDN availability and publisher authorization are not implied.

Alternatives are searchable with 50-at-a-time progressive continuation since v0.8.4; early descriptions of a permanent first-50 ceiling are superseded. This feature is not an augment-combat optimality assessment.
## Current matching corrections

v0.8.3 supersedes the v0.8.2 precedence and restriction notes below: primary slots now use exact-ID wiki facts, then exact-ID fully limit-broken snapshot arrays, then Lycoris display labels. Mixed aircraft mounts are retained and Langley's incorrect gun label cannot override her fighter slot. Source equipment limit groups are enforced across defaults, saved picks and alternatives. Newer Tempesta hull subclasses are read from GroupID-checked wiki `Type` fields; if unavailable, regular slots remain unfilled with a reason. See [the source audit](LOADOUT_AUDIT.md) for all-mode coverage, offline/source-failure behavior and reproducible hashes. Retrofit and player progression remain outside this base-form MLB model.

## Objective

The Ship Index is a research and planning station, not just a ship encyclopedia. The left-hand profile column displays a **mode-aware equipment loadout panel** under the fixed ship portrait and identity card, while the official artwork gallery remains independent on the right.

Version 0.8.0 deliberately distinguishes **source-matched equipment candidates** from **verified best-in-slot recommendations**. It does not claim combat simulation, optimum DPS, verified skill timing, exact ship-slot exceptions, or full fleet synergy. These require additional data and validation in subsequent releases.

## Source data and matching contract

1. Ship ID and hull are the stable numeric source ID and class recorded by Lycoris-AzurAPI, not a fuzzy text name match.
2. Three weapon slots are preferred from an exact GroupID-validated Koumakan Wiki ship template when all three slot facts are present. Missing wiki facts fall back to the Lycoris detailed ship record. Any additional slot is displayed **only if explicitly present** in the detailed source.
3. Slot categories use a fixed, conservative alias dictionary for named real equipment types (DD/CL/CA/CB/BB Guns, torpedoes, AA, aircraft, auxiliaries, and recognized special classes). Unrecognized generic fields remain unverified; a slot is **not** assigned fictitious equipment.
4. An equipment candidate must be a Fernando source record with a validated numeric ID, a matched source category and source type code, and a hull included in the documented type/hull possibility map after the item's `ship_type_forbidden` exclusions. This is evidence of **potential hull legality**, not definitive individual-ship, upgrade/retrofit, or exception legality.
5. Slot efficiencies and mounts display only when reported. The panel does not equate maximum slot efficiency to a complete damage score.

## Mode-aware candidate order, not tiers

Four contexts are offered: General, Boss, Mobbing and OpSi. All candidates have the same source/hull/category eligibility requirements. The list is then ordered using **only documented enhancement attributes when comparable**:

- General: equipment source rarity (descending) with deterministic alphabetical ties.
- Boss: source-reported HIT attribute where available, then rarity; **not** damage versus a specific armor class.
- Mobbing: source-reported RLD attribute where available, then rarity; **not** actual attack interval or wave-clear DPS.
- OpSi: source-reported Anti-Siren attribute where available, then rarity; **not** an encounter simulation.

The loadout panel explicitly says when no mode-specific advantage can be verified and clearly labels an automatically shown pick as **Source candidate**. All candidates need later review of skills, barrages, armor/ammo, reload timings, fleet interactions, and enemy data before receiving an **Evaluated** or **Simulated** rating.

## User workflow

- Each known equipment slot displays one source-backed candidate, real source-linked icon, category/hull/efficiency reasoning, and an **Inspect** action.
- Inspect opens the existing scrollable equipment intelligence drawer **over the current ship profile**, including original icon, available source stats, acquisition locations, and evidence links. Close returns to the same ship.
- **Explore alternatives** opens a separate modal with the first 50 visible and a searchable, progressive continuation through the entire source-matched pool. Choose a candidate to store a **personal pick** per exact ship GroupID and mission mode.
- Personal picks are saved in browser `localStorage` under `avalon.azurlane.loadouts.v1`. Every saved item is revalidated against the current live source category and hull constraints on render. Invalid/stale selections cannot silently override the source constraints.
- Reset clears personal choices for the current ship/mode only. No user configuration is sent to a server.
- A validated wiki augment *type* may be displayed, but an augment recommendation remains unverified until its own eligibility and effect data are integrated.

## Six-position compact planner (v0.8.1; revised v0.8.2)

- The normal layout is **three main weapon/aircraft positions, two auxiliary positions, and one augment position**. The planner uses a responsive three-column tile grid instead of long vertical cards. The fixed identity portrait and separate official artwork panel remain untouched.
- The **first three slots** are the original exact GroupID-matched wiki weapon mounts or detailed Lycoris categories where available. Missing source records show empty unverified positions, not fabricated weapons.
- The dated game-slot manifest confirms both auxiliary equipment positions for 852 indexed ships. Newer ships without the record retain **provisional** auxiliary positions; source/hull-compatible items are surfaced as **planning candidates** only. They must not be mistaken for tested or individually legal loadouts.
- A provisional auxiliary may expose equipment items with source category Auxiliary and source-recorded *potential* hull compatibility. Selecting one creates a **personal tentative choice**, not an independently legal or optimum loadout. Item-level exclusions and duplicate-group restrictions require further source integration.
- The **augment position** remains separate: exact-ship exclusive modules or general class-compatible modules from the dated augment source may be selected. The source's published hull type/ship ID is required; never display a Fernando equipment icon as an augment icon. Missing modules remain unverified.
- Click selected gear to open the already-established equipment dossier (stats and acquisition). Click **Why & alternatives** on any slot to open the detailed reasoning, source/efficiency metadata and source-matched candidate list. This includes unresolved augment and auxiliary slots, so the user can see what remains unverified.
- The General, Boss, Mobbing and OpSi modes and per-ship/per-mode manual picks remain unchanged. No calculated DPS, best-in-slot status, or verified encounter mechanics are claimed by this layout change.

The term **six-position** refers to the standard UI layout, not a universally verified count for every ship. Some repair/special ships have documented exceptions. AVALON must prefer exact source slots to a generic pattern.

## Roster-wide slot and augment coverage (v0.8.2)

AVALON's older source dictionary failed to interpret **1,582 of 2,682** slot labels in Lycoris's 894-ship detailed record, even when the equipment type was known. The shared matcher now covers all **13 distinct Lycoris labels**, including `Artillery (Pocket Battleship)`, `Artillery (Destroyer)`, `Torpedo (Submarine)`, and `Reconnaissance`, and understands verified wiki labels such as `CB Main Guns`, `DD Main Guns` and `Fighters / Dive Bombers (LB1)`. Slot-matching terms are explicit; an unknown string does not silently become a guessed type.

The source-matched regular slot model is now:
1. Check the ship's exact GroupID and parseable wiki mount type (when verified), falling back per weapon slot to Lycoris labels and then the dated game slot snapshot.
2. The compact game snapshot `src/game-slot-manifest.js` is derived from [Linuxxy0/AzurLaneData 2026-05-02 `data/ships.json`](https://github.com/Linuxxy0/AzurLaneData-2026-5-2-16-08-11/blob/main/data/ships.json). It stores **860 exact GroupID mappings** (internal collection ID, exact numeric hull ID, fully limit-broken equipment type arrays, efficiency and mounts); **852 overlap the current 894 ship roster**. Both auxiliary positions are explicitly described for those ships. No eight-megabyte source download is required on every profile opening.
3. For ships absent from that dated snapshot, retain Lycoris's three supported combat slots and two provisional auxiliary positions. Exact Tempesta subclasses cannot be invented from Lycoris's generic `IX` label; equipment possibilities across IXS/IXV/IXM are shown with a **provisional** source-caveat only.
4. Candidate gear must still match the Fernando equipment type/category, declared hull compatibility, and per-item forbidden-hull exclusions. For records with an exact game hull number, use that number instead of a broad guessed category. Auto-selected auxiliary candidates are kept distinct where alternatives exist. No item is certified optimal; class-level eligibility does not prove every unique equipment restriction.

The augment position is now a separate, source-backed inventory:
- `src/augment-manifest.js` contains **239** dated May 2, 2026 [AzurLaneData augment records](https://github.com/Linuxxy0/AzurLaneData-2026-5-2-16-08-11/blob/main/data/augments.json). An exclusive item's `limit_group` references the **internal ship collection ID**, not the display GroupID. Nonexclusive augments are eligible by documented augment type/hull rules in the source's `types/augments.d.ts` (further ship-specific restrictions still need validation).
- Augment cards, options and details use exact source icons hosted at `JforPlay/data_for_toy/spweapon/<icon>.webp`; display a neutral ✦ only if the source image cannot be loaded or no source item ID/icon is documented. The augment dossier shows source stats, craftability, rarity and dated provenance.
- Five newer Tempesta augments are identified by the [publisher's October 21, 2026 announcement](https://azurlane.yo-star.com/news/2026/10/21/maintenance-notice-10-22-12-a-m-utc-7-2/), with name-only eligibility and **unverified** IDs, costs, stats and icons.
- No compatible augment was verified for **Royal Fortune**, so that one position remains unfilled with an honest source status. Do not invent an augment simply to make the grid appear complete.

**Roster-wide audit:** Across the 894 Lycoris ships and 936 Fernando equipment records, the updated source candidate logic populates **893 six-position ship loadouts**, or **5,363/5,364** total positions. This is a metadata/candidate-eligibility audit, not live browser image testing, guaranteed legality, possession, or optimal build verification. The four mission contexts remain distinct but are not numerical combat simulations.

## Limitations and next milestones

This source-backed preview must **not** be labeled best-in-slot, "S tier," or simulated. It cannot yet calculate actual damage, ammunition armor multipliers, splash, barrage synchronization, skill-trigger conditions, boss traits, true OpSi synergy, availability costs, duplicate-equipment restrictions, or player inventory. Some ships have no parseable or source-confirmed slot types; their cards honestly show unavailable rather than an invented loadout.

- **v0.8.2:** build fully sourced skill/weapon effect and acquisition-cost models, documented mode-specific recommendations, comparison and validation.
- **v0.8.3:** connect equipment selection to full Fleet Lab formations and ship-skill/gear interactions.
- Future: equipment inventory / owned-only suggestions, historical snapshots and repeatable evaluations with uncertainty.
