import test from 'node:test';
import assert from 'node:assert/strict';
import { genericAugmentCandidates, genericAugmentById, GENERIC_AUGMENT_SOURCE } from '../src/augment-candidates.js';
import { renderAugmentDossier } from '../src/loadout-view.js';

test('generic augment coverage spans supported hull categories without inventing exclusive modules',()=>{
  const cases=['DD','CL','CA','CB','BB','BC','CV','CVL','SS','SSV','AR','AE','BM','IX'];
  for(const hull of cases){
    const entries=genericAugmentCandidates(hull);
    assert.ok(entries.length>0, 'No generic augment candidates for '+hull);
    for(const item of entries){
      assert.equal(item.source,'augment-snapshot');
      assert.equal(item.craftable,true);
      assert.equal(item.category,'Augment');
      assert.match(item.id,/^aug-\d+$/);
      assert.ok(item.stats.every(stat=>Number.isFinite(stat.max)));
      assert.equal(genericAugmentById(hull,item.id)?.id,item.id);
    }
  }
  assert.deepEqual(genericAugmentCandidates('UNKNOWN'),[]);
  assert.equal(genericAugmentById('CB','aug-999999'),null);
});
test('generic augment candidate selection obeys source class type, not image or rarity alone',()=>{
  const cb=genericAugmentCandidates('CB'),dd=genericAugmentCandidates('DD');
  assert.ok(cb.some(x=>x.name==='Greatsword'));
  assert.ok(cb.some(x=>x.name==='Lance'));
  assert.equal(cb.some(x=>x.name==='Dual Swords'),false);
  assert.ok(dd.some(x=>x.name==='Dual Swords'));
  assert.equal(dd.some(x=>x.name==='Greatsword'),false);
  assert.equal(cb[0].rarity,'Elite');
  assert.equal(cb[0].sourceUrl,GENERIC_AUGMENT_SOURCE);
});
test('augment intelligence drawer displays dated source and actual stats, not false gear art',()=>{
  const item=genericAugmentCandidates('CB')[0];
  const html=renderAugmentDossier(item);
  assert.match(html,/AUGMENT INTELLIGENCE/);
  assert.match(html,/game-data snapshot/);
  assert.match(html,/May 2, 2026/);
  assert.match(html,/data-action="loadout-close-augment"/);
  assert.match(html,/AzurLaneData augments.json/);
  assert.doesNotMatch(html,/asset-img|generated image|guaranteed best/);
  assert.equal(renderAugmentDossier({source:'editorial'}),'');
});
