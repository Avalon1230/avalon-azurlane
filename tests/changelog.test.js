import test from 'node:test';
import assert from 'node:assert/strict';
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
