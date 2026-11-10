import test from 'node:test';
import assert from 'node:assert/strict';
import { EQUIPMENT_ICON_COUNT, EQUIPMENT_ICON_IDS, EQUIPMENT_ICON_ROOT, verifiedEquipmentIconUrl } from '../src/equipment-assets.js';
import { renderEquipmentRosterTile, sortEquipmentRows } from '../src/equipment-roster.js';

test('all 936 equipment records use explicit original game icon mappings',()=>{
  assert.equal(EQUIPMENT_ICON_COUNT,936);
  assert.equal(Object.keys(EQUIPMENT_ICON_IDS).length,936);
  for(const [id,iconId] of Object.entries(EQUIPMENT_ICON_IDS)){
    assert.match(id,/^\d{2,8}$/);
    assert.match(iconId,/^\d{2,8}$/);
    assert.equal(verifiedEquipmentIconUrl(id),EQUIPMENT_ICON_ROOT+iconId+'.png');
  }
  assert.equal(verifiedEquipmentIconUrl('1020'),EQUIPMENT_ICON_ROOT+'1000.png');
  assert.equal(verifiedEquipmentIconUrl('1140'),EQUIPMENT_ICON_ROOT+'1100.png');
  assert.equal(verifiedEquipmentIconUrl('14480'),EQUIPMENT_ICON_ROOT+'14480.png');
});
test('equipment asset IDs cannot be crafted into unsafe image URLs',()=>{
  for(const id of ['99999999','0','',null,'1020/evil','1020.png','1020?onerror=1','01020','500<script>'])
    assert.equal(verifiedEquipmentIconUrl(id),null);
});
test('equipment roster keeps each source rarity and opens existing inspection viewer',()=>{
  const item={id:'fer-1020',sourceId:'1020',name:'Example equipment',rarity:'Elite',category:'Destroyer Gun'};
  const markup=renderEquipmentRosterTile(item);
  assert.match(markup,/class="equipment-roster-tile rarity-elite"/);
  assert.match(markup,/data-action="equip-details" data-equip="fer-1020"/);
  assert.match(markup,/images\/equipment\/1000\.png/);
  assert.match(markup,/Destroyer Gun/);
  assert.doesNotMatch(markup,/data-action="ship-details"|Inspect gear/);
  const hostile=renderEquipmentRosterTile({...item,name:'<svg onload="alert(1)">',id:'unsafe" onmouseover="alert(1)'});
  assert.doesNotMatch(hostile,/<svg|onmouseover="alert/);
  assert.match(hostile,/&lt;svg/);
});
test('rarity ranks remain sourced and ties are alphabetic',()=>{
  const records=[
    {id:'a',name:'Gamma',rarity:'Elite',category:'Auxiliary'},
    {id:'b',name:'Alpha',rarity:'Ultra Rare',category:'Fighter'},
    {id:'c',name:'Beta',rarity:'Ultra Rare',category:'AA Gun'},
    {id:'d',name:'Omega',rarity:'Unverified',category:'Other'}
  ];
  assert.deepEqual(sortEquipmentRows(records).map(x=>x.id),['b','c','a','d']);
  assert.deepEqual(sortEquipmentRows(records,'name',false).map(x=>x.id),['b','c','a','d']);
  assert.deepEqual(sortEquipmentRows(records,'type',false).map(x=>x.id),['c','a','b','d']);
});
