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
  const fate=dev===30&&record?.fateIds.length===5&&Number.isInteger(value?.fate)&&value.fate>=0&&value.fate<=5?value.fate:0;
  const start=Number.isSafeInteger(value?.start)&&value.start>=0&&value.start<=8640000000000000-604800000?value.start:null;
  const complete=Array.isArray(value?.complete)?value.complete.filter(id=>record?.missions.some(m=>m.id===id)):[];
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
  return (record?.milestones||[]).filter(m=>m.descriptor.startsWith('Dev ')?Number(m.descriptor.slice(4))<=state.dev:Number(m.descriptor.slice(9))<=state.fate);
}

// Original AVALON ornament: compass crown, stepped rails and corner filigree.
// The transparent center preserves the official portrait; never borrowed artwork.
export function researchFrame(ship) {
  const r=researchShip(ship);if(!r)return '';
  return `<svg class="research-frame research-frame-${r.classification.toLowerCase()}" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${r.classification==='DR'?'<defs><linearGradient id="research-prism-'+r.id+'" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffe4a3"/><stop offset=".25" stop-color="#ffaada"/><stop offset=".5" stop-color="#bca7ff"/><stop offset=".75" stop-color="#8ee5ff"/><stop offset="1" stop-color="#b6ffd3"/></linearGradient></defs>':''}<path style="${r.classification==='DR'?'stroke:url(#research-prism-'+r.id+')':''}" class="research-rail" d="M3 30V12L12 3H35 M65 3H88L97 12V30 M97 70V88L88 97H65 M35 97H12L3 88V70"/><path class="research-filigree" d="M3 25L8 20V12H20L25 3 M75 3L80 8H88V20L97 25 M97 75L92 80V88H80L75 97 M25 97L20 92H12V80L3 75 M32 4L40 8L50 2L60 8L68 4 M40 96L50 90L60 96"/><path class="research-crown" d="M43 4L50 12L57 4L50 0Z M0 47L5 50L0 53 M100 47L95 50L100 53"/>${r.classification==='DR'?'<path class="research-filigree" d="M5 37L10 30V18L18 10H30 M70 10H82L90 18V30L95 37 M5 63L10 70V82L18 90H30 M70 90H82L90 82V70L95 63"/>':''}</svg>`;
}
