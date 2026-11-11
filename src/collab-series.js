import { imageMarkup } from './media.js';

/**
 * Identifiable collaboration-series artwork.
 * Use genuine Azur Lane client portraits for every represented series.
 * Additional wordmarks only when an exact external logo file is verified,
 * never reuse the generic Collab nation's icon as a supposed franchise logo.
 * Commons files remain trademarked by their respective rights holders.
 */
export const COLLAB_SERIES_LOGOS = Object.freeze({
  'Hololive': 'Hololive_Production_logo.svg',
  'The Idolmaster': 'The_iDOLM@STER_logo.svg',
  'SSSS': 'SSSS._Gridman_Logo.svg',
  'Black Rock Shooter': 'Black_Rock_Shooter_logo.svg',
  'NieR:Automata': 'Nier_Automata_Logo.png',
  'Kizuna AI': 'Kizuna_AI_logo.png',
  'Date A Live': 'Date_A_Live_anime_logo.svg'
});
const E = value => String(value??'').replace(/[&<>"']/g,c=>({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[c]));
export const COMMONS_FILE_ROOT = 'https://commons.wikimedia.org/wiki/Special:FilePath/';

export function collabSeriesLogoUrl(series){
  const file=COLLAB_SERIES_LOGOS[series];
  return file?COMMONS_FILE_ROOT+encodeURIComponent(file):null;
}
export function collabSeriesVisual(series,ship){
  const logo=collabSeriesLogoUrl(series);
  return '<span class="collab-series-visual" aria-hidden="true">'+
    (ship?imageMarkup(ship,'ship','asset-collab-ship'):'<span class="collab-series-portrait-missing">✦</span>')+
    (logo?'<span class="collab-series-brand"><img src="'+E(logo)+'" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer"></span>':'')+
    '</span>';
}
