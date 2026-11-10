import test from 'node:test';
import assert from 'node:assert/strict';
import { renderCatalogIndex } from '../src/catalog-index.js';
const shipRow=(id,name,nation,hull='DD')=>({id:String(id),sourceId:String(id),name,nation,hull,rarity:'Super Rare',tags:[]});
const card=item=>'<article data-ship="'+item.id+'">'+item.name+'</article>';
test('nation-categorized ship index supports all 894 records with 15 pages',()=>{
  const rows=Array.from({length:894},(_,i)=>shipRow(10000+i,'Ship '+i,i%2===0?'Eagle Union':'Royal Navy',i%4===0?'BB':'DD'));
  const page=renderCatalogIndex({kind:'ships',records:rows,page:15,renderCard:card});
  assert.match(page,/894 total/);
  assert.match(page,/Page <select/);
  assert.match(page,/<option value="15" selected>/);
  assert.match(page,/data-ship="10893"/);
  assert.doesNotMatch(page,/data-ship="10000"/);
  assert.match(page,/Royal Navy/);
  assert.match(page,/Search all nations/);
});
test('equipment view filters by type, origin, and hull without fictional equipability',()=>{
  const gear=[
    {id:'1',name:'Eagle Fighter',category:'Fighter',nation:'Eagle Union',typeCode:7,forbiddenHullIds:[]},
    {id:'2',name:'Iron Fighter',category:'Fighter',nation:'Iron Blood',typeCode:7,forbiddenHullIds:[7]},
    {id:'3',name:'Unknown',category:'Other',nation:'Unclassified'}
  ];
  const html=renderCatalogIndex({kind:'equipment',records:gear,hull:'CV',renderCard:card});
  assert.match(html,/Eagle Fighter/);
  assert.doesNotMatch(html,/Iron Fighter<\/article>/);
  assert.doesNotMatch(html,/Unknown<\/article>/);
  assert.match(html,/Equippable by hull/);
  assert.match(html,/Equipment type/);
});
test('search escaping prevents attribute injection in catalog controls',()=>{
  const html=renderCatalogIndex({kind:'ships',records:[],query:'" autofocus onfocus="alert(1)',renderCard:card});
  assert.match(html,/&quot; autofocus onfocus=&quot;/);
  assert.doesNotMatch(html,/value="" autofocus/);
});
test('invalid catalog types throw rather than silently presenting wrong records',()=>{
  assert.throws(()=>renderCatalogIndex({kind:'unknown',records:[],renderCard:card}),/Unknown catalog/);
});
test('ship landing is nation-first with real nationality emblems and dynamic counts',()=>{
  const rows=[shipRow(30101,'Sakura A','Sakura Empire'),shipRow(30102,'Sakura B','Sakura Empire'),shipRow(20101,'Royal A','Royal Navy')];
  const html=renderCatalogIndex({kind:'ships',records:rows,renderCard:card});
  assert.match(html,/Choose a nation/);
  assert.match(html,/nation-card-grid/);
  assert.match(html,/data-action="catalog-nation" data-kind="ships" data-nation="Sakura Empire"/);
  assert.match(html,/2 ships/);
  assert.match(html,/3<\/strong><span>Indexed ships/);
  assert.match(html,/images\/nationality\/3\.png/);
  assert.match(html,/id="catalog-search"/);
  assert.doesNotMatch(html,/data-ship=/); // no enormous initial card list
  assert.doesNotMatch(html,/nation-strip/);
});
test('choosing a nation opens the complete searchable hull-filtered roster and returns home',()=>{
  const rows=[shipRow(30101,'First','Sakura Empire','DD'),shipRow(30102,'Second','Sakura Empire','BB'),shipRow(20101,'Foreign','Royal Navy','BB')];
  const nation=renderCatalogIndex({kind:'ships',records:rows,nation:'Sakura Empire',hull:'BB',renderCard:card});
  assert.match(nation,/data-action="catalog-home"/);
  assert.match(nation,/data-ship="30102"/);
  assert.doesNotMatch(nation,/data-ship="30101"/);
  assert.doesNotMatch(nation,/data-ship="20101"/);
  const empty=renderCatalogIndex({kind:'ships',records:rows,nation:'Sakura Empire',query:'nonesuch',renderCard:card});
  assert.match(empty,/No records match these filters/);
  assert.match(empty,/Sakura Empire<\/h2>/);
  assert.doesNotMatch(empty,/data-ship="20101"/);
  const global=renderCatalogIndex({kind:'ships',records:rows,query:'Foreign',renderCard:card});
  assert.match(global,/Search all nations/);
  assert.match(global,/data-ship="20101"/);
  assert.doesNotMatch(global,/data-ship="30102"/);
});
test('unrecognized factions remain browseable with a non-invented emblem fallback',()=>{
  const html=renderCatalogIndex({kind:'ships',records:[shipRow(999,'Mystery','Kingdom of Tulipa')],renderCard:card});
  assert.match(html,/Kingdom of Tulipa/);
  assert.match(html,/nation-emblem-fallback/);
  assert.doesNotMatch(html,/images\/nationality\/null\.png/);
});

