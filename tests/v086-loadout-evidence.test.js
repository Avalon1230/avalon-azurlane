import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderLoadoutDecisionEvidence,researchedOptions,RESEARCHED_EQUIPMENT_COUNT} from '../src/loadout-evidence.js';
import {renderLoadoutAlternatives} from '../src/loadout-view.js';

const gear=(sourceId,name,category,stats={},extras={})=>({
  id:'fer-'+sourceId,sourceId:String(sourceId),source:'fernando',name,category,
  rarity:'Super Rare',enhancement:'+13',stats,...extras
});
const la9=gear('85600','Prototype Carrier-Based La-9','Fighter',{hit:12});
const bf109=gear('47160','Prototype BF-109G','Fighter',{hit:8});
const mk305=gear('44320','Prototype Quadruple 305mm SKC39 Main Gun Mount','Battleship Gun',{hit:15});
const champagne=gear('41060','Prototype Triple 406mm Champagne Gun','Battleship Gun',{hit:10});
const model=(slot,mode='boss',sourceId='60701')=>({sourceId,mode,description:'test',slots:[slot]});
const slot=(selected,candidates,index=0,kind='weapon')=>({
  index,kind,type:selected?.category||'Fighter',categories:[selected?.category||'Fighter'],
  verified:true,provisional:false,source:'Exact game slot',
  selected,candidates,manual:false,explanation:'Candidate compatible'
});

test('stat-based sort is explained with an actual source differential, not claimed DPS',()=>{
  const s=slot(la9,[la9,bf109]);
  const html=renderLoadoutDecisionEvidence(model(s),s);
  assert.match(html,/HIT \+12/);
  assert.match(html,/HIT \+8/);
  assert.match(html,/\+4 difference/);
  assert.match(html,/does NOT compare damage, reload cycle, armor or skill synergy/);
  assert.match(html,/enhancement \+13/);
  assert.match(html,/Selection audit/);
});
test('ship skill effect has an explicit conditional outcome for Aquila aircraft slot 2',()=>{
  const s=slot(la9,[la9,bf109],1);
  const html=renderLoadoutDecisionEvidence(model(s),s);
  assert.match(html,/Aquila · aircraft slot 2 changes her skill behavior/);
  assert.match(html,/Fighter.*healing\/shielding/);
  assert.match(html,/Dive Bomber.*offensive preload/);
  assert.match(html,/github\.com\/iujab\/Lycoris-AzurAPI/);
});
test('reviewed source comparisons are conditional, sourced and item-ID accurate',()=>{
  const s=slot(la9,[la9,bf109]);
  const html=renderLoadoutDecisionEvidence(model(s),s);
  assert.match(html,/43% more damage than BF-109G/);
  assert.match(html,/52% more than FW-190 A-6/);
  assert.match(html,/medium\/heavy armor/);
  assert.match(html,/Suchiguma · Research Focus/);
  assert.match(html,/third-party comparison, not an independent AVALON simulation/);
  const matched=researchedOptions(s,'boss');
  assert.deepEqual(matched.map(x=>x.item.sourceId),['85600','47160']);
  assert.equal(RESEARCHED_EQUIPMENT_COUNT,6);
});
test('Research Focus Mecklenburg gun comparison mentions sourced % tradeoff and armor',()=>{
  const s=slot(mk305,[mk305,champagne]);
  const html=renderLoadoutDecisionEvidence(model(s,'boss','49909'),s);
  assert.match(html,/approximately 7% higher damage per salvo against medium/);
  assert.match(html,/15% higher against heavy/);
  assert.match(html,/with a faster reload/);
  assert.match(html,/not a simulated damage advantage for this particular ship/);
});
test('research notes cannot attach to unrelated equipment with colliding IDs',()=>{
  const bogus={...la9,category:'Destroyer Gun'};
  const s=slot(bogus,[bogus]);
  assert.deepEqual(researchedOptions(s,'boss'),[]);
  const wrongSource={...la9,source:'editorial'};
  assert.deepEqual(researchedOptions(slot(wrongSource,[wrongSource]),'boss'),[]);
  assert.doesNotMatch(renderLoadoutDecisionEvidence(model(slot(bogus,[bogus])),slot(bogus,[bogus])),/43% more damage/);
});
test('unreviewed gear states the actual limits instead of fabricating a recommendation',()=>{
  const one=gear('99901','Unknown universal weapon','Destroyer Gun');
  const two=gear('99902','Another unknown gun','Destroyer Gun');
  const s=slot(one,[one,two]);
  const html=renderLoadoutDecisionEvidence(model(s,'general','10102'),s);
  assert.match(html,/rarity-driven catalog sort/);
  assert.match(html,/No item-specific, independently evaluated recommendation/);
  assert.match(html,/ammo type and armor multipliers/);
  assert.doesNotMatch(html,/Published specialist comparison/);
});
test('personal selections are never misattributed to auto recommendations',()=>{
  const s={...slot(la9,[la9,bf109]),manual:true};
  const html=renderLoadoutDecisionEvidence(model(s),s);
  assert.match(html,/your saved selection/);
  assert.match(html,/not validated it as optimal/);
});
test('loadout alternatives integrate reasoning, preserve actual options and escape unsafe names',()=>{
  const unsafe=gear('99903','<img src=x onerror=alert(1)>','Fighter',{hit:14});
  const s=slot(unsafe,[unsafe,la9,bf109]);
  const html=renderLoadoutAlternatives(model(s),0);
  assert.match(html,/Why this item appears/);
  assert.match(html,/Selection audit/);
  assert.match(html,/Research-informed options in this eligible pool/);
  assert.match(html,/data-action="loadout-select"/);
  assert.match(html,/&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.doesNotMatch(html,/<img src=x onerror/);
});
test('new drawer content is scrollable and uses readable evidence styles',()=>{
  const css=readFileSync(new URL('../assets/styles.css',import.meta.url),'utf8');
  assert.match(css,/\.loadout-evidence\{/);
  assert.match(css,/\.loadout-evidence-reviewed\{/);
  assert.match(css,/\.loadout-evidence-options ul\{/);
  assert.match(css,/\.loadout-evidence p\{font-size:12\.5px/);
});
