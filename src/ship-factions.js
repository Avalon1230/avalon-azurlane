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

const mainSet = new Set(MAIN_SHIP_FACTIONS);
const collabSet = new Set(COLLABORATION_NATIONS);
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
export function filterShipBrowseRows(rows, { query = '', nation = 'all', hull = 'all' } = {}) {
  const hullMatched = filterShipRecords(rows, { hull });
  const term = String(query).trim().toLocaleLowerCase();
  const sourceMatches = term
    ? new Set(filterShipRecords(hullMatched, { query }).map(ship => ship))
    : null;
  return hullMatched.filter(ship => {
    const group = shipBrowseNation(ship);
    if (nation !== 'all' && nation !== group) return false;
    return !term || sourceMatches.has(ship) || group.toLocaleLowerCase().includes(term);
  });
}

export function groupedShipBrowseRows(rows) {
  const groups = new Map();
  for (const ship of rows) {
    const group = shipBrowseNation(ship);
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(ship);
  }
  return [...groups].sort(([a], [b]) => compareShipBrowseNations(a, b))
    .map(([nation, items]) => ({
      nation,
      items: items.slice().sort((a, b) => a.name.localeCompare(b.name) ||
        String(a.id).localeCompare(String(b.id)))
    }));
}

export function shipBrowseDisplayNation(record) {
  const group = shipBrowseNation(record);
  const source = nationForShip(record);
  return group === COLLAB_BROWSE_NATION ? 'Collab · ' + source : group;
}
