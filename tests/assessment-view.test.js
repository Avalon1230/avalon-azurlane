import test from 'node:test';
import assert from 'node:assert/strict';
import {renderAssessmentBoard} from '../src/assessment-view.js';

test('ship recommendations explain context, alternatives and sources without editing buttons',()=>{
 const x=renderAssessmentBoard({boardId:'ships',filter:'campaign',ships:[{name:'Unicorn (Retrofit)'},{name:'Unknown X'}]});
 assert.match(x,/Unicorn \(Retrofit\)/);
 assert.match(x,/When not to pick it/);
 assert.match(x,/suchiguma.github.io/);
 assert.doesNotMatch(x,/data-action="tier-clear"/);
 assert.doesNotMatch(x,/data-tier-assign/);
 assert.match(x,/awaiting review/);
});
test('unsupported modes show not evaluated, not fabricated grades',()=>{
 const x=renderAssessmentBoard({boardId:'ships',filter:'exercises'});
 assert.match(x,/No reviewed assessments/);
 assert.doesNotMatch(x,/name="rank"/);
});
test('equipment lists researched gear, not personal pickers',()=>{
 const x=renderAssessmentBoard({boardId:'equipment',filter:'meta',query:'La-9'});
 assert.match(x,/Prototype Carrier-Based La-9/);
 assert.match(x,/Confidence:/);
 assert.match(x,/EX/);
});
test('unknown characters and malicious remote names are escaped',()=>{
 const x=renderAssessmentBoard({boardId:'ships',query:'<script>',ships:[{name:'<script>alert(1)</script>'}]});
 assert.doesNotMatch(x,/<script>/);
 assert.match(x,/&lt;script&gt;/);
});