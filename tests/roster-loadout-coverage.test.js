import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { gameShipSlots, VERIFIED_SLOT_RECORDS } from '../src/game-slot-manifest.js';
import { augmentRecord, candidateAugmentsForShip, announcedAugmentForShip,
  AUGMENT_RECORDS } from '../src/augment-manifest.js';
import { slotCategories, loadoutDisplaySlots, buildShipLoadout,validateManualChoice } from '../src/loadout-intelligence.js';
import { renderAugmentDetails } from '../src/augment-view.js';
import { renderLoadoutPanel, renderLoadoutAlternatives } from '../src/loadout-view.js';
import { EQUIPMENT_TYPE_HULL_SLOTS } from '../src/catalog-filters.js';

const gear=(id,name,typeCode,category,rarity='Super Rare')=>({
  id:'fer-'+id,source:'fernando',sourceId:String(id),
  name,typeCode,category,rarity,forbiddenHullIds:[],stats:{}
});
const sampleGear=[
  gear(23000,'Large Cruiser Main Gun',11,'Large Cruiser Gun'),
  gear(23020,'Destroyer Secondary Gun',1,'Destroyer Gun'),
  gear(23040,'Anti-Air Gun',6,'Anti-Air Gun'),
  gear(23060,'Auxiliary Repair Toolkit',10,'Auxiliary'),
  gear(23080,'Auxiliary Radar',10,'Auxiliary'),
  gear(23090,'Auxiliary Compass',10,'Auxiliary'),
  gear(23100,'Fighter',7,'Fighter'),
  gear(23120,'Dive Bomber',9,'Dive Bomber'),
  gear(23140,'Torpedo Bomber',8,'Torpedo Bomber'),
  gear(23160,'Submarine Torpedo',13,'Submarine Torpedo'),
  gear(23180,'Seaplane',12,'Seaplane')
];

test('verified game manifest uses exact source GroupIDs and five regular equipment slots',()=>{
  const artwork=JSON.parse(readFileSync(new URL('../data/ship-artwork.json',import.meta.url),'utf8'));
  assert.equal(Object.keys(artwork.ships).length,894);
  assert.equal(VERIFIED_SLOT_RECORDS,860);
  const overlap=Object.keys(artwork.ships).filter(id=>!!gameShipSlots(id));
  assert.equal(overlap.length,852);
  const knownTypes=new Set(Object.keys(EQUIPMENT_TYPE_HULL_SLOTS).map(Number));
  for(const id of overlap){
    const rec=gameShipSlots(id);
    assert.equal(rec.sourceId,id);
    assert.ok(Number.isSafeInteger(rec.shipId)&&Number.isInteger(rec.hullId));
    assert.equal(rec.slots.length,5);
    for(const slot of rec.slots){
      assert.ok(slot.types.length>0,id+' has no equipment type');
      assert.ok(slot.types.every(type=>knownTypes.has(type)),id+' uses unmapped equipment type');
      assert.ok(Number.isFinite(slot.maxEfficiency));
    }
    assert.equal(rec.slots.slice(3).every(s=>s.types.includes(10)),true,id+' expected sourced auxiliaries');
  }
  assert.equal(gameShipSlots('99999999'),null);
  assert.equal(gameShipSlots('11802evil'),null);
});

test('all 13 distinct Lycoris slot label variants are recognized, not only wiki terminology',()=>{
  const expected=[
    ['Artillery (Destroyer)','Destroyer Gun'],['Artillery (Light Cruiser)','Light Cruiser Gun'],
    ['Artillery (Heavy Cruiser)','Heavy Cruiser Gun'],['Artillery (Battleship)','Battleship Gun'],
    ['Artillery (Pocket Battleship)','Large Cruiser Gun'],['Torpedo','Surface Torpedo'],
    ['Torpedo (Submarine)','Submarine Torpedo'],['Anti-Air Gun','Anti-Air Gun'],
    ['Fighter','Fighter'],['Dive Bomber','Dive Bomber'],
    ['Torpedo Bomber','Torpedo Bomber'],['Auxiliary','Auxiliary'],
    ['Reconnaissance','Seaplane']
  ];
  for(const [source,expectedCategory] of expected){
    assert.deepEqual(slotCategories(source),[expectedCategory],source);
  }
  assert.deepEqual(slotCategories('CB Main Guns / CA Main Guns'),
    ['Large Cruiser Gun','Heavy Cruiser Gun']);
  assert.deepEqual(slotCategories('DD Main Guns'),['Destroyer Gun']);
  assert.deepEqual(slotCategories('Fighters/Dive Bombers (LB1)'),['Fighter','Dive Bomber']);
  assert.deepEqual(slotCategories('some invented laser'),[]);
});

