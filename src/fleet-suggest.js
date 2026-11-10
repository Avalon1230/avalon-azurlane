/**
 * AVALON v0.5: constraint-aware, qualitative fleet suggestions.
 * Capability tags below are manually curated editorial candidates, not parsed
 * skill effects or numerical performance measurements. Sources are attached.
 * This module does not calculate battle DPS, eHP, fleet skill proc rates or
 * gear-slot optimization. Future verified mechanics can replace the heuristic.
 */
export const SUGGEST_SOURCES = Object.freeze({
  ch15: {label:'Chapter 15 strategy (Suchiguma)',url:'https://suchiguma.github.io/guides/chapter-15/'},
  ch16: {label:'Chapter 16 fleets (Suchiguma)',url:'https://suchiguma.github.io/guides/chapter-16-fleets/'},
  research: {label:'Research Focus (Suchiguma)',url:'https://suchiguma.github.io/miniguides/research-focus/'},
  regal: {label:'REGAL endgame guide',url:'https://azur-lane-regal.suchiguma.com/'},
  opsi: {label:'OpSi fleet-planning discussion',url:'https://note.com/enrico_pucci/n/ncf3c85aa24dc?hl=en-US'}
});

const row=(name,roles,sources=['regal'],note='Provisional role classification; inspect skills and gear before deploying.')=>({name,roles,sources,note});
export const CURATED_SHIPS=Object.freeze([
  row('Musashi',['bb','barrage','boss','wave'],['ch15','regal']),
  row('Bismarck Zwei',['bb','boss','control'],['regal','ch16']),
  row('New Jersey',['bb','boss'],['regal']),
  row('Alsace',['bb','boss','wave'],['ch16','regal']),
  row('Vanguard',['bb','boss','support'],['regal']),
  row('Mecklenburg',['bb','boss'],['research','regal']),
  row('Lion',['bb','boss'],['regal']),
  row('Sovetsky Soyuz',['bb','boss'],['regal']),
  row('Raffaello',['bb','wave','boss'],['ch15','regal']),
  row('Unicorn (Retrofit)',['carrier','healer','wave','aa'],['ch15','ch16']),
  row('Aquila',['carrier','healer','wave','damage'],['ch15'], 'Healing role requires the correct aircraft-slot configuration.'),
  row('Volga',['carrier','healer','damage','wave'],['ch15']),
  row('Independence (Retrofit)',['carrier','air_support','wave','damage'],['ch15']),
  row('Essex',['carrier','damage','air_support'],['ch15','regal']),
  row('Implacable',['carrier','boss','control','damage'],['ch15','regal']),
  row('Max Immelmann',['carrier','boss','damage'],['research']),
  row('Fritz Rumey',['carrier','damage','boss'],['research']),
  row('Yorktown II',['carrier','boss','damage'],['ch15','regal']),
  row('Hakuryuu',['carrier','boss','damage'],['ch15','regal']),
  row('Admiral Nakhimov',['carrier','boss','damage'],['research'], 'Full potential depends on verified supporting synergies; not assumed here.'),
  row('Cowpens',['carrier','healer','wave'],['ch16']),
  row('Perseus',['carrier','healer','wave'],['regal','opsi']),
  row('Guam',['tank','aa','wave'],['ch15','ch16']),
  row('Brest',['tank','boss','wave'],['ch15','regal']),
  row('Ägir',['tank','boss'],['ch16','regal']),
  row('Anchorage',['tank','defense'],['ch15','regal']),
  row('Cheshire',['tank','aa'],['ch15']),
  row('Plymouth',['support','boss','damage'],['regal','research']),
  row('Shimanto',['aa','wave','damage','asw'],['ch15','ch16']),
  row('San Diego (Retrofit)',['aa','damage'],['ch15','regal']),
  row('Helena (Retrofit)',['debuff','support','boss'],['regal'], 'Debuff timing is not simulated; confirm weapon and attack synchronization.'),
  row('Unzen',['damage','boss'],['ch15','regal']),
  row('Laffey II',['aa','asw','defense','damage'],['ch15','ch16']),
  row('Shimakaze',['damage','asw'],['ch15','regal']),
  row('Harbin',['aa','damage'],['regal']),
  row('Noshiro',['tank','damage'],['regal']),
  row('U-81',['sub'],['ch15']),
  row('U-96',['sub'],['ch15']),
  row('U-47',['sub'],['ch15'])
]);

