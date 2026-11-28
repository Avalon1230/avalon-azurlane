import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {eventRows,occurrenceStatus,formatEventTime,normalizeEventFilters} from '../src/events.js';
import {renderEventDetail,renderEvents} from '../src/events-view.js';
import {blackFridayArtwork} from '../src/black-friday-artwork.js';
import {renderShipProfile} from '../src/ship-profiles.js';

const read=name=>JSON.parse(readFileSync(new URL('../data/events/'+name,import.meta.url)));
const catalog=read('catalog.json'), ledger=read('black-friday-evidence.json');
const get=id=>catalog.events.find(e=>e.id===id);
const now=Date.parse('2026-11-23T00:00:00Z');
const detail=(eventId,occurrenceId)=>renderEventDetail({catalog,eventId,occurrenceId,filters:normalizeEventFilters(),now});
const activities=['black-friday-rerun-outfits','black-friday-skin-coupon','black-friday-cruise-missions','black-friday-returnee-stash','heartful-remedies','heartful-remedies-outfit-shop','heartful-remedies-rentals','campaign-drop-support-2026','anchorage-haven-of-innocence'];
test('both the released catalog and the recovered PR retain all original IDs in order',()=>{
  for(const baseline of ledger.idBaselines){
    const ids=baseline.occurrencesPerEvent.map((length,index)=>{
      const event=catalog.events[index];
      return [event.id,event.occurrences.slice(0,length).map(o=>o.id)];
    });
    assert.equal(createHash('sha256').update(JSON.stringify(ids)).digest('hex'),baseline.sha256,baseline.ref);
  }
});
test('EN deadlines classify at the published second and render across Manila midnight',()=>{
  const groups=[['2026-12-10T14:59:00+08:00',activities.slice(0,7).filter(id=>id!==activities[1])],['2026-12-10T14:59:59+08:00',[activities[1]]],['2026-12-03T14:59:00+08:00',[activities[7]]],['2026-11-26T14:59:00+08:00',[activities[8]]]];
  for(const [time,ids] of groups)for(const id of ids){
    const e=get(id),[run]=e.occurrences,end=Date.parse(time);
    assert.equal(run.region,'EN');
    assert.equal(run.start.kind,'maintenance');assert.equal(run.start.value,undefined);
    assert.equal(Date.parse(run.end.value),end);assert(run.end.value.endsWith('-07:00'));
    for(const [at,status] of [[Date.parse('2026-11-18T00:00Z'),'upcoming'],[now,'ongoing'],[end-1,'ongoing'],[end,'ended']])assert.equal(occurrenceStatus(run,at),status,id);
  }
  assert.match(formatEventTime(get(activities[1]).occurrences[0].end),/10 Dec 2026.*14:59:59/);
  for(const region of ['JP','CN'])assert(!eventRows(catalog,{region},now).some(r=>activities.slice(0,4).includes(r.event.id)));
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
  for(const o of e.occurrences.filter(o=>o.kind!=='war-archives'))assert(!detail(e.id,o.id).includes('event-item-light-hatsuzuki'));
});

test('regional archive release reuses the JP bookmark and keeps limited rewards in history',()=>{
  const event=get('effulgence-before-eclipse');
  const reviewed=Date.parse(catalog.updatedAt);
  for(const [region,count] of [['EN',54],['JP',52],['CN',52]]){
    const archives=eventRows(catalog,{region},reviewed).filter(row=>row.section==='war-archives');
    assert.equal(archives.length,count);
    const run=archives.find(row=>row.event.id===event.id).occurrence;
    assert.equal(run.start.date,'2026-11-19');
    if(region==='JP')assert.equal(run.id,'effulgence-jp-war-archives');
    const rewards=event.content.filter(item=>item.occurrenceIds.includes(run.id));
    const merit=rewards.filter(i=>i.name==='Asanagi · Merit Shop');
    assert.equal(merit.length,1);
    assert.equal(merit[0].cost,region==='CN'?8000:undefined);
    assert.equal(rewards.some(i=>i.id==='jp-final-map-guarantee'),region==='JP');
    assert(!event.stages.some(s=>s.occurrenceIds.includes(run.id)));
  }
});

