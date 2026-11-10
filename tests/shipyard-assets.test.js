import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SHIPYARD_ASSET_HOST, shipyardManifestCoverage, shipyardPortraitUrl } from '../src/shipyard-assets.js';

test('every artwork-indexed source ship has its own ID-matched game shipyard fallback',()=>{
  const manifest=JSON.parse(readFileSync(new URL('../data/ship-artwork.json',import.meta.url),'utf8'));
  assert.equal(manifest.shipCount,894);
  assert.equal(shipyardManifestCoverage,manifest.shipCount);
  const groups=Object.entries(manifest.ships);
  assert.equal(groups.length,manifest.shipCount);
  for(const [sourceId,skins] of groups){
    const baseId=Number(sourceId)*10;
    assert.ok(skins.some(([skinId])=>skinId===baseId),
      'unverified shipyard base skin for group '+sourceId);
    assert.equal(shipyardPortraitUrl(sourceId),
      SHIPYARD_ASSET_HOST+baseId+'/shipyard.png',
      'wrong character image for ship group '+sourceId);
  }
});

test('do not confuse cross-linked skin indexes with their owning ship identity',()=>{
  // Le Malin μ includes neighboring Le Malin skins in the manifest, but the
  // exact own base skin 901120 must be used, never unrelated 901111.
  assert.equal(shipyardPortraitUrl('90112'),SHIPYARD_ASSET_HOST+'901120/shipyard.png');
  assert.equal(shipyardPortraitUrl('90111'),SHIPYARD_ASSET_HOST+'901110/shipyard.png');
});
test('shipyard image paths require a validated numeric ship group',()=>{
  for(const id of ['',null,'99999999','not-a-ship','10156/evil','10156?x=1','10156.png','0010156','-10156']){
    assert.equal(shipyardPortraitUrl(id),null, 'untrusted group: '+id);
  }
  assert.equal(shipyardPortraitUrl('10720'),SHIPYARD_ASSET_HOST+'107200/shipyard.png');
});
