/** CI online verification: downloads source bytes, checks Git blob identity and every retained record. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
const fixture=JSON.parse(readFileSync(new URL('../data/combat-source.json',import.meta.url)));
const {repository,commit,equipmentBlob,skillsBlob}=fixture.source;
for(const [file,blob,key] of [['equipments',equipmentBlob,'equipment'],['skills',skillsBlob,'skills']]){
  const url=`https://raw.githubusercontent.com/${repository}/${commit}/data/${file}.json`;
  const response=await fetch(url,{signal:AbortSignal.timeout(60000)});
  assert.ok(response.ok,`${url}: HTTP ${response.status}`);
  const bytes=Buffer.from(await response.arrayBuffer());
  assert.equal(createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'),blob,'Source Git blob identity');
  const live=JSON.parse(bytes);
  for(const [id,record] of Object.entries(fixture[key]))assert.deepEqual(record,live[id],`${file} #${id}`);
  console.log(`PASS pinned ${file}: ${Object.keys(fixture[key]).length} exact source records; blob ${blob}`);
}
const client='https://raw.githubusercontent.com/AzurLaneTools/AzurLaneLuaScripts/3fb6befa2f969bd879de2341cdf41a571852a95f/EN/mod/battle/data/';
for(const [path,blob] of [['battleconfig.lua','ccabc5632554a70d3bf1bc71a416c352e6fd14cb'],['battleformulas.lua','482c1407fa3a73584b94aaf9edbcf9faea4418b0']]){
  const response=await fetch(client+path,{signal:AbortSignal.timeout(60000)});assert.ok(response.ok);
  const bytes=Buffer.from(await response.arrayBuffer());
  assert.equal(createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'),blob);
  const text=bytes.toString('utf8');
  if(path==='battleconfig.lua')for(const [key,value] of [['K1','6'],['K2','100'],['K3','3.14']])assert.ok(text.includes(`slot0.${key} = ${value}`));
  else assert.ok(text.includes('slot0 / uv0.K1 / math.sqrt((slot1 + uv0.K2) * uv0.K3)'));
  console.log('PASS client formula identity and constants: '+path+' '+blob);
}
