/** Offline comparison to the separately reviewed, revision-attributed backfill ledger. */
import assert from 'node:assert/strict';
export function auditBackfillEvidence(catalog,evidence){
 const events=new Map(catalog.events.map(e=>[e.id,e]));
 const all=catalog.events.flatMap(e=>e.occurrences.map(o=>({event:e,occurrence:o})));
 const occurrences=new Map(all.map(r=>[r.occurrence.id,r]));
 for(const id of evidence.preservedEventIds)assert.ok(events.has(id),'Stable event identity: '+id);
 for(const id of evidence.preservedOccurrenceIds)assert.ok(occurrences.has(id),'Stable occurrence identity: '+id);
 const verifiedPermanent=new Set();
 const date=t=>t.date||t.value?.slice(0,10);
 for(const row of evidence.archiveIndexRows){
  const e=events.get(row.eventId);assert.ok(e,'Indexed event: '+row.eventId);
  for(const [region,day] of Object.entries(row.dates)){
   const runs=e.occurrences.filter(o=>o.region===region&&o.kind==='war-archives');
   assert.equal(runs.length,1,e.id+' '+region+' canonical permanent release');const o=runs[0];
   assert.equal(date(o.start),day,e.id+' '+region+' source date');
   assert.equal(o.releaseState,'released');
   for(const id of row.sourceIds)assert.ok(o.sourceIds.includes(id),'Indexed provenance: '+o.id);
   verifiedPermanent.add(o.id);
  }
 }
 for(const fact of evidence.publisherOccurrences){
  const r=occurrences.get(fact.occurrenceId);assert.ok(r,'Publisher occurrence: '+fact.occurrenceId);const o=r.occurrence;
  assert.equal(r.event.id,fact.eventId);assert.equal(o.region,fact.region);assert.equal(o.kind,fact.kind);assert.equal(date(o.start),fact.start);
  assert.equal(o.end?.value||null,fact.end);assert.equal(o.start.kind,'maintenance');
  for(const id of fact.sourceIds){assert.ok(o.sourceIds.includes(id));assert.equal(catalog.sources[id].type,'official');}
  if(o.kind==='war-archives')verifiedPermanent.add(o.id);
 }
 for(const fact of evidence.selectedHistory){
  for(const region of fact.regions){
   const runs=events.get(fact.eventId).occurrences.filter(o=>o.region===region&&o.kind===fact.kind&&date(o.start)===fact.start);
   assert.equal(runs.length,1,fact.eventId+' '+region+' historical identity');const o=runs[0];
   assert.equal(date(o.end),fact.end);for(const id of fact.sourceIds)assert.ok(o.sourceIds.includes(id));
  }
 }
 for(const {occurrence:o} of all.filter(r=>r.occurrence.kind==='war-archives'&&r.occurrence.releaseState==='released'))assert.ok(verifiedPermanent.has(o.id),'Permanent availability lacks reviewed regional evidence: '+o.id);
 for(const id of evidence.indexSourceIds){const source=catalog.sources[id];assert.equal(source.type,'wiki');assert.ok(source.revision&&source.pageId&&source.licenseUrl,'Pinned attribution: '+id);}
 return {indexedIdentities:evidence.archiveIndexRows.length,publisherOccurrences:evidence.publisherOccurrences.length,selectedHistories:evidence.selectedHistory.length,verifiedPermanent:verifiedPermanent.size};
}
