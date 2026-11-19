import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {mergeArtworkSkins} from '../src/artwork-merge.js';
import {artworkSkinsForShip} from '../src/artwork-catalog.js';
import {liveShip} from '../src/live-content.js';
import {renderShipProfile,resolveSkinArtwork} from '../src/ship-profiles.js';
import {renderEventDetail} from '../src/events-view.js';
import {normalizeEventFilters,validateEventCatalog,eventStateSignature} from '../src/events.js';
import {deploymentState,checkDeployment} from '../src/deployment-integrity.js';
import {releaseErrors} from '../scripts/release-consistency.mjs';
const read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8');
const catalog=JSON.parse(read('data/events/catalog.json')),evidence=JSON.parse(read('data/events/integrity-evidence.json'));
const baseCatalog=JSON.parse(read('data/ship-artwork.json'));
const now=Date.parse('2026-11-18T02:00:00Z');
const detail=(extra={})=>renderEventDetail({catalog,eventId:'angels-azur-stage',filters:normalizeEventFilters(),now,...extra});
test('artwork sources union by ship and skin IDs, retaining variants and complementary images',()=>{
 const base=[{id:'11800010',name:'Default',images:{painting:'base'}},{id:'11800012',name:'Verified extra',images:{painting:'extra'}}];
 const owned=[{id:'11800010',shipId:'1180001',name:'Default',images:{wiki:'wiki',painting:null}},{id:'11800011',shipId:'1180001',name:'Both in Heart and Mind',images:{wiki:'alternate'}}];
 const merged=mergeArtworkSkins('1180001',base,owned);
 assert.deepEqual(merged.map(x=>x.id),['11800010','11800011','11800012']);
 assert.deepEqual(merged[0].images,{painting:'base',wiki:'wiki'});
 assert.equal(mergeArtworkSkins('1180001',owned,owned).length,2);
 assert.equal(mergeArtworkSkins('1180002',owned).length,0,'foreign ship identity rejected');
 assert.equal(mergeArtworkSkins('1180001',[{name:'Default',images:{wiki:'unknown'}},{id:'<img>'}]).length,0,'no inferred IDs');
});
test('all baseline ship galleries preserve their complete stable skin sets',()=>{
 for(const id of Object.keys(baseCatalog.ships)){
  const skins=artworkSkinsForShip(baseCatalog,id),merged=mergeArtworkSkins(id,skins,skins.slice(0,1));
  assert.deepEqual(new Set(merged.map(x=>x.id)),new Set(skins.map(x=>x.id)),id);
 }
});
test('Ririsa and Mikari alternate skins expose authentic backgrounds, acquisition and viewer',()=>{
 for(const [id,name] of [['1180001','Both in Heart and Mind'],['1180002','For My Lucky Star']]){
  const ship=liveShip(id);assert.equal(ship.artwork.length,2);assert.equal(ship.artwork[1].name,name);
  const skin=ship.artwork[1];assert.equal(skin.id,id+'1');
  const normal=resolveSkinArtwork(skin),noBg=resolveSkinArtwork(skin,'without-background');
  assert.equal(normal.primary,skin.images.wiki);assert.equal(noBg.primary,skin.images.wikiNoBackground);
  assert.equal(noBg.fallback,skin.images.paintingNoBackground);
  assert.equal(noBg.secondFallback,null,'no background silently restored by fallback');
  const html=renderShipProfile({ship:ship.index,data:ship.detail,artworkSkins:ship.artwork,skinIndex:1,artVariant:'without-background',viewerOpen:true});
  assert.match(html,/With background/);assert.match(html,/Without background/);assert.match(html,/1,000 Gems/);
  assert.ok(html.includes(skin.images.wikiNoBackground));assert.match(html,/Fullscreen/);
  assert.match(html,new RegExp('data-skin-id="'+id+'1"'));
 }
});
test('schedules start collapsed while all regional countdowns stay visible',()=>{
 const html=detail(),cut=html.indexOf('id="event-schedule-details"');
 assert.match(html,/id="event-schedule-toggle"[^>]*aria-expanded="false"[^>]*aria-controls="event-schedule-details"/);
 assert.match(html,/id="event-schedule-details" hidden/);
 const visible=html.slice(html.indexOf('id="event-schedule"'),cut);
 for(const r of ['EN','JP','CN'])assert.ok(visible.includes('data-event-region="'+r+'"'));
 assert.equal((visible.match(/role="timer"/g)||[]).length,3);
 assert.match(detail({scheduleExpanded:true}),/id="event-schedule-details"><div/);
 assert.match(html,/after maintenance/);assert.match(html,/time TBA/);
});
test('urgent exact deadlines remain outside disclosure and date-only milestones are not guessed',()=>{
 const time=Date.parse('2026-11-25T00:00:00Z'),html=detail({now:time,filters:normalizeEventFilters({region:'JP'})});
 const urgent=html.slice(html.indexOf('class="event-urgent"'),html.indexOf('id="event-schedule-details"'));
 assert.match(urgent,/JP · Closing within 48 hours/);assert.match(urgent,/Outfit, furniture/);assert.doesNotMatch(urgent,/day 7/);
 const event=catalog.events.find(e=>e.id==='angels-azur-stage'),o=event.occurrences.find(o=>o.region==='JP'),phase=o.phases.find(p=>p.kind==='shop');
 const threshold=Date.parse(phase.at.value)-48*3600000;
 assert.notEqual(eventStateSignature(catalog,'JP',threshold-1),eventStateSignature(catalog,'JP',threshold));
});
test('reward thumbnails are source-matched and outfits link to the exact skin',()=>{
 assert.deepEqual(validateEventCatalog(catalog),[]);
 const known=new Set(evidence.files.map(f=>f.url));
 for(const e of catalog.events)for(const item of e.content.filter(i=>i.artwork))assert(known.has(item.artwork.url),item.id);
 const html=detail();
 assert.match(html,/#\/ships\/1180001\?skin=11800011/);
 assert.match(html,/#\/augments\/aug-15960/);
 assert.match(html,/Cosmetic · no combat stats/);assert.match(html,/data-event-art/);
 const bad=structuredClone(catalog);bad.events[0].content[0].artwork.sourceIds=['unknown'];
 assert(validateEventCatalog(bad).some(e=>/source references/.test(e)));
});
test('EN archive acquisition never leaks to JP/CN or historical Virtual Tower shops',()=>{
 const eventId='virtual-tower',event=catalog.events.find(e=>e.id===eventId);
 const en=event.occurrences.find(o=>o.region==='EN'&&o.kind==='war-archives');
 const html=renderEventDetail({catalog,eventId,occurrenceId:en.id,filters:normalizeEventFilters(),now});
 assert.match(html,/EN Light Construction Pool/);assert.match(html,/EN Heavy Construction Pool/);
 for(const region of ['JP','CN']){
  const page=renderEventDetail({catalog,eventId,filters:normalizeEventFilters({region}),now});
  assert.doesNotMatch(page,/EN Light Construction Pool/);
 }
 for(const o of event.occurrences.filter(o=>o.kind!=='war-archives')){
  assert(!event.content.some(i=>i.id.startsWith('permanent-en')&&i.occurrenceIds.includes(o.id)));
 }
});
const documents=()=>({metadata:JSON.parse(read('data/release-status.json')),pkg:JSON.parse(read('package.json')),readme:read('README.md'),changelog:read('CHANGELOG.md'),status:read('docs/PROJECT_STATUS.md'),html:read('index.html')});
test('current docs distinguish released main from unreleased development and detect stale statements',()=>{
 const docs=documents();assert.deepEqual(releaseErrors(docs),[]);
 assert(releaseErrors({...docs,readme:docs.readme.replace('live release is v0.8.12','live release is v0.8.11')}).includes('README live release is stale'));
 assert(releaseErrors({...docs,pkg:{...docs.pkg,version:'0.8.11'}}).includes('package version differs from release metadata'));
 assert(releaseErrors({...docs,changelog:docs.changelog.replace('Unreleased;','Released;')}).includes('development version is not marked Unreleased'));
});
test('deployment check detects mismatched HTML, changed assets and unavailable metadata safely',async()=>{
 const build={version:'0.8.13',fingerprint:'a'},remote={schemaVersion:1,...build};
 assert.equal(deploymentState(build,'0.8.13',remote),'current');
 assert.equal(deploymentState(build,'0.8.12',remote),'mixed');
 assert.equal(deploymentState(build,'0.8.13',{...remote,fingerprint:'b'}),'changed');
 assert.equal(deploymentState(build,'0.8.13',null),'unavailable');
 let options;
 assert.equal(await checkDeployment({build,htmlVersion:'0.8.13',fetcher:async(_,o)=>{options=o;return {ok:true,json:async()=>remote};}}),'current');
 assert.equal(options.cache,'no-store');
 assert.equal(await checkDeployment({build,htmlVersion:'0.8.13',fetcher:async()=>{throw Error('offline');}}),'unavailable');
});
