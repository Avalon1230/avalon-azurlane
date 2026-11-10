import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeShips, normalizeEquipment, mergeShipCatalog, mergeEquipmentCatalog, loadLiveCatalogs, REMOTE_FEEDS } from '../src/remote.js';
import { compatible, assignShip, createWorkspace, refreshShipIndex, SHIP_MAP } from '../src/domain.js';
import { SHIPS, EQUIPMENT } from '../src/catalog.js';
import { contextCriteria, evaluationState } from '../src/criteria.js';

const ships = Array.from({length:120},(_,i)=>({id:String(10000+i),name:`Test Ship ${i}`,hullType:i%2?'Destroyer':'Aircraft Carrier',rarity:i%2?'Elite':'Super Rare'}));
const gears = Object.fromEntries(Array.from({length:120},(_,i)=>[String(i+600),{name:`Test Equipment ${i}`,type:i%2?6:7,rarity:5,stats:{'1':{enhance:'+0',antiaircraft:8},'14':{enhance:'+13',antiaircraft:40}}}]));

test('live ship source is validated, normalized, and does not invent tiers',()=>{
  const catalog=normalizeShips([...ships,{id:'99999',name:'Golden Hind',hullType:'Sailing Frigate ',rarity:'Super Rare'}]);
  assert.equal(catalog.length,121);
  assert.equal(catalog[0].hull,'CV');
  assert.equal(catalog[1].hull,'DD');
  assert.equal(catalog.at(-1).hull,'IX');
  assert.equal(compatible(catalog.at(-1),'main'),false);
  assert.equal(compatible(catalog.at(-1),'vanguard'),false);
  assert.equal(evaluationState(catalog[0]).tier,null);
  assert.throws(()=>normalizeShips([]),/Unexpected/);
});

test('equipment parser reads highest reported enhancement without inventing acquisition',()=>{
  const catalog=normalizeEquipment(gears);
  assert.equal(catalog.length,120);
  assert.equal(catalog[0].category,'Fighter');
  assert.equal(catalog[1].category,'Anti-Air Gun');
  assert.deepEqual(catalog[0].stats,{antiaircraft:40});
  assert.equal(catalog[0].enhancement,'+13');
  assert.match(catalog[0].acquisition,/Not established/);
  assert.throws(()=>normalizeEquipment({}),/Unexpected/);
});

test('merge preserves old fleet IDs, ship map lookup, and alternate gear variants',()=>{
  const remote=normalizeShips(ships);
  remote[0].name='Musashi';remote[0].hull='BB';
  const merged=mergeShipCatalog(SHIPS,remote);
  assert.equal(merged.filter(x=>x.name==='Musashi').length,1);
  assert.ok(merged.some(x=>x.id==='musashi'));
  const oldMap=new Map(SHIP_MAP);
  refreshShipIndex(merged);
  try {
    const result=assignShip(createWorkspace('campaign'),'mob','main-1','musashi');
    assert.equal(result.fleets.mob['main-1'],'musashi');
  } finally {refreshShipIndex([...oldMap.values()])}
  const external=normalizeEquipment(gears);
  external[0].name='Improved Hydraulic Rudder';
  external[1].name='Improved Hydraulic Rudder';
  const gearMerge=mergeEquipmentCatalog(EQUIPMENT,external);
  assert.ok(gearMerge.find(x=>x.id==='rudder'));
  assert.ok(gearMerge.some(x=>x.id===external[1].id));
});

test('load accepts independent sources, reports partial failure, and reads a version date',async()=>{
  const mock=async url=>{
    if(url===REMOTE_FEEDS.equipment) return {ok:false,status:503,headers:{get:()=>null}};
    const result=url===REMOTE_FEEDS.ships?ships:{generatedAt:'2026-11-09T04:28:25.494Z'};
    return {ok:true,headers:{get:()=>null},text:async()=>JSON.stringify(result)};
  };
  const result=await loadLiveCatalogs(mock);
  assert.equal(result.ships.length,120);
  assert.equal(result.equipment,null);
  assert.equal(result.shipVersion,'2026-11-09T04:28:25.494Z');
  assert.match(result.errors.join(' '),/503/);
});

test('mode-aware evaluation dimensions cover all eight theaters without fabricated scores',()=>{
  for(const mode of ['campaign','opsi','meta','exercises','events','challenge','daily','guild']){
    assert.ok(contextCriteria(mode).length >= 4);
    assert.equal(evaluationState({source:'lycoris'}).tier,null);
  }
});
test('source identity keeps different ships sharing the same name as separate records',()=>{
  const duplicateNames=[
    {id:'10706',name:'Enterprise',hullType:'Aircraft Carrier',rarity:'Super Rare'},
    {id:'20232',name:'Enterprise',hullType:'Light Cruiser',rarity:'Elite'},
    {id:'29901',name:'Neptune',hullType:'Light Cruiser',rarity:'Priority'},
    {id:'1010001',name:'Neptune',hullType:'Destroyer',rarity:'Super Rare'}
  ];
  const source=normalizeShips([...ships,...duplicateNames]);
  const merged=mergeShipCatalog([],source);
  assert.equal(merged.length,source.length);
  assert.deepEqual(merged.filter(x=>x.name==='Enterprise').map(x=>x.sourceId),['10706','20232']);
  assert.deepEqual(merged.filter(x=>x.name==='Neptune').map(x=>x.sourceId),['29901','1010001']);
  const editorial=[{id:'enterprise',name:'Enterprise',hull:'CV'}];
  const withEditorial=mergeShipCatalog(editorial,source);
  assert.equal(withEditorial.filter(x=>x.name==='Enterprise').length,2);
  assert.equal(new Set(withEditorial.filter(x=>x.name==='Enterprise').map(x=>x.sourceId)).size,2);
  assert.equal(withEditorial.find(x=>x.id==='enterprise').sourceId,'10706');
});