export const CURATED_BY_NAME=new Map(CURATED_SHIPS.map(p=>[normalizeName(p.name),p]));
export function normalizeName(name){return String(name||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/\s*\(retrofit\)/gi,'').replace(/[^a-z0-9]/gi,'').toLowerCase();}
export function curatedProfile(ship){return CURATED_BY_NAME.get(normalizeName(ship?.name))||null;}
export const SCENARIOS=Object.freeze({
  campaign:[{id:'ch15',label:'Chapter 15 (AA / ASW / sustain)'},{id:'ch16',label:'Chapter 16 (late-campaign sustain)'},{id:'general',label:'General campaign (qualitative)'}],
  opsi:[{id:'sectors',label:'Four-fleet sectors + boss coverage'},{id:'bosses',label:'Four fleets, boss-oriented emphasis'}],
  meta:[{id:'boss',label:'Single boss (mechanics unverified)'}],
  exercises:[{id:'pvp',label:'Exercises (provisional only)'}],
  events:[{id:'event',label:'Event maps (encounter not specified)'}],
  challenge:[{id:'challenge',label:'Challenge (mechanics not specified)'}],
  daily:[{id:'daily',label:'Daily raid (not encounter-calibrated)'}],
  guild:[{id:'guild',label:'Guild operations (boss not specified)'}]
});

const R={
  mBB:{ideal:['bb','barrage'],fallback:['bb','wave'],name:'flagship / wave damage'},
  mHeal:{ideal:['healer'],fallback:['carrier','wave'],name:'sustain carrier'},
  mSecond:{ideal:['healer','damage'],fallback:['carrier','wave'],name:'secondary sustain / air damage'},
  mAir:{ideal:['air_support','aa'],fallback:['carrier','damage'],name:'air coverage'},
  mBoss:{ideal:['bb','boss'],fallback:['boss'],name:'boss main fleet'},
  mCarrier:{ideal:['carrier','boss'],fallback:['carrier','damage'],name:'carrier boss damage'},
  mControl:{ideal:['control','support'],fallback:['carrier','boss'],name:'boss control / support'},
  mFlex:{ideal:['damage'],fallback:['bb','carrier'],name:'main-fleet damage'},
  vTank:{ideal:['tank'],fallback:['defense'],name:'frontline tank'},
  vAA:{ideal:['aa'],fallback:['defense','damage'],name:'AA / frontline cover'},
  vASW:{ideal:['asw'],fallback:['damage'],name:'ASW / vanguard damage'},
  vDPS:{ideal:['damage','boss'],fallback:['damage'],name:'vanguard damage'},
  vSupport:{ideal:['debuff','support'],fallback:['damage'],name:'debuff / combat support'},
  vFlex:{ideal:['damage'],fallback:['aa','defense'],name:'flex vanguard'},
  sCV:{ideal:['air_support','aa'],fallback:['carrier'],name:'support carrier'},
  sub:{ideal:['sub'],fallback:[],name:'submarine'}
};
const surface=(a,b,c,d,e,f)=>({'main-1':a,'main-2':b,'main-3':c,'vanguard-1':d,'vanguard-2':e,'vanguard-3':f});
const mob=surface('mBB','mHeal','mSecond','vTank','vAA','vASW');
const boss=surface('mBoss','mCarrier','mControl','vTank','vSupport','vDPS');
const opsi={
  'opsi-a':surface('mBB','mHeal','mAir','vTank','vAA','vFlex'),
  'opsi-b':surface('mBoss','mBoss','mFlex','vTank','vSupport','vDPS'),
  'opsi-c':surface('mCarrier','mCarrier','mControl','vTank','vDPS','vFlex'),
  'opsi-d':surface('mBoss','mAir','mFlex','vTank','vAA','vDPS')
};
export function recipe(modeId,scenario='') {
  if(!SCENARIOS[modeId])throw new Error('Unsupported mode');
  const result={};
  if(modeId==='opsi')Object.assign(result,opsi);
  else if(modeId==='campaign'||modeId==='events')Object.assign(result,{mob,boss});
  else if(modeId==='exercises')Object.assign(result,{attack:boss,defense:surface('mBoss','mCarrier','mFlex','vTank','vAA','vSupport')});
  else if(modeId==='guild')Object.assign(result,{'guild-a':boss,'guild-b':boss});
  else if(modeId==='meta')Object.assign(result,{meta:boss});
  else if(modeId==='challenge')Object.assign(result,{challenge:boss});
  else if(modeId==='daily')Object.assign(result,{daily:mob});
  if(modeId==='campaign'&&scenario==='ch16')result.mob=surface('mBB','mHeal','mAir','vTank','vAA','vDPS');
  if(modeId==='opsi'&&scenario==='bosses')result['opsi-d']=surface('mBoss','mCarrier','mFlex','vTank','vSupport','vDPS');
  result.support={'support-1':'sCV','support-2':'sCV','support-3':'sCV'};
  result.sub={'sub-1':'sub','sub-2':'sub','sub-3':'sub'};
  return result;
}
const weightOf=(ship,slot,requirement)=>{
  if(!ship||!requirement)return -10000;
  const roles=curatedProfile(ship)?.roles||[];
  if(!roles.length)return -10000;
  const ideal=requirement.ideal.filter(r=>roles.includes(r)).length;
  const fallback=requirement.fallback.filter(r=>roles.includes(r)).length;
  // Internal matching priority only; never display as a combat power rating.
  return 5 + ideal*28 + fallback*8 - (requirement.ideal.length>0&&ideal===0?18:0);
};
const roleFor=(fleetId,slotId,roleMap)=>R[roleMap[fleetId]?.[slotId]||'vFlex'];
const isCompatible=(ship,kind)=>{
  const hull=ship?.hull;
  if(kind==='main')return ['BB','BC','BBV','BM','CV','CVL','AR','AE'].includes(hull);
  if(kind==='vanguard')return ['DD','CL','CA','CB'].includes(hull);
  if(kind==='carrier')return ['CV','CVL'].includes(hull);
  if(kind==='sub')return ['SS','SSV'].includes(hull);
  return false;
};

