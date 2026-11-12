/**
 * AVALON Tactical Loadout Intelligence — source-backed eligibility and
 * candidates, never an independently simulated or best-in-slot rating.
 *
 * Sources:
 * - Exact GroupID Koumakan ship wiki slots (when available)
 * - Lycoris ship records (894 ships)
 * - Dated AzurLaneData complete five-slot manifest and exact hull IDs
 * - Dated AzurLaneData augment manifest and documented hull eligibility
 * - Fernando2603/AzurLane equipment IDs, types and hull restrictions
 */
import { possibleEquipmentHulls, EQUIPMENT_TYPE_HULL_SLOTS } from './catalog-filters.js';
import { gameShipSlots } from './game-slot-manifest.js';
import { candidateAugmentsForShip, announcedAugmentForShip } from './augment-manifest.js';

export const LOADOUT_MODES = Object.freeze([
  {id:'general',name:'General',description:'Balance documented eligibility, enhancement attributes and ship role.'},
  {id:'boss',name:'Boss',description:'Review accuracy, firing cycle, armor interaction and single-target uptime.'},
  {id:'mobbing',name:'Mobbing',description:'Review reload, target coverage, sustained waves and survivability.'},
  {id:'opsi',name:'OpSi',description:'Review armor, anti-Siren bonuses, fleet synergy and encounter mechanics.'}
]);

// These are source equipment type IDs, not a user-authored tier or performance scale.
const CATEGORY_BY_TYPE=Object.freeze({
  1:'Destroyer Gun',2:'Light Cruiser Gun',3:'Heavy Cruiser Gun',4:'Battleship Gun',
  5:'Surface Torpedo',6:'Anti-Air Gun',7:'Fighter',8:'Torpedo Bomber',
  9:'Dive Bomber',10:'Auxiliary',11:'Large Cruiser Gun',12:'Seaplane',
  13:'Submarine Torpedo',14:'Anti-Submarine Weapon',15:'ASW Aircraft',
  17:'Helicopter',18:'Cargo',20:'Missile',21:'Time-Fuze AA Gun'
});
const ALIASES=Object.freeze({
  'dd gun':'Destroyer Gun','dd guns':'Destroyer Gun','destroyer gun':'Destroyer Gun','destroyer guns':'Destroyer Gun',
  'cl gun':'Light Cruiser Gun','cl guns':'Light Cruiser Gun','light cruiser gun':'Light Cruiser Gun','light cruiser guns':'Light Cruiser Gun',
  'ca gun':'Heavy Cruiser Gun','ca guns':'Heavy Cruiser Gun','heavy cruiser gun':'Heavy Cruiser Gun','heavy cruiser guns':'Heavy Cruiser Gun',
  'cb gun':'Large Cruiser Gun','cb guns':'Large Cruiser Gun','large cruiser gun':'Large Cruiser Gun','large cruiser guns':'Large Cruiser Gun',
  'bb gun':'Battleship Gun','bb guns':'Battleship Gun','battleship gun':'Battleship Gun','battleship guns':'Battleship Gun',
  'artillery (destroyer)':'Destroyer Gun',
  'artillery (light cruiser)':'Light Cruiser Gun',
  'artillery (heavy cruiser)':'Heavy Cruiser Gun',
  'artillery (battleship)':'Battleship Gun',
  'artillery (pocket battleship)':'Large Cruiser Gun',
  'torpedo':'Surface Torpedo','torpedoes':'Surface Torpedo','surface torpedo':'Surface Torpedo','surface torpedoes':'Surface Torpedo',
  'torpedo (submarine)':'Submarine Torpedo',
  'submarine torpedo':'Submarine Torpedo','submarine torpedoes':'Submarine Torpedo',
  'aa gun':'Anti-Air Gun','aa guns':'Anti-Air Gun','anti-air gun':'Anti-Air Gun','anti-air guns':'Anti-Air Gun',
  'time-fuze aa gun':'Time-Fuze AA Gun','time fuze aa gun':'Time-Fuze AA Gun',
  'fighter':'Fighter','fighters':'Fighter','dive bomber':'Dive Bomber','dive bombers':'Dive Bomber',
  'torpedo bomber':'Torpedo Bomber','torpedo bombers':'Torpedo Bomber',
  'seaplane':'Seaplane','seaplanes':'Seaplane','reconnaissance':'Seaplane',
  'asw aircraft':'ASW Aircraft','asw plane':'ASW Aircraft',
  'helicopter':'Helicopter','helicopters':'Helicopter',
  'asw':'Anti-Submarine Weapon','anti-submarine weapon':'Anti-Submarine Weapon',
  'auxiliary':'Auxiliary','auxiliaries':'Auxiliary','auxiliary equipment':'Auxiliary',
  'cargo':'Cargo','missile':'Missile'
});
const GEAR_RARITY=Object.freeze({'Ultra Rare':5,'Super Rare':4,'Elite':3,'Rare':2,'Normal':1});
const MODE_STAT=Object.freeze({boss:'hit',mobbing:'reload',opsi:'anti_siren'});
const MODE_STAT_NAMES=Object.freeze({hit:'HIT',reload:'RLD',anti_siren:'Anti-Siren'});
const HULL_ID=Object.freeze({
  DD:1,CL:2,CA:3,BC:4,BB:5,CVL:6,CV:7,SS:8,BBV:10,
  AR:12,BM:13,SSV:17,CB:18,AE:19,IXS:22,IXV:23,IXM:24
});

