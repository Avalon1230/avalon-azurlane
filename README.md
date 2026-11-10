# AVALON — Azur Lane Intelligence

An independent, evidence-driven **Azur Lane** research and fleet-planning project.

> **Project status:** **v0.7.0 compact Ship Index and detailed ship profiles**. A first constraint-aware formation generator now suggests compatible ship assignments from a manually reviewed 39-ship candidate pool and handles all four OpSi surface fleets jointly. **Numerical combat optimization, skill-timing simulation, and automatic equipment slot builds are not implemented.**
>
> **Identity:** This is **not** ECTL, an official revival of ECTL, or an officially endorsed Azur Lane project.

[Live website](https://avalon1230.github.io/avalon-azurlane/) · [Release changelog](CHANGELOG.md) · [Development handoff](docs/PROJECT_STATUS.md) · [Koumakan connectivity diagnosis](docs/KOUMAKAN_ACCESS.md) · [GitHub commit history](https://github.com/Avalon1230/avalon-azurlane/commits/main)

The website's **Updates** section reads directly from `CHANGELOG.md`, so release notes and public change tracking share a single source.

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

## Run the prototype

No build step or external JavaScript dependencies are needed. Serve the repository root over HTTP (ES modules do not load reliably from `file://`):

```bash
python -m http.server 8765
```

Then open **http://localhost:8765**. The page includes all eight game-mode families, hull-compatible fleet plans (including four OpSi surface fleets), browser-local persistence, JSON export, source status, search, a detailed ship-profile page and equipment detail drawers. The app makes optional runtime requests to [Lycoris-AzurAPI](https://github.com/iujab/Lycoris-AzurAPI) (up to **894 source ship records**) and [Fernando2603/AzurLane](https://github.com/Fernando2603/AzurLane) (up to **936 source equipment records**). These records remain on their upstream servers; the repo does not mirror their raw data or game art. If a source fails, the small editorial index remains available. Consult [data-source contracts](docs/DATA_SOURCES.md) for coverage, limitations, permissions and freshness.

Run automated checks with Node.js 20+:

```bash
npm run check
npm test
```

For public hosting, GitHub Pages can serve the **repository root on `main`** once Pages is enabled in repository Settings. A live site is **not** implied by these source files.

**Not implemented yet:** a complete verified game data model, audited Koumakan wiki import, authoritative skill calculations, verified acquisition/crafting routes, reproducible damage/tier scores, numerical fleet optimization and automatic gear loadouts, or account/ALAS import. Upstream equipment stats are source-reported and may not be correct or complete. A role hint, rarity, source record, or evaluation criterion is **not** a performance ranking.

## Full ship and equipment catalogs (v0.7.0)

AVALON now lets you browse **every indexed ship and equipment record**, rather than rendering only the first 72 cards. The **Ship Index opens to a faction registry** with larger, high-contrast, original in-game nationality insignia and source-derived ship counts. Main factions appear first, followed by META, **Bulins** (the source's Universal utility ships), and **Collab** (combined crossover franchises with original franchise names retained on ship records). Full-roster searching recognizes both category labels and original crossover names. Select a nation to open a dense, wiki-inspired gallery of clickable original ship portraits, compact buttons for hull/index and rarity, with sorting by Name/Rarity/Hull, and 60-record pagination. Each portrait leads to a dedicated, deep-linkable ship information page, with a return-to-roster control. A **Nations** button returns to the registry. The **Equipment Index retains** its horizontally scrollable nation chips, type/hull filtering, and 60-record pagination.

- **Ships:** filter by nation/faction, hull type (DD, CL, CA, BB, CV, etc.), or search across names, hulls, rarity and nationality. Full nation mapping is sourced from Lycoris-AzurAPI's 894-ship database and joined to the compact live ship index by stable numeric ID.
- **Equipment:** filter by nation of origin, equipment category, and the hull classes **potentially able to equip** the item. Availability combines equipment `type`, explicit `ship_type_forbidden` exclusions, and equipment-slot types observed in the ship database. This denotes **some ships of the hull type**, not automatic legality for every individual ship or slot. Nation is not an equipment faction lock.

**Artwork gallery (v0.7.1):** Each ship retains its fixed shipyard portrait while a separate artwork window shows original skin illustrations. Click artwork to enlarge it and use the optional browser fullscreen control; skin selectors have readable contrast. When raw game painting layers are incomplete, the gallery prefers a source-listed static alternative where available. Faction icons no longer show overlapping name abbreviations.

**Detailed ship records:** Opening a ship loads the full Lycoris `ships.json` source on demand (about 5 MB, session-cached), adding Lv.100/Lv.120 stats, skills, equipment efficiencies, ship artwork and skins, construction/acquisition, limit breaks, and fleet tech where provided. The full source is not required for initial catalog loading. Missing source coverage (level 125, detailed barrage damage, augments, exact slot restrictions, and fleet synergy) remains unverified; consult [Ship Profile Data Contract](docs/SHIP_PROFILES.md).

A previous **890/894 count** discrepancy came from collapsing four pairs of distinct same-name ships (Enterprise, Neptune, Fubuki and Kasumi). The importer now preserves their unique source IDs and all 894 source records.

The new nationality metadata is a dated compact source snapshot; newly released IDs without mappings appear as **Unclassified**, never as a guessed nation. See [catalog filter methodology and limitations](docs/CATALOG_FILTERS.md).

## Original game artwork (v0.5.1)

The UI now shows **real in-game shipyard portraits and equipment icons**, linked directly to independently hosted original Azur Lane game-client assets—not AI-generated artwork. The sources are [iujab/azurlane-images](https://github.com/iujab/azurlane-images) for ship thumbnails and [Fernando2603/AzurLane](https://github.com/Fernando2603/AzurLane) for equipment icons. At the November 10 audit, **746/894** indexed ships had validated thumbnails, and all **936/936** equipment records had matching icon paths. Missing/blocked assets fall back to visible names and hull/category markers.

Artwork remains copyright of the Azur Lane rights holders. These repositories are **community hosts, not official publisher image servers**, and host fan-use statements do not establish formal rights-holder permission. AVALON embeds but does not mirror or bundle their binary image files. See [image sources, restrictions and provenance](docs/IMAGE_ASSETS.md). No synthetic portraits or weapons art are used.

The existing v0.5 fleet suggestion module is also now wired into the live Fleet Lab, with preserved user assignments and explicit, qualitative (not simulated) role matching.

## Combat recommendations and personal favorites (v0.3.1)

Open the [Tier Boards](https://avalon1230.github.io/avalon-azurlane/#/tiers) page:

1. **Ship Combat — AVALON editorial assessments.** Displays provisional context-bound EX/S/A/B recommendations, why that ship fits, when not to use it, alternatives, sources, confidence and review date. This is **not** a personal tier editor or a simulated damage ranking. Unreviewed ships stay **Not Yet Evaluated**.
2. **Equipment — AVALON editorial gear assessments.** Shows provisional equipment recommendations for specific target armor, situations, and roles, along with caveats, alternative gear, references, confidence and review dates. It is **not** a personal tier editor, nor a numerical best-in-slot engine.
3. **Waifu Favorites — personal and subjective.** Editable rankings for a limited, individually reviewed set of adult-portrayed characters; childlike or ambiguous portrayals are excluded.
4. **Must Protect! — Headpats Division — personal and platonic.** Editable wholesome rankings for selected childlike or little characters.

The new [AVALON assessments](src/assessments.js) combine select specialist guide evidence with explicit editorial judgment. **EX = defining for the stated role; S = highly recommended; A = strong with trade-offs; B = workable budget/situational option**. Those judgments are provisional and only comparable **within the same mode and role**; they are neither copied source grades nor computed numerical combat results. Sources include [Research Focus](https://suchiguma.github.io/miniguides/research-focus/), [Chapter 15](https://suchiguma.github.io/guides/chapter-15/), [Chapter 16](https://suchiguma.github.io/guides/chapter-16-fleets/), [REGAL](https://azur-lane-regal.suchiguma.com/), and additional linked references. Unreviewed ships and unsupported modes remain unevaluated; source coverage and confidence are visible on each card.

**Roadmap:** Expand review coverage beyond the initial evidence-backed editorial samples, then build versioned game data and reproducible combat comparisons, with numerical damage/survival/utility calculations where legitimately supported. Eventually distinguish independent AVALON evaluation from third-party expert consensus.

The two character boards remain draggable/editable, independently stored in this browser, and JSON-exportable. They do not sync across devices and contain no copyrighted art. Individual curation, **not hull class**, determines which character board includes each ship.

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

## Suggested Fleet Builder — first working implementation (v0.5)

Open [Fleet Lab](https://avalon1230.github.io/avalon-azurlane/#/fleet), select a game mode and scenario, and use **Generate suggestion**. AVALON proposes a reviewable formation from its 39 manually curated candidate ship profiles, using **global role/slot matching** to avoid duplicates and preserve any manually assigned ships. You can mark individual reviewed candidates available and enable **Use only my checked ships**. Nothing changes the saved plan until you press **Apply additions**; unfilled roles and weak/unverified role matches are flagged, with contextual source links and gear-check advisories.

OpSi's four surface fleets and submarine team are considered **together**, preventing duplicate ship use across the proposed fleets. For later Campaign stages, the builder differentiates Chapter 15 and Chapter 16 requirements. Other modes receive explicitly provisional formations, without claims of stage-specific best builds.

This is a **qualitative heuristic**, not a damage/eHP simulator or final synergistic optimizer. Ships from the larger remote catalog are not blindly assigned because rarity and hull type do not establish their verified skills. **Automatic equipment assignment, exact skill interactions, attack timelines and item inventory limits remain future work.** See [Suggested Fleet Builder instructions](docs/FLEET_SUGGESTIONS.md) and [full optimizer specification](docs/FLEET_OPTIMIZER_SPEC.md).

## Automatic Fleet & Equipment Optimizer — core requirement

The goal is not merely a tier list or an editable fleet grid. AVALON should **build a feasible formation and full equipment loadout for a specific encounter**, analyzing ship synergy, conditional skills, reload/debuff timing, enemy armor, survivability, AA/ASW, progression, and gear availability. For Operation Siren it must **optimize all four surface fleets together** rather than reuse the same ships or limited gear copies. Recommendations must include alternatives, supporting sources and uncertainty instead of claiming unvalidated numerical optima.

See the complete [Fleet Optimizer architecture and acceptance criteria](docs/FLEET_OPTIMIZER_SPEC.md). **The first role-based formation generator is implemented in v0.5. The full ship-and-equipment synergy optimizer specified here remains future work.**

## Planned features

1. **Comprehensive ship database and contextual rankings:** searchable statistics, skills, retrofits, augments, acquisition details, and assessments separated by game mode and role.
2. **Equipment encyclopedia:** source-reported identities and enhancement attributes; verified compatibility, strengths, alternatives, crafting paths, and upgrade priorities remain future work.
3. **Mode-aware fleet builder:** campaign mobs/bosses, four-fleet OpSi compositions, META Showdown, Exercises, guild bosses, support carriers, submarines, and temporary event challenges.
4. **Acquisition and progression planner:** Gear Lab recipes, research blueprints, material availability, farming strategies, and economical substitutes.
5. **Explainable recommendations:** assumptions, evidence, competing options, limitations, and review dates, including clearly labeled AVALON assessments.
6. **Patch awareness:** changed ship, enemy, mode, or equipment records trigger re-review rather than silently retaining outdated recommendations.

## Sources and attribution

| Source | Intended use | Notes |
| --- | --- | --- |
| [Azur Lane Wiki (Koumakan)](https://azurlane.koumakan.jp/wiki/Azur_Lane_Wiki) | Intended primary factual reference | **API access confirmed**: GitHub Actions successfully queried `/w/api.php` for site metadata, Musashi/Unicorn page metadata, and Musashi wikitext. Browser-visible wiki pages may still return 403 to automated clients, and cached search pages showed unrelated novel fragments. Automated ingestion awaits schema validation and reuse permissions; see [diagnostic](docs/KOUMAKAN_ACCESS.md). |
| [Historical English Community Tier List](https://slaimuda.github.io/ectl/#/home) | Historical assessments and design inspiration | This project does **not** use its identity or claim its endorsement |
| [REGAL](https://azur-lane-regal.suchiguma.com/) | Modern endgame evaluations and comparative analysis | Distinguish the source author's judgments from game facts |
| [Operation Siren reference](https://azur-lane.wiki/index.php/Operation_Siren) | OpSi map/fleet systems and progression reference | Validate mechanics against current primary sources and regional versions |
| [Chapter 15 strategy guide](https://suchiguma.github.io/guides/chapter-15/) | Example of a specific scenario guide, **not the site's core scope** | Record game context and when recommendations were published |
| Public player discussions and test reports | Observations, counterarguments, practical fleet results | Attribute authors and preserve test conditions; do not turn upvotes into proof |

Third-party game art, database content, ratings, and guide text must **not** be copied wholesale without verifying the relevant rights and attribution requirements. Linking to a source does not itself grant permission to reproduce its content.

## v0.2 data and evaluation boundaries

- [Ship source index](https://github.com/iujab/Lycoris-AzurAPI/blob/main/data/ship-list.json): community extraction (ship ID, English name, hull family, rarity); source version observed November 9, 2026.
- [Equipment source index](https://github.com/Fernando2603/AzurLane/blob/main/equipment.json): community extraction (gear ID, identity, type, rarity, reported enhancement attributes); source update observed November 6, 2026.
- [Data contracts and source limitations](docs/DATA_SOURCES.md): schema validation, licensing caveats, failure behavior, and ambiguity rules. Automated Koumakan import remains on hold.
- **Performance is not inferred from rarity.** The eight game-mode evaluation frameworks explain the factors to assess later; they do not generate tier rankings.
- The source data is requested at runtime from its maintainers. Public source availability and browser CORS policies affect loading, and user-side source data is not uploaded to AVALON.

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
