import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {normalizeEquipment} from '../src/remote.js';
import {parseWikiShipFacts} from '../src/wiki-ship-facts.js';
import {buildShipLoadout,candidatesForSlot,validateManualChoice,LOADOUT_MODES,slotCategories} from '../src/loadout-intelligence.js';
import {gameShipSlots} from '../src/game-slot-manifest.js';
const fixture=JSON.parse(readFileSync(new URL('./fixtures/loadout-sources.json',import.meta.url)));
const equipment=normalizeEquipment(fixture.equipment);
const hulls={'Large Cruiser':'CB','Aircraft Carrier':'CV','Light Carrier':'CVL',
  'Battleship':'BB','Battlecruiser':'BC','Light Cruiser':'CL','Heavy Cruiser':'CA',
  'Destroyer':'DD','Submarine':'SS','Aviation Submarine':'SSV','Repair':'AR',
  'Munition Ship':'AE','Sailing Frigate':'IX'};
const shipFor=data=>({sourceId:data.id,name:data.name,hull:hulls[data.hullType.trim()]});
function wikiFacts(entry){
  return parseWikiShipFacts('{{Ship\n'+Object.entries(entry.fields).map(([k,v])=>'| '+k+' = '+v).join('\n')+'\n}}',
    entry.fields.GroupID,{pageTitle:entry.title,revision:entry.revision});
}

test('real cross-faction fixtures retain exact MLB mounts across 21 ships and all modes',()=>{
  for(const data of fixture.ships){
    const ship=shipFor(data),game=gameShipSlots(data.id);
    assert.ok(ship.hull,data.name);
    for(const {id:mode} of LOADOUT_MODES){
      const model=buildShipLoadout({ship,data,equipment,mode});
      assert.equal(model.slots.length,6,data.name);
      assert.deepEqual(model.slots.slice(0,5).map(s=>s.typeCodes),game.slots.map(s=>s.types),data.name);
      for(const slot of model.slots.slice(0,5))for(const gear of slot.candidates){
        assert.ok(game.slots[slot.index].types.includes(gear.typeCode),data.name);
        assert.ok(!gear.forbiddenHullIds.includes(game.hullId),data.name);
      }
    }
  }
});

test('Langley rejects guns in her second slot despite the Lycoris display label',()=>{
  const data=fixture.ships.find(s=>s.id==='10701');
  assert.equal(data.slots[1].type,'Artillery (Destroyer)');
  const slot=buildShipLoadout({ship:shipFor(data),data,equipment}).slots[1];
  assert.deepEqual(slot.typeCodes,[7]);
  assert.ok(slot.selected);
  assert.ok(slot.candidates.every(x=>x.typeCode===7));
});

test('wiki overrides snapshot per slot and wrong GroupID cannot supply a hull',()=>{
  const data=fixture.ships.find(s=>s.id==='11802');
  const wiki=wikiFacts(fixture.wiki.find(w=>w.fields.GroupID==='11802'));
  const model=buildShipLoadout({ship:shipFor(data),data,wikiFacts:wiki,equipment});
  assert.equal(model.slots[0].source,'Koumakan Wiki');
  assert.equal(model.slots[3].source,'AzurLaneData · May 2026');
  const other=wikiFacts(fixture.wiki.find(w=>w.fields.GroupID==='960017'));
  assert.equal(buildShipLoadout({ship:shipFor(data),data,wikiFacts:other,equipment}).slots[0].hullId,18);
});

test('real wiki Tempesta subclasses resolve restrictions without a union of incompatible hulls',()=>{
  for(const entry of fixture.wiki.filter(w=>w.fields.GroupID.startsWith('960'))){
    const wiki=wikiFacts(entry),data={id:wiki.sourceId,slots:[]},ship={hull:'IX',sourceId:wiki.sourceId};
    assert.ok([22,23,24].includes(wiki.hullId));
    const model=buildShipLoadout({ship,data,wikiFacts:wiki,equipment});
    for(const slot of model.slots.slice(0,5)){
      assert.equal(slot.hullId,wiki.hullId);
      for(const item of slot.candidates)assert.ok(!item.forbiddenHullIds.includes(wiki.hullId));
    }
    const unknown=buildShipLoadout({ship,data,equipment});
    assert.ok(unknown.slots.slice(0,5).every(s=>s.candidates.length===0));
  }
});

test('source type codes and categories must agree and exact slots retain forbidden-hull checks',()=>{
  assert.deepEqual(slotCategories('constructor'),[]);
  assert.deepEqual(slotCategories('__proto__'),[]);
  const slot={verified:true,categories:['Fighter'],typeCodes:[7],hullId:7};
  const real=equipment.find(x=>x.typeCode===7);
  assert.deepEqual(candidatesForSlot({hull:'CV'},slot,[{...real,typeCode:1}]),[]);
  assert.deepEqual(candidatesForSlot({hull:'CV'},slot,[{...real,forbiddenHullIds:[7]}]),[]);
});

test('equipment limit groups constrain defaults, saved picks, and alternatives across slots',()=>{
  const data=fixture.ships.find(s=>s.id==='11802'),ship=shipFor(data);
  const base=equipment.find(x=>x.typeCode===10&&!x.forbiddenHullIds.includes(18));
  const gear=[{...base,id:'a',equipLimit:760},{...base,id:'b',equipLimit:760},
    {...base,id:'c',equipLimit:0}];
  assert.equal(normalizeEquipment(fixture.equipment).find(x=>x.sourceId==='760').equipLimit,760);
  const model=buildShipLoadout({ship,data,equipment:gear,overrides:{3:'a',4:'b'}});
  assert.equal(model.slots[3].selected.id,'a');
  assert.equal(model.slots[4].selected.id,'c');
  assert.equal(validateManualChoice(model,4,'b'),false);
  const later=buildShipLoadout({ship,data,equipment:gear,overrides:{4:'b'}});
  assert.equal(later.slots[4].selected.id,'b');
  assert.equal(later.slots[4].manual,true);
  assert.equal(later.slots[3].selected.id,'c');
});
