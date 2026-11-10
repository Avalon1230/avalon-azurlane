# AVALON Suggested Fleet Builder — v0.5.0

**Implemented:** first constraint-aware, source-linked, qualitative formation generator in Fleet Lab. **Not implemented:** fully validated skill-effect interactions, numerical combat model, equipment slot assignment, damage/heal timing simulation, gear ownership or verified optimal fleets. Nothing generated here is a tested clear guarantee.

## How to use

1. Open **Fleet Lab**, choose a game mode, and select a supported scenario in **Suggest a Fleet**.
2. For a theoretical *reviewed-candidate* pool, leave **Use only my checked ships** off. For a personal roster, open ship availability, check exactly those reviewed candidates you own, and enable **Use only my checked ships**. Ownership selections live only in browser localStorage and are not linked to an account.
3. Any existing assignments are **locked** by default. Clear individual slots or the current mode's plan manually before generating if you want them reconsidered.
4. Press **Generate suggestion**. Review newly assigned candidates, previously assigned ships, unfilled positions, source links, and explicit weaknesses. Generation is a preview; it changes no saved fleet slots.
5. Press **Apply additions** to fill vacant slots. This revalidates hull class and duplicate constraints using the normal Fleet Lab assignment logic, and rejects a stale preview if the underlying plan changed.
6. **Manually equip and validate** these formations in-game. The gear advisory list is an investigation checklist, **not** an equipment-slot optimization.

## Candidate data, confidence and limitations

AVALON ships are drawn from a small, human-reviewed, **39-ship capability index**, informed by linked Chapter 15/16, REGAL, Research Focus and OpSi sources. It is intentionally smaller than the much larger remote ship identity catalog. A ship having an ID, hull, rarity or tier-grade entry in the remote list **does not establish validated skill interactions**, so AVALON does not silently invent a role for all ~894 ships. The 17 additional curated fallback ship identities and manually written role tags support useful initial fleet examples even when GitHub raw-source loading fails.

Role annotations reflect qualitative, provisional research judgments. They are **not parsed Koumakan skill data**, are not automatically updated with game patches, and are not evidence of measured comparative damage. Linked references help the user verify assumptions. Special conditional abilities (e.g. Aquila's configured healing, time-limited debuffs, faction-specific boosts) are explicitly called out as unresolved where relevant.

The builder uses a deterministic **global maximum-weight assignment** among vacant slots and distinct reviewed candidates. Internal numbers are matching priorities for role coverage and slot appropriateness; they are **not combat-performance scores**. Dummy empty slots represent insufficient candidates, and misleading or unknown hull assignments are rejected. The engine matches all OpSi fleets jointly to avoid using the same ship twice. It does not model a ship's skill cooldown, exact gear triggering, source-revision mechanics, equipment copies, equipment compatibility, fleet-tech bonuses, tactical modifiers, or OP Siren adaptation. It can suggest valid-but-suboptimal fleets or leave roles uncovered, both of which are warned explicitly.

The initial selector recognizes Chapter 15, Chapter 16, broad OpSi sectors/bosses and generic modes. Fully accurate boss, stage, or event-specific recommendations depend on a later **machine-readable validated skill/equipment/enemy dataset** and combat outcome comparison.

## Future work

- Parse and validate Koumakan skill/equipment metadata, with source revision IDs and license review.
- Model skill activation probabilities, conditions and durations as typed effects; distinguish hard constraints from inferred roles.
- Add real equipment inventory counts and a joint weapon/aircraft/auxiliary compatibility solver.
- Simulate salvos, airstrikes, skill windows, heals and debuff overlap; compare alternative setups under declared combat assumptions.
- Validate with battle recordings/logs and actual late-chapter, META, and OpSi clears before presenting quantitative DPS/clear-rate predictions or 'best possible' claims.

See [the full optimization architecture](FLEET_OPTIMIZER_SPEC.md) and [source provenance policy](SOURCES.md).