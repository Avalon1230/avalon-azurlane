import test from 'node:test';
import assert from 'node:assert/strict';
import { renderSuggestedFleet } from '../src/fleet-suggest-view.js';
import { suggestFleet, CURATED_SHIPS } from '../src/fleet-suggest.js';
const ships=[{id:'a',name:'Musashi',hull:'BB'},{id:'b',name:'Unicorn (Retrofit)',hull:'CVL'},{id:'c',name:'Guam',hull:'CB'},{id:'d',name:'Unknown',hull:'BB'}];
const mode={id:'daily'};
const workspace={modeId:'daily',fleets:{daily:{'main-1':null,'main-2':null,'main-3':null,'vanguard-1':null,'vanguard-2':null,'vanguard-3':null}}};
test('suggest controls include owned-only, scenario and generate; no claim of validated optimization',()=>{
 const html=renderSuggestedFleet({mode,ships,workspace,options:{scenario:'daily',poolOpen:true,ownedIds:['a']}});
 assert.match(html,/id="suggest-scenario"/);
 assert.match(html,/id="suggest-owned-only"/);
 assert.match(html,/data-action="suggest-generate"/);
 assert.match(html,/reviewed candidates/);
 assert.match(html,/HEURISTIC PREVIEW/);
});
test('preview shows traceable reasons and gaps without mutating output',()=>{
 const preview=suggestFleet({modeId:'daily',scenario:'daily',ships,workspace});
 const html=renderSuggestedFleet({mode,ships,workspace,preview,options:{scenario:'daily'}});
 assert.match(html,/Suggested formation preview/);
 assert.match(html,/data-action="suggest-apply"/);
 assert.match(html,/Unfilled/);
 assert.match(html,/Qualitative role matching only/);
});
test('HTML output escapes data from external ship names',()=>{
 const bad=[...ships,{id:'evil',name:'<svg onload=alert(1)>',hull:'CL'}];
 const html=renderSuggestedFleet({mode,ships:bad,workspace,options:{poolOpen:true}});
 assert.doesNotMatch(html,/<svg onload=/);
});