test('November corrections keep shop extensions and coupon rules on their own servers',()=>{
  const collab=get('angels-azur-stage');
  for(const [region,offset] of [['JP','+09:00'],['CN','+08:00']]){
    const run=collab.occurrences.find(o=>o.region===region);
    const shop=run.phases.find(p=>p.kind==='shop');
    assert.equal(shop.at.value,'2026-11-26T23:59:00'+offset);
    assert(run.revisions.some(revision=>revision.note.includes('November 25')));
    assert.notDeepEqual(shop.at.sourceIds,run.start.sourceIds);
  }
  const enCoupon=get('black-friday-skin-coupon');
  assert.deepEqual(enCoupon.occurrences.map(o=>o.region),['EN']);
  assert.match(enCoupon.content[0].description,/eligible rerun bought individually/);
  assert.match(enCoupon.content[0].description,/Bundle does not accept/);
  const shop=get('heartful-remedies-outfit-shop');
  assert.deepEqual(shop.occurrences.map(o=>o.end.value),['2026-12-09T23:59:00-07:00','2026-12-09T23:59:00+09:00','2026-11-25T23:59:00+08:00']);
  for(const region of ['JP','CN']){
    const run=shop.occurrences.find(o=>o.region===region);
    assert(!shop.content.some(i=>i.cost===1180&&i.occurrenceIds.includes(run.id)));
  }
});

test('Veritas closes stages independently from the later reward windows in all regions',()=>{
  const stages=get('transfer-student-veritas-academy'),claims=get('veritas-point-rewards');
  for(const [region,end,claimEnd] of [
    ['EN','2026-12-09T23:59:00-07:00','2026-12-16T23:59:00-07:00'],
    ['JP','2026-12-10','2026-12-15T23:59:00+09:00'],
    ['CN','2026-12-10','2026-12-15T23:59:00+08:00']
  ]){
    const run=stages.occurrences.find(o=>o.region===region);
    const claim=claims.occurrences.find(o=>o.region===region);
    assert.equal(run.end.value||run.end.date,end);
    assert.equal(run.phases.find(p=>p.kind==='claim').at.value,claimEnd);
    assert.equal(claim.end.value,claimEnd);
    assert.equal(occurrenceStatus(run,Date.parse('2026-12-11T12:00:00Z')),'ended');
    assert.equal(occurrenceStatus(claim,Date.parse(claimEnd)-1),'ongoing');
    assert.equal(occurrenceStatus(claim,Date.parse(claimEnd)),'ended');
  }
  assert.equal(occurrenceStatus(stages.occurrences[0],Date.parse('2026-12-09T23:59:00-07:00')-1),'ongoing');
  const jp=stages.occurrences.find(o=>o.region==='JP'),midnight=Date.parse('2026-12-10T00:00:00+09:00');
  assert.equal(occurrenceStatus(jp,midnight-1),'ongoing');
  assert.equal(occurrenceStatus(jp,midnight),'maintenance');
  assert.equal(occurrenceStatus(jp,midnight+86400000),'ended');
  assert.equal(jp.end.value,undefined);
  assert.match(formatEventTime(jp.end),/Japan.*at maintenance/);
  assert(eventRows(catalog,{region:'JP',status:'maintenance'},midnight).some(row=>row.event===stages&&row.section==='ongoing'));
});

test('Cruise Missions and November outfit trials keep published start precision and regional limits',()=>{
  const season=get('cruise-missions-december-2026');
  const [en,jp,cn]=season.occurrences;
  assert.equal(en.start.kind,'date');
  assert.equal(occurrenceStatus(en,Date.parse('2026-12-01T12:00:00-07:00')),'pending');
  assert.equal(jp.end.kind,'tba');
  assert.equal(jp.phases.find(p=>p.kind==='shop').at.value,'2027-01-31T22:59:00+09:00');
  assert.equal(cn.end.value,'2027-01-31T23:59:00+08:00');
  const query='Level 80 outfit trial packs',reviewed=Date.parse(catalog.updatedAt);
  assert(eventRows(catalog,{region:'CN',query},reviewed).some(r=>r.event.id==='veritas-outfit-shop'));
  assert(!eventRows(catalog,{region:'EN',query},reviewed).length);
  assert(!get('veritas-outfit-rentals').occurrences.some(o=>o.region==='CN'));
});

function resultRuns(eventId, filters, at=Date.parse(catalog.updatedAt)){
  const html=renderEvents({catalog,filters:normalizeEventFilters(filters),now:at});
  const links=[...html.matchAll(/<h3><a href="#\/events\/([^?]+)\?occurrence=([^"]+)"/g)];
  return links.filter(([,id])=>id===eventId).map(([, ,run])=>run);
}

