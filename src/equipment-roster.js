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
