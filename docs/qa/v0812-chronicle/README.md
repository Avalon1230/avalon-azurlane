# v0.8.12 Operation CHRONICLE — QA evidence

**PR #35 remains unmerged and undeployed.** This evidence closes developer verification; regular ChatGPT performs independent QA and Commander AVALON authorizes release.

## Capture provenance

- Verified implementation: `6874171cd26df203b1220d491feeec28c58d6abb`. These are the original, unmodified browser PNGs from [passing full CI 44092525437](https://github.com/Avalon1230/avalon-azurlane/actions/runs/44092525437), captured November 17, 2026 and visually reviewed November 18 (Asia/Manila). The evidence/handoff commit changes documentation and images only.
- Artifact: `chronicle-ui-screenshots`, ID `14332961019`; original ZIP SHA-256 `0bb47effddb8b21491d40ab742e6ad5d63f72e71f1f663928866b377aec95b1f`.
- Controlled observation time: **2026-11-17 22:36 Asia/Manila** (`2026-11-17T14:36:00Z`). These are production catalog records at that test clock, not a claim about the live site at review time.
- Browser interactions ran at 360, 390, 768 and 1280px. The 39 captures cover 13 scenes at 360, 390 and 1280px, each with a 900px viewport height.
- Optional external catalog feeds were deliberately unavailable to exercise locally owned content; original artwork used real source URLs. Captures wait for visible artwork to finish loading or reach its documented fallback. No generated or substituted screenshots.
- [Machine report](report.json) and [file hashes](capture-manifest.json) preserve provenance. The final documentation commit must also pass the PR workflow; its exact head and CI link are recorded on [PR #35](https://github.com/Avalon1230/avalon-azurlane/pull/35).

## Screenshots

| Scene | 360px | 390px | 1280px |
| --- | --- | --- | --- |
| Default collapsed filters and event information | [View](events-collapsed-360.png) | [View](events-collapsed-390.png) | [View](events-collapsed-1280.png) |
| Expanded search and controls | [View](events-expanded-360.png) | [View](events-expanded-390.png) | [View](events-expanded-1280.png) |
| Ongoing section | [View](ongoing-360.png) | [View](ongoing-390.png) | [View](ongoing-1280.png) |
| Past Events section | [View](past-360.png) | [View](past-390.png) | [View](past-1280.png) |
| Expanded War Archives | [View](war-archives-360.png) | [View](war-archives-390.png) | [View](war-archives-1280.png) |
| Historical occurrence details | [View](past-detail-360.png) | [View](past-detail-390.png) | [View](past-detail-1280.png) |
| Original, rerun and permanent history | [View](history-360.png) | [View](history-390.png) | [View](history-1280.png) |
| JP switch and active-filter summary | [View](server-summary-360.png) | [View](server-summary-390.png) | [View](server-summary-1280.png) |
| JP announced TBA permanent addition | [View](upcoming-jp-360.png) | [View](upcoming-jp-390.png) | [View](upcoming-jp-1280.png) |
| Featured collaboration detail | [View](detail-360.png) | [View](detail-390.png) | [View](detail-1280.png) |
| Occurrence-scoped ships, augments and cosmetics | [View](rewards-360.png) | [View](rewards-390.png) | [View](rewards-1280.png) |
| Ririsa profile and original artwork | [View](ririsa-360.png) | [View](ririsa-390.png) | [View](ririsa-1280.png) |
| Mikari profile and original artwork | [View](mikari-360.png) | [View](mikari-390.png) | [View](mikari-1280.png) |

## Acceptance and limitations

All 39 captures were visually inspected. Event content and text fit the viewport, card spacing is consistent, and the reviewed profile artwork renders. The default-collapsed panel leaves event information visible; expansion is intentionally taller on mobile. Cards/Timeline stays outside the disclosure, and the active-filter summary wraps within the viewport. The existing mobile navigation is horizontally scrollable; this pass does not redesign it.

The filtered index retains the four section headings, including empty sections. Some backfilled events use the documented missing-art placeholder. Neither is evidence of a complete artwork or historical catalog.

| Verification | Observed result |
| --- | --- |
| Local Node suite | 325/325 passed again at the verified implementation; catalog source audit passed. |
| Full CI | Both check and viewport jobs passed; syntax/generated-data, catalog, combat source, pinned Chronicle source, research source/progression and portrait checks passed. |
| General responsive suite | 63 cases passed. |
| Events interactions | Four widths passed routes, query/filter persistence, keyboard/focus, Cards/Timeline, historical links, regional isolation, missing-image and failed-catalog recovery, and horizontal overflow checks. |
| Schedule clock | Exact launch, unlock and ending transitions passed; region/index/detail navigation and filter disclosure do not create false schedule notifications. Date-only and TBA records keep their precision. |
| Saved data | Events interaction checks preserve saved loadouts; existing fleet, loadout, combat and research regression suites passed. No storage migration or unrelated implementation change in this PR. |
| Combat, research and art regressions | 10 combat sessions, four research sessions, 10 current and 10 baseline real-art sessions passed. All 16 checked augment images passed. |
| Collaboration logos | Seven external requests returned HTTP 429; zero were newly certified by that network check. The overall workflow permits this reported upstream throttling. Do not treat it as successful verification of those logos. |

## Source recheck and coverage

The November 18 recheck fetched the current two wiki indexes through the documented MediaWiki API and matched the pinned revisions. All 153 dated regional archive records (51 identities × EN/JP/CN), 53 current archive memberships, 24 preliminary EN publisher-backed occurrences and eight selected original/rerun date pairs agreed with the recorded facts. Normal index HTML still returned 403; API access succeeded. See the [individual source ledger](../../EVENTS_BACKFILL.md).

| Region | Identities | Occurrences | Past-event identities | Available War Archives | Announced archive additions |
| --- | ---: | ---: | ---: | ---: | ---: |
| EN | 66 | 82 | 19 | 53 | 0 |
| JP | 56 | 70 | 10 | 51 | 1 (TBA) |
| CN | 56 | 69 | 10 | 51 | 0 |

Overall: **66 canonical identities / 221 regional occurrences**. Past and permanent sections can share an identity. All preliminary 29 identities and 58 occurrence IDs remain intact. Full original/rerun history remains incomplete; JP/CN permanent additions for Anthem of Remembrance and Frostfall, most detailed rewards/stages/drops and missing artwork still require source review.

The public app, faction, live-content module and November 2026 live-content JSON matched released main byte-for-byte in a separate read-only check. That limited check does not certify browser caches, runtime feeds or all external portraits. The Bridge/CIC, collapsible main sidebar and advanced encounter/fleet intelligence remain separate objectives.
