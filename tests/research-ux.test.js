import test from 'node:test';
import assert from 'node:assert/strict';
import {developmentOptions,compareResearch} from '../src/research-comparison.js';
import {researchProgression} from '../src/research-progression.js';
import {portraitIdentity,researchSelection,researchShip} from '../src/research-ships.js';
import {renderShipProfile} from '../src/ship-profiles.js';
import {renderResearchStats} from '../src/research-stats-view.js';
import {SHIP_NATION_BY_SOURCE_ID} from '../src/catalog-filters.js';

test('checkpoints retain an intermediate saved selection and detailed levels expose all 31 stages',()=>{
 assert.deepEqual(developmentOptions(30),[0,5,10,15,20,25,30]);
 assert.deepEqual(developmentOptions(7),[0,5,7,10,15,20,25,30]);
 assert.deepEqual(developmentOptions(7,true),Array.from({length:31},(_,i)=>i));
});
test('Neptune comparisons calculate exact gains at a shared level, including mount and preload unlocks',()=>{
 const current=researchProgression('29901',{dev:30,level:120});
 const c=compareResearch(current);
 assert.equal(c.baseline.dev,0);assert.equal(c.baseline.level,120);
 assert.equal(c.stats.health,4637-3372);
 const five=compareResearch(researchProgression('29901',{dev:5,level:120}),'checkpoint');
 assert.equal(five.stats.health,3583-3372);assert.equal(five.slots[1].mounts,1);
 const six=compareResearch(researchProgression('29901',{dev:6,level:125}),'previous');
 assert.equal(six.baseline.dev,5);assert.equal(six.baseline.level,125);
});
test('Fate comparisons distinguish prior Fate and fully developed baseline, with skill replacements',()=>{
 const current=researchProgression('29904',{dev:30,fate:5});
 const c=compareResearch(current,'developed');assert.equal(c.stats.luck,25);
 assert.ok(c.addedSkills.some(s=>s.id===18290));assert.ok(c.removedSkills.length);
 const previous=compareResearch(current,'previous');assert.equal(previous.baseline.fate,4);
 assert.equal(compareResearch(current,'checkpoint').baseline.fate,0);
});
test('unknown current or impossible baseline produces no numerical comparison',()=>{
 assert.equal(compareResearch(researchProgression('29901',{dev:30,level:1})).status,'unknown');
 const c=compareResearch(researchProgression('29901',{dev:0,level:1}),'developed');
 assert.equal(c.status,'unknown');assert.equal(c.stats,undefined);
});
test('combined panel has a single statistics section and controls, while Acquisition keeps its modal entry',()=>{
 const ship={id:'lyc-29901',sourceId:'29901',name:'Neptune'};
 const html=renderShipProfile({ship,data:{id:'29901',names:{en:'Neptune'},stats:{},skills:[],slots:[]}});
 for(const id of ['ship-profile-stats','research-dev','research-fate','research-compare'])assert.equal(html.split('id="'+id+'"').length-1,1);
 assert.match(html,/Research &amp; Statistics/);assert.match(html,/data-action="research-open"/);
 assert.match(html,/id="ship-profile-gear"/);assert.match(html,/id="ship-profile-skills"/);
 assert.doesNotMatch(html,/<h2>Research development/);
});
test('all mapped META identities receive frames, while names, rarity and ID patterns cannot invent identity',()=>{
 const metas=Object.entries(SHIP_NATION_BY_SOURCE_ID).filter(([,nation])=>nation==='META');assert.ok(metas.length>20);
 for(const [id]of metas)assert.equal(portraitIdentity({sourceId:id}), 'meta');
 for(const ship of [{name:'Neptune META',id:'999999'}, {id:'97000000',nation:'META'}, {id:'999999',rarity:'Decisive'},null])assert.equal(portraitIdentity(ship),'');
 assert.equal(portraitIdentity('29901'),'pr');assert.equal(portraitIdentity('29904'),'dr');
});
test('rendering comparisons preserves mission tracking and saved intermediate stages',()=>{
 const state=researchSelection(researchShip('29901'),{dev:7,start:1234,complete:[60012]});
 const before=JSON.stringify(state);renderResearchStats(researchProgression('29901',state),'level120','29901',state,{compare:'previous'});
 assert.equal(JSON.stringify(state),before);
});
