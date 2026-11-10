import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
  validArtworkCatalog,artworkSkinsForShip,loadArtworkCatalog,ARTWORK_CATALOG_URL
} from '../src/artwork-catalog.js';

const catalog=JSON.parse(readFileSync(new URL('../data/ship-artwork.json',import.meta.url),'utf8'));
test('reconstructed artwork source covers all baseline ships with no guessed painting URLs',()=>{
  assert.equal(validArtworkCatalog(catalog),true);
  assert.equal(catalog.shipCount,894);
  assert.equal(catalog.skinCount,2613);
  assert.equal(Object.keys(catalog.ships).length,894);
  const total=Object.values(catalog.ships).reduce((sum,x)=>sum+x.length,0);
  assert.equal(total,catalog.skinCount);
});
test('New Jersey, Guam, Amagi(CV) paintings are ID-accurate assembled assets',()=>{
  for(const [id,expected] of [['10517',6],['11802',3],['30715',4]]) {
    const rows=artworkSkinsForShip(catalog,id);
    assert.equal(rows.length,expected);
    assert.match(rows[0].images.painting,new RegExp('/images/skin/'+rows[0].id+'/painting\\.png$'));
    assert.ok(rows.every(x=>!x.images.painting.includes('azurlane-images/main/paintings')));
  }
  const nj=artworkSkinsForShip(catalog,'10517');
  assert.equal(nj[3].name,'Dancing in the Moonlight');
  assert.match(nj[3].images.painting,/105173\/painting\.png$/);
  assert.match(nj[3].images.paintingNoBackground,/105173\/painting_n\.png$/);
  assert.equal(artworkSkinsForShip(catalog,'10517?').length,0);
});
test('invalid skin rows do not construct arbitrary third party URLs',()=>{
  const fake={ships:{'10517':[
    ['1','Missing',0],
    [105170,'Normal',1],
    [105171,'',1],
    ['javascript:alert(1)','Evil',0]
  ]}};
  const rows=artworkSkinsForShip(fake,'10517');
  assert.equal(rows.length,1);
  assert.equal(rows[0].images.paintingNoBackground.endsWith('105170/painting_n.png'),true);
});
test('artwork manifest loader validates shape and can operate through an injected fetcher',async()=>{
  assert.match(String(ARTWORK_CATALOG_URL),/data\/ship-artwork\.json$/);
  const fetcher=async()=>({ok:true,json:async()=>catalog});
  const result=await loadArtworkCatalog(fetcher);
  assert.equal(result.ships['10517'].length,6);
  await assert.rejects(loadArtworkCatalog(async()=>({ok:true,json:async()=>({})})),/Invalid artwork index/);
});
