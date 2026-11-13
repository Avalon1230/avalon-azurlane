import test from 'node:test';
import assert from 'node:assert/strict';
import {RESEARCH_PROGRESSION_DATA as data} from '../src/research-progression-data.js';
import {researchProgression as calculate,researchSkill} from '../src/research-progression.js';
import {renderResearchStats,renderResearchGear,renderResearchSkills} from '../src/research-stats-view.js';
import {luaTable,luaRecord} from '../scripts/lua-data.mjs';
test('Neptune exact client reference arithmetic at Dev 0/5/10/20/30',()=>{
 // HP base 815 + 119*19.890; milestone HP 0/199/199/597/1193; affinity 1.06.
 const expected=[[0,3372,122,116,94],[5,3583,124,118,94],[10,3583,129,122,104],[20,4005,146,139,123],[30,4637,172,164,152]];
 for(const [dev,hp,fp,rld,asw] of expected){const result=calculate('29901',{dev,level:120});assert.equal(result.status,'calculated');assert.deepEqual([result.stats.health,result.stats.firepower,result.stats.reload,result.stats.antisub],[hp,fp,rld,asw]);}
});
test('intermediate development uses exact stage effects with client flooring, not interpolation',()=>{
 // At Dev 2, Neptune earns 94/100 FP. The client floors the total enhancement to 0.
 const result=calculate('29901',{dev:2,level:100});assert.equal(result.stats.firepower,107);
 assert.equal(Math.floor((32+99*0.7+0.94)*1.06),108,'rounding only at the end would be wrong');
 assert.equal(calculate('29901',{dev:5,level:125}).stats.health,3689);
 assert.equal(calculate('29901',{dev:0,level:1}).stats.health,863);
});
test('Neptune torpedo mount/preload and efficiency changes occur at their exact stages',()=>{
 assert.equal(calculate('29901',{dev:4}).slots[1].mounts,1);
 assert.equal(calculate('29901',{dev:5}).slots[1].mounts,2);
 assert.equal(calculate('29901',{dev:5}).slots[1].preloads,1);
 assert.equal(calculate('29901',{dev:14}).slots[0].efficiency,1.25);
 assert.equal(calculate('29901',{dev:15}).slots[0].efficiency,1.3);
 assert.equal(calculate('29901',{dev:30}).slots[0].efficiency,1.5);
});
test('Fate luck and replacement skills use ship-specific intermediate stages',()=>{
 const n=calculate('29901',{dev:30,fate:5});assert.equal(n.stats.luck,15);assert.ok(n.skills.some(s=>s.id===18010&&s.description.includes('40.0%')));assert.ok(!n.skills.some(s=>s.id===19010));
 const expected=[0,3,7,12,18,25];
 for(let fate=0;fate<=5;fate++){const d=calculate('29904',{dev:30,fate});assert.equal(d.stats.luck,expected[fate]);assert.equal(d.skills.some(s=>s.id===18300),fate>=3);assert.equal(d.skills.some(s=>s.id===18290),fate===5);}
 assert.equal(calculate('29904',{dev:30,fate:3}).stats.health,5668);
 assert.equal(calculate('29904',{dev:30,fate:3}).stats.firepower,289,'battle skill FP buff is not a port stat');
});
test('level tabs and minimum ship-level requirements remain distinct from development',()=>{
 assert.equal(calculate('29901',{dev:30,fate:5,level:1}).status,'unknown');
 assert.match(calculate('29901',{dev:30,fate:5,level:1}).reason,/100/);
 assert.equal(calculate('29901',{dev:0,level:125}).status,'calculated');
 for(const value of [{dev:31},{dev:-1},{dev:5,fate:1},{fate:6},{level:119},{level:NaN}])assert.equal(calculate('29901',value).status,'unknown');
 assert.equal(calculate('29906',{fate:1}).status,'unknown');
});
test('all 47 ships calculate every complete Dev stage and each available Fate stage',()=>{
 let devCount=0,fateCount=0;
 for(const r of Object.values(data.records)){
  for(let dev=0;dev<=30;dev++){const v=calculate(r.id,{dev,level:125});assert.equal(v.status,'calculated',r.id+' Dev '+dev);assert.ok(Object.values(v.stats).every(Number.isFinite));devCount++;}
  for(let fate=1;fate<=r.fate.length;fate++){const v=calculate(r.id,{dev:30,fate,level:125});assert.equal(v.status,'calculated',r.id+' Fate '+fate);assert.ok(v.skills.every(s=>s.status==='verified-description'),r.id+' skills');fateCount++;}
 }
 assert.equal(devCount,1457);assert.equal(fateCount,170);
});
test('missing, invalid and contradictory numeric source data stays unknown',()=>{
 for(const corrupt of [r=>r.forms=[],r=>r.attrExp[0]=0,r=>r.forms[3].statistics.attrs=null,r=>r.forms[3].statistics.attrs[0]=1e308,r=>r.development[0].lv=99,r=>r.development[0].effect_attr=[['invented',100]],r=>r.fate[0].change_skill=[999999,18010]]){
  const modified=structuredClone(data);corrupt(modified.records['29901']);const v=calculate('29901',{dev:30,fate:1},modified);assert.equal(v.status,'unknown');assert.equal(v.stats,null);assert.deepEqual(v.skills,[]);
 }
 assert.equal(calculate('29901',{},{}).status,'unknown');assert.equal(calculate(null).status,'unknown');
});
test('fixed-level skills and unresolved skill parameters are handled explicitly',()=>{
 assert.equal(researchSkill(19002,1).status,'verified-description');assert.equal(researchSkill(19002,10).status,'unknown');
 const modified=structuredClone(data);modified.skills[18010].parameters=[];assert.equal(researchSkill(18010,10,modified).status,'unknown');
});
test('calculation does not mutate source or saved selection inputs',()=>{
 const before=JSON.stringify(data),selection={dev:20,fate:0,level:120};calculate('29901',selection);assert.equal(JSON.stringify(data),before);assert.deepEqual(selection,{dev:20,fate:0,level:120});
});
test('research panels show calculated values and explicit unknown states without old reference stats',()=>{
 const model=calculate('29904',{dev:30,fate:3});assert.match(renderResearchStats(model,'level120'),/data-research-stat="luck">12/);assert.match(renderResearchGear(model),/130%/);assert.match(renderResearchSkills(model),/Flintlock Burst\+/);
 const unknown=calculate('29901',{dev:30,level:1});for(const html of [renderResearchStats(unknown,'levelBase'),renderResearchGear(unknown),renderResearchSkills(unknown)]){assert.match(html,/requires ship level/);assert.doesNotMatch(html,/data-research-stat|data-research-skill/);}
});
test('source reader accepts literal Lua tables and rejects executable or truncated input',()=>{
 assert.deepEqual(luaTable('{ id = 2, values = {1, 2}, text = [[a\nb]] }',0).value,{id:2,values:[1,2],text:'a\nb'});
 assert.equal(luaRecord('pg.base.example[2] = { id = 2 }','example',2).id,2);
 for(const input of ['{ x = os.execute("bad") }','{1,','{ x = function() end }'])assert.throws(()=>luaTable(input,0));
});
