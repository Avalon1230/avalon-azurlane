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
    const key=part.toLowerCase().replace(/\s+/g,' ').trim();
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
  const slots=wiki?wiki.concat(base.slice(3)):base;
  return slots.slice(0,7).map((slot,index)=>{
    const type=typeof slot?.type==='string'?slot.type:'Unclassified';
    const categories=slotCategories(type);
    return {
      index,type,categories,
      minEfficiency:Number.isFinite(slot?.minEfficiency)?slot.minEfficiency:null,
      maxEfficiency:Number.isFinite(slot?.maxEfficiency)?slot.maxEfficiency:null,
      maxMounts:Number.isSafeInteger(slot?.maxMounts)?slot.maxMounts:null,
      source:wiki && index<3?'Koumakan Wiki':'Lycoris-AzurAPI',
      verified:categories.length>0
    };
  });
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
  if(!ship?.hull||!slot?.verified||!Array.isArray(equipment))return [];
  const allowed=new Set(slot.categories);
  const matches=equipment.filter(item=>
    item?.source==='fernando' && /^\d{2,8}$/.test(String(item.sourceId||'')) &&
    Number.isInteger(item.typeCode) && allowed.has(item.category) &&
    possibleEquipmentHulls(item).includes(ship.hull)
  );
  return orderCandidates(matches,mode);
}
export function candidateEvidence(slot,item,mode='general') {
  if(!item)return 'No equipment candidate has been verified for this slot.';
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
  const slots=verifiedShipSlots(data,wikiFacts).map(slot=>{
    const candidates=candidatesForSlot(ship,slot,equipment,selectedMode);
    const manualId=String(overrides?.[slot.index]||'');
    const manual=manualId?candidates.find(x=>x.id===manualId):null;
    const selected=manual||candidates[0]||null;
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
  return !!slot?.candidates.some(item=>item.id===equipmentId);
}
