import { MODES, FLEET_BLUEPRINTS, SHIPS, EQUIPMENT, SOURCES } from './catalog.js';
import { SHIP_MAP, compatible, createWorkspace, assignShip, normalizeWorkspace, countAssigned, findFirstVacancy, slotsForFleet, wikiLookupUrl, searchCatalog, escapeHtml, refreshShipIndex } from './domain.js';
import { loadLiveCatalogs, mergeShipCatalog, mergeEquipmentCatalog } from './remote.js';
import { contextCriteria, evaluationState } from './criteria.js';
import { changelogToHtml } from './changelog.js';
import { TIER_BOARDS, catalogForBoard, freshTierBoards, normalizeTierBoards, moveTierItem } from './tiers.js';
import { renderTierView } from './tier-view.js';

const $ = selector => document.querySelector(selector);
const E = escapeHtml;
const storageKey = 'avalon.azurlane.plans.v1';
const tierStorageKey = 'avalon.azurlane.tiers.v1';
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
  picker: null, pickerQuery: '', detail: null, workspaces: {}, pendingPlans: null, toastTimer: null,
  sync: { status:'loading', ships:0, equipment:0, shipVersion:null, checkedAt:null, errors:[] },
  changelog: null, changelogStatus: 'idle',
  tierBoard: 'ships', tierQuery: '', tierFilter: 'all', tierBoards: freshTierBoards(), activeDragItem: null
};

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

