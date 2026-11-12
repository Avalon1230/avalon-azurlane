# Combat mechanics foundation — v0.8.7

Status: implemented component calculator, **not a complete combat simulator or best-in-slot engine**. No saved equipment is changed by comparisons. Existing compatibility selection and six-position loadouts remain intact.

## Architecture and scope

`data/combat-source.json` retains 11 exact source equipment records and reviewed skill source records. `scripts/build-combat-data.mjs` generates the browser ES module and checks its SHA-256. `combat-mechanics.js` contains pure formulas, `combat-skills.js` typed conditions, `combat-evaluate.js` exact-ID/name/type joins and eligibility gates, and `combat-view.js` the concise drawer UI. These APIs consume ordinary records and the existing ship-slot manifest; the representative ships are tests, not separate calculators.

The shipped pathway compares +10 direct gun damage per ideal volley and second, estimated cycles and finite-duration firing opportunities. Inputs declare final RLD, FP before the compared gun, armor weights and duration. Gun FP bonuses are added from the same enhancement record. There is no arbitrary combat score. General uses explicitly equal light/medium/heavy weights. Boss requires a chosen armor; mobbing reports firing opportunities but does not claim wave coverage; OpSi retains adaptation/survival warnings. Moving-target accuracy is unknown and suppresses damage comparison. Unsupported or conflicting records do not receive a numerical ranking.

Aircraft comparisons require the full wing. They calculate weighted loading time, expose actual armaments/interception capability, and apply Aquila's reviewed slot-two loading condition. The optional **Reference wing** uses Hellcat/Hellcat/Barracuda, replacing only the compared slot in the calculation. It is labeled separately from the user's actual wing and never saves these items. No aircraft DPS, interception damage or effective healing is invented.

The event primitive accepts explicit arrival delays and half-open vulnerability windows. It is preparation for fleet timing, not implemented synchronization or buff stacking. Hood's proc/buff duration, cruiser/destroyer barrage counts and Aquila's conditions are typed evidence. Barrage damage, active buff effects and stochastic proc timelines are not applied to gun damage.

## Exact provenance and rights

