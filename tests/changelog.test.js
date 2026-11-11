import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { changelogToHtml } from '../src/changelog.js';

test('renders dated release sections and change categories', () => {
  const result = changelogToHtml('# Changelog\n\n## [0.2.1] - 2026-11-10\n\n### Added\n- **Updates** page\n');
  assert.match(result, /<section class="release-card">/);
  assert.match(result, /<h2>\[0\.2\.1\] - 2026-11-10<\/h2>/);
  assert.match(result, /<h3>Added<\/h3>/);
  assert.match(result, /<li><strong>Updates<\/strong> page<\/li>/);
});

test('escapes HTML in changelog data and closes lists', () => {
  const result = changelogToHtml('## Release\n### Added\n- <script>alert("x")</script>\n## Next\n- Item');
  assert.doesNotMatch(result, /<script>/);
  assert.match(result, /&lt;script&gt;/);
  assert.equal((result.match(/<ul>/g)||[]).length, 2);
  assert.equal((result.match(/<\/ul>/g)||[]).length, 2);
  assert.equal((result.match(/<\/section>/g)||[]).length, 2);
});

test('project release history stays newest-first in CHANGELOG.md', () => {
  const changelog = readFileSync(new URL('../CHANGELOG.md', import.meta.url), 'utf8');
  const versions = [...changelog.matchAll(/^## \[(\d+)\.(\d+)\.(\d+)\]/gm)]
    .map(([,major,minor,patch]) => [Number(major),Number(minor),Number(patch)]);
  assert.ok(versions.length >= 2, 'expected multiple recorded releases');
  for (let i = 1; i < versions.length; i++) {
    const previous = versions[i-1];
    const current = versions[i];
    const descending = previous[0] > current[0] ||
      (previous[0] === current[0] && previous[1] > current[1]) ||
      (previous[0] === current[0] && previous[1] === current[1] && previous[2] > current[2]);
    assert.ok(descending, `release ${current.join('.')} must appear below ${previous.join('.')}`);
  }
});


test('every semantic version has exactly one release heading and one rendered release card', () => {
  const changelog = readFileSync(new URL('../CHANGELOG.md', import.meta.url), 'utf8');
  const headings = [...changelog.matchAll(/^## (.+)$/gm)].map(m=>m[1]);
  assert.ok(headings.length >= 20);
  const versions = headings.map(title=>{
    const match = title.match(/^\[(\d+\.\d+\.\d+)\] - \d{4}-\d{2}-\d{2}$/);
    assert.ok(match, 'release heading must be canonical: '+title);
    return match[1];
  });
  assert.equal(new Set(versions).size, versions.length, 'duplicate version heading');
  assert.equal(versions.filter(x=>x==='0.8.5').length,1);
  assert.equal(versions.filter(x=>x==='0.8.6').length,1);
  const html = changelogToHtml(changelog);
  assert.equal((html.match(/<section class="release-card">/g)||[]).length,headings.length);
  assert.equal((html.match(/<h2>\[0\.8\.6\]/g)||[]).length,1);
  assert.equal((html.match(/<h2>\[0\.8\.5\]/g)||[]).length,1);
});
test('original releases and post-release fixes retain their provenance in consolidated sections',()=>{
  const changelog = readFileSync(new URL('../CHANGELOG.md', import.meta.url), 'utf8');
  const release86 = changelog.split('## [0.8.6]')[1].split('## [0.8.5]')[0];
  const release85 = changelog.split('## [0.8.5]')[1].split('## [0.8.4]')[0];
  for(const term of ['Source evidence and explainability','WIP clarity hotfix',
    'Collaboration series navigation','WIP feature labels','pull/23','pull/24'])
    assert.ok(release86.includes(term),'missing v0.8.6 section history: '+term);
  for(const term of ['### Added','Augment artwork and filter hotfix','pull/21','pull/22'])
    assert.ok(release85.includes(term),'missing v0.8.5 section history: '+term);
});
