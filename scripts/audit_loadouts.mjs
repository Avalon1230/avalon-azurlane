/** Offline full-roster audit. Download the documented source JSON into a local
 * directory, then run: node scripts/audit_loadouts.mjs .audit
 * Raw datasets are not committed. Output includes hashes for reproducibility.
 */
import {readFileSync,readdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {normalizeShips,normalizeEquipment} from '../src/remote.js';
import {buildShipLoadout,LOADOUT_MODES,slotCategories} from '../src/loadout-intelligence.js';
import {gameShipSlots} from '../src/game-slot-manifest.js';
import {augmentRecord,AUGMENT_RECORDS} from '../src/augment-manifest.js';
import {parseWikiShipFacts,extractShipFields} from '../src/wiki-ship-facts.js';
const directory=process.argv[2]||'.audit',hashes={};
function read(name){
  const bytes=readFileSync(resolve(directory,name));
  hashes[name]=createHash('sha256').update(bytes).digest('hex');
  return JSON.parse(bytes);
}
const ships=read('ships.json'),rawGear=read('equipment.json');
const snapshot=read('augment-ships.json'),augments=read('augments.json');
const equipment=normalizeEquipment(rawGear);
const wiki=new Map();
for(const file of readdirSync(directory).filter(f=>/^wiki-.*\.json$/.test(f))){
  const page=read(file).parse,fields=extractShipFields(page.wikitext);
  const facts=parseWikiShipFacts(page.wikitext,fields.GroupID,{pageTitle:page.title,revision:page.revid});
  if(facts)wiki.set(facts.sourceId,facts);
}
const roster=normalizeShips(Object.values(ships).map(s=>({id:s.id,name:s.names.en,hullType:s.hullType,rarity:s.rarity})));
let manifestCount=0;
for(const source of Object.values(snapshot)){
  const record=gameShipSlots(source.gid);
  assert.ok(record);
  assert.equal(record.shipId,source.id);
  assert.equal(record.hullId,source.hull);
  assert.deepEqual(record.slots.map(s=>s.types),source.slots.at(-1).map(s=>s.types));
  manifestCount++;
}
assert.equal(AUGMENT_RECORDS,Object.keys(augments).length);
for(const [id,source] of Object.entries(augments)){
  const record=augmentRecord(id);
  assert.equal(record.name,source.name);
  assert.equal(record.limitGroup,source.limit_group);
  assert.equal(record.typeCode,source.type);
}
const result={ships:roster.length,equipment:equipment.length,manifestCount,
  wiki:[...wiki.values()].map(w=>({sourceId:w.sourceId,title:w.pageTitle,revision:w.revision,hullId:w.hullId})),modes:{}};
for(const mode of LOADOUT_MODES){
  let populated=0,complete=0;const empty=[];
  for(const ship of roster){
    const data=ships[ship.sourceId];
    for(const slot of data.slots)assert.ok(slotCategories(slot.type).length,slot.type);
    const model=buildShipLoadout({ship,data,equipment,wikiFacts:wiki.get(ship.sourceId),mode:mode.id});
    assert.equal(model.slots.length,6,ship.name);
    const limits=new Set();
    for(const slot of model.slots){
      const item=slot.selected;
      if(!item){empty.push({id:ship.sourceId,name:ship.name,slot:slot.index+1,reason:slot.explanation});continue;}
      populated++;
      if(item.kind==='augment')continue;
      assert.ok(slot.categories.includes(item.category),ship.name);
      if(slot.typeCodes.length)assert.ok(slot.typeCodes.includes(item.typeCode),ship.name);
      if(slot.hullId!==null)assert.ok(!item.forbiddenHullIds.includes(slot.hullId),ship.name);
      if(item.equipLimit){assert.ok(!limits.has(item.equipLimit),ship.name);limits.add(item.equipLimit);}
    }
    if(model.slots.every(s=>s.selected))complete++;
  }
  result.modes[mode.id]={complete,populated,empty};
}
console.log(JSON.stringify({hashes,...result},null,2));
