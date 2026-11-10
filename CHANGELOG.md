# Changelog

All notable AVALON — Azur Lane Intelligence updates are recorded here. Dates are in the Asia/Manila timezone. Version numbers track the fan application's development, not Azur Lane game versions.

## [0.4.1] - 2026-11-10

### Added
- A low-volume, read-only Koumakan connectivity check in GitHub Actions that tests actual DNS, two wiki pages, and both candidate MediaWiki API locations.
- A workflow summary classifying genuine MediaWiki API responses, normal wiki pages, unrelated content, access challenges, and networking failures.
- A [documented ingestion strategy](docs/KOUMAKAN_ACCESS.md) separating wiki corroboration, versioned game facts, community research, and independent AVALON combat judgments.

### Verified
- A GitHub Actions runner successfully resolved Koumakan and accessed `/w/api.php` with HTTP 200 JSON. Musashi and Unicorn page IDs and Musashi page wikitext were returned from read-only API requests. Ordinary wiki URLs returned 403 and root `/api.php` returned 404.

### Clarified
- Previous crawler results are not proof that the live Koumakan wiki is broken; container DNS restrictions are not necessarily origin-server problems.
- Automated ingestion remains disabled until a valid access method and compatible reuse terms are verified. The diagnostic does not scrape or store wiki content.

## [0.4.0] - 2026-11-10

### Fixed
- Ship and Equipment boards now **tell readers what AVALON recommends**, instead of showing only source-grades or asking players to provide their own rankings.
- Kept the original two subjective boards editable; combat boards remain read-only and distinct.

### Added
- Initial **15 ship-scenario assessments and 8 gear-scenario assessments**, ordered by context-bound EX/S/A/B editorial grades.
- Role-based explanations, limiting conditions, alternative picks, multiple source links where available, confidence descriptors and review dates on each assessment.
- Game-mode filtering, search, and clear **Not Yet Evaluated** treatment for the many catalog entries without reviewed evidence.
- New provenance and rendering tests covering source integrity, mode boundaries, and untrusted text escaping.

### Limitations
- These are **provisional AVALON editorial syntheses**, not simulated damage/eHP, measured performance, or a universal tier list. Uncovered modes (for example PvP) intentionally show no ratings.
- Gear crafting recipes, complete roster coverage, detailed combat simulations, and an automated review/update pipeline are still not implemented.

## [0.3.1] - 2026-11-10

### Fixed
- Corrected combat tier list ownership: **ship and equipment recommendations are made by the system**, not manually ranked by the player. Their old personal-draft controls have been removed.
- Published combat recommendation pages are read-only. Earlier personal combat-tier draft assignments are ignored, preserving the separately stored Waifu and Headpats boards.

### Added
- Select, source-attributed REGAL single-wave boss assessments and Suchiguma campaign/research equipment recommendations, each shown with original source label, context, caveat, checked date, and link.
- Research scenarios, search, and explicit **Not Yet Evaluated** status for the remaining catalog.
- Tests enforcing read-only combat research, source attribution, and continued independence of personal character boards.

### Clarified
- External specialist grades are not independent AVALON calculations or universal tiers. Full mode-specific AVALON evaluation, validation and acquisition-cost scoring remain future work.

## [0.3.0] - 2026-11-10

### Added
- Four independent tier boards: Ship Combat, Equipment, Waifu Favorites, and Must Protect! — Headpats Division.
- Drag-and-drop tier placement with dropdown controls for keyboard/touch use.
- Search and type/hull filtering, separate browser-local persistence, clear-board confirmation, and per-board JSON export.
- Individually curated character eligibility: adult-portrayed favorites only in Waifu; wholesome, platonic Headpats division for the little ones. Childlike and unreviewed portrayals are excluded from the Waifu board by default.
- Automated tier model, character eligibility, sanitization, rendering, and state validation tests.

### Clarified
- No auto-assigned combat tiers. All ships and equipment begin unranked; the boards contain **personal drafts**, not independently validated AVALON rankings.
- Ship class is not an age or portrayal classifier. Both character eligibility catalogs are deliberately incomplete and subject to manual review.
- Character art and sprites remain excluded pending licensing/attribution checks.

## [0.2.1] - 2026-11-10

### Added
- Added this canonical changelog to track releases, fixes, and documentation changes.
- Added an **Updates** view to the live website, reading entries directly from this file.

### Clarified
- Corrected the Koumakan Wiki access warning: web crawler results showed unrelated literary text, but that does not establish the live wiki is broken. The cause is unverified, and user-side browser access works.
- Kept automated Koumakan ingestion paused pending reliable, repeatable API checks and reuse/attribution review.

## [0.2.0] - 2026-11-10

### Added
- Optional runtime ship index with up to 894 entries from the independent Lycoris-AzurAPI project.
- Optional runtime equipment index with up to 936 records from Fernando2603/AzurLane.
- Source-linked ship and equipment details, enhancement attributes, and data-source status indicators.
- Context-specific evaluation criteria across eight game modes; no fabricated scores.
- Data source contracts and extraction/licensing limitations documentation.

### Improved
- Preserved previous fleet assignments while external ship data is unavailable or still loading.
- Expanded automated test coverage to 12 checks.
- Published one feature commit and deployed successfully on GitHub Pages.

## [0.1.0] - 2026-11-10

### Added
- Initial responsive AVALON web interface, hosted on GitHub Pages.
- Eight game-mode categories: Campaign, Operation Siren, META Showdown, Exercises, Events & Archives, Challenge Mode, Daily Raids, and Guild Operations.
- Searchable unranked editorial catalog containing 22 example ships and 11 equipment entries.
- Interactive formation planner with hull-slot validation, duplicate-ship prevention, four OpSi fleets, local browser persistence, and JSON export.
- Project documentation, provenance standards, and automated tests.

### Notes
- Independent fan project. Historical ECTL is a reference only, not the name or endorsement of this site.
- Ratings, automated fleet optimization, audited skill calculations, and complete equipment-acquisition data are not implemented.
