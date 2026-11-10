import test from 'node:test';
import assert from 'node:assert/strict';
import { SHIP_RESEARCH, EQUIPMENT_RESEARCH, RESEARCH_REFERENCES, researchForBoard } from '../src/research.js';

test('each published source selection includes explicit context, evidence and attribution', () => {
  for (const record of [...SHIP_RESEARCH, ...EQUIPMENT_RESEARCH]) {
    assert.ok(record.name && record.context && record.grade && record.why && record.note);
    assert.ok(RESEARCH_REFERENCES[record.source]?.url.startsWith('https://'));
    assert.match(RESEARCH_REFERENCES[record.source].checked,/^2026-\d\d-\d\d$/);
  }
});
test('filters specialist ship and equipment research by context and query', () => {
  assert.ok(researchForBoard('ships','all','Musashi').length > 0);
  assert.ok(researchForBoard('equipment','all','La-9').length > 0);
  assert.equal(researchForBoard('ships','all','La-9').length,0);
  assert.equal(researchForBoard('waifu').length,0);
  assert.equal(researchForBoard('ships','PvE · late campaign','Musashi').length,0);
});
test('no empty source grades or automatic universal AVALON scores', () => {
  assert.ok(SHIP_RESEARCH.every(item=>/PvE/.test(item.context)));
  assert.ok(EQUIPMENT_RESEARCH.every(item=>/PvE/.test(item.context)));
  assert.ok(SHIP_RESEARCH.some(x=>x.grade==='SS'));
});
