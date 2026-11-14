# Ship profile UX — v0.8.9

Research ships now have one **Research & Statistics** panel. Development, Fate Simulation, ship level and comparisons share the same view; Equipment slots and Skills remain available below it. Acquisition retains its separate Research & Development mission dialog.

## Progression and comparison

- New selections default to Dev 30 / Fate 0, compared with Dev 0 / Fate 0. Saved stages take precedence.
- Default Development choices are 0/5/10/15/20/25/30. Detailed levels exposes every integer stage. Switching detail off or reloading never discards a saved intermediate stage: that stage remains in the compact list.
- Comparison choices: Dev 0; previous Dev checkpoint (or Dev 30 / Fate 0 for Fate); previous completed Dev or Fate stage; Dev 30 / Fate 0.
- Both sides use the same selected ship level and 100 affinity. Signed deltas use the existing calculation results after client rounding, never interpolation. Efficiency differences are **percentage points**. Mounts, preloads and added/replaced skills have a compact disclosure.
- A level/stage combination the existing calculator cannot support remains unavailable. A missing comparison does not become zero. Fate requires Dev 30 and the existing five-stage source record.
- Detailed/comparison display preferences are session-only and keyed by ship. Existing `avalon.research.v1` state and mission IDs are unchanged. Progression selection, mission completion and start timestamps remain persisted. Gear storage is unchanged.

## Portrait identity

PR/DR identity still comes from the exact research manifest. META identity comes from the existing `SHIP_NATION_BY_SOURCE_ID` nationality map; no name matching, ID-prefix inference or rarity guessing. Existing mapped META ships receive the treatment; unknown new IDs wait for metadata updates.

Portrait containers reserve at least 7px around artwork, with additional headroom for silhouettes. A CSS mask excludes the complete artwork rectangle from decoration. PR has a raised crown and stepped feet; DR has beveled corners and notched side rails, visibly distinct even in grayscale. META Elite uses a violet chamfered frame/background, while Super Rare uses heavier copper/gold rails, raised end caps and an ember background. META rarity comes from the exact-ID pinned extract in `portrait-rarity.js`, validated by `scripts/verify-portrait-source.mjs`; unknown rarity stays neutral. These are original AVALON treatments, not claimed official game frames. Original image URLs, artwork gallery and rarity labels remain intact.

## Desktop detail layout and copy

Equipment and Skills follow the summary columns and use the full available width. Their lists use two columns on desktop and one on mobile, while the compact six-slot planner is unchanged.

Missing Fate data means “We don’t have Fate Simulation details for this ship yet.” A known Dev requirement is described separately. “Not yet released” is reserved for current, independently verified release evidence; no such release assertion is introduced by this patch.

## Verification and boundaries

Unit tests cover exact same-level deltas, checkpoints/intermediates, impossible baselines, Fate skill changes, shared-panel structure, identity and storage immutability. Browser tests exercise controls and focus, intermediate reloads, modal scroll/focus and mission persistence, combat guards, saved gear, six slots and profile frame clearance at 360/390/768/1280px. Existing responsive and combat tests remain required.

Live CI captures PR, DR, Super Rare META, Elite META and ordinary Enterprise profiles, portrait crops and roster tiles at 390/1280px, requiring each original portrait to load. Local fixture runs may use `SKIP_LIVE_ART=1` when outbound network is blocked; that does not certify real artwork. CI runs the live checks without that flag.

The combat model remains Dev 30 / Fate 0. No research-aware damage calculation, new source data, inventory optimizer or battle simulator is introduced. The source and simulation contract in PR #31 is unchanged.
