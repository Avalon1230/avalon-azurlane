import test from 'node:test';
import assert from 'node:assert/strict';
import { renderTierView } from '../src/tier-view.js';
import { freshTierBoards } from '../src/tiers.js';
const ships = [{id:'musashi',name:'Musashi',hull:'BB'}, {id:'little-bel',name:'Little Bel',hull:'CL'}, {id:'unreviewed',name:'Someone else',hull:'DD'}];
test('renders all four tier-board categories and drop zones', () => {
  const html=renderTierView({boards:freshTierBoards(),ships});
  assert.match(html,/data-board="waifu"/);
  assert.match(html,/data-board="protect"/);
  assert.match(html,/data-tier-drop="EX"/);
  assert.match(html,/data-tier-drop="unranked"/);
});
test('waifu board excludes childlike and ambiguous character records', () => {
  const html=renderTierView({boardId:'waifu',boards:freshTierBoards(),ships});
  assert.match(html,/Musashi/);
  assert.doesNotMatch(html,/Little Bel/);
  assert.doesNotMatch(html,/Someone else/);
  assert.match(html,/adult-portrayed/);
});
test('Must Protect board is wholly platonic with individual curation', () => {
  const html=renderTierView({boardId:'protect',boards:freshTierBoards(),ships});
  assert.match(html,/Little Bel/);
  assert.doesNotMatch(html,/data-tier-item="musashi"/);
  assert.match(html,/platonic/);
});
test('escapes malicious untrusted source names in HTML and attrs', () => {
  const html=renderTierView({boardId:'ships',boards:freshTierBoards(),ships:[{id:'safe-id',name:'<img src=x onerror=alert(1)>',hull:'BB'}]});
  assert.doesNotMatch(html,/<img src=x/);
  assert.match(html,/&lt;img src=x/);
});
test('assigned tiles appear in correct lane and are omitted from unranked candidates', () => {
  const boards=freshTierBoards(); boards.ships.musashi='EX';
  const html=renderTierView({boardId:'ships',boards,ships});
  const ex=html.match(/data-tier-drop="EX"[^]*?<\/section>/)?.[0];
  assert.match(ex, /Musashi/);
  const pool=html.match(/class="tier-pool"[^]*$/)?.[0];
  assert.doesNotMatch(pool, /data-tier-item="musashi"/);
});