import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {RESEARCH_MANIFEST as data} from '../src/research-manifest.js';
const local=process.argv.includes('--local');
async function source(record,path){
 const raw=local?await readFile(path,'utf8'):await fetch(`https://raw.githubusercontent.com/${record.repository}/${record.commit}/${record.path}`).then(r=>{assert.equal(r.status,200);return r.text();});
 assert.equal(createHash('sha256').update(raw).digest('hex'),record.sha256,record.path+' SHA256');
 if(record.blob)assert.equal(createHash('sha1').update('blob '+Buffer.byteLength(raw)+'\0').update(raw).digest('hex'),record.blob,record.path+' Git blob');
 return raw;
}
const [blueprint,tasks,shipsRaw]=await Promise.all([
 source(data.sources.client,'.audit/ship_data_blueprint.lua'),
 source(data.sources.tasks,'.audit/research-task-client.lua'),
 source(data.sources.milestones,'.audit/augment-ships.json')
]);
const ships=Object.values(JSON.parse(shipsRaw));let missionCount=0,milestoneCount=0;
for(const r of Object.values(data.records)){
 const b=blueprint.match(new RegExp('pg\\.base\\.ship_data_blueprint\\['+r.id+'\\] = \\{([\\s\\S]*?)(?=\\n\\tpg\\.base\\.ship_data_blueprint\\[|\\nend\\)\\(\\))'))?.[1];assert.ok(b,r.id);
 assert.equal(Number(b.match(/blueprint_version = (\d+)/)?.[1]),r.series);
 assert.equal(b.match(/unlock_word = "([^"\n]*)"/)?.[1].replace(/<[^>]+>/g,''),r.unlock);
 const gates=b.match(/unlock_task = \{([\s\S]*?)\n\t\t\},/)?.[1];
 assert.deepEqual([...gates.matchAll(/\{\s*(\d+),\s*(\d+)\s*\}/g)].map(x=>[+x[1],+x[2]]),r.missions.map(m=>[m.id,m.gateSeconds]));
 const fate=b.match(/fate_strengthen = \{([\s\S]*?)\}/)?.[1]||'';
 assert.deepEqual([...fate.matchAll(/\d+/g)].map(x=>+x[0]),r.fateIds);
 for(const m of r.missions){
  const block=tasks.match(new RegExp('\\['+m.id+'\\] = \\{([\\s\\S]*?)\\n\\}'))?.[1];assert.ok(block);
  const string=key=>block.match(new RegExp('\\n\\t'+key+' = \\[\\[([\\s\\S]*?)\\]\\],'))?.[1]??JSON.parse(block.match(new RegExp('\\n\\t'+key+' = ("(?:[^"\\\\]|\\\\.)*"),'))?.[1]||'null');
  const desc=string('desc');assert.ok(desc);
  assert.equal(string('name'),m.name);
  assert.equal(desc.split(/\\n|\n/).filter(x=>x.trim()).at(-1).replace(/<[^>]+>/g,'').replace(/^\s*[—–-]\s*/,'').trim(),m.objective);
  assert.equal(desc.split(/\\n|\n/).filter(x=>/must be completed first/i.test(x)).map(x=>x.replace(/<[^>]+>/g,'').trim()).join(' '),m.prerequisiteText);
  assert.equal(Number(block.match(/\n\tlevel = (\d+)/)?.[1]),m.requiredCommanderLevel);
  const open=block.match(/\n\topen_need = \{([\s\S]*?)\}/)?.[1]||'';
  assert.deepEqual([...open.matchAll(/\d+/g)].map(x=>+x[0]),m.prerequisiteTaskIds);
  missionCount++;
 }
 if(r.sourceShipId!==null){const ship=ships.find(x=>x.id===r.sourceShipId);assert.equal(String(ship.gid),r.id);assert.ok(ship.tags.includes('plan-class'));assert.equal(ship.rarity===6?'DR':'PR',r.classification);assert.deepEqual(ship.upgrade_text.filter(x=>/^Dev |^Fate Sim /.test(x.descriptor)),r.milestones);milestoneCount++;}
 else assert.deepEqual(r.milestones,[]);
}
assert.equal(Object.keys(data.records).length,47);assert.equal(missionCount,376);
console.log(`PASS 3 pinned sources, 47 research identities/series/Fate records, ${missionCount} mission objectives/gates/prerequisites, ${milestoneCount} milestone sets`);
