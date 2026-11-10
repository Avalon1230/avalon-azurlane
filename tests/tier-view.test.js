import test from 'node:test';
import assert from 'node:assert/strict';
import { renderTierView } from '../src/tier-view.js';
import { freshTierBoards } from '../src/tiers.js';
const ships = [{id:'musashi',name:'Musashi',hull:'BB'}, {id:'little-bel',name:'Little Bel',hull:'CL'}, {id:'unreviewed',name:'Someone else',hull:'DD'}];
test('combat boards show researched recommendations, without interactive personal tier assignments', () => {
  const html=renderTierView({boards:freshTierBoards(),ships,query:'Musashi'});
  assert.match(html,/data-board="waifu"/);
  assert.match(html,/data-board="protect"/);
  assert.match(html,/Musashi/);
  assert.match(html,/REGAL/);
  assert.doesNotMatch(html,/data-tier-drop="EX"/);
  assert.doesNotMatch(html,/data-tier-assign=/);
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
test('character board escapes malicious untrusted source names', () => {
  const html=renderTierView({boardId:'waifu',boards:freshTierBoards(),ships:[
    {id:'musashi',name:'Musashi',hull:'BB'},
    {id:'fake',name:'<img src=x onerror=alert(1)>',hull:'DD'}
  ]});
  assert.doesNotMatch(html,/<img src=x/);
  assert.doesNotMatch(html,/data-tier-item="fake"/);
});
test('personal character tiles can be moved and are not duplicated', () => {
  const boards=freshTierBoards(); boards.waifu.musashi='SSS';
  const html=renderTierView({boardId:'waifu',boards,ships});
  const sss=html.match(/data-tier-drop="SSS"[^]*?<\/section>/)?.[0];
  assert.match(sss,/Musashi/);
  const pool=html.match(/class="tier-pool"[^]*$/)?.[0];
  assert.doesNotMatch(pool,/data-tier-item="musashi"/);
});
test('equipment board cites expert recommendations without asking player to assign tiers', () => {
  const html=renderTierView({boardId:'equipment',boards:freshTierBoards(),equipment:[]});
  assert.match(html,/La-9/);
  assert.match(html,/Suchiguma/);
  assert.doesNotMatch(html,/data-tier-assign=/);
});