/** Maximum-weight, unique ship assignment. Hungarian rectangular solver. */
function solveMax(weights) {
  const n=weights.length;if(!n)return[];
  const m=weights[0].length;
  if(m<n)throw new Error('Assignment matrix needs at least one column per slot');
  const max=Math.max(0,...weights.flat());
  const cost=weights.map(row=>row.map(w=>max-w));
  const u=Array(n+1).fill(0),v=Array(m+1).fill(0),p=Array(m+1).fill(0),way=Array(m+1).fill(0);
  for(let i=1;i<=n;i++){
    p[0]=i;let j0=0;const minv=Array(m+1).fill(Infinity),used=Array(m+1).fill(false);
    do{
      used[j0]=true;const i0=p[j0];let delta=Infinity,j1=0;
      for(let j=1;j<=m;j++)if(!used[j]){
        const cur=cost[i0-1][j-1]-u[i0]-v[j];
        if(cur<minv[j]){minv[j]=cur;way[j]=j0;}
        if(minv[j]<delta){delta=minv[j];j1=j;}
      }
      for(let j=0;j<=m;j++) if(used[j]){u[p[j]]+=delta;v[j]-=delta;} else minv[j]-=delta;
      j0=j1;
    }while(p[j0]!==0);
    do{const j1=way[j0];p[j0]=p[j1];j0=j1;}while(j0!==0);
  }
  const answer=Array(n).fill(-1);
  for(let j=1;j<=m;j++)if(p[j]>0)answer[p[j]-1]=j-1;
  return answer;
}

/**
 * Returns {plan,changes,notes,missing,coverage,sourceIds,scenario,modeId}.
 * The existing workspace is untouched; its assignments are treated as locked.
 * A pure matching heuristic is NOT a claim of optimal combat output.
 */
