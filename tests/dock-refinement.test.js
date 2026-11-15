import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderShipRosterTile} from '../src/ship-roster.js';
import {portraitTreatment} from '../src/research-ships.js';

test('dock references do not turn oath or account-state overlays into identity metadata',()=>{
 const tile=renderShipRosterTile({id:'lyc-29901',sourceId:'29901',name:'Neptune',hull:'CL'});
 assert.doesNotMatch(tile,/oath|favorite|fleet-badge|lock-badge|Lv\.125|gem-overlay/);
 assert.equal(portraitTreatment({sourceId:'970101'}),'meta-elite');
 assert.equal(portraitTreatment({sourceId:'970701'}),'meta-super-rare');
});
test('dock CSS keeps the static META shell scoped to verified identity',()=>{
 const css=readFileSync(new URL('../assets/styles.css',import.meta.url),'utf8');
 const dock=css.slice(css.indexOf('/* Dock-reference refinement:'),css.indexOf('/* Keep the compact top/loadout'));
 assert.doesNotMatch(dock,/animation:|@keyframes|repeating-linear-gradient/);
 assert.match(dock,/\.portrait-meta-elite\{--meta-rarity:#e2c6ff/);
 assert.match(dock,/\.portrait-meta-super-rare\{--meta-rarity:#ffe1a1/);
 assert.match(dock,/pointer-events:none/);
});

test('all roster identities keep name, portrait and hull in shared DOM and CSS order',()=>{
 for(const sourceId of ['10706','29901','29904','970101','970701']){
  const tile=renderShipRosterTile({id:'lyc-'+sourceId,sourceId,name:'Long ship name for wrapping',hull:'CL'});
  assert.ok(tile.indexOf('class="ship-roster-name"')<tile.indexOf('class="ship-roster-portrait"'));
  assert.ok(tile.indexOf('class="ship-roster-portrait"')<tile.indexOf('class="ship-roster-footer"'));
 }
 const css=readFileSync(new URL('../assets/styles.css',import.meta.url),'utf8');
 for(const rule of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)){
  if(/ship-roster-(name|portrait)/.test(rule[1]))assert.doesNotMatch(rule[2],/\border\s*:/,'classification must not reorder name or art');
 }
});

test('META palette follows verified source identity despite misleading display names and rarity',()=>{
 assert.equal(portraitTreatment({sourceId:'970101',name:'Hiryuu META',rarity:'Super Rare'}),'meta-elite');
 assert.equal(portraitTreatment({sourceId:'970701',name:'Hunter META',rarity:'Elite'}),'meta-super-rare');
 assert.equal(portraitTreatment({sourceId:'10706',name:'Hunter META',rarity:'Elite'}),'');
});

test('META rarity rules cannot override the shared exterior frame',()=>{
 const css=readFileSync(new URL('../assets/styles.css',import.meta.url),'utf8');
 for(const rule of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)){
  if(/\.portrait-meta-(elite|super-rare)/.test(rule[1])){
   assert.doesNotMatch(rule[2],/--card-(?:edge|light|dark|fill|shape)\s*:/);
  }
 }
});
