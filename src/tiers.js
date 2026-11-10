/**
 * Personal tier-board model for AVALON. These rankings are user edits, NOT
 * evidence-reviewed official AVALON evaluations or objective game data.
 * Character eligibility is individually curated, never inferred from hull.
 */

export const TIER_BOARDS = Object.freeze({
  ships: {
    title: 'Ship Combat', icon: '⚓', kind: 'ships', label: 'AVALON contextual assessments', readOnly: true,
    subtitle: 'See which ships AVALON recommends for a particular mode and role, with rationale, evidence, trade-offs and confidence.',
    tiers: ['EX', 'S', 'A', 'B', 'C', 'D'],
    meanings: { EX:'Exceptional', S:'Outstanding', A:'Strong', B:'Good', C:'Situational', D:'Low priority' },
    note: 'AVALON provisional editorial grades, not simulated performance or universal scores. Every grade is scoped to a role, source-linked, and revisable; unreviewed ships remain unevaluated.'
  },
  equipment: {
    title: 'Equipment', icon: '⚙', kind: 'equipment', label: 'AVALON contextual gear assessments', readOnly: true,
    subtitle: 'See which gear AVALON recommends for a target, role and mode, with viable alternatives and source-backed reasoning.',
    tiers: ['EX', 'S', 'A', 'B', 'C', 'D'],
    meanings: { EX:'Exceptional', S:'Outstanding', A:'Strong', B:'Good', C:'Situational', D:'Low priority' },
    note: 'AVALON provisional editorial grades, not numerical DPS or verified best-in-slot claims. Use target armor, ship slots, costs and attack timing before investing.',
  },
  waifu: {
    title: 'Waifu Favorites', icon: '♥', kind: 'ships', label: 'Personal character favorites',
    subtitle: 'Just for fun: an optional, subjective favorites list featuring a limited set of adult-portrayed characters.',
    tiers: ['SSS', 'SS', 'S', 'A', 'B', 'C'],
    meanings: { SSS:'Wife. No further questions.', SS:'Absolute favorite', S:'Elite favorite', A:'Excellent', B:'Appreciated', C:'Not my preference' },
    note: 'Adult-portrayed characters only; childlike and ambiguous portrayals are excluded by default. Eligibility is curated individually, not inferred from ship class.'
  },
  protect: {
    title: 'Must Protect! — Headpats Division', icon: '♡', kind: 'ships', label: 'Wholesome character favorites',
    subtitle: 'Entirely platonic: protective affection, headpats, and wholesome appreciation for the little ones.',
    tiers: ['SSS', 'SS', 'S', 'A', 'B', 'C'],
    meanings: { SSS:'Protect at all costs', SS:'Unlimited headpats', S:'Precious cinnamon roll', A:'Adopt immediately', B:'Little troublemaker', C:'Needs supervision' },
    note: 'Wholesome and non-romantic only. Characters are individually curated; not every destroyer belongs here, and some non-destroyers do.'
  }
});

// A deliberately small manually reviewed list, not a statement about any
// unlisted character's canonical age or suitability. Ambiguous => exclude.
const WAIFU_NAMES = new Set([
  'Musashi', 'New Jersey', 'Bismarck Zwei', 'Enterprise',
  'Belfast', 'Prinz Eugen', 'Friedrich der Große', 'Illustrious',
  'Formidable', 'Taihou', 'Shinano', 'Hood', 'Vittorio Veneto',
  'Kearsarge', 'Saint Louis', 'Ägir', 'Unzen', 'Brest',
  'Atago', 'Akagi', 'Kaga', 'Aquila', 'Cheshire', 'Alsace',
  'Helena', 'Essex', 'Implacable', 'Volga', 'Guam'
].map(v => v.toLocaleLowerCase()));

const PROTECT_NAMES = new Set([
  'Little Bel', 'Little Illustrious', 'Little Enterprise', 'Unicorn',
  'Mutsuki', 'Kisaragi', 'Nagatsuki', 'Fumizuki', 'Little Cheshire',
  'Little Friedrich', 'Little Formidable', 'Little Renown',
  'Little Spee', 'Little Anchorage', 'Little Prinz Eugen',
  'Little Ägir', 'Musashi-chan', 'Shinano-chan', 'Unzen-chan',
  'Taihou-chan', 'Akagi-chan'
].map(v => v.toLocaleLowerCase()));

function safeItemId(value) { return typeof value === 'string' && /^[a-z\d_-]{1,96}$/i.test(value); }
export function eligibleForBoard(boardId, item) {
  if (!item || typeof item.name !== 'string' || !safeItemId(item.id)) return false;
  if (boardId === 'ships' || boardId === 'equipment') return true;
  const name = item.name.trim().toLocaleLowerCase();
  if (boardId === 'waifu') {
    // Explicit defense in depth, even if someone later adds such a name
    // to the curated list by mistake.
    if (/^(little\s)|(?:-chan$)|(?:\bchild\b)/i.test(name)) return false;
    return WAIFU_NAMES.has(name);
  }
  if (boardId === 'protect') return PROTECT_NAMES.has(name);
  return false;
}

export function catalogForBoard(boardId, ships, equipment) {
  const config = TIER_BOARDS[boardId];
  if (!config) return [];
  const list = config.kind === 'equipment' ? equipment : ships;
  const seen = new Set();
  return list.filter(item => {
    if (!eligibleForBoard(boardId, item) || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export function freshTierBoards() {
  return Object.fromEntries(Object.keys(TIER_BOARDS).map(id => [id, {}]));
}

/** Safely restores only known board/tier names and well-formed item IDs. */
export function normalizeTierBoards(raw) {
  const result = freshTierBoards();
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return result;
  for (const [boardId, config] of Object.entries(TIER_BOARDS)) {
    const input = raw[boardId];
    if (!input || typeof input !== 'object' || Array.isArray(input)) continue;
    for (const [id, tier] of Object.entries(input)) {
      if (!config.readOnly && safeItemId(id) && config.tiers.includes(tier)) result[boardId][id] = tier;
    }
  }
  return result;
}

export function moveTierItem(boards, boardId, itemId, tier, eligibleItems) {
  const config = TIER_BOARDS[boardId];
  if (!config || !safeItemId(itemId)) throw new Error('Invalid board or item');
  if (config.readOnly) throw new Error('Combat rankings are published research, not editable personal ratings');
  if (tier !== 'unranked' && !config.tiers.includes(tier)) throw new Error('Unknown tier');
  if (!eligibleItems.some(item => item.id === itemId && eligibleForBoard(boardId, item))) {
    throw new Error('Character or equipment not eligible for this board');
  }
  const next = normalizeTierBoards(boards);
  if (tier === 'unranked') delete next[boardId][itemId];
  else next[boardId][itemId] = tier;
  return next;
}

export function boardAssignmentCount(board, eligibleItems) {
  const available = new Set(eligibleItems.map(item => item.id));
  return Object.keys(board || {}).filter(id => available.has(id)).length;
}