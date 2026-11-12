import test from 'node:test';
import assert from 'node:assert/strict';
import {COMBAT_DATA} from '../src/combat-data.js';
import {compareSlot} from '../src/combat-evaluate.js';
import {directVolley,weaponCycle} from '../src/combat-mechanics.js';
import {combatModel} from './helpers/combat-fixture.js';
test('QA actual-gear reproducer: finite volleys and cycles cannot produce infinite ranked DPS/totals',()=>{
  const model=combatModel('40123'),before=JSON.stringify(model);
  for(const id of [31040,11240]){
    const item=COMBAT_DATA.equipment[id];
    const volley=directVolley(item,{level:10,stat:1e308,efficiency:1.6,mounts:1,parallel:1,armor:'light'});
    const cycle=weaponCycle(item,{level:10,reload:1e307,absoluteCooldown:0.3});
    assert.equal(volley.status,'calculated');assert.equal(cycle.status,'calculated');
    assert.ok(Number.isFinite(volley.value)&&Number.isFinite(cycle.value));
    assert.equal(volley.value/cycle.value,Infinity);assert.equal(volley.value*150,Infinity);
  }
  const result=compareSlot(model,0,{armor:'light',stat:1e308,reload:1e307,duration:60});
  assert.equal(result.status,'unknown');assert.equal(result.rows.length,0);
  assert.equal(result.damageLeader,undefined);assert.equal(result.timingLeader,undefined);assert.equal(result.recommended,null);
  assert.equal(result.excluded.length,2);assert.ok(result.excluded.every(x=>/numeric range/.test(x.reason)));
  assert.equal(JSON.stringify(model),before);
});
test('finite DPS but overflowing encounter total excludes the row',()=>{
  const result=compareSlot(combatModel('40123'),0,{armor:'light',stat:1e307,reload:100,duration:600});
  assert.equal(result.status,'unknown');assert.equal(result.rows.length,0);assert.equal(result.excluded.length,2);
  assert.ok(result.excluded.every(x=>/numeric range/.test(x.reason)));
});
test('all armor metrics are checked, including unknown volley and overflow outside selected armor',()=>{
  for(const modifier of [1e308,1.5]){
    const data=structuredClone(COMBAT_DATA);data.equipment[31040].weapon.armor_mod=[modifier,0.01,0.01];
    const result=compareSlot(combatModel('40123'),0,{armor:'heavy',stat:1e308,reload:1e307,duration:0},data);
    assert.equal(result.status,'unknown');assert.equal(result.damageLeader,undefined);
    assert.ok(!result.rows.some(x=>x.sourceId==='31040'));assert.ok(result.excluded.some(x=>x.sourceId==='31040'));
    const visit=v=>{if(typeof v==='number')assert.ok(Number.isFinite(v));else if(v&&typeof v==='object')Object.values(v).forEach(visit);};
    visit(result.rows);
  }
});
