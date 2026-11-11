/**
 * AVALON editorial recommendations, v0.4 initial review set.
 * These are reasoned, provisional judgements sourced from expert guides and
 * gameplay descriptions, NOT simulated or measured DPS/eHP results.
 */
export const EVIDENCE_SOURCES = Object.freeze({
  research: { title: 'Suchiguma · Research Focus', url: 'https://suchiguma.github.io/miniguides/research-focus/', type: 'Specialist progression and equipment guide' },
  chapter15: { title: 'Suchiguma · Chapter 15', url: 'https://suchiguma.github.io/guides/chapter-15/', type: 'Late campaign strategy guide' },
  chapter16: { title: 'Suchiguma · Chapter 16 Fleets', url: 'https://suchiguma.github.io/guides/chapter-16-fleets/', type: 'Late campaign strategy guide' },
  regal: { title: 'REGAL · Endgame ship evaluations', url: 'https://azur-lane-regal.suchiguma.com/', type: 'Third-party multi-mode relative ratings' },
  skillData: { title: 'Lycoris-AzurAPI · imported skill descriptions', url: 'https://github.com/iujab/Lycoris-AzurAPI', type: 'Game-data skill text; verified against the ship profile' },
  healer: { title: 'AAYYY · Mob Fleet Healers', url: 'https://www.aayyy.com/azur-lane/healer-guide-best-support-ships-mob-fleets/', type: 'Secondary explanatory guide' },
  opsi: { title: 'OpSi fleet planning · player write-up', url: 'https://note.com/enrico_pucci/n/ncf3c85aa24dc?hl=en-US', type: 'Player experience, not a controlled benchmark' },
  bluestacks: { title: 'BlueStacks · Equipment Guide', url: 'https://www.bluestacks.com/blog/game-guides/azur-lane/al-equipment-guide-en.html', type: 'General equipment guidance' },
  officialPR8: { title: 'Yostar · Series 8 Release', url: 'https://azurlane.yo-star.com/news/2025/07/09/maintenance-notice-7-10-12-a-m-utc-7/', type: 'Official equipment existence and research series' }
});

