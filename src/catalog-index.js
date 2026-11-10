import { nationEmblemMarkup } from './nation-emblems.js';
import { EQUIPMENT_SORTS, EQUIPMENT_RARITIES, sortEquipmentRows } from './equipment-roster.js';
import { MAIN_SHIP_FACTIONS, SHIP_SORTS, SHIP_RARITIES, SHIP_HULL_GROUPS, shipBrowseCounts, filterShipBrowseRows, groupedShipBrowseRows } from './ship-factions.js';
import { filterEquipmentRecords, nationCounts, groupedCatalogRows, paginateRecords, possibleEquipmentHulls, UNKNOWN_NATION } from './catalog-filters.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const E=esc;
export const SHIP_ROSTER_BATCH_SIZE = 60;
export const EQUIPMENT_ROSTER_BATCH_SIZE = 60;

function option(value,label,active){
  return '<option value="'+E(value)+'"'+(active===value?' selected':'')+'>'+E(label)+'</option>';
}
function nationStrip(kind,facets,active){
  const full=facets.reduce((sum,x)=>sum+x.count,0);
  const entries=[{nation:'all',count:full},...facets];
  return '<div class="nation-strip" role="group" aria-label="Filter by nation of origin">'+entries.map(({nation,count})=>
    '<button type="button" class="nation-chip'+(active===nation?' active':'')+'" data-action="catalog-nation" data-kind="'+E(kind)+'" data-nation="'+E(nation)+'" aria-pressed="'+(active===nation)+'">'+E(nation==='all'?'All nations':nation)+' <span>'+count.toLocaleString()+'</span></button>'
  ).join('')+'</div>';
}

function shipNationLanding(records) {
  const nations = shipBrowseCounts(records);
  const total = nations.reduce((sum, item) => sum + item.count, 0);
  const main = nations.filter(item => MAIN_SHIP_FACTIONS.includes(item.nation));
  const special = nations.filter(item => !MAIN_SHIP_FACTIONS.includes(item.nation));
  const cards = rows => rows.map(({nation, count}) =>
    '<button type="button" class="nation-card" data-action="catalog-nation" data-kind="ships" data-nation="' +
    E(nation) + '">' + nationEmblemMarkup(nation) +
    '<span class="nation-card-copy"><strong>' + E(nation) +
    '</strong><span>' + count.toLocaleString() + ' ship' + (count === 1 ? '' : 's') + '</span></span>' +
    '<span class="nation-card-arrow" aria-hidden="true">↗</span></button>'
  ).join('');
  const group = (label, rows, extraClass = '') => !rows.length ? '' :
    '<section class="nation-registry-section ' + extraClass + '" aria-label="' + E(label) + '">' +
    '<div class="nation-registry-heading"><h3>' + E(label) + '</h3><span>' +
    rows.length + ' categor' + (rows.length === 1 ? 'y' : 'ies') + '</span></div>' +
    '<div class="nation-card-grid">' + cards(rows) + '</div></section>';
  return '<div id="catalog-start" class="nation-landing">' +
    '<header class="nation-landing-head"><div><span class="eyebrow">FACTION REGISTRY</span>' +
    '<h2>Choose a nation</h2><p>Select a faction to browse its ship roster, or search across every nation.</p></div>' +
    '<div class="nation-landing-count"><strong>' + total.toLocaleString() +
    '</strong><span>Indexed ships</span><small>' + nations.length + ' browse categories</small></div></header>' +
    '<label class="search-wrap nation-landing-search"><span aria-hidden="true">⌕</span>' +
    '<input id="catalog-search" type="search" value="" placeholder="Search every ship or nation…" ' +
    'aria-label="Search ships across all nations" autocomplete="off"></label>' +
    group('Main factions', main) +
    group('META · BULINS · COLLAB', special, 'nation-special-registry') +
    (!nations.length ? '<p class="empty">No ship data available yet.</p>' : '') +
    '</div>';
}

function pager(kind,result){
  if(result.pages<=1)return '';
  const current=String(result.page);
  return '<nav class="catalog-pagination" aria-label="Catalog pages">'+
    '<button type="button" class="outline-btn compact" data-action="catalog-page" data-kind="'+E(kind)+'" data-page-index="'+(result.page-1)+'"'+(result.page===1?' disabled':'')+'>Previous</button>'+
    '<label>Page <select class="catalog-page-select" data-catalog-page-select="'+E(kind)+'" aria-label="Jump to page">'+Array.from({length:result.pages},(_,i)=>option(String(i+1),String(i+1),current)).join('')+'</select> of '+result.pages+'</label>'+
    '<button type="button" class="outline-btn compact" data-action="catalog-page" data-kind="'+E(kind)+'" data-page-index="'+(result.page+1)+'"'+(result.page===result.pages?' disabled':'')+'>Next</button>'+
    '</nav>';
}
function equipmentGroups(rows,sort,descending) {
  return groupedCatalogRows(rows,'equipment').map(group=>({
    ...group,items:sortEquipmentRows(group.items,sort,descending)
  }));
}
function groupedCards(rows,kind,card,totals,sort='rarity',descending=true){
  if(!rows.length)return '<div class="empty">No records match these filters. Try another nation, hull or search.</div>';
  return (kind==='ships' ? groupedShipBrowseRows(rows,sort,descending) : equipmentGroups(rows,sort,descending)).map(group=>
    '<section class="nation-result-group" aria-label="'+E(group.nation)+'">'+
    '<div class="nation-section-title"><h2>'+E(group.nation)+'</h2><span>'+group.items.length+' shown · '+(totals.get(group.nation)||group.items.length)+' matches</span></div>'+
    '<div class="catalog-grid '+(kind==='ships'?'ship-gallery':'equipment-gallery')+'">'+group.items.map(card).join('')+'</div></section>'
  ).join('');
}

