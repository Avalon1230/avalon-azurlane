# Provenance, permissions, and data-quality policy

## Current status — 2026-11-10

The website includes a small editorial fallback and, in v0.2, optionally reads two external community-maintained catalogs directly from GitHub in the user's browser. The third-party sources supply up to **894 ship identities** and **936 equipment records**. They are not verified game-performance assessments or the complete objective data model. There are **no modeled damage figures, tier ratings, crafting material counts, or automatically generated combat rankings**. See [DATA_SOURCES.md](DATA_SOURCES.md) for source contracts, licenses, boundaries and failure modes.

The source URLs appear in the app under **Sources** and each catalog entry links to a separate wiki's search page for follow-up. They are **references, not permission to mirror content**. No third-party character art or equipment sprites are bundled. External pages may be outdated.

### Important Koumakan verification warning

The requested Koumakan Wiki URL `https://azurlane.koumakan.jp/wiki/Azur_Lane_Wiki` returned **unrelated text** during a November 10, 2026 public web check. The cause is unknown. **Do not automate ingestion, run scripts from it, or assume its API responses are authentic until domain ownership, content consistency, availability, and reuse permissions have been independently confirmed.** The alternative `https://azur-lane.wiki` is a separate fan-run wiki, not an official or authorized mirror of the original site; its material also requires permission/licensing review.

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