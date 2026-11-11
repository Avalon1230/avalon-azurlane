import { imageMarkup } from './media.js';

/**
 * Identifiable collaboration-series artwork.
 * Use genuine Azur Lane client portraits for every represented series.
 * Additional wordmarks only when an exact external logo file is verified,
 * never reuse the generic Collab nation's icon as a supposed franchise logo.
 * Commons files remain trademarked by their respective rights holders.
 */
export const COMMONS_FILE_ROOT = 'https://upload.wikimedia.org/wikipedia/commons/';
export const COLLAB_SERIES_LOGOS = Object.freeze({
  'Hololive': COMMONS_FILE_ROOT+'d/df/Hololive_Production_logo.svg',
  'The Idolmaster': COMMONS_FILE_ROOT+'f/fa/The_iDOLM%40STER_logo.svg',
  'SSSS': COMMONS_FILE_ROOT+'7/79/SSSS._Gridman_Logo.svg',
  'Black Rock Shooter': COMMONS_FILE_ROOT+'2/2f/Black_Rock_Shooter_logo.svg',
  'NieR:Automata': COMMONS_FILE_ROOT+'9/9f/Nier_Automata_Logo.png',
  'Kizuna AI': COMMONS_FILE_ROOT+'8/83/Kizuna_AI_logo.png',
  'Date A Live': COMMONS_FILE_ROOT+'3/37/Date_A_Live_anime_logo.svg'
});
const E = value => String(value??'').replace(/[&<>"']/g,c=>({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[c]));
export function collabSeriesLogoUrl(series){
  return COLLAB_SERIES_LOGOS[series]||null;
}
export function collabSeriesVisual(series,ship){
  const logo=collabSeriesLogoUrl(series);
  return '<span class="collab-series-visual" aria-hidden="true">'+
    (ship?imageMarkup(ship,'ship','asset-collab-ship'):'<span class="collab-series-portrait-missing">✦</span>')+
    (logo?'<span class="collab-series-brand"><img src="'+E(logo)+'" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer"></span>':'')+
    '</span>';
}
