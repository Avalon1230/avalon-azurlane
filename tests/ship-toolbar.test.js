import test from 'node:test';
import assert from 'node:assert/strict';
import { renderShipFilterToolbar } from '../src/ship-toolbar.js';

const ship=(id,name,hull,rarity)=>({id:String(id),name,hull,rarity});
const rows=[
  ship(1,'Guam','CB','Ultra Rare'),
  ship(2,'Enterprise','CV','Super Rare'),
  ship(3,'Laffey','DD','Elite')
];
test('ship toolbar reduces always-visible controls without losing hull or rarity options',()=>{
  const html=renderShipFilterToolbar({rows});
  assert.match(html,/equipment-compact-toolbar ship-compact-toolbar/);
  assert.match(html,/id="catalog-search"/);
  assert.match(html,/data-action="ship-toggle-filters" aria-expanded="false"/);
  assert.match(html,/id="ship-advanced-filters"[^>]* hidden/);
  assert.match(html,/id="ship-hull-select"/);
  assert.match(html,/id="ship-rarity-select"/);
  assert.match(html,/<option value="CB">CB<\/option>/);
  assert.match(html,/<option value="CV">CV<\/option>/);
  assert.match(html,/<option value="DD">DD<\/option>/);
  assert.match(html,/data-action="ship-hull-filter" data-hull="Vanguard"/);
  assert.match(html,/data-action="ship-hull-filter" data-hull="Main"/);
  assert.match(html,/data-action="ship-hull-filter" data-hull="Sub"/);
  assert.match(html,/id="ship-sort-select"/);
  assert.match(html,/<option value="rarity" selected>Rarity<\/option>/);
  assert.match(html,/data-action="ship-sort-direction"/);
  assert.doesNotMatch(html,/ship-filter-row|data-action="ship-rarity-filter"/);
});
test('selected ship hull and rarity are visible, removable and saved in controls',()=>{
  const html=renderShipFilterToolbar({rows,hull:'CB',rarity:'Ultra Rare',sort:'name',descending:false,open:true});
  assert.match(html,/aria-expanded="true"/);
  assert.doesNotMatch(html,/id="ship-advanced-filters"[^>]* hidden/);
  assert.match(html,/<option value="CB" selected>CB<\/option>/);
  assert.match(html,/<option value="Ultra Rare" selected>Ultra Rare<\/option>/);
  assert.match(html,/<option value="name" selected>Name<\/option>/);
  assert.match(html,/↑ Ascending/);
  assert.match(html,/equipment-filter-count">2/);
  assert.match(html,/data-action="ship-clear-filter" data-field="hull"/);
  assert.match(html,/data-action="ship-clear-filter" data-field="rarity"/);
  assert.match(html,/data-action="ship-reset-filters"/);
});
test('ship search and filter labels are escaped rather than inserted as HTML',()=>{
  const html=renderShipFilterToolbar({rows,query:'" autofocus onfocus="alert(1)'});
  assert.match(html,/&quot; autofocus onfocus=&quot;/);
  assert.doesNotMatch(html,/value="" autofocus/);
});
