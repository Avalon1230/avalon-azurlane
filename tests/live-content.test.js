import test from 'node:test';
import assert from 'node:assert/strict';
import {LIVE_SHIPS,liveShip,liveAugments} from '../src/live-content.js';
import {mergeShipCatalog} from '../src/remote.js';
import {detailedShipRecord,renderShipProfile} from '../src/ship-profiles.js';
import {shipBrowseNation,shipCollabSeries} from '../src/ship-factions.js';
import {gameShipSlots} from '../src/game-slot-manifest.js';
import {buildShipLoadout} from '../src/loadout-intelligence.js';
import {candidateAugmentsForShip,allAugmentRecords,augmentRecord} from '../src/augment-manifest.js';
import {augmentIconUrl} from '../src/augment-assets.js';
import {shipImageUrl} from '../src/media.js';
import {EQUIPMENT} from '../src/catalog.js';
import {renderAugmentDetails} from '../src/augment-view.js';

test('two verified collaboration identities retain exact GroupID, hull and collection IDs',()=>{
 assert.deepEqual(LIVE_SHIPS.map(s=>s.sourceId),['1180001','1180002']);
 assert.equal(liveShip('1180001').collectionId,10181);assert.equal(liveShip('1180002').collectionId,10182);
 assert.equal(LIVE_SHIPS[0].hull,'CVL');assert.equal(LIVE_SHIPS[1].hull,'CL');
 for(const s of LIVE_SHIPS){assert.equal(shipBrowseNation(s),'Collab');assert.equal(shipCollabSeries(s),'2.5 Dimensional Seduction');assert.equal(s.rarity,'Super Rare');}
});
test('late upstream additions cannot duplicate or overwrite first-party ship identities',()=>{
 const old={id:'old-saved-id',name:'Old ship',sourceId:'99999',hull:'BB'};
 const feed=[...LIVE_SHIPS.map(s=>({...s,id:'lyc-'+s.sourceId,nation:'Unclassified',rarity:'Unknown'})),{...old,id:'lyc-99999'},...LIVE_SHIPS];
 const merged=mergeShipCatalog([...LIVE_SHIPS,old],feed);
 assert.equal(merged.length,3);assert.equal(merged[2].id,'old-saved-id');
 for(const s of LIVE_SHIPS){const r=merged.find(r=>r.sourceId===s.sourceId);assert.equal(r.id,s.id);assert.equal(r.source,'avalon-verified');assert.equal(r.nation,s.nation);assert.equal(r.rarity,'Super Rare');}
});
test('offline profiles have reviewed levels, skill conditions and linked event acquisition',()=>{
 const r=liveShip('1180001'),m=liveShip('1180002');
 assert.equal(detailedShipRecord(null,'1180001').stats.level120.health,5123);
 assert.equal(m.detail.stats.level125.firepower,148);assert.equal(r.detail.stats.level125.aviation,386);
 assert.match(r.detail.skills[0].description,/disables this skill’s HP restoration/);
 assert.equal(r.detail.skills.filter(s=>s.augmentOnly).length,1);
 const html=renderShipProfile({ship:r.index,data:r.detail,wikiFacts:r.wiki,artworkSkins:r.artwork,status:'failed'});
 assert.match(html,/#\/events\/angels-azur-stage/);assert.match(html,/Requires exclusive augment at \+10/);assert.match(html,/CC BY-NC-SA/);assert.doesNotMatch(html,/These details come from Lycoris/);
});
test('new ships use exact five-slot client restrictions and preserve sixth augment slot',()=>{
 for(const id of ['1180001','1180002']){
  const r=liveShip(id),game=gameShipSlots(id),model=buildShipLoadout({ship:r.index,data:r.detail,wikiFacts:r.wiki,equipment:EQUIPMENT,mode:'general'});
  assert.equal(model.slots.length,6);assert.equal(game.slots.length,5);assert.equal(game.shipId,r.collectionId);
  assert.deepEqual(game.slots[3].types,id==='1180001'?[10,15]:[10,14]);
  assert.equal(model.slots[5].selected.sourceId,id==='1180001'?'15960':'15980');
  assert.equal(model.slots[5].selected.source,'avalon-verified');
 }
});
test('exclusive augments use verified item IDs, +10 stats and exact collection eligibility',()=>{
 assert.equal(allAugmentRecords().filter(a=>a.source==='avalon-verified').length,2);
 assert.deepEqual(augmentRecord('15960').stats.map(s=>[s.base,s.max]),[[32,40],[9,15]]);
 assert.deepEqual(augmentRecord('15980').stats.map(s=>[s.base,s.max]),[[25,35],[5,15]]);
 assert.equal(candidateAugmentsForShip({shipId:10181,hullId:6})[0].sourceId,'15960');
 assert.equal(candidateAugmentsForShip({shipId:10182,hullId:2})[0].sourceId,'15980');
 assert.equal(candidateAugmentsForShip({shipId:10182,hullId:6}).some(a=>a.source==='avalon-verified'),false);
 assert.equal(candidateAugmentsForShip({shipId:1180001,hullId:6}).some(a=>a.source==='avalon-verified'),false);
 for(const a of liveAugments())assert.match(renderAugmentDetails(a),/Event schedule & missions/);
});
test('new portraits and augment icons are exact sourced art, never regular equipment guesses',()=>{
 assert.match(shipImageUrl(LIVE_SHIPS[0]),/Liliel_Angel_ParatroopersRirisa\.png$/);
 assert.match(augmentIconUrl(augmentRecord('15960')),/Augment_15960\.png$/);
 assert.match(augmentIconUrl(augmentRecord('15980')),/Augment_15980\.png$/);
 assert.equal(liveShip('1180003'),null);assert.equal(augmentRecord('15940'),null);
});
