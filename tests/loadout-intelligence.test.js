import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LOADOUT_MODES,slotCategories,verifiedShipSlots,loadoutDisplaySlots,candidatesForSlot,
  buildShipLoadout,validateManualChoice,candidateEvidence
} from '../src/loadout-intelligence.js';
import { renderLoadoutPanel,renderLoadoutAlternatives } from '../src/loadout-view.js';
import { renderShipProfile } from '../src/ship-profiles.js';

const ship={id:'lyc-11802',sourceId:'11802',name:'Guam',hull:'CB',nation:'Eagle Union',rarity:'Ultra Rare'};
const data={
  id:'11802',names:{en:'Guam'},rarity:'Ultra Rare',
  slots:[
    {type:'Heavy Cruiser Gun',minEfficiency:1.05,maxEfficiency:1.2},
    {type:'Anti-Air Gun',minEfficiency:1,maxEfficiency:1.1},
    {type:'Large Cruiser Gun',minEfficiency:1.25,maxEfficiency:1.45}
  ],skills:[],stats:{level120:{health:9000}}
};
const wiki={
  sourceId:'11802',augmentType:'Sword',
  slots:[
    {type:'CB Guns / CA Guns',minEfficiency:1.1,maxEfficiency:1.3,maxMounts:2},
    {type:'DD Guns',minEfficiency:1,maxEfficiency:1.2,maxMounts:1},
    {type:'AA Guns',minEfficiency:1,maxEfficiency:1.1,maxMounts:1}
  ]
};
const gear=(id,name,typeCode,category,rarity='Super Rare',stats={},forbiddenHullIds=[])=>({
  id:'fer-'+id,sourceId:String(id),source:'fernando',name,category,rarity,typeCode,
  forbiddenHullIds,stats,enhancement:10
});
const equipment=[
  gear(1000,'Large Cruiser Gun A',11,'Large Cruiser Gun','Super Rare',{hit:4}),
  gear(1020,'Large Cruiser Gun B',11,'Large Cruiser Gun','Ultra Rare',{hit:18,anti_siren:2}),
  gear(1040,'Heavy Cruiser Gun',3,'Heavy Cruiser Gun','Elite',{cannon:45}),
  gear(1060,'DD Gun A',1,'Destroyer Gun','Super Rare',{reload:2}),
  gear(1080,'DD Gun B',1,'Destroyer Gun','Elite',{reload:14}),
  gear(1100,'AA Gun',6,'Anti-Air Gun','Super Rare',{antiaircraft:45}),
  gear(1120,'Forbidden AA',6,'Anti-Air Gun','Ultra Rare',{antiaircraft:70},[18]),
  gear(1140,'Not a CB fighter',7,'Fighter','Ultra Rare',{air:40}),
  {...gear(1160,'Editorial',11,'Large Cruiser Gun'),'source':'editorial'}
];

