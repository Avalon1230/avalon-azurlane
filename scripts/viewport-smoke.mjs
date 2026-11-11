import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chromium} from 'playwright';
import {renderShipProfile} from '../src/ship-profiles.js';
import {renderEquipmentIndex} from '../src/equipment-index.js';
import {renderLoadoutAlternatives} from '../src/loadout-view.js';
import {renderAugmentIndex} from '../src/augment-index.js';
import {allAugmentRecords} from '../src/augment-manifest.js';

const css=readFileSync(new URL('../assets/styles.css',import.meta.url),'utf8');
const ship={id:'lyc-60701',sourceId:'60701',name:'Aquila',hull:'CV',nation:'Sardegna Empire',rarity:'Super Rare'};
const item=(n,category='Auxiliary',typeCode=10)=>({
  id:'fer-'+n,sourceId:String(n),source:'fernando',name:'Equipment Candidate '+n,
  rarity:'Super Rare',category,typeCode,forbiddenHullIds:[]
});
const options=Array.from({length:152},(_,i)=>item(9000+i));
const slots=[
  {index:0,kind:'weapon',type:'Fighter',categories:['Fighter'],source:'Koumakan Wiki',verified:true,
    candidates:[item(1000,'Fighter',7)],selected:item(1000,'Fighter',7),manual:false,explanation:'Category match'},
  {index:1,kind:'weapon',type:'Fighters / Dive Bombers',categories:['Fighter','Dive Bomber'],source:'Koumakan Wiki',verified:true,
    candidates:[item(1001,'Fighter',7),item(1002,'Dive Bomber',9)],selected:item(1002,'Dive Bomber',9),
    manual:false,explanation:'Category match'},
  {index:2,kind:'weapon',type:'Torpedo Bomber',categories:['Torpedo Bomber'],source:'Koumakan Wiki',verified:true,
    candidates:[item(1003,'Torpedo Bomber',8)],selected:item(1003,'Torpedo Bomber',8),manual:false,explanation:'Category match'},
  ...[3,4].map(i=>({index:i,kind:'auxiliary',type:'Auxiliary',categories:['Auxiliary'],source:'AzurLaneData · May 2026',verified:true,
    candidates:options,selected:options[i-3],manual:false,explanation:'Source compatible only'})),
  {index:5,kind:'augment',type:'Augment',categories:[],source:'Augment class eligibility only',verified:false,
    provisional:true,candidates:[],selected:null,manual:false,explanation:'Unverified augment'}
];
const loadout={sourceId:'60701',mode:'general',description:'General',slots};
const details={id:'60701',names:{en:'Aquila'},class:'Aircraft carrier',hullType:'Carrier',
  rarity:'Super Rare',stats:{level120:{health:5000,aviation:400}},skills:[],
  slots:[{type:'Fighter'},{type:'Artillery (Destroyer)'},{type:'Torpedo Bomber'}]};
const profile=renderShipProfile({ship,data:details,loadoutModel:loadout,artworkSkins:[]});
const equipment=renderEquipmentIndex({records:options.slice(0,32),advancedOpen:true,renderCard:
  row=>'<article class="equipment-roster-tile"><strong>'+row.name+'</strong></article>'});
const alternatives=renderLoadoutAlternatives(loadout,3);
const augments=renderAugmentIndex({records:allAugmentRecords()});
function shell(content){
  return '<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width,initial-scale=1">'+
    '<style>'+css+'</style></head><body><div class="app-shell">'+
    '<aside class="sidebar"><a class="brand" href="#"><span class="brand-symbol">A</span><span class="brand-copy"><strong>AVALON</strong><small>AZUR LANE INTELLIGENCE</small></span></a>'+
    '<nav class="side-nav"><button class="nav-item">Ship Index</button><button class="nav-item">Equipment</button><button class="nav-item">Fleet Lab</button></nav></aside>'+
    '<div class="workspace"><header class="topbar"><div class="breadcrumb"><span>PROJECT AVALON</span><strong>Ship Index</strong></div></header>'+
    '<main id="app-content" class="page">'+content+'</main></div></div></body></html>';
}
const browser=await chromium.launch({headless:true,channel:'chrome'});
try{
  for(const width of [360,390,768,1024,1280]){
    const page=await browser.newPage({viewport:{width,height:800},deviceScaleFactor:1});
    await page.route(/^https?:\/\//,route=>route.abort());
    for(const [label,markup,selectors] of [
      ['ship profile',profile,['.ship-profile-overview','.loadout-tile-more','.ship-art-preview','.ship-profile-nav']],
      ['equipment index',equipment,['#catalog-search','.equipment-advanced-toggle','.equipment-category-tab','#equipment-hull-select']],
      ['augment directory',augments,['#augment-search','#augment-type-filter','.augment-tile','.augment-load-more']],
      ['slot alternatives',profile+alternatives,['#loadout-choice-search','.loadout-more-choices','.loadout-choice-inspect','.picker-footer button']]
    ]){
      await page.setContent(shell(markup),{waitUntil:'domcontentloaded'});
      const measurements=await page.evaluate(selectors=>{
        const viewport=document.documentElement.clientWidth;
        const doc=document.documentElement.scrollWidth;
        const controls=selectors.map(selector=>{
          const el=document.querySelector(selector);
          if(!el)return {selector,missing:true};
          const r=el.getBoundingClientRect();
          return {selector,left:r.left,right:r.right,width:r.width};
        });
        return {viewport,doc,controls};
      },selectors);
      assert.ok(measurements.doc<=measurements.viewport+1,
        width+'px '+label+' horizontal overflow: '+JSON.stringify(measurements));
      for(const c of measurements.controls){
        assert.ok(!c.missing && c.width>0 && c.right>0 && c.left<width && c.right<=width+1,
          width+'px '+label+' unreachable '+JSON.stringify(c));
      }
      console.log('PASS '+width+'px '+label+' document width '+measurements.doc);
    }
    await page.close();
  }
}finally{
  await browser.close();
}
