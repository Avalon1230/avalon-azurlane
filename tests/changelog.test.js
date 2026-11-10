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
