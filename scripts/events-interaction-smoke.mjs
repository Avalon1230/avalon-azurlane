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
 await page.clock.install({time:new Date('2026-11-17T14:35:59Z')});await page.clock.pauseAt(new Date('2026-11-17T14:36:00Z'));
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
async function wholePersonalName(page,name){
 const result=await page.locator('.ship-profile-identity h1').evaluate((el,name)=>{const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let node;while(node=walker.nextNode()){const i=node.textContent.indexOf(name);if(i<0)continue;const range=document.createRange();range.setStart(node,i);range.setEnd(node,i+name.length);const rects=[...range.getClientRects()];return {lines:new Set(rects.map(r=>Math.round(r.top))).size,inside:rects.every(r=>r.left>=el.getBoundingClientRect().left-1&&r.right<=el.getBoundingClientRect().right+1)};}return null;},name);
 assert.deepEqual(result,{lines:1,inside:true},name+' remains whole inside the profile heading');
}
async function openFilters(page){
 const toggle=page.locator('[data-action="events-filters-toggle"]');await toggle.waitFor();
 if(await toggle.getAttribute('aria-expanded')==='false')await toggle.click();
 await page.locator('#event-region').waitFor({state:'visible'});
}
async function closeFilters(page){
 const toggle=page.locator('[data-action="events-filters-toggle"]');await toggle.waitFor();
 if(await toggle.getAttribute('aria-expanded')==='true')await toggle.click();
}
async function saved(page){assert.equal(await page.evaluate(()=>localStorage.getItem('avalon.azurlane.loadouts.v1')),loadouts,'Saved six-slot loadout storage remains identical');}
async function capture(page,name,fullPage=false){
 // Lazy artwork starts loading when a section is revealed. Capture settled pixels,
 // not an intermediate progressive image, without waiting on off-screen assets.
 const pending=await page.locator('img').evaluateAll(async images=>{
  const visible=images.filter(img=>{const r=img.getBoundingClientRect();return r.width&&r.height&&r.bottom>0&&r.top<innerHeight;});
  for(const img of visible)img.loading='eager';
  await Promise.all(visible.map(async img=>{
   if(!img.complete)await new Promise(resolve=>{const finish=()=>{clearTimeout(timer);resolve();};const timer=setTimeout(finish,12000);img.addEventListener('load',finish,{once:true});img.addEventListener('error',finish,{once:true});});
   if(img.complete&&img.naturalWidth)await img.decode().catch(()=>{});
  }));return visible.filter(img=>img.isConnected&&!img.complete).map(img=>img.currentSrc);
 });
 assert.deepEqual(pending,[],name+': visible source artwork must settle before screenshot');
 await page.screenshot({path:out+'/'+name+'.png',fullPage});
}
try{
 for(const width of [360,390,768,1280]){
  const {page,errors}=await pageFor(width);
  await page.goto(url+'/#/events');await page.locator('[data-event-card="angels-azur-stage"]').waitFor();
  assert.equal(await page.locator('[data-action="events-filters-toggle"]').getAttribute('aria-expanded'),'false');
  const toggle=page.locator('[data-action="events-filters-toggle"]');
  await toggle.focus();await page.keyboard.press('Enter');assert.equal(await toggle.getAttribute('aria-expanded'),'true');assert.equal(await toggle.evaluate(el=>el===document.activeElement),true);
  await page.keyboard.press('Tab');assert.equal(await page.locator('#event-query').evaluate(el=>el===document.activeElement),true);
  await page.getByLabel('Search events & rewards').fill('Frostfall');await page.getByLabel('Server region').selectOption('JP');await page.getByLabel('Status',{exact:true}).selectOption('ended');await page.getByLabel('Chronology').selectOption('oldest');await page.getByLabel('Display timezone').selectOption('UTC');
  await toggle.focus();await page.keyboard.press('Space');assert.equal(await toggle.getAttribute('aria-expanded'),'false');assert.equal(await page.locator('#event-controls').isVisible(),false);assert.equal(await toggle.evaluate(el=>el===document.activeElement),true);
  assert.match(await toggle.innerText(),/JP server · Search: “Frostfall” · Ended · Oldest first · Timezone UTC/);
  assert.equal(await page.getByRole('button',{name:'Timeline',exact:true}).isVisible(),true);await page.clock.runFor(1000);assert.doesNotMatch(await page.locator('#toast').innerText(),/Event schedules have updated/);
  await page.keyboard.press('Enter');assert.equal(await page.locator('#event-query').inputValue(),'Frostfall');assert.equal(await page.locator('#event-region').inputValue(),'JP');assert.equal(await page.locator('#event-status').inputValue(),'ended');
  await page.getByRole('button',{name:'Reset filters',exact:true}).click();
  assert.equal(await page.locator('#event-region').inputValue(),'EN');assert.equal(await page.locator('#event-zone').inputValue(),'Asia/Manila');
  assert.equal(await page.getByRole('heading',{name:'Ongoing',exact:true}).count(),1);assert.equal(await page.getByRole('heading',{name:'Upcoming',exact:true}).count(),1);assert.equal(await page.getByRole('heading',{name:'Past Events',exact:true}).count(),1);assert.equal(await page.getByRole('heading',{name:'War Archives',exact:true}).count(),1);
  await overflow(page);await saved(page);
  const past=page.locator('section[aria-labelledby="events-past"]'),war=page.locator('section[aria-labelledby="events-war-archives"]');
  assert.equal(await past.locator('[data-event-card="the-fools-scales"]').count(),1);assert.equal(await war.locator('[data-event-card="the-fools-scales"]').count(),1);
  assert.equal(await war.locator('[data-event-card="divergent-chessboard"]').count(),1);
  assert.equal(await war.locator('[data-event-card="tempesta-corridor-of-fog"]').count(),0);
  assert.equal(await war.locator('[data-event-card]').count(),53);
  await past.locator('[data-event-card="the-fools-scales"] h3 a').click();await page.locator('#event-rewards').waitFor();assert.match(await page.locator('#event-rewards').innerText(),/This run has ended/);
  await page.goBack();await war.locator('[data-event-card="the-fools-scales"] h3 a').click();await page.locator('#event-rewards').waitFor();assert.match(await page.locator('#event-rewards').innerText(),/available in War Archives/);assert.doesNotMatch(await page.locator('#event-rewards').innerText(),/Painlevé/);
  await page.goto(url+'/#/events');await openFilters(page);
  for(const region of ['JP','CN']){await page.getByLabel('Server region').selectOption(region);assert.equal(await war.locator('[data-event-card]').count(),51);assert.equal(await war.locator('[data-event-card="frostfall"]').count(),0);}
  await page.getByRole('button',{name:'Reset filters',exact:true}).click();
  await page.getByLabel('Search events & rewards').fill('Mikari');assert.equal(await page.locator('[data-event-card]').count(),1);assert.equal(await page.locator('#event-query').evaluate(el=>el===document.activeElement),true);
  await page.getByRole('button',{name:'Reset filters',exact:true}).click();
  await page.getByLabel('Server region').selectOption('JP');await page.getByLabel('Search events & rewards').fill('Effulgence');await page.getByLabel('Status',{exact:true}).selectOption('upcoming');
  assert.match(await page.locator('[data-event-card]').innerText(),/Effulgence Before Eclipse/);assert.match(await page.locator('[data-event-card]').innerText(),/Planned War Archives addition · not available yet/);assert.doesNotMatch(await page.locator('[data-event-card]').innerText(),/Permanent content/);assert.equal(await page.locator('[data-event-countdown]').count(),0);
  await page.reload();await openFilters(page);assert.equal(await page.locator('#event-region').inputValue(),'JP');assert.equal(await page.locator('#event-status').inputValue(),'upcoming');
  await page.getByRole('button',{name:'Reset filters',exact:true}).click();
  await page.getByLabel('Year',{exact:true}).selectOption('2018');await page.getByLabel('Chronology').selectOption('oldest');
  assert.ok(await page.locator('[data-event-card]').count()>0);
  await page.getByRole('button',{name:'Timeline',exact:true}).click();assert.ok(await page.locator('.event-timeline>li').count()>0);
  await page.getByRole('button',{name:'Reset filters',exact:true}).click();await page.getByLabel('Category',{exact:true}).selectOption('research');assert.equal(await page.locator('[data-event-card]').count(),1);
  await page.getByRole('button',{name:'Reset filters',exact:true}).click();await page.locator('[data-event-card="angels-azur-stage"] h3 a').click();
  await page.getByRole('heading',{name:'Schedule & deadlines',exact:true}).waitFor();assert.match(await page.locator('.event-schedules-compact').innerText(),/27 Nov 2026, 14:59/);
  assert.equal(await page.getByLabel('Content for server').inputValue(),'EN');await overflow(page);
  await page.getByRole('button',{name:'Obtainable content',exact:true}).focus();await page.keyboard.press('Enter');
  await page.getByRole('link',{name:'Liliel Angel Paratroopers/Ririsa ↗',exact:true}).click();await page.locator('.ship-profile-overview').waitFor();
  assert.equal(await page.evaluate(()=>window.scrollY),0,'Event profile link starts at the profile header');await wholePersonalName(page,'Ririsa');assert.equal(await page.locator('[data-loadout-slot]').count(),6);assert.match(await page.locator('#app-content').innerText(),/5123|5,123/);assert.match(await page.locator('#app-content').innerText(),/Liliel/);await saved(page);await overflow(page);
  await page.goBack();await page.getByRole('heading',{name:'Schedule & deadlines',exact:true}).waitFor();
  await page.getByRole('link',{name:'Miriella’s Bow ↗',exact:true}).click();await page.getByRole('dialog').waitFor();assert.match(await page.getByRole('dialog').innerText(),/25 → 35/);await overflow(page);
  await page.getByRole('button',{name:'Close augment details',exact:true}).focus();await page.keyboard.press('Shift+Tab');assert.equal(await page.getByRole('button',{name:'Close',exact:true}).evaluate(el=>el===document.activeElement),true);await page.keyboard.press('Tab');assert.equal(await page.getByRole('button',{name:'Close augment details',exact:true}).evaluate(el=>el===document.activeElement),true);await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0);
  await page.goto(url+'/#/events/the-fools-scales');await page.locator('#event-occurrence').waitFor();assert.match(await page.locator('#event-rewards').innerText(),/Permanent addition/);
  await page.locator('#event-occurrence').selectOption({label:'Original release · 2023-08-17'});assert.match(await page.locator('#event-rewards').innerText(),/This run has ended/);assert.equal(await page.locator('#event-rewards a[href="#/ships/80702"]').count(),1);
  await page.goto(url+'/#/ships/1180002');await page.locator('.ship-profile-overview').waitFor();await wholePersonalName(page,'Mikari');await overflow(page);
  await page.goto(url+'/#/events/does-not-exist');await page.getByRole('heading',{name:'Event not found'}).waitFor();await saved(page);assert.deepEqual(errors,[]);
  report.push({width,checks:'routes, offline profiles, exact IDs, filters, persistence, region dates, timeline, history, keyboard, image failure and overflow passed'});await page.close();
 }
 // Scope changes are user navigation, not publisher schedule updates.
 {
  const {page}=await pageFor(390);await page.goto(url+'/#/events');await openFilters(page);
  for(const region of ['JP','EN']){await page.getByLabel('Server region').selectOption(region);await page.clock.runFor(1000);assert.doesNotMatch(await page.locator('#toast').innerText(),/Event schedules have updated/);}
  await page.locator('[data-event-card="angels-azur-stage"] h3 a').click();await page.locator('.event-detail-heading').waitFor();await page.clock.runFor(1000);assert.doesNotMatch(await page.locator('#toast').innerText(),/Event schedules have updated/);
  await page.getByRole('link',{name:'← All events',exact:true}).click();await openFilters(page);await page.clock.runFor(1000);assert.doesNotMatch(await page.locator('#toast').innerText(),/Event schedules have updated/);await page.close();
  report.push({scope:'EN/JP and index/detail navigation produces no false schedule notifications'});
 }
 // Fail closed, then retry through the actual handler.
 {
  const {page,errors}=await pageFor(390,{failCatalog:true});await page.goto(url+'/#/events');await page.getByRole('heading',{name:'Event records are unavailable'}).waitFor();
  await page.route('**/data/events/catalog.json',r=>r.fulfill({contentType:'application/json',body:JSON.stringify(catalog)}));await page.getByRole('button',{name:'Retry',exact:true}).click();await page.locator('[data-event-card="angels-azur-stage"]').waitFor();await saved(page);assert.deepEqual(errors,[]);await page.close();
 }
 // Synthetic schedules are test fixtures only; production catalog is unchanged.
 {
  const c=structuredClone(catalog),e=c.events[0],o=e.occurrences.find(o=>o.region==='EN'),at=value=>({kind:'exact',zone:'UTC',value,sourceIds:o.sourceIds});
  o.start=at('2026-11-17T14:36:02Z');o.end=at('2026-11-17T14:36:04Z');o.releaseState='announced';o.phases=[{id:'fixture-unlock',label:'Controlled mission unlock',kind:'mission',at:at('2026-11-17T14:36:03Z'),sourceIds:o.sourceIds}];
  const {page,errors}=await pageFor(390,{data:c});await page.goto(url+'/#/events/angels-azur-stage');await page.locator('.event-detail-tools').waitFor();assert.match(await page.locator('.event-detail-tools').innerText(),/Upcoming/);
  await page.clock.runFor(2000);assert.match(await page.locator('.event-detail-tools').innerText(),/Ongoing/);assert.match(await page.locator('#toast').innerText(),/Event schedules have updated/);
  await page.locator('#event-schedule-toggle').click();
  await page.clock.runFor(1000);assert.match(await page.locator('.event-phases').innerText(),/Unlocked/);
  await page.clock.runFor(1000);assert.match(await page.locator('.event-detail-tools').innerText(),/Ended/);assert.equal(await page.locator('[data-event-countdown]').evaluateAll(ns=>ns.some(n=>/^-/m.test(n.textContent))),false);
  assert.deepEqual(errors,[]);await page.close();report.push({clock:'exact start, unlock and end transitions passed under Playwright controlled clock'});
 }
 // Real catalog + original externally hosted art, captured at a disclosed fixed observation time.
 for(const width of [360,390,1280]){
  const {page,errors}=await pageFor(width,{liveArt:true});await page.goto(url+'/#/events');await page.locator('[data-event-card="angels-azur-stage"]').waitFor();
  await page.waitForFunction(()=>[...document.querySelectorAll('.event-featured img')].every(i=>i.complete),{},{timeout:25000}).catch(()=>{});
  await page.evaluate(()=>scrollTo(0,0));await capture(page,'events-collapsed-'+width);await overflow(page);await openFilters(page);await capture(page,'events-expanded-'+width);await closeFilters(page);await page.locator('#events-ongoing').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));await capture(page,'ongoing-'+width);
  await page.locator('[data-event-card="angels-azur-stage"] h3 a').click();await page.locator('.event-detail-heading').waitFor();await capture(page,'detail-'+width);
  await page.getByRole('button',{name:'Obtainable content',exact:true}).click();await capture(page,'rewards-'+width);
  await page.getByRole('link',{name:'Liliel Angel Paratroopers/Ririsa ↗',exact:true}).click();await page.locator('.ship-profile-overview').waitFor();
  await page.waitForFunction(()=>[...document.querySelectorAll('.ship-art-preview-image,.asset-img')].every(i=>i.complete),{},{timeout:25000}).catch(()=>{});await capture(page,'ririsa-'+width);await overflow(page);
  await page.goto(url+'/#/ships/1180002');await page.locator('.ship-profile-overview').waitFor();await page.waitForFunction(()=>[...document.querySelectorAll('.ship-art-preview-image,.asset-img')].every(i=>i.complete),{},{timeout:25000}).catch(()=>{});await capture(page,'mikari-'+width);
  await page.goto(url+'/#/events');await openFilters(page);await page.getByLabel('Server region').selectOption('JP');await page.getByLabel('Search events & rewards').fill('Effulgence');await page.getByLabel('Status',{exact:true}).selectOption('upcoming');await closeFilters(page);await page.locator('#events-upcoming').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));await capture(page,'upcoming-jp-'+width);await openFilters(page);
  await page.getByRole('button',{name:'Reset filters',exact:true}).click();await page.getByLabel('Status',{exact:true}).selectOption('ended');await page.getByRole('button',{name:'Timeline',exact:true}).click();await closeFilters(page);await page.locator('#events-past').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));await capture(page,'past-'+width);await openFilters(page);
  await page.getByRole('button',{name:'Reset filters',exact:true}).click();await closeFilters(page);await page.locator('#events-war-archives').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));await capture(page,'war-archives-'+width);
  await page.locator('section[aria-labelledby="events-past"] [data-event-card="the-fools-scales"] h3 a').click();await page.getByRole('button',{name:'Obtainable content',exact:true}).click();await capture(page,'past-detail-'+width);
  await page.goto(url+'/#/events');await openFilters(page);await page.getByLabel('Server region').selectOption('CN');await page.getByLabel('Search events & rewards').fill('Visitors Dyed in Red');await page.getByLabel('Year',{exact:true}).selectOption('2018');await page.getByLabel('Status',{exact:true}).selectOption('permanent');await closeFilters(page);await page.evaluate(()=>scrollTo(0,0));await capture(page,'server-summary-'+width);await overflow(page);
  await page.goto(url+'/#/events/divergent-chessboard');await page.getByRole('button',{name:'History',exact:true}).click();await capture(page,'history-'+width);assert.deepEqual(errors,[]);await page.close();
 }
 writeFileSync(out+'/report.json',JSON.stringify({observationTime:'2026-11-17T14:36:00Z',catalog:{coverage:catalog.coverage,identities:catalog.events.length,occurrences:catalog.events.flatMap(e=>e.occurrences).length},externalData:'unavailable by design; art requested from real source URLs',results:report},null,2));
 console.log('PASS CHRONICLE: four responsive interaction sessions; catalog retry; controlled launch/unlock/end transitions; three real-art screenshot sessions (39 captures).');
}finally{await browser.close();server.close();}