function loadTierBoards() {
  try { state.tierBoards = normalizeTierBoards(JSON.parse(localStorage.getItem(tierStorageKey) || '{}')); }
  catch { state.tierBoards = freshTierBoards(); }
}
function saveTierBoards() {
  try { localStorage.setItem(tierStorageKey, JSON.stringify(state.tierBoards)); }
  catch { notify('Cannot save tiers in this browser. Use Export JSON to back up your selections.'); }
}
function movePersonalTier(itemId, tier) {
  const eligible = catalogForBoard(state.tierBoard, SHIPS, EQUIPMENT);
  try {
    state.tierBoards = moveTierItem(state.tierBoards, state.tierBoard, itemId, tier, eligible);
    saveTierBoards();
    render();
  } catch (err) { notify(err.message); }
}
function exportTierBoard() {
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
  state.picker = null;
  state.detail = null;
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
  const summary = status === 'ready'
    ? `Live third-party indexes: ${state.sync.ships} source ship entries and ${state.sync.equipment} equipment entries loaded. No combat tiers or verified acquisition recipes are implied.`
    : status === 'partial'
      ? 'One live index is unavailable. Available source data and the editorial fallback remain usable.'
      : status === 'failed'
        ? 'External indexes unavailable: showing the small editorial fallback. Retry when online.'
        : 'Loading public data indexes in the background. The editorial fallback is available immediately.';
  return `<div class="info-banner"><span class="info-dot">i</span><div><strong>${E(status==='ready'?'Source indexes loaded':status==='loading'?'Data connection in progress':'Limited source coverage')}.</strong> ${E(summary)} ${state.sync.shipVersion?`Ship snapshot generated ${E(new Date(state.sync.shipVersion).toLocaleDateString())}.`:''} ${status !== 'ready' && status !== 'loading'?'<button class="inline-action" data-action="sync-data">Retry indexes</button>':''}</div></div>`;
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
    <div class="metric">${eyebrow('INDEXED EXAMPLES')}<strong>${SHIPS.length.toLocaleString()}</strong><small>Searchable ships · no tier scores</small></div>
    <div class="metric">${eyebrow('EQUIPMENT EXAMPLES')}<strong>${EQUIPMENT.length.toLocaleString()}</strong><small>Equipment records</small></div>
    <div class="metric accent">${eyebrow('YOUR ACTIVE PLAN')}<strong>${countAssigned(currentPlan()).toString().padStart(2,'0')}</strong><small>${E(selectedMode().name)} ships assigned</small></div>
  </div>
  ${warning()}<div class="section-title"><div>${eyebrow('START A MISSION')}<h2>Choose your theater</h2></div><button class="ghost-btn" data-action="navigate" data-page="modes">View all eight →</button></div>
  <div class="mode-grid">${MODES.slice(0,4).map(modeCard).join('')}</div>
  <div class="bottom-grid">
    <div class="feature-card"><div class="feature-icon">▦</div>${eyebrow('FLEET LAB')}<h3>Plan without guessing.</h3><p>Build separate formations for each game mode, check hull eligibility, and export a reproducible plan. Saved locally in your browser.</p><button class="ghost-btn" data-action="navigate" data-page="fleet">Build a fleet →</button></div>
    <div class="feature-card"><div class="feature-icon">◎</div>${eyebrow('EVIDENCE STANDARD')}<h3>Know what is proven.</h3><p>Game data, community observations, and AVALON assessments remain visibly separate. No popularity polls masquerading as damage tests.</p><button class="ghost-btn" data-action="navigate" data-page="sources">Review sources →</button></div>
  </div>${warning()}`;
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
  <div class="mode-grid all-modes">${MODES.map(modeCard).join('')}</div>${contextPanel()}<div class="info-banner"><span class="info-dot">i</span><div><strong>Context first.</strong> A campaign mob fleet is not automatically optimal for META Showdown, Operation Siren, Exercises, or an event boss.</div></div>`;
}
function searchBar(placeholder, extra = '') {
  return `<div class="filter-bar"><label class="search-wrap"><span aria-hidden="true">⌕</span><input id="catalog-search" type="search" value="${E(state.query)}" placeholder="${E(placeholder)}" autocomplete="off" aria-label="Search catalog" /></label>${extra}</div>`;
}
function renderShips() {
  const hulls = ['all', ...new Set(SHIPS.map(s => s.hull))].sort((a,b)=>a==='all'?-1:b==='all'?1:a.localeCompare(b));
  const extra = `<label class="select-wrap">Hull <select id="hull-filter">${hulls.map(h => `<option value="${E(h)}" ${h===state.hull?'selected':''}>${h === 'all' ? 'All hulls' : E(h)}</option>`).join('')}</select></label>`;
  const filtered = searchCatalog(SHIPS, state.query, ['name', 'hull', 'tags', 'rarity', 'sourceHull']).filter(s => state.hull === 'all' || s.hull === state.hull);
  const visible=filtered.slice(0,72);
  return `${sectionHeading('The ship index', 'RESEARCH CATALOG · v0.2', 'Search the public ship roster by name, hull, or rarity; open an evidence profile, then assign it to a fleet.')}${warning()}
  ${searchBar('Search ship, hull or rarity...', extra)}<div class="result-caption">${filtered.length.toLocaleString()} / ${SHIPS.length.toLocaleString()} records ${visible.length<filtered.length?'· Showing first 72 (refine your search)':''} · Unranked</div>
  <div class="catalog-grid">${visible.map(shipCard).join('') || '<div class="empty">No ships match these filters.</div>'}</div>`;
}
function shipCard(ship) {
  const status=evaluationState(ship);
  return `<article class="catalog-card"><div class="catalog-top"><div class="ship-badge ${E(ship.hull.toLowerCase())}">${E(ship.hull)}</div><span class="verification">NO TIER</span></div><h3>${E(ship.name)}</h3><p class="muted">${E(ship.rarity||'Unverified rarity')} · ${E(ship.sourceHull||ship.hull)}</p>
  <div class="tag-row">${(ship.tags||[]).map(tag).join('')}${tag(status.tier===null?'Assessment pending':'Reviewed')}</div><div class="card-actions"><button type="button" class="small-btn secondary" data-action="ship-details" data-ship="${E(ship.id)}">Inspect</button><button type="button" class="small-btn" data-action="add-ship" data-ship="${E(ship.id)}">+ Assign</button></div></article>`;
}
function renderEquipment() {
  const categories = ['all', ...new Set(EQUIPMENT.map(e => e.category))].sort((a,b)=>a==='all'?-1:b==='all'?1:a.localeCompare(b));
  const extra = `<label class="select-wrap">Type <select id="category-filter">${categories.map(cat => `<option value="${E(cat)}" ${cat===state.category?'selected':''}>${E(cat==='all'?'All equipment':cat)}</option>`).join('')}</select></label>`;
  const filtered = searchCatalog(EQUIPMENT, state.query, ['name', 'category', 'rarity', 'acquisition']).filter(e => state.category==='all' || e.category===state.category);
  const visible=filtered.slice(0,72);
  return `${sectionHeading('Equipment intelligence', 'EQUIPMENT INDEX · v0.2', 'Browse sourced equipment identities, categories and enhancement attributes. Crafting and acquisition are a separate verification phase.')}${warning()}
  ${searchBar('Search gear, category or rarity...', extra)}<div class="result-caption">${filtered.length.toLocaleString()} / ${EQUIPMENT.length.toLocaleString()} records ${visible.length<filtered.length?'· Showing first 72 (refine your search)':''} · No best-in-slot claims</div>
  <div class="catalog-grid">${visible.map(equipCard).join('') || '<div class="empty">No equipment matches these filters.</div>'}</div>`;
}
function equipCard(item) {
  const stats=Object.entries(item.stats||{}).filter(([,v])=>typeof v==='number').slice(0,3);
  return `<article class="catalog-card gear-card"><div class="catalog-top"><div class="gear-icon">⚙</div><span class="verification">SOURCE INDEX</span></div><h3>${E(item.name)}</h3><div class="type-line">${E(item.category)} · ${E(item.rarity||'Unverified rarity')}</div><p>${E(item.source==='fernando'?'Community data record; enhancement values are source-reported, not independently validated.':item.summary||'Acquisition requires verification.')}</p>
  <div class="tag-row">${stats.map(([k,v])=>tag(`${k.replaceAll('_',' ')}: ${v}`)).join('')}</div><div class="card-actions"><button type="button" class="small-btn secondary" data-action="equip-details" data-equip="${E(item.id)}">Inspect gear</button>${link(wikiLookupUrl(item.name), 'Wiki lookup')}</div></article>`;
}
function evidenceLine(record) {
  if(record?.source === 'lycoris') return `<p><strong>Source:</strong> Lycoris-AzurAPI ship-list.json (independent community snapshot).</p>${link('https://github.com/iujab/Lycoris-AzurAPI/blob/main/data/ship-list.json','Inspect source data')}`;
  if(record?.source === 'fernando') return `<p><strong>Source:</strong> Fernando2603/AzurLane equipment.json (community game-data extraction).</p>${link('https://github.com/Fernando2603/AzurLane/blob/main/equipment.json','Inspect source data')}`;
  return `<p><strong>Source:</strong> Editorial placeholder (not validated).</p>${link('https://github.com/Avalon1230/avalon-azurlane/blob/main/docs/DATA_SOURCES.md','Source methodology')}`;
}
function renderDetails() {
  const d=state.detail;
  const item=d.kind==='ship'?SHIP_MAP.get(d.id):EQUIPMENT.find(x=>x.id===d.id);
  if (!item) return '';
  const ship=d.kind==='ship';
  const rows=ship?[
    ['Hull',item.sourceHull||item.hull],['Hull code',item.hull],['Rarity',item.rarity||'Unverified'],['Role hints',(item.tags||[]).join(', ')||'Not yet evaluated'],['Record ID',item.sourceId||'Editorial']
  ]:[
    ['Category',item.category],['Rarity',item.rarity||'Unverified'],['Highest enhancement reported',item.enhancement||'Not loaded'],['Acquisition',item.acquisition||'Not established'],['Source ID',item.sourceId||'Editorial']
  ];
  const statRows=!ship?Object.entries(item.stats||{}).map(([k,v])=>[k.replaceAll('_',' ').toUpperCase(),String(v)]):[];
  return `<div class="picker-backdrop detail-backdrop" data-action="close-detail"><aside class="picker-panel detail-panel" role="dialog" aria-modal="true" aria-label="Inspect ${ship?'ship':'equipment'}"><div class="picker-head"><div>${eyebrow(ship?'SHIP INTELLIGENCE':'EQUIPMENT INTELLIGENCE')}<h2>${E(item.name)}</h2></div><button class="icon-btn" data-action="close-detail" aria-label="Close detail">✕</button></div>
  <div class="detail-scroll"><div class="info-banner"><span class="info-dot">i</span><div><strong>Source-indexed, not tier-ranked.</strong> ${E(evaluationState(item).quality)}. Do not treat this profile as a battle-performance verdict.</div></div>
  <div class="profile-table">${[...rows,...statRows].map(([k,v])=>`<div><span>${E(k)}</span><strong>${E(v)}</strong></div>`).join('')}</div>
  <section class="context-panel">${eyebrow('MODE-SPECIFIC RESEARCH')}<h3>${E(selectedMode().name)} · assessment pending</h3><p>Data needed before calculating ship effectiveness or recommending equipment for this mode:</p><div class="tag-row">${contextCriteria(state.modeId).map(tag).join('')}</div></section>
  <section class="evidence-box"><h3>Evidence trail</h3>${evidenceLine(item)}<p>${link(wikiLookupUrl(item.name),'Search Azur Lane fan wiki')}</p></section></div>
  <div class="picker-footer"><button type="button" class="ghost-btn" data-action="close-detail">Close</button></div></aside></div>`;
}
function modeSelect() {
  return `<label class="mode-selector">THEATER <select id="mode-select">${MODES.map(mode => `<option value="${mode.id}" ${mode.id===state.modeId?'selected':''}>${E(mode.name)}</option>`).join('')}</select></label>`;
}
function renderFleet() {
  const mode = selectedMode(), plan = currentPlan();
  return `${sectionHeading('Fleet laboratory', 'TACTICAL PLANNING', 'A working formation planner with hull checks and local persistence. It does not claim to optimize combat performance yet.')}
  <div class="fleet-toolbar">${modeSelect()}<div class="fleet-controls"><span class="assignment-count">${countAssigned(plan)} / ${countSlots(plan)} assigned</span><button type="button" class="outline-btn compact" data-action="export-plan">Export JSON ↓</button><button type="button" class="ghost-btn danger" data-action="reset-plan">Clear plan</button></div></div>
  <div class="mode-description"><span class="mode-icon">${mode.icon}</span><div><strong>${E(mode.name)}</strong><p>${E(mode.summary)}</p></div></div>
  ${contextPanel()}<div class="fleet-grid">${mode.fleetTypes.map(id => fleetCard(id, plan)).join('')}</div>
  <div class="info-banner"><span class="info-dot">i</span><div><strong>How to build:</strong> Click an empty or occupied slot to select a compatible ship. An assigned ship cannot appear twice within the same plan. Each game mode has a separate saved arrangement, stored only in this browser.</div></div>
  ${state.picker ? renderPicker() : ''}`;
}
function fleetCard(id, plan) {
  const fleet = FLEET_BLUEPRINTS[id];
  const slots = slotsForFleet(id);
  const used = Object.values(plan.fleets[id]).filter(Boolean).length;
  return `<section class="fleet-card"><div class="fleet-card-head"><div>${eyebrow(fleet.type.toUpperCase() + ' FORMATION')}<h3>${E(fleet.name)}</h3><p>${E(fleet.detail)}</p></div><span class="fleet-count">${used}/${slots.length}</span></div><div class="slot-grid ${fleet.type === 'surface'?'surface-slots':''}">${slots.map(slot => {
    const assigned = SHIP_MAP.get(plan.fleets[id][slot.id]);
    return `<button type="button" class="fleet-slot ${assigned?'filled':''}" data-action="choose-slot" data-fleet="${id}" data-slot="${slot.id}"><small>${E(slot.label)}</small><strong>${assigned?E(assigned.name):'+ Assign ship'}</strong><span>${assigned?E(assigned.hull):E(slot.kind)}</span></button>`;
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
    return `<button type="button" class="picker-option" data-action="place-ship" data-ship="${ship.id}" ${taken?'disabled title="Already assigned"':''}><span class="ship-badge small">${E(ship.hull)}</span><span class="picker-name">${E(ship.name)}<small>${E(ship.tags.join(' · '))}</small></span><span>${taken?'In use':ship.id === assigned?'Selected':'+'}</span></button>`;
  }).join('') || '<div class="empty">No compatible ships in the sample index.</div>'}</div>
  <div class="picker-footer"><button type="button" class="outline-btn compact" data-action="clear-slot" ${assigned?'':'disabled'}>Remove assignment</button><button type="button" class="ghost-btn" data-action="close-picker">Close</button></div></aside></div>`;
}
function renderSources() {
  return `${sectionHeading('Trust the trail, not the hype.', 'SOURCES & METHODOLOGY', 'Sources are explicit; the project does not convert popular opinions into verified performance figures.')}
  ${warning()}<div class="source-alert"><strong>⚠ Wiki crawler mismatch — live site not declared broken</strong><p>Our web retrieval results for Koumakan contained unrelated fragments of novels, even on several indexed wiki pages. The retrieved pages may be cached, poisoned, or crawler-specific; the cause is unconfirmed. The wiki works in normal browsers reported by users. We have paused API ingestion until direct machine-readable responses and reuse permissions can be independently checked; see Sources documentation.</p></div>
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

function render() {
  nav();
  const views = { overview:renderOverview, modes:renderModes, ships:renderShips, equipment:renderEquipment, fleet:renderFleet, sources:renderSources, updates:renderUpdates,
    tiers: () => renderTierView({ boardId: state.tierBoard, boards: state.tierBoards, ships: SHIPS, equipment: EQUIPMENT, query: state.tierQuery, filter: state.tierFilter, sourceStatus: state.sync.status }) };
  $('#app-content').innerHTML = views[state.page]() + (state.detail ? renderDetails() : '');
  document.title = `${pages.find(p=>p.id===state.page)?.label} · AVALON Azur Lane Intelligence`;
}
function handleAction(target) {
  const {action,page,mode,ship,equip,fleet,slot,board} = target.dataset;
  if (action === 'tier-board') {
    if (!TIER_BOARDS[board]) return;
    state.tierBoard=board;state.tierQuery='';state.tierFilter='all';render();return;
  }
  if (action === 'tier-export') { exportTierBoard();return; }
  if (action === 'tier-clear') {
    if (!window.confirm('Clear your personal ' + TIER_BOARDS[state.tierBoard].title + ' board? Other boards and Fleet Lab are unaffected.')) return;
    state.tierBoards[state.tierBoard]={};saveTierBoards();render();notify('Tier board cleared.');return;
  }
  if (action === 'sync-data') { void syncData(); return; }
  if (action === 'ship-details') { state.detail={kind:'ship',id:ship};return render(); }
  if (action === 'equip-details') { state.detail={kind:'equipment',id:equip};return render(); }
  if (action === 'close-detail') { state.detail=null;return render(); }
  if (action === 'navigate') return go(page);
  if (action === 'open-mode') { state.modeId = mode; return go('fleet'); }
  if (action === 'add-ship') {
    const item = SHIP_MAP.get(ship), location = findFirstVacancy(currentPlan(), item);
    if (!location) return notify('No compatible free slot, or ship already assigned. Open Fleet Lab to adjust.');
    state.workspaces[state.modeId] = assignShip(currentPlan(), location.fleetId, location.slotId, item.id);
    savePlans(); notify(`${item.name} assigned in ${selectedMode().name}.`); return render();
  }
  if (action === 'choose-slot') { state.picker = {fleetId:fleet,slotId:slot}; state.pickerQuery=''; return render(); }
  if (action === 'close-picker') { state.picker=null; return render(); }
  if (action === 'place-ship' || action === 'clear-slot') {
    const {fleetId,slotId} = state.picker;
    try {
      state.workspaces[state.modeId] = assignShip(currentPlan(),fleetId,slotId,action==='place-ship'?ship:null);
      state.picker=null; state.pickerQuery=''; savePlans(); render();
    } catch(err) { notify(err.message); }
    return;
  }
  if (action === 'reset-plan') {
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

document.addEventListener('click', event => {
  const target = event.target.closest('[data-action]');
  if (!target || target.disabled) return;
  // A click within the picker should not close it unless it hits the backdrop itself.
  if (['close-picker','close-detail'].includes(target.dataset.action) && target.classList.contains('picker-backdrop') && event.target!==target) return;
  handleAction(target);
});
document.addEventListener('change', event => {
  if (event.target.id === 'tier-filter') { state.tierFilter=event.target.value;render();return; }
  if (event.target.matches('[data-tier-assign]')) {
    movePersonalTier(event.target.dataset.tierAssign,event.target.value);return;
  }
  if (event.target.id === 'mode-select') { state.modeId=event.target.value;state.picker=null;render(); }
  if (event.target.id === 'hull-filter') { state.hull=event.target.value;render(); }
  if (event.target.id === 'category-filter') { state.category=event.target.value;render(); }
});
document.addEventListener('input', event => {
  const id = event.target.id;
  if (id!=='catalog-search' && id!=='picker-search' && id!=='tier-search') return;
  const value = event.target.value;
  const pos = event.target.selectionStart;
  if (id==='catalog-search') state.query=value;
  else if (id==='picker-search') state.pickerQuery=value;
  else state.tierQuery=value;
  render();
  const restored = $('#'+id);
  restored?.focus();
  try { restored?.setSelectionRange(pos,pos); } catch { /* unsupported input selection */ }
});
document.addEventListener('dragstart', event => {
  if (state.page !== 'tiers') return;
  const item = event.target.closest('[data-tier-item]');
  if (!item || !event.dataTransfer) return;
  state.activeDragItem = item.dataset.tierItem;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', state.activeDragItem);
  item.classList.add('tier-dragging');
});
document.addEventListener('dragover', event => {
  if (state.page !== 'tiers' || !state.activeDragItem) return;
  const target = event.target.closest('[data-tier-drop]');
  if (!target) return;
  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
});
document.addEventListener('drop', event => {
  if (state.page !== 'tiers' || !state.activeDragItem) return;
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
document.addEventListener('keydown', event => {
  if (event.key==='Escape' && (state.picker||state.detail)) {state.picker=null;state.detail=null;render();}
});
window.addEventListener('hashchange', () => {
  const page=location.hash.replace(/^#\//,'');
  if (pages.some(p=>p.id===page) && page!==state.page) go(page);
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
const initial = location.hash.replace(/^#\//,'');
go(pages.some(p=>p.id===initial)?initial:'overview');
void syncData();