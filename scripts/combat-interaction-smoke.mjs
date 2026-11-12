// Real application event handlers with isolated catalog fixtures, not real-game validation.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFileSync} from 'node:fs';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
import {COMBAT_DATA} from '../src/combat-data.js';
const root=fileURLToPath(new URL('..',import.meta.url)).replace(/[\\/]$/,'');
const server=createServer((req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
  if(!file.startsWith(root+sep)){res.writeHead(403).end();return;}
  try{res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.html':'text/html','.json':'application/json'})[extname(file)]||'text/plain');res.end(readFileSync(file));}
  catch{res.writeHead(404).end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const url='http://127.0.0.1:'+server.address().port;
const ships=Array.from({length:100},(_,i)=>({id:String(10000+i),name:'Fixture '+i,hullType:'Destroyer',rarity:'Rare'}));
ships.push({id:'40303',name:'Prinz Eugen',hullType:'Heavy Cruiser',rarity:'Super Rare'});
ships.push({id:'60701',name:'Aquila',hullType:'Aircraft Carrier',rarity:'Super Rare'});
const details=Object.fromEntries(ships.map(s=>[s.id,{id:s.id,names:{en:s.name},hullType:s.hullType,rarity:s.rarity,slots:[],skills:[],stats:{}}]));
const equipment=Object.fromEntries(Array.from({length:110},(_,i)=>[String(99000+i),{name:'Fixture auxiliary '+i,type:10,rarity:3,stats:{},ship_type_forbidden:[]}]));
for(const item of Object.values(COMBAT_DATA.equipment))equipment[item.id]={name:item.name,type:item.type,rarity:item.rarity,stats:{},ship_type_forbidden:item.hull_restriction};
const saved={'40303':{general:{0:'fer-33040'}}};
const browser=await chromium.launch({headless:true,channel:'chrome'});
try{
  for(const width of [390,1280]){
    const page=await browser.newPage({viewport:{width,height:800}});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.addInitScript(value=>localStorage.setItem('avalon.azurlane.loadouts.v1',JSON.stringify(value)),saved);
    await page.route(/^https?:\/\//,async route=>{
      const u=route.request().url();if(u.startsWith(url))return route.continue();
      const payload=u.endsWith('/ship-list.json')?ships:u.endsWith('/ships.json')?details:u.endsWith('/equipment.json')?equipment:u.endsWith('/version.json')?{generatedAt:'fixture'}:null;
      return payload?route.fulfill({contentType:'application/json',body:JSON.stringify(payload)}):route.abort();
    });
    await page.goto(url+'/#/ships/40303');
    await page.locator('[data-loadout-slot="0"] .loadout-tile-more').click();
    await page.locator('[data-action="loadout-select"]').first().waitFor();
    await page.locator('#combat-armor').selectOption('light');
    await page.locator('.combat-comparison').getByText('Direct-hit leader:',{exact:false}).waitFor();
    assert.match(await page.locator('.combat-comparison').innerText(),/Twin 203mm Naval Gun Mount/);
    await page.locator('#combat-armor').selectOption('medium');
    const lead=await page.locator('.combat-comparison > p').allTextContents();
    assert.ok(lead.some(t=>t.includes('Direct-hit leader: Twin 203mm (SK C/34)')));
    await page.locator('.combat-evidence summary').click();
    assert.equal(await page.locator('.combat-evidence').getAttribute('open'),'');
    await page.locator('#combat-movement').selectOption('moving');
    assert.match(await page.locator('.combat-comparison').innerText(),/accuracy is not modeled/);
    assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('avalon.azurlane.loadouts.v1'))),saved);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.loadout-picker-panel').count(),0);
    assert.equal(await page.locator('[data-loadout-slot]').count(),6);
    assert.deepEqual(errors,[]);
    console.log('PASS '+width+'px actual app armor change, disclosure, unknown movement, saved selection, Escape and six slots');
    await page.close();
    for(const variant of ['healing','offense','missing','invalid']){
      const page=await browser.newPage({viewport:{width,height:800}});
      const errors=[];page.on('pageerror',e=>errors.push(e.message));
      const picks={'60701':{general:{0:'fer-27140',1:variant==='offense'?'fer-19140':'fer-17340',2:variant==='invalid'?'fer-98000':'fer-28140'}}};
      const catalog=structuredClone(equipment);
      if(variant==='missing')delete catalog[28140];
      if(variant==='invalid')catalog[98000]={name:'Unsupported test aircraft',type:8,rarity:3,stats:{},ship_type_forbidden:[]};
      await page.addInitScript(value=>{if(!localStorage.getItem('avalon.azurlane.loadouts.v1'))localStorage.setItem('avalon.azurlane.loadouts.v1',JSON.stringify(value));},picks);
      await page.route(/^https?:\/\//,async route=>{
        const u=route.request().url();if(u.startsWith(url))return route.continue();
        const payload=u.endsWith('/ship-list.json')?ships:u.endsWith('/ships.json')?details:u.endsWith('/equipment.json')?catalog:u.endsWith('/version.json')?{generatedAt:'fixture'}:null;
        return payload?route.fulfill({contentType:'application/json',body:JSON.stringify(payload)}):route.abort();
      });
      await page.goto(url+'/#/ships/60701');
      const open=async index=>{
        await page.locator(`[data-loadout-slot="${index}"] .loadout-tile-more`).click();
        await page.locator('[data-action="loadout-select"]').first().waitFor();
      };
      await open(1);
      if(['missing','invalid'].includes(variant)){
        assert.equal(await page.locator('[data-combat-equipment]').count(),0);
        await page.locator('.combat-exclusions summary').click();
        assert.match(await page.locator('.combat-exclusions').innerText(),/Complete supported air wing/);
      }else{
        await page.locator('.combat-evidence summary').click();
        assert.match(await page.locator('[data-combat-equipment="17340"]').innerText(),/healing/);
        assert.match(await page.locator('[data-combat-equipment="19140"]').innerText(),/offense; 1 preload/);
        const before=Number(await page.locator('[data-combat-equipment="17340"]').getAttribute('data-combat-cycle'));
        const raw=(COMBAT_DATA.equipment[27140].weapon.reload[10]*2+1639*2+1550*4)/8;
        assert.ok(Math.abs(before-(raw/(6*Math.sqrt(200*3.14))*2.2+0.033))<1e-9);
        const offense=Number(await page.locator('[data-combat-equipment="19140"]').getAttribute('data-combat-cycle'));
        const offenseRaw=(COMBAT_DATA.equipment[27140].weapon.reload[10]*2+1786*2+1550*4)/8;
        assert.ok(Math.abs(offense-(offenseRaw/(6*Math.sqrt(200*3.14))*2.2*0.9+0.033))<1e-9);
        assert.match(await page.locator('.combat-comparison').innerText(),/healing\/shielding/);
      }
      await page.locator('#combat-wing').selectOption('reference');
      const reference=Number(await page.locator('[data-combat-equipment="17340"]').getAttribute('data-combat-cycle'));
      assert.ok(Math.abs(reference-((1639*4+1550*4)/8/(6*Math.sqrt(200*3.14))*2.2+0.033))<1e-9);
      await page.locator('#combat-armor').selectOption('heavy');
      await page.keyboard.press('Escape');await open(0);
      assert.equal(await page.locator('#combat-armor').inputValue(),'mixed');
      assert.equal(await page.locator('#combat-wing').inputValue(),'current');
      if(variant==='offense'){
        await page.locator('.combat-evidence summary').click();
        assert.match(await page.locator('[data-combat-equipment="17340"]').innerText(),/offense/);
        await page.locator('#combat-wing').selectOption('reference');
        await page.locator('.combat-evidence summary').click();
        assert.match(await page.locator('[data-combat-equipment="17340"]').innerText(),/healing/);
      }
      await page.locator('#combat-armor').selectOption('heavy');await page.keyboard.press('Escape');
      await page.locator('[data-action="loadout-mode"][data-mode="boss"]').click();await open(1);
      assert.equal(await page.locator('#combat-armor').inputValue(),'mixed');
      assert.match(await page.locator('.combat-comparison').innerText(),/Choose the boss armor/);
      await page.locator('#combat-armor').selectOption('heavy');await page.keyboard.press('Escape');
      await page.evaluate(()=>{location.hash='#/ships/40303';});await open(0);
      assert.equal(await page.locator('#combat-armor').inputValue(),'mixed');
      assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('avalon.azurlane.loadouts.v1'))),picks);
      await page.reload();
      assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('avalon.azurlane.loadouts.v1'))),picks);
      if(variant==='healing'){
        await page.evaluate(()=>{location.hash='#/ships/60701';});await open(1);
        await page.locator('[data-action="loadout-select"][data-equip="fer-19140"]').click();
        picks['60701'].general[1]='fer-19140';
        await open(0);await page.locator('.combat-evidence summary').click();
        assert.match(await page.locator('[data-combat-equipment="17340"]').innerText(),/offense/);
        await page.locator('#combat-wing').selectOption('reference');
        assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('avalon.azurlane.loadouts.v1'))),picks);
        await page.reload();
        assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('avalon.azurlane.loadouts.v1'))),picks);
      }
      assert.deepEqual(errors,[]);
      console.log(`PASS ${width}px Aquila ${variant}: whole wing, reference, slot/ship/mode reset, saved selections and reload`);
      await page.close();
    }
  }
}finally{await browser.close();await new Promise(r=>server.close(r));}
