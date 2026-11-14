// Real application handlers; isolated catalog fixtures do not validate game performance.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFileSync,mkdirSync} from 'node:fs';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
import {RESEARCH_MANIFEST} from '../src/research-manifest.js';
import {COMBAT_DATA} from '../src/combat-data.js';
const baseline=process.env.CARD_BASELINE==='1';
const root=baseline?resolve('.audit/card-before'):fileURLToPath(new URL('..',import.meta.url)).replace(/[\\/]$/,'');
const server=createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(root+sep)){res.writeHead(403).end();return;}
 try{res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.html':'text/html','.json':'application/json'})[extname(file)]||'text/plain');res.end(readFileSync(file));}catch{res.writeHead(404).end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;
const ships=Object.values(RESEARCH_MANIFEST.records).map(r=>({id:r.id,name:r.name,hullType:r.id==='99901'?'Battleship':'Light Cruiser',nationality:'Royal Navy',rarity:r.classification==='DR'?'Decisive':'Priority'}));
ships.push({id:'970101',name:'Hunter META',hullType:'Destroyer',nationality:'META',rarity:'Elite'});
ships.push({id:'10706',name:'Enterprise',hullType:'Aircraft Carrier',nationality:'Eagle Union',rarity:'Super Rare'});
ships.push({id:'970701',name:'Hiryuu META',hullType:'Aircraft Carrier',nationality:'META',rarity:'Super Rare'});
ships.push(...Array.from({length:100},(_,i)=>({id:String(10000+i),name:'Fixture '+i,hullType:'Destroyer',nationality:'Eagle Union',rarity:'Rare'})));
const details=Object.fromEntries(ships.map(s=>[s.id,{id:s.id,names:{en:s.name},nationality:s.nationality,hullType:s.hullType,rarity:s.rarity,slots:[],skills:[],stats:{level120:{health:100}},obtainedFrom:{obtainedFrom:'Research and Development'}}]));
const equipment=Object.fromEntries(Array.from({length:110},(_,i)=>[String(99000+i),{name:'Fixture auxiliary '+i,type:10,rarity:3,stats:{},ship_type_forbidden:[]}]));
for(const item of Object.values(COMBAT_DATA.equipment))equipment[item.id]={name:item.name,type:item.type,rarity:item.rarity,stats:{},ship_type_forbidden:item.hull_restriction};
const saved={'99901':{general:{0:'fer-24140'}}};
mkdirSync('.audit/research-screens',{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'});
try{
 for(const width of (baseline?[]:[360,390,768,1280])){
  const page=await browser.newPage({viewport:{width,height:800}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(value=>{if(!localStorage.getItem('avalon.azurlane.loadouts.v1'))localStorage.setItem('avalon.azurlane.loadouts.v1',JSON.stringify(value));},saved);
  await page.route(/^https?:\/\//,route=>{const u=route.request().url();if(u.startsWith(url))return route.continue();const payload=u.endsWith('/ship-list.json')?ships:u.endsWith('/ships.json')?details:u.endsWith('/equipment.json')?equipment:u.endsWith('/version.json')?{generatedAt:'fixture'}:null;return payload?route.fulfill({contentType:'application/json',body:JSON.stringify(payload)}):route.abort();});
  await page.goto(url+'/#/ships/29901');
  assert.equal(await page.locator('[data-research-stat="health"]').innerText(),'4637');
  assert.equal(await page.locator('#ship-profile-stats #research-dev').count(),1);
  assert.equal(await page.locator('#research-dev option').count(),7);
  assert.equal(await page.locator('[data-research-delta="health"]').innerText(),'+1265');
  await page.locator('#research-detailed').check();
  assert.equal(await page.locator('#research-dev option').count(),31);
  await page.locator('#research-dev').focus();
  await page.locator('#research-dev').selectOption('7');
  assert.equal(await page.locator('#research-dev').evaluate(el=>el===document.activeElement),true);
  await page.locator('#research-detailed').uncheck();
  assert.equal(await page.locator('#research-dev').inputValue(),'7');
  assert.equal(await page.locator('#research-dev option').count(),8);
  await page.reload();
  assert.equal(await page.locator('#research-dev').inputValue(),'7');
  await page.locator('#research-compare').selectOption('previous');
  assert.match(await page.locator('.research-comparison-basis').innerText(),/Dev 6/);
  await page.locator('#research-compare').selectOption('start');
  await page.locator('#research-dev').selectOption('5');
  assert.equal(await page.locator('[data-research-stat="health"]').innerText(),'3583');
  assert.match(await page.locator('[data-research-slot="1"]').innerText(),/2 mounts/);
  await page.locator('[data-action="profile-level"][data-level="level125"]').click();
  assert.equal(await page.locator('[data-action="profile-level"][data-level="level125"]').evaluate(el=>el===document.activeElement),true);
  assert.equal(await page.locator('[data-research-stat="health"]').innerText(),'3689');
  await page.locator('[data-action="profile-level"][data-level="level120"]').click();
  assert.equal(await page.locator('#research-fate').isDisabled(),true);
  assert.match(await page.locator('.research-progress').innerText(),/update for your selected/);
  assert.equal(await page.locator('.ship-profile-overview > .research-frame-pr').count(),1);
  const prShape=await page.locator('.research-frame-pr').evaluate(el=>getComputedStyle(el).clipPath);
  assert.equal(await page.locator('[data-loadout-slot]').count(),6);
  await assertFrameClearance(page);
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
  const drShape=await page.locator('.research-frame-dr').evaluate(el=>getComputedStyle(el).clipPath);
  assert.notEqual(prShape,drShape,'PR and DR must differ by silhouette, not only color');
  await page.locator('#research-fate').selectOption('3');
  assert.equal(await page.locator('[data-research-stat="luck"]').innerText(),'12');
  assert.equal(await page.locator('[data-research-skill="18300"]').count(),1);
  assert.equal(await page.locator('[data-research-skill="19290"]').count(),1);
  await page.locator('#research-fate').selectOption('5');
  assert.equal(await page.locator('[data-research-stat="luck"]').innerText(),'25');
  await page.locator('#research-compare').selectOption('developed');
  assert.equal(await page.locator('[data-research-delta="luck"]').innerText(),'+25');
  await page.locator('.research-upgrade-changes summary').click();
  assert.match(await page.locator('.research-upgrade-changes').innerText(),/Flintlock/);
  await page.locator('#research-compare').selectOption('previous');
  assert.equal(await page.locator('[data-research-delta="luck"]').innerText(),'+7');
  assert.equal(await page.locator('[data-research-skill="18290"]').count(),1);
  await page.screenshot({path:'.audit/research-screens/profile-'+width+'.png',fullPage:true});
  await page.evaluate(()=>location.hash='#/ships/970701');
  await page.locator('.ship-profile-overview.portrait-meta').waitFor();
  assert.equal(await page.locator('#research-dev').count(),0);
  await assertFrameClearance(page);
  assert.equal(await page.locator('.portrait-meta-super-rare').count(),1);
  await page.screenshot({path:'.audit/research-screens/meta-'+width+'.png',fullPage:true});
  await page.evaluate(()=>location.hash='#/ships/970101');
  await page.locator('.ship-profile-overview.portrait-meta-elite').waitFor();
  await assertFrameClearance(page);
  await page.screenshot({path:'.audit/research-screens/meta-elite-'+width+'.png',fullPage:true});
  await page.evaluate(()=>location.hash='#/ships/10706');
  await page.locator('.ship-profile-identity h1').filter({hasText:'Enterprise'}).waitFor();
  await assertOrdinaryPortrait(page,'.ship-profile-cover');
  await page.evaluate(()=>location.hash='#/ships/29906');await page.locator('#research-dev').waitFor();assert.equal(await page.locator('#research-fate').count(),0);
  await page.evaluate(()=>location.hash='#/ships/99901');await page.locator('#research-dev').selectOption('10');
  await page.locator('[data-loadout-slot="0"] .loadout-tile-more').click();await page.locator('.combat-comparison').waitFor();
  assert.match(await page.locator('.combat-comparison').innerText(),/Dev\/Fate setup is not supported/);
  await page.keyboard.press('Escape');
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('avalon.azurlane.loadouts.v1'))),saved);
  await page.locator('[data-action="profile-back"]').click();
  await page.locator('#catalog-search').fill('META');
  await page.locator('.ship-roster-tile.portrait-meta-elite').waitFor();
  await page.locator('.ship-roster-tile.portrait-meta-super-rare').waitFor();
  await assertFrameClearance(page,'.ship-roster-tile.portrait-meta-elite');
  await assertFrameClearance(page,'.ship-roster-tile.portrait-meta-super-rare');
  await page.screenshot({path:'.audit/research-screens/meta-roster-'+width+'.png',fullPage:true});
  await page.locator('#catalog-search').fill('Enterprise');
  await page.locator('.ship-roster-tile').filter({hasText:'Enterprise'}).waitFor();
  await assertOrdinaryPortrait(page,'.ship-roster-portrait');
  await page.locator('#catalog-search').fill('');
  await page.locator('[data-action="ship-research-toggle"]').click();
  await page.locator('#ship-research-series').selectOption('9');
  assert.equal(await page.locator('.ship-roster-tile').count(),5);
  assert.equal(await page.locator('.ship-roster-tile .research-frame').count(),5);
  await assertFrameClearance(page,'.ship-roster-tile');
  await page.locator('#catalog-search').fill('Duncan');await page.waitForTimeout(350);assert.equal(await page.locator('.ship-roster-tile').count(),1);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert.deepEqual(errors,[]);
  console.log('PASS '+width+'px research filter/series, PR+DR frames, Dev/Fate, modal scroll/Escape/back, timers/reload, combat guard and saved gear');await page.close();
 }
 // Visual evidence uses the live catalogs and official portrait URLs, without fixture routes.
 for(const [id,label,width] of (process.env.SKIP_LIVE_ART==='1'?[]:[['29901','pr',1280],['29901','pr',390],['29904','dr',1280],['29904','dr',390],['970701','meta',1280],['970701','meta',390],['970101','meta-elite',1280],['970101','meta-elite',390],['10706','ordinary',1280],['10706','ordinary',390]])){
  const page=await browser.newPage({viewport:{width,height:900}});
  await page.goto(url+'/#/ships/'+id);
  await page.locator(baseline||label==='ordinary'?'.ship-profile-cover':'.ship-profile-overview.portrait-'+label).waitFor({timeout:90000});
  // Live wiki/artwork responses refresh the profile; finish those requests before capture.
  await page.waitForLoadState('networkidle');
  // Mobile artwork is lazy-loaded below the fold; exercise it before the full-page capture.
  await page.locator('.ship-art-panel').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>{const image=document.querySelector('.ship-art-preview-image');return image?.complete&&image.naturalWidth>0;},{},{timeout:60000});
  await page.waitForLoadState('networkidle');
  await page.locator('.ship-profile-cover').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>{const image=document.querySelector('.ship-profile-cover img');return image?.complete&&image.naturalWidth>0;},{},{timeout:60000});
  if(!baseline){if(label==='ordinary')await assertOrdinaryPortrait(page,'.ship-profile-cover');else await assertFrameClearance(page);}
  await assertWideDetails(page,width);
  const image=await page.locator('.ship-profile-cover img').getAttribute('src');
  const prefix=baseline?'before-':'live-';
  await page.screenshot({path:'.audit/research-screens/'+prefix+label+'-'+width+'.png',fullPage:true});
  await screenshotCard(page,'.ship-profile-overview','.audit/research-screens/'+prefix+label+'-'+width+'-hero.png');
  const catalogId=await page.locator('.ship-profile-toolbar [data-action="add-ship"]').getAttribute('data-ship');
  const name=await page.locator('.ship-profile-identity h1').innerText();
  await page.locator('[data-action="profile-back"]').click();
  await page.locator('#catalog-search').fill(name);
  const tileSelector='.ship-roster-tile[data-ship="'+catalogId+'"]';
  await page.locator(tileSelector).waitFor();
  await page.waitForFunction(selector=>{const image=document.querySelector(selector+' img');return image?.complete&&image.naturalWidth>0;},tileSelector,{timeout:60000});
  await page.waitForLoadState('networkidle');
  if(!baseline){if(label==='ordinary')await assertOrdinaryPortrait(page,tileSelector+' .ship-roster-portrait');else await assertFrameClearance(page,tileSelector);}
  await screenshotCard(page,tileSelector,'.audit/research-screens/'+prefix+label+'-'+width+'-roster.png');
  console.log('PASS live '+label+' portrait and profile '+width+'px: '+image);
  await page.close();
 }
}finally{await browser.close();await new Promise(r=>server.close(r));}

async function screenshotCard(page,selector,path){
 await page.locator(selector).scrollIntoViewIfNeeded();
 const box=await page.locator(selector).boundingBox();
 // Include the external frame, which is intentionally outside the card's layout box.
 await page.screenshot({path,clip:{x:box.x-5,y:box.y-5,width:box.width+10,height:box.height+10}});
}

async function assertFrameClearance(page,selector='.ship-profile-overview'){
 const result=await page.locator(selector).first().evaluate(el=>{
  const frame=el.querySelector(':scope > .research-frame');
  if(!frame)throw Error('Identity frame must be a direct child of the entire card');
  const portrait=el.querySelector('.ship-profile-cover,.ship-roster-portrait'),art=portrait.querySelector('.asset-media');
  if(portrait.querySelector('.research-frame'))throw Error('Nested thumbnail frame');
  const outer=el.getBoundingClientRect(),f=frame.getBoundingClientRect(),style=getComputedStyle(frame),p=portrait.getBoundingClientRect(),a=art.getBoundingClientRect();
  if(!style.maskComposite.split(',').every(v=>v.trim()==='exclude'))throw Error('Frame needs an empty center');
  const empty={left:f.left+parseFloat(style.paddingLeft),right:f.right-parseFloat(style.paddingRight),top:f.top+parseFloat(style.paddingTop),bottom:f.bottom-parseFloat(style.paddingBottom)};
  for(const edge of ['left','right','top','bottom'])if(Math.abs(empty[edge]-outer[edge])>1)throw Error('Frame center does not match whole card: '+edge);
  if(getComputedStyle(portrait).padding!=='0px')throw Error('Portrait padding shrinks the artwork');
  if(el.matches('.ship-roster-tile')){
   const name=el.querySelector('.ship-roster-name').getBoundingClientRect(),footer=el.querySelector('.ship-roster-footer').getBoundingClientRect();
   if(name.top<p.bottom-1||footer.top<name.bottom-1)throw Error('Dock name and hull rails must follow artwork without overlap');
   for(const pseudo of ['::before','::after']){
    const cap=getComputedStyle(el.querySelector('.ship-roster-footer'),pseudo);
    if(parseFloat(cap.width)>14||cap.pointerEvents!=='none')throw Error('Rail ornaments must be small and non-interactive');
   }
  }
  if(el.classList.contains('portrait-meta')&&getComputedStyle(frame).animationName!=='none')throw Error('META static finish must not start perpetual animation');
  // Removing classification must not increase artwork area or change grid dimensions.
  const classes=el.className;el.className=classes.split(' ').filter(c=>!c.startsWith('portrait-')).join(' ');
  const ordinary=art.getBoundingClientRect(),baseline=el.getBoundingClientRect();el.className=classes;
  return {width:a.width,baseWidth:ordinary.width,height:a.height,baseHeight:ordinary.height,cardHeight:outer.height,baseCardHeight:baseline.height,portraitWidth:p.width};
 });
 assert.ok(result.width>=result.baseWidth-1,'identity must not reduce artwork width');
 assert.ok(result.height>=result.baseHeight-1,'identity must not reduce artwork height');
 assert.ok(Math.abs(result.cardHeight-result.baseCardHeight)<=2,'identity must not change card alignment');
}

async function assertOrdinaryPortrait(page,selector){
 const portrait=page.locator(selector).first();
 assert.equal(await portrait.locator('.research-frame').count(),0);
 assert.equal(await portrait.evaluate(el=>[...el.classList].some(c=>c.startsWith('portrait-'))),false);
 assert.equal(await portrait.evaluate(el=>getComputedStyle(el).paddingTop),'0px');
}
async function assertWideDetails(page,width){
 if(width<1181)return;
 const size=await page.evaluate(()=>{
  const layout=document.querySelector('.ship-profile-layout').getBoundingClientRect();
  const gear=document.querySelector('#ship-profile-gear').getBoundingClientRect();
  const skills=document.querySelector('#ship-profile-skills').getBoundingClientRect();
  return {layout:layout.width,gear:gear.width,skills:skills.width};
 });
 assert.ok(size.gear>=size.layout-2,'equipment uses full summary width');
 assert.ok(size.skills>=size.layout-2,'skills use full summary width');
}