export function slotCategories(type) {
  if(typeof type!=='string'||type.length>160)return [];
  const original=type.normalize('NFKC').replace(/\u00a0/g,' ');
  // Shorthand such as "DD/CL Main Guns" applies "Main Guns" to BOTH labels.
  const expanded=original.replace(
    /\b((?:DD|CL|CA|CB|BB|AA)(?:\s*\/\s*(?:DD|CL|CA|CB|BB|AA))+)[ \t]+((?:Main|Secondary)[ \t]+Guns)\b/gi,
    (_whole,types,suffix)=>types.split(/\s*\/\s*/).map(t=>t+' '+suffix).join(' / ')
  );
  const parts=expanded.split(/\s*(?:\/|,|\bor\b|\band\b|\||&)\s*/i);
  const result=[];
  for(const part of parts){
    const key=part.toLowerCase().replace(/\(\s*(?:lb\s*[123]|mlb|limit break\s*[123])\s*\)/gi,'')
      .replace(/\b(?:main|secondary)\s+(guns?)\b/g,'$1')
      .replace(/\s+/g,' ').trim();
    const cat=Object.hasOwn(ALIASES,key)?ALIASES[key]:null;
    if(cat&&!result.includes(cat))result.push(cat);
  }
  return result;
}
function categoriesFromTypes(types){
  return [...new Set((Array.isArray(types)?types:[])
    .map(type=>CATEGORY_BY_TYPE[type]).filter(Boolean))];
}
function sameShip(wiki,data){
  return wiki&&String(wiki.sourceId||'')===String(data?.id||'');
}
function wikiHull(wiki,data){
  return sameShip(wiki,data)&&[22,23,24].includes(wiki.hullId)?wiki.hullId:null;
}
function sourcedGame(data,gameFacts){
  if(gameFacts===null)return null; // Explicitly disable dated snapshot for isolated tests.
  const game=gameFacts===undefined?gameShipSlots(data?.id):gameFacts;
  return game&&String(game.sourceId||'')===String(data?.id||'')?game:null;
}
function slotFromText(sourceSlot,index,source,hullId){
  const type=typeof sourceSlot?.type==='string'?sourceSlot.type:'Unclassified';
  const categories=slotCategories(type);
  return {index,type,categories,
    typeCodes:[],hullId,
    minEfficiency:Number.isFinite(sourceSlot?.minEfficiency)?sourceSlot.minEfficiency:null,
    maxEfficiency:Number.isFinite(sourceSlot?.maxEfficiency)?sourceSlot.maxEfficiency:null,
    maxMounts:Number.isSafeInteger(sourceSlot?.maxMounts)?sourceSlot.maxMounts:null,
    source,verified:categories.length>0};
}
function slotFromGame(slot,index,hullId){
  const types=Array.isArray(slot?.types)?slot.types:[];
  const categories=categoriesFromTypes(types);
  return {index,type:categories.join(' / ')||'Unclassified',
    categories,typeCodes:types.slice(),hullId,
    minEfficiency:null,
    maxEfficiency:Number.isFinite(slot?.maxEfficiency)?slot.maxEfficiency:null,
    maxMounts:Number.isSafeInteger(slot?.maxMounts)?slot.maxMounts:null,
    parallel:slot?.parallel??null,capacity:slot?.capacity??null,
    source:'AzurLaneData · May 2026',verified:categories.length>0};
}
function choosePrimary(index,base,wiki,game,hullId){
  // Prefer a precise, GroupID-checked wiki type, then exact MLB arrays.
  // Fall back per slot instead of blanking the entire ship.
  const wikiSlot=wiki?.slots?.[index];
  if(wikiSlot){
    const parsed=slotFromText(wikiSlot,index,'Koumakan Wiki',hullId);
    if(parsed.verified)return parsed;
  }
  // The exact-ID, fully limit-broken arrays preserve mixed mounts that the
  // Lycoris display label reduces to one type (and correct misplaced labels).
  const source=game?.slots?.[index];
  if(source)return slotFromGame(source,index,hullId);
  if(base[index]){
    const parsed=slotFromText(base[index],index,'Lycoris-AzurAPI',hullId);
    if(parsed.verified)return parsed;
  }
  return slotFromText(base[index]||wikiSlot,index,'Unverified ship slot',hullId);
}

