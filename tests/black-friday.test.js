import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {eventRows,occurrenceStatus,formatEventTime,normalizeEventFilters} from '../src/events.js';
import {renderEventDetail} from '../src/events-view.js';
import {blackFridayArtwork} from '../src/black-friday-artwork.js';
import {renderShipProfile} from '../src/ship-profiles.js';

const read=name=>JSON.parse(readFileSync(new URL('../data/events/'+name,import.meta.url)));
const catalog=read('catalog.json'), ledger=read('black-friday-evidence.json');
const get=id=>catalog.events.find(e=>e.id===id);
const now=Date.parse('2026-11-23T00:00:00Z');
const detail=(eventId,occurrenceId)=>renderEventDetail({catalog,eventId,occurrenceId,filters:normalizeEventFilters(),now});
const activities=['black-friday-rerun-outfits','black-friday-skin-coupon','black-friday-cruise-missions','black-friday-returnee-stash','heartful-remedies','heartful-remedies-outfit-shop','heartful-remedies-rentals','campaign-drop-support-2026','anchorage-haven-of-innocence'];
test('all 66 released identities and 221 occurrence IDs survive in their original order',()=>{
  const ids=catalog.events.filter(e=>!activities.includes(e.id)).map(e=>[e.id,e.occurrences.map(o=>o.id).filter(id=>id!=='effulgence-archive-en-20261119')]);
  assert.equal(ids.length,66);
  assert.equal(ids.flatMap(([,runs])=>runs).length,221);
  assert.equal(createHash('sha256').update(JSON.stringify(ids)).digest('hex'),ledger.baselineIdDigest);
});
test('EN deadlines classify at the published second and render across Manila midnight',()=>{
  const groups=[['2026-12-10T14:59:00+08:00',activities.slice(0,7).filter(id=>id!==activities[1])],['2026-12-10T14:59:59+08:00',[activities[1]]],['2026-12-03T14:59:00+08:00',[activities[7]]],['2026-11-26T14:59:00+08:00',[activities[8]]]];
  for(const [time,ids] of groups)for(const id of ids){
    const e=get(id),[run]=e.occurrences,end=Date.parse(time);
    assert.deepEqual(e.occurrences.map(o=>o.region),['EN']);
    assert.equal(run.start.kind,'maintenance');assert.equal(run.start.value,undefined);
    assert.equal(Date.parse(run.end.value),end);assert(run.end.value.endsWith('-07:00'));
    for(const [at,status] of [[Date.parse('2026-11-18T00:00Z'),'upcoming'],[now,'ongoing'],[end-1,'ongoing'],[end,'ended']])assert.equal(occurrenceStatus(run,at),status,id);
  }
  assert.match(formatEventTime(get(activities[1]).occurrences[0].end),/10 Dec 2026.*14:59:59/);
  for(const region of ['JP','CN'])assert(!eventRows(catalog,{region},now).some(r=>activities.includes(r.event.id)));
});
test('eligibility, free and paid rewards, daily missions, and rental vouchers stay distinct',()=>{
  assert.match(get(activities[0]).description,/before June 1, 2026.*Collaboration/);
  assert.match(detail(activities[1]),/Event artwork unavailable/);
  assert.match(get(activities[1]).description,/300 Gems.*one eligible.*with Gems/);
  const cruise=get(activities[2]);assert.match(cruise.content[0].description,/Coupon and blueprints/);assert.match(cruise.content[1].description,/Wisdom Cubes/);
  const stash=get(activities[3]);assert.equal(stash.occurrences[0].phases[0].at.kind,'date');assert.match(stash.content[0].description,/in-game/);assert.doesNotMatch(stash.content[0].description,/880/);
  assert.match(get(activities[6]).description,/three rental vouchers/);assert.doesNotMatch(get(activities[7]).description,/\d/);
});
test('purchase and rental links resolve the same verified skin and both original gallery variants',()=>{
  for(const {ship,shipId,skinId,name,category} of ledger.outfits){
    const [skin]=blackFridayArtwork[shipId], files=ledger.files.filter(f=>f.title.startsWith('File:'+ship+'Hospital'));
    assert.equal(files.length,3);assert.equal(skin.id,skinId);assert.equal(skin.name,name);
    for(const [field,suffix] of [['wiki','Hospital.png'],['wikiNoBackground','WithoutBG.png']])assert.equal(skin.images[field],files.find(f=>f.title.endsWith(suffix)).url);
    for(const id of activities.slice(5,7)){
      const item=get(id).content.find(i=>i.skinId===skinId);
      assert.equal(item.kind,'outfit');assert.equal(item.artwork.url,files.find(f=>f.title.endsWith('Icon.png')).url);
      assert(item.description.includes(category));assert(detail(id).includes('#/ships/'+shipId+'?skin='+skinId));
    }
    const fallback=renderShipProfile({status:'failed',artworkSkins:[skin]});
    assert(fallback.includes(name)&&fallback.includes(skin.sourceUrl)&&fallback.includes('Without background'));
  }
  const napoli=get(activities[5]).content[0];assert.equal(napoli.cost,1180);assert.match(napoli.description,/L2D\+.*1,180.*1,260/);assert(napoli.sourceIds.includes('en-napoli-correction'));
});
test('EN archive lists seven permanent pool and exchange routes only on its own occurrence',()=>{
  const e=get('effulgence-before-eclipse'),archive=e.occurrences.find(o=>o.region==='EN'&&o.kind==='war-archives');
  assert.equal(occurrenceStatus(archive,now),'permanent');
  const expected=['Hatsuzuki · Light Construction','Natori · Light Construction','Unzen · Heavy Construction','Owari · Heavy Construction','Unzen · Special Construction','Unzen · UR Exchange','Asanagi · Merit Shop'];
  assert.deepEqual(e.content.filter(i=>i.occurrenceIds.includes(archive.id)).map(i=>i.name),expected);
  const html=detail(e.id,archive.id);assert.doesNotMatch(html,/Sakura Emblems/);
  for(const o of e.occurrences.filter(o=>o!==archive))assert(!detail(e.id,o.id).includes('event-item-light-hatsuzuki'));
});