test('Guam auto-fills all 5 sourced game slots and a source-compatible generic augment',()=>{
  const ship={id:'lyc-11802',sourceId:'11802',name:'Guam',hull:'CB'};
  const data={id:'11802',slots:[
    {type:'Artillery (Pocket Battleship)'},{type:'Artillery (Destroyer)'},{type:'Anti-Air Gun'}
  ]};
  const model=buildShipLoadout({ship,data,equipment:sampleGear});
  assert.equal(model.slots.length,6);
  assert.deepEqual(model.slots.map(x=>x.kind),
    ['weapon','weapon','weapon','auxiliary','auxiliary','augment']);
  assert.ok(model.slots.every(x=>x.selected),'all six slots must have sourced options');
  assert.deepEqual(model.slots.slice(0,3).map(x=>x.selected.sourceId),
    ['23000','23020','23040']);
  assert.equal(new Set(model.slots.slice(3,5).map(x=>x.selected.sourceId)).size,2);
  assert.ok(model.slots.slice(3,5).every(x=>x.selected.category==='Auxiliary'));
  assert.equal(model.slots[3].source,'AzurLaneData · May 2026');
  assert.equal(model.slots[3].provisional,false);
  assert.equal(model.slots[5].selected.kind,'augment');
  assert.match(model.slots[5].explanation,/hull type/);
  assert.notEqual(model.slots[3].selected.id,model.slots[4].selected.id);
  assert.equal(validateManualChoice(model,5,model.slots[5].selected.id),true);
  assert.equal(validateManualChoice(model,5,'fer-23040'),false);
});

test('carrier, submarine carrier and Tempesta hulls respect their actual equipment types',()=>{
  const carrier={id:'30715',slots:[
    {type:'Fighter'},{type:'Dive Bomber'},{type:'Torpedo Bomber'}
  ]};
  const cv=buildShipLoadout({ship:{hull:'CV',sourceId:'30715'},data:carrier,equipment:sampleGear});
  assert.deepEqual(cv.slots.slice(0,3).map(x=>x.selected?.typeCode),[7,9,8]);
  const ssv=buildShipLoadout({ship:{hull:'SSV',sourceId:'31701'},data:{id:'31701',slots:[
    {type:'Torpedo (Submarine)'},{type:'Torpedo (Submarine)'},{type:'Reconnaissance'}
  ]},equipment:sampleGear});
  assert.deepEqual(ssv.slots.slice(0,3).map(x=>x.selected?.typeCode),[13,13,12]);
  const tempesta={id:'960002',slots:[
    {type:'Artillery (Battleship)'},{type:'Artillery (Destroyer)'},{type:'Artillery (Destroyer)'}
  ]};
  assert.equal(gameShipSlots('960002').hullId,24);
  assert.equal(gameShipSlots('960001').hullId,22);
  const frigate=buildShipLoadout({ship:{hull:'IX',sourceId:'960002'},data:tempesta,equipment:[
    ...sampleGear,gear(23200,'Battleship Gun',4,'Battleship Gun')
  ]});
  assert.deepEqual(frigate.slots.slice(0,3).map(x=>x.selected?.typeCode),[4,1,1]);
});

test('generic augments and exact collection-ID exclusives never join by ship display name',()=>{
  assert.equal(AUGMENT_RECORDS,239);
  const l=gameShipSlots('10117');
  const augments=candidateAugmentsForShip({shipId:l.shipId,hullId:l.hullId});
  assert.ok(augments.some(x=>x.name==='Huggy Pillow of Bravery'&&
    x.matchLevel==='ship-specific'));
  assert.equal(augmentRecord('aug-10000')?.name,'Huggy Pillow of Bravery');
  const guam=gameShipSlots('11802');
  const neutral=candidateAugmentsForShip({shipId:guam.shipId,hullId:guam.hullId});
  assert.ok(neutral.some(x=>x.name==='Greatsword'&&x.matchLevel==='class'));
  assert.equal(neutral.some(x=>x.name==='Huggy Pillow of Bravery'),false);
});

test('October 2026 official Tempesta augment names are usable without fabricated stats or icons',()=>{
  for(const [gid,name] of Object.entries({
    '960017':'Greatstaff of the Lodestar','960018':'Silent Scythe',
    '960019':'Fate’s Choice','960020':'Abyssal Summons','960021':'Mizrak of Trials'
  })){
    const item=announcedAugmentForShip(gid);
    assert.equal(item.name,name);
    assert.equal(item.matchLevel,'announced-specific');
    assert.deepEqual(item.stats,[]);
    assert.equal(item.craftable,null);
    const html=renderAugmentDetails(item);
    assert.match(html,/Publisher-announced/);
    assert.match(html,/2026-10-21/);
    assert.doesNotMatch(html,/asset-img|<img/);
  }
  assert.equal(announcedAugmentForShip('960001'),null);
});

test('newer Sailing Frigate loadouts are marked provisional where hull subclass is absent',()=>{
  const newer={id:'960017',slots:[
    {type:'Artillery (Destroyer)'},{type:'Artillery (Destroyer)'},{type:'Auxiliary'}
  ]};
  const model=buildShipLoadout({ship:{hull:'IX',sourceId:'960017'},data:newer,equipment:sampleGear});
  assert.equal(model.slots.length,6);
  assert.ok(model.slots.every(x=>x.selected));
  assert.equal(model.slots[0].provisional,true);
  assert.equal(model.slots[5].selected?.name,'Greatstaff of the Lodestar');
  assert.match(model.slots[5].explanation,/publisher announced/i);
  const html=renderLoadoutPanel(model);
  assert.match(html,/data-action="loadout-augment-inspect"/);
  assert.doesNotMatch(html,/data-equip="aug-/);
  const alternatives=renderLoadoutAlternatives(model,5);
  assert.match(alternatives,/Yostar|October|Modules are sourced/);
});

test('augment detail HTML is properly escaped and shows provenance',()=>{
  const item={...augmentRecord('10000'),name:'<img src=x onerror=alert(1)>'};
  const html=renderAugmentDetails(item);
  assert.match(html,/&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.doesNotMatch(html,/<img src=x/);
  assert.match(html,/AzurLaneData augments\.json/);
});
