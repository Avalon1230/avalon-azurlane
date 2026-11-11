import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderTierView} from '../src/tier-view.js';
import {renderAssessmentBoard} from '../src/assessment-view.js';

const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../assets/styles.css',import.meta.url),'utf8');

test('exactly four provisional feature links are labeled WIP; ship browsing stays available',()=>{
  for(const label of ['Equipment','Augments','Fleet Lab','Tier Boards'])
    assert.match(app,new RegExp("label: '"+label+"', wip: true"));
  for(const label of ['Overview','Game Modes','Ship Index','Sources','Updates'])
    assert.doesNotMatch(app,new RegExp("label: '"+label+"', wip: true"));
  assert.match(app,/p\.wip\?'<small class="nav-wip-label">WIP<\/small>'/);
  assert.match(app,/class="page-wip-label">WIP<\/span>/);
});
test('WIP labels do not disable manual catalogs or hide original combat assessments',()=>{
  assert.match(app,/renderCatalogIndex\(\{kind:'equipment'/);
  assert.match(app,/renderAugmentIndex\(\{records:AUGMENT_CATALOG/);
  assert.match(app,/renderSuggestedFleet\(\{mode,ships:SHIPS/);
  assert.match(app,/Equipment browsing works/);
  const combat=renderAssessmentBoard({boardId:'ships',ships:[],equipment:[]});
  assert.match(combat,/page-wip-label">WIP/);
  assert.match(combat,/Game-mode recommendations/);
  const personal=renderTierView({boardId:'waifu',boards:{},ships:[],equipment:[]});
  assert.match(personal,/page-wip-label">WIP/);
  assert.match(personal,/Choose your tier list/);
});
test('compact feature labels retain readable mobile navigation without colored banners',()=>{
  assert.match(css,/\.nav-wip-label\{[^}]*font-size:8px/);
  assert.match(css,/\.page-wip-label\{[^}]*white-space:nowrap/);
  assert.doesNotMatch(css,/\.nav-wip-label\{[^}]*background:red/);
});
