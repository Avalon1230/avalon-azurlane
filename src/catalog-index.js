import { nationEmblemMarkup } from './nation-emblems.js';
import { MAIN_SHIP_FACTIONS, SHIP_SORTS, SHIP_HULL_GROUPS, shipBrowseCounts, filterShipBrowseRows, groupedShipBrowseRows } from './ship-factions.js';
import { filterEquipmentRecords, nationCounts, groupedCatalogRows, paginateRecords, possibleEquipmentHulls, UNKNOWN_NATION } from './catalog-filters.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const E=esc;

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
function groupedCards(rows,kind,card,totals,sort='name',descending=false){
  if(!rows.length)return '<div class="empty">No records match these filters. Try another nation, hull or search.</div>';
  return (kind === 'ships' ? groupedShipBrowseRows(rows,sort,descending) : groupedCatalogRows(rows,kind)).map(group=>
    '<section class="nation-result-group" aria-label="'+E(group.nation)+'">'+
    '<div class="nation-section-title"><h2>'+E(group.nation)+'</h2><span>'+group.items.length+' shown · '+(totals.get(group.nation)||group.items.length)+' matches</span></div>'+
    '<div class="catalog-grid'+(kind==='ships'?' ship-gallery':'')+'">'+group.items.map(card).join('')+'</div></section>'
  ).join('');
}

export function renderCatalogIndex({kind,records,query='',nation='all',hull='all',category='all',page=1,renderCard,sourceStatus='ready',sort='name',descending=false}){
  if(kind!=='ships'&&kind!=='equipment')throw new Error('Unknown catalog');
  if(!Array.isArray(records)||typeof renderCard!=='function')throw new Error('Invalid catalog data');
  const ship=kind==='ships';
  if (ship && nation === 'all' && !String(query).trim() && hull === 'all' && page === 1)
    return shipNationLanding(records);
  const facetRecords=ship
    ?filterShipBrowseRows(records,{query,hull})
    :filterEquipmentRecords(records,{query,hull,category});
  const facets=ship ? shipBrowseCounts(facetRecords) : nationCounts(facetRecords,kind);
  const knownNations = new Set((ship ? shipBrowseCounts(records) : nationCounts(records,kind)).map(x => x.nation));
  const currentNation=nation==='all'||knownNations.has(nation)?nation:'all';
  const filtered=ship
    ?filterShipBrowseRows(facetRecords,{nation:currentNation})
    :filterEquipmentRecords(facetRecords,{nation:currentNation});
  const groups=ship ? groupedShipBrowseRows(filtered,sort,descending) : groupedCatalogRows(filtered,kind);
  const ordered=groups.flatMap(x=>x.items);
  const slices=paginateRecords(ordered,page,60);
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
  const sortButtons = SHIP_SORTS.map(name =>
    '<button type="button" class="ship-filter-chip' + (sort===name?' active':'') +
    '" data-action="ship-sort" data-sort="' + E(name) +
    '" aria-pressed="' + (sort===name) + '">' +
    E(name.charAt(0).toUpperCase()+name.slice(1)) + '</button>').join('');
  const filters=ship
    ? '<div class="ship-roster-tools"><label class="search-wrap"><span aria-hidden="true">⌕</span><input id="catalog-search" type="search" value="' +
       E(query) + '" placeholder="Find a ship…" aria-label="Search full ship roster" autocomplete="off"></label>' +
      '<div class="ship-filter-row"><span>Index</span><div class="ship-filter-scroll" role="group" aria-label="Filter ship hull">' +
       shipHulls.map(filterButton).join('') + '</div></div>' +
      '<div class="ship-filter-row"><span>Sort</span><div class="ship-sort-controls" role="group" aria-label="Sort ships">' +
       sortButtons + '<button type="button" class="ship-filter-chip" data-action="ship-sort-direction" aria-label="Reverse ship sorting direction">' +
       (descending?'Descending ↓':'Ascending ↑') + '</button></div></div></div>'
    : '<div class="catalog-filter-row">' +
      '<label class="search-wrap"><span aria-hidden="true">⌕</span><input id="catalog-search" type="search" value="'+E(query)+'" placeholder="Search all equipment, types or nations…" aria-label="Search full catalog" autocomplete="off"></label>'+
      '<label class="select-wrap">Equipment type <select id="category-filter" aria-label="Equipment category">'+option('all','All types',category)+cats.map(x=>option(x,x,category)).join('')+'</select></label>'+
      '<label class="select-wrap">Equippable by hull <select id="gear-hull-filter" aria-label="Filter gear by compatible ship hull">'+option('all','All hulls',hull)+hulls.map(x=>option(x,x,hull)).join('')+'</select></label></div>';
  const text='Showing '+slices.start.toLocaleString()+'–'+slices.end.toLocaleString()+' of '+ordered.length.toLocaleString()+
    ' matching records · '+records.length.toLocaleString()+' total';
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
    '<div class="catalog-result-bar"><span>'+E(text)+'</span><span>Page '+slices.page+' of '+slices.pages+'</span></div>'+
    pager(kind,slices)+
    groupedCards(slices.rows,kind,renderCard,totals,sort,descending)+
    pager(kind,slices)+
    '</div>';
}
