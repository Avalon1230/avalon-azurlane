import { MODES, FLEET_BLUEPRINTS, SHIPS, EQUIPMENT, SOURCES } from './catalog.js';
import { SHIP_MAP, compatible, createWorkspace, assignShip, normalizeWorkspace, countAssigned, findFirstVacancy, slotsForFleet, wikiLookupUrl, searchCatalog, escapeHtml, refreshShipIndex } from './domain.js';
import { loadLiveCatalogs, loadDetailedShips, mergeShipCatalog, mergeEquipmentCatalog } from './remote.js';
import { contextCriteria, evaluationState } from './criteria.js';
import { changelogToHtml } from './changelog.js';
import { TIER_BOARDS, catalogForBoard, freshTierBoards, normalizeTierBoards, moveTierItem } from './tiers.js';
import { renderTierView } from './tier-view.js';
import { imageMarkup, assetCoverage } from './media.js';
import { renderCatalogIndex, SHIP_ROSTER_BATCH_SIZE, EQUIPMENT_ROSTER_BATCH_SIZE } from './catalog-index.js';
import { renderEquipmentRosterTile, renderEquipmentFamilyDetails } from './equipment-roster.js';
import { equipmentFamilyMembers, EQUIPMENT_GROUP_MODES, EQUIPMENT_BROAD_TYPES } from './equipment-browse.js';
import { renderShipRosterTile } from './ship-roster.js';
import { loadEquipmentDrops, renderEquipmentAcquisition } from './equipment-acquisition.js';
import { renderShipProfile, detailedShipRecord } from './ship-profiles.js';
import { LOADOUT_MODES, buildShipLoadout, validateManualChoice } from './loadout-intelligence.js';
import { renderLoadoutAlternatives } from './loadout-view.js';
import { loadArtworkCatalog, artworkSkinsForShip } from './artwork-catalog.js';
import { loadWikiDefaultArtwork } from './wiki-artwork.js';
import { loadWikiShipFacts } from './wiki-ship-facts.js';
import { nationForEquipment, possibleEquipmentHulls } from './catalog-filters.js';
import { shipBrowseDisplayNation } from './ship-factions.js';
import { curatedProfile, SCENARIOS, suggestFleet } from './fleet-suggest.js';
import { renderSuggestedFleet } from './fleet-suggest-view.js';

const $ = selector => document.querySelector(selector);
const E = escapeHtml;
const storageKey = 'avalon.azurlane.plans.v1';
const tierStorageKey = 'avalon.azurlane.tiers.v1';
const suggestStorageKey = 'avalon.azurlane.suggest.v1';
const loadoutStorageKey = 'avalon.azurlane.loadouts.v1';
const pages = [
  { id: 'overview', label: 'Overview', icon: '⌂' },
  { id: 'modes', label: 'Game Modes', icon: '◈' },
  { id: 'ships', label: 'Ship Index', icon: '♙' },
  { id: 'equipment', label: 'Equipment', icon: '⚙' },
  { id: 'fleet', label: 'Fleet Lab', icon: '▦' },
  { id: 'tiers', label: 'Tier Boards', icon: '♛' },
  { id: 'sources', label: 'Sources', icon: '≡' },
  { id: 'updates', label: 'Updates', icon: '↻' }
];
const state = {
  page: 'overview', modeId: 'opsi', query: '', hull: 'all', category: 'all',
  shipNation:'all', gearNation:'all', gearHull:'all', shipVisibleCount:SHIP_ROSTER_BATCH_SIZE, shipRosterScrollY:0, gearVisibleCount:EQUIPMENT_ROSTER_BATCH_SIZE,
  shipSort:'rarity', shipDescending:true, shipRarity:'all', shipAdvancedOpen:false,
  profileLoadoutMode:'general',profileGearId:null,profileLoadoutPicker:null,savedLoadouts:{}, gearSort:'rarity', gearDescending:true, gearRarity:'all', gearBroadType:'all', gearGroup:'type', gearAdvancedOpen:false, profileLevel:'level120',profileSkin:0,artViewerOpen:false,
  shipDetails:{status:'idle',data:null,error:''},
  equipmentAcquisition:{status:'idle',index:null,error:''},
  picker: null, pickerQuery: '', detail: null, workspaces: {}, pendingPlans: null, toastTimer: null,
  sync: { status:'loading', ships:0, equipment:0, shipVersion:null, checkedAt:null, errors:[] },
  changelog: null, changelogStatus: 'idle',
  tierBoard: 'ships', tierQuery: '', tierFilter: 'all', tierBoards: freshTierBoards(), activeDragItem: null,
  suggestOptions: {scenario:'',ownedOnly:false,ownedIds:[],poolOpen:false}, suggestPreview:null
};

function loadSavedLoadouts() {
  try{
    const raw=localStorage.getItem(loadoutStorageKey)||'{}';
    if(raw.length>150000)return;
    const value=JSON.parse(raw);
    if(value&&typeof value==='object'&&!Array.isArray(value))state.savedLoadouts=value;
  }catch{state.savedLoadouts={};}
}
function saveLoadoutPicks() {
  try{
    localStorage.setItem(loadoutStorageKey,JSON.stringify(state.savedLoadouts));
  }catch{notify('Unable to save equipment selections in browser storage.');}
}
function currentShipLoadoutModel(ship,data,sourceId) {
  const id=String(sourceId||data?.id||ship?.sourceId||'');
  const saved=state.savedLoadouts?.[id]?.[state.profileLoadoutMode];
  return buildShipLoadout({
    ship,data,wikiFacts:wikiFactsCache.get(id)||null,
    equipment:EQUIPMENT,mode:state.profileLoadoutMode,
    overrides:saved&&typeof saved==='object'&&!Array.isArray(saved)?saved:{}
  });
}
function loadPlans() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    // Preserve unresolved remote IDs until the external ship index is loaded.
    state.pendingPlans = saved;
    for (const mode of MODES) state.workspaces[mode.id] = normalizeWorkspace(saved[mode.id], mode.id);
  } catch {
    for (const mode of MODES) state.workspaces[mode.id] = createWorkspace(mode.id);
  }
}
function savePlans() {
  try {
    if (state.pendingPlans) {
      // Do not erase ship IDs from previous sessions just because their
      // external catalog has not loaded yet.
      for (const mode of MODES) {
        const raw=state.pendingPlans[mode.id];
        const prior=raw && typeof raw==='object' ? raw : createWorkspace(mode.id);
        const current=state.workspaces[mode.id];
        for(const fleetId of mode.fleetTypes) for(const [slotId,id] of Object.entries(current.fleets[fleetId])) {
          prior.fleets ??= {};
          prior.fleets[fleetId] ??= {};
          // Keep a previously assigned unknown external ID, unless the
          // user changed a known slot (including clearing it).
          if(id || SHIP_MAP.has(prior.fleets[fleetId][slotId])) prior.fleets[fleetId][slotId]=id;
        }
        state.pendingPlans[mode.id]=prior;
      }
      localStorage.setItem(storageKey,JSON.stringify(state.pendingPlans));
    } else localStorage.setItem(storageKey,JSON.stringify(state.workspaces));
  } catch { notify('Browser storage unavailable; export your plan to keep it.'); }
}

