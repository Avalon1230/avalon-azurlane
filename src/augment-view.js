import { AUGMENT_SOURCE, AUGMENT_SOURCE_DATE, OFFICIAL_AUGMENT_ANNOUNCEMENT } from './augment-manifest.js';
import { augmentImageMarkup, augmentIconKey } from './augment-assets.js';
const E=v=>String(v??'').replace(/[&<>"']/g,c=>(
  {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]
));
const statLabel=Object.freeze({
  hp:'HP',fp:'Firepower',trp:'Torpedo',avi:'Aviation',aa:'Anti-Air',
  rld:'Reload',eva:'Evasion',hit:'Accuracy',asw:'Anti-Submarine',spd:'Speed',luck:'Luck'
});
export function renderAugmentDetails(augment){
  if(augment?.kind!=='augment'||!['source-augment','official-announcement'].includes(augment?.source))return '';
  const announced=augment.source==='official-announcement';
  const link=E(announced?OFFICIAL_AUGMENT_ANNOUNCEMENT:AUGMENT_SOURCE);
  const stats=augment.stats?.map(item=>
    '<div><span>'+E(statLabel[item.key]||item.key.toUpperCase())+'</span><strong>'+
    E(item.max)+(Number(item.random)?' · random bonus up to '+E(item.random):'')+
    '</strong></div>').join('')||'';
  const scope=announced?'Publisher-announced exclusive module for this ship; numeric item data not yet independently verified.'
    :augment.matchLevel==='ship-specific'
      ?'Ship-exclusive: exact internal collection ID match in source data.'
      :'General augment: class/type compatibility from the source augment specification.';
  return '<div class="picker-backdrop detail-backdrop" data-action="loadout-augment-close">'+
    '<aside class="picker-panel detail-panel" role="dialog" aria-modal="true" aria-label="Inspect augment '+E(augment.name)+'">'+
    '<div class="picker-head"><div><span class="eyebrow">SOURCED AUGMENT</span><h2>'+
      E(augment.name)+'</h2></div><button type="button" class="icon-btn" data-action="loadout-augment-close" aria-label="Close augment details">✕</button></div>'+
    '<div class="detail-scroll"><div class="augment-inspection-art">'+augmentImageMarkup(augment,'asset-augment-detail')+'</div>'+
    '<section class="equipment-acquisition-panel"><h3>Eligibility and provenance</h3>'+
    '<p>'+E(scope)+'</p>'+
    '<p>Rarity: '+E(augment.rarity)+' · Type: '+E(augment.typeCode??'Unverified')+
    ' · Craftable: '+(augment.craftable===null?'Unverified':augment.craftable?'Recorded as craftable':'Not recorded as craftable')+
    ' · Obtainable: '+(augment.obtainable===null?'Unverified':augment.obtainable?'Recorded as obtainable':'Availability unverified')+'</p>'+ 
    '<p>'+(announced?'Ship GroupID: ':'Source record ID: ')+E(augment.sourceId)+'</p></section>'+ 
    '<div class="profile-table">'+(stats||'<p>Stat increments are not available in this manifest.</p>')+'</div>'+
    '<p class="equipment-acquisition-provenance">Source: <a class="text-link" href="'+link+
    '" target="_blank" rel="noopener noreferrer">'+(announced?'Yostar October 2026 notice':'AzurLaneData augments.json')+'</a> · '+(announced?'2026-10-21':E(AUGMENT_SOURCE_DATE))+
    '. Skill upgrades, optimality, present availability and ship-specific exceptions require separate validation. '+
    (announced?'No verified icon or internal augment item ID is available.':'Artwork: source icon field '+E(augmentIconKey(augment))+' via independent MrLar game-asset CDN (not publisher-hosted).')+'</p>'+
    '</div><div class="picker-footer"><button type="button" class="ghost-btn" data-action="loadout-augment-close">Close</button></div>'+
    '</aside></div>';
}
