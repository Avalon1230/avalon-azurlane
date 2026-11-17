# Events & live content — Operation CHRONICLE

v0.8.11 is released. v0.8.12 is an unmerged, source-audited regional backfill (66 identities / 221 occurrences; War Archives: EN 53, JP 51, CN 51); see [backfill ledger](EVENTS_BACKFILL.md). The catalog is deliberately partial. An empty section means no matching verified record is present, not that the game has no events.

## Architecture

| Responsibility | Location |
| --- | --- |
| Reviewed identities, occurrences, content and source ledger | `data/events/catalog.json` |
| Pure validation, dates, statuses, filtering and route parsing | `src/events.js` |
| Local catalog loading and isolated preferences | `src/events-store.js` |
| Accessible cards, timeline and encyclopedia | `src/events-view.js`, `assets/events.css` |
| One visible-page clock, in-place seconds, boundary refresh | `src/events-clock.js` |
| Existing hash routing / sidebar / content links | `src/app.js` |
| Independent ship and augment facts | `data/live-content/november-2026.json` |
| Generated runtime adapter | `src/live-content-data.js`, `src/live-content.js` |
| Source verifier | `scripts/verify-chronicle-source.mjs` |

No build framework, service worker, backend or polling of external event APIs is introduced. An update to the reviewed JSON ships with the application; the browser validates it before use. HTTP, timeout or schema failure produces a retry state without replacing other catalogs or saved state. Event preferences use only `avalon.chronicle.filters.v1`.

## Schema version 1

The catalog envelope contains `schemaVersion`, timezone-aware `updatedAt`, `coverage: "partial"`, `sources` and `events`. Every source has a stable ID, HTTPS URL, title, hierarchy type (`wiki`, `official`, `client`, `avalon`, `supplementary`), `checkedAt`, and revision or publication date. Exact wiki revisions and client commits are retained. The loader fails closed if a required source reference is unknown.

An event identity has an immutable slug `id`, title, aliases, category, optional franchise and synopsis, description, `verifiedAt`, `sourceIds`, optional artwork and a required `missing` coverage list. Categories are major, collaboration, mini, raid, research and recurring. A rerun never creates a second encyclopedia identity. Ongoing and Upcoming describe active/announced occurrences; Past Events contains completed originals, reruns and campaigns; War Archives contains only observed permanent releases for the selected region. The same identity may appear once in each applicable section. Past history does not imply permanent availability, and EN/JP/CN never inherit availability from each other. Cards count identities per section; timelines show matching individual occurrences. Card/timeline links retain the occurrence through `?occurrence=<id>` so historical rewards stay selected. Artwork has an attributed URL, optional source-verified fallback URL and meaningful alt text; it is never generated or inferred from a ship name.

Each occurrence has a globally unique `id`, `region` (EN/JP/CN), `kind` (original/rerun/war-archives/campaign), start/end, sources, optional phases, notes and revisions. Duplicate region/kind/start records are rejected. Permanent additions have no end. Known historical rewards attach to specific `occurrenceIds` so a permanent addition does not revive an old exchange shop.

Time values are discriminated objects:

```json
{"kind":"exact","value":"2026-11-26T23:59:00-07:00","zone":"Etc/GMT+7","sourceIds":["official-en-collab-maintenance"]}
```

The source ID in an update must be present in its catalog; use the actual ledger ID, not this illustrative name.

| Precision | Required facts | Display / behavior |
| --- | --- | --- |
| `exact` | ISO timestamp with offset, IANA zone, sources | Manila by default; numeric countdown, clamped at zero |
| `date` | ISO calendar date, source zone, sources | Original regional date, time TBA; no numeric countdown |
| `maintenance` | Confirmed calendar date, source zone, sources | After maintenance; planned duration never becomes launch time |
| `tba` | Source zone and announcement sources | TBA; no predicted date or numeric countdown |