function loadSuggestOptions() {
  try {
    const x=JSON.parse(localStorage.getItem(suggestStorageKey)||'{}');
    if(!x || typeof x!=='object' || Array.isArray(x)) return;
    state.suggestOptions={
      scenario: typeof x.scenario==='string'?x.scenario:'',
      ownedOnly: x.ownedOnly===true,
      ownedIds: Array.isArray(x.ownedIds)?[...new Set(x.ownedIds.filter(id=>typeof id==='string'&&/^[\w-]{1,96}$/.test(id)))].slice(0,1000):[],
      poolOpen:false
    };
  } catch { /* unavailable */ }
}
function saveSuggestOptions() {
  try { localStorage.setItem(suggestStorageKey,JSON.stringify({
    scenario:state.suggestOptions.scenario,ownedOnly:state.suggestOptions.ownedOnly,
    ownedIds:state.suggestOptions.ownedIds
  })); } catch { notify('Browser storage unavailable for ship availability.'); }
}
function loadTierBoards() {
  try { state.tierBoards = normalizeTierBoards(JSON.parse(localStorage.getItem(tierStorageKey) || '{}')); }
  catch { state.tierBoards = freshTierBoards(); }
}
function saveTierBoards() {
  try { localStorage.setItem(tierStorageKey, JSON.stringify(state.tierBoards)); }
  catch { notify('Cannot save tiers in this browser. Use Export JSON to back up your selections.'); }
}
function movePersonalTier(itemId, tier) {
  if (TIER_BOARDS[state.tierBoard].readOnly) return notify('Combat assessments come from published research, not personal placements.');
  const eligible = catalogForBoard(state.tierBoard, SHIPS, EQUIPMENT);
  try {
    state.tierBoards = moveTierItem(state.tierBoards, state.tierBoard, itemId, tier, eligible);
    saveTierBoards();
    render();
  } catch (err) { notify(err.message); }
}
function exportTierBoard() {
  if (TIER_BOARDS[state.tierBoard].readOnly) return notify('Research assessments are published sources, not a personal board to export.');
  const content = JSON.stringify({
    app: 'avalon-azurlane', format: 1, kind: 'personal-tier-board',
    boardId: state.tierBoard, exportedAt: new Date().toISOString(),
    tiers: state.tierBoards[state.tierBoard]
  }, null, 2);
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `avalon-${state.tierBoard}-tiers.json`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
  notify('Your personal tier board was exported as JSON.');
}
function notify(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => toast.classList.remove('visible'), 3500);
}
function go(page) {
  if (!pages.some(p => p.id === page)) page = 'overview';
  state.page = page;
  state.query = '';
  state.hull = 'all';
  state.category = 'all';
  state.shipNation='all';state.gearNation='all';state.gearHull='all';
  state.shipVisibleCount=SHIP_ROSTER_BATCH_SIZE;state.shipRosterScrollY=0;state.gearVisibleCount=EQUIPMENT_ROSTER_BATCH_SIZE;
  state.shipSort='rarity';state.shipDescending=true;state.shipRarity='all';state.shipAdvancedOpen=false;state.gearSort='rarity';state.gearDescending=true;state.gearRarity='all';state.gearBroadType='all';state.gearGroup='type';state.gearAdvancedOpen=false;
  state.picker = null;
  state.detail = null;
  state.artViewerOpen=false;state.profileGearId=null;state.profileLoadoutPicker=null;
  const hash = `#/${page}`;
  if (location.hash !== hash) history.replaceState(null, '', hash);
  render();
  if (page === 'updates') void loadChangelog();
  window.scrollTo({ top: 0, behavior: 'instant' });
}
function selectedMode() { return MODES.find(mode => mode.id === state.modeId); }
function currentPlan() { return state.workspaces[state.modeId]; }
function countSlots(plan) { return Object.values(plan.fleets).reduce((sum, slots) => sum + Object.keys(slots).length, 0); }
function tag(label) { return `<span class="chip">${E(label)}</span>`; }
function link(url, label, cls = 'text-link') { return `<a href="${E(url)}" target="_blank" rel="noopener noreferrer" class="${cls}">${E(label)} ↗</a>`; }
function eyebrow(text) { return `<div class="eyebrow">${E(text)}</div>`; }
function sectionHeading(title, kicker, sub) {
  return `<div class="page-heading">${eyebrow(kicker)}<h1>${E(title)}</h1><p>${E(sub)}</p></div>`;
}
function nav() {
  $('#side-nav').innerHTML = pages.map(p => `<button type="button" class="nav-item ${p.id === state.page ? 'active' : ''}" data-action="navigate" data-page="${p.id}" ${p.id === state.page ? 'aria-current="page"' : ''}><span class="nav-icon">${p.icon}</span>${p.label}</button>`).join('');
  $('#page-name').textContent = pages.find(p => p.id === state.page)?.label || 'Overview';
}
function warning() {
  const status = state.sync.status;
  // Do not interrupt ordinary browsing with successful source/asset notices.
  if (status !== 'partial' && status !== 'failed') return '';
  const summary = status === 'partial'
    ? 'Some catalog data is unavailable. Available records can still be browsed.'
    : 'Live catalog data is unavailable. Showing locally available records.';
  return `<div class="info-banner source-availability-warning" role="status"><span class="info-dot">!</span><div><strong>Limited catalog data.</strong> ${E(summary)} <button class="inline-action" data-action="sync-data">Retry</button></div></div>`;
}
function sourceDisclosure() {
  const status = state.sync.status;
  const descriptions = {
    ready: 'Live community indexes loaded.',
    partial: 'Some live records are unavailable; local fallback and reachable sources remain usable.',
    failed: 'Live sources are unavailable; showing the local fallback catalog.',
    loading: 'Live data is loading; local fallback remains available.'
  };
  const checked = state.sync.shipVersion
    ? `<p>Ship snapshot: ${E(new Date(state.sync.shipVersion).toLocaleDateString())}.</p>` : '';
  return `<section class="source-technical"><h2>Data coverage and limitations</h2>
    <p>${E(descriptions[status] || descriptions.loading)} Current source response: ${state.sync.ships.toLocaleString()} ship entries, ${state.sync.equipment.toLocaleString()} equipment entries.</p>
    ${checked}
    <p>Original game-client artwork is linked from independent fan repositories, not hosted by Yostar or Manjuu. Last image audit: ${assetCoverage.availableShipThumbnails}/${assetCoverage.indexedShipsAtAudit} ship thumbnails and ${assetCoverage.availableEquipmentIcons} equipment icons. Some images may be unavailable.</p>
    <p>Nation icons and other game artwork are owned by their respective rights holders. Browse and equipment compatibility data are third-party records, not publisher endorsements or verified combat results. Equipment hull filters show potential class eligibility, not individual ship or slot legality. Combat rankings are provisional scenario-specific research. Fleet suggestions use curated role matches rather than a complete numerical skill/gear simulator; exact ship-specific loadouts and damage calculations remain unfinished.</p>
    <div class="source-disclosure-links">
      ${link('https://github.com/Avalon1230/avalon-azurlane/blob/main/docs/IMAGE_ASSETS.md','Artwork credits & rights')}
      ${link('https://github.com/Avalon1230/avalon-azurlane/blob/main/docs/CATALOG_FILTERS.md','Catalog coverage & compatibility')}
      ${link('https://github.com/Avalon1230/avalon-azurlane/blob/main/docs/DATA_SOURCES.md','Data source methodology')}
    </div></section>`;
}
function contextPanel() {
  const mode=selectedMode();
  return `<section class="context-panel">${eyebrow('EVALUATION FRAMEWORK')}<h3>${E(mode.name)} decision criteria</h3><p>These factors define what a future mode-specific assessment must measure. No score is assigned until game data and tests support one.</p><div class="tag-row">${contextCriteria(mode.id).map(tag).join('')}</div></section>`;
}

