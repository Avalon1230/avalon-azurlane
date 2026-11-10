import { MODES, FLEET_BLUEPRINTS, SLOT_LAYOUTS, SHIPS } from './catalog.js';

export const MAIN_HULLS = new Set(['BB', 'BC', 'BBV', 'BM', 'CV', 'CVL', 'AR', 'AE']);
export const VANGUARD_HULLS = new Set(['DD', 'CL', 'CA', 'CB']);
export const SUB_HULLS = new Set(['SS', 'SSV']);
export const CARRIER_HULLS = new Set(['CV', 'CVL']);
export const MODE_IDS = new Set(MODES.map(m => m.id));
export const SHIP_MAP = new Map(SHIPS.map(ship => [ship.id, ship]));

export function refreshShipIndex(ships) {
  SHIP_MAP.clear();
  for (const ship of ships) SHIP_MAP.set(ship.id, ship);
}

export function compatible(ship, kind) {
  if (!ship) return false;
  if (kind === 'main') return MAIN_HULLS.has(ship.hull);
  if (kind === 'vanguard') return VANGUARD_HULLS.has(ship.hull);
  if (kind === 'carrier') return CARRIER_HULLS.has(ship.hull);
  if (kind === 'sub') return SUB_HULLS.has(ship.hull);
  return false;
}

export function slotsForFleet(fleetId) {
  const blueprint = FLEET_BLUEPRINTS[fleetId];
  if (!blueprint) throw new Error('Unknown fleet');
  return SLOT_LAYOUTS[blueprint.type];
}

export function createWorkspace(modeId) {
  const mode = MODES.find(entry => entry.id === modeId);
  if (!mode) throw new Error('Unknown game mode');
  return {
    modeId,
    fleets: Object.fromEntries(mode.fleetTypes.map(id => [id, Object.fromEntries(slotsForFleet(id).map(slot => [slot.id, null]))]))
  };
}

export function assignShip(workspace, fleetId, slotId, shipId) {
  if (!MODE_IDS.has(workspace?.modeId)) throw new Error('Invalid workspace');
  const mode = MODES.find(x => x.id === workspace.modeId);
  if (!mode.fleetTypes.includes(fleetId)) throw new Error('Fleet does not belong to this mode');
  const slot = slotsForFleet(fleetId).find(x => x.id === slotId);
  if (!slot) throw new Error('Unknown slot');
  if (shipId !== null && !SHIP_MAP.has(shipId)) throw new Error('Unknown ship');
  if (shipId !== null && !compatible(SHIP_MAP.get(shipId), slot.kind)) throw new Error('Ship hull is incompatible with this slot');
  const next = structuredClone(workspace);
  if (shipId !== null) {
    for (const id of mode.fleetTypes) {
      for (const [position, assigned] of Object.entries(next.fleets[id])) {
        if (assigned === shipId && !(id === fleetId && position === slotId)) throw new Error('This ship is already assigned in this plan');
      }
    }
  }
  next.fleets[fleetId][slotId] = shipId;
  return next;
}

export function normalizeWorkspace(data, modeId) {
  const clean = createWorkspace(modeId);
  if (!data || typeof data !== 'object' || !data.fleets) return clean;
  for (const [fleetId, slots] of Object.entries(clean.fleets)) {
    for (const slotId of Object.keys(slots)) {
      const shipId = data.fleets?.[fleetId]?.[slotId];
      if (!SHIP_MAP.has(shipId)) continue;
      try { Object.assign(clean, assignShip(clean, fleetId, slotId, shipId)); } catch { /* ignore invalid/stale assignments */ }
    }
  }
  return clean;
}

export function countAssigned(workspace) {
  return Object.values(workspace.fleets).reduce((total, fleet) => total + Object.values(fleet).filter(Boolean).length, 0);
}

export function findFirstVacancy(workspace, ship) {
  const mode = MODES.find(x => x.id === workspace.modeId);
  const alreadyPresent = Object.values(workspace.fleets).some(fleet => Object.values(fleet).includes(ship.id));
  if (alreadyPresent) return null;
  for (const fleetId of mode.fleetTypes) {
    for (const slot of slotsForFleet(fleetId)) {
      if (compatible(ship, slot.kind) && !workspace.fleets[fleetId][slot.id]) return { fleetId, slotId: slot.id };
    }
  }
  return null;
}

export function wikiLookupUrl(name) {
  return 'https://azur-lane.wiki/index.php?search=' + encodeURIComponent(name);
}

export function searchCatalog(records, query, fields) {
  const needle = query.trim().toLocaleLowerCase();
  if (!needle) return records;
  return records.filter(item => fields.some(field => {
    const value = item[field];
    return (Array.isArray(value) ? value.join(' ') : String(value || '')).toLocaleLowerCase().includes(needle);
  }));
}

export function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
}