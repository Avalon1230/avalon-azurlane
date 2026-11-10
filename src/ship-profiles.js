import { imageMarkup } from './media.js';
import { shipBrowseDisplayNation } from './ship-factions.js';

const E = value => String(value ?? '').replace(/[&<>"']/g, c => (
  {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]
));
const PAINT_HOST = 'https://raw.githubusercontent.com/iujab/azurlane-images/main/paintings/';
const STAT_FIELDS = Object.freeze([
  ['health','HP'],['firepower','FP'],['torpedo','TRP'],['antiwar','AA'],
  ['aviation','AVI'],['reload','RLD'],['evasion','EVA'],['accuracy','ACC'],
  ['speed','SPD'],['luck','LCK']
]);

export function detailedShipRecord(dataset, sourceId) {
  const id = String(sourceId ?? '');
  if (!/^\d{2,8}$/.test(id) || !dataset || typeof dataset !== 'object' || Array.isArray(dataset)) return null;
  const record = dataset[id];
  return record && String(record.id) === id && record.names?.en ? record : null;
}
export function trustedShipPainting(url) {
  return typeof url === 'string' && url.startsWith(PAINT_HOST) &&
    /^https:\/\/raw\.githubusercontent\.com\/iujab\/azurlane-images\/main\/paintings\/[\w-]+\.webp$/.test(url)
    ? url : null;
}
function trustedWikiUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && parsed.hostname === 'azurlane.koumakan.jp' &&
      parsed.pathname.startsWith('/wiki/') ? parsed.href : null;
  } catch { return null; }
}
const pct = n => Number.isFinite(n) ? (Math.round(n * 1000) / 10).toLocaleString('en-US') + '%' : '—';
const num = n => Number.isFinite(n) ? n.toLocaleString('en-US') : '—';
function profilePanel(title, body, id = '') {
  return '<section class="ship-profile-panel"' + (id ? ' id="' + E(id) + '"' : '') +
    '><h2>' + E(title) + '</h2>' + body + '</section>';
}
function profileHead(ship, data, skinIndex) {
  const skins = Array.isArray(data?.skins) ? data.skins : [];
  const safeIndex = Math.max(0,Math.min(skins.length-1,skinIndex));
  const picture = trustedShipPainting(skins[safeIndex]?.images?.default || skins[safeIndex]?.image);
  const cover = picture
    ? '<img class="ship-profile-painting" src="' + E(picture) + '" alt="' + E(data.names?.en || ship?.name || 'Ship') + ' artwork" loading="lazy" decoding="async" referrerpolicy="no-referrer">'
    : imageMarkup(ship || data?.names?.en || 'Ship','ship','asset-profile');
  const fallbackName = data?.names?.en || ship?.name || 'Unknown ship';
  const identity = ship ? shipBrowseDisplayNation(ship) : data?.nationality || 'Unclassified';
  const metadata = [identity,data?.class,data?.hullType, data?.rarity || ship?.rarity].filter(Boolean);
  return '<div class="ship-profile-top"><div class="ship-profile-cover">' + cover + '</div>' +
    '<div class="ship-profile-identity"><span class="eyebrow">SHIP RECORD</span><h1>' + E(fallbackName) + '</h1>' +
    '<p>' + E(metadata.join(' · ')) + '</p>' +
    (data?.stars?.stars ? '<div class="ship-profile-stars" aria-label="' + E(data.stars.value) + ' stars">' + E(data.stars.stars) + '</div>' : '') +
    '<div class="ship-profile-actions"><button type="button" class="outline-btn compact" data-action="profile-back">← Back to roster</button>' +
    (ship ? '<button type="button" class="primary-btn compact" data-action="add-ship" data-ship="' + E(ship.id) + '">+ Assign to fleet</button>' : '') +
    '</div>' +
    (skins.length>1 ? '<div class="ship-profile-skin-selector"><span>Artwork</span><div class="ship-profile-choices">' +
      skins.map((skin,i) => '<button type="button" class="filter-chip' + (i===safeIndex?' active':'') +
        '" data-action="profile-skin" data-index="' + i + '" aria-pressed="' + (i===safeIndex) + '">' + E(skin.name || 'Skin '+(i+1)) + '</button>').join('') +
      '</div></div>' : '') +
    '</div></div>';
}
function statPanel(data, level) {
  const levels=['level100','level120','level100Retrofit','level120Retrofit'].filter(k=>data.stats?.[k]);
  if(!levels.length) return profilePanel('Statistics','<p class="profile-unavailable">No verified stat block loaded.</p>');
  const active=levels.includes(level)?level:(levels.includes('level120')?'level120':levels[0]);
  const choices=levels.map(k=>'<button type="button" class="filter-chip'+(k===active?' active':'')+
    '" data-action="profile-level" data-level="'+E(k)+'" aria-pressed="'+(k===active)+'">'+
    E(k.replace('level','Lv. ').replace('Retrofit',' · Retrofit'))+'</button>').join('');
  const vals=STAT_FIELDS.map(([key,title])=>'<div class="ship-stat"><span>'+E(title)+'</span><strong>'+num(data.stats[active][key])+'</strong></div>').join('');
  return profilePanel('Statistics','<div class="ship-profile-choices" role="group" aria-label="Stat level">'+choices+
    '</div><div class="ship-stat-grid">'+vals+'</div>','ship-profile-stats');
}
function gearPanel(data) {
  const slots = Array.isArray(data.slots) ? data.slots : [];
  const body = slots.length
    ? '<div class="ship-gear-list">' + slots.map((slot,i)=>
      '<div class="ship-gear-slot"><span class="slot-number">'+(i+1)+'</span><strong>'+E(slot.type||'Equipment slot')+'</strong>' +
      '<span>Efficiency '+pct(slot.minEfficiency)+' → '+pct(slot.maxEfficiency)+'</span></div>').join('')+'</div>'
    : '<p class="profile-unavailable">Equipment slot data unavailable.</p>';
  return profilePanel('Equipment slots',body,'ship-profile-gear');
}
function skillsPanel(data) {
  const skills=Array.isArray(data.skills)?data.skills:[];
  return profilePanel('Skills',skills.length?
    '<div class="ship-skills-list">' + skills.map(x=>'<article class="ship-skill skill-'+E(['red','yellow','blue'].includes(x.color)?x.color:'other')+'">' +
    '<h3>'+E(x.names?.en||'Unnamed skill')+'</h3><p>'+E(x.description||'Description unavailable')+'</p></article>').join('')+'</div>'
    :'<p class="profile-unavailable">Skill descriptions unavailable.</p>','ship-profile-skills');
}
function progressionPanel(data) {
  const breaks=Array.isArray(data.limitBreaks) ? data.limitBreaks : [];
  const tech=data.fleetTech?.techPoints;
  const parts=[];
  if(breaks.length)parts.push('<h3>Limit breaks</h3><ol class="ship-break-list">'+
    breaks.map((x,i)=>'<li><strong>Stage '+(i+1)+'</strong><span>'+E(Array.isArray(x)?x.join(' · '):String(x))+'</span></li>').join('')+'</ol>');
  if(tech) parts.push('<h3>Fleet technology</h3><div class="ship-quick-facts">'+
    [['Collection',tech.collection],['Max limit break',tech.maxLimitBreak],['Max level',tech.maxLevel],['Total',tech.total]]
      .map(([k,v])=>'<div><span>'+E(k)+'</span><strong>'+num(v)+'</strong></div>').join('')+'</div>');
  return parts.length?profilePanel('Progression',parts.join(''),'ship-profile-progress'): '';
}
function acquisitionPanel(data) {
  const obtain = data.obtainedFrom?.obtainedFrom;
  const maps = Array.isArray(data.obtainedFrom?.fromMaps) ? data.obtainedFrom.fromMaps : [];
  const available=data.construction?.availableIn;
  const modes=available?Object.entries({
    'Light':available.light,'Heavy':available.heavy,'Aviation':available.aviation,
    'Limited':available.limited,'Exchange':available.exchange
  }).filter(([,yes])=>yes).map(([name])=>name):[];
  const rows = [
    obtain?['Acquisition',obtain]:null,
    maps.length?['Map drops',maps.join(', ')]:null,
    data.construction?.constructionTime?['Build time',data.construction.constructionTime]:null,
    modes.length?['Construction pools',modes.join(' · ')]:null
  ].filter(Boolean);
  return profilePanel('Acquisition',rows.length?
    '<div class="ship-info-rows">'+rows.map(([name,value])=>'<div><span>'+E(name)+'</span><strong>'+E(value)+'</strong></div>').join('')+'</div>'
    :'<p class="profile-unavailable">Acquisition data unavailable in this source.</p>','ship-profile-acquire');
}
function sourcePanel(data, ship) {
  const url=trustedWikiUrl(data.wikiUrl);
  const sourceId = data.id || ship?.sourceId;
  return profilePanel('Sources & further research',
    '<p>Ship statistics and skill descriptions are drawn from the current third-party Lycoris game-data snapshot. They are not AVALON combat rankings.</p>'+
    '<p>Augment eligibility, detailed barrage calculations and exact loadout restrictions still require separate verified data.</p>'+
    '<div class="ship-profile-actions">'+
    (url?'<a class="outline-btn compact" href="'+E(url)+'" target="_blank" rel="noopener noreferrer">Full Koumakan entry ↗</a>':'')+
    '<a class="outline-btn compact" href="https://github.com/iujab/Lycoris-AzurAPI" target="_blank" rel="noopener noreferrer">Game-data source ↗</a></div>'+
    (sourceId?'<small>Ship ID '+E(sourceId)+'</small>':''));
}
export function renderShipProfile({ ship = null, data = null, status = 'idle', level='level120', skinIndex=0, error='' } = {}) {
  const name = data?.names?.en || ship?.name || 'Ship profile';
  const back='<button type="button" class="outline-btn compact" data-action="profile-back">← Back to roster</button>';
  if(!data){
    const message=status==='failed'
      ? 'Detailed game data could not be loaded. The ship index and saved fleet remain available.'
      : status==='ready'
        ? 'No matching detailed record was found in the current source snapshot.'
        : 'Loading ship statistics, skills and equipment information…';
    return '<div class="ship-profile-page"><div class="ship-profile-loading">'+
      '<h1>'+E(name)+'</h1><p>'+message+'</p>'+back+
      (status==='failed'?'<button type="button" class="outline-btn compact" data-action="profile-retry">Retry loading</button>':'')+
      (error&&status==='failed'?'<small>'+E(error)+'</small>':'')+
      '</div></div>';
  }
  return '<div class="ship-profile-page">'+profileHead(ship,data,skinIndex)+
    '<nav class="ship-profile-nav" aria-label="Ship information sections">' +
    [['Statistics','#ship-profile-stats'],['Gear','#ship-profile-gear'],['Skills','#ship-profile-skills'],['Progression','#ship-profile-progress'],['Acquisition','#ship-profile-acquire']]
      .map(([label,href])=>'<button type="button" data-action="profile-jump" data-section="'+E(href.slice(1))+'">'+E(label)+'</button>').join('')+'</nav>'+
    '<div class="ship-profile-layout"><div class="ship-profile-main">'+
    statPanel(data,level)+gearPanel(data)+skillsPanel(data)+
    '</div><div class="ship-profile-side">'+
    acquisitionPanel(data)+progressionPanel(data)+sourcePanel(data,ship)+
    '</div></div></div>';
}