function renderOverview() {
  return `<div class="hero">
    <div class="hero-copy">${eyebrow('YOUR FLEET. YOUR DECISION.')}<h1>Intelligence<br><em>above instinct.</em></h1><p>A research-first Azur Lane workbench. Explore the entire game, organize your fleets, and trace decisions back to evidence.</p>
      <div class="hero-actions"><button class="primary-btn" data-action="navigate" data-page="fleet">Open Fleet Lab <span>↗</span></button><button class="outline-btn" data-action="navigate" data-page="modes">Explore Game Modes</button><button class="outline-btn" data-action="navigate" data-page="tiers">Tier Boards ♛</button></div>
    </div>
    <div class="hero-art" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="radar-center"><div class="compass-rose">✦</div><span>AVALON</span><small>TACTICAL INTELLIGENCE</small></div><span class="coord coord-a">N 35° 42′</span><span class="coord coord-b">TACTICAL SYSTEM // 001</span></div>
  </div>
  <div class="metric-grid">
    <div class="metric">${eyebrow('OPERATIONAL AREAS')}<strong>${MODES.length.toString().padStart(2,'0')}</strong><small>Mode-aware architecture</small></div>
    <div class="metric">${eyebrow('SHIP ROSTER')}<strong>${SHIPS.length.toLocaleString()}</strong><small>Indexed ships</small></div>
    <div class="metric">${eyebrow('EQUIPMENT')}<strong>${EQUIPMENT.length.toLocaleString()}</strong><small>Indexed equipment</small></div>
    <div class="metric accent">${eyebrow('YOUR ACTIVE PLAN')}<strong>${countAssigned(currentPlan()).toString().padStart(2,'0')}</strong><small>${E(selectedMode().name)} ships assigned</small></div>
  </div>
  <div class="section-title"><div>${eyebrow('START A MISSION')}<h2>Choose your theater</h2></div><button class="ghost-btn" data-action="navigate" data-page="modes">View all eight →</button></div>
  <div class="mode-grid">${MODES.slice(0,4).map(modeCard).join('')}</div>
  <div class="bottom-grid">
    <div class="feature-card"><div class="feature-icon">▦</div>${eyebrow('FLEET LAB')}<h3>Plan without guessing.</h3><p>Build separate formations for each game mode, check hull eligibility, and export a reproducible plan. Saved locally in your browser.</p><button class="ghost-btn" data-action="navigate" data-page="fleet">Build a fleet →</button></div>
    <div class="feature-card"><div class="feature-icon">◎</div>${eyebrow('EVIDENCE STANDARD')}<h3>Explore the research.</h3><p>Review data sources and the evidence behind AVALON's recommendations.</p><button class="ghost-btn" data-action="navigate" data-page="sources">Review sources →</button></div>
  </div>`;
}
function modeCard(mode) {
  return `<button class="mode-card" type="button" data-action="open-mode" data-mode="${mode.id}">
    <div class="mode-top"><span class="mode-icon">${mode.icon}</span><span class="mini-arrow">↗</span></div>
    ${eyebrow(mode.eyebrow)}<h3>${E(mode.name)}</h3><p>${E(mode.summary)}</p>
    <div class="mode-tags">${mode.metrics.map(tag).join('')}</div>
  </button>`;
}
function renderModes() {
  return `${sectionHeading('Every theater. One command center.', 'MODE REGISTRY / 08', 'Every mode has different mechanics and fleet constraints. Build and evaluate them separately.')}
  <div class="mode-grid all-modes">${MODES.map(modeCard).join('')}</div>`;
}
function searchBar(placeholder, extra = '') {
  return `<div class="filter-bar"><label class="search-wrap"><span aria-hidden="true">⌕</span><input id="catalog-search" type="search" value="${E(state.query)}" placeholder="${E(placeholder)}" autocomplete="off" aria-label="Search catalog" /></label>${extra}</div>`;
}
function renderShips() {
  return `${sectionHeading('Ship Index', 'SHIP REGISTRY', 'Browse ships by faction, or search the entire roster.')}${warning()}
  ${renderCatalogIndex({kind:'ships',records:SHIPS,query:state.query,nation:state.shipNation,hull:state.hull,shipLimit:state.shipVisibleCount,renderCard:renderShipRosterTile,sourceStatus:state.sync.status,sort:state.shipSort,descending:state.shipDescending,rarity:state.shipRarity,shipAdvancedOpen:state.shipAdvancedOpen})}`;
}
function renderEquipment() {
  return `${sectionHeading('Equipment', 'EQUIPMENT INDEX', 'Browse equipment by origin, type, or compatible hull.')}${warning()}
  ${renderCatalogIndex({kind:'equipment',records:EQUIPMENT,query:state.query,nation:state.gearNation,hull:state.gearHull,category:state.category,equipmentLimit:state.gearVisibleCount,rarity:state.gearRarity,sort:state.gearSort,descending:state.gearDescending,broadType:state.gearBroadType,equipmentGroup:state.gearGroup,equipmentAdvancedOpen:state.gearAdvancedOpen,renderCard:renderEquipmentRosterTile,sourceStatus:state.sync.status})}`;
}
function evidenceLine(record) {
  if(record?.source === 'lycoris') return `<p><strong>Source:</strong> Lycoris-AzurAPI ship-list.json (independent community snapshot).</p>${link('https://github.com/iujab/Lycoris-AzurAPI/blob/main/data/ship-list.json','Inspect source data')}`;
  if(record?.source === 'fernando') return `<p><strong>Source:</strong> Fernando2603/AzurLane equipment.json (community game-data extraction).</p>${link('https://github.com/Fernando2603/AzurLane/blob/main/equipment.json','Inspect source data')}`;
  return `<p><strong>Source:</strong> Editorial placeholder (not validated).</p>${link('https://github.com/Avalon1230/avalon-azurlane/blob/main/docs/DATA_SOURCES.md','Source methodology')}`;
}
function refreshEquipmentDetail() {
  if(state.detail?.kind!=='equipment'&&!state.profileGearId)return;
  // A network response must not throw the reader back to the top while they
  // are scrolling through the large stats table.
  const previous=document.querySelector('.detail-panel .detail-scroll')?.scrollTop||0;
  render();
  const pane=document.querySelector('.detail-panel .detail-scroll');
  if(pane)pane.scrollTop=previous;
}
async function ensureEquipmentAcquisition() {
  if(state.equipmentAcquisition.status==='ready'||state.equipmentAcquisition.status==='loading')return;
  state.equipmentAcquisition={status:'loading',index:null,error:''};
  refreshEquipmentDetail();
  try {
    const index=await loadEquipmentDrops();
    state.equipmentAcquisition={status:'ready',index,error:''};
  }catch(err){
    state.equipmentAcquisition={status:'error',index:null,error:String(err?.message||'Source unavailable')};
  }
  refreshEquipmentDetail();
}
function renderDetails(gearId=null) {
  const d=gearId?{kind:'equipment',id:gearId}:state.detail;
  if(d?.kind==='equipment-family')
    return renderEquipmentFamilyDetails(equipmentFamilyMembers(EQUIPMENT,d.id));
  const item=d.kind==='ship'?SHIP_MAP.get(d.id):EQUIPMENT.find(x=>x.id===d.id);
  if (!item) return '';
  const ship=d.kind==='ship';
  const rows=ship?[
    ['Nation / browse group',shipBrowseDisplayNation(item)],['Hull',item.sourceHull||item.hull],['Hull code',item.hull],['Rarity',item.rarity||'Unverified'],['Role hints',(item.tags||[]).join(', ')||'Not yet evaluated'],['Record ID',item.sourceId||'Editorial']
  ]:[
    ['Nation of origin',nationForEquipment(item)],['Category',item.category],['Potentially equippable hulls',possibleEquipmentHulls(item).join(', ')||'Not verified'],['Rarity',item.rarity||'Unverified'],['Highest enhancement reported',item.enhancement||'Not loaded'],['Source ID',item.sourceId||'Editorial']
  ];
  const statRows=!ship?Object.entries(item.stats||{}).map(([k,v])=>[k.replaceAll('_',' ').toUpperCase(),String(v)]):[];
  return `<div class="picker-backdrop detail-backdrop" data-action="close-detail"><aside class="picker-panel detail-panel" role="dialog" aria-modal="true" aria-label="Inspect ${ship?'ship':'equipment'}"><div class="picker-head"><div>${eyebrow(ship?'SHIP INTELLIGENCE':'EQUIPMENT INTELLIGENCE')}<h2>${E(item.name)}</h2></div><button class="icon-btn" data-action="close-detail" aria-label="Close detail">✕</button></div>
  <div class="detail-scroll"><div class="profile-art">${imageMarkup(item,ship?'ship':'equipment','asset-profile')}</div>
  ${ship?'':renderEquipmentAcquisition(item,state.equipmentAcquisition)}
  <div class="profile-table">${[...rows,...statRows].map(([k,v])=>`<div><span>${E(k)}</span><strong>${E(v)}</strong></div>`).join('')}</div>
  <details class="method-disclosure"><summary>Research criteria</summary><section class="context-panel">${eyebrow('MODE-SPECIFIC RESEARCH')}<h3>${E(selectedMode().name)} · assessment pending</h3><p>Additional data needed to analyze performance in this game mode:</p><div class="tag-row">${contextCriteria(state.modeId).map(tag).join('')}</div></section></details>
  <section class="evidence-box"><h3>Evidence trail</h3>${evidenceLine(item)}<p>${link(wikiLookupUrl(item.name),'Search Azur Lane fan wiki')}</p></section></div>
  <div class="picker-footer"><button type="button" class="ghost-btn" data-action="close-detail">Close</button></div></aside></div>`;
}
function modeSelect() {
  return `<label class="mode-selector">THEATER <select id="mode-select">${MODES.map(mode => `<option value="${mode.id}" ${mode.id===state.modeId?'selected':''}>${E(mode.name)}</option>`).join('')}</select></label>`;
}
function renderFleet() {
  const mode = selectedMode(), plan = currentPlan();
  return `${sectionHeading('Fleet Lab', 'TACTICAL PLANNING', 'Build formations manually or generate a fleet suggestion.')}
  <div class="fleet-toolbar">${modeSelect()}<div class="fleet-controls"><span class="assignment-count">${countAssigned(plan)} / ${countSlots(plan)} assigned</span><button type="button" class="outline-btn compact" data-action="export-plan">Export JSON ↓</button><button type="button" class="ghost-btn danger" data-action="reset-plan">Clear plan</button></div></div>
  <div class="mode-description"><span class="mode-icon">${mode.icon}</span><div><strong>${E(mode.name)}</strong><p>${E(mode.summary)}</p></div></div>
  <details class="method-disclosure"><summary>View scenario criteria</summary>${contextPanel()}</details>${renderSuggestedFleet({mode,ships:SHIPS,workspace:plan,options:state.suggestOptions,preview:state.suggestPreview,sourceStatus:state.sync.status})}<div class="fleet-grid">${mode.fleetTypes.map(id => fleetCard(id, plan)).join('')}</div>
  ${state.picker ? renderPicker() : ''}`;
}
function fleetCard(id, plan) {
  const fleet = FLEET_BLUEPRINTS[id];
  const slots = slotsForFleet(id);
  const used = Object.values(plan.fleets[id]).filter(Boolean).length;
  return `<section class="fleet-card"><div class="fleet-card-head"><div>${eyebrow(fleet.type.toUpperCase() + ' FORMATION')}<h3>${E(fleet.name)}</h3><p>${E(fleet.detail)}</p></div><span class="fleet-count">${used}/${slots.length}</span></div><div class="slot-grid ${fleet.type === 'surface'?'surface-slots':''}">${slots.map(slot => {
    const assigned = SHIP_MAP.get(plan.fleets[id][slot.id]);
    return `<button type="button" class="fleet-slot ${assigned?'filled':''}" data-action="choose-slot" data-fleet="${id}" data-slot="${slot.id}"><small>${E(slot.label)}</small>${assigned?imageMarkup(assigned,'ship','asset-fleet'):''}<strong>${assigned?E(assigned.name):'+ Assign ship'}</strong><span>${assigned?E(assigned.hull):E(slot.kind)}</span></button>`;
  }).join('')}</div></section>`;
}
function renderPicker() {
  const {fleetId,slotId} = state.picker;
  const slot = slotsForFleet(fleetId).find(s => s.id === slotId);
  const assigned = currentPlan().fleets[fleetId][slotId];
  const assignedElsewhere = new Set(Object.values(currentPlan().fleets).flatMap(fleet => Object.values(fleet).filter(Boolean)));
  const filtered = searchCatalog(SHIPS, state.pickerQuery, ['name', 'hull','tags','rarity']).filter(ship => compatible(ship, slot.kind)).slice(0,100);
  return `<div class="picker-backdrop" data-action="close-picker"><aside class="picker-panel" role="dialog" aria-modal="true" aria-label="Choose ship"><div class="picker-head"><div>${eyebrow(FLEET_BLUEPRINTS[fleetId].name)}<h2>${E(slot.label)}</h2></div><button class="icon-btn" data-action="close-picker" aria-label="Close selection">✕</button></div>
  <label class="search-wrap"><span>⌕</span><input id="picker-search" type="search" placeholder="Find a compatible ship" value="${E(state.pickerQuery)}" aria-label="Search compatible ships" /></label>
  <div class="picker-list">${filtered.map(ship => {
    const taken = assignedElsewhere.has(ship.id) && ship.id !== assigned;
    return `<button type="button" class="picker-option" data-action="place-ship" data-ship="${ship.id}" ${taken?'disabled title="Already assigned"':''}>${imageMarkup(ship,'ship','asset-picker')}<span class="ship-badge small">${E(ship.hull)}</span><span class="picker-name">${E(ship.name)}<small>${E(ship.tags.join(' · '))}</small></span><span>${taken?'In use':ship.id === assigned?'Selected':'+'}</span></button>`;
  }).join('') || '<div class="empty">No compatible ships in the sample index.</div>'}</div>
  <div class="picker-footer"><button type="button" class="outline-btn compact" data-action="clear-slot" ${assigned?'':'disabled'}>Remove assignment</button><button type="button" class="ghost-btn" data-action="close-picker">Close</button></div></aside></div>`;
}
function renderSources() {
  return `${sectionHeading('Trust the trail, not the hype.', 'SOURCES & METHODOLOGY', 'Sources are explicit; the project does not convert popular opinions into verified performance figures.')}
  ${sourceDisclosure()}<details class="method-disclosure"><summary>Wiki connectivity notes</summary><div class="source-alert"><strong>⚠ Wiki crawler mismatch — live site not declared broken</strong><p>Our web retrieval results for Koumakan contained unrelated fragments of novels, even on several indexed wiki pages. The retrieved pages may be cached, poisoned, or crawler-specific; the cause is unconfirmed. The wiki works in normal browsers reported by users. Koumakan’s /w/api.php endpoint has returned valid page metadata and Musashi wikitext from GitHub Actions; automatic imports still await schema and reuse-permission review; see Sources documentation.</p></div></details>
  <div class="source-grid">${SOURCES.map(source => `<article class="source-card">${eyebrow(source.type)}<h3>${E(source.name)}</h3><p>${E(source.note)}</p>${link(source.url,'Open source')}</article>`).join('')}</div>
  <div class="method-card"><h2>Three different things. Never one misleading tier.</h2><div class="method-grid"><div><span class="method-num">01</span><h3>Game facts</h3><p>Observed or sourced mechanics with version, link, validation status, and licensing notes.</p></div><div><span class="method-num">02</span><h3>Community evidence</h3><p>Tests, guides and discussion with attribution, limitations, and scenario context.</p></div><div><span class="method-num">03</span><h3>AVALON analysis</h3><p>Independent calculations and judgment, labeled as inference with assumptions and uncertainty.</p></div></div><p class="doc-link">${link('https://github.com/Avalon1230/avalon-azurlane/blob/main/docs/SOURCES.md','Read the complete provenance policy')}</p></div>`;
}

