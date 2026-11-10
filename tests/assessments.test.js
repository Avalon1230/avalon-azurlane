import test from 'node:test';
import assert from 'node:assert/strict';
import {AVALON_ASSESSMENTS,EVIDENCE_SOURCES,assessmentsFor,validateAssessments,GRADE_ORDER} from '../src/assessments.js';

test('all recommendations carry verifiable provenance, defined context, and explicit limitations',()=>{
 assert.deepEqual(validateAssessments(),[]);
 assert.ok(AVALON_ASSESSMENTS.length>=20);
 assert.ok(AVALON_ASSESSMENTS.every(r=>r.assessmentType.includes('provisional')));
});
test('mode and grade filters do not silently apply one ranking everywhere',()=>{
 assert.ok(assessmentsFor('ships','campaign').some(r=>r.name==='Unicorn (Retrofit)'));
 assert.ok(assessmentsFor('ships','opsi').some(r=>r.name==='Unicorn (Retrofit)'));
 assert.equal(assessmentsFor('ships','meta','Unicorn').length,0);
 assert.equal(assessmentsFor('equipment','campaign','La-9').length,0);
 assert.equal(assessmentsFor('equipment','meta','La-9','EX').length,1);
});
test('grade definitions are ordered and each record references real https sources',()=>{
 assert.deepEqual(Object.keys(GRADE_ORDER),['EX','S','A','B','C','D']);
 for(const r of AVALON_ASSESSMENTS)for(const id of r.sources)assert.match(EVIDENCE_SOURCES[id].url,/^https:\/\//);
});