`releaseState` is announced/released/delayed. A non-exact launch needs `releaseConfirmedAt` to become ongoing; this is the time AVALON verified release, not a fabricated launch instant. War Archives additions require a valid release observation even when an exact announced date has passed; until then they stay Upcoming/Awaiting launch and say “Planned War Archives addition · not available yet”. Future exact starts remain upcoming; delays suspend the start countdown. An expired end always wins over stale release flags. Date-only ends remain inclusive through that source-zone day and expire at the next day boundary. EN uses fixed UTC−7, not an America/Los_Angeles DST timezone. Historical unknown launch times do not become exact retrospectively.

A phase has a unique ID, label, kind (stage/mission/shop/claim/other), independent `at` time and source IDs. Closing a shop or reward window is separate from event end. Do not assume a grace period. Revisions append `changedAt`, reason/note and sources, while the active start/end is replaced with the newly confirmed value. Estimates and community speculation cannot populate confirmed time objects.

The visible-page clock updates timer text every second, with `aria-live="off"` to avoid repeated screen-reader announcements. It rerenders only at status/phase boundaries and restores focus and scroll. It stops when hidden/off-page, recalculates after visibility returns, and tracks all displayed servers on detail pages. Its signature is keyed to the view scope; changing region or entering/leaving a detail page silently seeds a new baseline. Genuine same-scope deadlines still trigger a refresh and notification. Changing a browser clock may change the displayed result; no server-authoritative clock service is claimed.

Content uses stable per-event IDs, kind, name, optional description/quantity/cost/currency/rarity, required regional and occurrence scope, and source IDs. Kinds distinguish ship/equipment/augment/gear-skin/outfit/cosmetic/furniture/currency/mission/reward/shop/mechanic/requirement/other. Numeric `shipId`/`equipmentId` and canonical `augmentId` link to the existing profiles. A gear skin cannot carry an equipment ID or combat stats. Drop rates need their own evidence references; absent rates are never treated as zero or estimated. Missing content is omitted with an explicit coverage note.

Stage records are separately scoped to occurrences and sources. Names, difficulty, boss and unlock requirements can be published only when verified. The current seed includes challenge and map overview facts, not a full enemy database.

## Fleet Lab integration boundary

CHRONICLE opens the established Fleet Lab in Events mode for manual planning. It does not generate an event-specific fleet or translate event prose into recommendations.

A future stage encounter model may attach `encounter: {id, evidenceClass: "verified-client", sourceIds}`. Unknown sources and heuristic evidence are rejected. The encounter registry should resolve that stable ID to versioned enemy waves/composition, boss armor/levels, timing and mechanics, fleet restrictions and skill/gear interactions, with field-level sources and unknowns. Recommended roles and reward-efficiency analysis require separately labeled analysis, assumptions and battle validation.

Implement that registry through the existing [Fleet Optimizer Specification](FLEET_OPTIMIZER_SPEC.md), `combat-scenario.js` session context, `combat-evaluate.js` capability/unsupported guards and reproducible-component evidence contract. A verified encounter is an input, not evidence that a simulated recommendation is valid. Do not feed missing armor, hit rates, drop rates or unknown skills into guessed defaults. Only after these gates and independent QA should **Build a Fleet for This Event** apply a preview through the existing explicit apply flow. No such recommendation is enabled in v0.8.11.

## Initial coverage ledger

