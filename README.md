# AVALON — Azur Lane Intelligence

An independent, evidence-driven **Azur Lane** research and fleet-planning project.

> **Project status:** Foundation. This repository is not yet a working website, tier list, or fleet optimizer.
>
> **Identity:** This is **not** ECTL, an official revival of ECTL, or an officially endorsed Azur Lane project.

## Mission

Make ship selection, equipment decisions, and fleet building more useful and explainable by combining verifiable game mechanics, attributed public community evidence, and independently reasoned analysis.

The goal is to answer practical questions across **the entire game**, such as:

- Which ships and equipment perform best for my chosen content: campaign, Operation Siren, META Showdown, PvP, or events?
- How should I assign **four Operation Siren fleets** for general exploration, Abyssal bosses, strongholds, and Arbiters?
- Which fleet can reliably clear a difficult map, including Chapter 15-4, given the ships and gear I own?
- What build handles a particular META boss's mechanics, and what trade-offs does it make?
- Which equipment should I craft or research next, where can I obtain it, and what does it improve?
- Why does a ship excel in one scenario but underperform elsewhere? What changed after a game update?

Favorite-character ("waifu") selections are valid preferences, but will be kept separate from maximum-combat-efficiency comparisons.

## Full-game coverage

**The main campaign is only one part of the platform.** Chapter 15 is an initial practical example, not the product's organizing principle.

| Area | Analysis goals |
| --- | --- |
| **Main Campaign** | Normal and Hard stages, mob and boss fleets, auto/manual, threat level, air control, ASW, oil-efficient farming |
| **Operation Siren (OpSi)** | Four-fleet assignments, exploration/sector clearing, corrosion hazards, Siren strongholds, Abyssal bosses, Arbiters, adaptation and endurance |
| **META Showdown** | Boss-specific mechanics, damage optimization, fleet synchronization, survival and consistency |
| **Exercises (PvP)** | Offense and defense, counter-fleets, opening burst, survivability, current opponent trends |
| **Events and War Archives** | Limited-time maps, EX/challenge encounters where applicable, farming priorities and archived content |
| **Challenge Mode and Daily Raids** | Mechanics-specific loadouts, reliable clears, score/time optimization where relevant |
| **Guild Operations** | Guild boss and encounter-specific fleet support |
| **Account progression** | Ship leveling, research/development, retrofits, augments, gear crafting, resource allocation, farming priorities |

This is an **extensible mode registry**, not a fixed list: new or temporary content can be added without rebuilding the ranking system. Recommendations must name their mode and scenario and never imply that one tier automatically applies everywhere.

## Planned features

1. **Comprehensive ship database and contextual rankings:** searchable statistics, skills, retrofits, augments, acquisition details, and assessments separated by game mode and role.
2. **Equipment encyclopedia:** stats, compatible hulls, strengths, alternatives, upgrade priorities, crafting paths, and source links.
3. **Mode-aware fleet builder:** campaign mobs/bosses, four-fleet OpSi compositions, META Showdown, Exercises, guild bosses, support carriers, submarines, and temporary event challenges.
4. **Acquisition and progression planner:** Gear Lab recipes, research blueprints, material availability, farming strategies, and economical substitutes.
5. **Explainable recommendations:** assumptions, evidence, competing options, limitations, and review dates, including clearly labeled AVALON assessments.
6. **Patch awareness:** changed ship, enemy, mode, or equipment records trigger re-review rather than silently retaining outdated recommendations.

## Sources and attribution

| Source | Intended use | Notes |
| --- | --- | --- |
| [Azur Lane Wiki (Koumakan)](https://azurlane.koumakan.jp/wiki/Azur_Lane_Wiki) | Primary factual reference for ship/equipment stats, skills, mechanics, and acquisition | Verify API availability, data version, reuse permissions, and attribution before automated ingestion |
| [Historical English Community Tier List](https://slaimuda.github.io/ectl/#/home) | Historical assessments and design inspiration | This project does **not** use its identity or claim its endorsement |
| [REGAL](https://azur-lane-regal.suchiguma.com/) | Modern endgame evaluations and comparative analysis | Distinguish the source author's judgments from game facts |
| [Operation Siren reference](https://azur-lane.wiki/index.php/Operation_Siren) | OpSi map/fleet systems and progression reference | Validate mechanics against current primary sources and regional versions |
| [Chapter 15 strategy guide](https://suchiguma.github.io/guides/chapter-15/) | Example of a specific scenario guide, **not the site's core scope** | Record game context and when recommendations were published |
| Public player discussions and test reports | Observations, counterarguments, practical fleet results | Attribute authors and preserve test conditions; do not turn upvotes into proof |

Third-party game art, database content, ratings, and guide text must **not** be copied wholesale without verifying the relevant rights and attribution requirements. Linking to a source does not itself grant permission to reproduce its content.

## Evidence standard

We will keep three categories of knowledge distinct:

| Category | Examples | Required treatment |
| --- | --- | --- |
| **Game data** | Ship stats, weapon reload, armor modifiers, skill effects, crafting requirements | Source URL, version/region where relevant, checked date, validation status |
| **Community evidence** | Public tests, theorycrafting, guide recommendations, reproducible comparisons | Attribution, scenario and gear conditions, sample limitations, disagreements |
| **AVALON assessment** | Relative performance, fleet recommendation, mathematical estimates, inferred synergies | Explicit assumptions, cited inputs, method, uncertainties, alternatives |

**No invented consensus.** A recommendation from this project is an independently analyzed conclusion, not an official community vote. AI-generated conclusions are hypotheses until they are supported by verifiable data or testing.

## Ranking philosophy

There is no meaningful universal "best ship" without context. Evaluations should account for:

- **Game mode and scenario:** campaign, OpSi, META Showdown, Exercises, event maps, Challenge Mode, Guild Operations, and future modes.
- **Encounter and intended role:** enemy armor, air pressure, ASW, bosses, wave clearing, defensive PvP, endurance, and score/damage goals.
- **Mode-specific constraints:** OpSi multi-fleet assignments and adaptation, PvP timing and counterplay, event mechanics, auto vs. manual, and threat level where relevant.
- Ship level, limit breaks, retrofit/development/fate simulation, skills, and affinity.
- Equipment availability and enhancement.
- Fleet synergy, survivability, damage, consistency, and opportunity cost.

When evidence is insufficient, show **provisional / unknown**, not a fabricated score.

## Initial implementation plan

1. Document provenance, licensing boundaries, and a minimal validated data schema.
2. Build a fast, searchable, responsive ship-and-equipment reference.
3. Import allowable source data through a versioned, auditable pipeline.
4. Implement a mode registry and scenario-aware assessments backed by reproducible calculations and reviewed evidence, starting with representative examples from different parts of the game.
5. Add multi-mode fleet optimization (including four-fleet OpSi planning) and equipment acquisition planning.

The initial technical direction is a lightweight static web frontend with structured data and optional Python tooling for validation/imports. An AI service or continuously running backend is **not required** for the first version.

## Independence

AVALON is an independent fan project and is not affiliated with or endorsed by Manjuu, Yostar, Azur Lane Wiki maintainers, ECTL contributors, REGAL authors, or other cited community members. All product names and visual assets remain the property of their respective owners.

Code licensing and third-party data/media permissions will be handled explicitly before distributing reusable code or assets.
