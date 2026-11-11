/**
 * Source-identity matched original game-client Augment Module artwork.
 *
 * Item icon keys: Linuxxy0/AzurLaneData-2026-5-2-16-08-11 data/augments.json
 * Actual image files: JforPlay/data_for_toy spweapon/*.webp (independent
 * unofficial game asset extract, NOT standard equipment art).
 *
 * Audited against the upstream GitHub directory: all 239 dated source augment
 * icon keys have exact filename matches, including 12 source-defined aliases.
 * New publisher announcements without internal IDs have no invented artwork.
 * External image availability still depends on GitHub's raw asset host.
 */
export const AUGMENT_ASSET_BASE='https://raw.githubusercontent.com/JforPlay/data_for_toy/main/spweapon/';
export const AUGMENT_ICON_COUNT=239;
export const AUGMENT_ICON_ALIASES=Object.freeze({
  '1010120':'1010100','1010220':'1010200',
  '1020120':'1020100','1030120':'1030100',
  '1040120':'1040100','1050120':'1050100',
  '1060120':'1060100','1060220':'1060200',
  '1070120':'1070100','1070220':'1070200',
  '1080120':'1080100','1080220':'1080200'
});
const E=v=>String(v??'').replace(/[&<>"']/g,c=>({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[c]));

export function augmentIconKey(augment){
  if(augment?.kind!=='augment'||augment.source!=='source-augment')return null;
  const id=String(augment.sourceId??'');
  if(!/^\d{4,8}$/.test(id))return null;
  return AUGMENT_ICON_ALIASES[id]||id;
}
export function augmentIconUrl(augment){
  const key=augmentIconKey(augment);
  return key?AUGMENT_ASSET_BASE+key+'.webp':null;
}
export function augmentImageMarkup(augment,cssClass='asset-augment'){
  const src=augmentIconUrl(augment);
  const cls=/^[a-z0-9 -]{1,80}$/i.test(cssClass)?cssClass:'asset-augment';
  const title=String(augment?.name||'Augment');
  return '<span class="asset-media augment-image '+E(cls)+'" role="img" aria-label="'+
    E(title+(src?' · original game-client icon or placeholder':' · icon unverified'))+'">'+
    '<span class="asset-fallback" aria-hidden="true">✦</span>'+
    (src?'<img class="asset-img" src="'+E(src)+'" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">':'')+
    '</span>';
}