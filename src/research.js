/**
 * Small attributed evidence index: these are EXTERNAL author's assessments,
 * not an AVALON-computed tier or an officially verified game statistic.
 * Expand only after source/methodology review. Checked November 10, 2026.
 */
export const RESEARCH_REFERENCES = Object.freeze({
  regal: { title: 'REGAL · endgame evaluations', url: 'https://azur-lane-regal.suchiguma.com/', kind: 'External tier assessment', checked: '2026-11-10' },
  suchiguma: { title: 'Suchiguma · Research Focus', url: 'https://suchiguma.github.io/miniguides/research-focus/', kind: 'Expert gear and progression guide', checked: '2026-11-10' },
  officialPR9: { title: 'Azur Lane EN · PR9 update', url: 'https://azurlane.yo-star.com/news/2026/07/08/maintenance-notice-7-9-12-a-m-utc-7-2/', kind: 'Official release corroboration', checked: '2026-11-10' }
});
const boss = 'PvE · single-wave boss';
const campaign = 'PvE · late campaign';
export const SHIP_RESEARCH = Object.freeze([
  { name: 'Plymouth', context: boss, grade: 'SS', source: 'regal', why: 'REGAL places Plymouth in its highest single-wave bossing group. This is a source grade, not an AVALON calculation.', note: 'Does not predict performance in PvP or every campaign encounter.' },
  { name: 'Lion', context: boss, grade: 'SS', source: 'regal', why: 'Listed in the top REGAL single-wave bossing group.', note: 'Specific enemy armor and equipment still matter.' },
  { name: 'Eldridge (Retrofit)', context: boss, grade: 'SS', source: 'regal', why: 'Listed in REGAL’s top single-wave bossing group.', note: 'A source-relative rating, not a universal tier.' },
  { name: 'Musashi', context: boss, grade: 'A+', source: 'regal', why: 'REGAL lists Musashi as A+ in single-wave bossing.', note: 'Her performance in campaign mob fleets is a separate question.' },
  { name: 'Guam', context: boss, grade: 'A+', source: 'regal', why: 'REGAL lists Guam as A+ for single-wave bossing.', note: 'Her anti-air value in later campaign stages is not reflected by this boss grade.' },
  { name: 'Shimanto', context: boss, grade: 'A', source: 'regal', why: 'REGAL lists Shimanto as A for single-wave bossing.', note: 'Campaign survivability and AA value require different criteria.' },
  { name: 'Unzen', context: boss, grade: 'A', source: 'regal', why: 'REGAL lists Unzen as A for single-wave bossing.', note: 'Do not apply this single-wave grade to sustained mob clearing.' },
  { name: 'New Jersey', context: boss, grade: 'B+', source: 'regal', why: 'REGAL places New Jersey in its B+ single-wave bossing group.', note: 'A specific context grade; not a judgment of the ship’s overall usefulness.' },
  { name: 'Shimanto', context: campaign, grade: 'Strong pick', source: 'suchiguma', why: 'The research guide calls Shimanto exceptionally useful in later campaign chapters.', note: 'Qualitative endorsement, not a measured numerical tier.' },
  { name: 'Gouden Leeuw', context: campaign, grade: 'Strong pick', source: 'suchiguma', why: 'The guide highlights Gouden Leeuw for campaign use, particularly if high-AA alternatives are missing.', note: 'Value falls when the roster already has alternatives such as Guam or Laffey II.' }
]);
const gear = 'PvE · boss gear and research';
export const EQUIPMENT_RESEARCH = Object.freeze([
  { name: 'Prototype Carrier-Based La-9', context: gear, grade: 'Priority', source: 'suchiguma', why: 'The guide identifies La-9 as a top fighter choice against medium and heavy boss armor.', note: 'Fighter-slot suitability, available blueprints and attack synchronization must be checked.' },
  { name: 'Carrier-Based Ta 152 C-1/R14', context: gear, grade: 'Priority', source: 'suchiguma', why: 'The guide identifies Ta 152 as a leading dive bomber against medium and heavy bosses.', note: 'PR9 gear; not a universal best choice for light armor or campaign waves.' },
  { name: 'Prototype Triple 406mm/45 MK7 Main Gun Mount', context: gear, grade: 'Priority', source: 'suchiguma', why: 'Research Focus highlights the Series 8 Mecklenburg-associated gun for strong medium/heavy boss damage and research value.', note: 'Confirm ship timings and alternatives. The official PR8 update separately confirms this equipment’s existence.' }
]);

export function researchForBoard(boardId, context = 'all', query = '') {
  const list = boardId === 'ships' ? SHIP_RESEARCH : boardId === 'equipment' ? EQUIPMENT_RESEARCH : [];
  const q = String(query || '').trim().toLocaleLowerCase();
  return list.filter(r => (context === 'all' || r.context === context) && (!q || [r.name,r.context,r.grade,r.why,r.note].join(' ').toLocaleLowerCase().includes(q)));
}
