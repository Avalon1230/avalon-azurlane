import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { nationEmblemUrl, nationEmblemMarkup } from '../src/nation-emblems.js';

test('verified nations map to original in-game nationality icon assets',()=>{
  assert.match(nationEmblemUrl('Eagle Union'),/\/nationality\/1\.png$/);
  assert.match(nationEmblemUrl('Sakura Empire'),/\/nationality\/3\.png$/);
  assert.match(nationEmblemUrl('Iris Orthodoxy'),/\/nationality\/8\.png$/);
  assert.match(nationEmblemUrl('Tempesta'),/\/nationality\/96\.png$/);
  assert.match(nationEmblemUrl('META'),/\/nationality\/97\.png$/);
  assert.match(nationEmblemUrl('To LOVE-Ru'),/\/nationality\/100\.png$/);
  assert.match(nationEmblemUrl('Bulins'),/\/nationality\/0\.png$/);
  assert.match(nationEmblemUrl('Collab'),/\/nationality\/100\.png$/);
  assert.match(nationEmblemUrl('Kingdom of Tulipa'),/\/Nl_1\.png$/);
  assert.match(nationEmblemUrl('Liga de Pedrería'),/\/Ldp_1\.png$/);
});
test('nation emblem markup retains text fallback and escapes untrusted names',()=>{
  assert.match(nationEmblemMarkup('Eagle Union'),/nation-emblem-fallback/);
  assert.match(nationEmblemMarkup('Eagle Union'),/class="asset-img nation-emblem-img"/);
  const unknown=nationEmblemMarkup('<script>');
  assert.doesNotMatch(unknown,/<script>/);
  assert.doesNotMatch(unknown,/<img/);
  assert.match(unknown,/nation-emblem-fallback/);
  assert.match(unknown,/>◇<\/span>/);
  assert.doesNotMatch(nationEmblemMarkup('Eagle Union'),/>EU<\/span>/);
});

test('nation emblem overlays and artwork controls keep the intended contrast',()=>{
  const css=readFileSync(new URL('../assets/styles.css',import.meta.url),'utf8');
  assert.match(css,/\.nation-emblem:has\(> \.nation-emblem-img\) > \.nation-emblem-fallback\{display:none\}/);
  assert.match(css,/\.ship-art-variant\.active\{[^}]*color:white/);
  assert.match(css,/\.ship-art-lightbox:fullscreen\{/);
  assert.match(css,/\.ship-profile-overview \.ship-profile-cover/);
});
