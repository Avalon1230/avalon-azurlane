import test from 'node:test';
import assert from 'node:assert/strict';
import {RESEARCH_MANIFEST} from '../src/research-manifest.js';
import {researchShip,researchSelection,selectedMilestones,researchFrame,missionCountdown,countdownLabel,readResearchState,saveResearchState,RESEARCH_STORAGE_KEY} from '../src/research-ships.js';
import {filterShipBrowseRows} from '../src/ship-factions.js';
import {renderResearchModal,renderResearchProgress} from '../src/research-view.js';
import {renderShipRosterTile} from '../src/ship-roster.js';
import {renderCatalogIndex} from '../src/catalog-index.js';
import {compareSlot} from '../src/combat-evaluate.js';
const neptune=researchShip('29901'),drake=researchShip('29904');
const roster=[{id:'neptune',sourceId:'29901',name:'Neptune',nation:'Royal Navy',hull:'CL',rarity:'Priority'},{id:'drake',sourceId:'29904',name:'Drake',nation:'Royal Navy',hull:'CA',rarity:'Decisive'},{id:'fake',sourceId:'999999',name:'Test',nation:'Royal Navy',hull:'CA',rarity:'Decisive'}];
test('research requires exact source identity, not rarity, name or ID shape',()=>{
 assert.equal(neptune.classification,'PR');assert.equal(drake.classification,'DR');
 for(const bad of [null,undefined,{},'lyc-29901','__proto__',{id:'Neptune',rarity:'Priority'},{sourceId:'999999',rarity:'Decisive'}])assert.equal(researchShip(bad),null);
 assert.equal(Object.keys(RESEARCH_MANIFEST.records).length,47);
 assert.deepEqual([...new Set(Object.values(RESEARCH_MANIFEST.records).map(r=>r.series))].sort(),[1,2,3,4,5,6,7,8,9]);
});
test('combined Research intersects nation, hull, search, rarity and series',()=>{
 assert.equal(filterShipBrowseRows(roster,{research:true}).length,2);
 assert.deepEqual(filterShipBrowseRows(roster,{research:true,hull:'CA',rarity:'Ultra Rare',query:'Drake',nation:'Royal Navy',researchSeries:'3'}),[roster[1]]);
 assert.equal(filterShipBrowseRows(roster,{research:true,nation:'Collab'}).length,0);
 assert.equal(filterShipBrowseRows(roster,{researchSeries:'1'}).length,1);
 assert.equal(filterShipBrowseRows(roster,{research:true,researchSeries:'99'}).length,0);
});
test('research entry works from nation landing and exposes one combined filter',()=>{
 const landing=renderCatalogIndex({kind:'ships',records:roster,renderCard:renderShipRosterTile});
 assert.match(landing,/ship-research-toggle/);
 const filtered=renderCatalogIndex({kind:'ships',records:roster,research:true,renderCard:renderShipRosterTile});
 assert.equal((filtered.match(/data-action="ship-research-toggle"/g)||[]).length,1);
 assert.match(filtered,/research-series/);assert.doesNotMatch(filtered,/data-ship="fake"/);
});
test('original PR and DR ornaments preserve portraits and keep center transparent',()=>{
 assert.match(researchFrame(roster[0]),/research-frame-pr/);assert.match(researchFrame(roster[1]),/linearGradient/);
 assert.match(renderShipRosterTile(roster[1]),/research-frame-dr/);assert.equal(researchFrame(roster[2]),'');
 assert.match(researchFrame(roster[0]),/aria-hidden="true"/);assert.doesNotMatch(researchFrame(roster[0]),/<image|<rect/);
});
test('Dev/Fate controls reject malformed states and require Dev 30 for Fate',()=>{
 assert.deepEqual(researchSelection(neptune,null),{dev:30,fate:0,start:null,complete:[]});
 assert.equal(researchSelection(neptune,{dev:20,fate:5}).fate,0);
 assert.equal(researchSelection(neptune,{dev:31,fate:Infinity}).dev,30);
 const noFate=Object.values(RESEARCH_MANIFEST.records).find(r=>r.fateIds.length===0);
 assert.equal(researchSelection(noFate,{dev:30,fate:5}).fate,0);
 assert.doesNotMatch(renderResearchProgress(noFate.id),/id="research-fate"/);
 assert.match(renderResearchProgress(neptune.id),/id="research-fate"/);
});
test('milestones remain ship-specific with honest gaps and no invented stats',()=>{
 const reached=selectedMilestones(neptune,{dev:5});assert.equal(reached.length,1);assert.match(reached[0].value.join(' '),/199 base hp/);
 assert.equal(selectedMilestones(neptune,{dev:30,fate:5}).length,11);
 assert.match(renderResearchProgress(neptune.id,{dev:5}),/not calculated yet/);
 assert.equal(selectedMilestones(researchShip('29906'),{dev:30}).length,0);
});
test('47 ships have eight source-linked tasks, gates and prerequisite records',()=>{
 for(const r of Object.values(RESEARCH_MANIFEST.records)){
  assert.equal(r.missions.length,8);assert.ok(r.unlock);assert.ok(r.fateIds.length===0||r.fateIds.length===5);
  for(const m of r.missions){assert.ok(Number.isInteger(m.id));assert.ok(m.objective.length>10);assert.ok(Number.isInteger(m.gateSeconds));assert.ok(Array.isArray(m.prerequisiteTaskIds));}
 }
 assert.deepEqual(neptune.missions.map(m=>m.gateSeconds),[0,86400,172800,259200,345600,432000,518400,518400]);
 assert.match(neptune.missions[0].objective,/1,000,000.*Royal Navy Vanguard/);
 assert.ok(researchShip('19901').missions[3].prerequisiteTaskIds.includes(60072));
});
test('countdowns use research start, never imply automatic mission completion',()=>{
 assert.equal(missionCountdown(neptune.missions[1],1000,1000),86400);
 assert.equal(missionCountdown(neptune.missions[1],1000,86401001),0);
 assert.equal(missionCountdown(neptune.missions[1],1000,86400001),1);
 assert.match(countdownLabel(0),/check the mission requirements/);
 for(const args of [[null,0],[{gateSeconds:NaN},0],[{gateSeconds:-1},0],[{gateSeconds:1},null],[{gateSeconds:1},Infinity],[{gateSeconds:Number.MAX_SAFE_INTEGER},0]])assert.equal(missionCountdown(...args),null);
});
test('research tracking persists separately and rejects foreign mission IDs',()=>{
 const saved=new Map([['avalon.azurlane.loadouts.v1','manual picks']]);const storage={getItem:k=>saved.get(k),setItem:(k,v)=>saved.set(k,v)};
 const state={'29901':researchSelection(neptune,{dev:10,start:1234,complete:[60012,60012,9999]})};assert.equal(saveResearchState(storage,state),true);
 assert.deepEqual(readResearchState(storage),state);assert.equal(saved.get('avalon.azurlane.loadouts.v1'),'manual picks');assert.deepEqual(state['29901'].complete,[60012]);
 for(const value of ['null','[]','garbage','{"__proto__":{}}']){saved.set(RESEARCH_STORAGE_KEY,value);assert.deepEqual(readResearchState(storage),{});}
 assert.equal(saveResearchState({setItem(){throw Error('blocked')}},state),false);
 assert.deepEqual(readResearchState({getItem(){throw Error('blocked')}}),{});
});
test('R&D modal exposes prerequisites, manual timer caveat, close and back',()=>{
 const html=renderResearchModal(neptune.id,{start:1000},2000);
 assert.match(html,/role="dialog"/);assert.match(html,/does not connect/);assert.match(html,/datetime-local/);assert.match(html,/Back to ship/);assert.match(html,/1,000,000/);assert.match(html,/Research Academy/);
 assert.equal((html.match(/data-research-countdown=/g)||[]).length,8);
 assert.equal(renderResearchModal('12345'),'');
});
test('unsupported progression never reaches gun or aircraft comparisons',()=>{
 const result=compareSlot({sourceId:'99901',combatUnsupportedReason:'Selected Dev/Fate is unsupported'},0);
 assert.equal(result.status,'unknown');assert.equal(result.recommended,null);assert.deepEqual(result.rows,[]);assert.match(result.reason,/Dev\/Fate/);
});
test('incomplete research records cannot invent Fate or milestone availability',()=>{
 for(const record of [null,{}, {fateIds:'12345',missions:'invalid',milestones:{}}, {milestones:[null,{}, {descriptor:'Other 1',value:[]},{descriptor:'Dev NaN',value:[]}]}]){
  assert.equal(researchSelection(record,{dev:30,fate:5,complete:[60012]}).fate,0);
  assert.deepEqual(researchSelection(record,{complete:[60012]}).complete,[]);
  assert.deepEqual(selectedMilestones(record,{dev:30,fate:5}),[]);
 }
});
