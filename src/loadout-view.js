import { imageMarkup } from './media.js';
import { LOADOUT_MODES } from './loadout-intelligence.js';

const E=v=>String(v??'').replace(/[&<>"']/g,c=>
  ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function slotNote(slot) {
  const efficiency=Number.isFinite(slot.maxEfficiency)?' · '+Math.round(slot.maxEfficiency*100)+'% max':'';
  const mounts=Number.isInteger(slot.maxMounts)?' · '+slot.maxMounts+' mounts':'';
  return slot.source+efficiency+mounts;
}
function renderSlot(slot) {
  const title='Slot '+(slot.index+1)+' · '+slot.type;
  const has=!!slot.selected;
  const name=slot.selected?.name||'Unverified selection';
  const intro=has?imageMarkup(slot.selected,'equipment','asset-roster-equipment'):'<span class="loadout-empty-icon" aria-hidden="true">?</span>';
  const option=has?'<button type="button" class="loadout-gear" data-action="loadout-inspect" data-equip="'+E(slot.selected.id)+
    '" aria-label="Inspect '+E(name)+' equipment">'+intro+
    '<span class="loadout-gear-name"><strong>'+E(name)+'</strong><small>'+E(slot.selected.rarity||'Unverified')+
    (slot.manual?' · Your selection':' · Source candidate')+'</small></span><span aria-hidden="true">↗</span></button>'
    :'<div class="loadout-gear unavailable">'+intro+'<span class="loadout-gear-name"><strong>'+E(name)+'</strong>'+
      '<small>'+(slot.verified?'No exact source/hull match found':'Slot category not mapped')+'</small></span></div>';
  return '<article class="loadout-slot" data-loadout-slot="'+slot.index+'">'+
    '<div class="loadout-slot-heading"><strong>'+E(title)+'</strong><small>'+E(slotNote(slot))+'</small></div>'+
    option+
    '<div class="loadout-slot-explanation"><span class="loadout-evidence-label">WHY THIS CANDIDATE</span>'+
      '<p>'+E(slot.explanation)+'</p></div>'+
    (slot.candidates.length>1?'<button type="button" class="loadout-alternatives" data-action="loadout-alternatives" data-slot="'+slot.index+
      '">Explore '+(slot.candidates.length>50?'50+':slot.candidates.length)+' source-matched options ↗</button>':'')+
    '</article>';
}
export function renderLoadoutPanel(model) {
  const tabs=LOADOUT_MODES.map(mode=>'<button type="button" data-action="loadout-mode" data-mode="'+E(mode.id)+
    '" class="loadout-mode'+(mode.id===model.mode?' active':'')+'" aria-pressed="'+(mode.id===model.mode)+'">'+
    E(mode.name)+'</button>').join('');
  const slots=model.slots.length?model.slots.map(renderSlot).join('')
    :'<p class="loadout-empty">No source-confirmed equipment slots for this ship. AVALON will not invent a loadout.</p>';
  return '<section class="ship-loadout-panel" id="ship-profile-loadout" aria-labelledby="ship-loadout-title">'+
    '<div class="loadout-heading"><div><span class="eyebrow">AVALON TACTICAL INTELLIGENCE</span>'+
    '<h2 id="ship-loadout-title">Loadout planner</h2></div>'+
    '<span class="loadout-status" title="Source-matched eligibility, not a simulated recommendation">Sourced</span></div>'+
    '<div class="loadout-modes" role="group" aria-label="Loadout mission context">'+tabs+'</div>'+
    '<p class="loadout-context">'+E(model.description)+'</p>'+
    '<div class="loadout-slots">'+slots+'</div>'+
    (model.augment?'<p class="loadout-augment">Augment type: '+E(model.augment)+
      ' · No source-verified augment recommendation yet.</p>':'')+
    '<div class="loadout-footer"><span>'+E(model.confidence)+'</span>'+
      '<button type="button" class="loadout-reset" data-action="loadout-reset">Reset my picks</button></div>'+
    '<p class="loadout-disclaimer">Selections are research starting points, not proven best-in-slot builds. Skill timing, enemy armor, ship-specific exceptions and fleet synergy are not yet simulated.</p>'+
    '</section>';
}
export function renderLoadoutAlternatives(model,slotIndex) {
  const slot=model?.slots?.find(s=>s.index===slotIndex);
  if(!slot||slot.candidates.length<2)return '';
  const choices=slot.candidates.slice(0,50).map(item=>
    '<div class="loadout-choice">'+
      '<button type="button" class="loadout-choice-inspect" data-action="loadout-inspect" data-equip="'+E(item.id)+'"'+
        ' aria-label="Inspect '+E(item.name)+'">'+imageMarkup(item,'equipment','asset-picker')+
        '<span><strong>'+E(item.name)+'</strong><small>'+E(item.rarity||'Unverified')+
        ' · '+E(item.category)+'</small></span></button>'+
      '<button type="button" class="outline-btn compact" data-action="loadout-select"'+
        ' data-slot="'+slot.index+'" data-equip="'+E(item.id)+'"'+
        (slot.selected?.id===item.id?' disabled':'')+'>'+
        (slot.selected?.id===item.id?'Selected':'Select')+'</button></div>').join('');
  return '<div class="picker-backdrop detail-backdrop" data-action="loadout-close-alternatives">'+
    '<aside class="picker-panel detail-panel loadout-picker-panel" role="dialog" aria-modal="true" aria-label="Equipment options for '+E(slot.type)+'">'+
      '<div class="picker-head"><div><span class="eyebrow">EQUIPMENT CANDIDATES</span><h2>'+E(slot.type)+'</h2></div>'+
        '<button type="button" class="icon-btn" data-action="loadout-close-alternatives" aria-label="Close options">✕</button></div>'+
      '<div class="detail-scroll">'+
        '<p class="loadout-picker-info">Original equipment records matching this slot category and hull class. Listed order uses available source enhancement stats and rarity, not verified DPS or skill synergy.</p>'+
        choices+
        (slot.candidates.length>50?'<p class="loadout-picker-info">Showing the first 50 candidates. Search the complete Equipment Index for more.</p>':'')+
      '</div><div class="picker-footer"><button type="button" class="ghost-btn" data-action="loadout-close-alternatives">Close</button></div>'+
    '</aside></div>';
}
