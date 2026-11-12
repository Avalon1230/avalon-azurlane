## Final QA follow-up: derived numeric overflow — 2026-11-12

Verified implementation: `ca0971e3aa176c7db1515541310ed2e0f27f1421`, [passing CI 43237250720](https://github.com/Avalon1230/avalon-azurlane/actions/runs/43237250720). **238/238 Node tests, 63/63 responsive cases and 10/10 application sessions passed**, along with syntax, generated-data integrity and all pinned source checks. Roster audit: 894 ships, 936 equipment, 5,363 populated slots per mode. Targeted coverage: evaluator 100% lines / 90.21% branches; mechanics 100% / 95.73%. The following documentation-only commit records these results; PR #28 links final-head CI. Independent QA approval is still required.

The evaluator now checks every derived DPS value, encounter damage total and armor comparison before adding an equipment row or choosing a leader. A finite volley and cycle can still produce an infinite quotient or total. Such an option is excluded with a visible reason; an unknown armor result is never converted to zero.

The independent QA reproducer uses Z23’s 160% gun slot, light armor, FP 1e308, RLD 1e307 and 60 seconds. Type 98 and Mk12 volleys remain finite (about 8.448e307 and 1.2672e308), but derived DPS and totals overflow. The corrected result is unknown, with two exclusions and no leader. Additional regressions cover finite DPS with an overflowing total and overflow/unknown results for armor types other than the selected armor. These are extreme-input robustness tests, not new game-performance claims.

Local verification: 238 Node tests passed, including three new overflow regressions; syntax and generated-data checks passed. Current PR-head CI and delivery SHA are recorded in PR #28. No merge is authorized. The previous dated results below remain the record of earlier passes.

## QA correction pass — 2026-11-12

Correction implementation c3d83688b5bd422ff79059ccf2c01cd6e1580edc passed [CI 43165236994](https://github.com/Avalon1230/avalon-azurlane/actions/runs/43165236994): **235/235 Node tests, 63/63 responsive cases, 10/10 actual-application sessions**, 860 exact ship records, 11 equipment / 9 skill records, two formula/schema blob checks and two original-client file checks. Syntax and generated-data integrity passed. 16 augment images and two logos downloaded; five logos remained HTTP 429 throttled and are not certified. Targeted Node coverage: mechanics 100% lines / 94.87% branches; evaluator 100% / 89.13%; skills and scenario state 100% / 100%; view 100% / 50%. Coverage does not establish real-game correctness. The following documentation-only commit records these results; final PR-head CI is linked in PR #28. Earlier expanded browser runs exposed catalog-selector ambiguity and a direct-profile-URL manual-selection defect. Both are fixed: tests wait for loaded choices, and action models use the same source-ID resolution as the profile renderer. Actual Fighter-to-Dive-Bomber selection and subsequent storage preservation now pass at both widths.

Both independent QA findings were addressed on the existing PR #28 branch. No merge is authorized. Reviewed comments: [first review](https://github.com/Avalon1230/avalon-azurlane/pull/28#issuecomment-6811005627), [follow-up review](https://github.com/Avalon1230/avalon-azurlane/pull/28#issuecomment-6815526411).

- All 860 source ship records now retain slot parallel and capacity. Missing capacity remains null; battleship comparisons require a positive verified capacity. Live/source metadata disagreement fails closed. Gun volley includes projectile count × mounts × parallel.
- Only gun families 1/2/3/4/11 receive gun component calculations. Torpedoes, submarine torpedoes, AA, auxiliaries and unknown families return unknown rather than fabricated gun DPS or timing. Aircraft retain their separate whole-wing loading path.
- Specific exclusion reasons survive zero/one comparable option and are expandable in the drawer. Null/malformed windows, wing entries, stat lists, identities, conflicting records, sparse armor arrays and numeric overflow fail closed.
- Aquila skill conditions are derived from the actual evaluated wing, including reference-wing substitutions. Current/reference comparisons cannot rewrite saved equipment. Nondefault aircraft parallel values remain unsupported.
- Scenario assumptions are session-only and reset when a different ship/slot/mode comparison opens. Reopening the same comparison retains its settings. Empty numeric input is unknown, not zero.
- Browser coverage uses the real application event handlers with isolated catalog fixtures: 390/1280px, fighter and dive-bomber saved configurations, full-wing numerical checks, reference wings, missing/unsupported planes, disclosures, Escape, ship/slot/mode changes and saved-storage equality across evaluation and reload. This is UI regression evidence, not independent battle validation.

### Source and mathematical validation

Checked 2026-11-12 against the unchanged MIT-attributed May 2026 snapshot, commit `3deb898433a03ed3d7d7ff877f0d1a9b505dfd44`. New exact identity checks: ships.json blob `ca5045a54c671ec7b8c06ce1890329d0d9fbc114`; types/ships.d.ts `6361937beb2d6455b8c2db9e0e07506bdd400498`; docs/equips/fomulas.md `9d371fbd0378543201a3bc50f1d94cafadc9e502`. Existing equipment/skill blobs and original EN client 9.3.390 reload constants are rechecked online. No additional third-party code is redistributed. Original-client verification establishes the reload divisor; the capacity-dependent absolute cooldowns are explicitly the pinned author's theorized averages, not independently certified client frame timings.

| Reference case | Expected | Actual |
| --- | --- | --- |
| Gascogne 99901, Mk6 14340 +10, light armor, FP before gun 0, efficiency 1.8, mounts 1, parallel 2 | 156 × 1.05 × 1.8 × 1.25 × 3 × 1 × 2 × 1.4 = 3095.82 ideal damage | 3095.82 |
| Same gun, final RLD 100, capacity 2, delay 0 | 3611 / (6 × sqrt(200 × 3.14)) + 0.033 = 24.0487644984s | 24.0487644984s |
| Ordinary capacity 1 BB absolute cooldown | 0.2s estimate | 0.2s |
| Aquila Hellcat/Hellcat/Barracuda, mounts 2/2/4, +10, RLD 100 | weighted raw reload × 2.2 / (6 × sqrt(200 × 3.14)) + 0.033 = 23.3630748502s | 23.3630748502s |
| Aquila Hellcat/Helldiver/Barracuda, same conditions, level-10 offensive loading condition | weighted raw reload × 2.2 × 0.9 / (6 × sqrt(200 × 3.14)) + 0.033 = 21.5140072997s | 21.5140072997s |

Floating-point assertions use 1e-9 tolerance. The pre-existing independent BWIKI Mk6 and Type98 damage/rounded-reload references still pass. Gascogne's full skill effects, effective healing, aircraft DPS, actual arrival times and complete-build recommendations remain unsupported. Missing mechanics never receive BIS claims.

# Combat mechanics foundation — v0.8.7

Status: implemented component calculator, **not a complete combat simulator or best-in-slot engine**. No saved equipment is changed by comparisons. Existing compatibility selection and six-position loadouts remain intact.

## Architecture and scope

`data/combat-source.json` retains 11 exact source equipment records and reviewed skill source records. `scripts/build-combat-data.mjs` generates the browser ES module and checks its SHA-256. `combat-mechanics.js` contains pure formulas, `combat-skills.js` typed conditions, `combat-evaluate.js` exact-ID/name/type joins and eligibility gates, and `combat-view.js` the concise drawer UI. These APIs consume ordinary records and the existing ship-slot manifest; the representative ships are tests, not separate calculators.

The calculator compares +10 gun damage per volley and per second, estimated firing cycles, and how many shots fit into an encounter. Choose the final Reload stat (RLD), Firepower (FP) before adding the gun, enemy armor and encounter length. The gun’s FP bonus comes from its selected enhancement level. We do not combine the results into an invented combat score. General uses explicitly equal light/medium/heavy weights. Boss requires a chosen armor; mobbing reports firing opportunities but does not claim wave coverage; OpSi retains adaptation/survival warnings. We cannot reliably compare moving-target accuracy yet, so that option stops the damage comparison. Missing or conflicting data also stays unranked.

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
- Gun cycle = reload + source volley delay + explicitly chosen approximate absolute cooldown (0.3s DD/CL/CA/CB, 0.2s capacity-one BB, 0.033s capacity-greater-than-one BB). These are published approximations, not frame-perfect animations.
- Ideal volley = base damage × coefficient × slot efficiency × (1 + final stat × ratio / 100) × projectile count × mounts × parallel × weighted armor modifier. Excludes the random +0/1/2 term, rounding, crit, burn, hit probability, shields, all skills and mount staggering.
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

## Original implementation validation (superseded by QA correction results above)

Implementation commit 9474cb21ec4c575efb767404bb4203939ee44b1f, [PR #28](https://github.com/Avalon1230/avalon-azurlane/pull/28), [passing CI](https://github.com/Avalon1230/avalon-azurlane/actions/runs/43125170536). 227/227 Node tests, 63/63 viewport cases, 2/2 application-handler sessions, 11 equipment / 9 skill exact source matches, two client source-file identity checks and 16/16 augment images. Two logos passed; five remain host-throttled (HTTP 429). See [machine-readable validation](COMBAT_VALIDATION_2026-11-12.json). Targeted Node coverage: mechanics 100% lines / 94.20% branches; evaluator 100% / 91.92%; skills 100% / 90.91%; view 100% / 56%. These percentages do not certify game accuracy. Main remains unchanged; independent QA approval is required before merge.
