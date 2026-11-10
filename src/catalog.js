/**
 * A small, intentionally UNRANKED fallback index. Additional ship and gear
 * identities are loaded from clearly attributed third-party JSON at runtime. No game art or
 * third-party database content is bundled here. See docs/SOURCES.md.
 */
export const MODES = [
  { id: 'campaign', name: 'Main Campaign', eyebrow: 'PVE · CHAPTERS', icon: '⚓', summary: 'Normal/Hard maps, mob and boss fleets, AA, ASW and stage-specific farming.', metrics: ['Mob + boss', 'Support air', 'Submarines'], fleetTypes: ['mob', 'boss', 'support', 'sub'] },
  { id: 'opsi', name: 'Operation Siren', eyebrow: 'PVE · ENDURANCE', icon: '◈', summary: 'Four-fleet operations, strongholds, Abyssal bosses and Arbiters.', metrics: ['4 surface fleets', 'Boss matchups', 'Sustain'], fleetTypes: ['opsi-a', 'opsi-b', 'opsi-c', 'opsi-d', 'sub'] },
  { id: 'meta', name: 'META Showdown', eyebrow: 'PVE · BOSS', icon: '◎', summary: 'Encounter mechanics, timing, damage windows and survivability.', metrics: ['Boss damage', 'Synchronization', 'Consistency'], fleetTypes: ['meta', 'sub'] },
  { id: 'exercises', name: 'Exercises', eyebrow: 'PVP · COMPETITIVE', icon: '✦', summary: 'Attack and defense lineups, counters, opening pressure and resilience.', metrics: ['Attack', 'Defense', 'Counterplay'], fleetTypes: ['attack', 'defense'] },
  { id: 'events', name: 'Events & Archives', eyebrow: 'PVE · LIMITED', icon: '◇', summary: 'Special map conditions, farming routes, EX battles and reruns.', metrics: ['Event mobs', 'Event bosses', 'Farming'], fleetTypes: ['mob', 'boss', 'sub'] },
  { id: 'challenge', name: 'Challenge Mode', eyebrow: 'PVE · SPECIAL', icon: '△', summary: 'Specialized stage mechanics and score-oriented builds.', metrics: ['Mechanics', 'Survival', 'Score'], fleetTypes: ['challenge', 'sub'] },
  { id: 'daily', name: 'Daily Raids', eyebrow: 'PVE · REPEATABLE', icon: '◉', summary: 'Reliable specialized clears and repeatable content.', metrics: ['Consistency', 'Efficiency'], fleetTypes: ['daily'] },
  { id: 'guild', name: 'Guild Operations', eyebrow: 'PVE · CO-OP', icon: '✧', summary: 'Boss encounters and guild-specific fleet requirements.', metrics: ['Boss pressure', 'Support'], fleetTypes: ['guild-a', 'guild-b'] }
];

export const FLEET_BLUEPRINTS = {
  mob: { name: 'Mob Fleet', type: 'surface', detail: 'Sustained wave clearing' },
  boss: { name: 'Boss Fleet', type: 'surface', detail: 'Reserved for the boss encounter' },
  support: { name: 'Allied Air Support', type: 'support', detail: 'Fighter interception support; campaign-specific' },
  sub: { name: 'Submarine Fleet', type: 'sub', detail: 'Submarine assistance' },
  'opsi-a': { name: 'OpSi Fleet Alpha', type: 'surface', detail: 'Set the purpose to match the operation' },
  'opsi-b': { name: 'OpSi Fleet Bravo', type: 'surface', detail: 'Set the purpose to match the operation' },
  'opsi-c': { name: 'OpSi Fleet Charlie', type: 'surface', detail: 'Set the purpose to match the operation' },
  'opsi-d': { name: 'OpSi Fleet Delta', type: 'surface', detail: 'Set the purpose to match the operation' },
  meta: { name: 'META Boss Fleet', type: 'surface', detail: 'Encounter-specific composition' },
  attack: { name: 'Exercise Attack', type: 'surface', detail: 'Opponent-dependent lineup' },
  defense: { name: 'Exercise Defense', type: 'surface', detail: 'Defensive lineup' },
  challenge: { name: 'Challenge Fleet', type: 'surface', detail: 'Stage-specific composition' },
  daily: { name: 'Daily Raid Fleet', type: 'surface', detail: 'Reliable daily clear' },
  'guild-a': { name: 'Guild Fleet Alpha', type: 'surface', detail: 'Guild boss assignment' },
  'guild-b': { name: 'Guild Fleet Bravo', type: 'surface', detail: 'Secondary guild assignment' }
};

