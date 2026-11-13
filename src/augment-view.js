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
  const scope=announced?'The publisher announced this exclusive module for this ship. We haven’t checked its numeric stats yet.'
    :augment.matchLevel==='ship-specific'
      ?'Exclusive to this ship, matched by its exact collection ID.'
      :'A general augment allowed for this ship’s class in the source data.';
  return '<div class="picker-backdrop detail-backdrop" data-action="loadout-augment-close">'+
    '<aside class="picker-panel detail-panel" role="dialog" aria-modal="true" aria-label="Inspect augment '+E(augment.name)+'">'+
    '<div class="picker-head"><div><span class="eyebrow">SOURCED AUGMENT</span><h2>'+
      E(augment.name)+'</h2></div><button type="button" class="icon-btn" data-action="loadout-augment-close" aria-label="Close augment details">✕</button></div>'+
    '<div class="detail-scroll"><div class="augment-inspection-art">'+augmentImageMarkup(augment,'asset-augment-detail')+'</div>'+
    '<section class="equipment-acquisition-panel"><h3>Who can use it and where the data comes from</h3>'+
    '<p>'+E(scope)+'</p>'+
    '<p>Rarity: '+E(augment.rarity)+' · Type: '+E(augment.typeCode??'Unverified')+
    ' · Craftable: '+(augment.craftable===null?'Unverified':augment.craftable?'Listed as craftable':'No crafting route listed')+
    ' · Obtainable: '+(augment.obtainable===null?'Unverified':augment.obtainable?'Listed as obtainable':'Availability not confirmed')+'</p>'+ 
    '<p>'+(announced?'Ship GroupID: ':'Source record ID: ')+E(augment.sourceId)+'</p></section>'+ 
    '<div class="profile-table">'+(stats||'<p>We don’t have the stat increases for this module yet.</p>')+'</div>'+
    '<p class="equipment-acquisition-provenance">Source: <a class="text-link" href="'+link+
    '" target="_blank" rel="noopener noreferrer">'+(announced?'Yostar October 2026 notice':'AzurLaneData augments.json')+'</a> · '+(announced?'2026-10-21':E(AUGMENT_SOURCE_DATE))+
    '. Skill upgrades, current availability, ship exceptions and whether this is the best pick still need checking. '+
    (announced?'No verified icon or internal augment item ID is available.':'Artwork: source icon field '+E(augmentIconKey(augment))+' from the original spweapon asset archive hosted by independent fan project JforPlay (not publisher-hosted).')+'</p>'+
    '</div><div class="picker-footer"><button type="button" class="ghost-btn" data-action="loadout-augment-close">Close</button></div>'+
    '</aside></div>';
}

