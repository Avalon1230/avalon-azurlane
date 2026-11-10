import test from 'node:test';
import assert from 'node:assert/strict';
import { SHIP_NATION_BY_SOURCE_ID } from '../src/catalog-filters.js';
import {
  shipBrowseNation, shipBrowseCounts, filterShipBrowseRows,
  groupedShipBrowseRows, shipBrowseDisplayNation, sortShipBrowseRows
} from '../src/ship-factions.js';

const ship=(id,name,nation,hull='DD')=>({id:String(id),sourceId:String(id),name,nation,hull,rarity:'Rare',tags:[]});
test('browse order places main factions, then META, Bulins, and one Collab group',()=>{
  const records=[
    ship(1,'Ryza','Atelier Ryza'),
    ship(2,'Little Bulin','Universal'),
    ship(3,'META Ship','META'),
    ship(4,'Akagi','Sakura Empire'),
    ship(5,'Nier Ship','NieR:Automata'),
    ship(6,'Enterprise','Eagle Union'),
    ship(7,'Unknown','Unclassified'),
    ship(8,'Yumia','Atelier Yumia')
  ];
  assert.deepEqual(shipBrowseCounts(records).map(x=>x.nation),[
    'Eagle Union','Sakura Empire','META','Bulins','Collab','Unclassified'
  ]);
  assert.equal(shipBrowseCounts(records).find(x=>x.nation==='Collab').count,3);
  assert.equal(shipBrowseNation(records[1]),'Bulins');
  assert.equal(shipBrowseDisplayNation(records[0]),'Collab · Atelier Ryza');
  assert.equal(shipBrowseDisplayNation(records[5]),'Eagle Union');
});
test('Collab nation and search preserve original crossover franchise identities',()=>{
  const rows=[
    ship(1,'Ryza','Atelier Ryza'),ship(2,'Yumia','Atelier Yumia'),
    ship(3,'Collab Ship','To LOVE-Ru'),ship(4,'Bulin','Universal'),
    ship(5,'Original','Sakura Empire')
  ];
  assert.equal(filterShipBrowseRows(rows,{nation:'Collab'}).length,3);
  assert.deepEqual(filterShipBrowseRows(rows,{nation:'Collab',query:'Ryza'}).map(x=>x.name),['Ryza']);
  assert.deepEqual(filterShipBrowseRows(rows,{nation:'Collab',query:'Atelier Yumia'}).map(x=>x.name),['Yumia']);
  assert.deepEqual(filterShipBrowseRows(rows,{query:'Collab'}).map(x=>x.name),['Ryza','Yumia','Collab Ship']);
  assert.deepEqual(filterShipBrowseRows(rows,{nation:'Bulins',query:'Bulin'}).map(x=>x.name),['Bulin']);
  assert.deepEqual(filterShipBrowseRows(rows,{nation:'Collab',hull:'BB'}),[]);
  assert.deepEqual(groupedShipBrowseRows(rows).map(x=>x.nation),['Sakura Empire','Bulins','Collab']);
});
test('source snapshot records are all preserved by browse category aggregation',()=>{
  const rows=Object.entries(SHIP_NATION_BY_SOURCE_ID).map(([id,nation])=>ship(id,'Source '+id,nation));
  const total=shipBrowseCounts(rows).reduce((sum,group)=>sum+group.count,0);
  assert.equal(total,894);
  assert.equal(shipBrowseCounts(rows).find(x=>x.nation==='Bulins').count,3);
  assert.equal(shipBrowseCounts(rows).find(x=>x.nation==='META').count,66);
  assert.equal(shipBrowseCounts(rows).filter(x=>x.nation==='Collab').length,1);
});
test('unknown factions do not get incorrectly classified as collabs',()=>{
  assert.equal(shipBrowseNation(ship(100,'New Nation','Unclassified')),'Unclassified');
  assert.equal(shipBrowseNation(ship(100,'Unknown Future','Future Nation')),'Future Nation');
});

test('in-game-style hull groups filter correctly across class families',()=>{
  const rows=[
    ship(1,'Destroyer','Eagle Union','DD'),
    ship(2,'Carrier','Eagle Union','CV'),
    ship(3,'Submarine','Eagle Union','SS'),
    ship(4,'Sailing frigate','Tempesta','IX')
  ];
  assert.deepEqual(filterShipBrowseRows(rows,{hull:'Vanguard'}).map(x=>x.name),['Destroyer']);
  assert.deepEqual(filterShipBrowseRows(rows,{hull:'Main'}).map(x=>x.name),['Carrier']);
  assert.deepEqual(filterShipBrowseRows(rows,{hull:'Sub'}).map(x=>x.name),['Submarine']);
  assert.deepEqual(filterShipBrowseRows(rows,{hull:'Misc'}).map(x=>x.name),['Sailing frigate']);
  assert.deepEqual(filterShipBrowseRows(rows,{hull:'CV'}).map(x=>x.name),['Carrier']);
});
test('sort controls use observed rarity and hull rather than invented ship levels',()=>{
  const rows=[
    {...ship(1,'Zeta','Eagle Union','DD'),rarity:'Rare'},
    {...ship(2,'Alpha','Eagle Union','BB'),rarity:'Ultra Rare'},
    {...ship(3,'Beta','Eagle Union','CL'),rarity:'Super Rare'}
  ];
  assert.deepEqual(sortShipBrowseRows(rows,'name').map(x=>x.name),['Alpha','Beta','Zeta']);
  assert.deepEqual(sortShipBrowseRows(rows,'rarity',true).map(x=>x.name),['Alpha','Beta','Zeta']);
  assert.deepEqual(sortShipBrowseRows(rows,'hull').map(x=>x.name),['Alpha','Beta','Zeta']);
});
