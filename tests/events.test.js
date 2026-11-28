import test from 'node:test';
import {auditBackfillEvidence} from '../scripts/event-evidence.mjs';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateEventCatalog,validInstant,validZone,dateInZone,occurrenceStatus,eventSection,eventRows,formatEventTime,eventCountdown,eventStateSignature,normalizeEventFilters,parseEventRoute} from '../src/events.js';
import {loadEventCatalog,readEventFilters,saveEventFilters} from '../src/events-store.js';
import {renderEvents,renderEventDetail} from '../src/events-view.js';
import {createEventClock} from '../src/events-clock.js';
const catalog=JSON.parse(readFileSync(new URL('../data/events/catalog.json',import.meta.url)));
const now=Date.parse('2026-11-17T14:36:00Z');
const collab=catalog.events.find(e=>e.id==='angels-azur-stage');
const en=collab.occurrences.find(o=>o.region==='EN');
const filters=normalizeEventFilters();
const clone=()=>structuredClone(catalog);
const exact=value=>({kind:'exact',zone:'UTC',value,sourceIds:[en.sourceIds[0]]});
const run={...en,start:exact('2026-11-16T03:00:00Z'),end:exact('2026-11-16T05:00:00Z'),releaseState:'announced'};

test('verified expanded catalog preserves regional releases and source revisions',()=>{
 assert.deepEqual(validateEventCatalog(catalog),[]);assert.equal(catalog.events.length,82);
 assert.equal(new Set(catalog.events.flatMap(e=>e.occurrences.map(o=>o.id))).size,261);
 assert.equal(collab.occurrences.length,3);assert.equal(catalog.coverage,'partial');
});
test('schema rejects identity, occurrence and regional-run duplicates',()=>{
 for(const mutate of [c=>c.events.push(c.events[0]),c=>c.events[0].occurrences.push(c.events[0].occurrences[0]),c=>c.events[0].occurrences.push({...c.events[0].occurrences[0],id:'other-id'})]){
  const c=clone();mutate(c);assert.match(validateEventCatalog(c).join(),/duplicate/);
 }
});
test('schema rejects fabricated sources, reversed schedules, non-offset times and estimates',()=>{
 for(const mutate of [c=>c.events[0].sourceIds=['missing'],c=>c.events[0].occurrences[0].end=exact('2020-01-01T00:00:00'),c=>{const o=c.events[0].occurrences[0];o.start=exact('2030-01-01T00:00:00Z');o.end=exact('2029-01-01T00:00:00Z');},c=>c.events[0].occurrences[0].start.certainty='estimate']){
  const c=clone();mutate(c);assert.ok(validateEventCatalog(c).length);
 }
});
test('schema prohibits gear skins from carrying combat stats or equipment identity',()=>{
 const c=clone(),skin=c.events[0].content.find(i=>i.kind==='gear-skin');skin.stats={damage:99};skin.equipmentId='12345';
 assert.match(validateEventCatalog(c).join(),/cosmetics cannot be combat equipment/);
});
test('unverified drop rates and encounter recommendations fail evidence gates',()=>{
 const c=clone();c.events[0].content[0].dropRate=0.5;c.events[0].stages[0].encounter={id:'fake',evidenceClass:'heuristic'};
 assert.match(validateEventCatalog(c).join(),/drop rate requires evidence/);assert.match(validateEventCatalog(c).join(),/encounter requires evidence/);
});
test('valid timestamps reject impossible dates and local-only wall clock values',()=>{
 assert.equal(validInstant('2026-11-26T23:59:00-07:00'),true);
 for(const value of ['2026-11-26T23:59:00','2026-02-30T12:00:00Z','2026-11-26T24:01:00Z',null,'TBA'])assert.equal(validInstant(value),false);
 assert.equal(validZone(undefined),false);assert.equal(validZone('Mars/Olympus'),false);
});
test('Manila defaults and EN/JP/CN schedules never borrow each other’s offset',()=>{
 assert.equal(filters.zone,'Asia/Manila');
 assert.match(formatEventTime(en.end),/27 Nov 2026, 14:59/);
 const jp=collab.occurrences.find(o=>o.region==='JP'),cn=collab.occurrences.find(o=>o.region==='CN');
 assert.match(formatEventTime(jp.end),/26 Nov 2026, 22:59/);assert.match(formatEventTime(cn.end),/26 Nov 2026, 23:59/);
 assert.equal(dateInZone(Date.parse('2026-11-16T01:00:00Z'),'Etc/GMT+7'),'2026-11-15');
 assert.equal(dateInZone(Date.parse('2026-11-16T01:00:00Z'),'Asia/Manila'),'2026-11-16');
});
test('automatic status transitions at exact start/end boundaries, no negative timer',()=>{
 const start=Date.parse(run.start.value),end=Date.parse(run.end.value);
 assert.equal(occurrenceStatus(run,start-1),'upcoming');assert.equal(occurrenceStatus(run,start),'ongoing');
 assert.equal(occurrenceStatus(run,end-1),'ongoing');assert.equal(occurrenceStatus(run,end),'ended');
 assert.equal(eventCountdown(run.end,end-1),'0h 0m 1s');assert.equal(eventCountdown(run.end,end),'Deadline reached');assert.equal(eventCountdown(run.end,end+1e9),'Deadline reached');
 assert.equal(eventCountdown(exact('bad'),now),'TBA');
});
test('date-only launch does not imply a precise launch, end is inclusive in source zone',()=>{
 const o={...en,start:{kind:'date',date:'2026-11-16',zone:'Asia/Tokyo'},end:{kind:'date',date:'2026-11-17',zone:'Asia/Tokyo'},releaseState:'announced'};
 assert.equal(occurrenceStatus(o,Date.parse('2026-11-15T14:59:59Z')),'upcoming');
 assert.equal(occurrenceStatus(o,Date.parse('2026-11-15T15:00:00Z')),'pending');
 assert.equal(occurrenceStatus(o,Date.parse('2026-11-17T15:00:00Z')),'ended');
 assert.equal(eventCountdown(o.start,Date.parse('2026-11-16T04:00:00Z')),'Date confirmed · time TBA');
 assert.match(formatEventTime(o.start,'Asia/Manila'),/Japan \(UTC\+9\) · time TBA/);
});
test('maintenance starts await confirmed release; duration estimates never become timers',()=>{
 const start=Date.parse('2026-11-12T07:00:00Z'),live=Date.parse(en.releaseConfirmedAt);
 assert.equal(occurrenceStatus(en,start-1),'upcoming');assert.equal(occurrenceStatus(en,start),'pending');
 assert.equal(occurrenceStatus(en,live),'ongoing');assert.match(eventCountdown(en.start,now),/exact time TBA/);
 assert.equal(occurrenceStatus({...en,releaseState:'announced'},now),'pending');
});
test('TBA, delayed and revised schedules cannot retain stale timers/status',()=>{
 const clock=Date.parse('2026-11-16T04:00:00Z');
 const tba={kind:'tba',zone:'Asia/Tokyo'};
 assert.equal(occurrenceStatus({...run,start:tba,releaseState:'announced'},clock),'unknown');
 assert.equal(occurrenceStatus({...run,releaseState:'delayed'},clock),'delayed');
 const later={...run,start:exact('2026-11-18T03:00:00Z'),end:exact('2026-11-20T05:00:00Z')};
 assert.equal(occurrenceStatus(later,clock),'upcoming');assert.notEqual(eventStateSignature({events:[{occurrences:[run]}]},'EN',clock),eventStateSignature({events:[{occurrences:[later]}]},'EN',clock));
 assert.equal(eventCountdown(tba,clock),'TBA');
});
test('permanent availability is distinct from expired events and JP announced additions',()=>{
 const fool=catalog.events.find(e=>e.id==='the-fools-scales').occurrences.find(o=>o.kind==='war-archives');
 assert.equal(occurrenceStatus(fool,now),'permanent');assert.equal(eventSection('permanent'),'war-archives');
 const upcoming=catalog.events.find(e=>e.id==='effulgence-before-eclipse').occurrences.find(o=>o.kind==='war-archives');
 assert.equal(upcoming.region,'JP');assert.equal(occurrenceStatus(upcoming,now),'upcoming');
 const en=eventRows(catalog,{region:'EN'},now).filter(r=>r.section==='upcoming');
 assert.ok(en.some(r=>r.event.id==='effulgence-before-eclipse'));
 assert.ok(en.every(r=>Date.parse(r.occurrence.start.value||r.occurrence.start.date)>now));
 assert.ok(eventRows(catalog,{region:'JP'},now).some(r=>r.section==='upcoming'&&r.event.id==='effulgence-before-eclipse'));
});
test('search matches franchise, rewards and aliases; year/category/status/region filtering',()=>{
 assert.equal(eventRows(catalog,{query:'Mikari'},now)[0].event.id,'angels-azur-stage');
 assert.equal(eventRows(catalog,{query:'Opposite-Colored'},now)[0].event.id,'divergent-chessboard');
 assert.ok(eventRows(catalog,{region:'EN',year:'2018'},now).every(r=>(r.occurrence.start.date||'').startsWith('2018')));
 assert.ok(eventRows(catalog,{category:'research',status:'ongoing'},now).every(r=>r.event.category==='research'&&r.status==='ongoing'));
 assert.equal(eventRows(catalog,{query:'no-such-event'},now).length,0);
});
test('past event sorting changes chronologically while retaining one identity per section',()=>{
 const oldest=eventRows(catalog,{sort:'oldest'},now).filter(r=>r.section==='past');
 const newest=eventRows(catalog,{sort:'newest'},now).filter(r=>r.section==='past');
 assert.ok(oldest.length>0);assert.deepEqual(new Set(oldest.map(r=>r.event.id)),new Set(newest.map(r=>r.event.id)));
 assert.equal(new Set(oldest.map(r=>r.event.id)).size,oldest.length);
});
test('routes accept direct event IDs and reject path injection/extra segments',()=>{
 assert.deepEqual(parseEventRoute('#/events/angels-azur-stage'),{page:'events',eventId:'angels-azur-stage'});
 assert.deepEqual(parseEventRoute('#/events'),{page:'events',eventId:null});
 for(const hash of ['#/events/../../x','#/events/<script>','#/events/id/extra','#/ships/1180001'])assert.equal(parseEventRoute(hash),null);
});
test('detail links use existing ship/augment profiles and cosmetics have no gear link',()=>{
 const html=renderEventDetail({catalog,eventId:collab.id,filters,now});
 assert.match(html,/#\/ships\/1180001/);assert.match(html,/#\/ships\/1180002/);assert.match(html,/#\/augments\/aug-15960/);
 assert.match(html,/Cosmetic · no combat stats/);assert.match(html,/Both in Heart and Mind/);assert.match(html,/Manga Club/);
 assert.doesNotMatch(html,/#\/equipment\/30/);assert.match(html,/CC BY-NC-SA|Sources &amp;|Sources & coverage/);
});
test('historical reward selection never advertises expired shops in permanent content',()=>{
 const e=catalog.events.find(e=>e.id==='the-fools-scales');
 const current=renderEventDetail({catalog,eventId:e.id,filters,now});assert.doesNotMatch(current,/<h3><a[^>]*>Painlevé/);
 const past=renderEventDetail({catalog,eventId:e.id,occurrenceId:e.occurrences[0].id,filters,now});
 assert.match(past,/#\/ships\/80702/);assert.match(past,/This run has ended/);
});
test('timeline exposes individual regional occurrences; loading, empty and unavailable states accessible',()=>{
 const html=renderEvents({catalog,filters:{...filters,view:'timeline'},now});assert.match(html,/<ol class="event-timeline"/);assert.match(html,/Rerun/);
 assert.match(renderEvents({filters,status:'error',error:'offline'}),/events-retry/);
 assert.match(renderEvents({filters,status:'loading'}),/role="status"/);
 assert.match(renderEventDetail({catalog,eventId:'missing',filters,now}),/Event not found/);
 assert.match(renderEvents({catalog,filters,now}),/partial catalog/);
});
test('unknown art, incomplete content and malicious source text render safely',()=>{
 const c=clone();c.events[0].artwork=null;c.events[0].title='<script>alert(1)</script>';
 const html=renderEvents({catalog:c,filters,now});assert.match(html,/&lt;script&gt;/);assert.doesNotMatch(html,/<script>/);assert.match(html,/event-art-fallback/);
 const cn=renderEventDetail({catalog,eventId:'rapid-training-november-2026',filters:{...filters,region:'CN'},now});assert.match(cn,/no verified regional record/);assert.match(cn,/do not yet have verified rewards/);
});
test('local catalog loader handles HTTP failures, invalid JSON/schema and timeouts without partial publication',async()=>{
 const response=body=>({ok:true,text:async()=>body});
 assert.equal((await loadEventCatalog(async()=>response(JSON.stringify(catalog)))).events.length,82);
 await assert.rejects(loadEventCatalog(async()=>({ok:false,status:503})),/HTTP 503/);
 await assert.rejects(loadEventCatalog(async()=>response('{bad')));
 await assert.rejects(loadEventCatalog(async()=>response(JSON.stringify({...catalog,schemaVersion:99}))),/validation/);
 await assert.rejects(loadEventCatalog(async()=>{throw new DOMException('aborted','AbortError');}),/aborted/);
});
test('preference persistence is isolated, bounded and tolerant of disabled storage',()=>{
 const values=new Map([['avalon.azurlane.loadouts.v1','untouched']]),storage={getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)};
 assert.equal(saveEventFilters(storage,{region:'JP',zone:'UTC',query:'Ririsa',view:'timeline'}),true);
 assert.equal(readEventFilters(storage).region,'JP');assert.equal(values.get('avalon.azurlane.loadouts.v1'),'untouched');
 assert.equal(saveEventFilters({setItem(){throw Error();}},filters),false);assert.deepEqual(readEventFilters({getItem(){throw Error();}}),filters);
 assert.equal(normalizeEventFilters({region:'XX',query:'x'.repeat(200),zone:'invalid',year:'yesterday'}).query.length,150);
});
test('one lightweight clock updates text, renders only transitions and stops when hidden/off-page',()=>{
 let clockNow=Date.parse('2026-11-16T04:59:59Z'),intervals=0,clears=0,transitions=0;
 const node={dataset:{eventCountdown:run.end.value},textContent:''},listeners={};
 const document={hidden:false,querySelectorAll:()=>[node],addEventListener:(k,v)=>listeners[k]=v,removeEventListener:k=>delete listeners[k]};
 const state={active:true,catalog:{events:[{occurrences:[run]}]},region:'EN'};
 const clock=createEventClock({document,read:()=>state,onTransition:()=>transitions++,now:()=>clockNow,setIntervalFn:()=>++intervals,clearIntervalFn:()=>clears++});
 clock.sync();clock.sync();assert.equal(intervals,1);assert.equal(node.textContent,'0h 0m 1s');
 clockNow++;clock.tick();assert.equal(transitions,0);clockNow+=999;clock.tick();assert.equal(transitions,1);assert.equal(node.textContent,'Deadline reached');
 clock.tick();assert.equal(transitions,1);document.hidden=true;listeners.visibilitychange();assert.equal(clears,1);
 document.hidden=false;listeners.visibilitychange();assert.equal(intervals,2);state.active=false;clock.sync();assert.equal(clears,2);clock.destroy();
});

test('returning from a hidden tab recomputes statuses across missed deadlines',()=>{
 let time=Date.parse(run.end.value)-1000,changes=0;const listeners={};
 const document={hidden:false,querySelectorAll:()=>[],addEventListener:(k,v)=>listeners[k]=v,removeEventListener:()=>{}};
 const clock=createEventClock({document,read:()=>({active:true,catalog:{events:[{occurrences:[run]}]},region:'EN'}),onTransition:()=>changes++,now:()=>time,setIntervalFn:()=>1,clearIntervalFn:()=>{}});
 clock.sync();document.hidden=true;listeners.visibilitychange();time+=2000;
 document.hidden=false;listeners.visibilitychange();assert.equal(changes,1);clock.tick();assert.equal(changes,1);clock.destroy();
});

test('malformed catalogs fail validation without throwing or publishing partial data',()=>{
 for(const bad of [null,{}, {...catalog,events:{}},{...catalog,events:[null]}, {...catalog,events:[{...collab,occurrences:[null]}]}, {...catalog,events:[{...collab,content:{}}]}])assert.ok(validateEventCatalog(bad).length);
 assert.equal(validInstant('2026-99-31T00:00:00Z'),false);
 const c=clone();c.events[0].content[0].occurrenceIds=['other-event'];assert.match(validateEventCatalog(c).join(),/matching occurrences/);
});


test('mixed-precision revised schedules reject reversed bounds',()=>{
 const c=clone(),o=c.events[0].occurrences[0];o.start.date='2026-12-01';assert.match(validateEventCatalog(c).join(),/end must follow start date/);
 assert.equal(eventCountdown({kind:'date',date:'2026-11-10',zone:'Asia/Tokyo'},now),'Scheduled date passed · exact time unconfirmed');
});

test('completed runs and verified permanent availability have independent regional sections',()=>{
 const enRows=eventRows(catalog,{region:'EN'},now);
 assert.deepEqual(enRows.filter(r=>r.event.id==='the-fools-scales').map(r=>r.section).sort(),['past','war-archives']);
 assert.deepEqual(enRows.filter(r=>r.event.id==='divergent-chessboard').map(r=>r.section).sort(),['past','war-archives']);
 assert.deepEqual(enRows.filter(r=>r.event.id==='tempesta-corridor-of-fog').map(r=>r.section),['past']);
 for(const region of ['JP','CN']){
  const rows=eventRows(catalog,{region},now);
  assert.equal(rows.filter(r=>r.section==='war-archives').length,51);
  assert.equal(rows.some(r=>r.event.id==='frostfall'&&r.section==='war-archives'),false);
  assert.equal(rows.some(r=>r.event.id==='the-fools-scales'&&r.section==='past'),true);
 }
 const jp=eventRows(catalog,{region:'JP'},now).filter(r=>r.event.id==='effulgence-before-eclipse');
 assert.deepEqual(jp.map(r=>r.section).sort(),['past','upcoming']);
 assert.equal(new Set(enRows.map(r=>r.event.id)).size,82);
});
test('four sections and counts agree between cards and timeline, with occurrence-specific links',()=>{
 for(const view of ['cards','timeline']){
  const html=renderEvents({catalog,filters:{...filters,view},now});
  for(const id of ['ongoing','upcoming','past','war-archives'])assert.match(html,new RegExp('id="events-'+id+'"'));
  assert.match(html,/Past Events<\/h2><span>19 identities/);
  assert.match(html,/War Archives<\/h2><span>53 identities/);
  const e=catalog.events.find(e=>e.id==='the-fools-scales');
  for(const o of e.occurrences.filter(o=>o.region==='EN'&&(view==='timeline'||o.kind!=='original'))){
   assert.ok(html.includes('#/events/'+e.id+'?occurrence='+o.id));
  }
 }
 assert.equal(eventRows(catalog,{status:'ended'},now).some(r=>r.section!=='past'),false);
 assert.equal(eventRows(catalog,{status:'permanent'},now).some(r=>r.section!=='war-archives'),false);
});
test('future permanent addition needs observed release even when its exact planned start passes',()=>{
 const e=catalog.events.find(e=>e.id==='effulgence-before-eclipse'),o=e.occurrences.find(o=>o.kind==='war-archives');
 const start=now+1000,observation=now+3000;
 for(const kind of ['tba','maintenance','date','exact']){
  const future={...o,start:kind==='exact'?exact(new Date(start).toISOString()):{...o.start,kind,...(kind==='tba'?{}:{date:'2026-11-16'})},releaseState:'announced'};
  assert.notEqual(occurrenceStatus(future,observation),'permanent');
  const released={...future,releaseState:'released',releaseConfirmedAt:new Date(observation).toISOString()};
  assert.notEqual(occurrenceStatus(released,observation-1),'permanent');
  assert.equal(occurrenceStatus(released,observation),'permanent');
 }
});
test('cards, timeline, detail and history describe planned availability until observation',()=>{
 const c=clone(),e=c.events.find(e=>e.id==='effulgence-before-eclipse'),o=e.occurrences.find(o=>o.kind==='war-archives');
 // Isolate the JP transition. The real EN schedule is exercised independently.
 e.occurrences=e.occurrences.filter(run=>run.region==='JP');
 const f={...filters,region:'JP',query:e.title};
 const render=()=>[...['cards','timeline'].map(view=>renderEvents({catalog:c,filters:{...f,view},now})),renderEventDetail({catalog:c,eventId:e.id,filters:f,now})];
 for(const html of render()){assert.match(html,/Planned War Archives addition · not available yet/);assert.doesNotMatch(html,/Permanent content/);}
 o.start.date='2026-11-17';o.releaseState='released';o.releaseConfirmedAt=new Date(now).toISOString();
 for(const html of render()){assert.match(html,/Permanent content · available in War Archives/);assert.doesNotMatch(html,/Planned War Archives addition/);}
});
test('historical shop and reward scopes do not leak into permanent or other regional runs',()=>{
 const c=clone(),e=c.events.find(e=>e.id==='the-fools-scales'),past=e.occurrences.find(o=>o.region==='EN'&&o.kind==='original'),permanent=e.occurrences.find(o=>o.kind==='war-archives');
 e.content.push({id:'limited-shop-fixture',kind:'shop',name:'Expired limited exchange',description:'Historical test shop',sourceIds:e.sourceIds,regions:['EN'],occurrenceIds:[past.id]});
 const render=occurrenceId=>renderEventDetail({catalog:c,eventId:e.id,occurrenceId,filters,now});
 assert.match(render(past.id),/Expired limited exchange/);assert.match(render(past.id),/This run has ended/);
 assert.doesNotMatch(render(permanent.id),/Expired limited exchange/);
 const jp=e.occurrences.find(o=>o.region==='JP');assert.doesNotMatch(render(jp.id),/Expired limited exchange/);
 assert.match(render(jp.id),/JP historical rewards/);
 assert.deepEqual(parseEventRoute('#/events/'+e.id+'?occurrence='+past.id),{page:'events',eventId:e.id,occurrenceId:past.id});
 assert.equal(parseEventRoute('#/events/'+e.id+'?occurrence=../bad'),null);
});
test('clock scope changes at frozen time are silent; subsequent same-scope boundaries notify once',()=>{
 let time=Date.parse(run.end.value)-1000,changes=0;const state={active:true,catalog:{events:[{occurrences:[run]}]},region:'EN',scope:'index:EN'};
 const document={hidden:false,querySelectorAll:()=>[],addEventListener:()=>{},removeEventListener:()=>{}};
 const clock=createEventClock({document,read:()=>state,onTransition:()=>{changes++;clock.sync();},now:()=>time,setIntervalFn:()=>1,clearIntervalFn:()=>{}});
 clock.sync();
 for(const [region,scope] of [['JP','index:JP'],['EN','index:EN'],[null,'detail:first'],[null,'detail:second'],['EN','index:EN']]){
  Object.assign(state,{region,scope});clock.sync();clock.tick();assert.equal(changes,0);
 }
 time+=1000;clock.tick();clock.tick();assert.equal(changes,1);clock.destroy();
});

test('publisher backfill retains dated EN evidence; regional additions need their own indexed evidence',()=>{
 const additions=['virtual-tower','pledge-of-the-radiant-court','tempesta-fountain-of-youth','violet-tempest-blooming-lycoris','parallel-superimposition','revelations-of-dust','anthem-of-remembrance','confluence-of-nothingness','interlude-of-illusions','frostfall','welcome-to-little-academy','tempesta-sleeping-sea','tempesta-islas-de-libertad'];
 const archives=catalog.events.filter(e=>additions.includes(e.id));
 assert.equal(archives.length,13);
 for(const event of archives){
  const o=event.occurrences.find(o=>o.kind==='war-archives');
  assert.ok(o,'EN War Archives record missing: '+event.id);assert.equal(o.region,'EN');
  assert.equal(occurrenceStatus(o,now),'permanent');
  assert.equal(o.start.kind,'maintenance');assert.equal(o.start.zone,'Etc/GMT+7');
  assert.ok(o.sourceIds.some(id=>catalog.sources[id]?.type==='official'&&catalog.sources[id]?.publishedAt));
  for(const regional of event.occurrences.filter(o=>o.region!=='EN'&&o.kind==='war-archives'))assert.ok(regional.sourceIds.includes('wiki-v0812-8'));
 }
 assert.equal(eventRows(catalog,{region:'EN'},now).filter(r=>r.section==='war-archives').length,53);
 for(const region of ['JP','CN'])assert.equal(eventRows(catalog,{region},now).filter(r=>r.section==='war-archives').length,51);
});
test('past EN originals and reruns remain separate from permanent additions',()=>{
 const frost=catalog.events.find(e=>e.id==='frostfall');
 assert.deepEqual(frost.occurrences.filter(o=>o.region==='EN').map(o=>o.kind).sort(),['original','rerun','war-archives']);
 const dust=catalog.events.find(e=>e.id==='revelations-of-dust');
 assert.deepEqual(dust.occurrences.filter(o=>o.region==='EN').map(o=>o.kind).sort(),['rerun','war-archives']);
 const past=eventRows(catalog,{region:'EN'},now).filter(r=>r.section==='past');
 assert.ok(past.length>5);
 for(const e of [frost,dust]){
  const run=e.occurrences.find(o=>o.kind==='rerun');
  assert.equal(occurrenceStatus(run,now),'ended');
  assert.equal(eventSection(occurrenceStatus(run,now)),'past');
  const h=renderEventDetail({catalog,eventId:e.id,occurrenceId:run.id,filters,now});
  assert.match(h,/This run has ended/);
 }
});
test('filter disclosure hides controls by default but retains region, search and chosen statuses',()=>{
 const active={...filters,region:'EN',query:'Frostfall',status:'ended'};
 const compact=renderEvents({catalog,filters:active,now});
 assert.match(compact,/aria-expanded="false" aria-controls="event-controls"/);
 assert.match(compact,/id="event-controls" hidden/);
 assert.match(compact,/EN server · Search: “Frostfall” · Ended/);
 const expanded=renderEvents({catalog,filters:active,now,filtersExpanded:true});
 assert.match(expanded,/aria-expanded="true" aria-controls="event-controls"/);
 assert.match(expanded,/id="event-controls"><label/);
 assert.match(expanded,/value="Frostfall"/);
});

const backfill=JSON.parse(readFileSync(new URL('../data/events/backfill-evidence.json',import.meta.url)));
test('all reviewed source dates and pre-backfill stable IDs agree with the separate evidence ledger',()=>{
 assert.deepEqual(auditBackfillEvidence(catalog,backfill),{indexedIdentities:51,publisherOccurrences:27,selectedHistories:8,verifiedPermanent:158});
});
test('evidence audit rejects regional date drift, invented availability and removed stable history',()=>{
 for(const mutate of [
  c=>{c.events.find(e=>e.id==='visitors-dyed-in-red').occurrences.find(o=>o.region==='EN'&&o.kind==='war-archives').start.date='2018-09-28';},
  c=>{const e=c.events.find(e=>e.id==='frostfall');e.occurrences.push({...e.occurrences.find(o=>o.kind==='war-archives'),id:'invented-jp-archive',region:'JP'});},
  c=>c.events[0].occurrences.pop()
 ]){const c=clone();mutate(c);assert.throws(()=>auditBackfillEvidence(c,backfill));}
});
test('regional archive dates are independently recorded and do not use inferred midnight countdowns',()=>{
 const e=catalog.events.find(e=>e.id==='visitors-dyed-in-red');
 const dates=Object.fromEntries(e.occurrences.filter(o=>o.kind==='war-archives').map(o=>[o.region,o.start.date]));
 assert.deepEqual(dates,{EN:'2019-09-26',JP:'2018-09-28',CN:'2018-09-28'});
 for(const o of e.occurrences.filter(o=>o.kind==='war-archives')){assert.equal(o.start.kind,'date');assert.equal(o.start.value,undefined);assert.notEqual(occurrenceStatus({...o,releaseState:'announced'},now),'permanent');}
 for(const id of ['frostfall','anthem-of-remembrance'])for(const region of ['JP','CN'])assert.equal(eventRows(catalog,{region},now).some(r=>r.event.id===id&&r.section==='war-archives'),false);
});
