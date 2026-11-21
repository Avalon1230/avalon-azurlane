import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve,dirname,basename} from 'node:path';
import {releaseErrors} from '../scripts/release-consistency.mjs';
import {createHash} from 'node:crypto';
import {verifyDeployment} from '../scripts/verify-deployment.mjs';
import {finalizedDocuments,finalizeRelease} from '../scripts/finalize-release.mjs';
import {buildRelease} from '../scripts/build-release.mjs';
import {readReleaseDocuments,releaseDocumentPaths} from '../scripts/release-documents.mjs';

// Synthetic approval URL is test input only; no real approval or release is inferred.
const options={date:'2026-11-20',approval:'https://github.com/Avalon1230/avalon-azurlane/pull/999#issuecomment-1'};
function preview(){return {
 metadata:{schemaVersion:1,version:'1.2.3',releasedVersion:'1.2.2',status:'unreleased',releasedMain:'a'.repeat(40)},
 pkg:{version:'1.2.3'},
 readme:'**Release status:** The live release is v1.2.2. v1.2.3 Operation TEST is unreleased and awaits Commander authorization.\n',
 changelog:'# Changelog\n\n## [1.2.3] - 2026-11-19\n\nUnreleased; Commander authorization required.\n\n### Operation TEST\n\n- Corrected release state.\n\n## [1.2.2] - 2026-11-18\n\nOlder release history.\n',
 status:'# Status\n\n_Last updated: 2026-11-19._\n\n## Active development — v1.2.3 Operation TEST (unreleased)\n\nAwaiting authorization.\n\n## Current release — v1.2.2\n\nPrevious live version.\n\n## Historical development — v1.2.1\n\nUnreleased at that time.\n',
 html:'<meta name="avalon-version" content="1.2.3">'
};}
const released=()=>finalizedDocuments(preview(),options);
test('both valid document states pass, with preview barred from release preflight',()=>{
 assert.deepEqual(releaseErrors(preview()),[]);
 assert.deepEqual(releaseErrors(released(),{requireReleased:true}),[]);
 assert(releaseErrors(preview(),{requireReleased:true}).includes('deployment requires a finalized released build'));
});
test('QA reproduction: flipping only status cannot pass released validation',()=>{
 const d=preview();d.metadata.status='released';const errors=releaseErrors(d);
 for(const label of ['releasedVersion must equal version when released','released changelog retains development status','README retains development status or stale release date','released project status retains active development'])assert(errors.includes(label),label);
});
for(const [label,mutate] of [
 ['old releasedVersion',d=>{d.metadata.releasedVersion='1.2.2';}],
 ['old package',d=>{d.pkg.version='1.2.2';}],
 ['old README live version',d=>{d.readme=d.readme.replace('live release is v1.2.3','live release is v1.2.2');}],
 ['README preview claim',d=>{d.readme=d.readme.replace('released on','Preview released on');}],
 ['old changelog heading',d=>{d.changelog=d.changelog.replace('[1.2.3]','[1.2.2]');}],
 ['changelog Unreleased claim',d=>{d.changelog=d.changelog.replace('Released on','Unreleased; Released on');}],
 ['old current handoff',d=>{d.status=d.status.replace('Current release — v1.2.3','Current release — v1.2.2');}],
 ['duplicate current handoff',d=>{d.status+='\n## Current release — v1.2.3\n';}],
 ['active handoff retained',d=>{d.status+='\n## Active development — v1.2.3 (unreleased)\n';}],
 ['old HTML',d=>{d.html=d.html.replace('1.2.3','1.2.2');}],
 ['old releasedMain',d=>{d.metadata.releasedMain='a'.repeat(40);}],
 ['invalid date',d=>{d.metadata.releaseDate='2026-02-30';}],
 ['missing approval record',d=>{delete d.metadata.releaseApproval;}],
 ['stale README date',d=>{d.readme=d.readme.replace('2026-11-20','2026-11-19');}],
 ['stale changelog date',d=>{d.changelog=d.changelog.replace('2026-11-20','2026-11-19');}],
 ['stale handoff date',d=>{d.status=d.status.replace('Released on 2026-11-20','Released on 2026-11-19');}]
])test('released state rejects '+label,()=>{const d=released();mutate(d);assert(releaseErrors(d).length>0);});
for(const [label,mutate] of [
 ['equal live version',d=>{d.metadata.releasedVersion=d.metadata.version;}],
 ['older development version',d=>{d.metadata.releasedVersion='2.0.0';}],
 ['README old development version',d=>{d.readme=d.readme.replace('v1.2.3','v1.2.30');}],
 ['missing changelog Unreleased',d=>{d.changelog=d.changelog.replace('Unreleased;','Released;');}],
 ['old active handoff',d=>{d.status=d.status.replace('Active development — v1.2.3','Active development — v1.2.2');}],
 ['wrong schema',d=>{d.metadata.schemaVersion=2;}],
 ['unknown state',d=>{d.metadata.status='preview';}],
 ['premature release date',d=>{d.metadata.releaseDate=options.date;}]
])test('unreleased state rejects '+label,()=>{const d=preview();mutate(d);assert(releaseErrors(d).length>0);});
test('current release checks cannot be satisfied by historical headings',()=>{
 const d=released();d.status=d.status.replace('Current release — v1.2.3','Previous release — v1.2.3');
 assert(releaseErrors(d).includes('project current release is stale'));
});
test('release descriptions can discuss Preview behavior without claiming preview release status',()=>{
 const d=released();d.changelog=d.changelog.replace('- Corrected release state.','- Corrected Preview behavior for unreleased builds.');
 assert.deepEqual(releaseErrors(d),[]);
});
test('generated version, state and fingerprint must agree in both states',()=>{
 for(const docs of [preview(),released()]){
  const d=structuredClone(docs);d.build={version:d.metadata.version,status:d.metadata.status,fingerprint:'a'.repeat(64)};
  d.deployment={schemaVersion:1,...d.build};assert.deepEqual(releaseErrors(d),[]);
  for(const [target,key,value] of [['build','status','wrong'],['deployment','status','wrong'],['build','version','0.0.0'],['deployment','version','0.0.0'],['build','fingerprint','b'.repeat(64)]]){
   const changed=structuredClone(d);changed[target][key]=value;assert(releaseErrors(changed).length>0);
  }
 }
});
test('finalizer retains historical evidence, records previous main honestly and rejects repeated/invalid transitions',()=>{
 const original=preview(),snapshot=structuredClone(original),d=finalizedDocuments(original,options);
 assert.deepEqual(original,snapshot);assert.equal(d.metadata.previousReleasedMain,original.metadata.releasedMain);
 assert.equal(d.metadata.previousReleasedVersion,'1.2.2');assert(!Object.hasOwn(d.metadata,'releasedMain'));
 assert(d.status.includes('## Historical development — v1.2.3'));assert(d.status.includes('## Previous release — v1.2.2'));
 assert.throws(()=>finalizedDocuments(d,options),/already finalized/);
 assert.throws(()=>finalizedDocuments(original,{...options,date:'2026-02-30'}));
 assert.throws(()=>finalizedDocuments(original,{...options,approval:'https://example.com/approval'}));
});
test('filesystem rehearsal: dry run changes nothing; write regenerates both artifacts and stale output fails',async t=>{
 const root=await mkdtemp(resolve(tmpdir(),'avalon-release-test-'));
 t.after(async()=>{assert.equal(dirname(root),resolve(tmpdir()));assert(basename(root).startsWith('avalon-release-test-'));await rm(root,{recursive:true,force:true});});
 const docs=preview();
 for(const [key,path] of Object.entries(releaseDocumentPaths)){
  const dest=resolve(root,path);await mkdir(dirname(dest),{recursive:true});
  await writeFile(dest,typeof docs[key]==='string'?docs[key]:JSON.stringify(docs[key]));
 }
 await mkdir(resolve(root,'src'));await mkdir(resolve(root,'assets'));
 await writeFile(resolve(root,'src/app.js'),'// preserved application\n');
 await buildRelease(root);const before=await readReleaseDocuments(root);
 await finalizeRelease(root,options);assert.deepEqual(await readReleaseDocuments(root),before);
 await finalizeRelease(root,{...options,write:true});const after=await readReleaseDocuments(root);
 assert.deepEqual(releaseErrors(after,{requireReleased:true}),[]);
 assert.notEqual(after.build.fingerprint,before.build.fingerprint);assert.equal(after.build.status,'released');
 assert.equal(await readFile(resolve(root,'src/app.js'),'utf8'),'// preserved application\n');
 await buildRelease(root,{check:true});
 await writeFile(resolve(root,'src/release-data.js'),'// stale output\n');
 await assert.rejects(buildRelease(root,{check:true}),/is stale/);
});

