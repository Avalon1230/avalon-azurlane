import test from 'node:test';
import assert from 'node:assert/strict';
import { assetCoverage, shipImageUrl, equipmentImageUrl, imageMarkup } from '../src/media.js';

test('verified ship thumbnails use stable game IDs, not generated illustrations', () => {
  assert.equal(shipImageUrl({name:'Musashi'}), 'https://raw.githubusercontent.com/iujab/azurlane-images/main/thumbnails/30510.png');
  assert.equal(shipImageUrl({name:'Unicorn (Retrofit)'}), 'https://raw.githubusercontent.com/iujab/azurlane-images/main/thumbnails/20603.png');
  assert.equal(shipImageUrl({name:'Laffey II',sourceId:'10151'}), 'https://raw.githubusercontent.com/iujab/azurlane-images/main/thumbnails/10151.png');
  assert.equal(shipImageUrl({name:'Harrison',sourceId:'10157'}), null); // not present in audited asset host
});
test('equipment icons are linked by source-record ID', () => {
  assert.equal(equipmentImageUrl({name:'Beaver Squad Tag',sourceId:'500'}), 'https://raw.githubusercontent.com/Fernando2603/AzurLane/main/images/equipment/500.png');
  assert.equal(equipmentImageUrl({name:'Fake',sourceId:'500%20onerror'}), null);
  assert.equal(equipmentImageUrl({name:'Unknown without source'}), null);
});
test('unknown images show a text fallback, without any broken src request', () => {
  const markup=imageMarkup({name:'Harrison',sourceId:'10157',hull:'DD'},'ship');
  assert.match(markup,/Harrison/);
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
  assert.equal(assetCoverage.availableEquipmentIcons,936);
});
test('the image host is allowlisted, not read from potentially malicious catalog fields', () => {
  const malicious={name:'Musashi',sourceId:'30510',image:'https://attacker.example/p.png'};
  assert.equal(shipImageUrl(malicious), 'https://raw.githubusercontent.com/iujab/azurlane-images/main/thumbnails/30510.png');
});
