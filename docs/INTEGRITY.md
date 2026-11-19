# Operation INTEGRITY — v0.8.13

Unreleased corrective polish on `feat/operation-integrity-v0813`, based on released main `9d2ab620b875284f8732886fb9ee15634fab2c6e`. Work implements; independent QA reviews; Commander AVALON alone authorizes merging and deployment.

## Changes and evidence

| Area | Result | Evidence |
| --- | --- | --- |
| Artwork | Union reviewed sources by ship GroupID and skin ID. Retain Default and alternate outfits, names, acquisition notes, background variants and original profile portraits. Exact outfit links survive reload. | `src/artwork-merge.js`, `tests/integrity.test.js`, four-width browser suite |
| Ririsa / Mikari | Both in Heart and Mind / For My Lucky Star; separate with-background and without-background files; 1,000-Gem acquisition notes linked to regional availability. | Gallery revisions 307841 / 307844, reviewed file metadata and pinned client skin records in `data/events/integrity-evidence.json` |
| Schedules | Three regional summaries remain visible; details and milestones collapse by default. Disclosure preserves focus and region selection. Exact shop/claim deadlines appear at the 48-hour boundary. | Existing Events controlled-clock tests plus production JP deadline boundary regression |
| Event content | Source-matched thumbnails, Manga Club furniture inventory and EN-only Virtual Tower construction routes. Historical/permanent and regional scopes remain separate. | Event revision 307891, furniture revision 307716, source IDs on each content record |
| Reliability | Deterministic static build identity, release consistency validation, read-only deployment digest tool and an optional reload notice. No storage-key migration or automatic reload. | `scripts/build-release.mjs`, `scripts/verify-deployment.mjs`, Node and browser checks |
| Accessibility | Artwork viewer traps Tab/Shift+Tab and returns focus on Escape/Close. Skin/background controls preserve focus. | INTEGRITY browser suite |

The source review and evidence metadata were recovered from the November 18 work. The pinned-client verifier now checks every reviewed skin's ship group and alternate name in addition to the existing ship/augment checks. Source hashing does not establish that every external image host is currently reachable.

## Coverage and withheld claims

The catalog remains **66 identities / 221 occurrences**. Events without content decrease from 59 to 58; 63 still lack stages and 56 lack event artwork. This pass does not complete the event encyclopedia.

Virtual Tower's wiki archive table refers to B3/D3 drops and a 60-clear reward that conflict with its SP map layout. Those disputed records remain unpublished. Verified EN construction routes do not imply JP/CN availability. Cosmetic gear skins remain separate from combat equipment.

The earlier Opera GX report was not reproduced. The new checks can identify mismatched HTML/build metadata or a newer deployment manifest, and the deployment verifier can compare served files to their expected hashes. They do not guarantee arbitrary browser-cache freshness, validate every remote feed or repair external HTTP 429 responses. Browser data stays intact.

The Bridge/CIC, collapsible main sidebar, comprehensive historical/stage/reward backfill and expanded tactical intelligence remain separate work.

## Verification procedure

- `npm test`, `npm run check`, event catalog audit and all existing pinned-source checks.
- Existing viewport, Events, combat and research browser suites.
- `node scripts/integrity-interaction-smoke.mjs`: 360/390/768/1280px schedule/gallery interactions, original-source captures, fullscreen, missing-source behavior, exact-skin reload, urgent-clock threshold and saved-data checks.
- `--offline` runs the deterministic functional portion only. Its report explicitly defers original-art/fullscreen certification. The full CI workflow runs without that flag.
- CI publishes `integrity-ui-screenshots`, with screenshot hashes, fixed observation time, actual resolved artwork URLs/dimensions and explicit missing-image limitations. Tests must not treat an unavailable image as certified.

Implementation head `e41c8ef48cc8c474d2dd06c03f30643432646365` passed both jobs in [CI 44551931226](https://github.com/Avalon1230/avalon-azurlane/actions/runs/44551931226): 334 Node tests, all source/release/catalog checks and existing browser regressions. The full INTEGRITY suite captured 41 screenshots with no missing-art limitations. Seven external collaboration-logo checks returned HTTP 429 and remain unverified; this is separate from the gallery captures. [Evidence manifest and inspected views](qa/v0813-integrity/README.md) record the clock, artifact hash and review scope. The following closure commit changes documentation/evidence only. [PR #36](https://github.com/Avalon1230/avalon-azurlane/pull/36) awaits independent QA and Commander merge approval; nothing has been deployed.