/**
 * Return verified first-three primary types plus any exact-ID sourced extra
 * equipment positions. A 2026-05 source contains five full slots for 852
 * currently indexed ships; for newer ships, keep the Lycoris source types.
 */
export function verifiedShipSlots(data,wikiFacts=null,gameFacts=null) {
  const wiki=sameShip(wikiFacts,data)&&Array.isArray(wikiFacts.slots)&&wikiFacts.slots.length===3?wikiFacts:null;
  const base=Array.isArray(data?.slots)?data.slots:[];
  const game=sourcedGame(data,gameFacts);
  const hullId=wikiHull(wikiFacts,data)??game?.hullId??null;
  const slots=Array.from({length:3},(_,index)=>choosePrimary(index,base,wiki,game,hullId));
  if(game?.slots?.length>3){
    for(let index=3;index<Math.min(8,game.slots.length);index++)
      slots.push(slotFromGame(game.slots[index],index,hullId));
  }else{
    for(let index=3;index<Math.min(8,base.length);index++)
      slots.push(slotFromText(base[index],index,'Lycoris-AzurAPI',hullId));
  }
  return slots;
}

/**
 * All 5 regular game slots, plus an augment position. If exact-ID auxiliary
 * records are not available, mark potential slots as provisional.
 * Actual augment candidates come only from verified source type/ship records.
 */
