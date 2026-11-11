/**
 * Tactical Loadout Intelligence v0.8.0 — sourced equipment *candidates*, not
 * verified best-in-slot recommendations. No unsourced rank, DPS or skill
 * synergy computations. The panel is an evidence-first planning station.
 */
import { possibleEquipmentHulls } from './catalog-filters.js';

export const LOADOUT_MODES = Object.freeze([
  {id:'general',name:'General',description:'Balance documented eligibility, enhancement attributes and ship role.'},
  {id:'boss',name:'Boss',description:'Review accuracy, firing cycle, armor interaction and single-target uptime.'},
  {id:'mobbing',name:'Mobbing',description:'Review reload, target coverage, sustained waves and survivability.'},
  {id:'opsi',name:'OpSi',description:'Review armor, anti-Siren bonuses, fleet synergy and encounter mechanics.'}
]);
const GEAR_RARITY=Object.freeze({'Ultra Rare':5,'Super Rare':4,'Elite':3,'Rare':2,'Normal':1});
const ALIASES=Object.freeze({
  'dd gun':'Destroyer Gun','dd guns':'Destroyer Gun','destroyer gun':'Destroyer Gun','destroyer guns':'Destroyer Gun',
  'cl gun':'Light Cruiser Gun','cl guns':'Light Cruiser Gun','light cruiser gun':'Light Cruiser Gun','light cruiser guns':'Light Cruiser Gun',
  'ca gun':'Heavy Cruiser Gun','ca guns':'Heavy Cruiser Gun','heavy cruiser gun':'Heavy Cruiser Gun','heavy cruiser guns':'Heavy Cruiser Gun',
  'cb gun':'Large Cruiser Gun','cb guns':'Large Cruiser Gun','large cruiser gun':'Large Cruiser Gun','large cruiser guns':'Large Cruiser Gun',
  'bb gun':'Battleship Gun','bb guns':'Battleship Gun','battleship gun':'Battleship Gun','battleship guns':'Battleship Gun',
  'torpedo':'Surface Torpedo','torpedoes':'Surface Torpedo','surface torpedo':'Surface Torpedo','surface torpedoes':'Surface Torpedo',
  'submarine torpedo':'Submarine Torpedo','submarine torpedoes':'Submarine Torpedo',
  'aa gun':'Anti-Air Gun','aa guns':'Anti-Air Gun','anti-air gun':'Anti-Air Gun','anti-air guns':'Anti-Air Gun',
  'time-fuze aa gun':'Time-Fuze AA Gun','time fuze aa gun':'Time-Fuze AA Gun',
  'fighter':'Fighter','fighters':'Fighter','dive bomber':'Dive Bomber','dive bombers':'Dive Bomber',
  'torpedo bomber':'Torpedo Bomber','torpedo bombers':'Torpedo Bomber',
  'seaplane':'Seaplane','seaplanes':'Seaplane','asw aircraft':'ASW Aircraft','asw plane':'ASW Aircraft',
  'helicopter':'Helicopter','helicopters':'Helicopter',
  'asw':'Anti-Submarine Weapon','anti-submarine weapon':'Anti-Submarine Weapon',
  'auxiliary':'Auxiliary','auxiliaries':'Auxiliary','auxiliary equipment':'Auxiliary',
  'cargo':'Cargo','missile':'Missile'
});
const MODE_STAT=Object.freeze({boss:'hit',mobbing:'reload',opsi:'anti_siren'});
const MODE_STAT_NAMES=Object.freeze({hit:'HIT',reload:'RLD',anti_siren:'Anti-Siren'});

export function slotCategories(type) {
  if(typeof type!=='string'||type.length>160)return [];
  const parts=type.normalize('NFKC').replace(/\u00a0/g,' ').split(/\s*(?:\/|,|\bor\b|\band\b|\||&)\s*/i);
  const result=[];
  for(const part of parts){
    // The wiki uses both "CB Guns" and "CB Main Guns" (likewise
    // DD/CL/AA) depending on ship class. The previously literal-only
    // dictionary silently rejected the latter across many ship profiles.
    const raw=part.toLowerCase().replace(/\s+/g,' ').trim();
    const key=raw
      .replace(/\b(?:main|secondary|primary|auxiliary)\s+(?=guns?\b)/g,'')
      .replace(/\bgun\s+mounts?\b/g,'guns')
      .replace(/\bmain\s+armaments?\b/g,'guns')
      .replace(/\s+/g,' ').trim();
    if(!Object.hasOwn(ALIASES,key))continue;
    const cat=ALIASES[key];
    if(!result.includes(cat))result.push(cat);
  }
  return result;
}