Checked **2026-11-12**. Dataset: [Linuxxy0's preserved MrLar AzurLaneData](https://github.com/Linuxxy0/AzurLaneData-2026-5-2-16-08-11/tree/3deb898433a03ed3d7d7ff877f0d1a9b505dfd44), commit `3deb898433a03ed3d7d7ff877f0d1a9b505dfd44`, snapshot **2026-05-02**, EN/JP/CN coverage as declared per record; not a verified current client version.

| Source | Identity / role |
| --- | --- |
| `data/equipments.json` | Git blob `fd6f4af3daf20b3ee4b400b623ed34cb4cf2973e`; exact weapon, projectile, payload and enhancement fields |
| `data/skills.json` | Git blob `dfa8b1d8fade82aee8b43660a8edaafefe301465`; skill IDs and conditions |
| `data/ships.json` | Existing audited May snapshot, SHA-256 `3787c9de6976f8d32ce9e797a96ee9d90911e51c15cac4e529d5a133c0fb3380`; base-form MLB slots |
| `types/equipments.d.ts`, `docs/equips/fomulas.md` | Same pinned commit; raw reload conversion, damage, volley delay and air-wing equations |
| Fernando identities | Existing November 11 audit, SHA-256 `29e52e99bbe1732f410230c71904c1ed88f24c22c86d4ff878bb901d8ec03ad4`; all 11 item IDs/names/types cross-checked |
| [BWIKI formulas](https://wiki.biligame.com/blhx/index.php?title=公式合集&oldid=395828) | Revision 395828, independent reload scaling and weighted aircraft cooldown corroboration |
| [BWIKI BB table](https://wiki.biligame.com/blhx/index.php?title=战列炮&oldid=281587) | Revision 281587; Mk6 +10 damage/count/coefficient/armor reference; reload conflict below |
| [BWIKI Type 98 T3](https://wiki.biligame.com/blhx/index.php?title=双联100mm98式高射炮T3&oldid=315274) | Revision 315274; 12×4, 110%, 100/50/20 armor, 0.96s rounded base reload |

The source README explicitly permits data reuse under MIT and additionally requires credit to Manjuu, Yongshi and Yostar. The full MIT notice is retained in `THIRD_PARTY_NOTICES.md`. Only factual BWIKI reference values and links are recorded, not copied guide text or rankings. No permission to redistribute its prose or media is assumed. Koumakan Combat and Damage Calculations returned HTTP 403 during this pass; they are **not** represented as newly verified. An attempted upstream MrLar GitHub lookup returned 404. The accessible pinned extract is reproducible, but freshness beyond May is unresolved. Its parser is closed source: exact record reproduction does not independently validate every field against the game client.

### Independent client corroboration

[AzurLaneTools/AzurLaneLuaScripts](https://github.com/AzurLaneTools/AzurLaneLuaScripts/tree/3fb6befa2f969bd879de2341cdf41a571852a95f), commit **3fb6befa2f969bd879de2341cdf41a571852a95f** (2026-11-11), reports **EN 9.3.390** in versions/EN.txt (blob ec1da6e7c5c7299ee9f9904f968d9384d4ee657b). EN/mod/battle/data/battleconfig.lua blob **ccabc5632554a70d3bf1bc71a416c352e6fd14cb** establishes reload constants K1=6, K2=100, K3=3.14. battleformulas.lua blob **482c1407fa3a73584b94aaf9edbcf9faea4418b0** confirms how those constants are used. Online CI checks both exact blob identities and formula/constant facts. No client source file is redistributed: reuse permission for its code was not established; only mathematical facts and short verification strings are used. This verifies the reload formula independently, not every May equipment record's current stats.

## Formula boundaries

- Reload seconds = raw reload / (6 × sqrt((final RLD + 100) × 3.14)); `reload_seconds` bypasses conversion.
- Gun cycle = reload + source volley delay + explicitly chosen approximate absolute cooldown (0.3s vanguard, 0.2s ordinary one-capacity BB in examples). These are published approximations, not frame-perfect animations.
- Ideal volley = base damage × coefficient × slot efficiency × (1 + final stat × ratio / 100) × projectile count × mounts × weighted armor modifier. Excludes the random +0/1/2 term, rounding, crit, burn, hit probability, shields, all skills and mount staggering.
- Air-wing load = weighted aircraft reload × 2.2 × loading multiplier + 0.033s. Interception uses intercept reload and omits 2.2. Aquila's dive-bomber loading multiplier is 0.9; the absolute cooldown is not reduced. This is loading time, not projectile arrival time.

## Representative comparisons

All examples use base-form MLB, +10 equipment, level-10 reviewed conditions, RLD 100, FP 100 before the candidate gun, ideal direct hits, and 60 seconds. These are declared test scenarios, not actual player stats.

| Ship | Options | Supported conclusion |
| --- | --- | --- |
| Hood 20403 | Twin 381mm Advanced 24340 / Prototype Triple 406mm/50 91000 | 381 cycles earlier; AP 406 has higher ideal heavy-armor direct DPS. Hood's 70% salvo proc and 8s RLD buff are recorded but excluded from totals. |
| Nelson 20503 | Twin 381mm Advanced 24340 / Prototype Triple 406mm/50 91000 | Faster 381 creates more opportunities for the 40% Big Seven salvo proc; AP 406 leads heavy-armor direct damage. No guaranteed barrage or retrofit behavior is inferred. |
| Prinz Eugen 40303 | Twin 203mm Naval 33040 / SK C/34 43040 | HE leads light-armor direct DPS; AP leads medium. Six main-gun activations trigger the recorded barrage, whose damage is excluded. |
| Z23 40123 | Twin Type 98 31040 / Twin Mk12 11240 | Type 98 gives more firing/barrage opportunities; Mk12 leads heavy-armor direct DPS. FP proc and barrage damage remain unknown to the evaluator. |
| Aquila 60701 | Slot 2 Hellcat 17340 / Seafang 27140 / Helldiver 19140; fixed Hellcat slot 1 and Barracuda 28140 slot 3 | Fighters preserve 8% healing and 6% shielding for the lowest-HP-percentage ship in each surface fleet section, shield up to 5s; Helldiver enables preload, 10% shorter loading and 8% damage bonus. Effective heal, offensive total and aircraft accuracy are not scored. |

No **Best Overall**, **Best Boss** or universal BIS badge is awarded. Attributed expert notes remain a separate disclosure and compatibility-only options remain available.

## Contradictions and known gaps

- Resolved during development: using Math.PI yielded Mk6 reload 24.009676s versus BWIKI 24.02s. Direct inspection of the EN client constants establishes K3=3.14. The corrected result rounds to 24.02s and Mk6 can be compared. This is a verified formula correction, not a widened test tolerance.
- Type 98 shell range is 45–55 in the extract versus 40–60 on BWIKI. Range-based targeting is not evaluated; no winner is inferred from that field.
- Current gear, enhanced augments, retrofit states, full skill inventory, burn/armor-break, live buff stacking, movement/hit probability, air losses, wave layouts, real arrival timing, OpSi adaptation, gear inventory and four-fleet optimization remain incomplete.
- Many catalog options fall outside the 11-record reviewed slice. The UI reports the compared/compatible counts. Unknown ships may still receive supported gun component calculations, but no invented skill evaluation.

## Reproduction and QA

`node scripts/build-combat-data.mjs --check`; `node --test`; package syntax checks; `node scripts/verify-combat-source.mjs` (network required). Online CI checks pinned Git blob hashes and exact retained equipment/skill records. `node scripts/audit_loadouts.mjs .audit` rechecks the existing full downloaded roster. Chromium runs existing responsive fixtures plus gun/aircraft comparison drawers at seven widths, and actual app handlers at 390/1280px using isolated catalog fixtures.

Independent QA should challenge formula conventions and absolute cooldowns; confirm Aquila skill conditions against a current client; verify the resolved reload constant and unresolved range discrepancy; inspect armor-driven HE/AP reversals and missing-data gates; verify saved gear survives changes, Escape and reload; and distinguish a numerical component calculation from a verified complete-build recommendation. Synthetic UI fixtures and hand calculations are not real-game battle validation.

Next: v0.8.8 expands current source coverage, validates skill/accuracy/burn and target behavior, and supports trustworthy short loadout recommendations. v0.9 consumes validated timed events and inventory constraints for fleet-equipment synergy, including four OpSi fleets. Neither milestone is claimed complete here.

## Verified delivery results

Implementation commit 9474cb21ec4c575efb767404bb4203939ee44b1f, [PR #28](https://github.com/Avalon1230/avalon-azurlane/pull/28), [passing CI](https://github.com/Avalon1230/avalon-azurlane/actions/runs/43125170536). 227/227 Node tests, 63/63 viewport cases, 2/2 application-handler sessions, 11 equipment / 9 skill exact source matches, two client source-file identity checks and 16/16 augment images. Two logos passed; five remain host-throttled (HTTP 429). See [machine-readable validation](COMBAT_VALIDATION_2026-11-12.json). Targeted Node coverage: mechanics 100% lines / 94.20% branches; evaluator 100% / 91.92%; skills 100% / 90.91%; view 100% / 56%. These percentages do not certify game accuracy. Main remains unchanged; independent QA approval is required before merge.
