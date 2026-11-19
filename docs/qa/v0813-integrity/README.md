# v0.8.13 INTEGRITY developer verification

Implementation: `e41c8ef48cc8c474d2dd06c03f30643432646365`. [PR #36](https://github.com/Avalon1230/avalon-azurlane/pull/36) is unmerged. This records developer verification, not independent QA or live deployment acceptance.

## Reproducible evidence

- [Passing full CI run 44551931226](https://github.com/Avalon1230/avalon-azurlane/actions/runs/44551931226), check and viewport jobs both successful.
- [41 original browser screenshots](https://github.com/Avalon1230/avalon-azurlane/actions/runs/44551931226/artifacts/14543236969), artifact `integrity-ui-screenshots` (10,330,597 bytes).
- Downloaded ZIP SHA-256: `dffcfe459732871fd7f4bd4d1b8911513ccb4cd8a1f24d62636bed15b9101a3d`.
- [Versioned report](report.json): screenshot SHA-256 values, resolved source URLs and decoded dimensions, browser version, functional assertions and missing-image limitations. The report was copied unchanged from this CI artifact.
- CI artifacts have retention limits and may require GitHub sign-in. The manifest remains versioned; regenerate captures with `node scripts/integrity-interaction-smoke.mjs` at the implementation commit if the artifact expires. Later external artwork can differ; compare recorded hashes and URLs.

The capture clock is fixed at **2026-11-19 10:00 Asia/Manila** (`2026-11-19T02:00:00Z`). The urgent-deadline capture separately advances to exactly 48 hours before the production JP shop close. These are controlled-clock browser captures, not current live-site countdown claims. Functional cases deliberately block upstream images to test fallback behavior; the full capture stage subsequently uses actual remote art, validates decoded images and exercises fullscreen. Report limitations are empty for that stage.

## Results

334 Node tests passed; syntax, generated data, release consistency, catalog and pinned-source audits passed. Browser coverage includes 63 viewport cases, Events interactions, INTEGRITY at 360/390/768/1280px, 10 combat sessions, four research sessions, 10 current and 10 baseline original-art sessions. All 16 sampled original augment images passed. Seven collaboration-logo requests were throttled (HTTP 429); **zero logos newly certified**.

INTEGRITY verifies keyboard disclosure/focus, region retention, both galleries and background controls, exact-skin links and reload, identity-portrait preservation, artwork-viewer Tab/Shift+Tab/Escape, unchanged saved six-slot loadouts, overflow, the exact JP 48-hour threshold and user-triggered update reload with saved data retained.

## Visual review scope

The following final-artifact screenshots were individually inspected. No clipped text, overflowing controls or missing artwork was observed in these views; this is a sampled visual review, not a claim that every screenshot or every catalog entry was manually inspected.

| Screenshots | Reviewed result |
| --- | --- |
| `schedule-collapsed-390.png`, `schedule-collapsed-1280.png` | Compact regional summaries, visible countdowns, closed detail disclosure |
| `schedule-expanded-360.png` | Mobile disclosure and regional detail text fit the viewport |
| `urgent-deadline-390.png` | JP shop deadline remains visible while details are closed |
| `1180001-alternate-390.png` | Ririsa alternate art, styled background controls, name and acquisition note |
| `1180001-no-background-1280.png` | Background-free art with unchanged identity portrait |
| `1180002-alternate-1280.png` | Mikari alternate artwork, controls and unchanged identity portrait |
| `1180002-lightbox-390.png` | Mobile original-art viewer and accessible close/fullscreen controls |
| `cosmetic-gear-390.png`, `outfit-rewards-390.png`, `furniture-rewards-390.png` | Real thumbnails, readable records and distinct cosmetic labels |

Earlier screenshot review found overly tall regional cards and unstyled native background buttons. Both were corrected before this final artifact was generated. The full 41-capture artifact also covers default/alternate/background-free/lightbox art at mobile and desktop widths, plus schedule and content views at all four widths.

## Boundaries and next step

Catalog coverage remains 66 identities / 221 occurrences, with 58 identities lacking content, 63 lacking stages and 56 lacking banners. Disputed Virtual Tower B3/D3/60-clear records remain withheld. Opera GX cache symptoms were not reproduced; release diagnostics do not certify arbitrary browser-cache freshness. The Bridge/CIC and expanded tactical intelligence remain future releases.

The closure commit contains only documentation and this report. Application, data and test files are unchanged from the fully tested implementation above. Independent QA should review PR #36's latest head, source scope, original artwork, mobile schedules, saved-state behavior and CI. Commander AVALON alone authorizes merging and deployment.
