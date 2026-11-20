import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {releaseErrors} from './release-consistency.mjs';
import {readReleaseDocuments} from './release-documents.mjs';
const documents=await readReleaseDocuments(fileURLToPath(new URL('..',import.meta.url)));
assert.deepEqual(releaseErrors(documents,{requireReleased:process.argv.includes('--require-released')}),[]);
console.log('PASS '+documents.metadata.status+' release documentation, package and generated metadata consistency');
