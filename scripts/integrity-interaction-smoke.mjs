/** Operation INTEGRITY: real routes, keyboard behavior, original art and failure evidence. */
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve,extname,sep} from 'node:path';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';
import {liveShip} from '../src/live-content.js';
if(process.env.SITES_MANAGED_LINUX_CONTAINER&&!process.env.CI)throw Error('Use the managed browser for local previews; run this suite in CI.');
const root=resolve('.'),out=resolve('.audit/integrity-screens');mkdirSync(out,{recursive:true});
const observed='2026-11-19T02:00:00Z',saved=JSON.stringify({'99901':{general:{0:'fer-24140'}}});
const report={observationTime:observed,browser:null,checks:[],artwork:[],captures:[],limitations:[]};
const server=createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(root+sep)){res.writeHead(403).end();return;}
 try{res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.html':'text/html','.json':'application/json','.svg':'image/svg+xml','.png':'image/png'})[extname(file)]||'application/octet-stream');res.end(readFileSync(file));}catch{res.writeHead(404).end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,channel:'chrome'});report.browser=browser.version();
async function pageFor(width,{art=false,time=observed,deployment=null}={}){
 const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.clock.install({time:new Date(time)});await page.clock.pauseAt(new Date(time));
 await page.addInitScript(value=>{if(!localStorage.getItem('avalon.azurlane.loadouts.v1'))localStorage.setItem('avalon.azurlane.loadouts.v1',value);},saved);
 await page.route('**/*',route=>{
  const u=route.request().url();
  if(u===origin+'/data/deployment.json'&&deployment)return route.fulfill({contentType:'application/json',body:JSON.stringify(deployment)});
  if(u.startsWith(origin))return route.continue();
  if(art&&route.request().resourceType()==='image')return route.continue();
  return route.abort();
 });
 return {page,errors};
}
async function preserved(page){assert.equal(await page.evaluate(()=>localStorage.getItem('avalon.azurlane.loadouts.v1')),saved);}
async function noOverflow(page){assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No horizontal overflow');}
async function focused(locator){assert(await locator.evaluate(el=>el===document.activeElement));}
async function capture(page,name){
 await page.locator('img').evaluateAll(async images=>{
  for(const img of images.filter(i=>{const r=i.getBoundingClientRect();return r.width&&r.height&&r.bottom>0&&r.top<innerHeight;})){
   if(!img.complete)await new Promise(done=>{const finish=()=>{clearTimeout(t);done();};const t=setTimeout(finish,15000);img.addEventListener('load',finish,{once:true});img.addEventListener('error',finish,{once:true});});
   if(img.complete&&img.naturalWidth)await img.decode().catch(()=>{});
  }
 });
 await noOverflow(page);const file=name+'.png';await page.screenshot({path:out+'/'+file});
 report.captures.push({file,sha256:createHash('sha256').update(readFileSync(out+'/'+file)).digest('hex')});
}
async function artResult(page,selector,label){
 await page.evaluate(selector=>document.querySelector(selector)?.scrollIntoView({block:'center',behavior:'instant'}),selector);
 await page.waitForFunction(selector=>{const img=document.querySelector(selector);return !img||img.complete;},selector,{timeout:25000}).catch(()=>{});
 const result=await page.evaluate(selector=>{const img=document.querySelector(selector);return img?{url:img.currentSrc,width:img.naturalWidth,height:img.naturalHeight,loaded:img.complete&&img.naturalWidth>0}:{loaded:false,url:null,width:0,height:0};},selector);
 report.artwork.push({label,...result});
 if(!result.loaded)report.limitations.push(label+': source artwork unavailable; placeholder visible, not certified.');
 return result;
}
try{
 for(const width of [360,390,768,1280]){
  const {page,errors}=await pageFor(width);
  await page.goto(origin+'/#/events/angels-azur-stage');const toggle=page.locator('#event-schedule-toggle');await toggle.waitFor();
  assert.equal(await toggle.getAttribute('aria-expanded'),'false');assert.equal(await page.locator('#event-schedule-details').isVisible(),false);
  assert.equal(await page.locator('.event-schedules-compact [role="timer"]').count(),3);
  assert((await page.locator('.event-schedules-compact').boundingBox()).height<450,'Regional summaries remain compact at every target width');
  await toggle.focus();await page.keyboard.press('Enter');await focused(toggle);assert.equal(await toggle.getAttribute('aria-expanded'),'true');
  await page.getByLabel('Content for server').selectOption('JP');assert.equal(await toggle.getAttribute('aria-expanded'),'true');
  await toggle.focus();await page.keyboard.press('Space');await focused(toggle);assert.equal(await page.locator('#event-schedule-details').isVisible(),false);
  await page.clock.runFor(1000);assert.doesNotMatch(await page.locator('#toast').innerText(),/Event schedules have updated/);
  await page.locator('a[href="#/ships/1180001?skin=11800011"]').click();await page.locator('.ship-art-current').waitFor();
  assert.equal(await page.locator('.ship-art-current').innerText(),'Both in Heart and Mind');
  await page.reload();await page.locator('.ship-art-current').waitFor();assert.equal(await page.locator('.ship-art-current').innerText(),'Both in Heart and Mind','Reload preserves the linked ship and skin');
  assert.equal(await page.locator('[data-action="profile-skin"]').count(),2);assert.equal(await page.locator('[data-loadout-slot]').count(),6);
  for(const [id,name] of [['1180001','Both in Heart and Mind'],['1180002','For My Lucky Star']]){
   await page.goto(origin+'/#/ships/'+id);await page.locator('.ship-art-current').waitFor();
   assert.equal(await page.locator('.ship-art-current').innerText(),'Default');
   const portrait=await page.locator('.ship-profile-cover [role="img"]').getAttribute('aria-label');
   const alternate=page.locator('[data-skin-id="'+id+'1"]');await alternate.focus();await page.keyboard.press('Enter');await focused(alternate);
   assert.equal(await page.locator('.ship-art-current').innerText(),name);assert.match(await page.locator('.ship-art-acquisition').innerText(),/1,000 Gems/);
   const noBackground=page.getByRole('button',{name:'Without background',exact:true});await noBackground.click();await focused(noBackground);assert.equal(await noBackground.getAttribute('aria-pressed'),'true');
   assert.equal(await page.locator('.ship-profile-cover [role="img"]').getAttribute('aria-label'),portrait,'Skin selection leaves identity portrait unchanged');
   for(const src of await page.locator('.ship-profile-cover img').evaluateAll(images=>images.map(i=>i.getAttribute('src'))))assert([liveShip(id).artwork[0].images.wiki,liveShip(id).portraitFallback].includes(src),'Identity portrait uses only default art');
   await page.locator('[data-action="profile-art-open"]').click();const dialog=page.getByRole('dialog',{name:'Artwork viewer'});await dialog.waitFor();
   const close=dialog.locator('[data-action="profile-art-close"]'),full=dialog.locator('[data-action="profile-art-fullscreen"]');await focused(close);
   await page.keyboard.press('Tab');await focused(full);await page.keyboard.press('Shift+Tab');await focused(close);
   await page.keyboard.press('Escape');assert.equal(await dialog.count(),0);await focused(page.locator('[data-action="profile-art-open"]'));
   await noOverflow(page);await preserved(page);
  }
  assert.deepEqual(errors,[]);await page.close();report.checks.push({width,result:'Schedule keyboard/focus/region changes, exact skin links, both galleries, background controls, lightbox focus, saved loadouts and overflow passed with upstream unavailable.'});
 }
 // A real catalog shop deadline becomes urgent at the exact 48-hour boundary.
 {
  const c=JSON.parse(readFileSync('data/events/catalog.json')),o=c.events.find(e=>e.id==='angels-azur-stage').occurrences.find(o=>o.region==='JP');
  const p=o.phases.find(p=>p.kind==='shop'&&p.at.kind==='exact'),threshold=Date.parse(p.at.value)-48*3600000;
  const {page}=await pageFor(390,{time:new Date(threshold-1000).toISOString()});await page.goto(origin+'/#/events/angels-azur-stage');await page.getByLabel('Content for server').selectOption('JP');
  assert.equal(await page.locator('.event-urgent').count(),0);await page.clock.runFor(1000);await page.locator('.event-urgent').waitFor();
  assert.equal(await page.locator('#event-schedule-details').isVisible(),false);assert.match(await page.locator('.event-urgent').innerText(),/JP.*Closing within 48 hours/);
  await page.locator('#event-schedule').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));await capture(page,'urgent-deadline-390');await page.close();report.checks.push({clock:'Production JP shop deadline appears at the exact 48-hour threshold while schedules remain collapsed.'});
 }
 // Use production EN records and reviewed galleries even when the remote statistics feed is offline.
 for(const width of [390,1280]){
  const time='2026-11-22T12:00:00Z',online=!process.argv.includes('--offline');
  const {page,errors}=await pageFor(width,{time,art:online});
  for(const id of ['black-friday-skin-coupon','heartful-remedies-outfit-shop','effulgence-before-eclipse?occurrence=effulgence-archive-en-20261119']){
   await page.goto(origin+'/#/events/'+id);await page.locator('.event-detail-tools').waitFor();
   if(id.includes('coupon')){
    assert.match(await page.locator('#event-schedule').innerText(),/14:59:59/);
    await page.locator('#event-schedule').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
    await capture(page,'black-friday-coupon-'+width);
   }else{
    await page.getByRole('button',{name:'Obtainable content',exact:true}).click();
    if(id.includes('shop')){
     const item=page.locator('#event-item-skin-699022');
     assert.match(await item.innerText(),/L2D\+.*1,180.*1,260/s);
     await item.scrollIntoViewIfNeeded();
     if(online)await artResult(page,'#event-item-skin-699022 img','Napoli shop icon '+width);
     await capture(page,'black-friday-shop-'+width);
     await item.getByRole('link',{name:/Lost White Bird/}).click();await page.locator('.ship-art-current').waitFor();
     assert.equal(await page.locator('.ship-art-current').innerText(),'Lost White Bird');
     const variant=page.getByRole('button',{name:'Without background',exact:true});
     await variant.focus();await page.keyboard.press('Enter');await focused(variant);
     assert.equal(await variant.getAttribute('aria-pressed'),'true');
     if(online)await artResult(page,'.ship-art-preview-image','Napoli without background '+width);
     await capture(page,'black-friday-gallery-'+width);
    }else{
     assert.equal(await page.locator('#event-item-light-hatsuzuki').count(),1);
     assert.equal(await page.locator('#event-item-effulgence-map-overview').count(),0);
     await page.locator('#event-item-light-hatsuzuki').scrollIntoViewIfNeeded();
     await capture(page,'black-friday-archive-'+width);
    }
   }
  }
  await preserved(page);assert.deepEqual(errors,[]);await page.close();
  report.checks.push({operation:'BLACK FRIDAY',width,time,checks:['coupon seconds','shop price and skin link','keyboard gallery variant','permanent acquisition','saved loadout preserved']});
 }

 // A changed build offers a normal reload and never clears stored selections.
 {
  const {page}=await pageFor(390,{deployment:{schemaVersion:1,version:'0.8.13',fingerprint:'controlled-changed-build'}});
  await page.goto(origin+'/#/events');await page.locator('.deployment-notice').waitFor();await preserved(page);
  await page.getByRole('button',{name:'Reload page',exact:true}).click();await page.locator('.deployment-notice').waitFor();await preserved(page);await page.close();
  report.checks.push({deployment:'Changed-build notice and user-initiated reload preserve saved loadouts.'});
 }
 // Real source URLs, production records and a disclosed fixed clock. No substitute artwork.
 for(const width of process.argv.includes('--offline')?[]:[360,390,768,1280]){
  const {page,errors}=await pageFor(width,{art:true});await page.goto(origin+'/#/events/angels-azur-stage');await page.locator('#event-schedule-toggle').waitFor();
  await page.locator('#event-schedule').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));await capture(page,'schedule-collapsed-'+width);
  await page.locator('#event-schedule-toggle').click();await page.locator('#event-schedule').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));await capture(page,'schedule-expanded-'+width);
  await page.getByRole('button',{name:'Obtainable content',exact:true}).click();await capture(page,'reward-thumbnails-'+width);
  const thumbnails=await page.locator('.event-item-art img').evaluateAll(images=>images.filter(i=>{const r=i.getBoundingClientRect();return r.top<innerHeight&&r.bottom>0;}).map(i=>({url:i.currentSrc,loaded:i.complete&&i.naturalWidth>0})));
  report.artwork.push({label:'visible reward thumbnails '+width,images:thumbnails});
  for(const i of thumbnails)if(!i.loaded)report.limitations.push('Reward thumbnail unavailable at '+width+': '+i.url);
  for(const [id,label] of [['gear-skin-1541','cosmetic-gear'],['both-in-heart-and-mind','outfit-rewards'],['furniture-dibanmyicon','furniture-rewards']]){
   await page.locator('#event-item-'+id).evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));await capture(page,label+'-'+width);
  }
  if(width===390||width===1280)for(const id of ['1180001','1180002']){
   await page.goto(origin+'/#/ships/'+id);await page.locator('.ship-art-current').waitFor();
   await artResult(page,'.ship-art-preview-image',id+' default '+width);await capture(page,id+'-default-'+width);
   await page.locator('[data-skin-id="'+id+'1"]').click();
   await artResult(page,'.ship-art-preview-image',id+' alternate '+width);await capture(page,id+'-alternate-'+width);
   await page.getByRole('button',{name:'Without background',exact:true}).click();
   const result=await artResult(page,'.ship-art-preview-image',id+' no background '+width);
   if(result.loaded)assert([liveShip(id).artwork[1].images.wikiNoBackground,liveShip(id).artwork[1].images.paintingNoBackground].includes(result.url));
   await capture(page,id+'-no-background-'+width);
   await page.locator('[data-action="profile-art-open"]').click();await page.getByRole('dialog',{name:'Artwork viewer'}).waitFor();
   await artResult(page,'.ship-art-viewer-image',id+' lightbox '+width);await capture(page,id+'-lightbox-'+width);
   await page.locator('#ship-art-lightbox [data-action="profile-art-fullscreen"]').click();
   assert(await page.evaluate(()=>document.fullscreenElement?.id==='ship-art-lightbox'),'Fullscreen uses the current artwork dialog');
   await page.locator('#ship-art-lightbox [data-action="profile-art-close"]').click();await focused(page.locator('[data-action="profile-art-open"]'));await preserved(page);
  }
  assert.deepEqual(errors,[]);await page.close();
 }
 if(process.argv.includes('--offline'))report.limitations.push('Offline functional run: original-art captures and fullscreen checks deferred to full CI.');
 console.log('PASS INTEGRITY: four responsive interaction widths, both skin galleries, keyboard/lightbox, urgent clock boundary, build reload and '+report.captures.length+' captures.');
 console.log('Artwork limitations: '+report.limitations.length+' (see report; unavailable art is not certified).');
}finally{
 writeFileSync(out+'/report.json',JSON.stringify(report,null,2)+'\n');await browser.close();server.close();
}
