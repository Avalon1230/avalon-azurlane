import test from 'node:test';
import assert from 'node:assert/strict';
import { nationEmblemUrl, nationEmblemMarkup } from '../src/nation-emblems.js';

test('verified nations map to original in-game nationality icon assets',()=>{
  assert.match(nationEmblemUrl('Eagle Union'),/\/nationality\/1\.png$/);
  assert.match(nationEmblemUrl('Sakura Empire'),/\/nationality\/3\.png$/);
  assert.match(nationEmblemUrl('Iris Orthodoxy'),/\/nationality\/8\.png$/);
  assert.match(nationEmblemUrl('Tempesta'),/\/nationality\/96\.png$/);
  assert.match(nationEmblemUrl('META'),/\/nationality\/97\.png$/);
  assert.match(nationEmblemUrl('To LOVE-Ru'),/\/nationality\/100\.png$/);
  assert.equal(nationEmblemUrl('Kingdom of Tulipa'),null);
});
test('nation emblem markup retains text fallback and escapes untrusted names',()=>{
  assert.match(nationEmblemMarkup('Eagle Union'),/nation-emblem-fallback/);
  assert.match(nationEmblemMarkup('Eagle Union'),/class="asset-img nation-emblem-img"/);
  const unknown=nationEmblemMarkup('<script>');
  assert.doesNotMatch(unknown,/<script>/);
  assert.doesNotMatch(unknown,/<img/);
  assert.match(unknown,/nation-emblem-fallback/);
});
