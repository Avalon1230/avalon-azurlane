# Provenance, permissions, and data-quality policy

## Current status — 2026-11-10

The catalog is a **small editorial navigation sample**, not a verified comprehensive database or ship tier list. It contains ship names, hull families, short working role labels, and selected equipment names. It contains **no numerical ship statistics, modeled damage, tier ratings, crafting material counts, or auto-generated performance conclusions**.

The source URLs appear in the app under **Sources** and each catalog entry links to a separate wiki's search page for follow-up. They are **references, not permission to mirror content**. No third-party character art or equipment sprites are bundled. External pages may be outdated.

### Important Koumakan verification warning

The requested Koumakan Wiki URL `https://azurlane.koumakan.jp/wiki/Azur_Lane_Wiki` returned **unrelated text** during a November 10, 2026 public web check. The cause is unknown. **Do not automate ingestion, run scripts from it, or assume its API responses are authentic until domain ownership, content consistency, availability, and reuse permissions have been independently confirmed.** The alternative `https://azur-lane.wiki` is a separate fan-run wiki, not an official or authorized mirror of the original site; its material also requires permission/licensing review.

### Data sources under consideration

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

After source verification, implement a **read-only, rate-limited, offline ETL step** that produces a versioned JSON snapshot with reproducible tests. Do not fetch remote wiki data from each user's browser or silently merge third-party terms into the public site.