export function verifiedShipSlots(data,wikiFacts=null) {
  const wiki=wikiFacts && String(wikiFacts.sourceId)===String(data?.id)&&
    Array.isArray(wikiFacts.slots)&&wikiFacts.slots.length===3?wikiFacts.slots:null;
  const base=Array.isArray(data?.slots)?data.slots:[];
  // Wiki facts cover 3 weapon slots. Add others ONLY if source lists them.
  // Prefer validated wiki categories per slot. A wiki label that the
  // dictionary cannot understand should not erase a usable Lycoris slot.
  const slots=Array.from({length:Math.max(base.length,wiki?.length||0)},(_,index)=>{
    const sourceWiki=wiki?.[index];
    const wikiValid=sourceWiki&&slotCategories(sourceWiki.type).length>0;
    return wikiValid?{...sourceWiki,_source:'Koumakan Wiki'}:
      {...(base[index]||{}),_source:base[index]?'Lycoris-AzurAPI':'Unverified'};
  });
  return slots.slice(0,7).map((slot,index)=>{
    const type=typeof slot?.type==='string'?slot.type:'Unclassified';
    const categories=slotCategories(type);
    return {
      index,type,categories,
      minEfficiency:Number.isFinite(slot?.minEfficiency)?slot.minEfficiency:null,
      maxEfficiency:Number.isFinite(slot?.maxEfficiency)?slot.maxEfficiency:null,
      maxMounts:Number.isSafeInteger(slot?.maxMounts)?slot.maxMounts:null,
      source:slot._source||'Unverified',
      verified:categories.length>0
    };
  });
}

/**
 * Render the normal 3 + 2 + augment arrangement without claiming that generic
 * auxiliary positions are individually verified. Unusual ships can retain any
 * additional source-declared slots. Do not fabricate an augment item.
 */