export function loadoutDisplaySlots(data,wikiFacts=null,gameFacts=undefined,ship=null) {
  const game=sourcedGame(data,gameFacts);
  const sourced=verifiedShipSlots(data,wikiFacts,game);
  const primary=sourced.slice(0,3).map(slot=>({
    ...slot,kind:slot.categories.includes('Auxiliary')?'auxiliary':'weapon',provisional:false
  }));
  // A few newer Sailing Frigates have a generic IX hull identifier in
  // Lycoris, not the exact IXS/IXV/IXM class. Their source slot types are
  // known, but equipment legality remains provisional until subclass is known.
  if(!game&&wikiHull(wikiFacts,data)===null&&ship?.hull==='IX'){
    for(const slot of primary){
      slot.provisional=true;
      slot.source+=' · Sailing Frigate subclass unverified';
    }
  }
  const extra=sourced.slice(3).map(slot=>({
    ...slot,kind:slot.categories.includes('Auxiliary')?'auxiliary':'special',
    provisional:false
  }));
  const slots=[...primary,...extra];
  const auxCount=extra.filter(slot=>slot.kind==='auxiliary').length;
  for(let i=auxCount;i<2;i++)slots.push({
    index:slots.length,kind:'auxiliary',type:'Auxiliary',categories:['Auxiliary'],typeCodes:[10],
    hullId:wikiHull(wikiFacts,data)??game?.hullId??HULL_ID[ship?.hull]??null,
    source:'Standard equipment layout · ship-specific slot unverified',
    verified:false,provisional:true,minEfficiency:null,maxEfficiency:null,maxMounts:null
  });
  const hullId=wikiHull(wikiFacts,data)??game?.hullId??HULL_ID[ship?.hull]??null;
  const augmentCandidates=candidateAugmentsForShip({shipId:game?.shipId??null,hullId});
  // Publisher-announced October 2026 modules postdate the May extract.
  // Surface the sourced NAME only; no guessed game ID or simulated stats.
  const announcement=announcedAugmentForShip(data?.id);
  if(announcement&&!augmentCandidates.some(a=>a.matchLevel==='ship-specific'))
    augmentCandidates.unshift(announcement);
  const wikiType=typeof wikiFacts?.augmentType==='string'&&sameShip(wikiFacts,data)
    ?wikiFacts.augmentType.trim():null;
  // Wiki type labels and generic module names can disagree; do not display a
  // misleading category beside a differently named source-matched module.
  const selectedType=wikiType && augmentCandidates.some(item=>
    item.name.toLocaleLowerCase()===wikiType.toLocaleLowerCase())?wikiType:null;
  slots.push({
    index:slots.length,kind:'augment',type:selectedType?'Augment · '+selectedType:'Augment',
    augmentType:selectedType||null,
    source:announcement?'Yostar official announcement · October 2026':
      game?'AzurLaneData · exact ship ID / augment type':'Augment class eligibility only',
    categories:[],typeCodes:[],hullId,
    augmentCandidates,verified:augmentCandidates.length>0&&(!!game||!!announcement),
    provisional:augmentCandidates.length>0&&!game&&!announcement,
    minEfficiency:null,maxEfficiency:null,maxMounts:null
  });
  return slots;
}
function numericStat(item,key) {
  const n=item?.stats?.[key];
  return typeof n==='number'&&Number.isFinite(n)?n:null;
}
function orderCandidates(candidates,mode) {
  const primary=MODE_STAT[mode]||null;
  return candidates.slice().sort((a,b)=>{
    const aStat=primary?numericStat(a,primary):null,bStat=primary?numericStat(b,primary):null;
    if(aStat!==null&&bStat!==null&&aStat!==bStat)return bStat-aStat;
    if(aStat!==null&&bStat===null)return -1;
    if(bStat!==null&&aStat===null)return 1;
    const rarity=(GEAR_RARITY[b.rarity]||0)-(GEAR_RARITY[a.rarity]||0);
    return rarity||String(a.name||'').localeCompare(String(b.name||''))||
      String(a.sourceId).localeCompare(String(b.sourceId));
  });
}
export function candidatesForSlot(ship,slot,equipment,mode='general') {
  if(slot?.kind==='augment')return slot.augmentCandidates||[];
  if(!ship?.hull||(!slot?.verified&&!slot?.provisional)||!Array.isArray(equipment))return [];
  const allowed=new Set(slot.categories);
  const exactHull=Number.isInteger(slot.hullId)?slot.hullId:null;
  const matches=equipment.filter(item=>{
    if(item?.source!=='fernando'||!/^\d{2,8}$/.test(String(item.sourceId||''))||
      !Number.isInteger(item.typeCode)||CATEGORY_BY_TYPE[item.typeCode]!==item.category||
      !allowed.has(item.category))return false;
    if(exactHull===null){
      // A union of subclasses can admit gear forbidden on the actual ship.
      if(ship.hull==='IX')return false;
      return possibleEquipmentHulls(item).includes(ship.hull);
    }
    if(slot.typeCodes?.length)return slot.typeCodes.includes(item.typeCode)&&
      !item.forbiddenHullIds?.includes(exactHull);
    return EQUIPMENT_TYPE_HULL_SLOTS[String(item.typeCode)]?.some(([id])=>id===exactHull) &&
      !item.forbiddenHullIds?.includes(exactHull);
  });
  return orderCandidates(matches,mode);
}
export function candidateEvidence(slot,item,mode='general') {
  if(slot?.kind==='augment'){
    if(!item)return 'No source-matched augment candidate was found. A wiki augment type alone is not proof of a particular module.';
    if(item.matchLevel==='announced-specific')
      return 'The publisher announced this module for this exact ship on October 21, 2026 (released October 22). The item ID, gameplay stats, crafting details and icon have not been independently verified. No combat effectiveness is inferred.';
    const evidence=item.matchLevel==='ship-specific'
      ?'This module is assigned to this ship’s exact internal collection ID in the dated augment source.'
      :'This general module matches the ship’s hull type in the published augment-type eligibility data.';
    return evidence+' Source rarity and availability are recorded; combat effects are not yet evaluated. Source snapshot: May 2026.';
  }
  if(slot?.provisional&&slot.hullId===null)return 'The exact hull subclass is missing from the source. No equipment is assigned until its restrictions can be checked.';
  if(slot?.provisional)return item
    ?'Source category '+item.category+' and hull restrictions match, but this auxiliary slot is inferred from the standard layout. Individual ship exceptions, uniqueness limits and build performance remain unverified.'
    :'This auxiliary position is inferred from the common game layout, and has no verified candidate in the current source.';
  if(!item)return slot?.verified
    ?'The slot type is sourced, but no corresponding equipment is indexed as potentially compatible with this hull.'
    :'Ship-specific slot category is not verified, so no equipment is assigned.';
  const pct=Number.isFinite(slot.maxEfficiency)?' · slot efficiency up to '+Math.round(slot.maxEfficiency*100)+'%':'';
  const parts=['Source category '+item.category+' matches '+slot.type+pct+'.',
    'The source records potential hull compatibility after class restrictions. Ship-specific exceptions still require checking.'];
  const field=MODE_STAT[mode],stat=field?numericStat(item,field):null;
  if(stat!==null)parts.push(MODE_STAT_NAMES[field]+' '+(stat>=0?'+':'')+stat+' is reported at the highest sourced enhancement; not a combat score.');
  else parts.push('No verified mode-specific performance advantage is established.');
  return parts.join(' ');
}

