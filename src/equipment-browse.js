import { nationForEquipment, nationSort } from './catalog-filters.js';
import { sortEquipmentRows } from './equipment-roster.js';

// Categories come from Fernando2603/AzurLane equipment.type. These are navigation
// groups, not performance classifications or equipment-slot legality claims.
export const EQUIPMENT_BROAD_TYPES=Object.freeze([
  {id:'all',label:'All'},
  {id:'guns',label:'Guns'},
  {id:'torpedoes',label:'Torpedoes'},
  {id:'aircraft',label:'Aircraft'},
  {id:'aa',label:'AA'},
  {id:'auxiliary',label:'Auxiliary'},
  {id:'asw',label:'ASW'},
  {id:'special',label:'Special'}
]);
export const EQUIPMENT_GROUP_MODES=Object.freeze([
  {value:'type',label:'Type'},
  {value:'none',label:'All items (global sort)'},
  {value:'nation',label:'Nation'},
  {value:'rarity',label:'Rarity'},
  {value:'families',label:'Exact-name families'}
]);
const TYPE_BROAD=Object.freeze({
  1:'guns',2:'guns',3:'guns',4:'guns',11:'guns',
  5:'torpedoes',13:'torpedoes',
  7:'aircraft',8:'aircraft',9:'aircraft',12:'aircraft',
  6:'aa',21:'aa',
  10:'auxiliary',18:'auxiliary',
  14:'asw',15:'asw',17:'asw',
  20:'special'
});
const NAME_BROAD=Object.freeze({
  'Destroyer Gun':'guns','Light Cruiser Gun':'guns','Heavy Cruiser Gun':'guns',
  'Large Cruiser Gun':'guns','Battleship Gun':'guns',
  'Surface Torpedo':'torpedoes','Submarine Torpedo':'torpedoes',
  'Fighter':'aircraft','Torpedo Bomber':'aircraft','Dive Bomber':'aircraft','Seaplane':'aircraft',
  'Anti-Air Gun':'aa','Time-Fuze AA Gun':'aa',
  'Auxiliary':'auxiliary','Cargo':'auxiliary',
  'Anti-Submarine Weapon':'asw','ASW Aircraft':'asw','Helicopter':'asw',
  'Missile':'special'
});
export const EQUIPMENT_RARITY_VALUE=Object.freeze({'Ultra Rare':5,'Super Rare':4,'Elite':3,'Rare':2,'Normal':1});

export function equipmentBroadType(row) {
  if(row?.typeCode!=null && Object.hasOwn(TYPE_BROAD,String(row.typeCode)))
    return TYPE_BROAD[String(row.typeCode)];
  return NAME_BROAD[String(row?.category||'')]||'special';
}
export function matchesEquipmentBroadType(row,broad='all') {
  return broad==='all'||equipmentBroadType(row)===broad;
}
export function equipmentFamilyKey(row) {
  // Original source identity and exact source display name/type/nation are
  // necessary. A shared PNG is NOT evidence of a shared equipment family.
  const sourceId=String(row?.sourceId||'');
  if(row?.source!=='fernando'||!constNumeric(sourceId))return null;
  const name=String(row.name||'').normalize('NFKC').replace(/\s+/g,' ').trim().toLocaleLowerCase();
  if(!name)return null;
  const type=String(row.typeCode??row.category??'');
  const nation=nationForEquipment(row);
  return JSON.stringify([name,type,nation]);
}
function constNumeric(value) {return /^\d{2,8}$/.test(value);}
export function equipmentFamilyMembers(rows,representativeId) {
  const reference=rows.find(x=>x.id===representativeId);
  const key=equipmentFamilyKey(reference);
  if(!key)return [];
  return sortEquipmentRows(rows.filter(row=>equipmentFamilyKey(row)===key),'rarity',true);
}
export function equipmentDisplayUnits(rows,{families=false,sort='rarity',descending=true}={}) {
  if(!families)return sortEquipmentRows(rows,sort,descending).map(item=>({
    item,kind:'item',members:[item]
  }));
  const groups=new Map();
  for(const item of rows){
    const key=equipmentFamilyKey(item)||'single:'+String(item.id);
    if(!groups.has(key))groups.set(key,[]);
    groups.get(key).push(item);
  }
  const units=[...groups.values()].map(members=>{
    const ordered=sortEquipmentRows(members,'rarity',true);
    return {item:ordered[0],kind:ordered.length>1?'family':'item',members:ordered};
  });
  const orderedItems=sortEquipmentRows(units.map(x=>x.item),sort,descending);
  const byId=new Map(units.map(unit=>[unit.item.id,unit]));
  return orderedItems.map(item=>byId.get(item.id));
}
function categoryPriority(category) {
  const index=EQUIPMENT_BROAD_TYPES.findIndex(x=>x.id===equipmentBroadType({category}));
  return index<0?99:index;
}
export function groupedEquipmentUnits(rows,{group='type',sort='rarity',descending=true}={}) {
  const mode=EQUIPMENT_GROUP_MODES.some(x=>x.value===group)?group:'type';
  const units=equipmentDisplayUnits(rows,{families:mode==='families',sort,descending});
  if(mode==='none')return [{label:'All equipment',items:units}];
  const keyOf=mode==='nation' ? u=>nationForEquipment(u.item)
    :mode==='rarity' ? u=>String(u.item.rarity||'Unverified')
    :u=>String(u.item.category||'Unclassified');
  const buckets=new Map();
  for(const unit of units){
    const key=keyOf(unit);
    if(!buckets.has(key))buckets.set(key,[]);
    buckets.get(key).push(unit);
  }
  const keys=[...buckets.keys()].sort((a,b)=>{
    if(mode==='nation')return nationSort(a,b);
    if(mode==='rarity')return (EQUIPMENT_RARITY_VALUE[b]||0)-(EQUIPMENT_RARITY_VALUE[a]||0)||a.localeCompare(b);
    return categoryPriority(a)-categoryPriority(b)||a.localeCompare(b);
  });
  return keys.map(label=>({label,items:buckets.get(label)}));
}
