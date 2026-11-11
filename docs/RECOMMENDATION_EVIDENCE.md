# AVALON equipment decision evidence — v0.8.6

## Problem established by user (2026-11-11)

The original six-slot planner often filled a potentially legal item and showed a generic explanation essentially meaning “this gear matches the slot and hull”. This was not a justified recommendation. A current item's rarity, HIT, RLD stat or Anti-Siren stat is not the same as weapon damage, fire cycle, survival benefit, fleet timing or best-in-slot.

Do **not** claim that a source-compatible pick is an AVALON recommended/optimal item. The field of available legal items is not a performance ranking.

## What this evidence pass actually provides

- **Selection audit**: for an automatic candidate, expose the real sort basis and a sourced numeric comparison with another compatible item when both values exist. Examples: HIT +12 vs +8 or reload stat +10 vs +6. Clearly state that this is not a damage/armor/skill calculation. Manual picks are explicitly user-selected.
- **Skill-conditioned exception**: Aquila's second aircraft slot changes the relevant skill behavior (Fighter healing/shielding vs Dive Bomber offensive preload/damage). Explain this in the detail drawer, with the original game skill source linked. The UI must not automatically imply that either role is correct for every context.
- **Specialist equipment comparisons**: six exact source equipment identities can display attributed conditional observations from Suchiguma. Source comparisons are scoped to a documented armor, role and use case; never described as our own simulated result.
- **Research-informed alternatives**: show source-matched items from the current slot's eligible candidate list, with the source link, when-appropriate conditions, and trade-offs. This does not override the user's gear, promote a catalog item to BIS, or copy another project's full tier list.
- **Negative evidence**: unknown/unreviewed items explicitly say an independent item-specific recommendation does not exist. Never generate a confident paragraph from a rarity sort.

### Why these sources, rather than copying ECTL?

- [Slaimuda / EN Community Tier List](https://slaimuda.github.io/ectl/) ceased updates on September 15, 2025. Its conditional equipment presentation is a useful historical UX reference, **not** current meta truth.
- [Suchiguma Quick Gear Guide](https://suchiguma.github.io/miniguides/quick-gear-guide/), updated July 2026, distinguishes general campaign from single-target bosses and notes enemy armor, enemy movement, skill dependencies, interception and timing. It explicitly says that some ships break general templates.
- [Suchiguma Research Focus](https://suchiguma.github.io/miniguides/research-focus/) contains named 2026 comparative gear evidence, including La-9 damage against medium/heavy armor and the Mecklenburg vs Champagne gun relationship. Our concise summaries and numeric attributions must never be mistaken for independent AVALON calculations.
- [REGAL](https://azur-lane-regal.suchiguma.com/) is a more current endgame resource with context-specific ship equipment notes. AVALON can link and cross-check independently but must not copy its assessments or imply license/endorsement.
- [Lycoris-AzurAPI](https://github.com/iujab/Lycoris-AzurAPI) remains the sourced ship skill description reference where recorded.

## Evaluations not yet performed

1. No full independent weapon damage model for light/medium/heavy armor. A damage model must incorporate weapon stats, coefficient, damage modifiers, firing cycle, accuracy, pattern, interception and ship slot efficiency, **not** add FP or HIT bonuses to a base weapon hit.
2. No effective HP model, healing opportunity cost or late-map threat schedule; no proof that a given survivability auxiliary wins over offensive equipment.
3. No fleet-level launch/timing solver, buff/debuff stacking, skill-trigger consistency, target movement pattern, limited gear inventory or opportunity cost.
4. No full current ship-specific exceptions/augments for all 894 indexed ships. A dated 2026 catalog source is not a complete up-to-the-minute research model.

## Validation contract for future 'Recommended' badge

Use a structured record with exact ship GroupID (or validated class-wide rule), regular equipment source ID, slot and source-backed hull legality; target content, enemy armor/movement, and ship skill triggers; machine-readable evidence references with check dates; alternative and the condition that makes it better; test outcome/measurement or published source-backed calculation and confidence. No reviewed badge if any required condition is missing. Differentiate expert-reported comparisons from reproducible AVALON calculation.

Suggested data shape:

```json
{
  "shipId": "60701",
  "slotIndex": 1,
  "mode": "boss",
  "role": "healer|offense",
  "targetArmor": "light|medium|heavy|unknown",
  "choice": { "equipmentSourceId": "...", "why": "sourced mechanical effect" },
  "conditions": ["second aircraft type activates the intended skill"],
  "alternatives": [{ "sourceId": "...", "whenBetter": "verified condition" }],
  "sources": [{ "url": "...", "dateChecked": "2026-11-11" }],
  "evidenceClass": "independent-mechanics|attributed-expert|compatibility-only"
}
```

### Explicit follow-on plan

Build testable source-ID-indexed weapon metrics from updated game data, not guessed values. Add user selection of target armor, enemy movement/skill condition and mission when those materially affect gear choice. Verify each mode's recommendation against at least one alternative and document uncertainty. Only then move first reviewed decisions from selection audit to an actual recommendation badge. Cover the whole game iteratively without presenting incomplete hardcoded lists as universal.