test('archive reward searches link only their eligible run in cards and timeline',()=>{
  const id='effulgence-before-eclipse';
  for(const view of ['cards','timeline']){
    for(const [region,query,run] of [
      ['CN','Asanagi · Merit Shop','effulgence-archive-cn-20261119'],
      ['JP','Hatsuzuki · final map reward','effulgence-jp-war-archives']
    ]){
      const filters={region,query,view};
      assert.deepEqual(resultRuns(id,filters),[run]);
      assert.deepEqual(resultRuns(id,{...filters,year:'2026',status:'permanent'}),[run]);
      assert.deepEqual(resultRuns(id,{...filters,year:'2025'}),[]);
      assert.deepEqual(resultRuns(id,{...filters,status:'ended'}),[]);
    }
    assert.deepEqual(resultRuns(id,{view,region:'CN',query:'final map reward'}),[]);
  }
});

test('historical reward searches select the original even when a newer rerun exists',()=>{
  for(const view of ['cards','timeline']){
    for(const query of ['Zuikaku','Ema']){
      const filters={region:'EN',query,view};
      assert.deepEqual(resultRuns('visitors-dyed-in-red',filters),['visitors-dyed-in-red-en-original-2018']);
      assert.deepEqual(resultRuns('visitors-dyed-in-red',{...filters,status:'permanent'}),[]);
      assert.deepEqual(resultRuns('visitors-dyed-in-red',{...filters,year:'2019'}),[]);
    }
  }
});

test('event title and alias searches include all runs and count each identity once per section',()=>{
  const event=get('divergent-chessboard');
  for(const query of [event.title,'Opposite-Colored']){
    const filters={region:'CN',query,view:'timeline',sort:'oldest'};
    assert.deepEqual(resultRuns(event.id,filters).sort(),event.occurrences.filter(o=>o.region==='CN').map(o=>o.id).sort());
    const html=renderEvents({catalog,filters:normalizeEventFilters(filters),now:Date.parse(catalog.updatedAt)});
    assert.match(html,/id="events-past">Past Events<\/h2><span>1 identity<\/span>/);
    assert.deepEqual(resultRuns(event.id,{...filters,view:'cards',status:'ended'}),['divergent-chessboard-cn-rerun-2018']);
  }
});

test('CN can redeem the Veritas medal after sticker missions end, through the exact claim cutoff',()=>{
  const stages=get('transfer-student-veritas-academy'),claims=get('veritas-point-rewards');
  const cnRun=stages.occurrences.find(o=>o.region==='CN');
  const medalPhase=cnRun.phases.find(p=>p.id==='medal-claim');
  assert.equal(medalPhase?.kind,'claim');
  assert.equal(medalPhase.at.value,'2026-12-15T23:59:00+08:00');
  assert.deepEqual(medalPhase.sourceIds,['cn-veritas-notice']);
  assert.deepEqual(medalPhase.at.sourceIds,['cn-veritas-notice']);
  const claim=claims.occurrences.find(o=>o.region==='CN');
  const medal=claims.content.find(i=>i.name==='Veritas Academy Medal');
  assert.deepEqual(medal.occurrenceIds,[claim.id]);
  assert.deepEqual(medal.regions,['CN']);
  assert.deepEqual(medal.sourceIds,['cn-veritas-notice']);
  assert.equal(claim.end.value,medalPhase.at.value);
  const cutoff=Date.parse(medalPhase.at.value);
  for(const view of ['cards','timeline']){
    const filters={query:medal.name,region:'CN',view,status:'ongoing'};
    for(const at of [Date.parse('2026-12-11T00:00:00+08:00'),cutoff-1]){
      assert.deepEqual(resultRuns(stages.id,filters,at),[]);
      assert.deepEqual(resultRuns(claims.id,filters,at),[claim.id]);
      assert.deepEqual(resultRuns(stages.id,{...filters,status:'ended'},at),[cnRun.id]);
    }
    assert.deepEqual(resultRuns(claims.id,filters,cutoff),[]);
    assert.deepEqual(resultRuns(claims.id,{...filters,status:'ended'},cutoff),[claim.id]);
    for(const region of ['EN','JP']){
      assert.deepEqual(resultRuns(claims.id,{...filters,region},cutoff-1),[]);
      assert(!stages.occurrences.find(o=>o.region===region).phases.some(p=>p.id==='medal-claim'));
    }
  }
  assert.match(detail(claims.id,claim.id),/stickers earned before December 10 maintenance/);
});
