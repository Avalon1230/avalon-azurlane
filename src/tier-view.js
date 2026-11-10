import { TIER_BOARDS, catalogForBoard, boardAssignmentCount } from './tiers.js';
import { renderAssessmentBoard } from './assessment-view.js';

const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"':'&quot;', "'":'&#39;'
}[char]));
const E = escape;

function tierTile(item, config, boardId, tier) {
  const sub = config.kind === 'equipment' ? item.category || 'Unknown category' : item.hull || item.hullName || 'Unknown hull';
  const choices = [...config.tiers,'unranked'].map(v =>
    `<option value="${v}" ${v === tier ? 'selected' : ''}>${v === 'unranked' ? 'Unranked' : v}</option>`
  ).join('');
  return `<div class="tier-tile" draggable="true" data-tier-item="${E(item.id)}" title="Drag to another tier, or use the selector">
    <div class="tier-tile-text"><strong>${E(item.name)}</strong><small>${E(sub)}</small></div>
    <label class="tier-tile-action"><span class="sr-only">Move ${E(item.name)} to tier</span><select data-tier-assign="${E(item.id)}" aria-label="Move ${E(item.name)} to tier">${choices}</select></label>
  </div>`;
}

function tierRow(config, tier, entries, boardId) {
  return `<section class="tier-lane" data-tier-drop="${tier}" aria-label="${E(tier)} tier drop area">
    <div class="tier-lane-label tier-grade-${tier.toLowerCase()}">
      <strong>${tier}</strong><span>${E(config.meanings[tier])}</span>
    </div>
    <div class="tier-lane-items">${entries.length ? entries.map(item => tierTile(item,config,boardId,tier)).join('') : '<div class="tier-empty">Drop cards here</div>'}</div>
    <span class="tier-lane-count">${entries.length}</span>
  </section>`;
}


export function renderTierView({ boardId='ships', boards={}, ships=[], equipment=[], query='', filter='all', sourceStatus='loading' } = {}) {
  const config = TIER_BOARDS[boardId] || TIER_BOARDS.ships;
  boardId = Object.keys(TIER_BOARDS).includes(boardId) ? boardId : 'ships';
  if (TIER_BOARDS[boardId].readOnly) return renderAssessmentBoard({boardId,query,filter,ships,equipment,sourceStatus});
  const candidates = catalogForBoard(boardId, ships, equipment);
  const placements = boards[boardId] || {};
  const categories = ['all', ...new Set(candidates.map(item => config.kind === 'equipment' ? item.category : item.hull).filter(Boolean))].sort((a,b) => a === 'all' ? -1 : b === 'all' ? 1 : a.localeCompare(b));
  const actualFilter = categories.includes(filter) ? filter : 'all';
  const needle = String(query || '').trim().toLocaleLowerCase();
  const shown = candidates.filter(item => {
    const category = config.kind === 'equipment' ? item.category : item.hull;
    const matchFilter = actualFilter === 'all' || category === actualFilter;
    const searchable = [item.name, category, item.rarity, ...(Array.isArray(item.tags) ? item.tags : [])].filter(Boolean).join(' ').toLocaleLowerCase();
    return matchFilter && (!needle || searchable.includes(needle));
  });
  const assignedCount = boardAssignmentCount(placements,candidates);
  const notRanked = shown.filter(item => !config.tiers.includes(placements[item.id]));
  const limit = 80;
  const choices = categories.map(v => `<option value="${E(v)}" ${v===actualFilter?'selected':''}>${E(v === 'all' ? config.kind==='equipment'?'All equipment types':'All hulls' : v)}</option>`).join('');
  const buttons = Object.entries(TIER_BOARDS).map(([id,meta]) => `<button type="button" class="tier-tab ${id===boardId?'active':''}" data-action="tier-board" data-board="${id}" aria-pressed="${id===boardId}"><span>${meta.icon}</span>${E(meta.title)}</button>`).join('');
  const loadingMessage = sourceStatus === 'loading' ? ' · Source catalogs loading' : sourceStatus === 'failed' ? ' · Fallback catalog only' : '';
  return `<div class="page-heading"><div class="eyebrow">TACTICAL INTELLIGENCE / TIER BOARD</div><h1>Choose your tier list.</h1><p>Combat intelligence and character favorites stay separate. Personal rankings remain private in this browser until you export them.</p></div>
    <nav class="tier-tabs" aria-label="Tier board categories">${buttons}</nav>
    <section class="tier-intro"><div class="eyebrow">${E(config.label.toUpperCase())}</div><h2>${config.icon} ${E(config.title)}</h2><p>${E(config.subtitle)}</p><div class="tier-notice">${E(config.note)}</div></section>
    <div class="tier-controls"><label class="search-wrap"><span aria-hidden="true">⌕</span><input id="tier-search" type="search" value="${E(query)}" placeholder="Find a ${config.kind === 'equipment' ? 'gear' : 'ship'}…" aria-label="Search tier candidates" autocomplete="off"></label>
      <label class="select-wrap">Filter <select id="tier-filter" aria-label="Filter tier candidates">${choices}</select></label>
      <button class="outline-btn compact" type="button" data-action="tier-export">Export JSON ↓</button>
      <button class="ghost-btn danger" type="button" data-action="tier-clear">Clear board</button>
    </div>
    <div class="result-caption">${assignedCount} / ${candidates.length} ranked on this board · ${shown.length} matches${E(loadingMessage)} · Drag cards between tiers or use each card's selector.</div>
    <div class="tier-lanes">${config.tiers.map(tier=>tierRow(config,tier,shown.filter(item=>placements[item.id]===tier),boardId)).join('')}</div>
    <section class="tier-pool" data-tier-drop="unranked"><div class="tier-pool-heading"><div><div class="eyebrow">NOT YET RANKED</div><h2>Candidate pool</h2></div><span class="tier-lane-count">${notRanked.length} matches</span></div>
      <p>Drag candidates into a tier, or use their dropdown. Drop a ranked card here to remove its placement.</p>
      <div class="tier-pool-items">${notRanked.slice(0,limit).map(item=>tierTile(item,config,boardId,'unranked')).join('') || '<div class="tier-empty">No unranked candidates match your search.</div>'}</div>
      ${notRanked.length>limit?`<p class="tier-more">Showing ${limit} of ${notRanked.length} results. Search or filter to find other entries.</p>`:''}
    </section>
    <div class="info-banner"><span class="info-dot">i</span><div><strong>Personal picks, not published AVALON scores.</strong> Ship and equipment performance tiers need independent analysis and mode-specific evidence. Waifu and Must Protect boards are explicitly subjective and completely separate from combat.</div></div>`;
}