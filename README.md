# AVALON — Azur Lane Intelligence

An independent, evidence-driven **Azur Lane** research and fleet-planning project.

> **Project status:** Foundation. This repository is not yet a working website, tier list, or fleet optimizer.
>
> **Identity:** This is **not** ECTL, an official revival of ECTL, or an officially endorsed Azur Lane project.

## Mission

Make ship selection, equipment decisions, and fleet building more useful and explainable by combining verifiable game mechanics, attributed public community evidence, and independently reasoned analysis.

The goal is to answer practical questions like:

- Which fleet is most reliable for **Chapter 15-4 on auto**, given my actual ships and equipment?
- Why does a ship perform well in one scenario but poorly in another?
- Which equipment should I make next, **where does it come from**, and what does it improve?
- Is a popular recommendation supported by testing, or mostly preference?
- What changed after the latest game update?

Favorite-character ("waifu") selections are valid preferences, but will be kept separate from maximum-combat-efficiency comparisons.

## Planned features

1. **Ship database and contextual rankings:** searchable statistics, skills, retrofits, augments, acquisition details, and role-based assessments.
2. **Equipment encyclopedia:** stats, compatible hulls, strengths, alternatives, upgrade priorities, and source links.
3. **Fleet builder:** mob, boss, support-carrier, and submarine formations with stage-specific advice.
4. **Acquisition planner:** Gear Lab crafting chains, research blueprints, materials, and economical substitutes.
5. **Explainable recommendations:** assumptions, evidence, competing options, limitations, and review dates.
6. **Patch awareness:** changed ship/equipment records trigger reviews rather than silently keeping outdated recommendations.

## Sources and attribution

| Source | Intended use | Notes |
| --- | --- | --- |
| [Azur Lane Wiki (Koumakan)](https://azurlane.koumakan.jp/wiki/Azur_Lane_Wiki) | Primary factual reference for ship/equipment stats, skills, mechanics, and acquisition | Verify API availability, data version, reuse permissions, and attribution before automated ingestion |
| [Historical English Community Tier List](https://slaimuda.github.io/ectl/#/home) | Historical assessments and design inspiration | This project does **not** use its identity or claim its endorsement |
| [REGAL](https://azur-lane-regal.suchiguma.com/) | Modern endgame evaluations and comparative analysis | Distinguish the source author's judgments from game facts |
| [Chapter 15 strategy guide](https://suchiguma.github.io/guides/chapter-15/) | Stage mechanics, tested team-building advice, and equipment priorities | Record game context and when recommendations were published |
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

- Game mode and stage (campaign, Operation Siren, bosses, mob clearing, etc.).
- Enemy armor, aircraft pressure, submarines, and other mechanics.
- Auto vs. manual play; lethal vs. safe threat where relevant.
- Ship level, limit breaks, retrofit/development/fate simulation, skills, and affinity.
- Equipment availability and enhancement.
- Fleet synergy, survivability, damage, consistency, and opportunity cost.

When evidence is insufficient, show **provisional / unknown**, not a fabricated score.

## Initial implementation plan

1. Document provenance, licensing boundaries, and a minimal validated data schema.
2. Build a fast, searchable, responsive ship-and-equipment reference.
3. Import allowable source data through a versioned, auditable pipeline.
4. Implement scenario-aware rankings backed by reproducible calculations and reviewed evidence.
5. Add fleet optimization and equipment acquisition planning.

The initial technical direction is a lightweight static web frontend with structured data and optional Python tooling for validation/imports. An AI service or continuously running backend is **not required** for the first version.

## Independence

AVALON is an independent fan project and is not affiliated with or endorsed by Manjuu, Yostar, Azur Lane Wiki maintainers, ECTL contributors, REGAL authors, or other cited community members. All product names and visual assets remain the property of their respective owners.

Code licensing and third-party data/media permissions will be handled explicitly before distributing reusable code or assets.
