/** Read-only verification of a deployed static build, including its module/data graph. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const arg=process.argv.indexOf('--url'),base=arg>=0?process.argv[arg+1]:null;
assert(base,'Usage: node scripts/verify-deployment.mjs --url https://host/path/');
const root=new URL(base);assert(['http:','https:'].includes(root.protocol));
const get=async file=>{const r=await fetch(new URL(file,root),{cache:'no-store',signal:AbortSignal.timeout(30000)});assert.equal(r.status,200,file);return Buffer.from(await r.arrayBuffer());};
const manifest=JSON.parse(await get('data/deployment.json'));assert.equal(manifest.schemaVersion,1);
assert(manifest.files&&Object.keys(manifest.files).length>20);
for(const [file,digest] of Object.entries(manifest.files)){
 assert(/^(?:src\/|assets\/|data\/|index\.html$|CHANGELOG\.md$)/.test(file)&&!file.includes('..'));
 assert.equal(createHash('sha256').update(await get(file)).digest('hex'),digest,file+' does not match deployment manifest');
}
console.log('PASS deployed '+manifest.version+' '+manifest.fingerprint+' ('+Object.keys(manifest.files).length+' matching files)');
