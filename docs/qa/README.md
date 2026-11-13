# v0.8.9 — real-art portrait and profile evidence

Captured from the actual application with live catalogs and original game artwork in [passing CI 43366734271](https://github.com/Avalon1230/avalon-azurlane/actions/runs/43366734271), commit `382fe99721ee249b0649c8b2c83317a25e002e40`. No fixture image/catalog routing was used in these six live sessions. Mobile galleries were scrolled into view and required to finish loading before capture.

| Viewport | PR Neptune | DR Drake | Hiryuu META |
| --- | --- | --- | --- |
| Desktop, 1280px | ![PR desktop](live-pr-1280-portrait.png) | ![DR desktop](live-dr-1280-portrait.png) | ![META desktop](live-meta-1280-portrait.png) |
| Mobile, 390px | ![PR mobile](live-pr-390-portrait.png) | ![DR mobile](live-dr-390-portrait.png) | ![META mobile](live-meta-390-portrait.png) |

These are untouched application screenshot crops, not generated art. The 7px outer frame area is separate from the image. PR uses gold, DR a prismatic surround, and META a dark/copper treatment. Profile and roster geometry is also checked in the interaction tests. Original artwork rights remain with the game rights holders; these small captures document implementation QA, not a reusable artwork asset pack.

[Full desktop/mobile profiles and interaction screenshots](https://github.com/Avalon1230/avalon-azurlane/actions/runs/43366734271/artifacts/14009914224). Downloaded archive SHA-256: `ea2a07e81a9ffee8b88bf1d71534f29bef1fd06fbbef267e4c6bdd33ae877fe5`.

Sources: [Neptune](https://raw.githubusercontent.com/iujab/azurlane-images/main/thumbnails/29901.png), [Drake](https://raw.githubusercontent.com/iujab/azurlane-images/main/thumbnails/29904.png), [Hiryuu META](https://raw.githubusercontent.com/Fernando2603/AzurLane/main/images/skin/9707010/shipyard.png). Full galleries continue using the existing source-mapped artwork loader.

Visual inspection covered the portrait treatments and representative loaded desktop/mobile profiles, including the combined controls and deltas. Independent QA is still required; these captures do not validate battle performance.

---

## Historical v0.8.8 evidence

# Research portrait evidence

These are cropped **actual application screenshots**, captured by `scripts/research-interaction-smoke.mjs` in [CI 43332133024](https://github.com/Avalon1230/avalon-azurlane/actions/runs/43332133024) at implementation commit `09cf28a1ec303b659086a0beaa9e48facf3de770`. No mocked catalog or image routes were used for these two sessions. Full profiles and modal interaction captures are in that run's `research-ui-screenshots` artifact.

| PR Neptune, desktop 1280px | DR Drake, mobile 390px |
| --- | --- |
| ![Neptune PR ornament](research-pr-portrait.png) | ![Drake DR ornament](research-dr-portrait.png) |

Portrait sources: [Neptune](https://raw.githubusercontent.com/iujab/azurlane-images/main/thumbnails/29901.png), [Drake](https://raw.githubusercontent.com/iujab/azurlane-images/main/thumbnails/29904.png). Official game artwork is hosted by a community mirror; artwork rights remain with the game rights holders. These small screenshots document QA appearance, not a reusable asset pack or a new artwork license. The original AVALON SVG ornaments are separate from the underlying portraits and contain no REGAL graphics.