// Grades are only comparable *inside the same mode and intended role*.
// EX: defining pick; S: strongly recommended; A: strong fit with trade-offs;
// B: workable alternative; no grade when insufficient evidence.
// Confidence is editorial evidence confidence, NOT statistical probability.
const stamp = '2026-11-10';
const pick = (key, board, name, mode, role, grade, confidence, rationale, caveat, sources, alternatives=[], metadata={}) => ({
  key, board, name, mode, role, grade, confidence,
  rationale, caveat, sources, alternatives, ...metadata, reviewedAt: stamp,
  assessmentType:'AVALON provisional synthesis'
});
export const AVALON_ASSESSMENTS = Object.freeze([
  pick('unicorn-campaign','ships','Unicorn (Retrofit)','campaign','Mob sustain','EX','high',
    'Reliable recurring vanguard healing plus opening airstrike make her a foundational choice for repeated mob battles.',
    'A dedicated healer sacrifices a damage slot. Late campaign clears can demand a second healer and stronger anti-air.', ['chapter15','healer'],['Aquila','Volga']),
  pick('cowpens-campaign','ships','Cowpens','campaign','Chapter 16 secondary healer','EX','moderate',
    'The Chapter 16 fleet guide emphasizes rapid airstrike cycles that heal and clear screens, making her especially valuable there.',
    'This strong recommendation is Chapter 16-specific; do not assume the same ranking for every other mode.', ['chapter16'],['Volga','Aquila']),
  pick('shimanto-campaign','ships','Shimanto','campaign','Late-chapter anti-air and vanguard','EX','high',
    'Combines valuable anti-air contribution with a useful frontline role in aircraft-heavy late campaign encounters.',
    'Her late-campaign value is not equivalent to top single-target boss damage; develop her before assuming full performance.', ['research','chapter16'],['Guam','Gouden Leeuw']),
  pick('guam-campaign','ships','Guam','campaign','Late-chapter AA tank','S','high',
    'Durable front position and substantial anti-air utility address two recurring difficulties in late campaign maps.',
    'Anti-air utility has less impact against enemies that do not pressure aviation defenses.', ['research','chapter16'],['Shimanto','Laffey II']),
  pick('laffeyii-campaign','ships','Laffey II','campaign','Survival-focused vanguard','S','high',
    'A resilient vanguard selection highlighted by Chapter 16 fleet planning and research comparisons.',
    'Only one copy can be assigned to a given fleet; other ships must cover the second frontline.', ['chapter16','research'],['Guam','Shimanto']),
  pick('gouden-campaign','ships','Gouden Leeuw','campaign','Anti-air and campaign flexibility','S','moderate',
    'Research guidance highlights her campaign value, particularly on accounts without several premium AA vanguards.',
    'Relative value decreases when Guam, Laffey II and other strong AA options are already developed.', ['research'],['Guam','Shimanto']),
  pick('volga-campaign','ships','Volga','campaign','Secondary healing with damage','A','high',
    'Adds targeted recovery while still contributing carrier damage, useful for stabilizing long boss/mob sequences.',
    'Does not replace every role of a full-party healer such as Unicorn (Retrofit).', ['chapter15','healer'],['Aquila','Cowpens']),
  pick('aquila-campaign','ships','Aquila','campaign','Conditional healing / damage carrier','A','moderate',
    'A fighter equipped in Aquila’s second aircraft slot enables healing and shielding; a dive bomber in that slot instead switches her to an offensive preload/damage configuration.',
    'Check slot two before relying on sustain: a dive bomber such as AD-1 Skyraider is NOT the healing configuration. The secondary healer guide conflicts with the imported skill text; the skill condition takes precedence.', ['skillData','healer'],['Volga','Cowpens'],
    {configurations:[
      {name:'Support · healing/shielding',condition:'Equip a Fighter in aircraft slot 2.'},
      {name:'Offense · preload/damage',condition:'Equip a Dive Bomber in aircraft slot 2.'}
    ]}),
  pick('independence-campaign','ships','Independence (Retrofit)','campaign','Air damage and staggered coverage','A','moderate',
    'Staggered carrier pressure offers wave-clearing utility when a second dedicated healer is unnecessary.',
    'Lethal Chapter 15/16 progression can require more recovery than this offensive setup supplies.', ['chapter15'],['Volga','Cowpens']),
  pick('mecklenburg-boss','ships','Mecklenburg','meta','Medium/heavy armor boss damage','EX','moderate',
    'Research analysis places Mecklenburg among the strongest battleships for hard armored boss targets.',
    'Battle-specific timing, armor and gear still determine actual results; no META-boss-specific DPS simulation is available.', ['research'],['Musashi','Lion']),
  pick('nakhimov-boss','ships','Admiral Nakhimov','meta','Carrier boss damage with synergy','S','moderate',
    'Expert research identifies very high ceiling damage, especially with Northern Parliament enablers.',
    'Strongly prefers Moskva or Sovetsky Soyuz support; not a plug-and-play universal boss carrier.', ['research'],['Max Immelmann']),
  pick('plymouth-boss','ships','Plymouth','meta','Boss support vanguard','S','moderate',
    'Specialist assessments identify her as an important modern bossing support with continuing research relevance.',
    'This assessment is a role recommendation, not a measured solo DPS rank; other utility ships can be preferable by boss.', ['regal','research'],['Helena (Retrofit)']),
  pick('musashi-boss','ships','Musashi','meta','Battleship boss alternative','A','moderate',
    'Remains an effective damage battleship, though newer bossing options and armor matchups change her relative standing.',
    'This is not a universal downgrade: flagship barrages and stage-specific enemy waves can favor her.', ['regal'],['Mecklenburg','Lion']),
  pick('maximmelmann-boss','ships','Max Immelmann','meta','High-end carrier damage','A','moderate',
    'Research guidance notes exceptionally strong carrier damage, but also higher gear and synchronization requirements.',
    'Do not infer top-tier META performance without checking target armor and carrier support/gear availability.', ['research'],['Admiral Nakhimov']),
  pick('unicorn-opsi','ships','Unicorn (Retrofit)','opsi','General exploration / mob fleet','EX','moderate',
    'A healing-led mob fleet can endure repeated sector fights while preserving dedicated boss fleets.',
    'Some Siren boss modifiers punish healing: switch to a non-healing boss fleet when necessary.', ['opsi','healer'],['Aquila']),
  pick('la9-boss','equipment','Prototype Carrier-Based La-9','meta','Medium/heavy boss fighter','EX','moderate',
    'Research comparisons identify exceptionally strong anti-medium and anti-heavy boss damage among fighter-slot options.',
    'Not a generic air-defense recommendation; fighter slot and aircraft timing must be validated per carrier.', ['research'],['BF 109G'],{sourceId:'85600',sourceName:'Prototype Carrier-Based La-9'}),
  pick('mecklenburg305-boss','equipment','Prototype Quadruple 305mm SKC39 Main Gun Mount','meta','Series 8 Mecklenburg BB gun · medium/heavy bosses','EX','moderate',
    'Research Focus discusses the Series 8 Mecklenburg 305mm quadruple gun for medium/heavy boss damage and firing-cycle considerations. This is not the Eagle Union Triple 406mm/45 MK7.',
    'This is a conditional research-guide assessment, not a measured universal best-in-slot. Target armor, reload timing and the battleship’s skills may favor another gun.', ['research','officialPR8'],['Champagne gun'],{sourceId:'44320'}),
  pick('ta152-boss','equipment','Carrier-Based Ta 152 C-1/R14','meta','Medium/heavy boss dive bomber','S','moderate',
    'Research Focus describes this PR9 dive bomber as a leading option against medium and heavy boss armor.',
    'Use-case specificity matters: do not extrapolate to light armor or fleet air interception.', ['research'],['Tenrai']),
  pick('tenrai-boss','equipment','Prototype Tenrai','meta','Heavy boss dive bomber / campaign flexibility','A','moderate',
    'Research guidance retains Tenrai as a strong PR4 gear option for campaign and heavy bosses.',
    'Newer Ta 152 may be preferable for medium/heavy single-target bossing.', ['research'],['Carrier-Based Ta 152 C-1/R14'],{sourceId:'39340',sourceName:'Prototype Tenrai'}),
  pick('saiun-boss','equipment','Saiun (Kai)','meta','Converging torpedo bomber','A','moderate',
    'An expert research guide highlights Saiun among relevant converging torpedo bomber options for boss fights.',
    'Converging torpedoes demand appropriate target movement, armor and launch timing.', ['research'],['Prototype VIT-2 (VK-107)'],{sourceId:'38300',sourceName:'Prototype Saiun Kai'}),
  pick('bf109-budget','equipment','Messerschmitt Bf 109G','meta','Budget boss fighter','B','moderate',
    'Research Focus identifies BF 109G as a useful earlier fighter before obtaining La-9 copies.',
    'Significantly outclassed against medium/heavy armor once the specialized La-9 is available.', ['research'],['Prototype Carrier-Based La-9'],{sourceId:'47160',sourceName:'Prototype BF-109G'}),
  pick('rudder-campaign','equipment','Improved Hydraulic Rudder','campaign','Survival auxiliary','S','moderate',
    'A widely used evasion-oriented defensive auxiliary that can help frontline ships endure hard late-stage maps.',
    'Defensive value varies with ship base stats and the specific threats; equipment positioning also matters.', ['bluestacks','chapter15'],['Repair Toolkit'],{sourceId:'1760',sourceName:'High Performance Hydraulic Steering Gear'}),
  pick('tenrai-campaign','equipment','Prototype Tenrai','campaign','Area / heavy target bombing','A','moderate',
    'Research guidance notes Tenrai remains relevant for campaign fleets, not only specialized boss setups.',
    'Check interception needs and carrier slots; this is not a substitute for a defensive fighter.', ['research'],['Carrier-Based Ta 152 C-1/R14'],{sourceId:'39340',sourceName:'Prototype Tenrai'})
]);

