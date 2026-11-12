import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chromium} from 'playwright';
import {renderShipProfile} from '../src/ship-profiles.js';
import {renderEquipmentIndex} from '../src/equipment-index.js';
import {renderCatalogIndex} from '../src/catalog-index.js';
import {renderLoadoutAlternatives} from '../src/loadout-view.js';
import {renderAugmentIndex} from '../src/augment-index.js';
import {allAugmentRecords} from '../src/augment-manifest.js';
import {combatModel} from '../tests/helpers/combat-fixture.js';

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
const collabSource=[
  {id:'lyc-50101',sourceId:'50101',name:'Kizuna AI',nation:'KizunaAI',hull:'DD',rarity:'Elite'},
  {id:'lyc-50201',sourceId:'50201',name:'Hololive Guest',nation:'Hololive',hull:'CV',rarity:'Super Rare'},
  {id:'lyc-50301',sourceId:'50301',name:'Ryza',nation:'Atelier Ryza',hull:'CL',rarity:'Super Rare'},
  {id:'lyc-50302',sourceId:'50302',name:'Klaudia',nation:'Atelier Ryza',hull:'CVL',rarity:'Super Rare'}
];
const collabLanding=renderCatalogIndex({kind:'ships',records:collabSource,nation:'Collab',
  renderCard:row=>'<article class="catalog-card">'+row.name+'</article>'});
const collabRoster=renderCatalogIndex({kind:'ships',records:collabSource,nation:'Collab',collabSeries:'Atelier Ryza',
  renderCard:row=>'<article class="catalog-card">'+row.name+'</article>'});
const alternatives=renderLoadoutAlternatives(loadout,3);
const augments=renderAugmentIndex({records:allAugmentRecords()});
const reviewedFighter={...item(85600,'Fighter',7),
  name:'Prototype Carrier-Based La-9',rarity:'Ultra Rare',enhancement:'+13',stats:{hit:12}};
const budgetFighter={...item(47160,'Fighter',7),
  name:'Prototype BF-109G',rarity:'Super Rare',enhancement:'+13',stats:{hit:8}};
const evidenceSlot={
  index:1,kind:'weapon',type:'Fighter / Dive Bomber',
  categories:['Fighter','Dive Bomber'],source:'Koumakan Wiki',verified:true,provisional:false,
  selected:reviewedFighter,manual:false,candidates:[reviewedFighter,budgetFighter],
  explanation:'Only a compatible source candidate'
};
const researchedEvidence=renderLoadoutAlternatives({
  sourceId:'60701',mode:'boss',description:'Boss',slots:[evidenceSlot]},1);
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
  for(const width of [360,390,560,768,1024,1280,1640]){
    const page=await browser.newPage({viewport:{width,height:800},deviceScaleFactor:1});
    await page.route(/^https?:\/\//,route=>route.abort());
    for(const [label,markup,selectors] of [
      ['combat guns',profile+renderLoadoutAlternatives(combatModel('40303'),0),['.combat-comparison','#combat-armor','#combat-reload','.combat-evidence']],
      ['combat aircraft',profile+renderLoadoutAlternatives(combatModel('60701'),1),['.combat-comparison','#combat-wing','#combat-movement','.combat-evidence']],
      ['ship profile',profile,['.ship-profile-overview','.loadout-tile-more','.ship-art-preview','.ship-profile-nav','#ship-loadout-title','.loadout-status-wip','.loadout-wip-note']],
      ['equipment index',equipment,['#catalog-search','.equipment-advanced-toggle','.equipment-category-tab','#equipment-hull-select']],
      ['augment directory',augments,['#augment-search','#augment-type-filter','#augment-rarity-filter','[data-action="augment-clear-filters"]','.augment-tile','.augment-load-more']],
      ['collaboration series directory',collabLanding,['.collab-landing','.collab-series-grid','.collab-series-card','.collab-series-copy','#catalog-search']],
      ['collaboration series roster',collabRoster,['.catalog-roster-label','.catalog-grid','.catalog-result-bar']],
      ['slot alternatives',profile+alternatives,['#loadout-choice-search','.loadout-more-choices','.loadout-choice-inspect','.picker-footer button']],
      ['researched gear evidence',profile+researchedEvidence,['.loadout-picker-current','.loadout-picker-research','.loadout-options-heading','.picker-footer button']]
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
        const overflowing=[...document.querySelectorAll('body *')]
          .map(el=>({el,rect:el.getBoundingClientRect()}))
          .filter(({rect})=>rect.right>viewport+1||rect.left< -1)
          .slice(0,12).map(({el,rect})=>({tag:el.tagName,cls:el.className?.toString().slice(0,70),
            left:Math.round(rect.left*10)/10,right:Math.round(rect.right*10)/10,scrollWidth:el.scrollWidth}));
        return {viewport,doc,controls,overflowing};
      },selectors);
      assert.ok(measurements.doc<=measurements.viewport+1,
        width+'px '+label+' horizontal overflow: '+JSON.stringify(measurements));
      for(const c of measurements.controls){
        assert.ok(!c.missing && c.width>0 && c.right>0 && c.left<width && c.right<=width+1,
          width+'px '+label+' unreachable '+JSON.stringify(c));
      }
      if(label==='augment directory'){
        const facetBoxes=await page.evaluate(()=>{
          const ids=['#augment-type-filter','#augment-rarity-filter'];
          return ids.map(id=>{
            const el=document.querySelector(id);
            const box=el?.getBoundingClientRect();
            return {id,left:box?.left,right:box?.right,top:box?.top,bottom:box?.bottom};
          });
        });
        const [a,b]=facetBoxes;
        assert.ok(a.right<=b.left+1 || a.bottom<=b.top+1,
          width+'px augment facet controls collide: '+JSON.stringify(facetBoxes));
      }
      console.log('PASS '+width+'px '+label+' document width '+measurements.doc);
    }
    await page.close();
  }
}finally{
  await browser.close();
}