export const SLOT_LAYOUTS = {
  surface: [
    { id: 'main-1', label: 'Flagship', kind: 'main' },
    { id: 'main-2', label: 'Main 2', kind: 'main' },
    { id: 'main-3', label: 'Main 3', kind: 'main' },
    { id: 'vanguard-1', label: 'Tank', kind: 'vanguard' },
    { id: 'vanguard-2', label: 'Vanguard 2', kind: 'vanguard' },
    { id: 'vanguard-3', label: 'Vanguard 3', kind: 'vanguard' }
  ],
  support: [
    { id: 'support-1', label: 'Carrier 1', kind: 'carrier' },
    { id: 'support-2', label: 'Carrier 2', kind: 'carrier' },
    { id: 'support-3', label: 'Carrier 3', kind: 'carrier' }
  ],
  sub: [
    { id: 'sub-1', label: 'Submarine 1', kind: 'sub' },
    { id: 'sub-2', label: 'Submarine 2', kind: 'sub' },
    { id: 'sub-3', label: 'Submarine 3', kind: 'sub' }
  ]
};

// Role hints are working labels for search, not performance scores.
export const SHIPS = [
  { id: 'musashi', name: 'Musashi', hull: 'BB', tags: ['Battleship', 'Barrage'] },
  { id: 'bismarck-zwei', name: 'Bismarck Zwei', hull: 'BB', tags: ['Battleship', 'Boss utility'] },
  { id: 'new-jersey', name: 'New Jersey', hull: 'BB', tags: ['Battleship', 'Damage'] },
  { id: 'alsace', name: 'Alsace', hull: 'BB', tags: ['Battleship', 'Damage'] },
  { id: 'unicorn-retrofit', name: 'Unicorn (Retrofit)', hull: 'CVL', tags: ['Healer', 'Carrier'] },
  { id: 'aquila', name: 'Aquila', hull: 'CV', tags: ['Carrier', 'Heal / damage modes'] },
  { id: 'volga', name: 'Volga', hull: 'CV', tags: ['Carrier', 'Healing'] },
  { id: 'independence-retrofit', name: 'Independence (Retrofit)', hull: 'CVL', tags: ['Carrier', 'Air support'] },
  { id: 'essex', name: 'Essex', hull: 'CV', tags: ['Carrier', 'Air support'] },
  { id: 'implacable', name: 'Implacable', hull: 'CV', tags: ['Carrier', 'Control'] },
  { id: 'max-immelmann', name: 'Max Immelmann', hull: 'CV', tags: ['Carrier', 'Air support'] },
  { id: 'fritz-rumey', name: 'Fritz Rumey', hull: 'CV', tags: ['Carrier', 'Air support'] },
  { id: 'guam', name: 'Guam', hull: 'CB', tags: ['Large cruiser', 'Anti-air'] },
  { id: 'brest', name: 'Brest', hull: 'CB', tags: ['Large cruiser', 'Tank'] },
  { id: 'shimanto', name: 'Shimanto', hull: 'CL', tags: ['Light cruiser', 'Anti-air'] },
  { id: 'san-diego-retrofit', name: 'San Diego (Retrofit)', hull: 'CL', tags: ['Light cruiser', 'Anti-air'] },
  { id: 'helena-retrofit', name: 'Helena (Retrofit)', hull: 'CL', tags: ['Light cruiser', 'Debuff'] },
  { id: 'unzen', name: 'Unzen', hull: 'CA', tags: ['Heavy cruiser', 'Damage'] },
  { id: 'laffey-ii', name: 'Laffey II', hull: 'DD', tags: ['Destroyer', 'Survival / ASW'] },
  { id: 'u-81', name: 'U-81', hull: 'SS', tags: ['Submarine'] },
  { id: 'u-96', name: 'U-96', hull: 'SS', tags: ['Submarine'] },
  { id: 'u-47', name: 'U-47', hull: 'SS', tags: ['Submarine'] },
  { id: 'plymouth', name: 'Plymouth', hull: 'CL', tags: ['Boss support', 'Editorial candidate'] },
  { id: 'agir', name: 'Ägir', hull: 'CB', tags: ['Tank / boss', 'Editorial candidate'] },
  { id: 'anchorage', name: 'Anchorage', hull: 'CA', tags: ['Defensive tank', 'Editorial candidate'] },
  { id: 'vanguard', name: 'Vanguard', hull: 'BB', tags: ['Boss support', 'Editorial candidate'] },
  { id: 'yorktown-ii', name: 'Yorktown II', hull: 'CV', tags: ['Boss aviation', 'Editorial candidate'] },
  { id: 'hakuryuu', name: 'Hakuryuu', hull: 'CV', tags: ['Boss aviation', 'Editorial candidate'] },
  { id: 'cowpens', name: 'Cowpens', hull: 'CVL', tags: ['Chapter 16 sustain', 'Editorial candidate'] },
  { id: 'mecklenburg', name: 'Mecklenburg', hull: 'BB', tags: ['Boss damage', 'Editorial candidate'] },
  { id: 'lion', name: 'Lion', hull: 'BB', tags: ['Boss damage', 'Editorial candidate'] },
  { id: 'admiral-nakhimov', name: 'Admiral Nakhimov', hull: 'CV', tags: ['Boss aviation', 'Editorial candidate'] },
  { id: 'perseus', name: 'Perseus', hull: 'CVL', tags: ['Healing', 'Editorial candidate'] },
  { id: 'cheshire', name: 'Cheshire', hull: 'CA', tags: ['Anti-air tank', 'Editorial candidate'] },
  { id: 'raffaello', name: 'Raffaello', hull: 'BB', tags: ['Wave damage', 'Editorial candidate'] },
  { id: 'sovetsky-soyuz', name: 'Sovetsky Soyuz', hull: 'BB', tags: ['Boss damage', 'Editorial candidate'] },
  { id: 'shimakaze', name: 'Shimakaze', hull: 'DD', tags: ['Vanguard damage', 'Editorial candidate'] },
  { id: 'harbin', name: 'Harbin', hull: 'CL', tags: ['Vanguard damage', 'Editorial candidate'] },
  { id: 'noshiro', name: 'Noshiro', hull: 'CL', tags: ['Vanguard durability', 'Editorial candidate'] }
];