export const GRADE_ORDER = Object.freeze({EX:0,S:1,A:2,B:3,C:4,D:5});
export const confidenceLabel = Object.freeze({high:'Multiple relevant sources',moderate:'Guide-supported, provisional',low:'Exploratory'});
export function assessmentsFor(board, mode='all', query='', grade='all') {
  const term=String(query||'').trim().toLocaleLowerCase();
  return AVALON_ASSESSMENTS.filter(item=> item.board===board && (mode==='all'||item.mode===mode) && (grade==='all'||item.grade===grade) && (!term||[item.name,item.role,item.rationale,item.caveat,...item.alternatives].join(' ').toLocaleLowerCase().includes(term)))
    .sort((a,b)=>GRADE_ORDER[a.grade]-GRADE_ORDER[b.grade]||a.name.localeCompare(b.name));
}
export function validateAssessments(records=AVALON_ASSESSMENTS) {
  const keys=new Set(), errors=[];
  for (const r of records) {
    if(keys.has(r.key)) errors.push('Duplicate key: '+r.key);
    keys.add(r.key);
    if(!['ships','equipment'].includes(r.board) || !['campaign','opsi','meta','exercises','events','challenge','daily','guild'].includes(r.mode))errors.push('Invalid board/mode '+r.key);
    if(!(r.grade in GRADE_ORDER))errors.push('Invalid grade '+r.key);
    if(!['high','moderate','low'].includes(r.confidence))errors.push('Invalid confidence '+r.key);
    if(!Array.isArray(r.sources) || !r.sources.length || r.sources.some(id=>!EVIDENCE_SOURCES[id]))errors.push('Missing source '+r.key);
    if(r.sourceId!==undefined && (r.board!=='equipment'||!/^[0-9]{2,8}$/.test(String(r.sourceId))))errors.push('Invalid source equipment identity '+r.key);
    if(r.sourceName!==undefined && (typeof r.sourceName!=='string'||!r.sourceName.trim()))errors.push('Invalid exact-source alias '+r.key);
    if(r.configurations!==undefined && (!Array.isArray(r.configurations)||r.configurations.some(x=>!x.name||!x.condition)))errors.push('Invalid configuration '+r.key);
    if(!r.name||!r.role||!r.rationale||!r.caveat||!/^\d{4}-\d\d-\d\d$/.test(r.reviewedAt))errors.push('Incomplete assessment '+r.key);
  }
  return errors;
}