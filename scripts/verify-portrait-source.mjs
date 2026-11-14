import assert from 'node:assert/strict';
import {META_PORTRAIT_SOURCE as source,META_PORTRAIT_RARITIES as rarities} from '../src/portrait-rarity.js';
import {SHIP_NATION_BY_SOURCE_ID as nations} from '../src/catalog-filters.js';

const response=await fetch(`https://raw.githubusercontent.com/iujab/Lycoris-AzurAPI/${source.commit}/${source.path}`,{signal:AbortSignal.timeout(30000)});
assert.ok(response.ok,`Portrait rarity source HTTP ${response.status}`);
const rows=await response.json();
const expected=Object.fromEntries(rows.filter(row=>nations[row.id]==='META').map(row=>[row.id,row.rarity]));
assert.deepEqual(rarities,expected,'META rarities must match exact pinned ship IDs');
assert.equal(rarities['970101'],'Elite');
assert.equal(rarities['970701'],'Super Rare');
console.log(`PASS ${Object.keys(rarities).length} source-ID META rarities at ${source.commit}`);