function servedFixture(state='released'){
 const metadata=state==='released'?released().metadata:preview().metadata;
 const body={'data/release-status.json':JSON.stringify(metadata)};
 for(let i=0;i<21;i++)body['src/fixture-'+i+'.js']='// fixture '+i;
 const hash=s=>createHash('sha256').update(s).digest('hex');
 const files=Object.fromEntries(Object.entries(body).map(([path,text])=>[path,hash(text)]));
 const manifest={schemaVersion:1,version:metadata.version,status:state,fingerprint:hash(JSON.stringify(files)),files};
 body['data/deployment.json']=JSON.stringify(manifest);
 body['src/release-data.js']='export const BUILD='+JSON.stringify({version:manifest.version,status:state,fingerprint:manifest.fingerprint})+';\n';
 return {body,manifest,fetcher:async url=>new Response(body[url.pathname.slice(1)]??'',{status:Object.hasOwn(body,url.pathname.slice(1))?200:404})};
}
test('served finalized build must match its expected commit and generated module',async()=>{
 const f=servedFixture();assert.equal((await verifyDeployment('https://fixture.invalid/',{requireReleased:true,expected:f.manifest,fetcher:f.fetcher})).status,'released');
});
test('release deployment probe rejects a served preview',async()=>{
 const f=servedFixture('unreleased');await assert.rejects(verifyDeployment('https://fixture.invalid/',{requireReleased:true,expected:f.manifest,fetcher:f.fetcher}),/still a preview/);
});
test('release deployment probe rejects stale generated BUILD status',async()=>{
 const f=servedFixture();f.body['src/release-data.js']=f.body['src/release-data.js'].replace('released','unreleased');
 await assert.rejects(verifyDeployment('https://fixture.invalid/',{fetcher:f.fetcher}),/BUILD disagrees/);
});
test('release deployment probe rejects another otherwise-consistent build',async()=>{
 const f=servedFixture();await assert.rejects(verifyDeployment('https://fixture.invalid/',{requireReleased:true,expected:{...f.manifest,fingerprint:'b'.repeat(64)},fetcher:f.fetcher}),/expected finalized commit/);
});
test('release deployment probe rejects changed served assets',async()=>{
 const f=servedFixture();f.body['src/fixture-0.js']='// stale';await assert.rejects(verifyDeployment('https://fixture.invalid/',{fetcher:f.fetcher}),/does not match/);
});
test('release deployment probe rejects stale served live-version metadata',async()=>{
 const f=servedFixture();const metadata=JSON.parse(f.body['data/release-status.json']);metadata.releasedVersion='1.2.2';f.body['data/release-status.json']=JSON.stringify(metadata);
 await assert.rejects(verifyDeployment('https://fixture.invalid/',{requireReleased:true,expected:f.manifest,fetcher:f.fetcher}),/live version is stale/);
});