async function loadChangelog() {
  if (state.changelogStatus !== 'idle') return;
  state.changelogStatus = 'loading';
  try {
    const response = await fetch('./CHANGELOG.md', { cache: 'no-store' });
    if (!response.ok) throw new Error('Changelog unavailable: HTTP ' + response.status);
    state.changelog = await response.text();
    state.changelogStatus = 'ready';
  } catch {
    state.changelogStatus = 'failed';
  }
  if (state.page === 'updates') render();
}

function renderUpdates() {
  const sourceLink = link('https://github.com/Avalon1230/avalon-azurlane/blob/main/CHANGELOG.md', 'View changelog on GitHub');
  const body = state.changelogStatus === 'ready'
    ? changelogToHtml(state.changelog)
    : state.changelogStatus === 'failed'
      ? '<div class="source-alert">Changelog could not be loaded from this deployment. Use the GitHub copy instead.</div>'
      : '<div class="info-banner"><span class="info-dot">i</span>Loading release history…</div>';
  return `${sectionHeading('Release history', 'AVALON / CHANGELOG', 'Track new features, fixes, source changes, and known limitations across releases.')}
  <div class="changelog-meta">${sourceLink}<span>Release history is maintained in CHANGELOG.md; this view reads that same file.</span></div>
  <div class="changelog-content">${body}</div>`;
}

