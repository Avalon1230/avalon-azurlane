import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  EQUIPMENT_DROPS_URL,EQUIPMENT_DROPS_DATE,parseEquipmentDrops,
  loadEquipmentDrops,equipmentAcquisitionFor,renderEquipmentAcquisition
} from '../src/equipment-acquisition.js';

const sample=()=>{
  const rows=Object.fromEntries(Array.from({length:150},(_,i)=>[
    String(1000+i*20),{id:1000+i*20,locations:['T2/T3 Eagle Tech Box'],lab_from:[],lab_to:[]}
  ]));
  rows['44320']={id:44320,locations:['Research (Series 8)'],lab_from:[],lab_to:[]};
  rows['1020']={id:1020,locations:['5-4','9-2'],lab_from:[1020],lab_to:[1040]};
  return rows;
};
const gear=id=>({id:'fer-'+id,source:'fernando',sourceId:String(id),name:'Sample equipment'});

test('acquisition parser uses exact equipment source IDs and preserves multiple documented sources',()=>{
  const index=parseEquipmentDrops(sample());
  assert.equal(index.get('44320').locations[0],'Research (Series 8)');
  assert.equal(index.get('1020').craftable,true);
  assert.deepEqual(equipmentAcquisitionFor(gear('1020'),index).locations,['5-4','9-2']);
  assert.equal(equipmentAcquisitionFor(gear('99999'),index),null);
  assert.equal(equipmentAcquisitionFor({id:'editorial',source:'editorial',sourceId:'1020'},index),null);
});
test('acquisition parser rejects corrupt sources and unsafe values without invented alternatives',()=>{
  assert.throws(()=>parseEquipmentDrops([]),/Unexpected/);
  assert.throws(()=>parseEquipmentDrops({}),/size/);
  const rows=sample();
  rows['44320'].locations=['Research (Series 8)','<img src=x onerror=alert(1)>','Research (Series 8)'];
  rows['1140']={id:1999,locations:['False match'],lab_from:[],lab_to:[]};
  const index=parseEquipmentDrops(rows);
  assert.equal(index.has('1140'),false);
  assert.equal(index.get('44320').locations.length,2);
  const html=renderEquipmentAcquisition(gear('44320'),{status:'ready',index});
  assert.match(html,/Research \(Series 8\)/);
  assert.match(html,/&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.doesNotMatch(html,/<img src=x/);
});
test('equipment inspection distinguishes loading, documented, unknown and source failure states',()=>{
  const index=parseEquipmentDrops(sample());
  const loading=renderEquipmentAcquisition(gear('44320'),{status:'loading'});
  assert.match(loading,/Checking where to get this gear/);
  const found=renderEquipmentAcquisition(gear('44320'),{status:'ready',index});
  assert.match(found,/Where to obtain/);
  assert.match(found,/Research \(Series 8\)/);
  assert.match(found,/May 2, 2026/);
  assert.doesNotMatch(found,/no confirmed location/);
  const recipe=renderEquipmentAcquisition(gear('1020'),{status:'ready',index});
  assert.match(recipe,/Gear Lab: crafting recipe recorded/);
  const unknown=renderEquipmentAcquisition(gear('99999'),{status:'ready',index});
  assert.match(unknown,/It may still be obtainable/);
  const offline=renderEquipmentAcquisition(gear('44320'),{status:'error'});
  assert.match(offline,/data-action="equipment-acquisition-retry"/);
  assert.match(offline,/drop-data source could not load/);
});
test('acquisition fetch is lazy, read-only and points to the fixed source snapshot',async()=>{
  let requested='';
  const fakeFetcher=async url=>{
    requested=url;
    return {ok:true,headers:{get:()=>null},text:async()=>JSON.stringify(sample())};
  };
  const index=await loadEquipmentDrops(fakeFetcher);
  assert.equal(requested,EQUIPMENT_DROPS_URL);
  assert.equal(index.get('44320').locations[0],'Research (Series 8)');
  assert.equal(EQUIPMENT_DROPS_DATE,'May 2, 2026');
});
test('drawer CSS preserves flex children and scrolls stats instead of clipping',()=>{
  const css=readFileSync(new URL('../assets/styles.css',import.meta.url),'utf8');
  assert.match(css,/\.detail-panel>\.detail-scroll\{[^}]*overflow-y:auto/);
  assert.match(css,/\.detail-panel>\.detail-scroll>\*\{flex:0 0 auto\}/);
  assert.match(css,/\.detail-panel \.profile-table\{flex-shrink:0\}/);
  assert.match(css,/\.detail-panel\{[^}]*height:100dvh/);
});
