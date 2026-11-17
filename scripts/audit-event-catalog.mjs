/** Offline CHRONICLE coverage audit; does not infer availability from age. */
import {readFileSync} from 'node:fs';
import {validateEventCatalog,occurrenceStatus} from '../src/events.js';
const catalog=JSON.parse(readFileSync(new URL('../data/events/catalog.json',import.meta.url),'utf8'));
const errors=validateEventCatalog(catalog);
if(errors.length){console.error(errors.slice(0,20).join('\n'));process.exitCode=1;}
const asOf=Date.parse(catalog.updatedAt),all=catalog.events.flatMap(e=>e.occurrences.map(o=>({event:e,occurrence:o})));
for(const region of ['EN','JP','CN']){
 const own=all.filter(r=>r.occurrence.region===region);
 const permanent=own.filter(r=>r.occurrence.kind==='war-archives'&&occurrenceStatus(r.occurrence,asOf)==='permanent');
 const past=own.filter(r=>['original','rerun','campaign'].includes(r.occurrence.kind)&&occurrenceStatus(r.occurrence,asOf)==='ended');
 const pending=own.filter(r=>r.occurrence.kind==='war-archives'&&occurrenceStatus(r.occurrence,asOf)!=='permanent');
 console.log(region+': '+new Set(own.map(r=>r.event.id)).size+' identities; '+own.length+' occurrences; '+new Set(past.map(r=>r.event.id)).size+' historical identities; '+permanent.length+' permanent occurrences; '+pending.length+' unreleased/TBA permanent additions.');
}
const noObservation=all.filter(r=>r.occurrence.kind==='war-archives'&&r.occurrence.releaseState==='released'&&!r.occurrence.releaseConfirmedAt);
if(noObservation.length){console.error('Unconfirmed permanent entries: '+noObservation.map(r=>r.occurrence.id).join(', '));process.exitCode=1;}
console.log('CHRONICLE CATALOG AUDIT: '+catalog.events.length+' identities, '+all.length+' occurrences, '+Object.keys(catalog.sources).length+' sources; coverage='+catalog.coverage+'.');
