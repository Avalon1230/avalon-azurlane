import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {COMBAT_DATA as data,COMBAT_SOURCE_SHA256} from '../src/combat-data.js';
import {reloadSeconds,directVolley,weaponCycle,airstrikeCycle,attackTimeline,armorWeights} from '../src/combat-mechanics.js';
import {compareSlot,resolveCombatItem,MECHANICS_CONFLICTS} from '../src/combat-evaluate.js';
import {skillCondition,SKILL_RULES} from '../src/combat-skills.js';
import {renderCombatComparison} from '../src/combat-view.js';
import {renderLoadoutAlternatives} from '../src/loadout-view.js';
import {combatEquipment,combatModel} from './helpers/combat-fixture.js';
const eq=id=>data.equipment[id];
const close=(a,b,t=1e-8)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);
test('source fixture hash and compiled manifest agree exactly',()=>{
  const bytes=readFileSync(new URL('../data/combat-source.json',import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'),COMBAT_SOURCE_SHA256);
  assert.deepEqual(JSON.parse(bytes),data);
});
test('all eleven IDs agree with independently imported Fernando identities and five ship slots',()=>{
  const f=JSON.parse(readFileSync(new URL('fixtures/combat-identities.json',import.meta.url)));
  assert.equal(Object.keys(data.equipment).length,11);
  for(const [id,identity] of Object.entries(f.equipment)){
    assert.equal(eq(id).name,identity.name);assert.equal(eq(id).type,identity.type);
  }
  for(const [id,ship] of Object.entries(f.ships)){
    const model=combatModel(id);
    ship.slots.slice(0,3).forEach((s,i)=>{assert.equal(model.slots[i].maxEfficiency,s.efficiency);assert.equal(model.slots[i].maxMounts,s.base);});
    assert.ok(ship.skills.includes(SKILL_RULES[id].skillId));
  }
});
test('independent BWIKI Mk6 damage and rounded reload agree using client K3=3.14',()=>{
  const w=eq(14340).weapon;
  assert.equal(w.damage[10],156);assert.equal(w.count,3);assert.equal(w.coefficient[10],1.05);
  assert.deepEqual(w.armor_mod,[1.4,1.1,0.9]);
  close(reloadSeconds(w,10,100).value,24.02,0.005);
  assert.equal(MECHANICS_CONFLICTS['14340'],undefined);
  assert.ok(compareSlot(combatModel(),0).rows.some(r=>r.sourceId==='14340'));
  // Hand calculation using independently published numbers, zero FP, one 100% mount.
  close(directVolley(eq(14340),{level:10,stat:0,efficiency:1,mounts:1,parallel:1,armor:'light'}).value,687.96);
});
test('independent BWIKI Type98 +10 reference: 12x4, 110%, 100/50/20, 0.96s base',()=>{
  const w=eq(31040).weapon;
  assert.equal(w.damage[10],12);assert.equal(w.count,4);assert.deepEqual(w.armor_mod,[1,0.5,0.2]);
  close(reloadSeconds(w,10,100).value,0.96,0.005);
  close(directVolley(eq(31040),{level:10,stat:0,efficiency:1,mounts:1,parallel:1,armor:'heavy'}).value,10.56);
});
test('RLD scaling excludes volley and absolute cooldown; seconds-unit data is not rescaled',()=>{
  const w=eq(31040).weapon;
  close(reloadSeconds(w,10,300).value/reloadSeconds(w,10,100).value,Math.SQRT1_2);
  close(weaponCycle(eq(31040),{level:10,reload:100,absoluteCooldown:0.3}).value,reloadSeconds(w,10,100).value+0.4);
  assert.equal(reloadSeconds({reload:[2],reload_seconds:true},0,300).value,2);
});
test('armor mixture is weighted direct damage, never an invented utility score',()=>{
  const input={level:10,stat:100,efficiency:1.4,mounts:3,parallel:1};
  const each=['light','medium','heavy'].map(armor=>directVolley(eq(14340),{...input,armor}).value);
  close(directVolley(eq(14340),{...input,armor:[0.5,0.25,0.25]}).value,each[0]*0.5+each[1]*0.25+each[2]*0.25);
  assert.equal(armorWeights([1,1,1]),null);
});
test('unknown or invalid weapon fields never turn into zero damage',()=>{
  for(const level of [-1,99,1.5,NaN])assert.equal(reloadSeconds(eq(14340).weapon,level,100).status,'unknown');
  const item=structuredClone(eq(14340));delete item.weapon.coefficient;
  assert.equal(directVolley(item,{level:10,stat:100,efficiency:1,mounts:1,parallel:1,armor:'light'}).status,'unknown');
  assert.equal(weaponCycle(eq(14340),{level:10,reload:100}).status,'unknown');
  assert.equal(directVolley(eq(17340),{}).status,'unknown');
});
test('timeline includes each cycle, preload and half-open vulnerability windows',()=>{
  const t=attackTimeline({cycle:10,duration:30,first:0,arrivalDelay:2,windows:[{id:'window',start:12,end:22}]});
  assert.deepEqual(t.events.map(e=>e.arrival),[2,12,22]);
  assert.deepEqual(t.events.map(e=>e.windowIds),[[],['window'],[]]);
  assert.equal(attackTimeline({cycle:0,duration:60}).status,'unknown');
  assert.equal(attackTimeline({cycle:1,duration:Infinity}).status,'unknown');
});
test('Aquila healing/offensive branches are exclusive and skill-version gated',()=>{
  const heal=skillCondition('60701',[7,7,8]),offense=skillCondition('60701',[7,9,8]);
  assert.equal(heal.heal,0.08);assert.equal(heal.shield,0.06);assert.equal(heal.duration,5);
  assert.equal(offense.heal,undefined);assert.equal(offense.preload,1);assert.equal(offense.loadingMultiplier,0.9);
  assert.equal(skillCondition('60701',[7,8,8]).status,'unknown');
  assert.equal(skillCondition('60701',[7,7,8],{level:1}).status,'unknown');
  assert.equal(skillCondition('20403',[],{augmented:true}).status,'unknown');
});
test('airstrike cooldown uses the full wing and separate interception reload',()=>{
  const wing=[{item:eq(17340),mounts:2,parallel:1},{item:eq(19140),mounts:2,parallel:1},{item:eq(28140),mounts:4,parallel:1}];
  const expected=(1639*2+1786*2+1550*4)/8/(6*Math.sqrt(200*3.14))*2.2;
  close(airstrikeCycle(wing,{level:10,reload:100,loadingMultiplier:0.9}).value,expected*0.9+0.033);
  close(airstrikeCycle(wing,{level:10,reload:100,interception:true}).value,1492/(6*Math.sqrt(200*3.14))+0.033);
  assert.equal(airstrikeCycle([],{level:10,reload:100}).status,'unknown');
});
test('Hood: earlier 381 salvo vs Mk6 light direct damage and armor-specific AP alternative',()=>{
  const light=compareSlot(combatModel(),0,{armor:'light'}),heavy=compareSlot(combatModel(),0,{armor:'heavy'});
  assert.equal(light.status,'partial');assert.equal(light.timingLeader.sourceId,'24340');
  assert.equal(light.damageLeader.sourceId,'14340');assert.equal(heavy.damageLeader.sourceId,'91000');
  assert.equal(light.rows[0].skill.chance,0.7);assert.equal(light.recommended,null);
});
test('Prinz Eugen: HE leads light direct damage, AP leads medium; barrage count is separate',()=>{
  const light=compareSlot(combatModel('40303'),0,{armor:'light'}),medium=compareSlot(combatModel('40303'),0,{armor:'medium'});
  assert.equal(light.damageLeader.sourceId,'33040');assert.equal(medium.damageLeader.sourceId,'43040');
  assert.ok(light.rows.every(r=>r.barrageTriggers===Math.floor(r.activations/6)));
});
test('Nelson battleship: faster salvo creates more Big Seven opportunities, not guaranteed procs',()=>{
  const r=compareSlot(combatModel('20503'),0,{armor:'heavy'});
  assert.equal(r.timingLeader.sourceId,'24340');assert.equal(r.damageLeader.sourceId,'91000');
  assert.ok(r.rows.every(row=>row.skill.chance===0.4));
  assert.ok(r.rows.find(x=>x.sourceId==='24340').activations>r.rows.find(x=>x.sourceId==='91000').activations);
});
test('Z23: faster Type98 yields more trigger opportunities without inventing barrage damage',()=>{
  const r=compareSlot(combatModel('40123'),0,{armor:'heavy'});
  assert.equal(r.timingLeader.sourceId,'31040');assert.equal(r.damageLeader.sourceId,'11240');
  assert.ok(r.rows.find(x=>x.sourceId==='31040').barrageTriggers>r.rows.find(x=>x.sourceId==='11240').barrageTriggers);
});
test('Aquila compares real whole wings, keeps fighter healing distinct from Helldiver offense',()=>{
  const r=compareSlot(combatModel('60701'),1);
  assert.equal(r.status,'partial');assert.equal(r.rows.length,3);
  assert.equal(r.rows.find(x=>x.sourceId==='19140').skill.role,'offense');
  assert.equal(r.rows.find(x=>x.sourceId==='17340').skill.role,'healing');
  assert.equal(r.damageLeader,null);assert.equal(r.recommended,null);
  const m=combatModel('60701');m.slots[2].selected=null;
  assert.equal(compareSlot(m,1).status,'unknown');
});
test('boss requires explicit armor; mobbing and OpSi report their unmodeled conditions',()=>{
  assert.equal(compareSlot(combatModel('20403','boss'),0).status,'unknown');
  assert.match(compareSlot(combatModel('20403','mobbing'),0).modeNote,/Wave coverage/);
  assert.match(compareSlot(combatModel('20403','opsi'),0).modeNote,/Adaptation/);
  assert.equal(compareSlot(combatModel(),0,{movement:'moving'}).status,'unknown');
});
test('contradictory identity, slot efficiency or missing mechanics fail closed',()=>{
  const candidate=combatEquipment[0];assert.equal(resolveCombatItem({...candidate,name:'Wrong gear'}),null);
  assert.equal(resolveCombatItem({...candidate,typeCode:999}),null);
  const m=combatModel();m.slots[0].maxEfficiency=9;
  assert.equal(compareSlot(m,0).status,'unknown');
  const broken=structuredClone(data);for(const x of Object.values(broken.equipment))x.weapon=null;
  assert.equal(compareSlot(combatModel(),0,{},broken).status,'unknown');
  const contradictory=structuredClone(data);contradictory.conflicts={14340:{field:'damage',reason:'Two source values disagree'}};
  const result=compareSlot(combatModel(),0,{},contradictory);
  assert.ok(result.excluded.some(r=>r.sourceId==='14340'));
  assert.ok(!result.rows.some(r=>r.sourceId==='14340'));
});
test('evaluation and armor changes preserve six positions, compatibility and saved choices',()=>{
  const m=combatModel('20403','general',{0:'fer-24340'}),before=JSON.stringify(m);
  for(const armor of ['mixed','light','heavy'])compareSlot(m,0,{armor});
  assert.equal(JSON.stringify(m),before);assert.equal(m.slots.length,6);assert.equal(m.slots[0].manual,true);
  assert.equal(m.slots[0].selected.id,'fer-24340');
});
test('UI shows short component comparisons and expandable evidence, never Best Overall',()=>{
  const html=renderLoadoutAlternatives(combatModel(),0);
  assert.match(html,/Combat comparison \(WIP\)/);assert.match(html,/Direct-hit leader/);
  assert.match(html,/<details class="combat-evidence">/);assert.match(html,/data-combat-field="armor"/);
  assert.doesNotMatch(html,/Best Overall|Best Boss/);
  assert.match(renderCombatComparison(combatModel(),0,{movement:'moving'}),/accuracy is not modeled/);
});