| Identity | Recorded history | Remaining gaps |
| --- | --- | --- |
| It’s Showtime! Angels’ Azur Stage | EN/JP/CN Nov 12–26, 2026, regional sales deadlines, mission unlocks/rewards, 2 ships, 2 augments, 14 cosmetic gear-skin IDs, outfits, furniture theme, Battle UI and challenge rewards | Enemy/boss data, synopsis, furniture item inventory; exact EN/JP unlock hours; no verified currency shop/drop rates/post-event grace period |
| Effulgence Before Eclipse | Original and rerun for EN/JP/CN; officially announced JP War Archives addition with date TBA | Exact permanent-addition date, unannounced EN/CN additions, rewards/enemies |
| Divergent Chessboard / Opposite-Colored | Original and rerun for EN/JP/CN; selected historical ship acquisition | Permanent dates, full stages/shops/drop tables |
| Visitors Dyed in Red | Original and rerun for EN/JP/CN; selected historical ship acquisition | Permanent dates, full stages/shops/drop tables |
| The Fool’s Scales | Original and rerun for EN/JP/CN; verified EN War Archives addition Nov 5, 2026; occurrence-scoped historical ship rewards | JP/CN permanent dates, detailed permanent rewards/enemies |
| Tempesta and the Corridor of Fog | 2026 EN/JP/CN original dates; EN event/shop/claim deadlines; selected rewards and stage notes | Exact JP/CN deadline hours and complete shops/enemies |
| Bayard Blueprint Completion Plan | EN Nov 5–Dec 2, 2026; up to 30 blueprints | Other regional announcements and further campaign runs |
| Island Development Plan Season V | EN Nov 5, 2026–Feb 1, 2027; gates and claim expiry | Regional equivalents and detailed reward tiers |

The full historical catalog, recurring rotations, raids, old collaborations and most permanent-addition dates remain to be researched. Do not infer absent events or periods from adjacent runs. The seed count is eight identities and 34 regional occurrences.

## Featured-event source audit