test('slot category parsing is strict and knows sourced wiki and Lycoris terminology',()=>{
  assert.deepEqual(slotCategories('CB Guns / CA Guns'),['Large Cruiser Gun','Heavy Cruiser Gun']);
  assert.deepEqual(slotCategories('AA Guns'),['Anti-Air Gun']);
  assert.deepEqual(slotCategories('Fighter'),['Fighter']);
  assert.deepEqual(slotCategories('DD Guns, Light Cruiser Guns'),['Destroyer Gun','Light Cruiser Gun']);
  assert.deepEqual(slotCategories('Unknown Main Slot'),[]);
  assert.deepEqual(slotCategories('<script>'),[]);
});
test('wiki slot efficiencies are applied only for exact matching numeric ship ID',()=>{
  const slots=verifiedShipSlots(data,wiki);
  assert.equal(slots.length,3);
  assert.equal(slots[0].maxMounts,2);
  assert.equal(slots[0].maxEfficiency,1.3);
  assert.equal(slots[0].source,'Koumakan Wiki');
  assert.equal(verifiedShipSlots(data,{...wiki,sourceId:'11803'})[0].source,'Lycoris-AzurAPI');
});
test('candidates obey both actual sourced slot type and potential hull bans',()=>{
  const first=verifiedShipSlots(data,wiki)[0];
  const rows=candidatesForSlot(ship,first,equipment,'general');
  assert.deepEqual(rows.map(x=>x.id),['fer-1020','fer-1000','fer-1040']);
  const aa=candidatesForSlot(ship,verifiedShipSlots(data,wiki)[2],equipment);
  assert.deepEqual(aa.map(x=>x.id),['fer-1100']);
  assert.equal(rows.some(x=>x.id==='fer-1140'),false);
  assert.equal(rows.some(x=>x.id==='fer-1160'),false);
  assert.deepEqual(candidatesForSlot({...ship,hull:'UNKNOWN'},first,equipment),[]);
});
test('mode-specific ordering uses only source-reported attributes; never invents DPS',()=>{
  const model=buildShipLoadout({ship,data,wikiFacts:wiki,equipment,mode:'boss'});
  assert.equal(model.mode,'boss');
  assert.equal(model.slots[0].selected.id,'fer-1020');
  assert.match(model.slots[0].explanation,/HIT \+18/);
  assert.match(model.slots[0].explanation,/not a combat score/);
  const mob=buildShipLoadout({ship,data,wikiFacts:wiki,equipment,mode:'mobbing'});
  assert.equal(mob.slots[1].selected.id,'fer-1080');
  assert.match(mob.slots[1].explanation,/RLD \+14/);
  const opsi=buildShipLoadout({ship,data,wikiFacts:wiki,equipment,mode:'opsi'});
  assert.match(opsi.slots[0].explanation,/Anti-Siren \+2/);
  assert.equal(LOADOUT_MODES.length,4);
});
test('saved manual picks must still match exact slot, type and hull',()=>{
  const changed=buildShipLoadout({ship,data,wikiFacts:wiki,equipment,
    overrides:{0:'fer-1040',1:'fer-1140',2:'fer-1120'}});
  assert.equal(changed.slots[0].selected.id,'fer-1040');
  assert.equal(changed.slots[0].manual,true);
  assert.equal(changed.slots[1].manual,false);
  assert.equal(changed.slots[2].selected.id,'fer-1100');
  assert.equal(validateManualChoice(changed,0,'fer-1040'),true);
  assert.equal(validateManualChoice(changed,1,'fer-1140'),false);
  assert.equal(validateManualChoice(changed,2,'fer-1120'),false);
});
test('missing slots and unsupported categories must not receive synthetic equipment',()=>{
  const missing=buildShipLoadout({ship,data:{id:'11802',slots:[]},equipment});
  assert.equal(missing.slots.length,6);
  assert.equal(missing.slots.slice(0,3).every(slot=>!slot.verified&&slot.selected===null),true);
  assert.equal(missing.slots[5].kind,'augment');
  const unsupported=buildShipLoadout({ship,data:{id:'11802',slots:[{type:'Unconfirmed Beam Cannon'}]},equipment});
  assert.equal(unsupported.slots[0].selected,null);
  assert.equal(unsupported.slots[0].verified,false);
  assert.match(candidateEvidence(unsupported.slots[0],null),/No equipment candidate/);
});
test('ship profile embeds tactical planner beneath identity but outside artwork',()=>{
  const model=buildShipLoadout({ship,data,wikiFacts:wiki,equipment});
  const html=renderShipProfile({ship,data,loadoutModel:model,artworkSkins:[]});
  assert.match(html,/class="ship-profile-left"/);
  assert.match(html,/class="ship-loadout-panel"/);
  assert.ok(html.indexOf('class="ship-profile-overview"')<
    html.indexOf('class="ship-loadout-panel"'));
  assert.ok(html.indexOf('class="ship-loadout-panel"')<
    html.indexOf('class="ship-art-panel"'));
  assert.match(html,/data-action="loadout-mode"/);
  assert.match(html,/data-action="loadout-inspect" data-equip="fer-1020"/);
  assert.match(html,/data-action="loadout-slot-info" data-slot="0"/);
  assert.match(html,/SOURCE-MATCHED|Source-matched/);
  assert.doesNotMatch(html,/Simulated DPS|Best in slot|guaranteed optimum/);
});
test('alternative chooser exposes authentic source icons and lets users select legal records',()=>{
  const model=buildShipLoadout({ship,data,wikiFacts:wiki,equipment});
  const html=renderLoadoutAlternatives(model,0);
  assert.match(html,/class="picker-panel detail-panel loadout-picker-panel"/);
  assert.match(html,/data-action="loadout-select" data-slot="0" data-equip="fer-1040"/);
  assert.match(html,/data-action="loadout-inspect" data-equip="fer-1000"/);
  assert.match(html,/asset-picker/);
  assert.doesNotMatch(html,/data-equip="fer-1140"/);
  assert.equal(renderLoadoutAlternatives(model,99),'');
});
test('loadout UI escapes untrusted equipment names and ship slot types',()=>{
  const hacked=gear(1200,'<svg onload=alert(1)>',11,'Large Cruiser Gun','Ultra Rare');
  const model=buildShipLoadout({ship,data,wikiFacts:wiki,equipment:[hacked]});
  const html=renderLoadoutPanel(model);
  assert.match(html,/&lt;svg onload=alert\(1\)&gt;/);
  assert.doesNotMatch(html,/<svg/);
  assert.doesNotMatch(html,/class="loadout-slot-explanation"/);
  assert.match(renderLoadoutAlternatives(model,0),/No verified mode-specific performance advantage/);
});

