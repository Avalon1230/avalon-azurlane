import { imageMarkup } from './media.js';

const E = value => String(value ?? '').replace(/[&<>"']/g, c => (
  {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]
));
const RARITY_CLASS = Object.freeze({
  'Ultra Rare':'ultra-rare','Decisive':'ultra-rare',
  'Super Rare':'super-rare','Priority':'super-rare',
  'Elite':'elite','Rare':'rare','Normal':'normal'
});
export function renderShipRosterTile(ship) {
  const rarity=RARITY_CLASS[ship.rarity] || 'unknown';
  const name=ship.name || 'Unknown';
  const hull=ship.hull || 'OTHER';
  return '<button type="button" class="ship-roster-tile rarity-'+rarity+'" '+
    'data-action="ship-details" data-ship="'+E(ship.id)+'" aria-label="View '+E(name)+' ship profile">'+
    '<span class="ship-roster-name">'+E(name)+'</span>'+
    '<span class="ship-roster-portrait">'+imageMarkup(ship,'ship','asset-roster-ship')+'</span>'+
    '<span class="ship-roster-footer"><span>'+E(hull)+'</span><span class="ship-roster-open" aria-hidden="true">↗</span></span>'+
    '</button>';
}
