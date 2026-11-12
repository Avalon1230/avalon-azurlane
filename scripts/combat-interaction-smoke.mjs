// Real application event handlers with isolated catalog fixtures, not real-game validation.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFileSync} from 'node:fs';
import {resolve,extname,sep} from 'node:path';
import {chromium} from 'playwright';
import {COMBAT_DATA} from '../src/combat-data.js';
const root=resolve(new URL('..',import.meta.url).pathname);
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
    await page.locator('[data-loadout-slot="0"] [data-action="loadout-slot-info"]').click();
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
  }
}finally{await browser.close();await new Promise(r=>server.close(r));}
