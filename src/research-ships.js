import { SHIP_NATION_BY_SOURCE_ID } from './catalog-filters.js';
import { RESEARCH_MANIFEST } from './research-manifest.js';

export const RESEARCH_STORAGE_KEY='avalon.research.v1';
export function researchShip(ship) {
  const id=String(typeof ship==='object'&&ship!==null?ship.sourceId??ship.id:ship??'');
  if(!/^\d{2,8}$/.test(id))return null;
  const record=RESEARCH_MANIFEST.records[id];
  return record&&record.id===id&&['PR','DR'].includes(record.classification)&&Number.isInteger(record.series)?record:null;
}
export function researchSelection(record, value={}) {
  const dev=Number.isInteger(value?.dev)&&value.dev>=0&&value.dev<=30?value.dev:30;
  const fate=dev===30&&Array.isArray(record?.fateIds)&&record.fateIds.length===5&&Number.isInteger(value?.fate)&&value.fate>=0&&value.fate<=5?value.fate:0;
  const start=Number.isSafeInteger(value?.start)&&value.start>=0&&value.start<=8640000000000000-604800000?value.start:null;
  const complete=Array.isArray(value?.complete)&&Array.isArray(record?.missions)?value.complete.filter(id=>record.missions.some(m=>m?.id===id)):[];
  return {dev,fate,start,complete:[...new Set(complete)]};
}
export function readResearchState(storage) {
  try {
    const raw=JSON.parse(storage.getItem(RESEARCH_STORAGE_KEY)||'{}');
    if(!raw||Array.isArray(raw)||typeof raw!=='object')return {};
    return Object.fromEntries(Object.entries(raw).filter(([id])=>researchShip(id)).map(([id,v])=>[id,researchSelection(researchShip(id),v)]));
  }catch{return {};}
}
export function saveResearchState(storage,state){
  try{storage.setItem(RESEARCH_STORAGE_KEY,JSON.stringify(state));return true;}catch{return false;}
}
export function missionCountdown(mission,start,now=Date.now()) {
  if(!mission||!Number.isSafeInteger(mission.gateSeconds)||mission.gateSeconds<0||!Number.isSafeInteger(start)||start<0||!Number.isFinite(now))return null;
  const end=start+mission.gateSeconds*1000;
  if(!Number.isSafeInteger(end)||end>8640000000000000)return null;
  return Math.max(0,Math.ceil((end-now)/1000));
}
export function countdownLabel(seconds) {
  if(seconds===null)return 'Set your research start to track this gate';
  if(seconds===0)return 'Time gate passed — check the mission requirements in-game';
  const hours=Math.floor(seconds/3600),minutes=Math.floor(seconds%3600/60),secs=seconds%60;
  return `${hours}h ${minutes}m ${secs}s until the time gate opens`;
}
export function selectedMilestones(record,selection) {
  const state=researchSelection(record,selection);
  return (Array.isArray(record?.milestones)?record.milestones:[]).filter(m=>{
    if(!m||typeof m.descriptor!=='string'||!Array.isArray(m.value))return false;
    const match=m.descriptor.match(/^(Dev|Fate Sim) (\d+)$/);
    return match&&Number(match[2])>0&&Number(match[2])<=(match[1]==='Dev'?state.dev:state.fate);
  });
}

// Identity comes from exact research records or the existing source-ID nationality map.
export function portraitIdentity(ship) {
 const r=researchShip(ship);if(r)return r.classification.toLowerCase();
 const id=String(typeof ship==='object'&&ship!==null?ship.sourceId??ship.id:ship??'');
 return SHIP_NATION_BY_SOURCE_ID[id]==='META'?'meta':'';
}
export function researchFrame(ship) {
 const identity=portraitIdentity(ship);
 return identity?'<span class="research-frame research-frame-'+identity+'" aria-hidden="true"></span>':'';
}
