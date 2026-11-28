import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {luaRecord} from './lua-data.mjs';
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

const catalog=JSON.parse(await readFile(new URL('../data/events/catalog.json',import.meta.url)));
const archive=catalog.events.find(event=>event.id==='effulgence-before-eclipse');
async function pinnedText(source){
  const response=await fetch(source.url,{signal:AbortSignal.timeout(60000)});
  assert(response.ok,'Pinned client HTTP '+response.status+' '+source.url);
  const body=Buffer.from(await response.arrayBuffer());
  assert.equal(createHash('sha256').update(body).digest('hex'),source.sha256,source.url);
  return body.toString('utf8');
}
const {archiveShips,cnNameCodes}=evidence.regionalReview;
const enNames=archiveShips.find(source=>source.region==='EN').names;
for(const source of archiveShips){
  const text=source.region==='EN'?bytes.toString('utf8'):await pinnedText(source);
  for(const [id,name] of Object.entries(source.names)){
    const row=text.match(new RegExp('^_G\\.pg\\.base\\.ship_skin_template\\['+id+'0\\] = \\{([\\s\\S]*?)^\\}','m'))?.[1];
    assert(row,'Missing base skin '+source.region+' '+id);
    assert.equal(row.match(/^\s*name = "([^"]+)"/m)?.[1],name);
    assert.equal(row.match(/^\s*ship_group = (\d+),/m)?.[1],id);
  }
  for(const item of archive.content.filter(item=>item.regions.includes(source.region))){
    assert.equal(enNames[item.shipId],item.name.split(' · ')[0]);
    assert(Object.hasOwn(source.names,item.shipId));
  }
}
const codes=await pinnedText(cnNameCodes);
for(const tag of Object.values(archiveShips.find(source=>source.region==='CN').names)){
  const id=tag.match(/^\{namecode:(\d+)\}$/)?.[1];
  const row=codes.match(new RegExp('pg\\.base\\.name_code\\['+id+'\\] = \\{([^}]+)'))?.[1];
  assert(row,'Missing CN name-code '+id);
  assert.equal(row.match(/\bcode = "([^"]+)"/)?.[1],cnNameCodes.codes[id]);
}
console.log('PASS archive ship identities in EN, JP and CN, including CN publisher aliases.');

const merit=evidence.regionalReview.cnMeritShop;
const [shopText,poolText]=await Promise.all([pinnedText(merit.shop),pinnedText(merit.pool)]);
const shop=luaRecord(shopText,'shop_template',merit.shopId);
const pool=luaRecord(poolText,'arena_data_shop',merit.poolId);
assert.equal(shop.genre,'arena_shop');
assert.equal(shop.time,'always');
assert.deepEqual(shop.effect_args,[merit.shipFormId]);
assert.equal(shop.resource_num,merit.price);
assert(pool[merit.poolList].some(([id,weight])=>id===merit.shopId&&weight>0));
const item=archive.content.find(i=>i.id==='cn-merit-asanagi');
assert.equal(item.shipId,String(Math.floor(merit.shipFormId/10)));
assert.equal(item.cost,shop.resource_num);
assert.equal(item.currency,'Merit');
console.log('PASS Asanagi CN Merit Shop exchange and rotation.');
