# Original Azur Lane artwork and equipment icons

**AVALON v0.8.5 · November 11, 2026**

## What is displayed

AVALON displays **original game-client assets**, not AI-generated illustrations or artist imitations.

| Item | Community-hosted source | Match method | Audit coverage |
| --- | --- | --- | --- |
| Ship thumbnail / shipyard portrait | [iujab/azurlane-images](https://github.com/iujab/azurlane-images/tree/main/thumbnails) | exact ship group ID from [Lycoris-AzurAPI](https://github.com/iujab/Lycoris-AzurAPI/blob/main/data/ship-list.json), or vetted initial name–ID mapping | **746 / 894 indexed ships** |
| Equipment icon | [Fernando2603/AzurLane equipment assets](https://github.com/Fernando2603/AzurLane/tree/main/images/equipment) | exact per-record image filename from [equipment_icon.json](https://github.com/Fernando2603/AzurLane/blob/main/equipment_icon.json); 417 shared-icon aliases verified against asset tree | **936 / 936 source ID mappings** |

The image endpoints are fixed, trusted `raw.githubusercontent.com` repository paths. Ship thumbnail availability comes from a checked-in manifest of filenames, and exact source-linked base skin IDs provide a second portrait option; no fuzzy "best guess" image matching is performed. Equipment icons use the verified equipment-ID-to-image-file mapping supplied by the upstream author (variants may share a base icon filename). For some retrofit entries, the base ship portrait is displayed rather than a distinct retrofit illustration. **No ship portrait is intentionally substituted with another ship's artwork.**

The images are requested directly by the visitor's browser from the upstream community hosts, not downloaded, altered, or bundled in AVALON's repository. Each image is lazily loaded. Missing or blocked art falls back to the ship's hull or a gear glyph, with the item's name preserved.

## Verified augment icon mapping (v0.8.5 corrective hotfix)

The dated [AzurLaneData augment source](https://github.com/Linuxxy0/AzurLaneData-2026-5-2-16-08-11/blob/main/data/augments.json) lists **239 records with explicit `icon` keys**, including **12 source-defined shared aliases**.

**Original failure:** The initial v0.8.5 release requested `al.mrlar.dev/equips/<icon>.webp`—the ordinary gear icon directory. Most augment keys failed; overlapping numeric equipment IDs produced incorrect gun artwork. This was reproduced in the user's November 11, 2026 live-site screenshot. Source ID matching alone was not evidence of image identity.

**Correct source:** The independent [JforPlay `spweapon` directory](https://github.com/JforPlay/data_for_toy/tree/main/spweapon) contains **258 actual augment `.webp` filenames**. An exact-filename comparison against the May source confirmed **239/239 augment icons present**, including all 12 aliases. The app uses `https://raw.githubusercontent.com/JforPlay/data_for_toy/main/spweapon/<icon>.webp` for augment art. It is independently community-hosted, not publisher-hosted.

CI now validates actual HTTP/WebP bytes from 16 representative game-client icons and checks collision-free filter controls at seven desktop/mobile widths. Successful probes do not guarantee future external-host availability. The ✦ placeholder remains for failed image delivery and five October announcement-only records without verified art; no generated or borrowed regular gear art is used.
## Complete equipment-icon mapping (v0.7.7)

The 936-record `Fernando2603/AzurLane/equipment_icon.json` associates every equipment record ID with an exact original game-client icon. Crucially, **417 equipment record IDs intentionally point to another filename**, typically a shared icon for the same equipment line/rarity variant (for example, record `1020` uses `1000.png`, not a nonexistent `1020.png`). The old AVALON renderer incorrectly assembled every image URL from the record ID alone.

AVALON's generated `src/equipment-assets.js` preserves all **936 explicit ID-to-icon mappings**, with each mapped filename verified against the source's `images/equipment` Git tree. The Equipment Index and its inspection drawer now resolve icons through that source mapping, not a speculative formula. Image binaries remain linked from the independent community host and are not copied or changed. Coverage means file paths were verified in Git, **not** that each URL always loads in a visitor's browser; blocked/failed image requests still show readable placeholders. Every game icon remains publisher-copyrighted fan-linked material, never AI-created artwork.

## Source-ID-verified shipyard portrait fallback (v0.7.6)

The older thumbnail inventory covers **746 of the 894 current ship records**. Missing portraits such as Collett (10156), Vicksburg (10236), and Bennington (10720) are not evidence of missing characters: the separate Fernando2603/AzurLane asset repository contains their extracted `shipyard.png` images at default skin IDs 101560, 102360, and 107200.

Every one of the 894 ships in AVALON's `data/ship-artwork.json` contains its own base skin ID matching `GroupID × 10` (including nontrivial skin ordering, such as Le Malin μ). `src/shipyard-assets.js` stores only these validated group IDs and constructs URLs exclusively on the trusted game-asset host; no unverified name-to-art association or invented illustrations are used.

- Existing thumbnail available: prefer its smaller `thumbnails/<GroupID>.png` file; if it fails, retry `images/skin/<BaseSkinID>/shipyard.png` once.
- No existing thumbnail: request `images/skin/<BaseSkinID>/shipyard.png` immediately, using a verified source ID.
- If the second host fails, keep the existing hull/name fallback rather than show the wrong character.
- Metadata coverage is **894 mapped shipyard skin IDs**, not a guarantee that all 894 third-party images currently exist or render correctly. Source paths were verified for the reported missing Eagle Union examples, and tests check identity mappings across all factions.

The base-skin ID mapping is checked against the source artwork manifest in regression tests. No additional large artwork manifest is fetched just to paint the roster, and no image binary is copied to AVALON.

## Rights and attribution

**These are official *in-game* art assets, not images served or licensed by an official publisher website.** The community repositories extract and host game-client files; they are not official Manjuu/Yongshi/Yostar channels. All game art remains © its respective rights holders. A community asset repository's fan-use statement is **not** a formal copyright license from the game publisher.

AVALON is an independent, free, noncommercial fan reference site; it does not claim ownership of, endorsement from, or permission granted by the game publishers for republishing their art. AVALON does not bundle the image binaries and will remove an embed if the rights holder requests it. Embedding still displays copyrighted material and can be limited by publishers' policies; if public fan embedding is not allowed, turn off image embedding and link to official content instead.

### Privacy, failure modes and operational limits

- Loading an image makes a browser request to `raw.githubusercontent.com`, exposing normal network request metadata to its operator. There is no AVALON proxy.
- If third-party hosts change, rate-limit, or remove an image, the app hides the broken element and keeps a readable text fallback.
- The manifest is a dated inventory; newly released ships need a refreshed file list before images appear.
- No local player information is sent as an image parameter. Numeric asset IDs alone are included in requests.
- Images are **for identification**, not machine-verified skills, equipment compatibility, effectiveness, or tier grades.

## Future improvements

1. Audit additional legitimate game-image sources to improve coverage, especially newer ships and retrofits, without mismatching artwork.
2. Support full-size default skins and optional galleries, with explicit rights review and licensing/publisher guidance before bundling images.
3. Enhance the image provenance field with each asset's group ID, host, timestamp and verified skin variant.
4. Keep all character art distinct from any AI-created content; AVALON will not use synthetic "official-looking" imagery.

## Nationality and faction emblems (v0.6.1)

The Ship Index nation selector references game-client nationality insignia exposed by [Fernando2603/AzurLane nationality.json](https://github.com/Fernando2603/AzurLane/blob/main/nationality.json), served from its `images/nationality/` directory. These assets are original game imagery mirrored by an independent fan repository, not images hosted by the rights holders. Known nationalities use the published ID mapping; named collaborations use the dataset's generic collaboration icon; unverified factions use typographic placeholders instead of fabricated logos. Images load lazily and have text fallbacks when unavailable. Copyright and fan-use limitations described above apply equally to these assets.

## Ship artwork and missing-faction icons (v0.7.2)

- **Default ship art (first choice):** a validated Koumakan MediaWiki API imageinfo URL, but only if `prop=images` confirms that the referenced page uses the exact `File:<ship title>.png`. The API advertises `origin=*` CORS. No images are mirrored to AVALON, and the lookup is on demand.
- **Every skin / default fallback:** Fernando2603/AzurLane reconstructed PNG paintings, from a compact ID-only index covering 894 ships and 2,613 skins. Raw Lycoris WebPs are NOT used as art-viewer fallback because some are only background/effect layers.
- **New faction emblems:** Koumakan MediaWiki `imageinfo` confirmed `https://azurlane.netojuu.com/images/4/4c/Nl_1.png` (Kingdom of Tulipa) and `https://azurlane.netojuu.com/images/1/1b/Ldp_1.png` (Liga de Pedrería).
- Wiki page text declares a CC BY-NC-SA 4.0 site license; game artwork retains separate publisher rights and is not assumed to be covered by that license. Linking/embedding wiki images is not a license grant to bulk copy them. See `docs/KOUMAKAN_ACCESS.md` and `docs/SHIP_PROFILES.md`.
