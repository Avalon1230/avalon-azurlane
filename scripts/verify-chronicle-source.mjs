/** Bounded pinned-client verification, never execute downloaded Lua. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {luaRecord} from './lua-data.mjs';
import {validateEventCatalog} from '../src/events.js';
const data=JSON.parse(await readFile(new URL('../data/live-content/november-2026.json',import.meta.url)));
const catalog=JSON.parse(await readFile(new URL('../data/events/catalog.json',import.meta.url)));
assert.deepEqual(validateEventCatalog(catalog),[]);
const sources={};await mkdir('.audit/chronicle-client',{recursive:true});
for(const source of data.clientSources){
 const cache='.audit/chronicle-client/'+source.path.split('/').at(-1);
 const raw=process.argv.includes('--local')?await readFile(cache,'utf8'):await fetch(`https://raw.githubusercontent.com/${source.repository}/${source.commit}/${source.path}`,{signal:AbortSignal.timeout(45000)}).then(r=>{assert.equal(r.status,200,source.path);return r.text();});
 assert.equal(createHash('sha256').update(raw).digest('hex'),source.sha256,source.path+' SHA256');
 assert.equal(createHash('sha1').update('blob '+Buffer.byteLength(raw)+'\0').update(raw).digest('hex'),source.blob,source.path+' git blob');
 await writeFile(cache,raw);sources[source.path.split('/').at(-1)]=raw;
}
const record=(table,id)=>{const r=luaRecord(sources[table+'.lua'],table,id);assert.ok(r,table+' '+id);return r;};
for(const [id,ship] of Object.entries(data.ships)){
 const stats=record('ship_data_statistics',id+'4'),template=record('ship_data_template',id+'4');
 assert.equal(template.group_type,Number(id));assert.equal(stats.nationality,118);assert.equal(template.type,ship.slots.hullId);
 for(let i=0;i<5;i++){
  assert.deepEqual(template['equip_'+(i+1)],ship.slots.slots[i].types);
  if(i<3){assert.equal(stats.equipment_proficiency[i],ship.slots.slots[i].maxEfficiency);assert.equal(stats.base_list[i],ship.slots.slots[i].maxMounts);}
 }
 for(const skill of ship.detail.skills)assert.equal(record('skill_data_template',skill.id).name,skill.names.en);
 assert.equal(ship.wiki.sourceId,id);
}
for(const [id,augment] of Object.entries(data.augments)){
 const base=record('spweapon_data_statistics',id),max=record('spweapon_data_statistics',Number(id)+10);
 assert.equal(base.name,augment.name);assert.equal(String(base.unique),augment.shipGroupId);assert.equal(base.type,augment.typeCode);
 for(let i=0;i<2;i++){assert.equal(base['value_'+(i+1)],augment.stats[i].base);assert.equal(max['value_'+(i+1)],augment.stats[i].max);}
 assert.deepEqual(max.skill_upgrade[0],augment.skillUpgrade);
}
console.log('PASS CHRONICLE: eight validated event identities, 34 regional occurrences, four SHA256/blob-pinned client files, two ship identities/slots/skill IDs and two exclusive augments. Wiki-derived stats and prose require independent source review.');
