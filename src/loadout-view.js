import { imageMarkup } from './media.js';
import { LOADOUT_MODES } from './loadout-intelligence.js';

const E=v=>String(v??'').replace(/[&<>"']/g,c=>
  ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function slotLabel(slot) {
  if(slot.kind==='augment')return 'Augment';
  if(slot.kind==='auxiliary')return 'Auxiliary';
  if(slot.kind==='special')return 'Extra slot';
  return 'Weapon / aircraft';
}
function sourceStatus(slot) {
  if(slot.kind==='augment')return slot.augmentType?'Type known · module pending':'Module unverified';
  if(slot.provisional)return 'Potential slot · verify';
  return slot.verified?'Source-matched':'Slot unverified';
}
function slotNote(slot) {
  const efficiency=Number.isFinite(slot.maxEfficiency)?' · '+Math.round(slot.maxEfficiency*100)+'% max':'';
  const mounts=Number.isInteger(slot.maxMounts)?' · '+slot.maxMounts+' mounts':'';
  return slot.source+efficiency+mounts;
}
function renderCompactSlot(slot) {
  const label=slotLabel(slot);
  const picked=slot.selected;
  const name=picked?.name||(
    slot.kind==='augment'?(slot.augmentType?'Type: '+slot.augmentType:'No verified augment')
      :slot.provisional?'No source-matched auxiliary':'No verified equipment'
  );
  const image=picked&&slot.kind!=='augment'?imageMarkup(picked,'equipment','asset-roster-equipment'):
    '<span class="loadout-compact-placeholder" aria-hidden="true">'+
    (slot.kind==='augment'?'✦':slot.kind==='auxiliary'?'+':'?')+'</span>';
  const gear=picked?
    '<button type="button" class="loadout-tile-gear" data-action="'+(slot.kind==='augment'?'loadout-augment-inspect':'loadout-inspect')+'" data-equip="'+E(picked.id)+
    '" aria-label="Inspect '+E(name)+' equipment stats and acquisition">'+image+
    '<span class="loadout-tile-name" title="'+E(name)+'">'+E(name)+'</span></button>':
    '<button type="button" class="loadout-tile-gear loadout-tile-unverified" data-action="loadout-slot-info" data-slot="'+slot.index+
    '" aria-label="Inspect '+E(label)+' eligibility and options">'+image+
    '<span class="loadout-tile-name" title="'+E(name)+'">'+E(name)+'</span></button>';
  return '<article class="loadout-compact-slot'+(slot.provisional?' provisional':'')+
    (slot.kind==='augment'?' augment':'')+'" data-loadout-slot="'+slot.index+'">'+
    '<div class="loadout-tile-heading"><span>'+(slot.index+1).toString().padStart(2,'0')+' · '+E(label)+'</span>'+
    (slot.manual?'<span title="Personal pick">★</span>':
      (slot.provisional||slot.kind==='augment')&&picked?'<span title="Candidate, not combat-verified">?</span>':'')+'</div>'+
    '<div class="loadout-tile-type" title="'+E(slot.type)+'">'+E(slot.type)+'</div>'+
    gear+
    ((slot.provisional||slot.kind==='augment')&&picked?'<span class="loadout-tentative-label">Potential · verify</span>':'')+
    '<button type="button" class="loadout-tile-more" data-action="loadout-slot-info" data-slot="'+slot.index+
    '" aria-label="Why this choice and equipment alternatives for '+E(slot.type)+'">'+
    (slot.kind==='augment'?'Eligibility & details':slot.candidates.length>1?'Why & alternatives':'Why & source')+' ↗</button>'+
    '</article>';
}
export function renderLoadoutPanel(model) {
  const tabs=LOADOUT_MODES.map(mode=>'<button type="button" data-action="loadout-mode" data-mode="'+E(mode.id)+
    '" class="loadout-mode'+(mode.id===model.mode?' active':'')+'" aria-pressed="'+(mode.id===model.mode)+'">'+
    E(mode.name)+'</button>').join('');
  const tiles=model.slots.map(renderCompactSlot).join('');
  return '<section class="ship-loadout-panel ship-loadout-compact" id="ship-profile-loadout" aria-labelledby="ship-loadout-title">'+
    '<div class="loadout-heading"><div><span class="eyebrow">AVALON TACTICAL INTELLIGENCE</span>'+
    '<h2 id="ship-loadout-title">Loadout planner</h2></div>'+
    '<span class="loadout-status" title="Source matching only. Not evaluated or simulated">Planning · Sourced</span></div>'+
    '<div class="loadout-modes" role="group" aria-label="Loadout mission context">'+tabs+'</div>'+
    '<div class="loadout-slots loadout-compact-grid" role="group" aria-label="Ship equipment positions">'+tiles+'</div>'+
    '<p class="loadout-brief">'+E(model.description)+'</p>'+
    '<div class="loadout-footer"><span>Potential gear · not combat-optimized</span>'+
      '<button type="button" class="loadout-reset" data-action="loadout-reset">Reset my picks</button></div>'+
    '<p class="loadout-compact-disclaimer">Potential candidates are not best-in-slot recommendations. Auxiliary positions may be provisional; generic augments are sourced by class, not individually ship-validated.</p>'+
    '</section>';
}
export function renderLoadoutAlternatives(model,slotIndex) {
  const slot=model?.slots?.find(s=>s.index===slotIndex);
  if(!slot)return '';
  const choices=slot.candidates.slice(0,50).map(item=>
    '<div class="loadout-choice">'+
      '<button type="button" class="loadout-choice-inspect" data-action="'+
        (slot.kind==='augment'?'loadout-augment-inspect':'loadout-inspect')+'" data-equip="'+E(item.id)+'"'+
        ' aria-label="Inspect '+E(item.name)+'">'+
        (slot.kind==='augment'?'<span class="loadout-compact-placeholder" aria-hidden="true">✦</span>':
          imageMarkup(item,'equipment','asset-picker'))+
        '<span><strong>'+E(item.name)+'</strong><small>'+E(item.rarity||'Unverified')+
        ' · '+E(item.category)+'</small></span></button>'+
      '<button type="button" class="outline-btn compact" data-action="loadout-select"'+
        ' data-slot="'+slot.index+'" data-equip="'+E(item.id)+'"'+
        (slot.selected?.id===item.id?' disabled':'')+'>'+
        (slot.selected?.id===item.id?'Selected':'Select')+'</button></div>').join('');
  const note=slot.kind==='augment'
    ?'Only generic craftable modules are shown, from a May 2, 2026 game-data snapshot and hull-type mapping. Ship-exclusive augments and detailed exceptions are not verified, and combat performance is not ranked.'
    :slot.provisional
      ?'Potential auxiliary position based on the common loadout layout. Ship-specific exceptions and duplicate-equipment restrictions have not been validated. Choose only after verifying your in-game slot.'
      :'The source records a slot category. Equipment choices match the documented type and potential hull restrictions; exceptions and combat effectiveness still require verification.';
  return '<div class="picker-backdrop detail-backdrop" data-action="loadout-close-alternatives">'+
    '<aside class="picker-panel detail-panel loadout-picker-panel" role="dialog" aria-modal="true" aria-label="Equipment evidence and options for '+E(slot.type)+'">'+
      '<div class="picker-head"><div><span class="eyebrow">SLOT '+(slot.index+1)+' · '+E(sourceStatus(slot))+'</span><h2>'+E(slot.type)+'</h2></div>'+
        '<button type="button" class="icon-btn" data-action="loadout-close-alternatives" aria-label="Close options">✕</button></div>'+
      '<div class="detail-scroll">'+
        '<section class="loadout-detail-reason"><h3>Why this choice?</h3>'+
          '<p>'+E(slot.explanation)+'</p><small>'+E(slotNote(slot))+'</small>'+
          '<p>'+E(note)+'</p></section>'+
        (slot.selected?'<button class="loadout-detail-inspect outline-btn compact" type="button" data-action="'+
          (slot.kind==='augment'?'loadout-augment-inspect':'loadout-inspect')+
          '" data-equip="'+E(slot.selected.id)+'">Inspect selected '+(slot.kind==='augment'?'augment source and attributes':'equipment stats and acquisition')+' ↗</button>':'')+
        '<h3 class="loadout-options-heading">Equipment options ('+slot.candidates.length+')</h3>'+
        (choices||'<p class="loadout-picker-info">No source-confirmed selectable equipment is available for this position. Nothing has been invented.</p>')+
        (slot.candidates.length>50?'<p class="loadout-picker-info">Showing the first 50 source candidates. Use the Equipment Index for the full list.</p>':'')+
      '</div><div class="picker-footer"><button type="button" class="ghost-btn" data-action="loadout-close-alternatives">Close</button></div>'+
    '</aside></div>';
}

export function renderAugmentDossier(item) {
  if(!item||item.source!=='augment-snapshot')return '';
  const stats=(item.stats||[]).map(entry=>
    '<div class="profile-row"><span>'+E(entry.stat.toUpperCase())+' (+max)</span><strong>'+
      E(entry.max)+'</strong></div>').join('');
  return '<div class="picker-backdrop detail-backdrop" data-action="loadout-close-augment">'+
    '<aside class="picker-panel detail-panel" role="dialog" aria-modal="true" aria-label="Inspect generic augment">'+
      '<div class="picker-head"><div><span class="eyebrow">AUGMENT INTELLIGENCE · SOURCE CANDIDATE</span><h2>'+E(item.name)+'</h2></div>'+
      '<button type="button" class="icon-btn" data-action="loadout-close-augment" aria-label="Close augment information">✕</button></div>'+
      '<div class="detail-scroll"><section class="equipment-acquisition-panel">'+
        '<h3>Generic augment · '+E(item.rarity)+'</h3>'+
        '<p>Craftable generic augment from the May 2, 2026 game-data snapshot. Class type '+E(item.typeCode)+
          ' supports this hull category, but exact ship-level restrictions and combat value remain unevaluated.</p>'+
        '<h3>Reported maximum attributes</h3>'+
        '<div class="profile-table">'+stats+'</div>'+
        '<p class="equipment-acquisition-provenance">Source: <a href="'+E(item.sourceUrl)+
          '" target="_blank" rel="noopener noreferrer">AzurLaneData augments.json</a>. Original art is not mapped; no invented picture is used.</p>'+
      '</section></div>'+
      '<div class="picker-footer"><button class="ghost-btn" type="button" data-action="loadout-close-augment">Close</button></div>'+
    '</aside></div>';
}
