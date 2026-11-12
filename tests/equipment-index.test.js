import test from 'node:test';
import assert from 'node:assert/strict';
import { renderEquipmentIndex } from '../src/equipment-index.js';
import { renderEquipmentFamilyDetails } from '../src/equipment-roster.js';
const card=item=>'<article data-gear="'+item.id+'">'+item.name+'</article>';
const item=(id,name,category,rarity='Rare',nation='Eagle Union',typeCode=1)=>({
  id:'fer-'+id,sourceId:String(id),name,category,rarity,nation,typeCode,
  source:'fernando',forbiddenHullIds:[],verified:'sourced'
});
const records=[
  item(1000,'Twin 127mm Gun','Destroyer Gun','Elite'),
  item(1020,'Twin 127mm Gun','Destroyer Gun','Rare'),
  item(1060,'Warhawk Fighter','Fighter','Super Rare','Royal Navy',7),
  item(1080,'Rainbow Auxiliary','Auxiliary','Ultra Rare','Eagle Union',10),
  item(1100,'Whirlwind AA','Anti-Air Gun','Rare','Sakura Empire',6)
];

test('equipment has a short sticky toolbar, broad types and closed advanced panel',()=>{
  const html=renderEquipmentIndex({records,renderCard:card});
  assert.match(html,/class="equipment-compact-toolbar"/);
  assert.match(html,/id="catalog-search"/);
  assert.match(html,/data-action="equipment-toggle-filters" aria-expanded="false"/);
  assert.equal((html.match(/data-action="equipment-broad-type"/g)||[]).length,8);
  assert.match(html,/id="equipment-advanced-filters"[^>]* hidden/);
  assert.match(html,/id="equipment-sort-select"/);
  assert.match(html,/id="equipment-group-select"/);
  assert.match(html,/<option value="type" selected>Type<\/option>/);
  assert.doesNotMatch(html,/nation-strip|data-action="catalog-nation"|ship-filter-row/);
  assert.match(html,/Destroyer Gun<\/h2>/);
  assert.match(html,/Fighter<\/h2>/);
});
test('advanced filter selections persist and visible chips can remove them',()=>{
  const html=renderEquipmentIndex({records,renderCard:card,advancedOpen:true,
    nation:'Eagle Union',rarity:'Ultra Rare',category:'Auxiliary',hull:'BB',broadType:'auxiliary'});
  assert.match(html,/data-action="equipment-toggle-filters" aria-expanded="true"/);
  assert.doesNotMatch(html,/equipment-advanced-filters"[^>]* hidden/);
  assert.match(html,/id="equipment-nation-select"/);
  assert.match(html,/id="equipment-hull-select"/);
  assert.match(html,/id="equipment-rarity-select"/);
  assert.match(html,/id="equipment-subtype-select"/);
  assert.match(html,/equipment-filter-count">4/);
  for(const field of ['nation','hull','rarity','category'])
    assert.match(html,new RegExp('data-field="'+field+'"'));
  assert.match(html,/data-action="equipment-reset-filters"/);
  assert.match(html,/data-broad="auxiliary" aria-pressed="true"/);
  assert.doesNotMatch(html,/Warhawk Fighter<\/article>/);
});
test('broad type filtering reduces results without losing source category types',()=>{
  const aircraft=renderEquipmentIndex({records,renderCard:card,broadType:'aircraft'});
  assert.match(aircraft,/Warhawk Fighter<\/article>/);
  assert.doesNotMatch(aircraft,/Rainbow Auxiliary<\/article>/);
  assert.match(aircraft,/Showing 1 of 1 matching equipment · 5 total/);
});
test('true global rarity mode sorts across nations and equipment categories',()=>{
  const html=renderEquipmentIndex({records,renderCard:card,group:'none'});
  assert.deepEqual([...html.matchAll(/data-gear="([^"]+)"/g)].map(x=>x[1]),[
    'fer-1080','fer-1060','fer-1000','fer-1020','fer-1100'
  ]);
  assert.doesNotMatch(html,/<h2>Eagle Union<\/h2>/);
  assert.match(html,/Sorted globally by rarity/);
});
test('family mode only collapses exact-name source variants, not shared artwork',()=>{
  const html=renderEquipmentIndex({records,renderCard:card,group:'families'});
  assert.equal((html.match(/data-action="equipment-family-open"/g)||[]).length,1);
  assert.match(html,/2 variants/);
  assert.match(html,/4 equipment entries · 5 matching records/);
  assert.match(html,/data-action="equipment-family-open" data-family-id="fer-1000"/);
  assert.match(html,/Warhawk Fighter<\/article>/);
  const panel=renderEquipmentFamilyDetails(records.slice(0,2));
  assert.match(panel,/EQUIPMENT VARIANTS/);
  assert.match(panel,/data-action="equip-details" data-equip="fer-1000"/);
  assert.match(panel,/data-action="equip-details" data-equip="fer-1020"/);
  assert.match(panel,/does <strong>not<\/strong> establish an upgrade path/);
});
test('injected search input and source metadata are HTML-escaped',()=>{
  const search='" autofocus onfocus="alert(1)';
  const html=renderEquipmentIndex({records,renderCard:card,query:search});
  assert.match(html,/&quot; autofocus onfocus=&quot;/);
  assert.doesNotMatch(html,/value="" autofocus/);
});
test('scroll batches remain reachable after filtering and grouping',()=>{
  const all=Array.from({length:942},(_,i)=>item(1000+i,'Gear '+i,'Destroyer Gun','Rare'));
  const first=renderEquipmentIndex({records:all,renderCard:card});
  assert.equal((first.match(/data-gear="/g)||[]).length,60);
  assert.match(first,/data-equipment-scroll-sentinel/);
  const full=renderEquipmentIndex({records:all,renderCard:card,equipmentLimit:1000});
  assert.equal((full.match(/data-gear="/g)||[]).length,942);
  assert.doesNotMatch(full,/data-equipment-scroll-sentinel/);
});
