# AVALON Tactical Loadout Intelligence — v0.8.1

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
- **Explore alternatives** opens a separate modal with at most 50 immediately listed candidates, all selected from the source-matched pool. Choose a candidate to store a **personal pick** per exact ship GroupID and mission mode.
- Personal picks are saved in browser `localStorage` under `avalon.azurlane.loadouts.v1`. Every saved item is revalidated against the current live source category and hull constraints on render. Invalid/stale selections cannot silently override the source constraints.
- Reset clears personal choices for the current ship/mode only. No user configuration is sent to a server.
- A validated wiki augment *type* may be displayed, but an augment recommendation remains unverified until its own eligibility and effect data are integrated.

## Six-position compact planner (v0.8.1)

- The normal layout is **three main weapon/aircraft positions, two auxiliary positions, and one augment position**. The planner uses a responsive three-column tile grid instead of long vertical cards. The fixed identity portrait and separate official artwork panel remain untouched.
- The **first three slots** are the original exact GroupID-matched wiki weapon mounts or detailed Lycoris categories where available. Missing source records show empty unverified positions, not fabricated weapons.
- When detailed ship data explicitly supplies auxiliary/extra slots, preserve those source entries, including exceptional ships with more than two auxiliary positions. If it does not, show two **provisional** auxiliary positions derived from the normal equipment layout. Do **not** treat them as ship-confirmed legality; they start empty instead of automatically equipping top-rarity items.
- A provisional auxiliary may expose equipment items with source category Auxiliary and source-recorded *potential* hull compatibility. Selecting one creates a **personal tentative choice**, not an independently legal or optimum loadout. Item-level exclusions and duplicate-group restrictions require further source integration.
- The **augment position** always remains separate. An exact wiki augment type may be displayed as a sourced type label only; **there is no augment item selected**, even if other source equipment happens to share icon/name attributes. Unknown types remain unverified.
- Click selected gear to open the already-established equipment dossier (stats and acquisition). Click **Why & alternatives** on any slot to open the detailed reasoning, source/efficiency metadata and source-matched candidate list. This includes unresolved augment and auxiliary slots, so the user can see what remains unverified.
- The General, Boss, Mobbing and OpSi modes and per-ship/per-mode manual picks remain unchanged. No calculated DPS, best-in-slot status, or verified encounter mechanics are claimed by this layout change.

The term **six-position** refers to the standard UI layout, not a universally verified count for every ship. Some repair/special ships have documented exceptions. AVALON must prefer exact source slots to a generic pattern.

## Limitations and next milestones

This source-backed preview must **not** be labeled best-in-slot, "S tier," or simulated. It cannot yet calculate actual damage, ammunition armor multipliers, splash, barrage synchronization, skill-trigger conditions, boss traits, true OpSi synergy, availability costs, duplicate-equipment restrictions, or player inventory. Some ships have no parseable or source-confirmed slot types; their cards honestly show unavailable rather than an invented loadout.

- **v0.8.2:** build fully sourced skill/weapon effect and acquisition-cost models, documented mode-specific recommendations, comparison and validation.
- **v0.8.3:** connect equipment selection to full Fleet Lab formations and ship-skill/gear interactions.
- Future: equipment inventory / owned-only suggestions, historical snapshots and repeatable evaluations with uncertainty.