const wikiArtCache=new Map();
const wikiFactsCache=new Map();
function loadWikiFactsForCurrentShip() {
  const sourceId=String(state.detail?.sourceId||'');
  const record=detailedShipRecord(state.shipDetails.data,sourceId);
  if(!record?.wikiUrl || wikiFactsCache.has(sourceId))return;
  wikiFactsCache.set(sourceId,null);
  void loadWikiShipFacts(record.wikiUrl,sourceId).then(facts=>{
    wikiFactsCache.set(sourceId,facts||null);
    if(facts && state.page==='ships' && state.detail?.sourceId===sourceId && !state.artViewerOpen)render();
  }).catch(()=>wikiFactsCache.set(sourceId,null));
}

function loadWikiArtForCurrentShip() {
  const sourceId=String(state.detail?.sourceId||'');
  const record=detailedShipRecord(state.shipDetails.data,sourceId);
  if(!record?.wikiUrl || wikiArtCache.has(sourceId))return;
  wikiArtCache.set(sourceId,null); // request in flight; do not repeat
  void loadWikiDefaultArtwork(record.wikiUrl).then(url=>{
    wikiArtCache.set(sourceId,url||null);
    if(url && state.page==='ships' && state.detail?.sourceId===sourceId &&
       !state.artViewerOpen)render();
  }).catch(()=>wikiArtCache.set(sourceId,null));
}
async function loadShipProfileData() {
  if(state.shipDetails.status==='loading')return;
  if(state.shipDetails.status==='ready'){
    loadWikiArtForCurrentShip();
    loadWikiFactsForCurrentShip();
    return;
  }
  state.shipDetails={status:'loading',data:null,artwork:null,error:''};
  render();
  const [ships,paintings]=await Promise.allSettled([loadDetailedShips(),loadArtworkCatalog()]);
  if(ships.status==='fulfilled'){
    state.shipDetails={
      status:'ready',
      data:ships.value,
      artwork:paintings.status==='fulfilled'?paintings.value:null,
      error:paintings.status==='rejected'?'Artwork manifest unavailable; ship data remains loaded.':''
    };
  }else{
    state.shipDetails={status:'failed',data:null,artwork:null,error:ships.reason?.message||'Unreachable'};
  }
  if(state.page==='ships' && state.detail?.kind==='ship'){
    render();
    if(ships.status==='fulfilled'){
      loadWikiArtForCurrentShip();
      loadWikiFactsForCurrentShip();
    }
  }
}

