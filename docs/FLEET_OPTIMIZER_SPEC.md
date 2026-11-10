# AVALON — Automatic Fleet & Equipment Optimizer

**Status: Design specification (not implemented)**  
**Drafted:** 2026-11-10 · **Scope:** entire Azur Lane (not only Chapters 15/16)

## Purpose

Answer **"Given my available ships and equipment, what complete fleets should I deploy for this exact encounter, with what gear, and why?"** This is the core product objective, not an afterthought to a tier list. A highly ranked individual ship or gun is not automatically the strongest *fleet* choice.

AVALON must evaluate **ship × ship × equipment × skill × timing × enemy × game mode**, including indirect interactions that change the value of the entire composition. The app should explain those interactions and offer honest alternatives when inputs are incomplete.

## User workflow and expected output

1. Choose mode and scenario: Campaign (map, mob/boss, auto/manual), OpSi (four-fleet operation, sector, boss profile, adaptation), META Showdown (specific boss), Exercises (attack/defense), events, Challenge, dailies, or Guild Operations.
2. Choose an optimization objective: **reliable auto clear**, boss damage, sustain, minimum oil/crafting investment, or balanced. Specify constraints such as must-use/exclude ships, gear in inventory, fleet count, limit breaks, skill levels, research development, or reserved equipment.
3. Choose **owned inventory only** or **theoretical best**. In owned mode, account for quantities and non-duplicate assignment rules. Provide manual input first; any later ALAS integration must be optional, read-only, transparent and consent-based.
4. Generate **complete formations**, not just a six-ship name list: positions, individual weapon/aircraft slots, auxiliaries, augments where relevant, enhancement assumptions, submarines, and applicable campaign support fleet recommendations.
5. Display why each ship and item was selected, conditional skill synergies, buff coverage, weapon timing, target armor matching, trade-offs, source confidence, known gaps, substitutions, and "change one thing" optimization suggestions.
6. Export the result as a reproducible plan with source/version fingerprints. No fake numerical DPS or clear-rate claims without validated simulation/test data.

## Sources and evidence pipeline

