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
 assert.match(dock,/\.portrait-meta-elite\{--meta-rarity:#d6b4ed/);
 assert.match(dock,/\.portrait-meta-super-rare\{--meta-rarity:#f0d38e/);
 assert.match(dock,/pointer-events:none/);
});