export function renderCatalogIndex({kind,records,query='',nation='all',hull='all',category='all',page=1,renderCard,sourceStatus='ready',sort='rarity',descending=true,rarity='all',shipLimit=SHIP_ROSTER_BATCH_SIZE,equipmentLimit=EQUIPMENT_ROSTER_BATCH_SIZE}){
  if(kind!=='ships'&&kind!=='equipment')throw new Error('Unknown catalog');
  if(!Array.isArray(records)||typeof renderCard!=='function')throw new Error('Invalid catalog data');
  const ship=kind==='ships';
  if (ship && nation === 'all' && !String(query).trim() && hull === 'all' && rarity === 'all' && page === 1)
    return shipNationLanding(records);
  const facetRecords=ship
    ?filterShipBrowseRows(records,{query,hull,rarity})
    :filterEquipmentRecords(records,{query,hull,category,rarity});
  const facets=ship ? shipBrowseCounts(facetRecords) : nationCounts(facetRecords,kind);
  const knownNations = new Set((ship ? shipBrowseCounts(records) : nationCounts(records,kind)).map(x => x.nation));
  const currentNation=nation==='all'||knownNations.has(nation)?nation:'all';
  const filtered=ship
    ?filterShipBrowseRows(facetRecords,{nation:currentNation})
    :filterEquipmentRecords(facetRecords,{nation:currentNation});
  const groups=ship ? groupedShipBrowseRows(filtered,sort,descending) : equipmentGroups(filtered,sort,descending);
  const ordered=groups.flatMap(x=>x.items);
  // Both galleries progressively reveal verified items, without numbered pages.
  // Limit the initial DOM to 60 cards so browsing remains responsive.
  const requestedLimit=ship?shipLimit:equipmentLimit;
  const batchSize=ship?SHIP_ROSTER_BATCH_SIZE:EQUIPMENT_ROSTER_BATCH_SIZE;
  const visible=ordered.slice(0,Math.max(batchSize,Math.trunc(Number(requestedLimit)||batchSize)));
  const totals=new Map((ship ? shipBrowseCounts(filtered) : nationCounts(filtered,kind)).map(x=>[x.nation,x.count]));
  const hulls=ship?[...new Set(records.map(x=>x.hull).filter(Boolean))].sort():
    [...new Set(records.flatMap(possibleEquipmentHulls))].sort();
  const cats=ship?[]:[...new Set(records.map(x=>x.category).filter(Boolean))].sort();
  const shipHulls = [
    'all','Vanguard','Main','Sub','DD','CL','CA','CB','BB','BC','BBV','BM',
    'CV','CVL','AR','AE','SS','SSV','Misc'
  ].filter(name=>name==='all' || SHIP_HULL_GROUPS[name] ||
    hulls.includes(name));
  const filterButton = name => '<button type="button" class="ship-filter-chip' +
    (hull===name?' active':'') + '" data-action="ship-hull-filter" data-hull="' +
    E(name) + '" aria-pressed="' + (hull===name) + '">' +
    E(name==='all'?'All':name) + '</button>';
  const rarityButtons = SHIP_RARITIES.map(name=>
    '<button type="button" class="ship-filter-chip' + (rarity===name?' active':'') +
    '" data-action="ship-rarity-filter" data-rarity="' + E(name) +
    '" aria-pressed="' + (rarity===name) + '">' +
    E(name==='all'?'All':name==='Normal'?'Common':name) + '</button>').join('');
  const sortButtons = SHIP_SORTS.map(name =>
    '<button type="button" class="ship-filter-chip' + (sort===name?' active':'') +
    '" data-action="ship-sort" data-sort="' + E(name) +
    '" aria-pressed="' + (sort===name) + '">' +
    E(name.charAt(0).toUpperCase()+name.slice(1)) + '</button>').join('');
  const equipmentChip=(name,value,action,active)=>'<button type="button" class="ship-filter-chip'+
    (active?' active':'')+'" data-action="'+E(action)+'" data-'+E(name)+'="'+E(value)+
    '" aria-pressed="'+active+'">'+E(value==='all'?'All':value==='Normal'?'Common':value)+'</button>';
  const equipmentTypeButtons=['all',...cats].map(value=>equipmentChip('category',value,'equipment-type-filter',category===value)).join('');
  const equipmentHullButtons=['all',...hulls].map(value=>equipmentChip('hull',value,'equipment-hull-filter',hull===value)).join('');
  const equipmentRarityButtons=EQUIPMENT_RARITIES.map(value=>equipmentChip('rarity',value,'equipment-rarity-filter',rarity===value)).join('');
  const equipmentSortButtons=EQUIPMENT_SORTS.map(value=>equipmentChip('sort',value,'equipment-sort',sort===value)).join('');
  const filters=ship
    ? '<div class="ship-roster-tools"><label class="search-wrap"><span aria-hidden="true">⌕</span><input id="catalog-search" type="search" value="' +
       E(query) + '" placeholder="Find a ship…" aria-label="Search full ship roster" autocomplete="off"></label>' +
      '<div class="ship-filter-row"><span>Index</span><div class="ship-filter-scroll" role="group" aria-label="Filter ship hull">' +
       shipHulls.map(filterButton).join('') + '</div></div>' +
      '<div class="ship-filter-row"><span>Rarity</span><div class="ship-sort-controls" role="group" aria-label="Filter by ship rarity">' + rarityButtons + '</div></div>' +
      '<div class="ship-filter-row"><span>Sort</span><div class="ship-sort-controls" role="group" aria-label="Sort ships">' +
       sortButtons + '<button type="button" class="ship-filter-chip" data-action="ship-sort-direction" aria-label="Reverse ship sorting direction">' +
       (descending?'Descending ↓':'Ascending ↑') + '</button></div></div></div>'
    : '<div class="ship-roster-tools equipment-roster-tools"><label class="search-wrap"><span aria-hidden="true">⌕</span>'+
      '<input id="catalog-search" type="search" value="'+E(query)+'" placeholder="Find equipment…" aria-label="Search all equipment" autocomplete="off"></label>'+
      '<div class="ship-filter-row"><span>Type</span><div class="ship-filter-scroll" role="group" aria-label="Filter equipment type">'+equipmentTypeButtons+'</div></div>'+
      '<div class="ship-filter-row"><span>Hull</span><div class="ship-filter-scroll" role="group" aria-label="Filter potentially compatible hulls">'+equipmentHullButtons+'</div></div>'+
      '<div class="ship-filter-row"><span>Rarity</span><div class="ship-sort-controls" role="group" aria-label="Filter equipment rarity">'+equipmentRarityButtons+'</div></div>'+
      '<div class="ship-filter-row"><span>Sort</span><div class="ship-sort-controls" role="group" aria-label="Sort equipment">'+equipmentSortButtons+
      '<button type="button" class="ship-filter-chip" data-action="equipment-sort-direction" aria-label="Reverse equipment sorting direction">'+
      (descending?'Descending ↓':'Ascending ↑')+'</button></div></div></div>';
  const text='Showing '+visible.length.toLocaleString()+' of '+ordered.length.toLocaleString()+
    ' matching '+(ship?'ships':'equipment')+' · '+records.length.toLocaleString()+' total';
  const heading = ship
    ? '<div class="catalog-roster-heading"><button type="button" class="outline-btn compact" data-action="catalog-home">← Nations</button>' +
      '<div class="catalog-roster-label">' +
      (currentNation === 'all' ? '' : nationEmblemMarkup(currentNation)) +
      '<div><span class="eyebrow">SHIP ROSTER</span><h2>' + E(currentNation === 'all' ? 'Search all nations' : currentNation) +
      '</h2></div></div></div>'
    : '<div class="catalog-filter-summary"><strong>Browse by nation</strong><span>' +
      facets.length + ' nations represented · Click a nation to filter</span></div>' +
      nationStrip(kind,facets,currentNation);
  return '<div id="catalog-start">' +
    heading +
    filters+
    '<div class="catalog-result-bar"><span>'+E(text)+'</span>'+
      '<span>Sort: '+E(sort.charAt(0).toUpperCase()+sort.slice(1))+' '+(descending?'↓':'↑')+'</span></div>'+
    groupedCards(visible,kind,renderCard,totals,sort,descending)+
    (visible.length<ordered.length
      ? '<div class="ship-scroll-sentinel" data-'+(ship?'ship':'equipment')+'-scroll-sentinel><span>'+
        E((ordered.length-visible.length).toLocaleString())+' '+(ship?'ships':'equipment')+' remaining</span>'+
        '<button type="button" class="outline-btn compact" data-action="'+(ship?'ship':'equipment')+'-load-more">Load more '+(ship?'ships':'equipment')+'</button></div>'
      : '')+
    '</div>';
}
