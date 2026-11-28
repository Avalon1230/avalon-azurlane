/** CHRONICLE domain contract. Pure functions accept a clock; no DOM or timers. */
export const EVENT_REGIONS = Object.freeze({EN:'EN · UTC−7',JP:'JP · Japan',CN:'CN · China'});
export const EVENT_CATEGORIES = Object.freeze({major:'Major event',collaboration:'Collaboration',mini:'Mini-event',raid:'Raid',research:'Research campaign',recurring:'Recurring activity'});
export const EVENT_ZONE = 'Asia/Manila';
export const EVENT_STATUSES = Object.freeze({ongoing:'Ongoing',upcoming:'Upcoming',ended:'Ended',permanent:'War Archives',maintenance:'Maintenance day · closure time unconfirmed',delayed:'Delayed',pending:'Awaiting launch',unknown:'Schedule TBA'});
const ID = /^[a-z0-9][a-z0-9-]{0,95}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const INSTANT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(?:Z|[+-]\d{2}:\d{2})$/;
const CONTENT_KINDS=['ship','equipment','augment','gear-skin','outfit','cosmetic','furniture','currency','mission','reward','shop','mechanic','requirement','other'];
export function safeEventUrl(value){
  try {const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password?u.href:null;}catch{return null;}
}
export function validZone(zone){if(typeof zone!=='string'||!zone)return false;try {new Intl.DateTimeFormat('en',{timeZone:zone}).format();return true;}catch{return false;}}
function validDate(value){const stamp=Date.parse(value+'T00:00:00Z');return typeof value==='string'&&DATE.test(value)&&Number.isFinite(stamp)&&new Date(stamp).toISOString().slice(0,10)===value;}
export function validInstant(value){
  if(typeof value!=='string'||!INSTANT.test(value)||!Number.isFinite(Date.parse(value)))return false;
  return validDate(value.slice(0,10))&&Number(value.slice(11,13))<24&&Number(value.slice(14,16))<60&&Number(value.slice(17,19))<60;
}
export function dateInZone(now,zone){
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
  const get=k=>parts.find(p=>p.type===k).value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}
