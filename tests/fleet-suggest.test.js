import test from 'node:test';
import assert from 'node:assert/strict';
import { CURATED_SHIPS, SCENARIOS, curatedProfile, recipe, suggestFleet, gearAdvisories } from '../src/fleet-suggest.js';

const hullMap={
  'Musashi':'BB','Bismarck Zwei':'BB','New Jersey':'BB','Alsace':'BB','Vanguard':'BB','Mecklenburg':'BB','Lion':'BB','Sovetsky Soyuz':'BB','Raffaello':'BB',
  'Unicorn (Retrofit)':'CVL','Aquila':'CV','Volga':'CV','Independence (Retrofit)':'CVL','Essex':'CV','Implacable':'CV','Max Immelmann':'CV','Fritz Rumey':'CV','Yorktown II':'CV','Hakuryuu':'CV','Admiral Nakhimov':'CV','Cowpens':'CVL','Perseus':'CVL',
  'Guam':'CB','Brest':'CB','Ägir':'CB','Anchorage':'CA','Cheshire':'CA','Plymouth':'CL','Shimanto':'CL','San Diego (Retrofit)':'CL','Helena (Retrofit)':'CL','Unzen':'CA','Laffey II':'DD','Shimakaze':'DD','Harbin':'CL','Noshiro':'CL',
  'U-81':'SS','U-96':'SS','U-47':'SS'
};
const ships=CURATED_SHIPS.map((s,i)=>({id:`p-${i}`,name:s.name,hull:hullMap[s.name]}));
assert.ok(ships.every(s=>s.hull));
const slotNames={surface:['main-1','main-2','main-3','vanguard-1','vanguard-2','vanguard-3'],sub:['sub-1','sub-2','sub-3'],support:['support-1','support-2','support-3']};
const fleetIds={opsi:['opsi-a','opsi-b','opsi-c','opsi-d','sub'],campaign:['mob','boss','support','sub'],meta:['meta','sub'],exercises:['attack','defense']};
function plan(modeId){const fleets=Object.fromEntries((fleetIds[modeId]||['daily']).map(id=>[id,Object.fromEntries((slotNames[id==='sub'?'sub':id==='support'?'support':'surface']).map(slot=>[slot,null]))]));return {modeId,fleets};}
function ids(result){return Object.values(result.plan.fleets).flatMap(x=>Object.values(x)).filter(Boolean)}

test('profiles carry review links and role dimensions for every scenario',()=>{
 assert.ok(CURATED_SHIPS.every(p=>p.roles?.length&&p.sources?.length));
 assert.ok(curatedProfile(ships[0]));
 assert.ok(!curatedProfile({name:'Unverified Ultra Rare'}));
 assert.equal(recipe('campaign','ch15').mob['main-2'],'mHeal');
 assert.ok(SCENARIOS.opsi.length>0);
});
test('fleet suggestion is deterministic and avoids duplicate ships across OpSi fleets',()=>{
 const a=suggestFleet({modeId:'opsi',scenario:'sectors',ships,workspace:plan('opsi')});
 const b=suggestFleet({modeId:'opsi',scenario:'sectors',ships,workspace:plan('opsi')});
 assert.deepEqual(a.plan,b.plan);
 assert.equal(new Set(ids(a)).size, ids(a).length);
 assert.equal(ids(a).length,27);
 assert.equal(a.missing.length,0);
});
test('generator preserves locked assignments and does not mutate input',()=>{
 const workspace=plan('campaign');workspace.fleets.mob['main-1']=ships.find(s=>s.name==='Musashi').id;
 const before=structuredClone(workspace);
 const out=suggestFleet({modeId:'campaign',scenario:'ch15',ships,workspace});
 assert.deepEqual(workspace,before);
 assert.equal(out.plan.fleets.mob['main-1'],workspace.fleets.mob['main-1']);
 assert.ok(!out.changes.some(c=>c.fleetId==='mob'&&c.slotId==='main-1'));
 assert.equal(new Set(ids(out)).size,ids(out).length);
});
test('owned-only empty pool cannot invent available ships',()=>{
 const out=suggestFleet({modeId:'opsi',ships,workspace:plan('opsi'),ownedOnly:true,ownedIds:[]});
 assert.equal(out.changes.length,0);
 assert.equal(out.missing.length,27);
 assert.ok(out.notes.join(' ').includes('Owned-only'));
});
test('owned-only pool restricts all new assignments to supplied IDs',()=>{
 const allowed=ships.slice(0,8).map(s=>s.id);
 const out=suggestFleet({modeId:'campaign',ships,workspace:plan('campaign'),ownedOnly:true,ownedIds:allowed});
 assert.ok(out.changes.every(c=>allowed.includes(c.shipId)));
 assert.ok(out.missing.length>0);
});
test('unknown ships and rarity-only choices are excluded from automatic picks',()=>{
 const extended=[...ships,{id:'fake-ur',name:'Super Strong Rarity Ultra',hull:'BB',rarity:'Ultra Rare'}];
 const out=suggestFleet({modeId:'campaign',ships:extended,workspace:plan('campaign')});
 assert.ok(!ids(out).includes('fake-ur'));
});
test('no incompatible surface, carrier-support or submarine assignment',()=>{
 const out=suggestFleet({modeId:'campaign',ships,workspace:plan('campaign')});
 const byId=new Map(ships.map(s=>[s.id,s]));
 for(const [fleet,fleetPlan] of Object.entries(out.plan.fleets))for(const [slot,id] of Object.entries(fleetPlan))if(id){
 const hull=byId.get(id).hull;
 if(slot.startsWith('main'))assert.ok(['BB','CV','CVL'].includes(hull));
 if(slot.startsWith('vanguard'))assert.ok(['CB','CL','CA','DD'].includes(hull));
 if(slot.startsWith('support'))assert.ok(['CV','CVL'].includes(hull));
 if(slot.startsWith('sub'))assert.equal(hull,'SS');
 }
});
test('partial plan explicitly signals missing candidates and unverified mechanics',()=>{
 const tiny=ships.slice(0,2);
 const out=suggestFleet({modeId:'opsi',ships:tiny,workspace:plan('opsi')});
 assert.ok(out.missing.length>0);
 assert.ok(out.notes.some(note=>note.includes('unfilled')));
 assert.ok(out.notes.some(note=>note.includes('do not optimize equipment or simulate skill timing')));
});
test('duplicate locked ships and incompatible manual placements fail closed',()=>{
 const workspace=plan('campaign');workspace.fleets.mob['main-1']=ships[0].id;workspace.fleets.boss['main-1']=ships[0].id;
 assert.throws(()=>suggestFleet({modeId:'campaign',ships,workspace}),/assignments invalid/);
 workspace.fleets.boss['main-1']=null;workspace.fleets.mob['vanguard-1']=ships[0].id;
 assert.throws(()=>suggestFleet({modeId:'campaign',ships,workspace}),/assignments invalid/);
});
test('campaign and opsi equipment guidance is transparent, not a gear optimizer',()=>{
 const c=gearAdvisories('campaign','ch15');
 assert.ok(c.some(x=>x.label==='ASW coverage'));
 assert.ok(gearAdvisories('opsi','sectors').some(x=>x.label==='Burst synchronization'));
 assert.ok(gearAdvisories('meta','boss')[0].text.includes('check that your gear fits'));
});
