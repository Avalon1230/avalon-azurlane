import test from 'node:test';
import assert from 'node:assert/strict';
import {COMBAT_DATA} from '../src/combat-data.js';
import {gameShipSlots} from '../src/game-slot-manifest.js';
import {buildShipLoadout} from '../src/loadout-intelligence.js';
import {combatModel,combatEquipment} from './helpers/combat-fixture.js';
import {compareSlot} from '../src/combat-evaluate.js';
import {directVolley,weaponCycle,gunAbsoluteCooldown,attackTimeline,airstrikeCycle,reloadSeconds,armorWeights} from '../src/combat-mechanics.js';
import {createCombatScenario} from '../src/combat-scenario.js';
const eq=COMBAT_DATA.equipment;
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
test('Gascogne source parallel two and capacity two reach the real evaluator',()=>{
  const slot=gameShipSlots('99901').slots[0];assert.equal(slot.parallel,2);assert.equal(slot.capacity,2);
  const m=buildShipLoadout({ship:{sourceId:'99901',hull:'BB'},data:{id:'99901',slots:[]},equipment:combatEquipment,mode:'general'});
  const r=compareSlot(m,0,{armor:'light',stat:0});assert.equal(r.status,'partial');
  const row=r.rows.find(x=>x.sourceId==='14340');
  close(row.volley,156*1.05*1.8*(1+25/100)*3*1*2*1.4);
  close(row.cycle,eq[14340].weapon.reload[10]/(6*Math.sqrt(200*3.14))+eq[14340].weapon.delay+0.033);
  assert.equal(row.absoluteCooldown,0.033);assert.equal(gunAbsoluteCooldown(eq[14340],1).value,0.2);
  for(const capacity of [null,undefined,0,-1,1.5,NaN])assert.equal(gunAbsoluteCooldown(eq[14340],capacity).status,'unknown');
  for(const field of ['parallel','capacity']){const bad=structuredClone(m);bad.slots[0][field]=null;assert.equal(compareSlot(bad,0).status,'unknown');}
});
test('direct parallel multiplier is explicit and independent of mounts',()=>{
  const args={level:10,stat:0,efficiency:1,mounts:3,parallel:2,armor:'light'};
  close(directVolley(eq[14340],args).value,687.96*6);
  for(const parallel of [undefined,null,0,-1,1.5,Infinity])assert.equal(directVolley(eq[14340],{...args,parallel}).status,'unknown');
});
test('torpedo and unknown families cannot receive gun damage or timing',()=>{
  for(const type of [5,13,6,10,99,null]){
    const item={...eq[31040],type};
    assert.equal(directVolley(item,{level:10,stat:0,efficiency:1,mounts:1,parallel:1,armor:'light'}).status,'unknown');
    assert.equal(weaponCycle(item,{level:10,reload:100,absoluteCooldown:0.3}).status,'unknown');
    assert.equal(gunAbsoluteCooldown(item,1).status,'unknown');
  }
  const m=combatModel('40303'),data=structuredClone(COMBAT_DATA);
  data.equipment[99999]={...eq[31040],id:99999,type:5,name:'Torpedo test'};
  m.slots[1].candidates=[{source:'fernando',sourceId:'99999',typeCode:5,name:'Torpedo test'}];
  const r=compareSlot(m,1,{},data);assert.equal(r.status,'unknown');assert.equal(r.rows.length,0);assert.match(r.excluded[0].reason,/Unsupported weapon timing/);
});
test('malformed timeline windows and air wing entries return unknown',()=>{
  for(const windows of [null,[null],[undefined],[{}],[{start:0}],[{start:3,end:2}],new Array(1),[false]])assert.equal(attackTimeline({cycle:10,duration:60,windows}).status,'unknown');
  assert.equal(attackTimeline(null).status,'unknown');
  for(const wing of [null,[null],[{}],new Array(1)])assert.equal(airstrikeCycle(wing,null).status,'unknown');
  assert.equal(directVolley(null,null).status,'unknown');assert.equal(weaponCycle(null,null).status,'unknown');
});
test('specific exclusions survive fewer than two comparable candidates',()=>{
  const m=combatModel();m.slots[0].candidates=m.slots[0].candidates.slice(0,1);
  const id=m.slots[0].candidates[0].sourceId;
  for(const mutate of [d=>d.equipment[id].weapon=null,d=>d.equipment[id].stats=null,d=>d.equipment[id].skills=null,d=>d.equipment[id].aliases={},d=>d.conflicts={[id]:{field:'damage',reason:'Contradictory damage sources'}}]){
    const d=structuredClone(COMBAT_DATA);mutate(d);const r=compareSlot(m,0,{},d);
    assert.equal(r.status,'unknown');assert.equal(r.excluded.length,1);assert.ok(r.excluded[0].reason);
  }
  m.slots[0].candidates=[null];assert.equal(compareSlot(m,0).excluded.length,1);
  assert.equal(compareSlot(m,0,{},null).status,'unknown');
});
test('Aquila reference skill follows evaluated second slot, not saved second slot',()=>{
  const m=combatModel('60701','general',{1:'fer-19140'}),before=JSON.stringify(m);
  const current=compareSlot(m,0,{wing:'current'}),reference=compareSlot(m,0,{wing:'reference'});
  assert.ok(current.rows.every(r=>r.skill.role==='offense'));
  assert.ok(reference.rows.every(r=>r.skill.role==='healing'));
  assert.notEqual(current.rows[0].cycle,reference.rows[0].cycle);assert.equal(JSON.stringify(m),before);
  m.slots[2].selected={source:'fernando',sourceId:'99999',typeCode:8,name:'Unknown plane'};
  assert.equal(compareSlot(m,1).status,'unknown');assert.equal(compareSlot(m,1,{wing:'reference'}).status,'partial');
});
test('scenario resets between ships, slots and modes',()=>{
  const state=createCombatScenario();state.select('60701',1,'general').armor='heavy';
  assert.equal(state.select('60701',1,'general').armor,'heavy');
  for(const key of [['60701',0,'general'],['40303',0,'general'],['40303',0,'boss'],['60701',1,'general']])assert.deepEqual(state.select(...key),{});
});
test('numeric overflow, sparse armor and conflicting supporting aircraft fail closed',()=>{
  assert.equal(reloadSeconds(eq[14340].weapon,10,Number.MAX_VALUE).status,'unknown');
  assert.equal(weaponCycle({...eq[14340],weapon:{...eq[14340].weapon,delay:Number.MAX_VALUE}},{level:10,reload:100,absoluteCooldown:Number.MAX_VALUE}).status,'unknown');
  assert.equal(armorWeights([1,,,]),null);
  const data=structuredClone(COMBAT_DATA);data.conflicts={28140:{field:'reload',reason:'Conflicting aircraft reload'}};
  assert.equal(compareSlot(combatModel('60701'),1,{},data).status,'unknown');
  assert.equal(compareSlot(combatModel('60701'),1,{wing:'reference'},data).status,'unknown');
});
