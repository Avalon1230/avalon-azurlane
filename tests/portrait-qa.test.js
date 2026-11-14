import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {portraitIdentity,portraitTreatment,portraitClasses,researchFrame} from '../src/research-ships.js';
import {META_PORTRAIT_RARITIES} from '../src/portrait-rarity.js';
import {renderShipProfile} from '../src/ship-profiles.js';
import {renderShipRosterTile} from '../src/ship-roster.js';
import {renderResearchProgress} from '../src/research-view.js';

test('META treatment uses pinned source rarity even when a caller supplies a contradictory label',()=>{
 assert.equal(portraitTreatment({sourceId:'970101',rarity:'Super Rare'}),'meta-elite');
 assert.equal(portraitTreatment({sourceId:'970701',rarity:'Elite'}),'meta-super-rare');
 assert.equal(portraitIdentity({sourceId:'10706',name:'Enterprise META',rarity:'Elite'}),'');
 assert.equal(portraitClasses({sourceId:'999999',nation:'META',rarity:'Super Rare'}),'');
 assert.equal(Object.keys(META_PORTRAIT_RARITIES).length,66);
});
test('both META rarities appear in roster and profile; ordinary ships receive no new decoration',()=>{
 for(const [id,treatment,rarity]of [['970101','meta-elite','Elite'],['970701','meta-super-rare','Super Rare'],['10706','','Super Rare']]){
  const ship={id:'lyc-'+id,sourceId:id,name:'Fixture',rarity};
  const html=renderShipProfile({ship,data:{id,names:{en:'Fixture'},rarity,stats:{},skills:[],slots:[]}});
  for(const markup of [html,renderShipRosterTile(ship)]){
   if(treatment)assert.ok(markup.includes('portrait-'+treatment));else assert.doesNotMatch(markup,/data-frame-shape|class="research-frame/);
  }
 }
});
test('PR and DR emit separate silhouette identities and preserve an empty masked artwork center',()=>{
 assert.match(researchFrame('29901'),/data-frame-shape="pr"/);
 assert.match(researchFrame('29904'),/data-frame-shape="dr"/);
 const css=readFileSync(new URL('../assets/styles.css',import.meta.url),'utf8');
 const shape=type=>css.match(new RegExp('\\.portrait-'+type+'\\{[^}]*--frame-shape:([^}]+)'))?.[1];
 assert.ok(shape('pr'));assert.ok(shape('dr'));assert.notEqual(shape('pr'),shape('dr'));
 assert.match(css,/mask-composite:exclude/);
 assert.match(css,/padding:var\(--frame-top\) var\(--frame-side\) var\(--frame-bottom\)/);
});
test('long panels follow the two-column summary instead of remaining in a narrow left column',()=>{
 const html=renderShipProfile({ship:{sourceId:'29901'},data:{id:'29901',names:{en:'Neptune'},stats:{},skills:[],slots:[]}});
 assert.match(html,/<div class="ship-profile-details"><section class="ship-profile-panel" id="ship-profile-gear"/);
 assert.ok(html.indexOf('ship-profile-details')>html.indexOf('Sources &amp; more information'));
 assert.equal((html.match(/id="ship-profile-stats"/g)||[]).length,1);
});
test('missing Fate details remain unknown rather than asserting an unreleased feature',()=>{
 const html=renderResearchProgress('29906');
 assert.match(html,/We don’t have Fate Simulation details for this ship yet/);
 assert.doesNotMatch(html,/hasn.t been released|isn.t available in our data/);
 assert.match(renderResearchProgress('29901',{dev:5}),/Reach Dev 30/);
 assert.match(renderResearchProgress('29901',{dev:30}),/id="research-fate"/);
});
