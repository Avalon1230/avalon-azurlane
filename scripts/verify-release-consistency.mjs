import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {releaseErrors} from './release-consistency.mjs';
const read=f=>readFile(new URL('../'+f,import.meta.url),'utf8');
const [metadata,pkg,readme,changelog,status,html]=await Promise.all(['data/release-status.json','package.json','README.md','CHANGELOG.md','docs/PROJECT_STATUS.md','index.html'].map(read));
assert.deepEqual(releaseErrors({metadata:JSON.parse(metadata),pkg:JSON.parse(pkg),readme,changelog,status,html}),[]);
console.log('PASS release documentation and package consistency');