export function buildShipLoadout({ship=null,data=null,wikiFacts=null,gameFacts=undefined,
  equipment=[],mode='general',overrides={}}={}) {
  const selectedMode=LOADOUT_MODES.some(item=>item.id===mode)?mode:'general';
  const usedAuxIds=new Set(),usedLimits=new Set();
  const prepared=loadoutDisplaySlots(data,wikiFacts,gameFacts,ship).map(slot=>{
    const candidates=candidatesForSlot(ship,slot,equipment,selectedMode);
    const manualId=String(overrides?.[slot.index]||'');
    const eligible=item=>!item.equipLimit||!usedLimits.has(item.equipLimit);
    const manual=manualId?candidates.find(x=>x.id===manualId&&eligible(x)):null;
    if(manual?.equipLimit)usedLimits.add(manual.equipLimit);
    if(manual&&slot.kind==='auxiliary')usedAuxIds.add(manual.id);
    return {...slot,candidates,manualItem:manual};
  });
  // Reserve valid personal choices before defaults, even in later positions.
  const slots=prepared.map(({manualItem:manual,...slot})=>{
    const candidates=slot.candidates;
    const eligible=item=>!item.equipLimit||!usedLimits.has(item.equipLimit);
    // Source-only planning choices: an automatically surfaced item is NOT a
    // performance recommendation, nor an independent ship-specific legality check.
    let selected=manual;
    if(!selected){
      selected=slot.kind==='auxiliary'
        ?candidates.find(item=>eligible(item)&&!usedAuxIds.has(item.id))||null
        :candidates.find(eligible)||null;
    }
    if(selected&&slot.kind==='auxiliary')usedAuxIds.add(selected.id);
    if(selected?.equipLimit)usedLimits.add(selected.equipLimit);
    return {...slot,candidates,selected,manual:!!manual,
      explanation:candidateEvidence(slot,selected,selectedMode)};
  });
  // Options and saved-pick validation obey the same cross-slot limit groups.
  for(const slot of slots){
    const otherLimits=new Set(slots.filter(other=>other.index!==slot.index)
      .map(other=>other.selected?.equipLimit).filter(Boolean));
    slot.candidates=slot.candidates.filter(item=>!item.equipLimit||!otherLimits.has(item.equipLimit));
  }
  return {
    sourceId:String(data?.id||ship?.sourceId||''),mode:selectedMode,
    description:LOADOUT_MODES.find(x=>x.id===selectedMode).description,
    slots,augment:slots.find(x=>x.kind==='augment')?.selected||null,
    confidence:'Source-matched candidates · NOT independently combat-evaluated'
  };
}
export function validateManualChoice(model,slotIndex,equipmentId) {
  if(!model||!Number.isSafeInteger(slotIndex)||slotIndex<0)return false;
  const slot=model.slots.find(x=>x.index===slotIndex);
  return !!slot?.candidates.some(item=>item.id===equipmentId);
}
