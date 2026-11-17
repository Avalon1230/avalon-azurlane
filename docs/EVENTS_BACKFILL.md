# Operation CHRONICLE — EN historical and War Archives backfill

**Status:** v0.8.12 feature branch; independent QA and Commander merge authorization pending.

## Scope and sourcing

Initial v0.8.11: **8 event identities / 34 regional occurrences**, one verified EN permanent addition. Current branch: **29 identities / 58 occurrences**, **14 confirmed EN War Archives entries** (13 newly added), plus 11 explicitly dated historical EN runs. This is NOT the complete Azur Lane archive. The new records are **EN-only**; no JP/CN permanent availability is inferred.

Commander-selected primary indexes: [Koumakan Events](https://azurlane.koumakan.jp/wiki/Events) and [Koumakan War Archives](https://azurlane.koumakan.jp/wiki/War_Archives). Both returned **HTTP 403** in this browsing environment on 2026-11-17, so this batch does not claim a complete index extraction. Source-backed publisher maintenance notices establish each EN availability claim. Koumakan/API reconciliation remains pending.

## EN War Archives additions verified from Yostar

| Event | EN addition (after maintenance) | Official notice |
| --- | --- | --- |
| Virtual Tower | 2025-03-20 | [Mar 19](https://azurlane.yo-star.com/news/2025/03/19/maintenance-notice-3-20-12-a-m-utc-7/) |
| Pledge of the Radiant Court | 2025-04-17 | [Apr 16](https://azurlane.yo-star.com/news/2025/04/16/maintenance-notice-4-17-12-a-m-utc-7/) |
| Tempesta and the Fountain of Youth | 2025-10-16 | [Oct 15](https://azurlane.yo-star.com/news/2025/10/15/maintenance-notice-10-16-12-a-m-utc-7/) |
| Violet Tempest, Blooming Lycoris | 2025-11-06 | [Nov 5](https://azurlane.yo-star.com/news/2025/11/05/maintenance-notice-11-6-12-a-m-utc-7/) |
| Parallel Superimposition | 2025-12-18 | [Dec 17](https://azurlane.yo-star.com/news/2025/12/17/maintenance-notice-12-18-12-a-m-utc-7/) |
| Revelations of Dust | 2026-01-29 | [Jan 28](https://azurlane.yo-star.com/news/2026/01/28/maintenance-notice-1-29-12-a-m-utc-7/) |
| Anthem of Remembrance | 2026-05-07 | [May 6](https://azurlane.yo-star.com/news/2026/05/06/maintenance-notice-5-7-12-a-m-utc-7-2/) |
| Confluence of Nothingness | 2026-06-12 | [Jun 11](https://azurlane.yo-star.com/news/2026/06/11/maintenance-notice-6-12-12-a-m-utc-7-2/) |
| Interlude of Illusions | 2026-06-18 | [Jun 17](https://azurlane.yo-star.com/news/2026/06/17/maintenance-notice-6-18-12-a-m-utc-7/) |
| Frostfall | 2026-07-09 | [Jul 8](https://azurlane.yo-star.com/news/2026/07/08/maintenance-notice-7-9-12-a-m-utc-7-2/) |
| Welcome to Little Academy | 2026-08-27 | [Aug 26](https://azurlane.yo-star.com/news/2026/08/26/maintenance-notice-8-27-12-a-m-utc-7-2/) |
| Tempesta and the Sleeping Sea | 2026-10-15 | [Oct 14](https://azurlane.yo-star.com/news/2026/10/14/maintenance-notice-10-15-12-a-m-utc-7-2/) |
| Tempesta and Islas de Libertád | 2026-10-15 | [Oct 14](https://azurlane.yo-star.com/news/2026/10/14/maintenance-notice-10-15-12-a-m-utc-7-2/) |

**The Fool's Scales (EN 2026-11-05)** remains unchanged from v0.8.11 as the fourteenth entry. Earlier unverified original/rerun dates have not been invented for the archive-only entries. Permanent records do not inherit old exchange shops or PT rewards.

Additional EN historical event identities or occurrences sourced from dated notices: A Note Through the Firmament, Hammann's Scrumptious Spells, The Strict Maid Isn't So Strict, Joint Operation — The Big Shot's Proclamation, Light of the Martyrium rerun, Sharing Sweet Slumbers rerun, Big Lessons for the Little Lady rerun, Shipbuilding Support Plan: Northern Parliament, and added Frostfall, Anthem of Remembrance and Revelations of Dust rerun histories. Starts following maintenance remain date-precision; published 23:59 UTC−7 endings have exact offsets.

## Repeatable verification and update procedure

1. Review the two Koumakan indexes through permitted access; if unavailable, document the blocker and use dated official announcements specific to EN, JP or CN.
2. Match each event to an immutable identity; all originals, reruns and permanent additions for one event share this identity. Keep aliases stable.
3. Add each separately verified server occurrence with immutable ID, source IDs and actual precision. Never inherit regional availability or infer exact maintenance completion times.
4. Keep the historical release date separate from retrospective source verification. The releaseConfirmedAt field is the verification observation time, not the original launch clock.
5. Only add rewards and shops when their exact occurrence and availability are source-confirmed. Expired shops and limited PT stay historical.
6. Run node scripts/audit-event-catalog.mjs, npm test, npm run check, pinned source checks, browser responsive QA, and inspect cards/timeline for all four sections.
7. Commit small documented batches, update the status handoff, and request independent QA. **Do not merge without Commander authorization.**

**Open gaps:** complete 2017–2026 history, unverified originals/reruns, remaining archive additions, independent JP/CN data, stage/boss/shop/drop details and source-backed equipment. Coverage remains explicitly partial.
