/**
 * AVALON Ship Index browsing taxonomy.
 * Original source nationality is never rewritten: the index groups named
 * crossover franchises under Collab and renames the Universal utility group
 * to Bulins for navigation only.
 */
import { NATION_ORDER, nationForShip, filterShipRecords, UNKNOWN_NATION } from './catalog-filters.js';

export const BULIN_BROWSE_NATION = 'Bulins';
export const COLLAB_BROWSE_NATION = 'Collab';
export const MAIN_SHIP_FACTIONS = Object.freeze(
  NATION_ORDER.filter(name => name !== 'META' && name !== 'Universal')
);
// Known crossover nationalities from source ship IDs, including names in
// earlier Fernando nationality.json datasets. Unknown factions remain separate
// rather than accidentally being classified as collaborations.
export const COLLABORATION_NATIONS = Object.freeze([
  'Atelier Ryza', 'Atelier Yumia', 'Bilibili', 'Black Rock Shooter',
  'DanMachi', 'Date A Live', 'Hololive', 'Kizuna AI', 'KizunaAI',
  'Neptunia', 'NieR:Automata', 'Senran Kagura', 'SSSS',
  'The Idolmaster', 'To LOVE-Ru', 'Utawarerumono', 'Venus Vacation',
  'Collab'
]);


export const SHIP_HULL_GROUPS = Object.freeze({
  Vanguard: ['DD','CL','CA','CB'],
  Main: ['BB','BC','BBV','BM','CV','CVL','AR','AE'],
  Sub: ['SS','SSV'],
  Misc: ['IX','OTHER']
});
export const SHIP_SORTS = Object.freeze(['name','rarity','hull']);
export const SHIP_RARITIES = Object.freeze(['all','Normal','Rare','Elite','Super Rare','Ultra Rare']);
const RARITY_ORDER = Object.freeze({
  'Normal':1,'Rare':2,'Elite':3,'Super Rare':4,'Priority':4,
  'Ultra Rare':5,'Decisive':5
});
export function sortShipBrowseRows(rows, sort='name', descending=false) {
  const field=SHIP_SORTS.includes(sort)?sort:'name';
  const compare = (a,b) => {
    if(field==='rarity') return (RARITY_ORDER[a.rarity]||0)-(RARITY_ORDER[b.rarity]||0);
    return String(field==='hull'?a.hull:a.name||'').localeCompare(String(field==='hull'?b.hull:b.name||''));
  };
  return rows.slice().sort((a,b)=> {
    const difference=compare(a,b);
    return difference ? (descending?-difference:difference) :
      String(a.name||'').localeCompare(String(b.name||'')) ||
      String(a.sourceId||a.id).localeCompare(String(b.sourceId||b.id));
  });
}

const mainSet = new Set(MAIN_SHIP_FACTIONS);
const collabSet = new Set(COLLABORATION_NATIONS);
const COLLAB_SERIES_ALIASES = Object.freeze({
  'KizunaAI':'Kizuna AI',
  'Collab':'Other collaborations'
});
export function shipCollabSeries(record){
  const source=nationForShip(record);
  return collabSet.has(source)?(COLLAB_SERIES_ALIASES[source]||source):null;
}
export function shipCollabSeriesCounts(rows){
  const groups=new Map();
  for(const ship of rows){
    const series=shipCollabSeries(ship);
    if(!series)continue;
    if(!groups.has(series))groups.set(series,{series,count:0,ship});
    const group=groups.get(series);
    group.count++;
    // Choose a deterministic recognizable representative even if source ordering changes.
    if(String(ship.name||'').localeCompare(String(group.ship.name||''))<0)group.ship=ship;
  }
  return [...groups.values()].sort((a,b)=>a.series.localeCompare(b.series));
}

const browseOrder = [
  ...MAIN_SHIP_FACTIONS,
  'META',
  BULIN_BROWSE_NATION,
  COLLAB_BROWSE_NATION
];

export function shipBrowseNation(record) {
  const source = nationForShip(record);
  if (source === 'Universal') return BULIN_BROWSE_NATION;
  if (collabSet.has(source)) return COLLAB_BROWSE_NATION;
  return source;
}

export function compareShipBrowseNations(a, b) {
  const ia = browseOrder.indexOf(a), ib = browseOrder.indexOf(b);
  if (ia !== -1 && ib !== -1) return ia - ib;
  if (ia !== -1) return -1;
  if (ib !== -1) return 1;
  if (a === UNKNOWN_NATION) return 1;
  if (b === UNKNOWN_NATION) return -1;
  return a.localeCompare(b);
}

export function shipBrowseCounts(rows) {
  const counts = new Map();
  for (const ship of rows) {
    const nation = shipBrowseNation(ship);
    counts.set(nation, (counts.get(nation) || 0) + 1);
  }
  return [...counts].sort(([a], [b]) => compareShipBrowseNations(a, b))
    .map(([nation, count]) => ({ nation, count }));
}

/**
 * Search both raw nationality names and AVALON group labels while retaining
 * existing name, hull, and rarity search behavior from catalog-filters.js.
 */
export function filterShipBrowseRows(rows, { query = '', nation = 'all', collabSeries = 'all', hull = 'all', rarity = 'all' } = {}) {
  const hullMatched = SHIP_HULL_GROUPS[hull]
    ? filterShipRecords(rows).filter(ship=>SHIP_HULL_GROUPS[hull].includes(ship.hull))
    : filterShipRecords(rows,{hull});
  const term = String(query).trim().toLocaleLowerCase();
  const sourceMatches = term
    ? new Set(filterShipRecords(hullMatched, { query }).map(ship => ship))
    : null;
  return hullMatched.filter(ship => {
    const group = shipBrowseNation(ship);
    if (nation !== 'all' && nation !== group) return false;
    if (nation === COLLAB_BROWSE_NATION && collabSeries !== 'all' && shipCollabSeries(ship) !== collabSeries) return false;
    if (rarity !== 'all') {
      const actual=ship.rarity==='Decisive'?'Ultra Rare':ship.rarity==='Priority'?'Super Rare':ship.rarity;
      if(actual!==rarity) return false;
    }
    return !term || sourceMatches.has(ship) || group.toLocaleLowerCase().includes(term) ||
      shipCollabSeries(ship)?.toLocaleLowerCase().includes(term);
  });
}

export function groupedShipBrowseRows(rows, sort='name', descending=false) {
  const groups = new Map();
  for (const ship of rows) {
    const group = shipBrowseNation(ship);
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(ship);
  }
  return [...groups].sort(([a], [b]) => compareShipBrowseNations(a, b))
    .map(([nation, items]) => ({
      nation,
      items: sortShipBrowseRows(items,sort,descending)
    }));
}

export function shipBrowseDisplayNation(record) {
  const group = shipBrowseNation(record);
  const source = nationForShip(record);
  return group === COLLAB_BROWSE_NATION ? 'Collab · ' + shipCollabSeries(record) : group;
}
