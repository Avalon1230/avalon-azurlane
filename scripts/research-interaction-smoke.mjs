// Real application handlers; isolated catalog fixtures do not validate game performance.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFileSync,mkdirSync} from 'node:fs';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
import {RESEARCH_MANIFEST} from '../src/research-manifest.js';
import {COMBAT_DATA} from '../src/combat-data.js';
const root=fileURLToPath(new URL('..',import.meta.url)).replace(/[\\/]$/,'');
const server=createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(root+sep)){res.writeHead(403).end();return;}
 try{res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.html':'text/html','.json':'application/json'})[extname(file)]||'text/plain');res.end(readFileSync(file));}catch{res.writeHead(404).end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;
const ships=Object.values(RESEARCH_MANIFEST.records).map(r=>({id:r.id,name:r.name,hullType:r.id==='99901'?'Battleship':'Light Cruiser',nationality:'Royal Navy',rarity:r.classification==='DR'?'Decisive':'Priority'}));
ships.push(...Array.from({length:100},(_,i)=>({id:String(10000+i),name:'Fixture '+i,hullType:'Destroyer',nationality:'Eagle Union',rarity:'Rare'})));
const details=Object.fromEntries(ships.map(s=>[s.id,{id:s.id,names:{en:s.name},nationality:s.nationality,hullType:s.hullType,rarity:s.rarity,slots:[],skills:[],stats:{level120:{health:100}},obtainedFrom:{obtainedFrom:'Research and Development'}}]));
const equipment=Object.fromEntries(Array.from({length:110},(_,i)=>[String(99000+i),{name:'Fixture auxiliary '+i,type:10,rarity:3,stats:{},ship_type_forbidden:[]}]));
for(const item of Object.values(COMBAT_DATA.equipment))equipment[item.id]={name:item.name,type:item.type,rarity:item.rarity,stats:{},ship_type_forbidden:item.hull_restriction};
const saved={'99901':{general:{0:'fer-24140'}}};
mkdirSync('.audit/research-screens',{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'});
try{
 for(const width of [360,390,768,1280]){
  const page=await browser.newPage({viewport:{width,height:800}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(value=>{if(!localStorage.getItem('avalon.azurlane.loadouts.v1'))localStorage.setItem('avalon.azurlane.loadouts.v1',JSON.stringify(value));},saved);
  await page.route(/^https?:\/\//,route=>{const u=route.request().url();if(u.startsWith(url))return route.continue();const payload=u.endsWith('/ship-list.json')?ships:u.endsWith('/ships.json')?details:u.endsWith('/equipment.json')?equipment:u.endsWith('/version.json')?{generatedAt:'fixture'}:null;return payload?route.fulfill({contentType:'application/json',body:JSON.stringify(payload)}):route.abort();});
  await page.goto(url+'/#/ships/29901');
  await page.locator('#research-dev').selectOption('5');
  assert.equal(await page.locator('#research-fate').isDisabled(),true);
  assert.match(await page.locator('.research-progress').innerText(),/not calculated yet/);
  assert.equal(await page.locator('.ship-profile-cover .research-frame-pr').count(),1);
  assert.equal(await page.locator('[data-loadout-slot]').count(),6);
  await page.locator('[data-action="research-open"]').click();
  await page.locator('#research-start-date').fill('2026-01-01T12:00');
  await page.locator('[data-action="research-set-start"]').click();
  assert.equal(await page.locator('[data-action="research-set-start"]').evaluate(el=>el===document.activeElement),true);
  assert.equal(await page.locator('#research-start-date').inputValue(),'2026-01-01T12:00');
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('avalon.research.v1'))['29901'].start),await page.evaluate(()=>Date.parse('2026-01-01T12:00')));
  await page.locator('[data-action="research-start"]').click();
  assert.match(await page.locator('[data-research-countdown="60012"]').innerText(),/Time gate passed/);
  await page.locator('[data-research-mission="60012"]').check();
  assert.equal(await page.locator('[data-research-mission="60012"]').isChecked(),true);
  const lastMission=page.locator('[data-research-mission="60019"]');
  await lastMission.focus();
  const bottomScroll=await page.locator('.research-dialog-body').evaluate(el=>el.scrollTop);
  assert.ok(bottomScroll>200,'last mission must be below the fold');
  await page.keyboard.press('Space');
  assert.equal(await lastMission.isChecked(),true);
  assert.equal(await lastMission.evaluate(el=>el===document.activeElement),true);
  assert.ok(Math.abs(await page.locator('.research-dialog-body').evaluate(el=>el.scrollTop)-bottomScroll)<=1,'completion preserves scroll position');
  const start=await page.evaluate(()=>JSON.parse(localStorage.getItem('avalon.research.v1'))['29901'].start);assert.ok(Number.isSafeInteger(start));
  const scroll=await page.locator('.research-dialog-body').evaluate(el=>({scroll:el.scrollHeight,height:el.clientHeight}));assert.ok(scroll.scroll>scroll.height);
  assert.ok(await page.locator('.research-dialog').evaluate(el=>el.getBoundingClientRect().right<=innerWidth));
  await page.screenshot({path:'.audit/research-screens/modal-'+width+'.png'});
  await page.keyboard.press('Escape');assert.equal(await page.locator('.research-dialog').count(),0);
  assert.equal(await page.locator('[data-action="research-open"]').evaluate(el=>el===document.activeElement),true);
  await page.reload();assert.equal(await page.locator('#research-dev').inputValue(),'5');
  await page.locator('[data-action="research-open"]').click();assert.equal(await page.locator('[data-research-mission="60012"]').isChecked(),true);
  assert.equal(await page.locator('[data-research-mission="60019"]').isChecked(),true);
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('avalon.research.v1'))['29901'].start),start);
  await page.locator('[data-action="research-close"]').last().click();
  await page.evaluate(()=>location.hash='#/ships/29904');await page.locator('.research-frame-dr').waitFor();assert.equal(await page.locator('#research-dev').inputValue(),'30');
  await page.locator('#research-fate').selectOption('5');await page.screenshot({path:'.audit/research-screens/profile-'+width+'.png',fullPage:true});
  await page.evaluate(()=>location.hash='#/ships/29906');await page.locator('#research-dev').waitFor();assert.equal(await page.locator('#research-fate').count(),0);
  await page.evaluate(()=>location.hash='#/ships/99901');await page.locator('#research-dev').selectOption('10');
  await page.locator('[data-loadout-slot="0"] .loadout-tile-more').click();await page.locator('.combat-comparison').waitFor();
  assert.match(await page.locator('.combat-comparison').innerText(),/Dev\/Fate setup is not supported/);
  await page.keyboard.press('Escape');
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('avalon.azurlane.loadouts.v1'))),saved);
  await page.locator('[data-action="profile-back"]').click();await page.locator('[data-action="ship-research-toggle"]').click();
  await page.locator('#ship-research-series').selectOption('9');
  assert.equal(await page.locator('.ship-roster-tile').count(),5);
  assert.equal(await page.locator('.ship-roster-tile .research-frame').count(),5);
  await page.locator('#catalog-search').fill('Duncan');await page.waitForTimeout(350);assert.equal(await page.locator('.ship-roster-tile').count(),1);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert.deepEqual(errors,[]);
  console.log('PASS '+width+'px research filter/series, PR+DR frames, Dev/Fate, modal scroll/Escape/back, timers/reload, combat guard and saved gear');await page.close();
 }
}finally{await browser.close();await new Promise(r=>server.close(r));}
