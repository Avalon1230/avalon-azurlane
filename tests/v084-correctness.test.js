import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {AVALON_ASSESSMENTS,validateAssessments} from '../src/assessments.js';
import {matchAssessmentCatalogItem} from '../src/assessment-view.js';
import {filteredLoadoutCandidates,renderLoadoutAlternatives,renderLoadoutPanel} from '../src/loadout-view.js';
import {renderShipProfile} from '../src/ship-profiles.js';

const matchedItem={id:'fer-44320',source:'fernando',sourceId:'44320',
  name:'Prototype Quadruple 305mm SKC39 Main Gun Mount',category:'Battleship Gun',rarity:'Ultra Rare'};
const options=Array.from({length:152},(_,i)=>({
  id:'fer-'+(1000+i),sourceId:String(1000+i),source:'fernando',
  name:'Equipment Option '+String(i+1).padStart(3,'0'),category:'Auxiliary',rarity:'Rare'
}));
const slot={index:3,kind:'auxiliary',type:'Auxiliary',source:'May 2026 source',verified:true,
  provisional:false,candidates:options,selected:options[0],manual:false,
  explanation:'Compatible source category, not a reviewed best item'};
const model={sourceId:'11802',mode:'general',description:'General',slots:[slot]};
const picks=html=>(html.match(/data-action="loadout-select"/g)||[]).length;

test('Aquila assessment prioritizes skill condition and distinguishes both actual aircraft configurations',()=>{
  const aquila=AVALON_ASSESSMENTS.find(x=>x.key==='aquila-campaign');
  assert.ok(aquila);
  assert.match(aquila.rationale,/fighter.+second aircraft slot.+healing and shielding/i);
  assert.match(aquila.rationale,/dive bomber.+offensive/i);
  assert.equal(aquila.configurations.length,2);
  assert.match(aquila.caveat,/Skyraider.+NOT the healing configuration/i);
  assert.ok(aquila.sources.includes('skillData'));
  const mk7=AVALON_ASSESSMENTS.filter(x=>x.name.includes('406mm/45 MK7'));
  assert.equal(mk7.length,0,'never label Series 8 Mecklenburg data as MK7');
  assert.deepEqual(validateAssessments(),[]);
});
test('equipment identity for Series 8 gun requires exact source ID AND title',()=>{
  const review=AVALON_ASSESSMENTS.find(x=>x.key==='mecklenburg305-boss');
  assert.equal(review.sourceId,'44320');
  assert.equal(matchAssessmentCatalogItem(review,[matchedItem]),matchedItem);
  assert.equal(matchAssessmentCatalogItem(review,[{...matchedItem,sourceId:'44321'}]),null);
  assert.equal(matchAssessmentCatalogItem(review,[{...matchedItem,name:'Prototype Triple 406mm/45 MK7 Main Gun Mount'}]),null);
  assert.match(review.rationale,/not the Eagle Union Triple 406mm\/45 MK7/);
});
test('Guam-style 152 candidate drawer supports searching and eventual access to EVERY item',()=>{
  const first=renderLoadoutAlternatives(model,3);
  assert.equal(picks(first),50);
  assert.match(first,/152 eligible/);
  assert.match(first,/data-action="loadout-more-alternatives"/);
  assert.doesNotMatch(first,/Use the Equipment Index for the full list/);
  const later=renderLoadoutAlternatives(model,3,{query:'Option 152'});
  assert.equal(picks(later),1);
  assert.match(later,/Equipment Option 152/);
  const expanded=renderLoadoutAlternatives(model,3,{limit:200});
  assert.equal(picks(expanded),152);
  assert.doesNotMatch(expanded,/loadout-more-alternatives/);
  assert.equal(filteredLoadoutCandidates(slot,'Option 152').length,1);
  assert.equal(filteredLoadoutCandidates(slot,'not an option').length,0);
});
test('slot picker escapes input instead of inserting executable markup',()=>{
  const html=renderLoadoutAlternatives(model,3,{query:'" autofocus onfocus="alert(1)'});
  assert.match(html,/&quot; autofocus onfocus=&quot;/);
  assert.doesNotMatch(html,/value="" autofocus/);
});
test('resolved gear slots never render a contradictory Lycoris fallback alongside planner',()=>{
  const ship={id:'lyc-99901',sourceId:'99901',name:'Langley',hull:'CVL',rarity:'Rare'};
  const data={id:'99901',names:{en:'Langley'},slots:[
    {type:'Artillery (Destroyer)'},{type:'Artillery (Destroyer)'}
  ],stats:{},skills:[]};
  const resolved={sourceId:'99901',mode:'general',description:'General',slots:[
    {index:0,kind:'weapon',type:'Fighter',source:'AzurLaneData · May 2026',verified:true,
      categories:['Fighter'],selected:null,manual:false,candidates:[],
      explanation:'No compatible equipment'}
  ]};
  const html=renderShipProfile({ship,data,loadoutModel:resolved});
  assert.match(html,/Equipment slots/);
  assert.match(html,/AzurLaneData · May 2026/);
  assert.doesNotMatch(html,/Artillery \(Destroyer\)/);
  assert.match(html,/Shared with loadout planner/);
});
test('item tiles distinguish personal selections from mere compatibility candidates',()=>{
  const base=renderLoadoutPanel(model);
  assert.match(base,/Auto-filled · unreviewed/);
  assert.doesNotMatch(base,/Reviewed recommendation/);
  const personal=renderLoadoutPanel({...model,slots:[{...slot,manual:true}]});
  assert.match(personal,/Your pick/);
});
test('Aquila loadout exposes role switch without pretending that arbitrary default is a healer preset',()=>{
  const second={...slot,index:1,kind:'weapon',type:'Fighter \/ Dive Bomber',
    categories:['Fighter','Dive Bomber'],selected:{name:'AD-1 Skyraider',id:'fer-300',category:'Dive Bomber'}};
  const html=renderLoadoutPanel({sourceId:'60701',mode:'general',description:'General',slots:[second]});
  assert.match(html,/Fighter = healing\/shielding/);
  assert.match(html,/Dive Bomber = offensive preload\/damage/);
  assert.match(html,/compatibility candidate, not a selected healer preset/);
});
test('responsive layout rules contain intrinsic min-width at each critical breakpoint',()=>{
  const css=readFileSync(new URL('../assets/styles.css',import.meta.url),'utf8');
  assert.match(css,/\.app-shell\{grid-template-columns:minmax\(0,1fr\)\}/);
  assert.match(css,/\.ship-profile-top\{grid-template-columns:minmax\(0,1fr\)\}/);
  assert.match(css,/\.loadout-slots\.loadout-compact-grid\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(css,/\.equipment-search-row\{flex-wrap:wrap\}/);
});
