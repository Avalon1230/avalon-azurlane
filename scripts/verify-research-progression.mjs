import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {RESEARCH_PROGRESSION_DATA as data} from '../src/research-progression-data.js';
import {RESEARCH_MANIFEST} from '../src/research-manifest.js';
import {luaRecord} from './lua-data.mjs';
import {buildProgressionRecords} from './research-progression-data.mjs';
const raw={};
await Promise.all(data.sources.map(async s=>{
 const response=await fetch('https://raw.githubusercontent.com/AzurLaneTools/AzurLaneLuaScripts/'+data.commit+'/'+s.path);assert.equal(response.status,200,s.path);
 const text=await response.text();assert.equal(createHash('sha1').update('blob '+Buffer.byteLength(text)+'\0').update(text).digest('hex'),s.blob,s.path+' Git blob');assert.equal(createHash('sha256').update(text).digest('hex'),s.sha256,s.path+' SHA256');raw[s.path]=text;
}));
const client={records:{}};
for(const r of Object.values(RESEARCH_MANIFEST.records)){
 const row=client.records[r.id]={};
 for(const table of ['ship_data_statistics','ship_data_template']){
  row[table]=[];
  for(let lb=1;lb<=4;lb++){
   const id=Number(r.id)*10+lb,source=luaRecord(raw['EN/sharecfgdata/'+table+'.lua'],table,id);assert.ok(source,id);
   const keys=Object.keys(data.records[r.id].forms[lb-1][table==='ship_data_statistics'?'statistics':'template']);
   row[table].push(Object.fromEntries(keys.map(k=>[k,source[k]])));
  }
 }
}
const rebuilt=buildProgressionRecords(RESEARCH_MANIFEST,client,raw['EN/sharecfg/ship_data_blueprint.lua'],raw['EN/sharecfg/ship_strengthen_blueprint.lua'],raw['EN/sharecfg/skill_data_template.lua']);
assert.deepEqual(rebuilt,{records:data.records,skills:data.skills});
assert.match(raw['EN/model/vo/ship.lua'],/slot1\[slot7\] = slot1\[slot7\] \+ calcFloor\(slot8\)/);
assert.match(raw['EN/model/vo/ship.lua'],/\(slot0.level - 1\) \* slot2.attrs_growth\[slot3\] \/ 1000/);
assert.match(raw['EN/sharecfg/intimacy_template.lua'],/attr_bonus = 600/);
assert.match(raw['EN/sharecfg/gameset.lua'],/extra_attr_level_limit = \{\s*description = "",\s*key_value = 100/);
console.log('PASS '+data.sources.length+' pinned client files, 47 ships / 188 forms, 1,410 Dev stages, 170 Fate stages and '+Object.keys(data.skills).length+' skill descriptions; client formula identities verified.');
