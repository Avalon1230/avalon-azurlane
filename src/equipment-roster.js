import { imageMarkup } from './media.js';

const E=value=>String(value??'').replace(/[&<>"']/g,c=>(
  {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]
));
export const EQUIPMENT_SORTS=Object.freeze(['rarity','name','type']);
export const EQUIPMENT_RARITIES=Object.freeze(['all','Ultra Rare','Super Rare','Elite','Rare','Normal']);
const RARITY_ORDER=Object.freeze({'Ultra Rare':5,'Super Rare':4,'Elite':3,'Rare':2,'Normal':1});
const RARITY_CLASS=Object.freeze({'Ultra Rare':'ultra-rare','Super Rare':'super-rare',
  'Elite':'elite','Rare':'rare','Normal':'normal'});

export function sortEquipmentRows(rows,sort='rarity',descending=true) {
  const field=EQUIPMENT_SORTS.includes(sort)?sort:'rarity';
  return rows.slice().sort((a,b)=>{
    let difference=0;
    if(field==='rarity')difference=(RARITY_ORDER[a.rarity]||0)-(RARITY_ORDER[b.rarity]||0);
    else if(field==='type')difference=String(a.category||'').localeCompare(String(b.category||''));
    else difference=String(a.name||'').localeCompare(String(b.name||''));
    if(difference)return descending?-difference:difference;
    return String(a.name||'').localeCompare(String(b.name||'')) ||
      String(a.sourceId||a.id).localeCompare(String(b.sourceId||b.id));
  });
}
export function renderEquipmentRosterTile(item) {
  const rarity=RARITY_CLASS[item.rarity]||'unknown';
  const name=item.name||'Unknown equipment';
  const category=item.category||'Unclassified';
  return '<button type="button" class="equipment-roster-tile rarity-'+rarity+
    '" data-action="equip-details" data-equip="'+E(item.id)+'" aria-label="Inspect '+E(name)+' equipment">'+
    '<span class="equipment-roster-name">'+E(name)+'</span>'+
    '<span class="equipment-roster-art">'+imageMarkup(item,'equipment','asset-roster-equipment')+'</span>'+
    '<span class="equipment-roster-footer"><span>'+E(category)+'</span><span aria-hidden="true">↗</span></span>'+
    '</button>';
}

/**
 * Family browsing is intentionally conservative: callers group only source
 * records with identical normalized names, type and nation. This is not an
 * upgrade-tree declaration, skill match, or performance assessment.
 */
export function renderEquipmentFamilyTile(unit) {
  const {item,members}=unit;
  if(!members||members.length<2)return renderEquipmentRosterTile(item);
  const rarity=RARITY_CLASS[item.rarity]||'unknown';
  const name=item.name||'Unknown equipment';
  return '<button type="button" class="equipment-roster-tile equipment-family-tile rarity-'+rarity+
    '" data-action="equipment-family-open" data-family-id="'+E(item.id)+'"'+
    ' aria-label="View '+members.length+' sourced variants of '+E(name)+'">'+
    '<span class="equipment-roster-name">'+E(name)+'</span>'+
    '<span class="equipment-roster-art">'+imageMarkup(item,'equipment','asset-roster-equipment')+'</span>'+
    '<span class="equipment-roster-footer"><span>'+E(item.category||'Equipment')+'</span><strong>'+
       members.length+' variants</strong></span></button>';
}
export function renderEquipmentFamilyDetails(members) {
  if(!Array.isArray(members)||members.length<2)return '';
  const name=members[0].name||'Equipment';
  return '<div class="picker-backdrop detail-backdrop" data-action="close-detail">'+
    '<aside class="picker-panel detail-panel" role="dialog" aria-modal="true" aria-label="Variants of '+E(name)+'">'+
    '<div class="picker-head"><div><span class="eyebrow">EQUIPMENT VARIANTS</span><h2>'+E(name)+'</h2></div>'+
    '<button class="icon-btn" type="button" data-action="close-detail" aria-label="Close equipment variants">✕</button></div>'+
    '<div class="detail-scroll"><p class="equipment-family-notice">These records share the exact original name, equipment type and nation. Their stats and rarities may differ. This does <strong>not</strong> establish an upgrade path or equal performance.</p>'+
    '<div class="equipment-family-variants">'+members.map(item=>
      '<button type="button" class="equipment-family-variant" data-action="equip-details" data-equip="'+E(item.id)+'">'+
      imageMarkup(item,'equipment','asset-picker')+
      '<span><strong>'+E(item.name)+'</strong><small>'+E(item.rarity||'Unverified')+' · Source ID '+E(item.sourceId||'Unknown')+'</small></span>'+
      '<span aria-hidden="true">↗</span></button>').join('')+'</div></div>'+
    '<div class="picker-footer"><button type="button" class="ghost-btn" data-action="close-detail">Close</button></div>'+
    '</aside></div>';
}
