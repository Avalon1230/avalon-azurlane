# v0.8.11 — classification and independent QA corrections

[PR #34](https://github.com/Avalon1230/avalon-azurlane/pull/34) remains unmerged. This handoff addresses [review 5932532409](https://github.com/Avalon1230/avalon-azurlane/pull/34#pullrequestreview-5932532409) and the Commander's separate Past Events / War Archives requirement. Independent re-review and Commander release authorization remain pending.

## Implementation and verification

Implementation **`481b0d2dca15c6106b41523c989d21d0afc61981`** passed the [complete Quality checks run 44017033045](https://github.com/Avalon1230/avalon-azurlane/actions/runs/44017033045). The following documentation/evidence commit contains no runtime changes; consult PR head CI for its final status.

- **319 Node tests**; syntax/generated-data and all pinned-source checks passed.
- Existing 63 viewport cases, combat and research interactions, current/baseline original-art checks and asset probes passed their CI gates. External artwork remains host-dependent; a successful workflow does not certify rate-limited logos.
- New actual-application checks at **360/390/768/1280px** verify four sections, independent EN/JP/CN availability, Past Events and War Archives links to their own occurrences, expired reward isolation, and whole personal names inside heading bounds.
- Controlled clocks verify silent EN↔JP and index↔detail navigation, then genuine launch/unlock/end notifications. The unit test switches scopes at exactly frozen time, verifies no callback, then crosses a same-scope boundary exactly once. Hidden-tab resume remains covered.
- `data/events/catalog.json` and `data/live-content/november-2026.json` are byte-for-byte unchanged from the reviewed baseline: **8 identities / 34 occurrences**, stable ship/augment IDs and original source references preserved.

## Acceptance mapping

| Finding | Corrected behavior | Evidence |
| --- | --- | --- |
| Historical does not mean permanently available | Ended occurrences enter Past Events; only observed regional permanent releases enter War Archives. The Fool's Scales has both contexts under one identity. | Four-section page, timeline and War Archives captures; section/count/region tests |
| Future permanent wording | Cards, timeline, detail and history say planned / not available yet until release is observed. Even an elapsed exact announcement cannot establish permanent availability alone. | JP upcoming captures; before/after observation tests across all date precisions |
| Expired rewards | Occurrence-specific URLs retain historical content; permanent views only render content explicitly scoped to that regional occurrence. | Past-detail captures and actual navigation tests; isolated historical shop fixture |
| Split personal names | A natural break after `/` keeps the complete Ririsa/Mikari names, portrait and compact hero. | Both mobile captures; whole-name DOM range assertions at 360/390px |
| False schedule notifications | Scope changes reseed the clock silently; real same-scope boundaries still notify and refresh once. | Controlled unit/browser tests and interaction report |

## Capture provenance and gallery

22 actual-application screenshots, captured in CI on November 17 with the **same fixed clock as the baseline: November 16, 2026, 12:00 Manila (04:00 UTC)**. The unchanged production catalog is used for screenshots; synthetic boundary schedules exist only in isolated tests. Optional upstream JSON feeds are intentionally unavailable, while original art is fetched from source URLs. Empty equipment choices in offline profiles are expected.

All 15 changed/new captures were visually inspected; seven other captures are byte-identical to the previously inspected baseline. [Capture hashes, dimensions and baseline comparison](capture-manifest.json). [Interaction report](report.json). Artifact ID: `14298139612` (`chronicle-ui-screenshots`). No image editing or generated artwork.

| Scene | Desktop 1280px | Mobile 390px |
| --- | --- | --- |
| Four-section Events page | [View](events-1280.png) | [View](events-390.png) |
| Past Events timeline | [View](past-1280.png) | [View](past-390.png) |
| Verified EN War Archives | [View](war-archives-1280.png) | [View](war-archives-390.png) |
| Historical rewards retained on entry | [View](past-detail-1280.png) | [View](past-detail-390.png) |
| Upcoming JP addition, not available yet | [View](upcoming-jp-1280.png) | [View](upcoming-jp-390.png) |
| Ririsa — canonical name and portrait | [View](ririsa-1280.png) | [View](ririsa-390.png) |
| Mikari — canonical name and portrait | [View](mikari-1280.png) | [View](mikari-390.png) |
| Featured event detail | [View](detail-1280.png) | [View](detail-390.png) |
| Collaboration rewards | [View](rewards-1280.png) | [View](rewards-390.png) |
| Regional release history | [View](history-1280.png) | [View](history-390.png) |
| Featured event viewport | [View](featured-1280.png) | [View](featured-390.png) |

## Boundaries

This correction adds no historical events or inferred availability. Existing coverage gaps and the source/update procedure remain in [EVENTS.md](../../EVENTS.md). Offset-versus-IANA-zone cross-validation from the nonblocking review note remains deferred; this change does not alter any source timestamps. Approved card styles, gameplay calculations and saved loadouts are preserved. Do not merge or deploy before independent QA and Commander authorization.
