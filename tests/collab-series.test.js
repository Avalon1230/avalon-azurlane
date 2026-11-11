import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { COLLAB_SERIES_LOGOS, collabSeriesLogoUrl, collabSeriesVisual } from '../src/collab-series.js';

test('exact franchise logos are separately attributed and never guessed for unknown series',()=>{
  assert.equal(Object.keys(COLLAB_SERIES_LOGOS).length,7);
  assert.match(collabSeriesLogoUrl('Hololive'),/Hololive_Production_logo\.svg$/);
  assert.match(collabSeriesLogoUrl('NieR:Automata'),/Nier_Automata_Logo\.png$/);
  assert.match(collabSeriesLogoUrl('The Idolmaster'),/The_iDOLM%40STER_logo\.svg$/);
  assert.equal(collabSeriesLogoUrl('Atelier Yumia'),null);
  assert.equal(collabSeriesLogoUrl('<script>'),null);
});
test('franchise card uses original game portrait plus exact franchise mark only if verified',()=>{
  const ship={id:'lyc-60701',sourceId:'60701',name:'Aquila',hull:'CV'};
  const branded=collabSeriesVisual('Hololive',ship);
  assert.match(branded,/asset-collab-ship/);
  assert.match(branded,/collab-series-brand/);
  assert.match(branded,/Hololive_Production_logo\.svg/);
  const unverified=collabSeriesVisual('Atelier Ryza',ship);
  assert.match(unverified,/asset-collab-ship/);
  assert.doesNotMatch(unverified,/collab-series-brand/);
  assert.doesNotMatch(unverified,/nationality\/100\.png/);
});
test('collaboration card remains responsive and does not crop away series labels',()=>{
  const css=readFileSync(new URL('../assets/styles.css',import.meta.url),'utf8');
  assert.match(css,/\.collab-series-grid\{display:grid/);
  assert.match(css,/\.collab-series-copy\{[^}]*min-width:0/);
  assert.match(css,/@media\(max-width:480px\)[^{]*\{[^}]*\.collab-series-grid/);
});
