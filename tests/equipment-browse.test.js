import test from 'node:test';
import assert from 'node:assert/strict';
import {
  EQUIPMENT_BROAD_TYPES,equipmentBroadType,matchesEquipmentBroadType,
  equipmentFamilyKey,equipmentFamilyMembers,equipmentDisplayUnits,groupedEquipmentUnits
} from '../src/equipment-browse.js';

const gear=(id,name,category,rarity='Rare',nation='Eagle Union',typeCode=1)=>({
  id:'fer-'+id,sourceId:String(id),name,category,rarity,nation,typeCode,
  source:'fernando',verified:'sourced'
});

test('broad category navigation is sourced from equipment types, including special cases',()=>{
  const types={
    guns:[1,2,3,4,11],torpedoes:[5,13],aircraft:[7,8,9,12],
    aa:[6,21],auxiliary:[10,18],asw:[14,15,17],special:[20]
  };
  assert.equal(EQUIPMENT_BROAD_TYPES[0].id,'all');
  for(const [name,codes] of Object.entries(types))for(const typeCode of codes){
    assert.equal(equipmentBroadType({typeCode}),name,String(typeCode)+' should be '+name);
  }
  assert.equal(equipmentBroadType({category:'Dive Bomber'}),'aircraft');
  assert.equal(matchesEquipmentBroadType({category:'Anti-Air Gun'},'aa'),true);
  assert.equal(matchesEquipmentBroadType({category:'Fighter'},'guns'),false);
  assert.equal(matchesEquipmentBroadType({category:'Fighter'},'all'),true);
  assert.equal(equipmentBroadType({category:'Unknown experimental class'}),'special');
});
test('only exact sourced name, type, and nation may form a family',()=>{
  const a=gear(1000,' Twin 127mm Gun ','Destroyer Gun','Super Rare');
  const b=gear(1020,'Twin 127mm  Gun','Destroyer Gun','Elite');
  const sameIconDifferentWeapon=gear(1040,'Alternative Gun','Destroyer Gun','Elite');
  const anotherNation=gear(1060,'Twin 127mm Gun','Destroyer Gun','Rare','Sakura Empire');
  const anotherCategory=gear(1080,'Twin 127mm Gun','Battleship Gun','Ultra Rare','Eagle Union',4);
  const editorial={...gear(1100,'Twin 127mm Gun','Destroyer Gun','Rare'),id:'ed-1100',source:'editorial'};
  assert.equal(equipmentFamilyKey(a),equipmentFamilyKey(b));
  assert.notEqual(equipmentFamilyKey(a),equipmentFamilyKey(sameIconDifferentWeapon));
  assert.notEqual(equipmentFamilyKey(a),equipmentFamilyKey(anotherNation));
  assert.notEqual(equipmentFamilyKey(a),equipmentFamilyKey(anotherCategory));
  assert.equal(equipmentFamilyKey(editorial),null);
  const items=[a,b,sameIconDifferentWeapon,anotherNation,anotherCategory,editorial];
  assert.deepEqual(equipmentFamilyMembers(items,'fer-1000').map(x=>x.id),['fer-1000','fer-1020']);
  assert.deepEqual(equipmentFamilyMembers(items,'ed-1100'),[]);
  const groups=equipmentDisplayUnits(items,{families:true});
  assert.equal(groups.length,5);
  const family=groups.find(x=>x.kind==='family');
  assert.deepEqual(family.members.map(x=>x.id),['fer-1000','fer-1020']);
  assert.equal(groups.filter(x=>x.kind==='family').length,1);
});
test('sorting is global when not grouped and local only when a group is selected',()=>{
  const records=[
    gear(1000,'DD Elite','Destroyer Gun','Elite'),
    gear(1020,'Fighter UR','Fighter','Ultra Rare','Royal Navy',7),
    gear(1040,'DD Rare','Destroyer Gun','Rare'),
    gear(1060,'Fighter SR','Fighter','Super Rare','Royal Navy',7)
  ];
  const all=groupedEquipmentUnits(records,{group:'none'});
  assert.equal(all.length,1);
  assert.deepEqual(all[0].items.map(x=>x.item.name),
    ['Fighter UR','Fighter SR','DD Elite','DD Rare']);
  const byType=groupedEquipmentUnits(records,{group:'type'});
  assert.deepEqual(byType.map(x=>x.label),['Destroyer Gun','Fighter']);
  assert.deepEqual(byType[0].items.map(x=>x.item.name),['DD Elite','DD Rare']);
  const byRarity=groupedEquipmentUnits(records,{group:'rarity'});
  assert.deepEqual(byRarity.map(x=>x.label),['Ultra Rare','Super Rare','Elite','Rare']);
  const byNation=groupedEquipmentUnits(records,{group:'nation'});
  assert.deepEqual(byNation.map(x=>x.label),['Eagle Union','Royal Navy']);
});