- **Koumakan MediaWiki API** at `https://azurlane.koumakan.jp/w/api.php` has been confirmed from GitHub Actions for siteinfo, ship metadata and Musashi wikitext. It is **not** yet a production importer. Confirm field templates, revision IDs, permission/reuse conditions, API limits and cache behavior before ingesting.
- Cross-reference independent game-client data extracts (per EN/CN/JP version and update date), official notices, Gear Lab data, equipment and skill descriptions. No data provider is implicitly authoritative for all fields.
- Review strategy guides (e.g. [Chapter 15](https://suchiguma.github.io/guides/chapter-15/), [Chapter 16](https://suchiguma.github.io/guides/chapter-16-fleets/), [OpSi guide](https://github.com/TurtleAL/Turtle.github.io/blob/master/Operation%20Siren%20Guide.md), [REGAL](https://azur-lane-regal.suchiguma.com/)) as contextual evidence and candidate builds, **not a replacement for AVALON's own calculations**.
- Every mechanic/effect retains `sourceUrl`, `sourceRevision`, `region`, `checkedAt`, `verificationStatus`, and notes on conflicting or incomplete sources. Game-version changes invalidate dependent recommendations until reviewed.
- Do not mirror third-party creative content or full guides by default. Check permission/licensing before importing and republishing structured datasets at scale.

## Structured mechanics model (minimum)

A ship has: stable canonical identity and variants/retrofits, hull/armor/faction, ship and skill levels, equipped slots and compatibility rules, weapon efficiencies, aircraft capacity, base/derived stats, position dependencies, fleet-tech/buff conditions and ownership/progression.

A skill/effect must represent, when evidenced:

- **Trigger:** battle start, timed cycle, main-gun salvo, airstrike, torpedo launch/hit, enemy defeat, damage threshold, ally health threshold, unique ship presence, faction/hull/equipment condition, manual activation, or special encounter event.
- **Target and scope:** self, named allies, a hull/faction subset, specific position, frontline/backline, whole fleet, enemy, or cross-fleet effect.
- **Value and duration:** effect magnitude, stacking category and stacking rules, expiry, cooldown, probability, once-per-battle restrictions and requirements. Unknown values remain explicitly unknown.
- **Interacting equipment:** reload, firing/launch schedule, accuracy, projectile type, armor modifiers, AA/interception, ASW, evasion/HP, heal/shield duration and any skill-triggered or equipment-specific behavior.

A plain-text skill description is **not yet machine-simulatable**. Preserve raw text alongside a reviewed, typed effect model; never silently parse unknown conditions into fake numeric bonuses.

## Synergy evaluation (not simple tier averaging)

Represent dependencies as a **typed interaction graph** and evaluate combined effects:

1. **Buff/debuff coverage:** named/faction/hull eligibility, duplicate buff non-stacking or stacking, skill proc chance and uptime, and target-specific debuffs.
2. **Timing:** salvo/airstrike/torpedo schedules, reload breakpoints, opening attacks, barrage triggers, slow/root/bind windows, skill activation windows and overlap. A theoretically stronger weapon may yield worse fleet results if it desynchronizes a burst with debuffs.
3. **Damage:** enemy armor, evasion/level, weapon types, reload, hit assumptions, sustain vs short bursts, AOE vs single target, and boss-specific resistances.
4. **Survival:** actual frontline effective durability, airstrike defense, flagship and backline pressure, heals/shields, damage reduction, formation and attrition over repeated fights.
5. **Mode constraints:** Campaign air control, anti-air and anti-submarine requirements, ammo and oil; OpSi adaptation and sustained multi-fleet routing; PvP opening/counter mechanics; META/Challenge encounter timing.
6. **Resource trade-offs:** gear material cost, upgrade level and scarce equipment copies; optimize *net fleet value* and permit a less expensive near-optimal alternative.

**Example interaction (illustrative, not a quantified claim):** A fleet with a timed enemy vulnerability window may prefer a gun or carrier setup whose attack lands during that window, even if another weapon has higher standalone sustained damage. Verify trigger timing, proc and target compatibility before making that recommendation.

## Solver architecture

1. **Filter hard constraints:** only eligible/owned ships; valid hull/position and weapon slots; no ship used twice in a multi-fleet plan; item inventory quantities; required or excluded units; stage-specific fleet restrictions.
2. **Generate candidates:** heuristic/role-balanced seeds (tank, heal, AA, ASW, mob sustain, boss burst) plus combinations suggested by verified mechanics. A provisional heuristic may propose a fleet but cannot claim it is mathematically best.
3. **Score at the *fleet level*:** objective-specific weighted measures for damage, survival, reliability and resources **only where measurement/calculation is validated**. Unmeasured attributes are qualitative and confidence-limited.
4. **Search combinations:** beam search or constraint programming for discrete ship/gear choices; event-timeline modeling for cooldown and buff interactions; pruning for redundant/invalid combinations; always retain a valid fallback.
5. **Joint multi-fleet optimization:** OpSi requires **four surface fleets plus an optional submarine team**, optimized as a connected assignment problem, *not* four independent "best" fleets consuming the same limited ships or equipment. Balance general mob sustain and specialized boss/Arbiter counters.
6. **Compare counterfactuals:** provide best alternative(s), expected benefit where measured, and a readable explanation of why a stronger individual unit was *not* selected.
7. **Report uncertainty:** show unsupported, disputed, outdated or region-mismatched mechanics. Never use a fictional numeric score to fill missing wiki/template data.

## Priority scenarios and acceptance tests

First prove the pipeline on diverse, **representative** situations—not make the whole platform a Chapter 15 guide:

- **Later campaign mob and boss**: formation must satisfy encounter-specific AA, ACV and ASW needs where relevant, sustained waves, heals, and correct gear slots. Source context: [Chapter 15](https://suchiguma.github.io/guides/chapter-15/) / [Chapter 16](https://suchiguma.github.io/guides/chapter-16-fleets/).
- **OpSi four fleets**: at least one sustainable exploration fleet and separate armor/mechanic-specific boss options, constrained by fleet-wide ship and item scarcity, adaptation and attrition.
- **META single-boss**: test overlapping attack and debuff timing, survival, and compare a fast weapon to a slower higher-damage option using traceable simulated events once a validated timing model exists.
- **Regression tests:** disallow invalid hull/equipment, impossible duplicates, duplicated unique bonuses, incompatible conditional effects, wrong faction buffs, and outdated skill versions. Deliberate counterexamples must not produce a fake "optimal" ranking.
- **Expert validation:** compare AVALON's recommendations to documented real clears and current guide builds; explain agreements and discrepancies. Label the benchmark conditions and avoid cherry-picked comparisons.

## Release phases

1. **Mechanics foundation:** versioned ship/skill/equipment/enemy schemas + carefully reviewed Koumakan API parsing and source provenance.
2. **Constraint-aware suggested fleets:** generate valid full formations with role coverage and clear qualitative explanations. Do not call these optimal yet.
3. **Equipment + timeline synergy:** typed skill triggers, slot effects and burst-window matching; use trace tests and uncertainty.
4. **Multi-objective optimizer:** optimize a validated objective for a single encounter and then jointly across OpSi's four fleets, handling inventory/scarcity.
5. **User-level recommendations:** inventory import, manual constraints, build alternatives, replace/upgrade priorities and explainable comparisons.

**Definition of done:** Given a declared encounter and roster, AVALON must output a feasible, fully equipped, explainable fleet that respects inventory/skill conditions, cites its mechanics, identifies weak points, proposes alternatives, and distinguishes verified results from hypotheses. For OpSi, do this across all four surface fleets without duplication.

**Current implementation status:** The v0.4 site has a manual fleet planner and contextual editorial ship/gear assessments. No automated synergy solver, gear-loadout optimizer, event simulator or four-fleet joint objective optimizer has been built. This document is an architectural requirement, not a completed feature.
