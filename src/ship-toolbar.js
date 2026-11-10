import { SHIP_HULL_GROUPS, SHIP_RARITIES, SHIP_SORTS } from './ship-factions.js';

const E=value=>String(value??'').replace(/[&<>"']/g,c=>
  ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const choice=(value,label,selected)=>'<option value="'+E(value)+'"'+(value===selected?' selected':'')+'>'+E(label)+'</option>';

export function renderShipFilterToolbar({rows=[],query='',hull='all',rarity='all',
  sort='rarity',descending=true,open=false}={}) {
  const rawHulls=[...new Set(rows.map(x=>x.hull).filter(Boolean))].sort();
  const allowedHulls=['Vanguard','Main','Sub','DD','CL','CA','CB','BB','BC',
    'BBV','BM','CV','CVL','AR','AE','SS','SSV','Misc'];
  const hulls=allowedHulls.filter(name=>SHIP_HULL_GROUPS[name]||rawHulls.includes(name));
  // Preserve any source-defined hull that is not yet in the standard labels.
  for(const name of rawHulls)if(!hulls.includes(name))hulls.push(name);
  const quick=['all','Vanguard','Main','Sub'].filter(name=>name==='all'||SHIP_HULL_GROUPS[name]);
  const active=[...(hull!=='all'?[['hull','Hull',hull]]:[]),
    ...(rarity!=='all'?[['rarity','Rarity',rarity==='Normal'?'Common':rarity]]:[])];
  const chip=([field,label,value])=>'<button type="button" class="equipment-active-chip" data-action="ship-clear-filter"'+
    ' data-field="'+E(field)+'" aria-label="Remove '+E(label)+' filter">'+E(label)+': '+
    E(value)+' <span aria-hidden="true">×</span></button>';
  return '<div class="equipment-compact-toolbar ship-compact-toolbar">'+
    '<div class="equipment-search-row"><label class="search-wrap"><span aria-hidden="true">⌕</span>'+
      '<input id="catalog-search" type="search" value="'+E(query)+'" placeholder="Find a ship…"'+
      ' aria-label="Search ships" autocomplete="off"></label>'+
      '<button type="button" class="equipment-advanced-toggle outline-btn compact'+
      (active.length?' has-active-filters':'')+'" data-action="ship-toggle-filters"'+
      ' aria-expanded="'+Boolean(open)+'" aria-controls="ship-advanced-filters">⚙ Filters'+
      (active.length?' <span class="equipment-filter-count">'+active.length+'</span>':'')+
      '</button></div>'+
    '<div class="equipment-sort-bar">'+
      '<label class="equipment-filter-field"><span>Sort</span><select id="ship-sort-select" aria-label="Sort ships">'+
        SHIP_SORTS.map(value=>choice(value,value.charAt(0).toUpperCase()+value.slice(1),sort)).join('')+
      '</select></label>'+
      '<button type="button" class="equipment-direction-btn outline-btn compact"'+
        ' data-action="ship-sort-direction" aria-label="Reverse ship sorting direction">'+
        (descending?'↓ Descending':'↑ Ascending')+'</button>'+
    '</div></div>'+
    '<div class="equipment-quick-categories ship-quick-categories" role="group" aria-label="Browse ship hull groups">'+
      quick.map(name=>'<button type="button" class="equipment-category-tab'+(hull===name?' active':'')+
        '" data-action="ship-hull-filter" data-hull="'+E(name)+'" aria-pressed="'+(hull===name)+'">'+
        E(name==='all'?'All ships':name)+'</button>').join('')+'</div>'+
    '<section id="ship-advanced-filters" class="equipment-advanced-panel" aria-label="Advanced ship filters"'+(open?'':' hidden')+'>'+
      '<label class="equipment-filter-field"><span>Hull classification</span><select id="ship-hull-select" aria-label="Ship hull classification">'+
        choice('all','All hulls',hull)+hulls.map(name=>choice(name,name,hull)).join('')+'</select></label>'+
      '<label class="equipment-filter-field"><span>Rarity</span><select id="ship-rarity-select" aria-label="Ship rarity">'+
        SHIP_RARITIES.map(value=>choice(value,value==='all'?'All rarities':value==='Normal'?'Common':value,rarity)).join('')+
      '</select></label>'+
      '<div class="equipment-filter-actions"><button type="button" class="outline-btn compact" data-action="ship-reset-filters">'+
        'Clear filters</button><button type="button" class="outline-btn compact" data-action="ship-toggle-filters">Done</button></div>'+
    '</section>'+
    (active.length?'<div class="equipment-active-filters" role="group" aria-label="Active ship filters">'+
      active.map(chip).join('')+
      '<button type="button" class="equipment-clear-all" data-action="ship-reset-filters">Clear filters</button></div>':'');
}
