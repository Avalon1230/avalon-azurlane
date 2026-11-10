/**
 * Actual Azur Lane game-client nationality emblems, not AI-generated logos.
 * Mapping and asset URLs sourced from Fernando2603/AzurLane nationality.json.
 * Image copies are hosted by an independent fan project, not the publisher.
 * Factions without a verified source mapping use a typographic placeholder.
 */
export const NATION_EMBLEM_ROOT = 'https://raw.githubusercontent.com/Fernando2603/AzurLane/main/images/nationality/';
export const NATION_EMBLEM_IDS = Object.freeze({
  'Universal': 0,
  'Eagle Union': 1,
  'Royal Navy': 2,
  'Sakura Empire': 3,
  'Iron Blood': 4,
  'Dragon Empery': 5,
  'Sardegna Empire': 6,
  'Northern Parliament': 7,
  'Iris Libre': 8,
  'Vichya Dominion': 9,
  'Iris Orthodoxy': 8,
  'Tempesta': 96,
  'META': 97
});
const COLLABORATION_NATIONS = new Set([
  'Neptunia', 'Bilibili', 'Utawarerumono', 'Kizuna AI', 'Hololive',
  'Venus Vacation', 'The Idolmaster', 'SSSS', 'Atelier Ryza',
  'Senran Kagura', 'To LOVE-Ru', 'Collab'
]);
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => (
  {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]
));

export function nationEmblemUrl(nation) {
  const id = Object.hasOwn(NATION_EMBLEM_IDS, nation)
    ? NATION_EMBLEM_IDS[nation]
    : (COLLABORATION_NATIONS.has(nation) ? 100 : null);
  return id === null ? null : NATION_EMBLEM_ROOT + id + '.png';
}

export function nationEmblemMarkup(nation) {
  const src = nationEmblemUrl(nation);
  const initials = String(nation || '?').split(/\s+/).filter(Boolean)
    .map(word => word[0]).join('').slice(0, 3).toUpperCase();
  return '<span class="nation-emblem" aria-hidden="true">' +
    '<span class="nation-emblem-fallback">' + escapeHtml(initials) + '</span>' +
    (src ? '<img class="asset-img nation-emblem-img" src="' + escapeHtml(src) +
      '" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">' : '') +
    '</span>';
}
