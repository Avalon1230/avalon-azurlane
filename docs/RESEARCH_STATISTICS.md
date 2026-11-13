## v0.8.9 comparisons

The calculation and data below are unchanged. The combined panel now compares completed stages at the same ship level and 100 affinity, including exact signed stat differences, mount/preload changes, efficiency percentage points and skill replacements. See [Ship profile UX](SHIP_PROFILE_UX.md) for baseline choices and unavailable-state behavior.

# Research statistics: calculation and QA references

The profile calculates all 47 research ships from completed Dev 0–30 and, where available, Fate 0–5 stages. Ship-level tabs select 1, 100, 120 or 125. Minimum level requirements come from each selected stage; impossible combinations show a reason instead of another configuration's stats.

## Scope

The displayed setup uses **100 affinity**, no equipment, Fleet Technology, Meowfficers or active battle buffs, and zero blueprint progress toward the next stage. Trainable skill descriptions use level 10; fixed-level skills use their source maximum. Changing progression does not change saved gear or the six-slot reference loadout. The combat evaluator still rejects non-reference Dev/Fate selections; this feature does not add progression-aware damage calculations.

`research-progression-data.js` contains 188 ship forms, 1,410 development stages, 170 Fate stages and 194 relevant skill records. `research-progression.js` calculates values; `research-stats-view.js` renders statistics, weapon slots and skills. All values come from the same client revision, rather than combining old reference stats with new Fate effects.

## Source identity

Pinned repository: [AzurLaneTools/AzurLaneLuaScripts](https://github.com/AzurLaneTools/AzurLaneLuaScripts/tree/3fb6befa2f969bd879de2341cdf41a571852a95f), commit `3fb6befa2f969bd879de2341cdf41a571852a95f` (EN 9.3.390), checked 2026-11-13. Exact Git blob and SHA-256 hashes for all ten inputs are embedded in `RESEARCH_PROGRESSION_DATA.sources`.

| Client path | Purpose |
| --- | --- |
| `EN/sharecfgdata/ship_data_statistics.lua` | Base attributes, level growth, efficiencies, mount/preload/parallel defaults |
| `EN/sharecfgdata/ship_data_template.lua` | Form identity, unlocked skills and weapon compatibility |
| `EN/sharecfg/ship_data_blueprint.lua` | Per-ship stage IDs and enhancement divisors |
| `EN/sharecfg/ship_strengthen_blueprint.lua` | Every stage's stat, form, mount, efficiency and skill effects |
| `EN/sharecfg/skill_data_template.lua` | Functional skill descriptions and level-dependent parameters |
| `EN/model/vo/ship.lua` | Growth, blueprint rounding and affinity order |
| `EN/model/vo/shipblueprint.lua` | Stage accumulation and replacements |
| `EN/model/const/shipmodattr.lua` | Blueprint attribute ordering |
| `EN/sharecfg/intimacy_template.lua` | 100-affinity bonus: 600/10000 |
| `EN/sharecfg/gameset.lua` | Extra growth starts above level 100 |

The extraction repository has no root license. Selected numeric facts and functional skill descriptions are attributed game data, not openly licensed client code. No full client scripts or flavor text are distributed. The older MIT milestone descriptions remain separately attributed; they are not calculation inputs. Artwork rights remain with their owners.

## Formula and ordering

For attribute `i`, level `L`, and selected form:

```
growth = base[i] + (L - 1) * growth[i] / 1000
         + max(0, L - 100) * extraGrowth[i] / 1000
blueprint = sum(completed stage effect[i]) / perShipAttrExp[i]
            + sum(completed special-stage attribute effects[i])
portStat = floor((growth + floor(blueprint)) * affinity)
```

The five blueprint enhancement attributes are FP, TRP, AA, AVI and RLD. Special-stage effects can affect other attributes. Affinity is 1.06 for HP, FP, TRP, AA, AVI, RLD, ACC, EVA and ASW. Luck receives no affinity bonus; speed receives neither affinity nor final integer rounding. The client numeric `armor` attribute is not an armor classification and is not displayed as one.

The intermediate floor follows `Ship.getShipProperties`, which adds `calcFloor(blueprintAddition)` before `intimacyAdditions`. Some community summaries retain that fraction until the final floor; the original client takes precedence. Integer-scaled arithmetic avoids binary floating-point errors at integer boundaries. Decompiled client functions contain unresolved local names in places; AVALON interprets the matching configuration constants and does **not** claim to execute the original client.

Breakout stages select the matching form. Stage mount and preload arrays replace previous arrays; efficiency additions accumulate on that form's base efficiencies. Skills start with its unlocked `buff_list`, not `buff_list_display` (which can preview locked skills). Fate replacements occur at their own stage, not always Fate 5. Unrecognized or contradictory effects return an explicit unknown result.

## Reproducible reference cases

All cases use 100 affinity and no external bonuses. These are source-based arithmetic checks, not live-game battle measurements.

| Ship/setup | Expected and tested result |
| --- | --- |
| Neptune, Lv120 Dev0 / 5 / 10 / 20 / 30 | HP 3372 / 3583 / 3583 / 4005 / 4637; FP 122 / 124 / 129 / 146 / 172 |
| Neptune, Lv100 Dev2 | FP `floor((32 + 99*0.700 + floor(94/100))*1.06) = 107`; omitting the intermediate floor incorrectly gives 108 |
| Neptune, Lv125 Dev5 | HP 3689 |
| Neptune, Dev4 → Dev5 | Torpedo mounts 1 → 2; preload 0 → 1 |
| Neptune, Dev14 → Dev15 → Dev30 | Main-gun efficiency 125% → 130% → 150% |
| Neptune, Dev30 Fate5 | Luck 15; AP damage skill parameter 40%, up from 35% |
| Drake, Lv120 Dev30 Fate0 → 5 | Luck 0 / 3 / 7 / 12 / 18 / 25; HP 5668 and FP 289 unchanged |
| Drake, Fate3 / Fate5 | Skill 19300 → 18300 at Fate3; skill 19290 → 18290 at Fate5 |

`tests/research-progression.test.js` checks these cases, all 1,457 Dev configurations at level 125, all 170 Fate configurations, missing/contradictory/overflow data, skill parameters and immutable inputs. Application tests exercise Neptune's stats and level tabs, Drake's Fate skills, saved state and combat rejection on four viewport widths.

`node scripts/verify-research-progression.mjs` downloads all ten pinned sources, verifies both hashes, rebuilds the selected records and compares them exactly. It also checks the relevant original formula statements. This runs in GitHub Actions alongside the existing mission and combat source checks. The local build helper uses ignored source caches; the network verifier independently reproduces its output without those caches.

## Still outside this feature

Partial blueprint progress, blueprint totals/costs, other affinity values, partial per-objective XP/count tracking, account synchronization and progression-aware combat simulation are not implemented. Mission completion and research start dates remain manual. A passed time gate never completes a mission automatically. Authentic isolated PR/DR frame assets with verified provenance are not available in the project's checked asset catalog; the original AVALON SVG ornaments remain the documented fallback, with official portraits preserved.
