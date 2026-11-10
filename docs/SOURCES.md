# Provenance, permissions, and data-quality policy

## Current status — 2026-11-10

### v0.3.1 research-owned combat boards

This corrects an earlier design mistake. **Ship Combat and Equipment are meant to answer what is good**, not ask users to rank items themselves. Their pages now contain **read-only, attributed, context-specific research picks**. Example source grades from REGAL must be treated as REGAL's assessments, **not independent AVALON rankings**. Suchiguma research recommendations are also cited as third-party expert guidance. No full third-party tier list is copied. Unknown items are marked Not Yet Evaluated; an absent entry is not evidence of poor performance.

Character boards (Waifu / Headpats) remain personal, subjective, and strictly separated from combat data. Production AVALON scores still require current game mechanics, confirmed gear conditions, numerical comparison, and independent validation.

### Historical v0.3 personal tier boards

Ship Combat and Equipment now include **editable personal tier boards**, but **no published AVALON performance scores**. Rarity, hull and equipment-type data cannot by themselves establish reliable EX/S/A rankings. A validated tier assessment must cite its mode/scenario, measurements, assumptions, alternative builds and confidence. Waifu Favorites and Must Protect are wholly separate subjective lists and have no combat evidentiary value. Their eligibility catalogs are manually curated and incomplete; no automatic hull-based age/appearance classification is performed. No source character portraits are copied.



The website includes a small editorial fallback and, in v0.2, optionally reads two external community-maintained catalogs directly from GitHub in the user's browser. The third-party sources supply up to **894 ship identities** and **936 equipment records**. They are not verified game-performance assessments or the complete objective data model. There are **no modeled damage figures, tier ratings, crafting material counts, or automatically generated combat rankings**. See [DATA_SOURCES.md](DATA_SOURCES.md) for source contracts, licenses, boundaries and failure modes.

The source URLs appear in the app under **Sources** and each catalog entry links to a separate wiki's search page for follow-up. They are **references, not permission to mirror content**. No third-party character art or equipment sprites are bundled. External pages may be outdated.

### Important Koumakan verification warning

During a November 10, 2026 crawler-mediated web check, the requested Koumakan page `https://azurlane.koumakan.jp/wiki/Azur_Lane_Wiki` was indexed as **"Body is like."**, showing unrelated snippets resembling *Nineteen Eighty-Four* and *Brave New World*. A `/wiki/Musashi` fetch returned **"Tarians or the law of."** with similar unrelated prose; additional indexed paths show the same mismatch. These results can be old or otherwise crawler-specific. **The user reports the actual wiki works normally in their browser.** We do **not** know whether the mismatch originates in cached/indexed pages, a crawler-specific response, an intermediary, or another cause; we have **no evidence that the live wiki is compromised or down**.

A separate GitHub Actions runner **has now validated machine-readable Koumakan API responses** using `/w/api.php`, including a Musashi wikitext read and page metadata for Musashi and Unicorn. HTML page requests from that runner returned 403; API reads returned 200. Automated **data ingestion** remains deferred until schema/template interpretation, respectful access rules, and applicable reuse permissions are reviewed. See [access findings](KOUMAKAN_ACCESS.md). **Direct user-facing wiki links remain allowed.** The separate `https://azur-lane.wiki` is a different fan-run wiki and should not be mislabeled as an official Koumakan mirror.

### Source indexes used in v0.2 (at runtime only)

- **Lycoris-AzurAPI**: [ship-list.json](https://github.com/iujab/Lycoris-AzurAPI/blob/main/data/ship-list.json); third-party ship ID, name, hull family, and rarity. Snapshot date is displayed when available. Project declares GPL-3.0.
- **Fernando2603/AzurLane**: [equipment.json](https://github.com/Fernando2603/AzurLane/blob/main/equipment.json); equipment identities, type, rarity and reported enhancement attributes. No published repository license was found during the audit; no raw data or art is copied into AVALON's repository.

## Data sources under consideration

- **Koumakan Wiki:** primary target for game facts **after** a successful verification and license audit.
- **Azur Lane EN patch notes:** release/update corroboration. The 2026 Gear Lab notes list the FW-190 G-3/R1 and Fairey Gannet additions: https://azurlane.yo-star.com/news/author/azur-lane/page/5/
- **REGAL:** context-specific third-party expert interpretation; don't relabel as canonical facts: https://azur-lane-regal.suchiguma.com/
- **Chapter 15 guide:** example of narrow game mode analysis (not site-wide defaults): https://suchiguma.github.io/guides/chapter-15/
- **Historical ECTL:** historical opinion and UX inspiration, NOT the product name, endorsement or imported rankings: https://slaimuda.github.io/ectl/#/home
- **Separate fan-run wiki:** optional link for manual follow-up: https://azur-lane.wiki/index.php/Main_Page

## Required records for future ingestion

Every imported factual record should declare:

- A stable ship/equipment identifier and game/server version.
- The precise source URL, retrieval date/time, source content version or checksum where possible.
- Provenance type: official patch, wiki data, independent test, community discussion, or AVALON inference.
- A validation status (`unchecked`, `corroborated`, `disputed`, `stale`), with reasons.
- License/permission status and author attribution appropriate for the content type.

Any performance assessment additionally needs a mode/scenario, enemy context, loadout, test method, assumptions, uncertainty, and last-reviewed date. A popularity poll never constitutes a combat-performance measurement.

## Recommended next step

Verify permissions for broader reuse and implement an auditable, pinned snapshot pipeline only when authorized. This release performs **optional direct browser reads of GitHub-hosted third-party indexes**, not unverified Koumakan wiki scraping. Add complete ship stats, enemy data, equipment recipes, and scenario testing before attempting evidence-based scoring.

## v0.4 initial editorial reviews

The current [AVALON assessment records](../src/assessments.js) are independently authored summaries of contextual recommendations supported by linked third-party guides. They use **provisional editorial** EX/S/A/B grades, not their sources' original grade notation and not numerical modeling. Each assessment includes a game mode, role, conditions and limitations, editorial evidence-confidence descriptor, sources and a review date.

The primary references include Suchiguma's [Research Focus](https://suchiguma.github.io/miniguides/research-focus/), [Chapter 15](https://suchiguma.github.io/guides/chapter-15/), and [Chapter 16 Fleets](https://suchiguma.github.io/guides/chapter-16-fleets/), plus [REGAL](https://azur-lane-regal.suchiguma.com/) and clearly labeled secondary guides. The original authors are not endorsing AVALON and their sites may change independently. Where there is no reviewed evidence, the interface says **Not Yet Evaluated** instead of inventing a grade.

**Confidence is qualitative**, not an estimated success percentage. High or moderate confidence is not a substitute for controlled measurements; independent ship, gear, mode and enemy tests remain required before numerical performance claims or fully automated fleet optimization.
