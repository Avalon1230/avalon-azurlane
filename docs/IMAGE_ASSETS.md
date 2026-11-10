# Original Azur Lane artwork and equipment icons

**AVALON v0.5.1 · November 10, 2026**

## What is displayed

AVALON displays **original game-client assets**, not AI-generated illustrations or artist imitations.

| Item | Community-hosted source | Match method | Audit coverage |
| --- | --- | --- | --- |
| Ship thumbnail / shipyard portrait | [iujab/azurlane-images](https://github.com/iujab/azurlane-images/tree/main/thumbnails) | exact ship group ID from [Lycoris-AzurAPI](https://github.com/iujab/Lycoris-AzurAPI/blob/main/data/ship-list.json), or vetted initial name–ID mapping | **746 / 894 indexed ships** |
| Equipment icon | [Fernando2603/AzurLane equipment assets](https://github.com/Fernando2603/AzurLane/tree/main/images/equipment) | numeric item ID from [equipment.json](https://github.com/Fernando2603/AzurLane/blob/main/equipment.json); cross-checked against [equipment_icon.json](https://github.com/Fernando2603/AzurLane/blob/main/equipment_icon.json) | **936 / 936 equipment records** |

The image endpoints are fixed, trusted `raw.githubusercontent.com` repository paths. Ship asset availability comes from a checked-in manifest of thumbnail filenames; no fuzzy "best guess" image matching is performed. Equipment icons use the upstream equipment numeric ID. For some retrofit entries, the base ship portrait is displayed rather than a distinct retrofit illustration. **No ship portrait is intentionally substituted with another ship's artwork.**

The images are requested directly by the visitor's browser from the upstream community hosts, not downloaded, altered, or bundled in AVALON's repository. Each image is lazily loaded. Missing or blocked art falls back to the ship's hull or a gear glyph, with the item's name preserved.

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
