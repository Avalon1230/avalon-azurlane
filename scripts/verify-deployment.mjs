/** Read-only verification of a served static build and its generated release identity. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {readReleaseDocuments} from './release-documents.mjs';
import {releaseErrors} from './release-consistency.mjs';
const hash=value=>createHash('sha256').update(value).digest('hex');
export async function verifyDeployment(base,{requireReleased=false,expected=null,fetcher=fetch}={}){
 const root=new URL(base);assert(['http:','https:'].includes(root.protocol));
 const get=async file=>{const r=await fetcher(new URL(file,root),{cache:'no-store',signal:AbortSignal.timeout(30000)});assert.equal(r.status,200,file);return Buffer.from(await r.arrayBuffer());};
 const manifest=JSON.parse(await get('data/deployment.json'));assert.equal(manifest.schemaVersion,1);
 assert(manifest.files&&Object.keys(manifest.files).length>20);
 assert.equal(hash(JSON.stringify(manifest.files)),manifest.fingerprint,'manifest fingerprint is invalid');
 const metadata=JSON.parse(await get('data/release-status.json'));
 assert.equal(metadata.version,manifest.version,'served version disagrees');
 assert.equal(metadata.status,manifest.status,'served status disagrees');
 const module=(await get('src/release-data.js')).toString('utf8');
 const build=JSON.parse(module.match(/^export const BUILD=(\{[^\n]+\});$/m)?.[1]||'null');
 assert.deepEqual(build,{version:manifest.version,status:manifest.status,fingerprint:manifest.fingerprint},'served BUILD disagrees');
 if(requireReleased){
  assert.equal(manifest.status,'released','served build is still a preview');
  assert.equal(metadata.releasedVersion,metadata.version,'served live version is stale');
  assert(expected,'Finalized local build is required for release verification');
  assert.equal(manifest.fingerprint,expected.fingerprint,'served build is not the expected finalized commit');
  assert.equal(manifest.version,expected.version);assert.equal(manifest.status,expected.status);
 }
 for(const [file,digest] of Object.entries(manifest.files)){
  assert(/^(?:src\/|assets\/|data\/|index\.html$|CHANGELOG\.md$)/.test(file)&&!file.includes('..'));
  assert.equal(hash(await get(file)),digest,file+' does not match deployment manifest');
 }
 return manifest;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const arg=process.argv.indexOf('--url'),base=arg>=0?process.argv[arg+1]:null;
 assert(base,'Usage: node scripts/verify-deployment.mjs --url https://host/path/ [--require-released]');
 const requireReleased=process.argv.includes('--require-released');let expected=null;
 if(requireReleased){const docs=await readReleaseDocuments(fileURLToPath(new URL('..',import.meta.url)));assert.deepEqual(releaseErrors(docs,{requireReleased:true}),[]);expected=docs.deployment;}
 const manifest=await verifyDeployment(base,{requireReleased,expected});
 console.log('PASS deployed '+manifest.version+' '+manifest.status+' '+manifest.fingerprint+' ('+Object.keys(manifest.files).length+' matching files)');
}
