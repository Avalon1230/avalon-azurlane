/** Rehearse finalization on an isolated copy, then test the actual application footer. */
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdtemp,mkdir,copyFile,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve,dirname,basename,extname,sep} from 'node:path';
import {chromium} from 'playwright';
import {readReleaseDocuments,releaseDocumentPaths} from './release-documents.mjs';
import {releaseErrors} from './release-consistency.mjs';
import {finalizeRelease} from './finalize-release.mjs';
import {buildRelease} from './build-release.mjs';
import {verifyDeployment} from './verify-deployment.mjs';

const root=resolve('.'),before=await readReleaseDocuments(root),temporary=await mkdtemp(resolve(tmpdir(),'avalon-release-browser-'));
const servers=[],report={version:before.metadata.version,repositoryStatus:before.metadata.status,checks:[]};
let browser;
async function serve(directory){
 const server=createServer(async(req,res)=>{
  const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=resolve(directory,'.'+(path==='/'?'/index.html':path));
  if(!file.startsWith(directory+sep)){res.writeHead(403).end();return;}
  try{const content=await readFile(file);res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json'})[extname(file)]||'application/octet-stream');res.end(content);}catch{res.writeHead(404).end();}
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));servers.push(server);return 'http://127.0.0.1:'+server.address().port;
}
async function footer(origin,expected,{previewBuild}={}){
 const page=await browser.newPage(),errors=[],saved=JSON.stringify({'99901':{general:{0:'fer-24140'}}});
 page.on('pageerror',error=>errors.push(error.message));
 await page.addInitScript(value=>localStorage.setItem('avalon.azurlane.loadouts.v1',value),saved);
 await page.route('**/*',route=>{
  const url=route.request().url();
  if(previewBuild&&url===origin+'/src/release-data.js')return route.fulfill({contentType:'text/javascript',body:'export const BUILD='+JSON.stringify(previewBuild)+';'});
  return url.startsWith(origin)?route.continue():route.abort();
 });
 await page.goto(origin+'/#/overview');await page.locator('.build-version').waitFor();
 const text=await page.locator('.build-version').textContent();
 assert.equal(text.includes('Preview'),expected==='unreleased');
 assert(text.startsWith('v'+before.metadata.version));
 if(expected==='released')assert.equal(text,'v'+before.metadata.version);
 assert.equal(await page.evaluate(()=>localStorage.getItem('avalon.azurlane.loadouts.v1')),saved);
 assert.deepEqual(errors,[]);report.checks.push({state:expected,label:text,savedLoadouts:'unchanged'});await page.close();
}
try{
 assert.deepEqual(releaseErrors(before),[]);await buildRelease(root,{check:true});
 const paths=new Set([...Object.keys(before.deployment.files),...Object.values(releaseDocumentPaths),'data/deployment.json','src/release-data.js']);
 for(const path of paths){const target=resolve(temporary,path);await mkdir(dirname(target),{recursive:true});await copyFile(resolve(root,path),target);}
 if(before.metadata.status==='unreleased'){
  // Fixture only: never writes to the checkout and never represents a real approval.
  await finalizeRelease(temporary,{date:'2026-11-20',approval:'https://github.com/Avalon1230/avalon-azurlane/pull/999#issuecomment-1',write:true});
 }
 const released=await readReleaseDocuments(temporary);assert.deepEqual(releaseErrors(released,{requireReleased:true}),[]);
 await buildRelease(temporary,{check:true});
 browser=await chromium.launch({headless:true,channel:'chrome'});report.browser=browser.version();
 const currentOrigin=await serve(root),releasedOrigin=await serve(temporary);
 await verifyDeployment(releasedOrigin+'/',{requireReleased:true,expected:released.deployment});
 await footer(currentOrigin,before.metadata.status);
 await footer(releasedOrigin,'released');
 // Exercise Preview even when running this suite on an already-finalized release.
 await footer(releasedOrigin,'unreleased',{previewBuild:{...released.build,status:'unreleased'}});
 assert.deepEqual(await readReleaseDocuments(root),before,'Rehearsal must not modify the checkout');
 await buildRelease(root,{check:true});
 report.finalization='Isolated copy passed complete released-state and generated-file validation; repository unchanged.';
 await mkdir(resolve(root,'.audit/release-state'),{recursive:true});await writeFile(resolve(root,'.audit/release-state/report.json'),JSON.stringify(report,null,2)+'\n');
 console.log('PASS release finalization rehearsal, released footer without Preview, preview footer and saved loadouts');
}finally{
 if(browser)await browser.close();for(const server of servers)await new Promise(r=>server.close(r));
 assert.equal(dirname(temporary),resolve(tmpdir()));assert(basename(temporary).startsWith('avalon-release-browser-'));
 await rm(temporary,{recursive:true,force:true});
}
