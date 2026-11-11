import { AVALON_ASSESSMENTS, EVIDENCE_SOURCES, assessmentsFor, confidenceLabel } from './assessments.js';
import { MODES } from './catalog.js';
import { TIER_BOARDS } from './tiers.js';
import { imageMarkup } from './media.js';
const escape = v=>String(v??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const E = escape;
function tabs(boardId) {
  return Object.entries(TIER_BOARDS).map(([id,item])=>`<button type="button" class="tier-tab ${id===boardId?'active':''}" data-action="tier-board" data-board="${E(id)}" aria-pressed="${id===boardId}"><span>${E(item.icon)}</span>${E(item.title)}</button>`).join('');
}
export function matchAssessmentCatalogItem(item,catalog) {
  if(!Array.isArray(catalog))return null;
  if(item.board==='equipment'){
    // Never display an equipment icon from an unpinned fuzzy title match.
    if(!item.sourceId)return null;
    const expected=[item.name,item.sourceName].filter(Boolean);
    return catalog.find(x=>x.source==='fernando'&&String(x.sourceId)===String(item.sourceId)&&
      expected.includes(x.name))||null;
  }
  return catalog.find(x=>x.name===item.name)||null;
}
function itemCard(item,catalog) {
  const mode=MODES.find(m=>m.id===item.mode);
  const matched=matchAssessmentCatalogItem(item,catalog);
  const art=matched?imageMarkup(matched,item.board==='equipment'?'equipment':'ship','asset-assessment'):
    '<span class="assessment-unverified-art" aria-hidden="true">?</span>';
  const configuration=item.configurations?.length?
    '<div class="assessment-configs"><strong>Skill-dependent configurations</strong>'+
      item.configurations.map(x=>'<p><b>'+E(x.name)+':</b> '+E(x.condition)+'</p>').join('')+
    '<small>These are equipment-category conditions, not validated gear presets.</small></div>':'';
  const identityNote=item.board==='equipment' && item.sourceId?
    '<p class="assessment-identity-source">Exact source equipment ID: '+E(item.sourceId)+
      (matched?' · verified ID and source title/alias':' · current catalog match unavailable')+'</p>':
    item.board==='equipment'?'<p class="assessment-identity-source">Exact source ID not verified · artwork withheld rather than guessed</p>':'';
  return `<article class="research-card avalon-assessment-card">
     <div class="research-card-top"><span class="research-grade grade-${E(item.grade.toLowerCase())}">${E(item.grade)}</span><span class="research-context">${E(mode?.name||item.mode)}</span></div>
     <div class="eyebrow">${E(item.role)}</div>
     <div class="assessment-identity">${art}<h3>${E(item.name)}</h3></div>
     ${identityNote}${configuration}
     <p class="assessment-why"><strong>Why it earns ${E(item.grade)}:</strong> ${E(item.rationale)}</p>
     <p class="research-caveat"><strong>When not to pick it:</strong> ${E(item.caveat)}</p>
     ${item.alternatives.length?`<p class="assessment-alternatives"><strong>Other options:</strong> ${E(item.alternatives.join(', '))}</p>`:''}
     <div class="assessment-metadata"><span>Confidence: ${E(confidenceLabel[item.confidence])}</span><span>Reviewed ${E(item.reviewedAt)}</span></div>
     <div class="assessment-links">${item.sources.map(id=>{const s=EVIDENCE_SOURCES[id];return `<a href="${E(s.url)}" class="text-link" target="_blank" rel="noopener noreferrer">${E(s.title)} ↗</a>`}).join('')}</div>
    </article>`;
}

export function renderAssessmentBoard({ boardId='ships', ships=[], equipment=[], query='', filter='all', sourceStatus='loading' }={}) {
  if(!['ships','equipment'].includes(boardId)) return '';
  const config=TIER_BOARDS[boardId];
  const modes=['all',...MODES.map(x=>x.id)];
  const current=modes.includes(filter)?filter:'all';
  const choices=modes.map(id=>`<option value="${E(id)}" ${current===id?'selected':''}>${E(id==='all'?'All game modes':MODES.find(m=>m.id===id)?.name||id)}</option>`).join('');
  const entries=assessmentsFor(boardId,current,query);
  const catalog=boardId==='ships'?ships:equipment;
  const unique=new Set(AVALON_ASSESSMENTS.filter(x=>x.board===boardId).map(x=>x.name.toLocaleLowerCase()));
  const unassessed=catalog.length?[...new Set(catalog.filter(x=>!unique.has(x.name?.toLocaleLowerCase())).map(x=>x.name))].length:null;
  const searchTerm=String(query||'').trim().toLocaleLowerCase();
  const matchedUnassessed = searchTerm && catalog.filter(x=>!unique.has(x.name.toLocaleLowerCase()) && x.name.toLocaleLowerCase().includes(searchTerm)).slice(0,12);
  return `<div class="page-heading"><div class="eyebrow">AVALON / COMBAT INTELLIGENCE</div><h1>${boardId==='ships'?'Which ships should I build?':'Which equipment is worth investing in?'}</h1>
      <p>Game-mode recommendations, explanations, and alternatives.</p></div>
    <nav class="tier-tabs" aria-label="Tier board categories">${tabs(boardId)}</nav>
    <section class="tier-intro"><div class="eyebrow">${E(config.label.toUpperCase())} · PROVISIONAL RESEARCH</div><h2>${E(config.icon)} ${E(config.title)}</h2><p>${E(config.subtitle)}</p>
    <details class="method-disclosure"><summary>How rankings work</summary><div class="tier-notice"><strong>How to read this:</strong> EX = a defining choice for the stated role, S = highly recommended, A = strong with trade-offs, B = serviceable or budget alternative. Tiers are <strong>not universal</strong>, cannot be compared across unrelated roles, and are not derived from a battle simulator. No assessment means <strong>not yet evaluated</strong>, not bad.</div></details></section>
    <div class="tier-controls"><label class="search-wrap"><span aria-hidden="true">⌕</span><input type="search" id="tier-search" value="${E(query)}" placeholder="Search ${boardId==='ships'?'ships, roles, alternatives':'gear, enemies, acquisition'}…" aria-label="Search assessed recommendations" autocomplete="off"></label>
      <label class="select-wrap">Game mode <select id="tier-filter" aria-label="Filter by game mode">${choices}</select></label></div>
    <div class="result-caption">${entries.length} AVALON assessments shown · ${AVALON_ASSESSMENTS.filter(x=>x.board===boardId).length} reviewed situations${unassessed!==null?' · '+unassessed.toLocaleString()+' catalog names awaiting review':''}${sourceStatus==='failed'?' · External catalog unavailable':''}</div>
    <div class="research-grid assessment-grid">${entries.map(item=>itemCard(item,catalog)).join('')||'<div class="empty">No reviewed assessments for this game mode and search. Other game modes and unreviewed items are not assumed weak.</div>'}</div>
    ${matchedUnassessed.length?`<section class="context-panel"><h3>Not yet evaluated</h3><p>These names exist in the searchable catalog, but AVALON has not published a supported assessment for them:</p><div class="tag-row">${matchedUnassessed.map(item=>`<span class="chip">${E(item.name)}</span>`).join('')}</div></section>`:''}
    `;
}