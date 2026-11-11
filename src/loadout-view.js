import { imageMarkup } from './media.js';
import { augmentImageMarkup } from './augment-assets.js';
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
  if(slot.kind==='augment')return slot.verified?'Source-matched module':slot.provisional?'Class-matched · verify':'Module unverified';
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
    slot.kind==='augment'?(slot.augmentType?'Type: '+slot.augmentType:'Augment not verified')
      :slot.provisional?'Choose auxiliary':'No verified equipment'
  );
  // Augments use exact source icon mappings, never the regular gear icon mapper.
  const isAugment=slot.kind==='augment';
  const image=isAugment
    ? augmentImageMarkup(picked,'asset-roster-equipment')
    :picked?imageMarkup(picked,'equipment','asset-roster-equipment'):
      '<span class="loadout-compact-placeholder" aria-hidden="true">'+
      (slot.kind==='auxiliary'?'+':'?')+'</span>';
  const action=picked?(isAugment?'loadout-augment-inspect':'loadout-inspect'):'loadout-slot-info';
  const attribute=picked?(isAugment?' data-augment="'+E(picked.id)+'"':' data-equip="'+E(picked.id)+'"')
    :' data-slot="'+slot.index+'"';
  const gear='<button type="button" class="loadout-tile-gear'+(!picked?' loadout-tile-unverified':'')+
    '" data-action="'+action+'"'+attribute+' aria-label="'+
    E(picked?'Inspect '+name+(isAugment?' augment details':' equipment stats and acquisition'):
      'Inspect '+label+' eligibility and options')+'">'+image+
    '<span class="loadout-tile-name" title="'+E(name)+'">'+E(name)+'</span></button>';
  const choiceStatus=slot.manual?'Personal pick':slot.selected?'Compatible candidate':'No verified selection';
  return '<article class="loadout-compact-slot'+(slot.provisional?' provisional':'')+
    (slot.kind==='augment'?' augment':'')+'" data-loadout-slot="'+slot.index+'">'+
    '<div class="loadout-tile-heading"><span>'+(slot.index+1).toString().padStart(2,'0')+' · '+E(label)+'</span>'+
    (slot.manual?'<span title="Personal pick">★</span>':'')+'</div>'+
    '<div class="loadout-tile-type" title="'+E(slot.type)+'">'+E(slot.type)+'</div>'+
    gear+
    '<span class="loadout-choice-status" title="'+E(slot.manual?'Saved locally by you; not independently reviewed':'Compatibility only; not a reviewed performance recommendation')+'">'+E(choiceStatus)+'</span>'+
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
  const aquilaSecond=model.sourceId==='60701'?model.slots.find(slot=>slot.index===1):null;
  const aquilaAdvice=aquilaSecond?
    '<p class="loadout-skill-conditional"><strong>Aquila · slot 2 skill switch:</strong> Fighter = healing/shielding; Dive Bomber = offensive preload/damage. '+
    'The displayed item is only a compatibility candidate, not a selected healer preset. '+
    (!['Fighter','Dive Bomber'].every(type=>aquilaSecond.categories.includes(type))?
      'Both configurations are not independently confirmed by the current slot feed; check her in-game slot.':'Choose the required type in Why & alternatives.')+
    '</p>':'';
  return '<section class="ship-loadout-panel ship-loadout-compact" id="ship-profile-loadout" aria-labelledby="ship-loadout-title">'+
    '<div class="loadout-heading"><div><span class="eyebrow">AVALON TACTICAL INTELLIGENCE</span>'+
    '<h2 id="ship-loadout-title">Loadout planner</h2></div>'+
    '<span class="loadout-status" title="Source matching only. Not evaluated or simulated">Planning · Sourced</span></div>'+
    '<div class="loadout-modes" role="group" aria-label="Loadout mission context">'+tabs+'</div>'+
    aquilaAdvice+
    '<div class="loadout-slots loadout-compact-grid" role="group" aria-label="Ship equipment positions">'+tiles+'</div>'+
    '<p class="loadout-brief">'+E(model.description)+'</p>'+
    '<div class="loadout-footer"><span>Potential gear · not combat-optimized</span>'+
      '<button type="button" class="loadout-reset" data-action="loadout-reset">Reset my picks</button></div>'+
    '<p class="loadout-compact-disclaimer">Slots and augments are source-based starting points, not optimized builds. Dated game data may not cover every ship. Tap Why & alternatives for eligibility and evidence.</p>'+
    '</section>';
}
export function filteredLoadoutCandidates(slot,query='') {
  const term=String(query||'').trim().toLocaleLowerCase();
  const options=Array.isArray(slot?.candidates)?slot.candidates:[];
  if(!term)return options;
  return options.filter(item=>[
    item.name,item.category,item.rarity,item.sourceId,item.matchLevel
  ].some(value=>String(value||'').toLocaleLowerCase().includes(term)));
}
export function renderLoadoutAlternatives(model,slotIndex,{query='',limit=50}={}) {
  const slot=model?.slots?.find(s=>s.index===slotIndex);
  if(!slot)return '';
  const filtered=filteredLoadoutCandidates(slot,query);
  const shown=filtered.slice(0,Math.max(1,Number.isSafeInteger(limit)?limit:50));
  const choices=shown.map(item=>{
    const aug=slot.kind==='augment';
    const icon=aug?augmentImageMarkup(item,'asset-picker'):
      imageMarkup(item,'equipment','asset-picker');
    const scope=aug?(item.matchLevel==='ship-specific'?'Exclusive · exact ship ID':'General · class eligibility'):
      item.category;
    return '<div class="loadout-choice">'+
      '<button type="button" class="loadout-choice-inspect" data-action="'+(aug?'loadout-augment-inspect':'loadout-inspect')+'"'+
        (aug?' data-augment="'+E(item.id)+'"':' data-equip="'+E(item.id)+'"')+
        ' aria-label="Inspect '+E(item.name)+'">'+icon+
        '<span><strong>'+E(item.name)+'</strong><small>'+E(item.rarity||'Unverified')+
        ' · '+E(scope)+'</small></span></button>'+
      '<button type="button" class="outline-btn compact" data-action="loadout-select"'+
        ' data-slot="'+slot.index+'" data-equip="'+E(item.id)+'"'+
        (slot.selected?.id===item.id?' disabled':'')+'>'+
        (slot.selected?.id===item.id?'Selected':'Select')+'</button></div>';
  }).join('');
  const note=slot.kind==='augment'
    ?'Modules are sourced from the May 2026 augment database. Exclusive modules match exact internal ship IDs; generic modules match documented hull classes. Their skill effects and combat optimality are not simulated.'
    :slot.provisional
      ?'Potential auxiliary position based on the common loadout layout. Ship-specific exceptions and build performance are unverified; source limit groups are enforced when available.'
      :'The source records a slot category. Equipment options match sourced type, hull and known limit-group restrictions; combat effectiveness still requires verification.';
  const status=slot.manual?'Personal pick':slot.selected?'Compatible candidate · not reviewed':'No candidate selected';
  return '<div class="picker-backdrop detail-backdrop" data-action="loadout-close-alternatives">'+
    '<aside class="picker-panel detail-panel loadout-picker-panel" role="dialog" aria-modal="true" aria-label="Equipment evidence and options for '+E(slot.type)+'">'+
      '<div class="picker-head"><div><span class="eyebrow">SLOT '+(slot.index+1)+' · '+E(sourceStatus(slot))+'</span><h2>'+E(slot.type)+'</h2></div>'+
        '<button type="button" class="icon-btn" data-action="loadout-close-alternatives" aria-label="Close options">✕</button></div>'+
      '<div class="detail-scroll">'+
        '<section class="loadout-detail-reason"><h3>Why this choice? · '+E(status)+'</h3>'+
          '<p>'+E(slot.explanation)+'</p><small>'+E(slotNote(slot))+'</small>'+
          '<p>'+E(note)+'</p></section>'+
        (slot.selected?'<button class="loadout-detail-inspect outline-btn compact" type="button" data-action="'+
          (slot.kind==='augment'?'loadout-augment-inspect':'loadout-inspect')+'"'+
          (slot.kind==='augment'?' data-augment="'+E(slot.selected.id)+'"':' data-equip="'+E(slot.selected.id)+'"')+'">'+
          (slot.kind==='augment'?'Inspect sourced augment stats':'Inspect selected equipment stats and acquisition')+' ↗</button>':'')+
        '<h3 class="loadout-options-heading">Equipment options ('+slot.candidates.length+')</h3>'+
        '<label class="loadout-choice-search-label" for="loadout-choice-search">Search eligible items within this slot</label>'+
        '<input id="loadout-choice-search" class="loadout-choice-search" type="search" value="'+E(query)+
          '" placeholder="Search names, types, rarity or IDs" autocomplete="off" aria-label="Search compatible equipment for this slot">'+
        '<p class="loadout-picker-info" role="status">'+shown.length+' shown of '+filtered.length+
          ' matching · '+slot.candidates.length+' eligible</p>'+
        (choices||'<p class="loadout-picker-info">No matching source candidates. Clear the search to see other eligible gear.</p>')+
        (filtered.length>shown.length?'<button type="button" class="outline-btn compact loadout-more-choices" data-action="loadout-more-alternatives">'+
          'Show more ('+(filtered.length-shown.length)+' remaining)</button>':'')+
      '</div><div class="picker-footer"><button type="button" class="ghost-btn" data-action="loadout-close-alternatives">Close</button></div>'+
    '</aside></div>';
}
