import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {allAugmentRecords,augmentRecord,AUGMENT_RECORDS,announcedAugmentForShip} from '../src/augment-manifest.js';
import {augmentIconKey,augmentIconUrl,augmentImageMarkup,AUGMENT_ICON_ALIASES,AUGMENT_ICON_COUNT} from '../src/augment-assets.js';
import {filterAugmentRecords,renderAugmentIndex} from '../src/augment-index.js';
import {renderAugmentDetails} from '../src/augment-view.js';
import {renderLoadoutPanel,renderLoadoutAlternatives} from '../src/loadout-view.js';
import {renderShipProfile} from '../src/ship-profiles.js';
import {AVALON_ASSESSMENTS,validateAssessments} from '../src/assessments.js';
import {matchAssessmentCatalogItem,renderAssessmentBoard} from '../src/assessment-view.js';

const records=allAugmentRecords();
const verified=records.filter(x=>x.source==='source-augment');
const announced=records.filter(x=>x.source==='official-announcement');

test('augment IDs have 239 source-matched icon keys and precisely 12 source aliases',()=>{
  assert.equal(AUGMENT_RECORDS,239);
  assert.equal(AUGMENT_ICON_COUNT,239);
  assert.equal(verified.length,239);
  assert.equal(announced.length,5);
  assert.equal(records.length,244);
  assert.equal(Object.keys(AUGMENT_ICON_ALIASES).length,12);
  assert.equal(new Set(records.map(x=>x.id)).size,244);
  for(const row of verified){
    assert.match(row.sourceId,/^\d{4,8}$/);
    assert.match(augmentIconKey(row),/^\d{4,8}$/);
    assert.equal(augmentIconUrl(row),'https://al.mrlar.dev/equips/'+augmentIconKey(row)+'.webp');
  }
  assert.equal(augmentIconKey(augmentRecord('1010120')),'1010100');
  assert.equal(augmentIconKey(augmentRecord('1080220')),'1080200');
  assert.equal(augmentIconKey(augmentRecord('10000')),'10000');
});
test('unverified October announcements never receive invented artwork or item identity',()=>{
  for(const row of announced){
    assert.equal(augmentIconKey(row),null);
    assert.equal(augmentIconUrl(row),null);
    assert.doesNotMatch(augmentImageMarkup(row),/<img /);
  }
  const row=announcedAugmentForShip('960017');
  assert.equal(row.name,'Greatstaff of the Lodestar');
  const html=renderAugmentDetails(row);
  assert.match(html,/No verified icon or internal augment item ID/);
  assert.doesNotMatch(html,/<img /);
});
test('augments have searchable and progressively accessible first-class directory',()=>{
  const html=renderAugmentIndex({records});
  assert.match(html,/Augment Modules|Source-linked augment directory/);
  assert.equal((html.match(/data-action="augment-details"/g)||[]).length,60);
  assert.match(html,/Show more \(184 remaining\)/);
  assert.match(html,/augment-type-filter/);
  assert.match(html,/augment-rarity-filter/);
  const match=filterAugmentRecords(records,{query:'Huggy Pillow of Bravery'});
  assert.equal(match.length,1);
  assert.equal(match[0].sourceId,'10000');
  const all=renderAugmentIndex({records,limit:1000});
  assert.equal((all.match(/data-action="augment-details"/g)||[]).length,244);
  assert.doesNotMatch(all,/data-action="augment-load-more"/);
  const empty=renderAugmentIndex({records,query:'unlikely_zzz_ <script>alert(1)</script>'});
  assert.match(empty,/No augments match these filters/);
  assert.doesNotMatch(empty,/<script>alert/);
});
test('augment art appears in equipped tile, alternatives and stats drawer without regular gear aliasing',()=>{
  const row=augmentRecord('1010120');
  const slot={index:5,kind:'augment',type:'Augment',verified:true,source:'AzurLaneData',
    candidates:[row],selected:row,manual:false,explanation:'Exact ship source'};
  const model={sourceId:'10102',mode:'general',description:'Starting point',slots:[slot]};
  const tile=renderLoadoutPanel(model);
  const alternatives=renderLoadoutAlternatives(model,5);
  const dossier=renderAugmentDetails(row);
  for(const html of [tile,alternatives,dossier]){
    assert.match(html,/https:\/\/al\.mrlar\.dev\/equips\/1010100\.webp/);
    assert.doesNotMatch(html,/images\/equipment\/1010120/);
  }
  assert.match(dossier,/Artwork: source icon field 1010100/);
});
test('progression navigation only points to an actual panel',()=>{
  const ship={id:'lyc-10102',sourceId:'10102',name:'Ship Test',hull:'DD',rarity:'Rare'};
  const data={id:'10102',names:{en:'Ship Test'},slots:[],skills:[],stats:{}};
  const empty=renderShipProfile({ship,data});
  assert.doesNotMatch(empty,/data-section="ship-profile-progress"/);
  const present=renderShipProfile({ship,data:{...data,limitBreaks:['Stage One']}});
  assert.match(present,/data-section="ship-profile-progress"/);
  assert.match(present,/id="ship-profile-progress"/);
});
test('combat equipment assessment artwork requires pinned ID and exact expected sourced title',()=>{
  assert.deepEqual(validateAssessments(),[]);
  const la9=AVALON_ASSESSMENTS.find(x=>x.key==='la9-boss');
  assert.equal(la9.sourceId,'85600');
  const row={id:'fer-85600',source:'fernando',sourceId:'85600',name:'Prototype Carrier-Based La-9'};
  assert.equal(matchAssessmentCatalogItem(la9,[row]),row);
  assert.equal(matchAssessmentCatalogItem(la9,[{...row,name:'Unrelated image title'}]),null);
  assert.equal(matchAssessmentCatalogItem(la9,[{...row,sourceId:'85620'}]),null);
  const unpinned=AVALON_ASSESSMENTS.find(x=>x.key==='ta152-boss');
  assert.equal(unpinned.sourceId,undefined);
  assert.equal(matchAssessmentCatalogItem(unpinned,[{...row,name:unpinned.name}]),null);
  const board=renderAssessmentBoard({boardId:'equipment',equipment:[{...row,name:unpinned.name}]});
  assert.match(board,/Exact source ID not verified/);
});
test('new navigation, drawer handling, and search promise are wired in source',()=>{
  const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
  const gearIndex=readFileSync(new URL('../src/equipment-index.js',import.meta.url),'utf8');
  assert.match(app,/id: 'augments', label: 'Augments'/);
  assert.match(app,/action==='augment-details'/);
  assert.match(app,/event\.key==='Escape' && state\.profileAugmentId/);
  assert.match(app,/event\.key==='Escape' && state\.detail\?\.kind==='augment'/);
  assert.doesNotMatch(gearIndex,/Search equipment, effects, names/);
});