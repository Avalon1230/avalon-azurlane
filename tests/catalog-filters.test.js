import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SHIP_NATION_BY_SOURCE_ID, EQUIPMENT_NATION_CODE_NAMES, EQUIPMENT_TYPE_HULL_SLOTS,
  nationForShip, nationForEquipment, possibleEquipmentHulls,
  filterShipRecords, filterEquipmentRecords, nationCounts, groupedCatalogRows, paginateRecords
} from '../src/catalog-filters.js';
import { normalizeShips, normalizeEquipment, mergeShipCatalog } from '../src/remote.js';
import { SHIPS } from '../src/catalog.js';

test('nation snapshot covers all 894 source IDs and distinguishes factions', () => {
  assert.equal(Object.keys(SHIP_NATION_BY_SOURCE_ID).length,894);
  assert.equal(SHIP_NATION_BY_SOURCE_ID['30510'],'Sakura Empire'); // Musashi
  assert.equal(SHIP_NATION_BY_SOURCE_ID['20603'],'Royal Navy'); // Unicorn
  assert.equal(nationForShip({sourceId:'10517'}),'Eagle Union');
  assert.equal(nationForShip({sourceId:'999999999'}),'Unclassified');
  assert.equal(EQUIPMENT_NATION_CODE_NAMES['1'],'Eagle Union');
  assert.equal(EQUIPMENT_NATION_CODE_NAMES['111'],'To LOVE-Ru');
});

test('ship normalization and merge preserve source nationality',()=>{
  const fixtures=Array.from({length:100},(_,i)=>({id:String(30510+i),name:'Ship '+i,hullType:'Battleship',rarity:'Super Rare'}));
  fixtures[0].name='Musashi';
  const parsed=normalizeShips(fixtures);
  assert.equal(parsed[0].nation,'Sakura Empire');
  const merged=mergeShipCatalog(SHIPS,parsed);
  assert.equal(merged.find(x=>x.id==='musashi').nation,'Sakura Empire');
});

test('equipment normalization reads nation and explicit forbidden hulls',()=>{
  const fixtures=Object.fromEntries(Array.from({length:101},(_,i)=>[String(500+i),{name:'Gear '+i,type:7,rarity:4,nationality:1,ship_type_forbidden:i===0?[7]:[],stats:{1:{enhance:'+0'}}}]));
  const parsed=normalizeEquipment(fixtures);
  assert.equal(parsed[0].typeCode,7);
  assert.equal(parsed[0].nation,'Eagle Union');
  assert.deepEqual(parsed[0].forbiddenHullIds,[7]);
  assert.equal(nationForEquipment(parsed[0]),'Eagle Union');
});

test('equipment filter uses observed ship slot types and individual forbidden hulls',()=>{
  assert.ok(Object.keys(EQUIPMENT_TYPE_HULL_SLOTS).length>=15);
  const fighter={id:'fighter',name:'Fighter',category:'Fighter',typeCode:7,nation:'Eagle Union',forbiddenHullIds:[]};
  assert.ok(possibleEquipmentHulls(fighter).includes('CV'));
  assert.ok(possibleEquipmentHulls(fighter).includes('CVL'));
  const banned={...fighter,forbiddenHullIds:[7]};
  assert.equal(possibleEquipmentHulls(banned).includes('CV'),false);
  assert.ok(possibleEquipmentHulls(banned).includes('CVL'));
  assert.equal(filterEquipmentRecords([banned],{hull:'CV'}).length,0);
  assert.equal(filterEquipmentRecords([banned],{hull:'CVL'}).length,1);
  assert.deepEqual(possibleEquipmentHulls({name:'Unverified gun'}),[]);
});

test('nation/hull filters and global search work across the entire roster',()=>{
  const ships=[
    {id:'a',name:'Musashi',sourceId:'30510',hull:'BB',rarity:'Ultra Rare',tags:[]},
    {id:'b',name:'Unicorn',sourceId:'20603',hull:'CVL',tags:[]},
    {id:'c',name:'New Jersey',sourceId:'10517',hull:'BB',tags:[]}
  ];
  assert.deepEqual(filterShipRecords(ships,{nation:'Sakura Empire'}).map(x=>x.id),['a']);
  assert.deepEqual(filterShipRecords(ships,{hull:'BB',query:'eagle union'}).map(x=>x.id),['c']);
  assert.equal(filterShipRecords(ships,{query:'unicorn'}).length,1);
  assert.equal(nationCounts(ships,'ships').reduce((s,x)=>s+x.count,0),3);
  assert.equal(groupedCatalogRows(ships,'ships').length,3);
});

test('equipment nation, type and search filtering compose correctly',()=>{
  const gear=[
    {id:'a',name:'Eagle AA',typeCode:6,nation:'Eagle Union',category:'Anti-Air Gun',forbiddenHullIds:[]},
    {id:'b',name:'Royal AA',typeCode:6,nation:'Royal Navy',category:'Anti-Air Gun',forbiddenHullIds:[]},
    {id:'c',name:'Eagle Fighter',typeCode:7,nation:'Eagle Union',category:'Fighter',forbiddenHullIds:[]}
  ];
  assert.deepEqual(filterEquipmentRecords(gear,{nation:'Eagle Union',category:'Fighter'}).map(x=>x.id),['c']);
  assert.deepEqual(filterEquipmentRecords(gear,{nation:'Royal Navy',query:'aa'}).map(x=>x.id),['b']);
});

test('pagination makes record 894 reachable, rather than permanently slicing first 72',()=>{
  const items=Array.from({length:894},(_,i)=>({id:i,name:'Ship '+i}));
  const last=paginateRecords(items,15,60);
  assert.equal(last.pages,15);
  assert.equal(last.rows.length,54);
  assert.equal(last.rows.at(-1).id,893);
  assert.equal(last.end,894);
  assert.equal(paginateRecords(items,999,60).page,15);
  assert.equal(paginateRecords(items,0,60).page,1);
  assert.equal(paginateRecords([],1,60).start,0);
});