function openShipProfile(shipId) {
  const item = SHIP_MAP.get(shipId);
  if (!item) return;
  state.shipRosterScrollY=window.scrollY;
  state.page='ships';
  state.detail={kind:'ship',id:item.id,sourceId:String(item.sourceId||'')};
  state.profileSkin=0;state.profileLevel='level120';state.artViewerOpen=false;
  state.profileLoadoutMode='general';state.profileGearId=null;state.profileLoadoutPicker=null;
  if (state.detail.sourceId) history.pushState(null,'','#/ships/'+encodeURIComponent(state.detail.sourceId));
  render();
  window.scrollTo({top:0,behavior:'instant'});
  void loadShipProfileData();
}
function closeShipProfile() {
  state.artViewerOpen=false;state.profileGearId=null;state.profileLoadoutPicker=null;
  state.detail=null;
  history.pushState(null,'','#/ships');
  render();
  window.scrollTo({top:state.shipRosterScrollY,behavior:'instant'});
}
let shipScrollObserver=null;
function loadMoreShips() {
  if(state.page!=='ships'||state.detail||!document.querySelector('[data-ship-scroll-sentinel]'))return;
  state.shipVisibleCount+=SHIP_ROSTER_BATCH_SIZE;
  render();
}
function observeShipRosterScroll() {
  shipScrollObserver?.disconnect();
  shipScrollObserver=null;
  if(state.page!=='ships'||state.detail||typeof IntersectionObserver==='undefined')return;
  const sentinel=document.querySelector('[data-ship-scroll-sentinel]');
  if(!sentinel)return;
  shipScrollObserver=new IntersectionObserver(entries=>{
    if(!entries.some(entry=>entry.isIntersecting))return;
    shipScrollObserver?.disconnect();
    shipScrollObserver=null;
    loadMoreShips();
  },{rootMargin:'400px 0px'});
  shipScrollObserver.observe(sentinel);
}
let equipmentScrollObserver=null;
function loadMoreEquipment() {
  if(state.page!=='equipment'||state.detail||!document.querySelector('[data-equipment-scroll-sentinel]'))return;
  state.gearVisibleCount+=EQUIPMENT_ROSTER_BATCH_SIZE;
  render();
}
function observeEquipmentRosterScroll() {
  equipmentScrollObserver?.disconnect();
  equipmentScrollObserver=null;
  if(state.page!=='equipment'||state.detail||typeof IntersectionObserver==='undefined')return;
  const sentinel=document.querySelector('[data-equipment-scroll-sentinel]');
  if(!sentinel)return;
  equipmentScrollObserver=new IntersectionObserver(entries=>{
    if(!entries.some(entry=>entry.isIntersecting))return;
    equipmentScrollObserver?.disconnect();
    equipmentScrollObserver=null;
    loadMoreEquipment();
  },{rootMargin:'400px 0px'});
  equipmentScrollObserver.observe(sentinel);
}
function resetEquipmentBatch() {
  state.gearVisibleCount=EQUIPMENT_ROSTER_BATCH_SIZE;
}
function render() {
  nav();
  document.body.classList.toggle('ship-art-viewing', state.artViewerOpen && state.page==='ships' && state.detail?.kind==='ship');
  const views = { overview:renderOverview, modes:renderModes, ships:renderShips, equipment:renderEquipment, fleet:renderFleet, sources:renderSources, updates:renderUpdates,
    tiers: () => renderTierView({ boardId: state.tierBoard, boards: state.tierBoards, ships: SHIPS, equipment: EQUIPMENT, query: state.tierQuery, filter: state.tierFilter, sourceStatus: state.sync.status }) };
  if (state.page === 'ships' && state.detail?.kind === 'ship') {
    const ship=SHIP_MAP.get(state.detail.id) || SHIPS.find(x=>String(x.sourceId||'')===state.detail.sourceId);
    const data=detailedShipRecord(state.shipDetails.data,state.detail.sourceId || ship?.sourceId);
    const recordId=String(state.detail.sourceId || ship?.sourceId || '');
    const wikiPainting=wikiArtCache.get(recordId);
    const artworkSkins=artworkSkinsForShip(state.shipDetails.artwork,recordId)
      .map((skin,index)=>index===0 && wikiPainting
        ? {...skin,images:{...skin.images,wiki:wikiPainting}}:skin);
    const loadoutModel=data?currentShipLoadoutModel(ship,data,recordId):null;
    $('#app-content').innerHTML=renderShipProfile({
      ship, data, status:state.shipDetails.status, error:state.shipDetails.error,
      level:state.profileLevel,skinIndex:state.profileSkin,viewerOpen:state.artViewerOpen,artworkSkins,
      wikiFacts:wikiFactsCache.get(recordId)||null,loadoutModel
    })+(state.profileGearId?renderDetails(state.profileGearId):'')+
      (loadoutModel&&state.profileLoadoutPicker!==null
        ?renderLoadoutAlternatives(loadoutModel,state.profileLoadoutPicker):'');
  } else {
    $('#app-content').innerHTML = views[state.page]() + (state.detail ? renderDetails() : '');
  }
  document.title = `${state.detail?.kind==='ship' ? (detailedShipRecord(state.shipDetails.data,state.detail.sourceId)?.names?.en || SHIP_MAP.get(state.detail.id)?.name || 'Ship Profile') : pages.find(p=>p.id===state.page)?.label} · AVALON Azur Lane Intelligence`;
  observeShipRosterScroll();
  observeEquipmentRosterScroll();
}
function handleAction(target) {
  const {action,page,mode,ship,equip,fleet,slot,board} = target.dataset;
  if (action === 'suggest-toggle-pool') { state.suggestOptions.poolOpen=!state.suggestOptions.poolOpen;render();return; }
  if (action === 'suggest-all-owned' || action === 'suggest-none-owned') {
    state.suggestOptions.ownedIds=action==='suggest-all-owned'?SHIPS.filter(s=>curatedProfile(s)).map(s=>s.id):[];
    state.suggestPreview=null;saveSuggestOptions();render();return;
  }
  if (action === 'suggest-generate') {
    const options=state.suggestOptions;
    const valid=SCENARIOS[state.modeId]||[];
    const scenario=valid.some(x=>x.id===options.scenario)?options.scenario:valid[0]?.id;
    try {
      const suggestion=suggestFleet({modeId:state.modeId,scenario,ships:SHIPS,workspace:currentPlan(),ownedOnly:options.ownedOnly,ownedIds:options.ownedIds});
      state.suggestPreview={...suggestion,baseSignature:JSON.stringify(currentPlan())};
      render();notify('Suggested formations are ready for review.');
    } catch(error) {notify('Suggestion unavailable: '+error.message);}
    return;
  }
  if (action === 'suggest-apply') {
    const preview=state.suggestPreview;
    if(!preview||preview.modeId!==state.modeId||JSON.stringify(currentPlan())!==preview.baseSignature)
      return notify('Suggestion is stale. Generate it again.');
    state.workspaces[state.modeId]=normalizeWorkspace(preview.plan,state.modeId);
    state.suggestPreview=null;savePlans();render();notify('Suggested additions applied.');return;
  }
  if (action === 'ship-toggle-filters') {
    state.shipAdvancedOpen=!state.shipAdvancedOpen;render();
    document.querySelector('[data-action="ship-toggle-filters"]')?.focus();return;
  }
  if (action === 'ship-reset-filters') {
    state.hull='all';state.shipRarity='all';state.shipVisibleCount=SHIP_ROSTER_BATCH_SIZE;
    render();return;
  }
  if (action === 'ship-clear-filter') {
    if(target.dataset.field==='hull')state.hull='all';
    else if(target.dataset.field==='rarity')state.shipRarity='all';
    else return;
    state.shipVisibleCount=SHIP_ROSTER_BATCH_SIZE;render();return;
  }
  if (action === 'ship-rarity-filter') {
    state.shipRarity=target.dataset.rarity||'all';state.shipVisibleCount=SHIP_ROSTER_BATCH_SIZE;render();document.getElementById('catalog-start')?.scrollIntoView({block:'start'});return;
  }
  if (action === 'ship-hull-filter') {
    state.hull=target.dataset.hull||'all';state.shipVisibleCount=SHIP_ROSTER_BATCH_SIZE;
    render();document.getElementById('catalog-start')?.scrollIntoView({block:'start'});return;
  }
  if (action === 'ship-sort') {
    const sort=target.dataset.sort;
    if (!['name','rarity','hull'].includes(sort)) return;
    if(sort===state.shipSort) state.shipDescending=!state.shipDescending;
    else {state.shipSort=sort;state.shipDescending=sort==='rarity';}
    state.shipVisibleCount=SHIP_ROSTER_BATCH_SIZE;render();document.getElementById('catalog-start')?.scrollIntoView({block:'start'});return;
  }
  if (action === 'ship-sort-direction') {
    state.shipDescending=!state.shipDescending;state.shipVisibleCount=SHIP_ROSTER_BATCH_SIZE;render();document.getElementById('catalog-start')?.scrollIntoView({block:'start'});return;
  }
  if (action === 'ship-load-more') {loadMoreShips();return;}

  if (action === 'equipment-broad-type') {
    const broad=target.dataset.broad;
    if(!EQUIPMENT_BROAD_TYPES.some(x=>x.id===broad))return;
    state.gearBroadType=broad;state.category='all';resetEquipmentBatch();render();
    document.getElementById('catalog-start')?.scrollIntoView({block:'start'});return;
  }
  if (action === 'equipment-toggle-filters') {
    state.gearAdvancedOpen=!state.gearAdvancedOpen;render();
    document.querySelector('[data-action="equipment-toggle-filters"]')?.focus();
    return;
  }
  if (action === 'equipment-reset-filters') {
    state.gearNation='all';state.gearHull='all';state.gearRarity='all';
    state.category='all';state.gearBroadType='all';resetEquipmentBatch();render();return;
  }
  if (action === 'equipment-clear-filter') {
    const field=target.dataset.field;
    if(field==='nation')state.gearNation='all';
    else if(field==='hull')state.gearHull='all';
    else if(field==='rarity')state.gearRarity='all';
    else if(field==='category')state.category='all';
    else return;
    resetEquipmentBatch();render();return;
  }
  if (action === 'equipment-family-open') {
    const id=target.dataset.familyId;
    if(!id||equipmentFamilyMembers(EQUIPMENT,id).length<2)return;
    state.detail={kind:'equipment-family',id};render();
    document.querySelector('.detail-panel .icon-btn')?.focus();return;
  }
  if (action === 'equipment-type-filter') {
    state.category=target.dataset.category||'all';resetEquipmentBatch();render();
    document.getElementById('catalog-start')?.scrollIntoView({block:'start'});return;
  }
  if (action === 'equipment-hull-filter') {
    state.gearHull=target.dataset.hull||'all';resetEquipmentBatch();render();
    document.getElementById('catalog-start')?.scrollIntoView({block:'start'});return;
  }
  if (action === 'equipment-rarity-filter') {
    state.gearRarity=target.dataset.rarity||'all';resetEquipmentBatch();render();
    document.getElementById('catalog-start')?.scrollIntoView({block:'start'});return;
  }
  if (action === 'equipment-sort') {
    const selected=target.dataset.sort;
    if(!['rarity','name','type'].includes(selected))return;
    if(selected===state.gearSort)state.gearDescending=!state.gearDescending;
    else {state.gearSort=selected;state.gearDescending=selected==='rarity';}
    resetEquipmentBatch();render();
    document.getElementById('catalog-start')?.scrollIntoView({block:'start'});return;
  }
  if (action === 'equipment-sort-direction') {
    state.gearDescending=!state.gearDescending;resetEquipmentBatch();render();
    document.getElementById('catalog-start')?.scrollIntoView({block:'start'});return;
  }
  if (action === 'equipment-load-more') {loadMoreEquipment();return;}
  if (action === 'equipment-acquisition-retry') {
    state.equipmentAcquisition={status:'idle',index:null,error:''};
    void ensureEquipmentAcquisition();return;
  }
  if (action === 'loadout-mode') {
    const next=target.dataset.mode;
    if(!LOADOUT_MODES.some(x=>x.id===next)||state.detail?.kind!=='ship')return;
    state.profileLoadoutMode=next;state.profileGearId=null;state.profileLoadoutPicker=null;
    render();return;
  }
  if (action === 'loadout-reset') {
    const key=String(state.detail?.sourceId||'');
    if(!/^\d{2,8}$/.test(key))return;
    if(state.savedLoadouts[key])delete state.savedLoadouts[key][state.profileLoadoutMode];
    saveLoadoutPicks();render();notify('Personal picks reset for this ship and mode.');return;
  }
  if (action === 'loadout-alternatives') {
    const index=Number(target.dataset.slot);
    const ship=SHIP_MAP.get(state.detail?.id);
    const data=detailedShipRecord(state.shipDetails.data,state.detail?.sourceId);
    const model=currentShipLoadoutModel(ship,data,state.detail?.sourceId);
    if(!Number.isSafeInteger(index)||model.slots.find(x=>x.index===index)?.candidates.length<2)return;
    state.profileLoadoutPicker=index;state.profileGearId=null;render();
    document.querySelector('.loadout-picker-panel .icon-btn')?.focus();return;
  }
  if (action === 'loadout-close-alternatives') {
    state.profileLoadoutPicker=null;render();return;
  }
  if (action === 'loadout-select') {
    const index=Number(target.dataset.slot),equipId=target.dataset.equip;
    const ship=SHIP_MAP.get(state.detail?.id);
    const data=detailedShipRecord(state.shipDetails.data,state.detail?.sourceId);
    const model=currentShipLoadoutModel(ship,data,state.detail?.sourceId);
    if(!validateManualChoice(model,index,equipId))return notify('This equipment is not source-matched to that slot.');
    const key=String(state.detail.sourceId);
    if(!/^\d{2,8}$/.test(key))return;
    if(!state.savedLoadouts[key]||typeof state.savedLoadouts[key]!=='object')state.savedLoadouts[key]={};
    if(!state.savedLoadouts[key][state.profileLoadoutMode]||typeof state.savedLoadouts[key][state.profileLoadoutMode]!=='object')
      state.savedLoadouts[key][state.profileLoadoutMode]={};
    state.savedLoadouts[key][state.profileLoadoutMode][String(index)]=equipId;
    saveLoadoutPicks();
    state.profileLoadoutPicker=null;render();notify('Equipment selection saved for this ship and mode.');return;
  }
  if (action === 'loadout-inspect') {
    const equipId=target.dataset.equip;
    const ship=SHIP_MAP.get(state.detail?.id);
    const data=detailedShipRecord(state.shipDetails.data,state.detail?.sourceId);
    const model=currentShipLoadoutModel(ship,data,state.detail?.sourceId);
    if(!model.slots.some(slot=>slot.candidates.some(item=>item.id===equipId)))return;
    state.profileGearId=equipId;state.profileLoadoutPicker=null;render();
    void ensureEquipmentAcquisition();
    document.querySelector('.detail-panel .icon-btn')?.focus();return;
  }
  if (action === 'profile-art-open') {
    state.artViewerOpen=true;render();
    document.querySelector('.ship-art-viewer-actions [data-action="profile-art-close"]')?.focus();
    return;
  }
  if (action === 'profile-art-close') {
    state.artViewerOpen=false;
    if(document.fullscreenElement) void document.exitFullscreen().catch(()=>{});
    render();document.querySelector('.ship-art-preview')?.focus();return;
  }
  if (action === 'profile-art-fullscreen') {
    const element=document.getElementById('ship-art-lightbox');
    if(document.fullscreenElement) {
      void document.exitFullscreen().catch(()=>notify('Unable to exit fullscreen.'));
      return;
    }
    if(!element?.requestFullscreen) return notify('Fullscreen is not available in this browser.');
    void element.requestFullscreen().catch(()=>notify('Fullscreen is not available in this browser.'));
    return;
  }
  if (action === 'profile-back') { closeShipProfile();return; }
  if (action === 'profile-level') {state.profileLevel=target.dataset.level||'level120';render();return;}
  if (action === 'profile-skin') {
    const next=Number(target.dataset.index);
    if (!Number.isSafeInteger(next) || next<0 || next>100) return;
    state.profileSkin=next;state.artViewerOpen=false;render();return;
  }
  if (action === 'profile-jump') {
    document.getElementById(target.dataset.section)?.scrollIntoView({block:'start',behavior:'smooth'});return;
  }
  if (action === 'profile-retry') { state.shipDetails={status:'idle',data:null,error:''};void loadShipProfileData();return; }
  if (action === 'catalog-home') {
    state.shipNation='all';state.hull='all';state.query='';state.shipRarity='all';state.shipVisibleCount=SHIP_ROSTER_BATCH_SIZE;state.shipAdvancedOpen=false;
    render();document.querySelector('#catalog-start')?.scrollIntoView({block:'start'});return;
  }
  if (action === 'catalog-nation') {
    const kind=target.dataset.kind, nation=target.dataset.nation||'all';
    if (kind==='ships') {state.shipNation=nation;state.shipVisibleCount=SHIP_ROSTER_BATCH_SIZE;}
    else if (kind==='equipment') {state.gearNation=nation;resetEquipmentBatch();}
    else return;
    render();if(kind==='ships')document.getElementById('catalog-start')?.scrollIntoView({block:'start'});return;
  }
  if (action === 'tier-board') {
    if (!TIER_BOARDS[board]) return;
    state.tierBoard=board;state.tierQuery='';state.tierFilter='all';render();return;
  }
  if (action === 'tier-export') { exportTierBoard();return; }
  if (action === 'tier-clear') {
    if (TIER_BOARDS[state.tierBoard].readOnly) return notify('Published combat assessments cannot be cleared.');
    if (!window.confirm('Clear your personal ' + TIER_BOARDS[state.tierBoard].title + ' board? Other boards and Fleet Lab are unaffected.')) return;
    state.tierBoards[state.tierBoard]={};saveTierBoards();render();notify('Tier board cleared.');return;
  }
  if (action === 'sync-data') { void syncData(); return; }
  if (action === 'ship-details') { openShipProfile(ship);return; }
  if (action === 'equip-details') { state.detail={kind:'equipment',id:equip};render();void ensureEquipmentAcquisition();return; }
  if (action === 'close-detail') {
    if(state.profileGearId){state.profileGearId=null;render();return;}
    state.detail=null;return render();
  }
  if (action === 'navigate') return go(page);
  if (action === 'open-mode') { state.modeId = mode; return go('fleet'); }
  if (action === 'add-ship') { state.suggestPreview=null;
    const item = SHIP_MAP.get(ship), location = findFirstVacancy(currentPlan(), item);
    if (!location) return notify('No compatible free slot, or ship already assigned. Open Fleet Lab to adjust.');
    state.workspaces[state.modeId] = assignShip(currentPlan(), location.fleetId, location.slotId, item.id);
    savePlans(); notify(`${item.name} assigned in ${selectedMode().name}.`); return render();
  }
  if (action === 'choose-slot') { state.picker = {fleetId:fleet,slotId:slot}; state.pickerQuery=''; return render(); }
  if (action === 'close-picker') { state.picker=null; return render(); }
  if (action === 'place-ship' || action === 'clear-slot') {
    state.suggestPreview=null;
    const {fleetId,slotId} = state.picker;
    try {
      state.workspaces[state.modeId] = assignShip(currentPlan(),fleetId,slotId,action==='place-ship'?ship:null);
      state.picker=null; state.pickerQuery=''; savePlans(); render();
    } catch(err) { notify(err.message); }
    return;
  }
  if (action === 'reset-plan') { state.suggestPreview=null;
    if (!window.confirm(`Clear all ${selectedMode().name} assignments? This only affects this browser.`)) return;
    state.workspaces[state.modeId]=createWorkspace(state.modeId);
    if(state.pendingPlans) state.pendingPlans[state.modeId]=createWorkspace(state.modeId);
    savePlans();render();notify('Plan cleared.');return;
  }
  if (action === 'export-plan') {
    const content = JSON.stringify({ app:'avalon-azurlane',format:1,mode:state.modeId,exportedAt:new Date().toISOString(),plan:currentPlan() },null,2);
    const blob = new Blob([content],{type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url;a.download=`avalon-${state.modeId}-fleet.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);
    notify('Fleet plan exported as JSON.');
  }
}

document.addEventListener('error', event => {
  const img=event.target;
  if(img?.matches?.('img.ship-art-preview-image, img.ship-art-viewer-image')) {
    const fallback=img.dataset.fallbackSrc || img.dataset.lastResortSrc;
    if(fallback){
      if(img.dataset.fallbackSrc)delete img.dataset.fallbackSrc;
      else delete img.dataset.lastResortSrc;
      img.src=fallback;return;
    }
    img.remove();return;
  }
  if(img?.matches?.('img.asset-img')) {
    // A known original game-client portrait may be available even when the
    // first community thumbnail goes missing. Retry that exact ID once.
    const backup=img.dataset.fallbackSrc;
    if(backup){
      delete img.dataset.fallbackSrc;
      if(img.src!==backup){img.src=backup;return;}
    }
    img.remove();return;
  }
  if(img?.matches?.('img.ship-profile-painting')) img.remove();
}, true);
document.addEventListener('click', event => {
  const target = event.target.closest('[data-action]');
  if (!target || target.disabled) return;
  // A click within the picker should not close it unless it hits the backdrop itself.
  if (['close-picker','close-detail'].includes(target.dataset.action) && target.classList.contains('picker-backdrop') && event.target!==target) return;
  if(target.dataset.action==='profile-art-close' && target.classList.contains('ship-art-overlay') && event.target!==target) return;
  handleAction(target);
});
document.addEventListener('change', event => {
  const id=event.target.id, value=event.target.value;
  if(id==='ship-sort-select') {
    if(!['rarity','name','hull'].includes(value))return;
    state.shipSort=value;state.shipDescending=value==='rarity';
    state.shipVisibleCount=SHIP_ROSTER_BATCH_SIZE;render();return;
  }
  if(id==='ship-hull-select') {
    state.hull=value||'all';state.shipVisibleCount=SHIP_ROSTER_BATCH_SIZE;render();return;
  }
  if(id==='ship-rarity-select') {
    state.shipRarity=value||'all';state.shipVisibleCount=SHIP_ROSTER_BATCH_SIZE;render();return;
  }
  if(id==='equipment-sort-select') {
    if(!['rarity','name','type'].includes(value))return;
    state.gearSort=value;state.gearDescending=value==='rarity';resetEquipmentBatch();render();return;
  }
  if(id==='equipment-group-select') {
    if(!EQUIPMENT_GROUP_MODES.some(x=>x.value===value))return;
    state.gearGroup=value;resetEquipmentBatch();render();return;
  }
  if(id==='equipment-nation-select') {
    state.gearNation=value||'all';resetEquipmentBatch();render();return;
  }
  if(id==='equipment-hull-select') {
    state.gearHull=value||'all';resetEquipmentBatch();render();return;
  }
  if(id==='equipment-rarity-select') {
    state.gearRarity=value||'all';resetEquipmentBatch();render();return;
  }
  if(id==='equipment-subtype-select') {
    state.category=value||'all';resetEquipmentBatch();render();return;
  }
  if(event.target.id==='suggest-scenario') { state.suggestOptions.scenario=event.target.value;state.suggestPreview=null;saveSuggestOptions();render();return; }
  if(event.target.id==='suggest-owned-only') { state.suggestOptions.ownedOnly=event.target.checked;state.suggestPreview=null;saveSuggestOptions();render();return; }
  if(event.target.matches('[data-suggest-owned]')) {
    const id=event.target.dataset.suggestOwned;
    const set=new Set(state.suggestOptions.ownedIds);
    if(event.target.checked)set.add(id); else set.delete(id);
    state.suggestOptions.ownedIds=[...set];state.suggestPreview=null;saveSuggestOptions();
    return;
  }
  if (event.target.id === 'tier-filter') { state.tierFilter=event.target.value;render();return; }
  if (event.target.matches('[data-tier-assign]')) {
    if (TIER_BOARDS[state.tierBoard].readOnly) return;
    movePersonalTier(event.target.dataset.tierAssign,event.target.value);return;
  }
  if (event.target.id === 'mode-select') { state.modeId=event.target.value;state.picker=null;state.suggestOptions.scenario='';state.suggestPreview=null;render(); }
  if (event.target.id === 'hull-filter') { state.hull=event.target.value;state.shipVisibleCount=SHIP_ROSTER_BATCH_SIZE;render(); }
});
document.addEventListener('input', event => {
  const id = event.target.id;
  if (id!=='catalog-search' && id!=='picker-search' && id!=='tier-search') return;
  const value = event.target.value;
  const pos = event.target.selectionStart;
  if (id==='catalog-search') {state.query=value;if(state.page==='ships')state.shipVisibleCount=SHIP_ROSTER_BATCH_SIZE;else if(state.page==='equipment')resetEquipmentBatch();}
  else if (id==='picker-search') state.pickerQuery=value;
  else state.tierQuery=value;
  render();
  const restored = $('#'+id);
  restored?.focus();
  try { restored?.setSelectionRange(pos,pos); } catch { /* unsupported input selection */ }
});
document.addEventListener('dragstart', event => {
  if (state.page !== 'tiers' || TIER_BOARDS[state.tierBoard].readOnly) return;
  const item = event.target.closest('[data-tier-item]');
  if (!item || !event.dataTransfer) return;
  state.activeDragItem = item.dataset.tierItem;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', state.activeDragItem);
  item.classList.add('tier-dragging');
});
document.addEventListener('dragover', event => {
  if (state.page !== 'tiers' || TIER_BOARDS[state.tierBoard].readOnly || !state.activeDragItem) return;
  const target = event.target.closest('[data-tier-drop]');
  if (!target) return;
  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
});
document.addEventListener('drop', event => {
  if (state.page !== 'tiers' || TIER_BOARDS[state.tierBoard].readOnly || !state.activeDragItem) return;
  const target = event.target.closest('[data-tier-drop]');
  if (!target) return;
  event.preventDefault();
  const id=state.activeDragItem;
  state.activeDragItem=null;
  movePersonalTier(id,target.dataset.tierDrop);
});
document.addEventListener('dragend', () => {
  state.activeDragItem=null;
  document.querySelectorAll('.tier-dragging').forEach(item => item.classList.remove('tier-dragging'));
});
document.addEventListener('fullscreenchange', () => {
  const btn=document.querySelector('[data-action="profile-art-fullscreen"]');
  if(btn) btn.textContent=document.fullscreenElement?'⛶ Exit fullscreen':'⛶ Fullscreen';
});
document.addEventListener('keydown', event => {
  if (event.key==='Escape' && state.artViewerOpen) {
    state.artViewerOpen=false;
    if(document.fullscreenElement) void document.exitFullscreen().catch(()=>{});
    render();
  }
  else if(event.key==='Escape' && state.profileGearId){state.profileGearId=null;render();}
  else if(event.key==='Escape' && state.profileLoadoutPicker!==null){state.profileLoadoutPicker=null;render();}
  else if (event.key==='Escape' && state.detail?.kind==='ship') closeShipProfile();
  else if (event.key==='Escape' && (state.picker||state.detail)) {state.picker=null;state.detail=null;render();}
});
window.addEventListener('hashchange', () => {
  const route=location.hash.replace(/^#\//,'');
  const match=route.match(/^ships\/(\d{2,8})$/);
  if (match) {
    state.page='ships';state.detail={kind:'ship',id:'lyc-'+match[1],sourceId:match[1]};state.artViewerOpen=false;
    state.profileSkin=0;state.profileLevel='level120';state.profileLoadoutMode='general';state.profileGearId=null;state.profileLoadoutPicker=null;
    state.artViewerOpen=false;render();void loadShipProfileData();
    return;
  }
  if(route==='ships' && state.page==='ships' && state.detail?.kind==='ship'){
    state.detail=null;state.artViewerOpen=false;state.profileGearId=null;state.profileLoadoutPicker=null;
    render();window.scrollTo({top:state.shipRosterScrollY,behavior:'instant'});return;
  }
  if (pages.some(p=>p.id===route) && (route!==state.page || state.detail)) go(route);
});

async function syncData() {
  state.sync.status='loading'; render();
  try {
    const result=await loadLiveCatalogs();
    if (result.ships) {
      SHIPS.splice(0,SHIPS.length,...mergeShipCatalog(SHIPS.filter(x=>!x.id.startsWith('lyc-')),result.ships));
      refreshShipIndex(SHIPS);
    }
    if (result.equipment) {
      EQUIPMENT.splice(0,EQUIPMENT.length,...mergeEquipmentCatalog(EQUIPMENT.filter(x=>!x.id.startsWith('fer-')),result.equipment));
    }
    state.sync={status:result.ships&&result.equipment?'ready':result.ships||result.equipment?'partial':'failed',
      ships:result.ships?.length||0,equipment:result.equipment?.length||0,
      shipVersion:result.shipVersion,checkedAt:result.checkedAt,errors:result.errors};
    if (result.ships) {
      state.suggestPreview=null;
      for (const mode of MODES) state.workspaces[mode.id]=normalizeWorkspace(state.pendingPlans?.[mode.id]||state.workspaces[mode.id],mode.id);
      state.pendingPlans=null;
      savePlans();
    }
    render();
  } catch(error) {
    state.sync={...state.sync,status:'failed',errors:[error.message]}; render();
  }
}
loadPlans();
loadTierBoards();
loadSuggestOptions();
loadSavedLoadouts();
const initial = location.hash.replace(/^#\//,'');
const initialShip = initial.match(/^ships\/(\d{2,8})$/);
if (initialShip) {
  go('ships');
  state.detail={kind:'ship',id:'lyc-'+initialShip[1],sourceId:initialShip[1]};
  history.replaceState(null,'','#/ships/'+initialShip[1]);
  render();void loadShipProfileData();
} else go(pages.some(p=>p.id===initial)?initial:'overview');
void syncData();