// No stat lines or "best in slot" claims until the wiki/provenance pipeline is validated.
export const EQUIPMENT = [
  { id: 'fw190g3', name: 'Prototype Carrier-Based FW-190 G-3/R1', category: 'Fighter', acquisition: 'Gear Lab', provenance: 'official', summary: 'Interception-oriented fighter. Confirm compatibility and enhancement before use.' },
  { id: 'flapjack', name: 'Vought XF5U Flying Flapjack', category: 'Fighter', acquisition: 'Gear Lab — verify recipe', provenance: 'guide', summary: 'Fighter frequently discussed for interception-oriented setups.' },
  { id: 'wyvern', name: 'Westland Wyvern', category: 'Torpedo Bomber', acquisition: 'Gear Lab — verify recipe', provenance: 'guide', summary: 'Torpedo bomber referenced in endgame equipment discussions.' },
  { id: 'gannet', name: 'Fairey Gannet', category: 'Torpedo Bomber / ASW', acquisition: 'Gear Lab', provenance: 'official', summary: 'Gear Lab equipment; verify anti-submarine role and aircraft-slot compatibility.' },
  { id: 'twin410kai', name: 'Twin 410mm (3rd Year Type) Kai', category: 'Battleship Gun', acquisition: 'Gear Lab', provenance: 'guide', summary: 'Fast-reloading battleship gun discussed for barrage-oriented builds.' },
  { id: 'triple457', name: 'Prototype Triple 457mm Main Gun Mount', category: 'Battleship Gun', acquisition: 'Research / Gear Lab — verify', provenance: 'guide', summary: 'Heavy AP battleship gun; compare reload and enemy armor before crafting.' },
  { id: 'hedgehog', name: 'Hedgehog Anti-Submarine Mortar', category: 'Anti-Submarine', acquisition: 'Check equipment sources in wiki', provenance: 'guide', summary: 'Anti-submarine equipment relevant to submarine-heavy maps.' },
  { id: 'rudder', name: 'Improved Hydraulic Rudder', category: 'Auxiliary', acquisition: 'Research blueprints', provenance: 'guide', summary: 'Defensive auxiliary commonly used on cruisers.' },
  { id: 'sextuplebofors', name: 'Sextuple 40mm Bofors', category: 'Anti-Air', acquisition: 'Check research / Gear Lab sources', provenance: 'guide', summary: 'AA option; judge alongside fleet AA requirements rather than an isolated rating.' },
  { id: 'snorkel', name: 'Improved Snorkel', category: 'Submarine Auxiliary', acquisition: 'Check equipment sources in wiki', provenance: 'guide', summary: 'Submarine oxygen-management equipment.' },
  { id: 'bidder', name: 'Mark 20 (Bidder) Submarine Torpedo', category: 'Submarine Torpedo', acquisition: 'Gear Lab — verify recipe', provenance: 'guide', summary: 'Submarine torpedo option to compare by target and firing behavior.' }
];

