import { nationForShip, nationForEquipment } from './catalog-filters.js';

/**
 * Optional, read-only community data adapters. Third-party JSON is fetched at
 * runtime, never redistributed in this repository. No tier scores are inferred.
 * See docs/DATA_SOURCES.md before extending these adapters.
 */
export const REMOTE_FEEDS = Object.freeze({
  ships: 'https://raw.githubusercontent.com/iujab/Lycoris-AzurAPI/main/data/ship-list.json',
  shipVersion: 'https://raw.githubusercontent.com/iujab/Lycoris-AzurAPI/main/data/version.json',
  equipment: 'https://raw.githubusercontent.com/Fernando2603/AzurLane/main/equipment.json'
});

const HULLS = Object.freeze({
  'Destroyer': 'DD', 'Light Cruiser': 'CL', 'Heavy Cruiser': 'CA',
  'Large Cruiser': 'CB', 'Battlecruiser': 'BC', 'Battleship': 'BB',
  'Aviation Battleship': 'BBV', 'Monitor': 'BM',
  'Aircraft Carrier': 'CV', 'Light Carrier': 'CVL',
  'Submarine': 'SS', 'Aviation Submarine': 'SSV',
  'Repair': 'AR', 'Munition Ship': 'AE',
  // An undifferentiated Sailing Frigate record may be main or vanguard.
  // Keep it visible in catalog, but do not make ambiguous fleet assignments.
  'Sailing Frigate': 'IX'
});

const GEAR_TYPES = Object.freeze({
  1:'Destroyer Gun',2:'Light Cruiser Gun',3:'Heavy Cruiser Gun',4:'Battleship Gun',
  5:'Surface Torpedo',6:'Anti-Air Gun',7:'Fighter',8:'Torpedo Bomber',
  9:'Dive Bomber',10:'Auxiliary',11:'Large Cruiser Gun',12:'Seaplane',
  13:'Submarine Torpedo',14:'Anti-Submarine Weapon',15:'ASW Aircraft',
  17:'Helicopter',18:'Cargo',20:'Missile',21:'Time-Fuze AA Gun'
});
const RARITIES = Object.freeze({2:'Normal',3:'Rare',4:'Elite',5:'Super Rare',6:'Ultra Rare'});
const SAFE_DATA_LIMIT = 7_000_000;

export async function fetchJson(fetcher, url, {timeoutMs=15000}={}) {
  const controller = new AbortController();
  const timer = setTimeout(()=>controller.abort(), timeoutMs);
  try {
    const response = await fetcher(url,{signal:controller.signal,cache:'no-cache'});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const headerLength = Number(response.headers?.get?.('content-length') || 0);
    if (headerLength > SAFE_DATA_LIMIT) throw new Error('Dataset exceeds size limit');
    const raw = await response.text();
    if (raw.length > SAFE_DATA_LIMIT) throw new Error('Dataset exceeds size limit');
    return JSON.parse(raw);
  } finally { clearTimeout(timer); }
}

export function normalizeShips(input) {
  if (!Array.isArray(input)) throw new Error('Ship source did not return an array');
  if (input.length < 100 || input.length > 3000) throw new Error('Unexpected ship dataset size');
  const entries = [], seen = new Set();
  for (const item of input) {
    if (!item || typeof item.id !== 'string' || !/^\d+$/.test(item.id) ||
        typeof item.name !== 'string' || item.name.trim().length < 1 || item.name.length > 110) continue;
    const id = `lyc-${item.id}`;
    if (seen.has(id)) continue;
    seen.add(id);
    const hullName = String(item.hullType || '').trim();
    entries.push({ id, name:item.name.trim(), hull:HULLS[hullName] || 'OTHER',
      sourceHull:hullName, rarity:String(item.rarity || 'Unknown'),nation:nationForShip({sourceId:item.id}),tags:[],
      source:'lycoris', sourceId:item.id, verified:'sourced' });
  }
  if (entries.length < 100) throw new Error('No valid ship records');
  return entries;
}

export function normalizeEquipment(input) {
  if (!input || Array.isArray(input) || typeof input !== 'object') throw new Error('Equipment source is not an object');
  const entries=[];
  for (const [key,item] of Object.entries(input)) {
    if (!/^\d+$/.test(key) || !item || typeof item.name !== 'string' ||
        item.name.trim().length<2 || item.name.length > 160) continue;
    const stats = Object.entries(item.stats || {})
      .filter(([level,details])=> /^\d+$/.test(level) && details && typeof details==='object')
      .sort((a,b)=>Number(a[0])-Number(b[0]));
    const last = stats.at(-1);
    const numericStats={};
    if (last) {
      for (const field of ['air','antiaircraft','antisub','cannon','damage','dodge','durability','hit','luck','oxy_max','raid_distance','reload','speed','torpedo','anti_siren']) {
        const value = last[1][field];
        if ((typeof value === 'number' && Number.isFinite(value)) || (field==='damage' && typeof value==='string' && value.length<=45)) numericStats[field] = value;
      }
    }
    entries.push({id:`fer-${key}`,name:item.name.trim(),category:GEAR_TYPES[item.type]||`Other (type ${item.type ?? '?'})`,
      rarity:RARITIES[item.rarity]||'Unknown',rarityCode:item.rarity ?? null,
      typeCode:Number.isInteger(item.type)?item.type:null,
      equipLimit:Number.isSafeInteger(item.equip_limit)&&item.equip_limit>=0?item.equip_limit:null,
      nationalityCode:Number.isInteger(item.nationality)?item.nationality:null,
      nation:nationForEquipment({nationalityCode:item.nationality}),
      forbiddenHullIds:Array.isArray(item.ship_type_forbidden)?item.ship_type_forbidden.filter(v=>Number.isInteger(v)&&v>=1&&v<=255):[],
      source:'fernando',sourceId:key,verified:'sourced',summary:'',acquisition:'Not established by this dataset',
      stats:numericStats,enhancement:last?.[1]?.enhance || 'unknown',
      sourceUrl:'https://github.com/Fernando2603/AzurLane/blob/main/equipment.json'});
  }
  if (entries.length < 100 || entries.length > 5000) throw new Error('Unexpected equipment dataset size');
  return entries;
}

