import { fetchJson } from './remote.js';

/**
 * Optional acquisition lookup, loaded only after an equipment dossier opens.
 * Dated snapshot, not proof that a drop, event, or shop is currently available.
 * IDs match the community game-client equipment IDs used by AVALON, but entries
 * absent from this snapshot must remain explicitly unverified.
 */
export const EQUIPMENT_DROPS_URL =
  'https://raw.githubusercontent.com/Linuxxy0/AzurLaneData-2026-5-2-16-08-11/main/data/equip_drops.json';
export const EQUIPMENT_DROPS_SOURCE =
  'https://github.com/Linuxxy0/AzurLaneData-2026-5-2-16-08-11/blob/main/data/equip_drops.json';
export const EQUIPMENT_DROPS_DATE = 'May 2, 2026';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>
  ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const validId=id=>/^\d{2,8}$/.test(String(id??''));

export function parseEquipmentDrops(input) {
  if(!input||Array.isArray(input)||typeof input!=='object')
    throw new Error('Unexpected equipment acquisition source');
  if(Object.keys(input).length<100||Object.keys(input).length>5000)
    throw new Error('Unexpected equipment acquisition dataset size');
  const index=new Map();
  for(const [id,entry] of Object.entries(input)) {
    if(!validId(id)||!entry||Number(entry.id)!==Number(id)||!Array.isArray(entry.locations))continue;
    const locations=[...new Set(entry.locations
      .filter(v=>typeof v==='string'&&v.length>0&&v.length<=140)
      .map(v=>v.trim()).filter(Boolean))].slice(0,40);
    const labFrom=Array.isArray(entry.lab_from)?entry.lab_from:[];
    const craftable=labFrom.includes(Number(id));
    index.set(id,{locations,craftable,sourceId:id});
  }
  if(index.size<100)throw new Error('No reliable acquisition records found');
  return index;
}
export async function loadEquipmentDrops(fetcher=fetch) {
  const raw=await fetchJson(fetcher,EQUIPMENT_DROPS_URL,{timeoutMs:13000});
  return parseEquipmentDrops(raw);
}
export function equipmentAcquisitionFor(record,index) {
  if(!(index instanceof Map)||record?.source!=='fernando')return null;
  const id=String(record.sourceId||'');
  return validId(id)?index.get(id)||null:null;
}
export function renderEquipmentAcquisition(record,{status='idle',index=null,error=''}={}) {
  const match=status==='ready'?equipmentAcquisitionFor(record,index):null;
  const hasSources=match&&(match.locations.length||match.craftable);
  let body='';
  if(status==='loading'||status==='idle')
    body='<p class="equipment-acquisition-muted" role="status">Checking where to get this gear…</p>';
  else if(status==='error')
    body='<p class="equipment-acquisition-muted" role="status">The drop-data source could not load. You can still check the wiki for this gear.</p>'+
      '<button type="button" class="outline-btn compact" data-action="equipment-acquisition-retry">Try again</button>';
  else if(hasSources)
    body=(match.locations.length?'<ul class="equipment-acquisition-list">'+
      match.locations.map(source=>'<li>'+esc(source)+'</li>').join('')+'</ul>':'')+
      (match.craftable?'<p class="equipment-acquisition-craft">Gear Lab: crafting recipe recorded in this snapshot.</p>':'');
  else
    body='<p class="equipment-acquisition-muted">This snapshot has no confirmed location for this gear. It may still be obtainable; check current events, shops or the wiki.</p>';

  return '<section class="equipment-acquisition-panel" aria-label="Where to obtain equipment">'+
    '<h3>Where to obtain</h3>'+body+
    '<p class="equipment-acquisition-provenance">Source: <a class="text-link" href="'+EQUIPMENT_DROPS_SOURCE+
      '" target="_blank" rel="noopener noreferrer">Community equipment-drop data</a> · '+esc(EQUIPMENT_DROPS_DATE)+
      ' snapshot. Event and shop availability can change by server. Confirm before farming.</p>'+
    '</section>';
}
