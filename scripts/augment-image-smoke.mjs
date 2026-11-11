import assert from 'node:assert/strict';
import {allAugmentRecords} from '../src/augment-manifest.js';
import {augmentIconUrl} from '../src/augment-assets.js';

// CI probes the original image bytes, not just construction of a URL.
// This catches HTTP failures and accidental standard-gear path collisions.
const ids=[
  '9000','10000','10020','10280','10380','10800','11000',
  '12000','12100','13680','14080','14400','15140','15300',
  '1010120','1080220'
];
const records=new Map(allAugmentRecords().map(x=>[x.sourceId,x]));
const checked=await Promise.all(ids.map(async id=>{
  const item=records.get(id);
  assert.ok(item,'source entry missing: '+id);
  const url=augmentIconUrl(item);
  assert.match(url,/^https:\/\/raw\.githubusercontent\.com\/JforPlay\/data_for_toy\/main\/spweapon\/[0-9]+\.webp$/);
  const response=await fetch(url,{signal:AbortSignal.timeout(20000)});
  assert.equal(response.status,200,'HTTP '+response.status+' for '+item.name+': '+url);
  const mime=response.headers.get('content-type')||'';
  assert.match(mime,/image\/webp/i,'unexpected MIME '+mime+' for '+url);
  const data=Buffer.from(await response.arrayBuffer());
  assert.ok(data.length>250,'short or empty image: '+item.name);
  assert.equal(data.toString('ascii',0,4),'RIFF','not a RIFF file: '+item.name);
  assert.equal(data.toString('ascii',8,12),'WEBP','not a WebP file: '+item.name);
  return {id,bytes:data.length,name:item.name};
}));
for(const item of checked)console.log('PASS original augment art '+item.id+': '+item.name+' ('+item.bytes+' bytes)');
console.log('PASS '+checked.length+' real original-game augment images downloaded and validated');
