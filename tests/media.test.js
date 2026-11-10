import test from 'node:test';
import assert from 'node:assert/strict';
import { assetCoverage, shipImageUrl, shipImageSources, equipmentImageUrl, imageMarkup } from '../src/media.js';

test('verified ship thumbnails use stable game IDs, not generated illustrations', () => {
  assert.equal(shipImageUrl({name:'Musashi'}), 'https://raw.githubusercontent.com/iujab/azurlane-images/main/thumbnails/30510.png');
  assert.equal(shipImageUrl({name:'Unicorn (Retrofit)'}), 'https://raw.githubusercontent.com/iujab/azurlane-images/main/thumbnails/20603.png');
  assert.equal(shipImageUrl({name:'Laffey II',sourceId:'10151'}), 'https://raw.githubusercontent.com/iujab/azurlane-images/main/thumbnails/10151.png');
  assert.equal(shipImageUrl({name:'Harrison',sourceId:'10157'}), 'https://raw.githubusercontent.com/Fernando2603/AzurLane/main/images/skin/101570/shipyard.png'); // missing original thumbnail, verified base skin
});
test('equipment icons are linked by source-record ID', () => {
  assert.equal(equipmentImageUrl({name:'Beaver Squad Tag',sourceId:'500'}), 'https://raw.githubusercontent.com/Fernando2603/AzurLane/main/images/equipment/500.png');
  // Equipment variants can share a base icon filename; never assume <ID>.png.
  assert.equal(equipmentImageUrl({name:'Variant',sourceId:'1020'}),
    'https://raw.githubusercontent.com/Fernando2603/AzurLane/main/images/equipment/1000.png');
  assert.equal(equipmentImageUrl({name:'Variant',sourceId:'1120'}),
    'https://raw.githubusercontent.com/Fernando2603/AzurLane/main/images/equipment/1100.png');
  assert.equal(equipmentImageUrl({name:'Fake',sourceId:'500%20onerror'}), null);
  assert.equal(equipmentImageUrl({name:'Unknown without source'}), null);
  assert.equal(equipmentImageUrl({name:'Unverified',sourceId:'19999999'}),null);
});
test('unknown images show a text fallback, without any broken src request', () => {
  const markup=imageMarkup({name:'Unindexed',sourceId:'99999999',hull:'DD'},'ship');
  assert.match(markup,/Unindexed/);
  assert.match(markup,/>DD<\/span>/);
  assert.doesNotMatch(markup,/<img/);
});
test('remote artwork markup escapes untrusted text and uses no inline script', () => {
  const html=imageMarkup({name:'<img src=x onerror=alert(1)>',hull:'DD'},'ship');
  assert.doesNotMatch(html,/<img src=x/);
  assert.match(html,/&lt;img src=x/);
  assert.doesNotMatch(html,/<img[^>]*\bonerror\s*=/i);
  assert.doesNotMatch(html,/<script/);
  assert.equal(assetCoverage.availableShipThumbnails,746);
  assert.equal(assetCoverage.mappedShipyardPortraits,894);
  assert.equal(assetCoverage.availableEquipmentIcons,936);
});
test('the image host is allowlisted, not read from potentially malicious catalog fields', () => {
  const malicious={name:'Musashi',sourceId:'30510',image:'https://attacker.example/p.png'};
  assert.equal(shipImageUrl(malicious), 'https://raw.githubusercontent.com/iujab/azurlane-images/main/thumbnails/30510.png');
});

test('missing original thumbnails across factions resolve to source-matched shipyard portraits',()=>{
  const samples=[
    ['10156','Collett','DD','101560'],
    ['10236','Vicksburg','CL','102360'],
    ['10720','Bennington','CV','107200'],
    ['20115','Griffin','DD','201150'],
    ['30119','Amatsukaze','DD','301190'],
    ['40114','Ship','DD','401140'],
    ['970602','Ship','DD','9706020'],
    ['1170001','A2','CA','11700010']
  ];
  for(const [sourceId,name,hull,skinId] of samples){
    const expected='https://raw.githubusercontent.com/Fernando2603/AzurLane/main/images/skin/'+skinId+'/shipyard.png';
    const record={sourceId,name,hull};
    assert.equal(shipImageUrl(record),expected);
    const html=imageMarkup(record,'ship','asset-roster-ship');
    assert.match(html,/<img class="asset-img"/);
    assert.ok(html.includes('src="'+expected+'"'),sourceId+' source image missing');
    assert.doesNotMatch(html,/<img[^>]*\bonerror\s*=/i);
  }
});
test('known thumbnails retain their fast primary source and a real shipyard fallback',()=>{
  const url='https://raw.githubusercontent.com/Fernando2603/AzurLane/main/images/skin/118020/shipyard.png';
  assert.deepEqual(shipImageSources({name:'Guam',sourceId:'11802'}),{
    primary:'https://raw.githubusercontent.com/iujab/azurlane-images/main/thumbnails/11802.png',
    fallback:url
  });
  assert.match(imageMarkup({name:'Guam',sourceId:'11802',hull:'CB'},'ship'),
    /data-fallback-src="https:\/\/raw\.githubusercontent\.com\/Fernando2603\/AzurLane\/main\/images\/skin\/118020\/shipyard\.png"/);
  assert.equal(shipImageUrl({name:'Unlisted',sourceId:'10156<svg'}),null);
  assert.equal(shipImageUrl({name:'Unlisted',sourceId:'99999999'}),null);
});
