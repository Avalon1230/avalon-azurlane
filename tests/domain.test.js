import test from 'node:test';
import assert from 'node:assert/strict';
import { MODES, SHIPS } from '../src/catalog.js';
import { createWorkspace, compatible, assignShip, normalizeWorkspace, countAssigned, findFirstVacancy, escapeHtml, wikiLookupUrl, searchCatalog } from '../src/domain.js';

test('every mode has a valid initial fleet blueprint', () => {
  for (const mode of MODES) {
    const plan = createWorkspace(mode.id);
    assert.equal(Object.keys(plan.fleets).length, mode.fleetTypes.length);
    assert.equal(countAssigned(plan), 0);
  }
});

test('OpSi has four distinct surface fleets', () => {
  const plan = createWorkspace('opsi');
  assert.deepEqual(Object.keys(plan.fleets).filter(id => id.startsWith('opsi-')), ['opsi-a','opsi-b','opsi-c','opsi-d']);
});

test('ship classes obey fleet slot rules', () => {
  const byName = name => SHIPS.find(x => x.name === name);
  assert.ok(compatible(byName('Musashi'), 'main'));
  assert.ok(!compatible(byName('Musashi'), 'vanguard'));
  assert.ok(compatible(byName('Laffey II'), 'vanguard'));
  assert.ok(compatible(byName('U-81'), 'sub'));
  assert.ok(!compatible(byName('U-81'), 'carrier'));
});

test('assign, remove, reject duplicates and incompatible hulls', () => {
  const initial = createWorkspace('campaign');
  const withMusashi = assignShip(initial, 'mob', 'main-1', 'musashi');
  assert.equal(withMusashi.fleets.mob['main-1'], 'musashi');
  assert.equal(initial.fleets.mob['main-1'], null);
  assert.throws(() => assignShip(withMusashi, 'boss', 'main-1', 'musashi'), /already assigned/);
  assert.throws(() => assignShip(withMusashi, 'mob', 'main-2', 'guam'), /incompatible/);
  assert.equal(assignShip(withMusashi, 'mob', 'main-1', null).fleets.mob['main-1'], null);
});

test('normalize treats saved plans as untrusted and removes invalid data', () => {
  const input = createWorkspace('campaign');
  input.fleets.mob['main-1'] = 'musashi';
  input.fleets.boss['main-1'] = 'musashi';
  input.fleets.mob['vanguard-1'] = 'u-81';
  input.fleets.mob.evil = 'guam';
  const restored = normalizeWorkspace(input, 'campaign');
  assert.equal(restored.fleets.mob['main-1'], 'musashi');
  assert.equal(restored.fleets.boss['main-1'], null);
  assert.equal(restored.fleets.mob['vanguard-1'], null);
  assert.equal(restored.fleets.mob.evil, undefined);
});

test('find vacancy matches slot kind', () => {
  const initial = createWorkspace('campaign');
  assert.deepEqual(findFirstVacancy(initial, SHIPS.find(s => s.id === 'guam')), { fleetId: 'mob', slotId: 'vanguard-1' });
});

test('search is case insensitive and URLs/HTML are safely encoded', () => {
  assert.equal(searchCatalog(SHIPS, 'lAFfEy', ['name']).length, 1);
  assert.match(wikiLookupUrl('Twin 410mm (3rd Year Type) Kai'), /Twin%20410mm/);
  assert.equal(escapeHtml('<script>"a&b"</script>'), '&lt;script&gt;&quot;a&amp;b&quot;&lt;/script&gt;');
});