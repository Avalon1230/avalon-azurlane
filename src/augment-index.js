import { augmentImageMarkup, AUGMENT_ICON_COUNT } from './augment-assets.js';

const E=v=>String(v??'').replace(/[&<>"']/g,c=>({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[c]));
export const AUGMENT_BATCH_SIZE=60;
export const AUGMENT_TYPE_NAMES=Object.freeze({
  '1':'Destroyer', '2':'Light cruiser', '3':'Light cruiser / repair',
  '4':'Heavy / large cruiser', '5':'Cruiser / monitor',
  '6':'Battleship', '7':'Aircraft carrier', '8':'Submarine',
  '9':'Light / heavy cruiser', '10':'Sailing frigate',
  'unknown':'Type not verified'
});
const typeKey=item=>item.typeCode==null?'unknown':String(item.typeCode);
const rarityOf=item=>item.rarity||'Not verified';
const tier=item=>({
  'Super Rare':5,'Elite':4,'Rare':3,'Not verified':0
}[rarityOf(item)]||0);

export function filterAugmentRecords(records,{query='',type='all',rarity='all'}={}){
  const term=String(query).trim().toLocaleLowerCase();
  return (Array.isArray(records)?records:[]).filter(item=>{
    if(item?.kind!=='augment')return false;
    if(type!=='all'&&typeKey(item)!==type)return false;
    if(rarity!=='all'&&rarityOf(item)!==rarity)return false;
    const text=[item.name,item.sourceId,item.rarity,AUGMENT_TYPE_NAMES[typeKey(item)],
      item.limitGroup>0?'ship exclusive':'general',
      item.source==='official-announcement'?'announcement only':'source verified']
      .filter(Boolean).join(' ').toLocaleLowerCase();
    return !term||text.includes(term);
  }).sort((a,b)=>tier(b)-tier(a)||
    (b.limitGroup>0)-(a.limitGroup>0)||
    a.name.localeCompare(b.name)||String(a.sourceId).localeCompare(String(b.sourceId)));
}

function option(value,label,selected){
  return '<option value="'+E(value)+'"'+(value===selected?' selected':'')+'>'+E(label)+'</option>';
}

export function renderAugmentIndex({records=[],query='',type='all',rarity='all',limit=AUGMENT_BATCH_SIZE}={}){
  const filtered=filterAugmentRecords(records,{query,type,rarity});
  const visible=filtered.slice(0,Math.max(AUGMENT_BATCH_SIZE,Math.trunc(Number(limit)||AUGMENT_BATCH_SIZE)));
  const types=Object.keys(AUGMENT_TYPE_NAMES)
    .filter(x=>records.some(item=>typeKey(item)===x));
  const rarities=['Super Rare','Elite','Rare','Not verified']
    .filter(x=>records.some(item=>rarityOf(item)===x));
  const cards=visible.map(item=>{
    const announced=item.source==='official-announcement';
    const scope=announced?'Announcement only':item.limitGroup>0?'Ship-exclusive':'General / class eligible';
    const sub=announced?'ID, stats and icon unverified':'Source ID '+E(item.sourceId)+' · '+E(AUGMENT_TYPE_NAMES[typeKey(item)]||'Unknown type');
    return '<button type="button" class="augment-tile'+(announced?' augment-announced':'')+
      '" data-action="augment-details" data-augment="'+E(item.id)+'" aria-label="Inspect '+E(item.name)+' augment details">'+
      '<span class="augment-art">'+augmentImageMarkup(item,'asset-augment-tile')+'</span>'+
      '<strong>'+E(item.name)+'</strong>'+
      '<span class="augment-rarity">'+E(rarityOf(item))+'</span>'+
      '<small>'+E(scope)+'</small><small>'+sub+'</small></button>';
  }).join('');
  return '<section class="augment-index" id="augment-catalog-start">'+
    '<div class="augment-intro"><strong>Source-linked augment directory</strong>'+
    '<p>'+AUGMENT_ICON_COUNT+' dated game records with original icon mappings; five October 2026 announcements are separate and lack verified artwork or stats. Source compatibility is not an effectiveness ranking.</p></div>'+
    '<div class="augment-toolbar"><label class="search-wrap"><span aria-hidden="true">⌕</span>'+
    '<input id="augment-search" type="search" value="'+E(query)+'" aria-label="Search augments" placeholder="Search augment name, ID, class…" autocomplete="off"></label>'+
    '<label class="select-wrap">Hull class <select id="augment-type-filter" aria-label="Augment compatible class">'+
    option('all','All classes',type)+types.map(t=>option(t,AUGMENT_TYPE_NAMES[t],type)).join('')+
    '</select></label>'+
    '<label class="select-wrap">Rarity <select id="augment-rarity-filter" aria-label="Augment rarity">'+
    option('all','All rarities',rarity)+rarities.map(t=>option(t,t,rarity)).join('')+
    '</select></label>'+
    '<button type="button" class="outline-btn compact" data-action="augment-clear-filters">Clear</button></div>'+
    '<p class="catalog-result-bar" role="status">Showing '+visible.length+' of '+filtered.length+
    ' matching augments · '+records.length+' records total. Source date: May 2, 2026; announcement-only names: October 2026.</p>'+
    '<div class="augment-gallery">'+(cards||'<p class="empty">No augments match these filters.</p>')+'</div>'+
    (visible.length<filtered.length?'<button type="button" class="outline-btn augment-load-more" data-action="augment-load-more">Show more ('+
      (filtered.length-visible.length)+' remaining)</button>':'')+
    '</section>';
}