export const SOURCES = [
  { id: 'lycoris', name: 'Lycoris-AzurAPI ship index', url: 'https://github.com/iujab/Lycoris-AzurAPI', type: 'Third-party sourced ship identities', note: 'Public game-data extraction. Used for name, hull type, and rarity (not skill-performance evaluation). Read live in browser, not mirrored into repository; source licensed GPL-3.0.' },
  { id: 'fernando', name: 'Fernando2603 equipment data', url: 'https://github.com/Fernando2603/AzurLane', type: 'Third-party sourced equipment records', note: 'Public source for gear identities, categories and enhancement attributes. Licensing and correctness have not been independently audited; data is read from upstream, not bundled.' },
  { id: 'koumakan', name: 'Azur Lane Wiki (Koumakan)', url: 'https://azurlane.koumakan.jp/wiki/Azur_Lane_Wiki', type: 'Primary reference candidate', note: 'Read-only MediaWiki API confirmed at /w/api.php (siteinfo, Musashi/Unicorn metadata, Musashi page wikitext). HTML page requests from GitHub runners returned 403; stale crawler results had unrelated prose. Automated data ingestion awaits structured extraction and rights review.' },
  { id: 'official', name: 'Azur Lane EN Updates', url: 'https://azurlane.yo-star.com/news/author/azur-lane/', type: 'Official update notes', note: 'Use for patch and equipment release corroboration; pages may change.' },
  { id: 'fanwiki', name: 'Azur Lane Fan Wiki', url: 'https://azur-lane.wiki/index.php/Main_Page', type: 'Secondary reference', note: 'A separate fan-maintained wiki; not a mirror or substitute for permission to copy Koumakan data.' },
  { id: 'ectl', name: 'Historical ECTL', url: 'https://slaimuda.github.io/ectl/#/home', type: 'Historical analysis', note: 'Independent reference only. No affiliation or inherited tier placements.' },
  { id: 'regal', name: 'REGAL', url: 'https://azur-lane-regal.suchiguma.com/', type: 'Endgame evaluations', note: 'Community judgments, not objective game data.' },
  { id: 'chapter15', name: 'Chapter 15 Guide', url: 'https://suchiguma.github.io/guides/chapter-15/', type: 'Example scenario guide', note: 'One chapter-specific reference, not the scope of AVALON.' }
];