export function suggestFleet({modeId,scenario='',ships,workspace,ownedOnly=false,ownedIds=[],excludedIds=[]}) {
  if(!SCENARIOS[modeId])throw new Error('Unknown mode');
  if(!workspace||workspace.modeId!==modeId||!workspace.fleets)throw new Error('Workspace does not match mode');
  if(!Array.isArray(ships))throw new Error('Missing ship catalog');
  const indexed=new Map(ships.filter(s=>s&&typeof s.id==='string').map(s=>[s.id,s]));
  const used=new Set();const locked=[];
  const slots=[];const roleMap=recipe(modeId,scenario);
  for(const [fleetId,fleet] of Object.entries(workspace.fleets)){
    for(const [slotId,shipId] of Object.entries(fleet)){
      const kind=slotId.startsWith('main-')?'main':slotId.startsWith('vanguard-')?'vanguard':slotId.startsWith('support-')?'carrier':'sub';
      const requirement=roleFor(fleetId,slotId,roleMap);
      if(shipId){
        const ship=indexed.get(shipId);
        if(!ship||!isCompatible(ship,kind)||used.has(shipId))throw new Error('Existing assignments invalid; correct them first');
        used.add(shipId);locked.push({fleetId,slotId,shipId,name:ship.name,kind,requirement:requirement.name});
      } else slots.push({fleetId,slotId,kind,requirement});
    }
  }
  const allowed=new Set(ownedIds),excluded=new Set(excludedIds);
  const pool=ships.filter(ship=>curatedProfile(ship)&&!used.has(ship.id)&&!excluded.has(ship.id)&&(!ownedOnly||allowed.has(ship.id)));
  const shipsByIndex=[...pool];
  // Every slot also has its own empty option. -10000 excludes incompatible hulls.
  const matrix=slots.map((slot,index)=>[...shipsByIndex.map(ship=>isCompatible(ship,slot.kind)?weightOf(ship,slot,slot.requirement):-10000),...slots.map((_,j)=>j===index?0:-10000)]);
  const assignment=solveMax(matrix);
  const plan=structuredClone(workspace),changes=[],missing=[],notes=[],sources=new Set();
  for(let i=0;i<slots.length;i++){
    const slot=slots[i],j=assignment[i];
    const ship=j>=0&&j<shipsByIndex.length?shipsByIndex[j]:null;
    if(!ship||!isCompatible(ship,slot.kind)){missing.push({fleetId:slot.fleetId,slotId:slot.slotId,role:slot.requirement.name});continue;}
    plan.fleets[slot.fleetId][slot.slotId]=ship.id;
    const profile=curatedProfile(ship);
    const matched=slot.requirement.ideal.filter(r=>profile.roles.includes(r));
    const rationale=matched.length?`Reviewed role match: ${matched.join(' + ')}`:'Compatible hull; requested role NOT verified for this ship';
    changes.push({fleetId:slot.fleetId,slotId:slot.slotId,shipId:ship.id,name:ship.name,hull:ship.hull,role:slot.requirement.name,rationale,qualified:matched.length>0,note:profile.note,sources:profile.sources});
    for(const id of profile.sources)sources.add(id);
  }
  for(const row of locked){const profile=curatedProfile(indexed.get(row.shipId));if(!profile){notes.push(`Locked ${row.name} has no reviewed capability profile. Its contribution is not assessed.`)}else{for(const id of profile.sources)sources.add(id);}}
  const unqualified=changes.filter(x=>!x.qualified);
  if(unqualified.length)notes.push(`${unqualified.length} position(s) filled with hull-compatible candidates whose requested role is unverified. Review before use.`);
  if(missing.length)notes.push(`${missing.length} unfilled position(s); expand the reviewed/owned candidate pool or fill manually.`);
  if(ownedOnly && allowed.size===0)notes.push('Owned-only filter is enabled but no candidates were selected.');
  if(modeId==='campaign'&&scenario==='ch15')notes.push('Chapter 15-3/15-4 needs explicit AA, air-control and mob ASW checks; this builder cannot verify AA or ASW gear yet.');
  if(modeId==='campaign'&&scenario==='ch16')notes.push('Chapter 16 mechanics and opening submarine phase require encounter-specific validation; this formation is a role suggestion only.');
  if(modeId==='opsi')notes.push('Four surface fleets are matched jointly without duplicate ships; Siren modifiers, adaptation, and anti-heal mechanics are not simulated.');
  if(!['campaign','opsi'].includes(modeId))notes.push('This mode lacks calibrated enemy/skill models. Treat suggestions as conservative formations, not encounter-clearing guarantees.');
  notes.push('No equipment-slot optimizer or skill-timing simulator is active. Never infer tested synergy or DPS from these selections.');
  return {modeId,scenario,plan,changes,locked,missing,notes,sourceIds:[...sources],reviewedAt:'2026-11-10',scope:'Qualitative role-matching heuristic only'};
}

export function gearAdvisories(modeId,scenario){
  if(modeId==='campaign'&&scenario==='ch15')return [
    {label:'ASW coverage',text:'Equip an appropriate anti-submarine weapon (e.g., Hedgehog) on a compatible vanguard in 15-3/15-4.',source:'ch15'},
    {label:'Anti-air and air control',text:'Check fighter interception, support carriers, fleet AA weapons and air-control state against the stage.',source:'ch15'},
    {label:'Defensive auxiliaries',text:'Evaluate Improved Hydraulic Rudder and other defensive auxiliaries on vulnerable frontline ships.',source:'ch15'}
  ];
  if(modeId==='campaign'&&scenario==='ch16')return [
    {label:'Stage-specific support',text:'Verify AA, ASW, specialist stage effects and opening submarine requirements before auto attempts.',source:'ch16'},
    {label:'Secondary recovery',text:'Consider a second valid healer or defensive alternative if sustained waves exhaust frontline HP.',source:'ch16'}
  ];
  if(modeId==='opsi')return [
    {label:'Boss armor matching',text:'Choose guns and aircraft for each boss armor and modifier; do not copy one boss loadout across all fleets.',source:'regal'},
    {label:'Burst synchronization',text:'Check debuff/buff skill windows against weapons and aircraft reload manually; no timeline simulator is active.',source:'regal'},
    {label:'Sustained fleet durability',text:'Reserve healing/defense for repeated sector fights, keeping specialized boss fleets available.',source:'opsi'}
  ];
  return [{label:'Equipment validation pending',text:'Verify slot compatibility, enhancement, opponent mechanics and skill triggers before treating this formation as final.',source:'regal'}];
}