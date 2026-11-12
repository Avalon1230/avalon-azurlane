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
