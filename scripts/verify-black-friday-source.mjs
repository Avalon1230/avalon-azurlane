import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const evidence=JSON.parse(await readFile(new URL('../data/events/black-friday-evidence.json',import.meta.url)));
const response=await fetch(evidence.client.url,{signal:AbortSignal.timeout(60000)});
assert(response.ok,'Pinned EN client HTTP '+response.status);
const bytes=Buffer.from(await response.arrayBuffer());
assert.equal(createHash('sha256').update(bytes).digest('hex'),evidence.client.sha256);
const rows=new Map();
for(const match of bytes.toString('utf8').matchAll(/^_G\.pg\.base\.ship_skin_template\[(\d+)\] = \{([\s\S]*?)^\}/gm))rows.set(match[1],match[2]);
for(const {skinId,shipId,name,ship} of evidence.outfits){
  const row=rows.get(skinId);
  assert.equal(row?.match(/^\s*name = "([^"]+)"/m)?.[1],name);
  assert.equal(row.match(/^\s*ship_group = (\d+),/m)?.[1],shipId);
  assert.equal(rows.get(shipId+'0')?.match(/^\s*name = "([^"]+)"/m)?.[1],ship);
}
console.log('PASS Black Friday: verified three EN ship/skin pairs and names against the pinned client SHA-256.');
