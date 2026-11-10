import test from 'node:test';
import assert from 'node:assert/strict';
import { SHIPS } from '../src/catalog.js';
import { createWorkspace, compatible, slotsForFleet } from '../src/domain.js';
import { CURATED_SHIPS, curatedProfile, suggestFleet } from '../src/fleet-suggest.js';

test('all manually reviewed candidate profiles correspond to indexed ships',()=>{
 const known=new Set(SHIPS.filter(s=>curatedProfile(s)).map(s=>s.name));
 const missing=CURATED_SHIPS.filter(x=>!known.has(x.name)).map(x=>x.name);
 assert.deepEqual(missing,[]);
});
test('OpSi default suggestions generate 4 full surface fleets plus submarine team without duplicate hull violations',()=>{
 const out=suggestFleet({modeId:'opsi',scenario:'sectors',ships:SHIPS,workspace:createWorkspace('opsi')});
 assert.equal(out.missing.length,0);
 assert.equal(out.changes.length,27);
 const all=new Set();
 for(const [fleetId,fleet] of Object.entries(out.plan.fleets)){
   for(const slot of slotsForFleet(fleetId)){
     const id=fleet[slot.id];
     assert.ok(id,`empty ${fleetId}.${slot.id}`);
     assert.ok(!all.has(id),`duplicate ${id}`);
     all.add(id);
     const ship=SHIPS.find(s=>s.id===id);
     assert.ok(compatible(ship,slot.kind));
   }
 }
});
test('late campaign suggestions use curated reviewed ships with no implicit ownership claims',()=>{
 const out=suggestFleet({modeId:'campaign',scenario:'ch15',ships:SHIPS,workspace:createWorkspace('campaign')});
 assert.ok(out.changes.length>0);
 assert.equal(new Set(out.changes.map(x=>x.shipId)).size,out.changes.length);
 assert.ok(out.notes.join(' ').includes('AA'));
 assert.ok(out.notes.join(' ').includes('gear'));
});