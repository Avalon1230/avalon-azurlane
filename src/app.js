import { MODES, FLEET_BLUEPRINTS, SHIPS, EQUIPMENT, SOURCES } from './catalog.js';
import { SHIP_MAP, compatible, createWorkspace, assignShip, normalizeWorkspace, countAssigned, findFirstVacancy, slotsForFleet, wikiLookupUrl, searchCatalog, escapeHtml } from './domain.js';

const $ = selector => document.querySelector(selector);
const E = escapeHtml;
const storageKey = 'avalon.azurlane.plans.v1';
const pages = [
  { id: 'overview', label: 'Overview', icon: '⌂' },
  { id: 'modes', label: 'Game Modes', icon: '◈' },
  { id: 'ships', label: 'Ship Index', icon: '♙' },
  { id: 'equipment', label: 'Equipment', icon: '⚙' },
  { id: 'fleet', label: 'Fleet Lab', icon: '▦' },
  { id: 'sources', label: 'Sources', icon: '≡' }
];
const state = {
  page: 'overview', modeId: 'opsi', query: '', hull: 'all', category: 'all',
  picker: null, pickerQuery: '', workspaces: {}, toastTimer: null
};

function loadPlans() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    for (const mode of MODES) state.workspaces[mode.id] = normalizeWorkspace(saved[mode.id], mode.id);
  } catch {
    for (const mode of MODES) state.workspaces[mode.id] = createWorkspace(mode.id);
  }
}
function savePlans() {
  try { localStorage.setItem(storageKey, JSON.stringify(state.workspaces)); } catch { notify('Browser storage unavailable; export your plan to keep it.'); }
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
  const hash = `#/${page}`;
  if (location.hash !== hash) history.replaceState(null, '', hash);
  render();
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
  return `<div class="info-banner"><span class="info-dot">i</span><div><strong>Catalog preview — no fabricated tiers.</strong> These are curated example records, not the complete game database. Role hints are provisional; numerical stats and rankings await source verification.</div></div>`;
}
function renderOverview() {
  return `<div class="hero">
    <div class="hero-copy">${eyebrow('YOUR FLEET. YOUR DECISION.')}<h1>Intelligence<br><em>above instinct.</em></h1><p>A research-first Azur Lane workbench. Explore the entire game, organize your fleets, and trace decisions back to evidence.</p>
      <div class="hero-actions"><button class="primary-btn" data-action="navigate" data-page="fleet">Open Fleet Lab <span>↗</span></button><button class="outline-btn" data-action="navigate" data-page="modes">Explore Game Modes</button></div>
    </div>
    <div class="hero-art" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="radar-center"><div class="compass-rose">✦</div><span>AVALON</span><small>TACTICAL INTELLIGENCE</small></div><span class="coord coord-a">N 35° 42′</span><span class="coord coord-b">TACTICAL SYSTEM // 001</span></div>
  </div>
  <div class="metric-grid">
    <div class="metric">${eyebrow('OPERATIONAL AREAS')}<strong>${MODES.length.toString().padStart(2,'0')}</strong><small>Mode-aware architecture</small></div>
    <div class="metric">${eyebrow('INDEXED EXAMPLES')}<strong>${SHIPS.length.toString().padStart(2,'0')}</strong><small>Unranked ship entries</small></div>
    <div class="metric">${eyebrow('EQUIPMENT EXAMPLES')}<strong>${EQUIPMENT.length.toString().padStart(2,'0')}</strong><small>Source-linked records</small></div>
    <div class="metric accent">${eyebrow('YOUR ACTIVE PLAN')}<strong>${countAssigned(currentPlan()).toString().padStart(2,'0')}</strong><small>${E(selectedMode().name)} ships assigned</small></div>
  </div>
  <div class="section-title"><div>${eyebrow('START A MISSION')}<h2>Choose your theater</h2></div><button class="ghost-btn" data-action="navigate" data-page="modes">View all eight →</button></div>
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
  <div class="mode-grid all-modes">${MODES.map(modeCard).join('')}</div><div class="info-banner"><span class="info-dot">i</span><div><strong>Context first.</strong> A campaign mob fleet is not automatically optimal for META Showdown, Operation Siren, Exercises, or an event boss.</div></div>`;
}
function searchBar(placeholder, extra = '') {
  return `<div class="filter-bar"><label class="search-wrap"><span aria-hidden="true">⌕</span><input id="catalog-search" type="search" value="${E(state.query)}" placeholder="${E(placeholder)}" autocomplete="off" aria-label="Search catalog" /></label>${extra}</div>`;
}
function renderShips() {
  const hulls = ['all', ...new Set(SHIPS.map(s => s.hull))];
  const extra = `<label class="select-wrap">Hull <select id="hull-filter">${hulls.map(h => `<option value="${h}" ${h===state.hull?'selected':''}>${h === 'all' ? 'All hulls' : h}</option>`).join('')}</select></label>`;
  const filtered = searchCatalog(SHIPS, state.query, ['name', 'hull', 'tags']).filter(s => state.hull === 'all' || s.hull === state.hull);
  return `${sectionHeading('The ship index', 'RESEARCH CATALOG', 'Search example ship entries, inspect working role labels, and assign ships to your current plan.')}${warning()}
  ${searchBar('Search ship, hull or role...', extra)}<div class="result-caption">${filtered.length} / ${SHIPS.length} example ships · No tier ratings assigned</div>
  <div class="catalog-grid">${filtered.map(shipCard).join('') || '<div class="empty">No ships match these filters.</div>'}</div>`;
}
function shipCard(ship) {
  return `<article class="catalog-card"><div class="catalog-top"><div class="ship-badge ${ship.hull.toLowerCase()}">${E(ship.hull)}</div><span class="verification">REVIEW PENDING</span></div><h3>${E(ship.name)}</h3><p class="muted">Working role tags, not performance ratings</p>
  <div class="tag-row">${ship.tags.map(tag).join('')}</div><div class="card-actions">${link(wikiLookupUrl(ship.name), 'Reference search')}<button type="button" class="small-btn" data-action="add-ship" data-ship="${ship.id}">+ Assign</button></div></article>`;
}
function renderEquipment() {
  const categories = ['all', ...new Set(EQUIPMENT.map(e => e.category))];
  const extra = `<label class="select-wrap">Type <select id="category-filter">${categories.map(cat => `<option value="${E(cat)}" ${cat===state.category?'selected':''}>${E(cat==='all'?'All equipment':cat)}</option>`).join('')}</select></label>`;
  const filtered = searchCatalog(EQUIPMENT, state.query, ['name', 'category', 'acquisition', 'summary']).filter(e => state.category==='all' || e.category===state.category);
  return `${sectionHeading('Equipment intelligence', 'EQUIPMENT INDEX', 'Discover gear categories and acquisition leads. Exact stats, recipes and optimal ratings are not yet verified.')}${warning()}
  ${searchBar('Search gear or acquisition lead...', extra)}<div class="result-caption">${filtered.length} / ${EQUIPMENT.length} example equipment records</div>
  <div class="catalog-grid">${filtered.map(equipCard).join('') || '<div class="empty">No equipment matches these filters.</div>'}</div>`;
}
function equipCard(item) {
  const source = SOURCES.find(s => s.id === (item.provenance === 'official' ? 'official' : 'chapter15'));
  return `<article class="catalog-card gear-card"><div class="catalog-top"><div class="gear-icon">⚙</div><span class="verification ${item.provenance==='official'?'reviewed':''}">${item.provenance==='official'?'OFFICIAL PATCH REFERENCE':'REVIEW PENDING'}</span></div><h3>${E(item.name)}</h3><div class="type-line">${E(item.category)}</div><p>${E(item.summary)}</p><div class="acquisition"><span>ACQUISITION LEAD</span><strong>${E(item.acquisition)}</strong></div><div class="card-actions">${link(wikiLookupUrl(item.name), 'Reference search')}${link(source.url, 'Evidence')}</div></article>`;
}
function modeSelect() {
  return `<label class="mode-selector">THEATER <select id="mode-select">${MODES.map(mode => `<option value="${mode.id}" ${mode.id===state.modeId?'selected':''}>${E(mode.name)}</option>`).join('')}</select></label>`;
}
function renderFleet() {
  const mode = selectedMode(), plan = currentPlan();
  return `${sectionHeading('Fleet laboratory', 'TACTICAL PLANNING', 'A working formation planner with hull checks and local persistence. It does not claim to optimize combat performance yet.')}
  <div class="fleet-toolbar">${modeSelect()}<div class="fleet-controls"><span class="assignment-count">${countAssigned(plan)} / ${countSlots(plan)} assigned</span><button type="button" class="outline-btn compact" data-action="export-plan">Export JSON ↓</button><button type="button" class="ghost-btn danger" data-action="reset-plan">Clear plan</button></div></div>
  <div class="mode-description"><span class="mode-icon">${mode.icon}</span><div><strong>${E(mode.name)}</strong><p>${E(mode.summary)}</p></div></div>
  <div class="fleet-grid">${mode.fleetTypes.map(id => fleetCard(id, plan)).join('')}</div>
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
  const filtered = searchCatalog(SHIPS, state.pickerQuery, ['name', 'hull','tags']).filter(ship => compatible(ship, slot.kind));
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
  <div class="source-alert"><strong>⚠ Wiki verification outstanding</strong><p>In a current external check, the requested Koumakan URL returned unrelated content. We have deliberately paused automated imports from that domain until it can be verified. A separate fan wiki is linked for manual lookup; it is not a verified mirror.</p></div>
  <div class="source-grid">${SOURCES.map(source => `<article class="source-card">${eyebrow(source.type)}<h3>${E(source.name)}</h3><p>${E(source.note)}</p>${link(source.url,'Open source')}</article>`).join('')}</div>
  <div class="method-card"><h2>Three different things. Never one misleading tier.</h2><div class="method-grid"><div><span class="method-num">01</span><h3>Game facts</h3><p>Observed or sourced mechanics with version, link, validation status, and licensing notes.</p></div><div><span class="method-num">02</span><h3>Community evidence</h3><p>Tests, guides and discussion with attribution, limitations, and scenario context.</p></div><div><span class="method-num">03</span><h3>AVALON analysis</h3><p>Independent calculations and judgment, labeled as inference with assumptions and uncertainty.</p></div></div><p class="doc-link">${link('https://github.com/Avalon1230/avalon-azurlane/blob/main/docs/SOURCES.md','Read the complete provenance policy')}</p></div>`;
}
function render() {
  nav();
  const views = { overview:renderOverview, modes:renderModes, ships:renderShips, equipment:renderEquipment, fleet:renderFleet, sources:renderSources };
  $('#app-content').innerHTML = views[state.page]();
  document.title = `${pages.find(p=>p.id===state.page)?.label} · AVALON Azur Lane Intelligence`;
}
function handleAction(target) {
  const {action,page,mode,ship,fleet,slot} = target.dataset;
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
    state.workspaces[state.modeId]=createWorkspace(state.modeId);savePlans();render();notify('Plan cleared.');return;
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
  if (target.dataset.action==='close-picker' && target.classList.contains('picker-backdrop') && event.target!==target) return;
  handleAction(target);
});
document.addEventListener('change', event => {
  if (event.target.id === 'mode-select') { state.modeId=event.target.value;state.picker=null;render(); }
  if (event.target.id === 'hull-filter') { state.hull=event.target.value;render(); }
  if (event.target.id === 'category-filter') { state.category=event.target.value;render(); }
});
document.addEventListener('input', event => {
  const id = event.target.id;
  if (id!=='catalog-search' && id!=='picker-search') return;
  const value = event.target.value;
  const pos = event.target.selectionStart;
  if (id==='catalog-search') state.query=value; else state.pickerQuery=value;
  render();
  const restored = $('#'+id);
  restored?.focus();
  try { restored?.setSelectionRange(pos,pos); } catch { /* unsupported input selection */ }
});
document.addEventListener('keydown', event => {
  if (event.key==='Escape' && state.picker) {state.picker=null;render();}
});
window.addEventListener('hashchange', () => {
  const page=location.hash.replace(/^#\//,'');
  if (pages.some(p=>p.id===page) && page!==state.page) go(page);
});

loadPlans();
const initial = location.hash.replace(/^#\//,'');
go(pages.some(p=>p.id===initial)?initial:'overview');