export function validateEventCatalog(catalog){
  const errors=[],check=(test,path,message)=>{if(!test)errors.push(path+': '+message);};
  check(catalog?.schemaVersion===1,'catalog','unsupported schema version');
  check(validInstant(catalog?.updatedAt),'catalog.updatedAt','timezone-aware timestamp required');
  check(catalog?.coverage==='partial','catalog.coverage','initial catalog must disclose partial coverage');
  const sources=catalog?.sources&&typeof catalog.sources==='object'&&!Array.isArray(catalog.sources)?catalog.sources:{};
  for(const [id,s] of Object.entries(sources)){
    check(ID.test(id)&&s?.title&&safeEventUrl(s.url),'sources.'+id,'invalid source');
    check(['wiki','official','client','avalon','supplementary'].includes(s?.type),'sources.'+id,'source hierarchy required');
    check(validInstant(s?.checkedAt),'sources.'+id,'checkedAt required');
    check(!!s?.revision||validDate(s?.publishedAt||''),'sources.'+id,'revision or publication date required');
  }
  const refs=(value,path)=>check(Array.isArray(value)&&value.length>0&&value.every(id=>Object.hasOwn(sources,id)),path,'known source references required');
  const time=(t,path,{end=false}={})=>{
    const kinds=end?['exact','date','maintenance-close','tba']:['exact','date','maintenance','tba'];
    check(t&&kinds.includes(t.kind),path,'invalid date precision');
    if(!t)return;
    check(t.certainty==null||t.certainty==='confirmed',path,'estimates are not confirmed schedules; use TBA');
    refs(t.sourceIds,path+'.sourceIds');
    check(validZone(t.zone),path,'IANA timezone required');
    if(t.kind==='exact')check(validInstant(t.value),path,'exact instant needs timezone offset');
    if(['date','maintenance','maintenance-close'].includes(t.kind))check(validDate(t.date||''),path,'valid calendar date required');
    if(t.kind!=='exact')check(t.value==null,path,'non-exact date must not carry an instant');
    if(t.kind==='tba')check(t.date==null,path,'TBA must not carry a predicted date');
  };
  check(Array.isArray(catalog?.events),'events','array required');
  const identities=new Set(),occurrences=new Set();
  for(const e of Array.isArray(catalog?.events)?catalog.events:[]){
    if(!e||typeof e!=='object'){errors.push('events: invalid record');continue;}
    const path='events.'+e.id;
    check(ID.test(e.id)&&!identities.has(e.id),path,'duplicate/invalid event identity');identities.add(e.id);
    check(typeof e.title==='string'&&e.title.trim()&&Object.hasOwn(EVENT_CATEGORIES,e.category),path,'title/category required');
    refs(e.sourceIds,path);check(validInstant(e.verifiedAt),path,'verification timestamp required');
    check(Array.isArray(e.missing)&&Array.isArray(e.occurrences)&&e.occurrences.length>0,path,'coverage and occurrences required');
    if(e.artwork)check(safeEventUrl(e.artwork.url)&&e.artwork.alt,path,'invalid artwork');
    if(e.artwork?.fallbackUrl)check(safeEventUrl(e.artwork.fallbackUrl),path,'invalid fallback artwork');
    if(e.artwork)refs(e.artwork.sourceIds,path+'.artwork');
    const regionRuns=new Set();
    for(const o of Array.isArray(e.occurrences)?e.occurrences:[]){
      if(!o||typeof o!=='object'){errors.push(path+': invalid occurrence');continue;}
      const p=path+'.'+o.id;
      check(ID.test(o.id)&&!occurrences.has(o.id),p,'duplicate/invalid occurrence ID');occurrences.add(o.id);
      check(Object.hasOwn(EVENT_REGIONS,o.region)&&['original','rerun','war-archives','campaign'].includes(o.kind),p,'invalid region/occurrence kind');
      const key=[o.region,o.kind,o.start?.value||o.start?.date||'tba'].join('|');
      check(!regionRuns.has(key),p,'duplicate regional occurrence');regionRuns.add(key);
      check(['announced','released','delayed'].includes(o.releaseState),p,'release state required');
      refs(o.sourceIds,p);time(o.start,p+'.start');
      if(o.kind!=='war-archives')time(o.end,p+'.end',{end:true});
      else check(o.end==null,p,'permanent additions cannot expire');
      if(o.start?.kind==='exact'&&o.end?.kind==='exact')check(Date.parse(o.start.value)<Date.parse(o.end.value),p,'end must follow start');
      if(o.start?.date&&o.end?.date)check(o.start.date<=o.end.date,p,'end date must follow start date');
      if(o.start?.date&&o.end?.kind==='exact'&&validInstant(o.end.value)&&validZone(o.start.zone))check(o.start.date<=dateInZone(Date.parse(o.end.value),o.start.zone),p,'end must follow start date');
      if(o.start?.kind==='exact'&&o.end?.date&&validInstant(o.start.value)&&validZone(o.end.zone))check(dateInZone(Date.parse(o.start.value),o.end.zone)<=o.end.date,p,'end date must follow start');
      if(o.releaseState==='released')check(validInstant(o.releaseConfirmedAt),p,'release observation required');
      const phaseIds=new Set();
      check(o.phases==null||Array.isArray(o.phases),p,'phases must be an array');
      for(const phase of Array.isArray(o.phases)?o.phases:[]){
        if(!phase){errors.push(p+': invalid phase');continue;}
        check(ID.test(phase.id)&&!phaseIds.has(phase.id)&&phase.label,p,'invalid/duplicate phase');phaseIds.add(phase.id);
        check(['stage','mission','shop','claim','other'].includes(phase.kind),p,'invalid phase kind');
        time(phase.at,p+'.phases.'+phase.id);refs(phase.sourceIds,p+'.phases.'+phase.id);
      }
      check(o.revisions==null||Array.isArray(o.revisions),p,'revisions must be an array');
      for(const revision of Array.isArray(o.revisions)?o.revisions:[]){check(validInstant(revision?.changedAt)&&revision?.note,p,'invalid revision');refs(revision?.sourceIds,p+'.revisions');}
    }
    const contentIds=new Set();
    check(Array.isArray(e.content)&&Array.isArray(e.stages),path,'content and stages must be arrays');
    for(const item of [...(Array.isArray(e.content)?e.content:[]),...(Array.isArray(e.stages)?e.stages:[])]){
      if(!item){errors.push(path+': invalid content');continue;}
      check(ID.test(item.id)&&!contentIds.has(item.id)&&item.name,path+'.content','duplicate/invalid content identity');contentIds.add(item.id);
      refs(item.sourceIds,path+'.'+item.id);
      check(CONTENT_KINDS.includes(item.kind)||item.kind==='stage',path+'.'+item.id,'unsupported content kind');
      check(Array.isArray(item.regions)&&item.regions.length>0&&item.regions.every(r=>Object.hasOwn(EVENT_REGIONS,r)),path+'.'+item.id,'verified content regions required');
      check(Array.isArray(item.occurrenceIds)&&item.occurrenceIds.length>0&&item.occurrenceIds.every(id=>Array.isArray(e.occurrences)&&e.occurrences.some(o=>o?.id===id&&item.regions?.includes(o.region))),path+'.'+item.id,'known matching occurrences required');
      if(item.artwork){check(safeEventUrl(item.artwork.url)&&item.artwork.alt,path+'.'+item.id,'invalid item artwork');refs(item.artwork.sourceIds,path+'.'+item.id+'.artwork');}
      if(item.skinId)check(item.kind==='outfit'&&/^\d{5,10}$/.test(item.skinId)&&!!item.shipId,path+'.'+item.id,'skin link requires a ship and numeric skin ID');
      if(item.kind==='gear-skin')check(!item.equipmentId&&!item.stats,path+'.'+item.id,'cosmetics cannot be combat equipment');
      for(const key of ['shipId','equipmentId'])if(item[key])check(/^\d{2,8}$/.test(item[key]),path+'.'+item.id,'numeric source ID required');
      if(item.dropRate!=null){check(Number.isFinite(item.dropRate)&&item.dropRate>=0&&item.dropRate<=1&&item.dropRateSourceIds?.length,path+'.'+item.id,'drop rate requires evidence');refs(item.dropRateSourceIds,path+'.'+item.id+'.dropRate');}
      if(item.encounter){check(item.encounter.evidenceClass==='verified-client'&&item.encounter.sourceIds?.length&&item.encounter.id,path+'.'+item.id,'encounter requires evidence contract');refs(item.encounter.sourceIds,path+'.'+item.id+'.encounter');}
    }
  }
  return errors;
}
function before(t,now){
  if(t?.kind==='exact')return now<Date.parse(t.value);
  if(['date','maintenance'].includes(t?.kind))return dateInZone(now,t.zone)<t.date;
  return null;
}
function ended(t,now){
  if(t?.kind==='exact')return now>=Date.parse(t.value);
  if(t?.kind==='date'||t?.kind==='maintenance-close')return dateInZone(now,t.zone)>t.date;
  return false;
}
export function occurrenceStatus(o,now=Date.now()){
  // End bounds always win over stale publisher/live flags.
  if(ended(o.end,now))return 'ended';
  if(o.releaseState==='delayed')return 'delayed';
  if(before(o.start,now)===true)return 'upcoming';
  const observed=o.releaseState==='released'&&now>=Date.parse(o.releaseConfirmedAt);
  // Permanent availability requires a verified release observation, even after an exact announced date.
  if(o.kind==='war-archives'){
    if(observed)return 'permanent';
    return o.start?.kind==='tba'?'unknown':'pending';
  }
  if(observed&&o.end?.kind==='maintenance-close'&&dateInZone(now,o.end.zone)===o.end.date)return 'maintenance';
  if(o.start?.kind==='exact'&&before(o.start,now)===false||observed)return 'ongoing';
  if(['date','maintenance'].includes(o.start?.kind))return 'pending';
  return 'unknown';
}
export function eventSection(status){return ['ongoing','maintenance'].includes(status)?'ongoing':status==='ended'?'past':status==='permanent'?'war-archives':'upcoming';}
export function occurrenceSortTime(o){return o.start?.value?Date.parse(o.start.value):o.start?.date?Date.parse(o.start.date+'T00:00:00Z'):null;}
// An identity match covers every run. A named reward can be offered on only some runs,
// even when the event description also mentions that reward.
function matchingRewardRuns(event,region,term){
  const matches=value=>value?.toLocaleLowerCase().includes(term);
  if(!term||[event.title,event.franchise,...(event.aliases||[])].some(matches))return null;
  const items=(event.content||[]).filter(item=>matches(item.name));
  if(!items.length&&matches(event.description))return null;
  return new Set(items.filter(item=>item.regions.includes(region)).flatMap(item=>item.occurrenceIds));
}
export function eventRows(catalog,filters={},now=Date.now()){
  const {region='EN',query='',year='all',category='all',status='all',sort='newest',view='cards'}=filters;
  const term=String(query).trim().toLocaleLowerCase();
  const rows=[];
  for(const event of catalog?.events||[]){
    if(category!=='all'&&event.category!==category)continue;
    const rewardRuns=matchingRewardRuns(event,region,term);
    const latestBySection=new Map();
    for(const occurrence of event.occurrences){
      if(occurrence.region!==region||(rewardRuns&&!rewardRuns.has(occurrence.id)))continue;
      if(year!=='all'&&String(occurrence.start.value||occurrence.start.date||'').slice(0,4)!==year)continue;
      const runStatus=occurrenceStatus(occurrence,now);
      if(status!=='all'&&runStatus!==status)continue;
      const section=eventSection(runStatus);
      const row={event,occurrence,status:runStatus,section};
      if(view==='timeline'){
        rows.push(row);
        continue;
      }
      const latest=latestBySection.get(section);
      if(!latest||(occurrenceSortTime(occurrence)??-Infinity)>(occurrenceSortTime(latest.occurrence)??-Infinity)){
        latestBySection.set(section,row);
      }
    }
    rows.push(...latestBySection.values());
  }
  return rows.sort((a,b)=>{
    const aTime=occurrenceSortTime(a.occurrence),bTime=occurrenceSortTime(b.occurrence);
    if(aTime===null||bTime===null)return aTime===bTime?a.event.title.localeCompare(b.event.title):aTime===null?1:-1;
    return (sort==='oldest'?1:-1)*(aTime-bTime)||a.event.title.localeCompare(b.event.title);
  });
}
export function formatEventTime(t,zone=EVENT_ZONE){
  if(!t||t.kind==='tba')return 'TBA';
  if(t.kind==='exact')return new Intl.DateTimeFormat('en-GB',{timeZone:zone,day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',...(new Date(t.value).getUTCSeconds()?{second:'2-digit'}:{}),timeZoneName:'short'}).format(new Date(t.value));
  const date=new Intl.DateTimeFormat('en-GB',{timeZone:'UTC',day:'2-digit',month:'short',year:'numeric'}).format(new Date(t.date+'T12:00:00Z'));
  const regionZone=({'Etc/GMT+7':'EN server (UTC−7)','Asia/Tokyo':'Japan (UTC+9)','Asia/Shanghai':'China (UTC+8)'})[t.zone]||t.zone;
  if(t.kind==='maintenance-close')return date+' · '+regionZone+' · at maintenance';
  return date+' · '+regionZone+(t.kind==='maintenance'?' · after maintenance':' · time TBA');
}
export function eventCountdown(t,now=Date.now()){
  if(t?.kind==='maintenance-close')return 'Closes at maintenance · exact time TBA';
  if(t?.kind!=='exact')return t?.kind==='maintenance'?'After maintenance · exact time TBA':t?.kind==='date'?(dateInZone(now,t.zone)>t.date?'Scheduled date passed · exact time unconfirmed':'Date confirmed · time TBA'):'TBA';
  if(!validInstant(t.value)||!Number.isFinite(now))return 'TBA';
  const left=Math.max(0,Math.ceil((Date.parse(t.value)-now)/1000));
  if(!left)return 'Deadline reached';
  const d=Math.floor(left/86400),h=Math.floor(left%86400/3600),m=Math.floor(left%3600/60),s=left%60;
  return `${d?d+'d ':''}${h}h ${m}m ${s}s`;
}
export function eventStateSignature(catalog,region,now=Date.now()){
  return (catalog?.events||[]).flatMap(e=>e.occurrences.filter(o=>!region||o.region===region).map(o=>[o.id,occurrenceStatus(o,now),...(o.phases||[]).map(p=>[ended(p.at,now),['shop','claim'].includes(p.kind)&&p.at.kind==='exact'&&now>=Date.parse(p.at.value)-48*60*60*1000].join('/'))].join(':'))).join('|');
}
export const DEFAULT_EVENT_FILTERS=Object.freeze({region:'EN',query:'',year:'all',category:'all',status:'all',sort:'newest',view:'cards',zone:EVENT_ZONE});
export function parseEventRoute(hash){const match=String(hash).match(/^#\/events(?:\/([a-z0-9][a-z0-9-]{0,95})(?:\?occurrence=([a-z0-9][a-z0-9-]{0,95}))?)?$/);return match?{page:'events',eventId:match[1]||null,...(match[2]?{occurrenceId:match[2]}:{})}:null;}
export function normalizeEventFilters(raw={}){
  return {...DEFAULT_EVENT_FILTERS,
    region:Object.hasOwn(EVENT_REGIONS,raw?.region)?raw.region:'EN',
    query:typeof raw?.query==='string'?raw.query.slice(0,150):'',
    year:/^20\d{2}$/.test(raw?.year)?raw.year:'all',
    category:Object.hasOwn(EVENT_CATEGORIES,raw?.category)?raw.category:'all',
    status:Object.hasOwn(EVENT_STATUSES,raw?.status)?raw.status:'all',
    sort:raw?.sort==='oldest'?'oldest':'newest',view:raw?.view==='timeline'?'timeline':'cards',
    zone:[EVENT_ZONE,'UTC','Asia/Tokyo','Asia/Shanghai','Etc/GMT+7'].includes(raw?.zone)?raw.zone:EVENT_ZONE};
}