test('faction landing shows main factions before META, Bulins and a single Collab card',()=>{
  const rows=[
    shipRow(1,'Akagi','Sakura Empire'),shipRow(2,'META ship','META'),
    shipRow(3,'Bulin','Universal'),shipRow(4,'Ryza','Atelier Ryza'),
    shipRow(5,'Yumia','Atelier Yumia'),shipRow(6,'Enterprise','Eagle Union')
  ];
  const html=renderCatalogIndex({kind:'ships',records:rows,renderCard:card});
  const cards=[...html.matchAll(/data-kind="ships" data-nation="([^"]+)"/g)].map(x=>x[1]);
  assert.deepEqual(cards,['Eagle Union','Sakura Empire','META','Bulins','Collab']);
  assert.match(html,/data-nation="Collab"[^]*?2 ships/);
  assert.match(html,/images\/nationality\/100\.png/);
  assert.match(html,/images\/nationality\/0\.png/);
  assert.doesNotMatch(html,/data-nation="Atelier Ryza"/);
  assert.doesNotMatch(html,/catalog-filter-note/);
  assert.doesNotMatch(html,/Original Azur Lane game assets/);
  const collab=renderCatalogIndex({kind:'ships',records:rows,nation:'Collab',renderCard:card});
  assert.match(collab,/data-ship="4"/);
  assert.match(collab,/data-ship="5"/);
  assert.doesNotMatch(collab,/data-ship="3"/);
  const searched=renderCatalogIndex({kind:'ships',records:rows,query:'Atelier Yumia',renderCard:card});
  assert.match(searched,/data-ship="5"/);
});
test('equipment index no longer shows technical method footnotes among its browse cards',()=>{
  const html=renderCatalogIndex({kind:'equipment',records:[
    {id:'1',name:'Fighter',category:'Fighter',nation:'Eagle Union',typeCode:7,forbiddenHullIds:[]}
  ],renderCard:card});
  assert.doesNotMatch(html,/catalog-filter-note/);
  assert.doesNotMatch(html,/Verify ship-specific slots/);
});

test('compact ship filters and sorting use clickable buttons with no hull dropdown',()=>{
  const records=[
    shipRow(1,'Zeta','Eagle Union','DD'),
    {...shipRow(2,'Alpha','Eagle Union','BB'),rarity:'Ultra Rare'},
    {...shipRow(3,'Beta','Eagle Union','CV'),rarity:'Super Rare'}
  ];
  const roster=renderCatalogIndex({kind:'ships',records,nation:'Eagle Union',
    sort:'rarity',descending:true,renderCard:card});
  assert.match(roster,/data-action="ship-hull-filter" data-hull="Vanguard"/);
  assert.match(roster,/data-action="ship-hull-filter" data-hull="BB"/);
  assert.match(roster,/data-action="ship-sort" data-sort="rarity"/);
  assert.match(roster,/data-action="ship-rarity-filter" data-rarity="Ultra Rare"/);
  assert.match(roster,/Descending ↓/);
  assert.doesNotMatch(roster,/id="hull-filter"/);
  assert.ok(roster.indexOf('data-ship="2"') < roster.indexOf('data-ship="3"'));
  assert.ok(roster.indexOf('data-ship="3"') < roster.indexOf('data-ship="1"'));
  const vanguard=renderCatalogIndex({kind:'ships',records,nation:'Eagle Union',hull:'Vanguard',renderCard:card});
  assert.match(vanguard,/data-ship="1"/);
  assert.doesNotMatch(vanguard,/data-ship="2"/);
});