export function loadoutDisplaySlots(data,wikiFacts=null) {
  const sourced=verifiedShipSlots(data,wikiFacts);
  const primary=Array.from({length:3},(_,index)=>sourced[index]?
    {...sourced[index],kind:sourced[index].categories.includes('Auxiliary')?'auxiliary':'weapon',provisional:false}:
    {index,kind:'weapon',type:'Weapon slot · details unavailable',categories:[],
      source:'Ship-specific slot data unavailable',verified:false,provisional:false,
      minEfficiency:null,maxEfficiency:null,maxMounts:null});
  const extra=sourced.slice(3).map(slot=>({...slot,
    kind:slot.categories.includes('Auxiliary')?'auxiliary':'special',provisional:false}));
  const slots=[...primary,...extra];
  const documentedAux=extra.filter(slot=>slot.kind==='auxiliary').length;
  for(let i=documentedAux;i<2;i++)slots.push({
    index:slots.length,kind:'auxiliary',type:'Auxiliary',categories:['Auxiliary'],
    source:'Standard equipment layout · ship-specific rules unverified',
    verified:false,provisional:true,minEfficiency:null,maxEfficiency:null,maxMounts:null
  });
  // Augments are a separate inventory system. A wiki-listed augment TYPE does
  // not mean that a particular augment item or effect is verified.
  const aug=typeof wikiFacts?.augmentType==='string'&&
    String(wikiFacts.sourceId)===String(data?.id)?wikiFacts.augmentType.trim():null;
  slots.push({
    index:slots.length,kind:'augment',type:aug?'Augment · '+aug:'Augment',
    augmentType:aug||null,source:aug?'Koumakan Wiki · type only':'Augment eligibility not verified',
    categories:[],verified:false,provisional:false,
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
  // Prefer a comparable reported mode stat only when present; no DPS model.
  return candidates.slice().sort((a,b)=>{
    const aStat=primary?numericStat(a,primary):null;
    const bStat=primary?numericStat(b,primary):null;
    if(aStat!==null&&bStat!==null&&aStat!==bStat)return bStat-aStat;
    if(aStat!==null&&bStat===null)return -1;
    if(bStat!==null&&aStat===null)return 1;
    const rarity=(GEAR_RARITY[b.rarity]||0)-(GEAR_RARITY[a.rarity]||0);
    return rarity||String(a.name||'').localeCompare(String(b.name||''))||
      String(a.sourceId).localeCompare(String(b.sourceId));
  });
}
export function candidatesForSlot(ship,slot,equipment,mode='general') {
  if(!ship?.hull||(!slot?.verified&&!slot?.provisional)||slot?.kind==='augment'||!Array.isArray(equipment))return [];
  const allowed=new Set(slot.categories);
  const matches=equipment.filter(item=>
    item?.source==='fernando' && /^\d{2,8}$/.test(String(item.sourceId||'')) &&
    Number.isInteger(item.typeCode) && allowed.has(item.category) &&
    possibleEquipmentHulls(item).includes(ship.hull)
  );
  return orderCandidates(matches,mode);
}
export function candidateEvidence(slot,item,mode='general') {
  if(slot?.kind==='augment')return slot.augmentType
    ? 'Koumakan Wiki identifies augment type '+slot.augmentType+'. Individual module eligibility and effects have not been verified; no augment is selected.'
    : 'This ship\'s augment eligibility and compatible module have not been verified. No module will be guessed.';
  if(slot?.provisional)return item
    ? 'Tentative Auxiliary candidate: source category and potential hull restrictions match. This position is inferred from the standard layout; ship-specific eligibility, duplicate restrictions and combat value still require verification.'
    : 'Auxiliary position inferred from the standard equipment layout; no source-matched equipment was found. Ship-specific legality remains unverified.';
  if(!item)return slot?.verified
    ? 'No source-matched equipment candidate was found for this verified slot.'
    : 'Ship-specific slot category is not verified, so no equipment is assigned.';
  const pct=Number.isFinite(slot.maxEfficiency)?' · slot efficiency up to '+Math.round(slot.maxEfficiency*100)+'%':'';
  const parts=['Source category '+item.category+' matches '+slot.type+pct+'.',
    'The source records potential hull compatibility after class restrictions. Ship-specific exceptions still require checking.'];
  const field=MODE_STAT[mode];
  const stat=field?numericStat(item,field):null;
  if(stat!==null)parts.push(MODE_STAT_NAMES[field]+' '+(stat>=0?'+':'')+stat+' is reported at the highest sourced enhancement; not a combat score.');
  else parts.push('No verified mode-specific performance advantage is established.');
  return parts.join(' ');
}

export function buildShipLoadout({ship=null,data=null,wikiFacts=null,equipment=[],mode='general',overrides={}}={}) {
  const selectedMode=LOADOUT_MODES.some(item=>item.id===mode)?mode:'general';
  const usedTentative=new Set();
  const slots=loadoutDisplaySlots(data,wikiFacts).map(slot=>{
    const candidates=candidatesForSlot(ship,slot,equipment,selectedMode);
    const manualId=String(overrides?.[slot.index]||'');
    const manual=manualId?candidates.find(x=>x.id===manualId):null;
    // Tentatively show a hull/type-matched auxiliary instead of an empty
    // card, without pretending a ship-specific legality check was done.
    // Use different alternatives for the two generic auxiliary positions.
    const tentative=slot.provisional?candidates.find(x=>!usedTentative.has(x.id)):null;
    const selected=manual||((slot.provisional||slot.verified)?tentative||candidates[0]:null)||null;
    if(slot.provisional&&selected)usedTentative.add(selected.id);
    return {...slot,candidates,selected,manual:!!manual,
      explanation:candidateEvidence(slot,selected,selectedMode)};
  });
  return {
    sourceId:String(data?.id||ship?.sourceId||''),
    mode:selectedMode,
    description:LOADOUT_MODES.find(x=>x.id===selectedMode).description,
    slots,
    augment:typeof wikiFacts?.augmentType==='string'&&
      String(wikiFacts.sourceId)===String(data?.id)?wikiFacts.augmentType:null,
    confidence:'Source-matched candidates · NOT independently combat-evaluated'
  };
}
export function validateManualChoice(model,slotIndex,equipmentId) {
  if(!model||!Number.isSafeInteger(slotIndex)||slotIndex<0)return false;
  const slot=model.slots.find(x=>x.index===slotIndex);
  return slot?.kind!=='augment' && !!slot?.candidates.some(item=>item.id===equipmentId);
}
