import { filterShipRecords, filterEquipmentRecords, nationCounts, groupedCatalogRows, paginateRecords, possibleEquipmentHulls, UNKNOWN_NATION } from './catalog-filters.js';
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
function pager(kind,result){
  if(result.pages<=1)return '';
  const current=String(result.page);
  return '<nav class="catalog-pagination" aria-label="Catalog pages">'+
    '<button type="button" class="outline-btn compact" data-action="catalog-page" data-kind="'+E(kind)+'" data-page-index="'+(result.page-1)+'"'+(result.page===1?' disabled':'')+'>Previous</button>'+
    '<label>Page <select class="catalog-page-select" data-catalog-page-select="'+E(kind)+'" aria-label="Jump to page">'+Array.from({length:result.pages},(_,i)=>option(String(i+1),String(i+1),current)).join('')+'</select> of '+result.pages+'</label>'+
    '<button type="button" class="outline-btn compact" data-action="catalog-page" data-kind="'+E(kind)+'" data-page-index="'+(result.page+1)+'"'+(result.page===result.pages?' disabled':'')+'>Next</button>'+
    '</nav>';
}
function groupedCards(rows,kind,card,totals){
  if(!rows.length)return '<div class="empty">No records match these filters. Try another nation, hull or search.</div>';
  return groupedCatalogRows(rows,kind).map(group=>
    '<section class="nation-result-group" aria-label="'+E(group.nation)+'">'+
    '<div class="nation-section-title"><h2>'+E(group.nation)+'</h2><span>'+group.items.length+' shown · '+(totals.get(group.nation)||group.items.length)+' matches</span></div>'+
    '<div class="catalog-grid">'+group.items.map(card).join('')+'</div></section>'
  ).join('');
}

export function renderCatalogIndex({kind,records,query='',nation='all',hull='all',category='all',page=1,renderCard,sourceStatus='ready'}){
  if(kind!=='ships'&&kind!=='equipment')throw new Error('Unknown catalog');
  if(!Array.isArray(records)||typeof renderCard!=='function')throw new Error('Invalid catalog data');
  const ship=kind==='ships';
  const criteria={query,hull,category};
  const facetRecords=ship
    ?filterShipRecords(records,{query,hull})
    :filterEquipmentRecords(records,{query,hull,category});
  const facets=nationCounts(facetRecords,kind);
  const availableNations=new Set(facets.map(x=>x.nation));
  const currentNation=nation==='all'||availableNations.has(nation)?nation:'all';
  const filtered=ship
    ?filterShipRecords(facetRecords,{nation:currentNation})
    :filterEquipmentRecords(facetRecords,{nation:currentNation});
  const groups=groupedCatalogRows(filtered,kind);
  const ordered=groups.flatMap(x=>x.items);
  const slices=paginateRecords(ordered,page,60);
  const totals=new Map(nationCounts(filtered,kind).map(x=>[x.nation,x.count]));
  const hulls=ship?[...new Set(records.map(x=>x.hull).filter(Boolean))].sort():
    [...new Set(records.flatMap(possibleEquipmentHulls))].sort();
  const cats=ship?[]:[...new Set(records.map(x=>x.category).filter(Boolean))].sort();
  const filters='<div class="catalog-filter-row">'+
    '<label class="search-wrap"><span aria-hidden="true">⌕</span><input id="catalog-search" type="search" value="'+E(query)+'" placeholder="'+E(ship?'Search all ships, hulls or nations…':'Search all equipment, types or nations…')+'" aria-label="Search full catalog" autocomplete="off"></label>'+
    (ship?'<label class="select-wrap">Hull <select id="hull-filter" aria-label="Filter ships by hull">'+option('all','All hull types',hull)+hulls.map(x=>option(x,x,hull)).join('')+'</select></label>':
    '<label class="select-wrap">Equipment type <select id="category-filter" aria-label="Equipment category">'+option('all','All types',category)+cats.map(x=>option(x,x,category)).join('')+'</select></label>'+
    '<label class="select-wrap">Equippable by hull <select id="gear-hull-filter" aria-label="Filter gear by compatible ship hull">'+option('all','All hulls',hull)+hulls.map(x=>option(x,x,hull)).join('')+'</select></label>')+
    '</div>';
  const available=sourceStatus==='failed'?' · Live catalogs unavailable; showing local fallback':'';
  const text='Showing '+slices.start.toLocaleString()+'–'+slices.end.toLocaleString()+' of '+ordered.length.toLocaleString()+
    ' matching records · '+records.length.toLocaleString()+' indexed total'+available;
  return '<div id="catalog-start">'+
    '<div class="catalog-filter-summary"><strong>Browse by nation</strong><span>'+facets.length+' nations represented · Click a nation to filter</span></div>'+
    nationStrip(kind,facets,currentNation)+
    filters+
    '<div class="catalog-result-bar"><span>'+E(text)+'</span><span>'+slices.pages+' page'+(slices.pages!==1?'s':'')+' · every record accessible</span></div>'+
    pager(kind,slices)+
    groupedCards(slices.rows,kind,renderCard,totals)+
    pager(kind,slices)+
    '<p class="catalog-filter-note">'+(ship
      ?'Nationality is sourced from the full game-data ship roster and refreshed separately from the compact live index. Unmapped or future ships appear as Unclassified.'
      :'A hull listed here means at least one ship of that class has a compatible equipment-type slot, and the item does not explicitly forbid the class. This is NOT a guarantee for every individual ship. Verify ship-specific slots, faction and equipment restrictions before equipping.')+
    '</p></div>';
}
