/** Real application routes/handlers with controlled clocks. Run in CI, not the managed preview. */
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve,extname,sep} from 'node:path';
import {chromium} from 'playwright';
if(process.env.SITES_MANAGED_LINUX_CONTAINER&&!process.env.CI)throw Error('Use the managed browser for local previews; run this suite in CI.');
const root=resolve('.'),out=resolve('.audit/chronicle-screens');mkdirSync(out,{recursive:true});
const catalog=JSON.parse(readFileSync('data/events/catalog.json'));
const server=createServer((req,res)=>{
 const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=resolve(root,'.'+(path==='/'?'/index.html':path));
 if(!file.startsWith(root+sep)){res.writeHead(403).end();return;}
 try{res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.html':'text/html','.json':'application/json','.svg':'image/svg+xml','.png':'image/png'})[extname(file)]||'text/plain');res.end(readFileSync(file));}catch{res.writeHead(404).end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,channel:'chrome'}),report=[];
const loadouts=JSON.stringify({'99901':{general:{0:'fer-24140'}}});
async function pageFor(width,{data=catalog,liveArt=false,failCatalog=false}={}){
 const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.clock.install({time:new Date('2026-11-16T03:59:59Z')});await page.clock.pauseAt(new Date('2026-11-16T04:00:00Z'));
 await page.addInitScript(saved=>{if(!localStorage.getItem('avalon.azurlane.loadouts.v1'))localStorage.setItem('avalon.azurlane.loadouts.v1',saved);},loadouts);
 await page.route('**/*',route=>{
  const u=route.request().url();if(u===url+'/data/events/catalog.json')return failCatalog?route.fulfill({status:503,body:'Unavailable'}):route.fulfill({contentType:'application/json',body:JSON.stringify(data)});
  if(u.startsWith(url))return route.continue();
  if(liveArt&&route.request().resourceType()==='image')return route.continue();
  return route.abort(); // Optional upstream data unavailable: first-party records must still work.
 });
 return {page,errors};
}
async function overflow(page){assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,'No horizontal page overflow');}
async function saved(page){assert.equal(await page.evaluate(()=>localStorage.getItem('avalon.azurlane.loadouts.v1')),loadouts,'Saved six-slot loadout storage remains identical');}
async function capture(page,name,fullPage=false){await page.screenshot({path:out+'/'+name+'.png',fullPage});}
try{
 for(const width of [360,390,768,1280]){
  const {page,errors}=await pageFor(width);
  await page.goto(url+'/#/events');await page.locator('[data-event-card="angels-azur-stage"]').waitFor();
  assert.equal(await page.locator('#event-region').inputValue(),'EN');assert.equal(await page.locator('#event-zone').inputValue(),'Asia/Manila');
  assert.equal(await page.getByRole('heading',{name:'Ongoing',exact:true}).count(),1);assert.equal(await page.getByRole('heading',{name:'Upcoming',exact:true}).count(),1);assert.equal(await page.getByRole('heading',{name:'Archive',exact:true}).count(),1);
  await overflow(page);await saved(page);
  await page.getByLabel('Search events & rewards').fill('Mikari');assert.equal(await page.locator('[data-event-card]').count(),1);assert.equal(await page.locator('#event-query').evaluate(el=>el===document.activeElement),true);
  await page.getByRole('button',{name:'Reset filters',exact:true}).click();
  await page.getByLabel('Server region').selectOption('JP');await page.getByLabel('Status',{exact:true}).selectOption('unknown');
  assert.match(await page.locator('[data-event-card]').innerText(),/Effulgence Before Eclipse/);assert.equal(await page.locator('[data-event-countdown]').count(),0);
  await page.reload();assert.equal(await page.locator('#event-region').inputValue(),'JP');assert.equal(await page.locator('#event-status').inputValue(),'unknown');
  await page.getByRole('button',{name:'Reset filters',exact:true}).click();
  await page.getByLabel('Year',{exact:true}).selectOption('2018');await page.getByLabel('Chronology').selectOption('oldest');
  assert.ok(await page.locator('[data-event-card]').count()>0);
  await page.getByRole('button',{name:'Timeline',exact:true}).click();assert.ok(await page.locator('.event-timeline>li').count()>0);
  await page.getByRole('button',{name:'Reset filters',exact:true}).click();await page.getByLabel('Category',{exact:true}).selectOption('research');assert.equal(await page.locator('[data-event-card]').count(),1);
  await page.getByRole('button',{name:'Reset filters',exact:true}).click();await page.locator('[data-event-card="angels-azur-stage"] h3 a').click();
  await page.getByRole('heading',{name:'Schedule & deadlines',exact:true}).waitFor();assert.match(await page.locator('.event-schedules').innerText(),/27 Nov 2026, 14:59/);
  assert.equal(await page.getByLabel('Content for server').inputValue(),'EN');await overflow(page);
  await page.getByRole('button',{name:'Obtainable content',exact:true}).focus();await page.keyboard.press('Enter');
  await page.getByRole('link',{name:'Liliel Angel Paratroopers/Ririsa ↗',exact:true}).click();await page.locator('.ship-profile-overview').waitFor();
  assert.equal(await page.evaluate(()=>window.scrollY),0,'Event profile link starts at the profile header');assert.equal(await page.locator('[data-loadout-slot]').count(),6);assert.match(await page.locator('#app-content').innerText(),/5123|5,123/);assert.match(await page.locator('#app-content').innerText(),/Liliel/);await saved(page);await overflow(page);
  await page.goBack();await page.getByRole('heading',{name:'Schedule & deadlines',exact:true}).waitFor();
  await page.getByRole('link',{name:'Miriella’s Bow ↗',exact:true}).click();await page.getByRole('dialog').waitFor();assert.match(await page.getByRole('dialog').innerText(),/25 → 35/);await overflow(page);
  await page.getByRole('button',{name:'Close augment details',exact:true}).focus();await page.keyboard.press('Shift+Tab');assert.equal(await page.getByRole('button',{name:'Close',exact:true}).evaluate(el=>el===document.activeElement),true);await page.keyboard.press('Tab');assert.equal(await page.getByRole('button',{name:'Close augment details',exact:true}).evaluate(el=>el===document.activeElement),true);await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0);
  await page.goto(url+'/#/events/the-fools-scales');await page.locator('#event-occurrence').waitFor();assert.match(await page.locator('#event-rewards').innerText(),/Permanent addition/);
  await page.locator('#event-occurrence').selectOption({label:'Original release · 2023-08-17'});assert.match(await page.locator('#event-rewards').innerText(),/This run has ended/);assert.equal(await page.locator('#event-rewards a[href="#/ships/80702"]').count(),1);
  await page.goto(url+'/#/events/does-not-exist');await page.getByRole('heading',{name:'Event not found'}).waitFor();await saved(page);assert.deepEqual(errors,[]);
  report.push({width,checks:'routes, offline profiles, exact IDs, filters, persistence, region dates, timeline, history, keyboard, image failure and overflow passed'});await page.close();
 }
 // Fail closed, then retry through the actual handler.
 {
  const {page,errors}=await pageFor(390,{failCatalog:true});await page.goto(url+'/#/events');await page.getByRole('heading',{name:'Event records are unavailable'}).waitFor();
  await page.route('**/data/events/catalog.json',r=>r.fulfill({contentType:'application/json',body:JSON.stringify(catalog)}));await page.getByRole('button',{name:'Retry',exact:true}).click();await page.locator('[data-event-card="angels-azur-stage"]').waitFor();await saved(page);assert.deepEqual(errors,[]);await page.close();
 }
 // Synthetic schedules are test fixtures only; production catalog is unchanged.
 {
  const c=structuredClone(catalog),e=c.events[0],o=e.occurrences.find(o=>o.region==='EN'),at=value=>({kind:'exact',zone:'UTC',value,sourceIds:o.sourceIds});
  o.start=at('2026-11-16T04:00:02Z');o.end=at('2026-11-16T04:00:04Z');o.releaseState='announced';o.phases=[{id:'fixture-unlock',label:'Controlled mission unlock',kind:'mission',at:at('2026-11-16T04:00:03Z'),sourceIds:o.sourceIds}];
  const {page,errors}=await pageFor(390,{data:c});await page.goto(url+'/#/events/angels-azur-stage');await page.locator('.event-detail-tools').waitFor();assert.match(await page.locator('.event-detail-tools').innerText(),/Upcoming/);
  await page.clock.runFor(2000);assert.match(await page.locator('.event-detail-tools').innerText(),/Ongoing/);
  await page.clock.runFor(1000);assert.match(await page.locator('.event-phases').innerText(),/Unlocked/);
  await page.clock.runFor(1000);assert.match(await page.locator('.event-detail-tools').innerText(),/Ended/);assert.equal(await page.locator('[data-event-countdown]').evaluateAll(ns=>ns.some(n=>/^-/m.test(n.textContent))),false);
  assert.deepEqual(errors,[]);await page.close();report.push({clock:'exact start, unlock and end transitions passed under Playwright controlled clock'});
 }
 // Real catalog + original externally hosted art, captured at a disclosed fixed observation time.
 for(const width of [390,1280]){
  const {page,errors}=await pageFor(width,{liveArt:true});await page.goto(url+'/#/events');await page.locator('[data-event-card="angels-azur-stage"]').waitFor();
  await page.waitForFunction(()=>[...document.querySelectorAll('.event-featured img')].every(i=>i.complete),{},{timeout:25000}).catch(()=>{});
  for(const card of await page.locator('[data-event-card]').all()){await card.scrollIntoViewIfNeeded();await card.evaluate(el=>Promise.all([...el.querySelectorAll('img')].map(i=>i.complete?Promise.resolve():new Promise(resolve=>{i.addEventListener('load',resolve,{once:true});i.addEventListener('error',resolve,{once:true});setTimeout(resolve,8000);}))))};await page.evaluate(()=>scrollTo(0,0));await capture(page,'events-'+width,true);await overflow(page);await page.locator('#events-ongoing').scrollIntoViewIfNeeded();await capture(page,'featured-'+width);
  await page.locator('[data-event-card="angels-azur-stage"] h3 a').click();await page.locator('.event-detail-heading').waitFor();await capture(page,'detail-'+width);
  await page.getByRole('button',{name:'Obtainable content',exact:true}).click();await capture(page,'rewards-'+width);
  await page.getByRole('link',{name:'Liliel Angel Paratroopers/Ririsa ↗',exact:true}).click();await page.locator('.ship-profile-overview').waitFor();
  await page.waitForFunction(()=>[...document.querySelectorAll('.ship-art-preview-image,.asset-img')].every(i=>i.complete),{},{timeout:25000}).catch(()=>{});await capture(page,'ririsa-'+width);await overflow(page);
  await page.goto(url+'/#/ships/1180002');await page.locator('.ship-profile-overview').waitFor();await page.waitForFunction(()=>[...document.querySelectorAll('.ship-art-preview-image,.asset-img')].every(i=>i.complete),{},{timeout:25000}).catch(()=>{});await capture(page,'mikari-'+width);
  await page.goto(url+'/#/events');await page.getByLabel('Server region').selectOption('JP');await page.getByLabel('Status',{exact:true}).selectOption('unknown');await capture(page,'upcoming-jp-'+width,true);
  await page.getByRole('button',{name:'Reset filters',exact:true}).click();await page.getByLabel('Status',{exact:true}).selectOption('ended');await page.getByRole('button',{name:'Timeline',exact:true}).click();await capture(page,'archive-'+width,true);
  await page.goto(url+'/#/events/divergent-chessboard');await page.getByRole('button',{name:'History',exact:true}).click();await capture(page,'history-'+width);assert.deepEqual(errors,[]);await page.close();
 }
 writeFileSync(out+'/report.json',JSON.stringify({observationTime:'2026-11-16T04:00:00Z',catalog:'production, partial (8 identities / 34 occurrences)',externalData:'unavailable by design; art requested from real source URLs',results:report},null,2));
 console.log('PASS CHRONICLE: four responsive interaction sessions; catalog retry; controlled launch/unlock/end transitions; two real-art screenshot sessions (18 captures).');
}finally{await browser.close();server.close();}