const normalKey=name=>String(name).toLocaleLowerCase().replace(/\s*\(retrofit\)/g,'').replace(/[^\p{L}\p{N}]/gu,'');
export function mergeShipCatalog(editorial,remote) {
  const original=editorial.map(s=>({...s,source:s.source||'editorial',rarity:s.rarity||'Unverified'}));
  const named=new Map(original.map((row,i)=>[normalKey(row.name),i]));
  const sourceIds=new Map(original.filter(row=>row.sourceId)
    .map(row=>[String(row.sourceId),original.indexOf(row)]));
  const claimed=new Set();
  const seenRemoteIds=new Set();
  for(const ship of remote){
    const sourceId=String(ship.sourceId||'');
    if(sourceId && seenRemoteIds.has(sourceId))continue;
    if(sourceId)seenRemoteIds.add(sourceId);
    // Source IDs are the ship identity. Two ships may legitimately have
    // identical names (Enterprise, Neptune, Fubuki, Kasumi, etc.).
    // A name match is only an editorial-to-source merge opportunity ONCE,
    // never permission to silently coalesce two distinct source records.
    const known=sourceId?sourceIds.get(sourceId):undefined;
    const namedIndex=named.get(normalKey(ship.name));
    const mergeByName=namedIndex!==undefined && !claimed.has(namedIndex) &&
      (!original[namedIndex].sourceId || String(original[namedIndex].sourceId)===sourceId);
    const index=known!==undefined?known:mergeByName?namedIndex:undefined;
    if(index!==undefined){
      claimed.add(index);
      original[index]={...original[index],rarity:ship.rarity,sourceHull:ship.sourceHull,
        nation:ship.nation,source:'lycoris',sourceId:ship.sourceId,verified:'sourced'};
    }else {
      const indexNew=original.length;
      original.push(ship);
      if(sourceId)sourceIds.set(sourceId,indexNew);
    }
  }
  return original;
}
export function mergeEquipmentCatalog(editorial,remote) {
  // Keep the hand-curated equipment entries for old bookmarks, but replace
  // descriptions with source records when names truly match.
  const original=editorial.map(e=>({...e,source:e.source||'editorial'}));
  const keys=new Map(original.map((x,i)=>[normalKey(x.name),i]));
  const claimed=new Set();
  for(const gear of remote) {
    const k=normalKey(gear.name);
    const i=keys.get(k);
    if(i!==undefined && !claimed.has(i)) {
      claimed.add(i);
      original[i]={...original[i],...gear,id:original[i].id,acquisition:original[i].acquisition||gear.acquisition};
    } else original.push(gear); // Preserve different rarity/upgrade variants.
  }
  return original;
}
export async function loadLiveCatalogs(fetcher=fetch) {
  const [ships,equipment,version] = await Promise.allSettled([
    fetchJson(fetcher,REMOTE_FEEDS.ships),
    fetchJson(fetcher,REMOTE_FEEDS.equipment),
    fetchJson(fetcher,REMOTE_FEEDS.shipVersion)
  ]);
  const result={ships:null,equipment:null,shipVersion:null,errors:[],checkedAt:new Date().toISOString()};
  if(ships.status==='fulfilled')try{result.ships=normalizeShips(ships.value)}catch(error){result.errors.push(`Ships: ${error.message}`)}
  else result.errors.push(`Ships: ${ships.reason?.message||'unavailable'}`);
  if(equipment.status==='fulfilled')try{result.equipment=normalizeEquipment(equipment.value)}catch(error){result.errors.push(`Equipment: ${error.message}`)}
  else result.errors.push(`Equipment: ${equipment.reason?.message||'unavailable'}`);
  if(version.status==='fulfilled' && typeof version.value?.generatedAt==='string') result.shipVersion=version.value.generatedAt;
  return result;
}

// The complete source is ~5 MB and must NOT block the initial Ship Index.
// Fetch once per session only when a user opens a ship profile.
export const FULL_SHIP_FEED = 'https://raw.githubusercontent.com/iujab/Lycoris-AzurAPI/main/data/ships.json';
let detailedShipCache = null;
let detailedShipPending = null;
export async function loadDetailedShips(fetcher = fetch) {
  if (fetcher === fetch && detailedShipCache) return detailedShipCache;
  if (fetcher === fetch && detailedShipPending) return detailedShipPending;
  const load = async () => {
    const payload = await fetchJson(fetcher,FULL_SHIP_FEED,{timeoutMs:30000});
    if (!payload || typeof payload !== 'object' || Array.isArray(payload) ||
        Object.keys(payload).length < 100 || Object.keys(payload).length > 3000)
      throw new Error('Invalid full ship dataset');
    return payload;
  };
  if (fetcher !== fetch) return load();
  detailedShipPending = load();
  try {
    detailedShipCache = await detailedShipPending;
    return detailedShipCache;
  } finally {
    detailedShipPending = null;
  }
}