test('standard ship display has exactly three weapon, two provisional auxiliary and one augment position',()=>{
  assert.equal(verifiedShipSlots(data,wiki).length,3);
  const slots=loadoutDisplaySlots(data,wiki);
  assert.equal(slots.length,6);
  assert.deepEqual(slots.map(x=>x.kind),['weapon','weapon','weapon','auxiliary','auxiliary','augment']);
  assert.equal(slots[3].provisional,true);
  assert.equal(slots[4].provisional,true);
  assert.equal(slots[5].augmentType,'Sword');
  const model=buildShipLoadout({ship,data,wikiFacts:wiki,equipment});
  assert.equal(model.slots.length,6);
  assert.equal(model.slots[0].selected?.id,'fer-1020');
  assert.equal(model.slots[3].selected,null);
  assert.equal(model.slots[4].selected,null);
  assert.equal(model.slots[5].selected,null);
  assert.match(model.slots[3].explanation,/standard equipment layout/);
  assert.match(model.slots[5].explanation,/no augment is selected/);
});
test('manual auxiliary choices remain potential, source-matched, and never auto-equipped',()=>{
  const auxiliary=gear(1180,'Source Auxiliary',10,'Auxiliary','Super Rare',{durability:180});
  const dataset=[...equipment,auxiliary];
  const auto=buildShipLoadout({ship,data,wikiFacts:wiki,equipment:dataset});
  assert.ok(auto.slots[3].candidates.some(x=>x.id==='fer-1180'));
  assert.equal(auto.slots[3].selected,null);
  assert.equal(validateManualChoice(auto,3,'fer-1180'),true);
  assert.equal(validateManualChoice(auto,5,'fer-1180'),false);
  const picked=buildShipLoadout({ship,data,wikiFacts:wiki,equipment:dataset,overrides:{3:'fer-1180',5:'fer-1180'}});
  assert.equal(picked.slots[3].selected?.id,'fer-1180');
  assert.equal(picked.slots[3].manual,true);
  assert.equal(picked.slots[5].selected,null);
  assert.match(picked.slots[3].explanation,/not verified/);
});
test('source-recorded extra equipment positions are preserved before inferred auxiliaries and augment',()=>{
  const documented={...data,slots:[...data.slots,
    {type:'Auxiliary',minEfficiency:1,maxEfficiency:1},
    {type:'Auxiliary',minEfficiency:1,maxEfficiency:1}]};
  const six=loadoutDisplaySlots(documented,wiki);
  assert.deepEqual(six.map(x=>x.kind),['weapon','weapon','weapon','auxiliary','auxiliary','augment']);
  assert.equal(six[3].source,'Lycoris-AzurAPI');
  assert.equal(six[4].provisional,false);
  const extra={...data,slots:[...documented.slots,{type:'Auxiliary'}]};
  const exceptional=loadoutDisplaySlots(extra,wiki);
  assert.equal(exceptional.length,7); // third source-confirmed auxiliary is not discarded
  assert.deepEqual(exceptional.slice(3,6).map(x=>x.kind),['auxiliary','auxiliary','auxiliary']);
  assert.equal(exceptional[6].kind,'augment');
});
test('compact planner uses two rows of three, retains click-to-inspect, and hides explanations until requested',()=>{
  const model=buildShipLoadout({ship,data,wikiFacts:wiki,equipment});
  const html=renderLoadoutPanel(model);
  assert.match(html,/class="loadout-slots loadout-compact-grid"/);
  assert.equal((html.match(/class="loadout-compact-slot/g)||[]).length,6);
  assert.match(html,/data-action="loadout-inspect" data-equip="fer-1020"/);
  assert.match(html,/data-action="loadout-slot-info" data-slot="5"/);
  assert.doesNotMatch(html,/class="loadout-slot-explanation"/);
  const detail=renderLoadoutAlternatives(model,5);
  assert.match(detail,/Augment modules require a dedicated verified module database/);
  assert.match(detail,/No source-confirmed selectable equipment/);
  assert.doesNotMatch(detail,/data-action="loadout-select"/);
  assert.match(renderLoadoutAlternatives(model,3),/Potential auxiliary position/);
});
