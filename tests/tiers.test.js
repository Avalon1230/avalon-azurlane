import test from 'node:test';
import assert from 'node:assert/strict';
import { TIER_BOARDS, catalogForBoard, eligibleForBoard, freshTierBoards, normalizeTierBoards, moveTierItem, boardAssignmentCount } from '../src/tiers.js';
const ships = [
  { id:'musashi', name:'Musashi', hull:'BB' },
  { id:'little-bel', name:'Little Bel', hull:'CL' },
  { id:'unicorn', name:'Unicorn', hull:'CVL' },
  { id:'kisaragi', name:'Kisaragi', hull:'DD' },
  { id:'unreviewed', name:'Unknown Character', hull:'BB' },
  { id:'fritz', name:'Friedrich der Große', hull:'BB' },
  { id:'test-dd', name:'Adult Destroyer With No Review', hull:'DD' },
];
const equipment = [{ id:'fer-100',name:'Prototype Gun',category:'Battleship Gun' }];
test('four distinct boards and tier alphabets', () => {
  assert.deepEqual(Object.keys(TIER_BOARDS), ['ships','equipment','waifu','protect']);
  assert.ok(TIER_BOARDS.waifu.tiers.includes('SSS'));
  assert.ok(!TIER_BOARDS.ships.tiers.includes('SSS'));
});
test('character lists rely on explicit portrayal curation, never hull', () => {
  assert.ok(eligibleForBoard('waifu',ships[0]));
  assert.ok(!eligibleForBoard('waifu',ships[1]));
  assert.ok(!eligibleForBoard('waifu',ships[2]));
  assert.ok(!eligibleForBoard('waifu',ships[4]));
  assert.ok(!eligibleForBoard('waifu',ships[6]));
  assert.ok(eligibleForBoard('protect',ships[1]));
  assert.ok(eligibleForBoard('protect',ships[2]));
  assert.ok(eligibleForBoard('protect',ships[3]));
  assert.ok(!eligibleForBoard('protect',ships[0]));
});
test('combat boards include all available valid records without invented rankings', () => {
  assert.equal(catalogForBoard('ships',ships,equipment).length, ships.length);
  assert.equal(catalogForBoard('equipment',ships,equipment).length,1);
  assert.equal(catalogForBoard('waifu',ships,equipment).length,2);
});
test('published combat assessments cannot be manually changed', () => {
  const initial=freshTierBoards();
  assert.throws(()=>moveTierItem(initial,'ships','musashi','EX',ships),/published research/);
  assert.throws(()=>moveTierItem(initial,'equipment','fer-100','S',equipment),/published research/);
  assert.deepEqual(initial.ships,{});
});
test('waifu and headpats remain independent personal boards', () => {
  const first=moveTierItem(freshTierBoards(),'waifu','musashi','SSS',catalogForBoard('waifu',ships,equipment));
  assert.equal(first.waifu.musashi,'SSS');
  const next=moveTierItem(first,'protect','little-bel','SSS',catalogForBoard('protect',ships,equipment));
  assert.equal(next.protect['little-bel'],'SSS');
  assert.equal(next.waifu.musashi,'SSS');
  const reset=moveTierItem(next,'waifu','musashi','unranked',ships);
  assert.equal(reset.waifu.musashi,undefined);
  assert.equal(reset.protect['little-bel'],'SSS');
});
test('ineligible and unknown assignments are refused', () => {
  assert.throws(()=>moveTierItem(freshTierBoards(),'waifu','little-bel','SSS',ships),/not eligible/);
  assert.throws(()=>moveTierItem(freshTierBoards(),'waifu','unreviewed','S',ships),/not eligible/);
  assert.throws(()=>moveTierItem(freshTierBoards(),'waifu','musashi','ZZ',ships),/Unknown tier/);
  assert.throws(()=>moveTierItem(freshTierBoards(),'waifu','not-in-source','SSS',ships),/not eligible/);
});
test('persisted JSON is normalized without code or unknown tiers', () => {
  const output=normalizeTierBoards({ships:{musashi:'EX',bad:'BLURGH','<x>':'S'}, protect:{'little-bel':'SSS'},evil:{musashi:'S'}});
  assert.deepEqual(output.ships,{});
  assert.deepEqual(output.protect,{'little-bel':'SSS'});
  assert.equal(output.evil,undefined);
  assert.equal(boardAssignmentCount(output.protect, ships),1);
});