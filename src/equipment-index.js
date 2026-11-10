import { filterEquipmentRecords, nationCounts, possibleEquipmentHulls } from './catalog-filters.js';
import { EQUIPMENT_RARITIES, EQUIPMENT_SORTS, renderEquipmentFamilyTile } from './equipment-roster.js';
import { EQUIPMENT_BROAD_TYPES, EQUIPMENT_GROUP_MODES, groupedEquipmentUnits, matchesEquipmentBroadType } from './equipment-browse.js';

const E=value=>String(value??'').replace(/[&<>"']/g,c=>
  ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const choice=(value,label,selected)=>'<option value="'+E(value)+'"'+(selected===value?' selected':'')+'>'+E(label)+'</option>';
const groupName=id=>EQUIPMENT_GROUP_MODES.find(x=>x.value===id)?.label||'Type';

function selectRow(id,label,options,selected) {
  return '<label class="equipment-filter-field"><span>'+E(label)+'</span>'+
    '<select id="'+E(id)+'" aria-label="'+E(label)+'">'+options.map(([value,name])=>choice(value,name,selected)).join('')+'</select></label>';
}
function activeChip(label,field,value) {
  return '<button type="button" class="equipment-active-chip" data-action="equipment-clear-filter" data-field="'+
    E(field)+'" aria-label="Remove '+E(label)+' filter">'+E(label)+': '+E(value)+' <span aria-hidden="true">×</span></button>';
}

export function renderEquipmentIndex({records,query='',nation='all',hull='all',
  category='all',rarity='all',broadType='all',group='type',sort='rarity',descending=true,
  advancedOpen=false,equipmentLimit=60,renderCard}) {
  if(!Array.isArray(records)||typeof renderCard!=='function')throw new Error('Invalid catalog data');
  const safeBroad=EQUIPMENT_BROAD_TYPES.some(x=>x.id===broadType)?broadType:'all';
  const safeGroup=EQUIPMENT_GROUP_MODES.some(x=>x.value===group)?group:'type';
  const filtered=filterEquipmentRecords(records,{query,nation,hull,category,rarity})
    .filter(row=>matchesEquipmentBroadType(row,safeBroad));
  const grouped=groupedEquipmentUnits(filtered,{group:safeGroup,sort,descending});
  const totalEntries=grouped.reduce((n,bucket)=>n+bucket.items.length,0);
  let remaining=Math.max(60,Math.trunc(Number(equipmentLimit)||60));
  let shown=0;
  const sections=grouped.map(bucket=>{
    const selected=bucket.items.slice(0,remaining);
    remaining-=selected.length;
    if(!selected.length)return '';
    shown+=selected.length;
    const cards=selected.map(unit=>
      unit.kind==='family'?renderEquipmentFamilyTile(unit):renderCard(unit.item)).join('');
    const heading=safeGroup==='none'?'':(
      '<div class="nation-section-title"><h2>'+E(bucket.label)+'</h2><span>'+
      selected.length+' shown · '+bucket.items.length+' matches</span></div>');
    return '<section class="nation-result-group equipment-result-group" aria-label="'+E(bucket.label)+'">'+heading+
      '<div class="equipment-gallery">'+cards+'</div></section>';
  }).join('');
  const nations=nationCounts(records,'equipment').map(({nation})=>[nation,nation]);
  const hulls=[...new Set(records.flatMap(possibleEquipmentHulls))].sort().map(x=>[x,x]);
  const categories=[...new Set(records.filter(x=>matchesEquipmentBroadType(x,safeBroad))
    .map(x=>x.category).filter(Boolean))].sort().map(x=>[x,x]);
  const count=[nation!=='all',hull!=='all',rarity!=='all',category!=='all'].filter(Boolean).length;
  const chips=[
    ...(nation!=='all'?[activeChip('Nation','nation',nation)]:[]),
    ...(hull!=='all'?[activeChip('Hull','hull',hull)]:[]),
    ...(rarity!=='all'?[activeChip('Rarity','rarity',rarity==='Normal'?'Common':rarity)]:[]),
    ...(category!=='all'?[activeChip('Type','category',category)]:[])
  ].join('');
  const quickTabs=EQUIPMENT_BROAD_TYPES.map(({id,label})=>
    '<button type="button" class="equipment-category-tab'+(safeBroad===id?' active':'')+
    '" data-action="equipment-broad-type" data-broad="'+E(id)+'" aria-pressed="'+(safeBroad===id)+'">'+
    E(label)+'</button>').join('');
  const advanced=
    '<section class="equipment-advanced-panel" id="equipment-advanced-filters" aria-label="Advanced equipment filters"'+
    (advancedOpen?'':' hidden')+'>'+
    selectRow('equipment-nation-select','Nation of origin',[['all','All nations'],...nations],nation)+
    selectRow('equipment-hull-select','Potentially compatible hull',[['all','All hulls'],...hulls],hull)+
    selectRow('equipment-rarity-select','Rarity',[['all','All rarities'],...EQUIPMENT_RARITIES.filter(x=>x!=='all').map(x=>[x,x==='Normal'?'Common':x])],rarity)+
    selectRow('equipment-subtype-select','Specific equipment type',[['all','All types'],...categories],category)+
    '<div class="equipment-filter-actions"><button type="button" class="outline-btn compact" data-action="equipment-reset-filters">Clear all filters</button>'+
    '<button type="button" class="outline-btn compact" data-action="equipment-toggle-filters">Done</button></div>'+
    '</section>';
  const familyMode=safeGroup==='families';
  const countText=familyMode
    ? 'Showing '+shown.toLocaleString()+' of '+totalEntries.toLocaleString()+
      ' equipment entries · '+filtered.length.toLocaleString()+' matching records · '+records.length.toLocaleString()+' total'
    : 'Showing '+shown.toLocaleString()+' of '+totalEntries.toLocaleString()+
      ' matching equipment · '+records.length.toLocaleString()+' total';
  const status=familyMode?'Exact-name source records only; no upgrade path inferred.'
    :safeGroup==='none'?'Sorted globally by '+sort+'.'
    :'Sorted by '+sort+' within each '+groupName(safeGroup).toLowerCase()+' group.';
  return '<div id="catalog-start" class="equipment-index">'+
    '<div class="equipment-compact-toolbar">'+
      '<div class="equipment-search-row"><label class="search-wrap"><span aria-hidden="true">⌕</span>'+
      '<input id="catalog-search" type="search" value="'+E(query)+'" placeholder="Search equipment, effects, names…" aria-label="Search all equipment" autocomplete="off"></label>'+
      '<button type="button" class="equipment-advanced-toggle outline-btn compact'+(count?' has-active-filters':'')+
      '" data-action="equipment-toggle-filters" aria-expanded="'+Boolean(advancedOpen)+'" aria-controls="equipment-advanced-filters">'+
      '⚙ Filters'+(count?' <span class="equipment-filter-count">'+count+'</span>':'')+'</button></div>'+
      '<div class="equipment-sort-bar">'+
      selectRow('equipment-sort-select','Sort',EQUIPMENT_SORTS.map(x=>[x,x==='rarity'?'Rarity':x==='name'?'Name':'Type']),sort)+
      '<button type="button" class="equipment-direction-btn outline-btn compact" data-action="equipment-sort-direction" aria-label="Reverse equipment sorting direction">'+
        (descending?'↓ Descending':'↑ Ascending')+'</button>'+
      selectRow('equipment-group-select','Group',EQUIPMENT_GROUP_MODES.map(x=>[x.value,x.label]),safeGroup)+
      '</div></div>'+
    '<div class="equipment-quick-categories" role="group" aria-label="Browse equipment categories">'+quickTabs+'</div>'+
    advanced+
    (chips?'<div class="equipment-active-filters" role="group" aria-label="Active filters">'+chips+
      '<button type="button" class="equipment-clear-all" data-action="equipment-reset-filters">Clear filters</button></div>':'')+
    '<div class="catalog-result-bar equipment-result-summary" aria-live="polite"><span>'+E(countText)+
      '</span><span>'+E(status)+'</span></div>'+
    (sections||'<div class="empty">No equipment matches these filters. Try another category, nation, or search.</div>')+
    (shown<totalEntries?'<div class="ship-scroll-sentinel" data-equipment-scroll-sentinel><span>'+
      E((totalEntries-shown).toLocaleString())+' entries remaining</span>'+
      '<button type="button" class="outline-btn compact" data-action="equipment-load-more">Load more equipment</button></div>':'')+
    '</div>';
}