- [Koumakan event revision 307891](https://azurlane.koumakan.jp/w/index.php?oldid=307891), revised November 14, 2026: encyclopedic event/mission history.
- [EN maintenance notice, November 11](https://azurlane.yo-star.com/news/2026/11/11/maintenance-notice-11-12-12-a-m-utc-7-2/): event end November 26 at 23:59 UTC−7 (November 27, 14:59 Manila). Maintenance duration is not a launch guarantee.
- [JP maintenance notice 771, November 10](https://azurlane.jp/news/771): event end November 26 at 23:59 JST (22:59 Manila); cosmetic sales end November 25 at 23:59 JST. Also announces the future Effulgence permanent addition without a date.
- [Official CN notice](https://www.taptap.cn/moment/869277954591424622?group_id=2657) and [live hotfix](https://www.taptap.cn/moment/870039693318688612?group_id=2657): UTC+8 event/sales and midnight unlocks.
- [Yostar launch release via Games Press](https://www.gamespress.com/Azur-Lane-x-25-Dimensional-Seduction-Collaboration-Its-Showtime-Angels), November 12: observed release and public supporting artwork fallback.
- Ririsa [wiki revision 307890](https://azurlane.koumakan.jp/w/index.php?oldid=307890), Mikari [307889](https://azurlane.koumakan.jp/w/index.php?oldid=307889); augments [307862](https://azurlane.koumakan.jp/w/index.php?oldid=307862) and [307863](https://azurlane.koumakan.jp/w/index.php?oldid=307863).
- [Pinned EN client 479c350c5824b8bc8b385102bdc4d31b310e3e0a](https://github.com/AzurLaneTools/AzurLaneLuaScripts/tree/479c350c5824b8bc8b385102bdc4d31b310e3e0a/EN), version 9.3.392: exact GroupIDs, form IDs, collection identity, slots, augment items, skills and cosmetic IDs. This is a community-maintained extraction of client records, not a publisher API.

All other exact source URLs, revision/publication dates and checking dates are in the catalog and displayed on the relevant event page.

## Independent ship ownership and reconciliation

| Ship | Stable AVALON ID | Client GroupID | Collection ID | MLB form | Exclusive augment |
| --- | --- | --- | --- | --- | --- |
| Liliel Angel Paratroopers/Ririsa | avl-1180001 | 1180001 | 10181 | 11800014 | aug-15960 (Rod) |
| Miriella Angel Paratroopers/Mikari | avl-1180002 | 1180002 | 10182 | 11800024 | aug-15980 (Bow) |

Wiki-matched level statistics use 100 affinity at level 100+ and maximum enhancements. Skills are paraphrased from pinned mechanics; augment upgrades are separated from base skills and never silently added to stats/combat calculations. Slot restrictions come from the exact client form. Augment eligibility matches collection ID plus hull, not the seven-digit GroupID.

`mergeShipCatalog` matches exact `sourceId` before names and retains the owned `avalon-verified` record. When upstream adds these ships, a separate reviewed reconciliation can choose newer fields without changing AVALON IDs or saved loadouts. Cosmetics have no entries in the standard equipment index. Existing old manifest counts remain dated; the two live augments are a separate, explicit addition.

## Updating safely and sustainably

1. Open a new content branch from current main. Read the coverage ledger and existing identity/aliases before creating IDs. Check official announcements per region; never copy another region’s end time.
2. Use Koumakan’s documented API for a small selected set of titles/revisions with a descriptive user agent and caching. Respect current access policy, `maxlag`, Retry-After and licensing. Stop on access/rate limits. No whole-wiki mirroring or periodic browser scraping. Preserve revision URLs and verify game/client source IDs, not just translated names.
3. Record the source and date precision first. Mark unconfirmed dates TBA. For maintenance windows, publish the confirmed calendar date and await a completion/launch notice; use the real verification observation time. Append a revision record for announced schedule changes or delays.
4. Add only the facts verified by those sources. Scope every reward/stage to the correct regions and occurrences. Leave `missing` notes for omitted synopsis, enemies, prices, drops, claim deadlines and art. Keep historical content separate from currently obtainable content.
5. For new ships/augments, add a local owned record and source hashes; validate GroupID/collection/form IDs and existing IDs. Run `node scripts/build-live-content.mjs`, then `npm run check`, `npm test` and `npm run test:chronicle-source`. The source verifier downloads only four pinned files, checks hashes, and parses literal tables without executing Lua. Generated data must match its reviewed JSON.
6. Run the full existing CI plus `scripts/events-interaction-smoke.mjs` in the configured CI browser. Check upcoming, live and expired boundaries with a controlled clock; EN/JP/CN, mobile, keyboard, missing images, API failure, history and persisted data. Screenshots must state the observation time and distinguish test fixtures from production records.
7. Update CHANGELOG, this coverage ledger and PROJECT_STATUS. Open a PR with exact sources and screenshots. Regular ChatGPT performs independent QA; Commander AVALON alone authorizes merging and release.

For ongoing maintenance, review publisher notices at each announced maintenance, expand history in small source-audited year/event batches, and periodically reconcile source IDs and artwork availability. The app does not automatically ingest announcements; no scheduled maintenance job is claimed.

### v0.8.12 backfill evidence contract

`data/events/backfill-evidence.json` stores reviewed facts separately from the runtime catalog: 51 archive-index identities with explicit regional dates, the initial 24 publisher-backed occurrences, eight selected history records with explicit All Servers scope, and the pre-expansion stable IDs. `scripts/event-evidence.mjs` compares these facts to the catalog in CI. This is an offline consistency check, **not a fresh live-source audit**. Update both only after re-reading the cited sources; record disagreements rather than manufacturing consensus. See [EVENTS_BACKFILL.md](EVENTS_BACKFILL.md) for the revision-pinned reconciliation and remaining gaps.

The Events index explicitly groups CN/JP in one column. That joint source statement is recorded as two independently addressable occurrences; EN dates come from the separate EN column. A missing regional cell is never copied from another region. The War Archives detail index omits addition dates for Anthem of Remembrance and Frostfall; only their separately verified EN additions are published here. Archived availability does not transfer original event rewards.

Search & filters starts collapsed on page load. Its native button exposes `aria-expanded` and `aria-controls`; hidden controls leave keyboard order. The visible summary identifies the region, actual query and active selections. Expansion preserves focus and query/filters; Cards/Timeline remain outside. Only the existing Events preferences key is persisted. A disclosure toggle is not an event-schedule change.

Developer acceptance evidence for v0.8.12 is recorded in [the 39-capture QA index](qa/v0812-chronicle/README.md). It names the exact implementation SHA, fixed observation clock, passing workflow and remaining source/artwork limits. Released v0.8.11 remains the eight-identity / 34-occurrence baseline until Commander-authorized merge and release.
