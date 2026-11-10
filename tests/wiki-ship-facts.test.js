import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { extractShipFields, parseWikiShipFacts, loadWikiShipFacts } from '../src/wiki-ship-facts.js';
import { renderShipProfile } from '../src/ship-profiles.js';

const WIKI=String.raw`{{Ship
| GroupID = 30715
| Rarity = Ultra Rare
| Type = Aircraft Carrier
| Class = Amagi(CV)
| ConstructTime = 04:40:00
| Artist = 股间少女
| VA = [[:wikipedia:Miyuki_Sawashiro|Miyuki Sawashiro]]
| Luck = 23
| Speed = 31
| Armor = Medium
| HealthInitial = 1267
| FireInitial = 0
| AAInitial = 61
| TorpInitial = 0
| AirInitial = 85
| ReloadInitial = 49
| EvadeInitial = 12
| AccInitial = 34
| ASWInitial = 0
| ConsumptionInitial = 8
| HealthMax = 6877
| FireMax = 0
| AAMax = 294
| TorpMax = 0
| AirMax = 421
| ReloadMax = 127
| EvadeMax = 44
| AccMax = 88
| ASWMax = 0
| ConsumptionMax = 15
| Health120 = 7599
| Fire120 = 0
| AA120 = 321
| Torp120 = 0
| Air120 = 443
| Reload120 = 134
| Evade120 = 51
| ASW120 = 0
| Acc120 = 99
| Health125 = 7779
| Fire125 = 0
| AA125 = 328
| Torp125 = 0
| Air125 = 448
| Reload125 = 136
| Evade125 = 52
| ASW125 = 0
| Acc125 = 102
| Eq1Type = Fighters/Dive Bombers (LB1)
| Eq1BaseMax = 3
| Eq1EffInit = 130%
| Eq1EffInitMax = 145%
| Eq2Type = Dive Bombers/Torpedo Bombers (MLB)
| Eq2BaseMax = 2
| Eq2EffInit = 130%
| Eq2EffInitMax = 145%
| Eq3Type = Torpedo Bombers
| Eq3BaseMax = 3
| Eq3EffInit = 145%
| Eq3EffInitMax = 160%
| TechPointCollect = 20
| TechPointMLB = 40
| TechPoint120 = 30
| LB1 = All Torpedo Bombers +1 / All Plane Efficiency +3%
| LB2 = Hangar Capacity +1 / All Fighters +1
| LB3 = All aircraft +1 / Can equip Torpedo Bombers in Dive Bomber slot
| Skill1 = From Plans Laid, Eternity Arrayed
| Skill1Icon = 150460
| Skill1Desc =
Increases this ship's AVI by 5% (15%).
While this ship is afloat: increases the torpedo DMG dealt by your [[Sakura Empire]] ships.
| DLimitedNote = Only during event
| DropHistory = Available in Limited Construction during the [[Ode of Everblooming Crimson]] event
}}`;

const ship={id:'lyc-30715',sourceId:'30715',name:'Amagi(CV)',rarity:'Ultra Rare',hull:'CV',nation:'Sakura Empire'};
const info={
  id:'30715',names:{en:'Amagi(CV)'},rarity:'Ultra Rare',class:'Amagi(CV)',hullType:'Aircraft Carrier',
  stats:{level120:{health:7168,firepower:0,torpedo:0,antiwar:303,aviation:417,reload:126,evasion:48,accuracy:93,speed:31.5,luck:23}},
  slots:[{type:'Fighter',minEfficiency:1.3,maxEfficiency:1.45}],
  skills:[{names:{en:'From Plans Laid, Eternity Arrayed'},color:'yellow',description:'Buffs Sakura Empire ships.'}],
  fleetTech:{techPoints:{collection:20,maxLimitBreak:40,maxLevel:30,total:90}},
  obtainedFrom:{obtainedFrom:'Ode of Everblooming Crimson'},wikiUrl:'https://azurlane.koumakan.jp/wiki/Amagi(CV)'
};

test('wiki template parser extracts source-specific named fields, not mixed ship variants',()=>{
  const fields=extractShipFields(WIKI);
  assert.equal(fields.GroupID,'30715');
  assert.match(fields.Skill1Desc,/While this ship is afloat/);
  const data=parseWikiShipFacts(WIKI,'30715',{pageTitle:'Amagi(CV)',revision:12345});
  assert.equal(data.revision,12345);
  assert.equal(data.sourceId,'30715');
  assert.equal(data.voiceActor,'Miyuki Sawashiro');
  assert.equal(data.armor,'Medium');
  assert.equal(data.constructionTime,'04:40:00');
  assert.equal(data.stats.levelBase.health,1267);
  assert.equal(data.stats.level100.health,6877);
  assert.equal(data.stats.level120.health,7599);
  assert.equal(data.stats.level125.health,7779);
  assert.equal(data.stats.level125.aviation,448);
  assert.equal(data.stats.level125.oil,15);
  assert.equal(data.stats.level120.antisub,0);
  assert.deepEqual(data.slots.map(x=>x.maxMounts),[3,2,3]);
  assert.deepEqual(data.slots.map(x=>x.maxEfficiency),[1.45,1.45,1.6]);
  assert.equal(data.skillIcons['From Plans Laid, Eternity Arrayed'],150460);
  assert.equal(data.fleetTech.total,90);
  assert.deepEqual(data.limitBreaks[0],['All Torpedo Bombers +1','All Plane Efficiency +3%']);
  assert.match(data.dropNote,/Ode of Everblooming Crimson/);
  assert.equal(parseWikiShipFacts(WIKI,'30714'),null);
  assert.equal(parseWikiShipFacts(WIKI.replace('GroupID = 30715','GroupID = 10517'),'30715'),null);
  assert.equal(parseWikiShipFacts('<html>Not a ship</html>','30715'),null);
});
test('wiki enriched profile shows Lv125, correct Lv120, max mounts, armor, artist and separate controls',()=>{
  const wiki=parseWikiShipFacts(WIKI,'30715');
  const html=renderShipProfile({ship,data:info,wikiFacts:wiki,level:'level125'});
  assert.match(html,/Lv\. 125/);
  assert.match(html,/7,779/);
  assert.match(html,/448/);
  assert.match(html,/Max 3/);
  assert.match(html,/Max 2/);
  assert.match(html,/Miyuki Sawashiro/);
  assert.match(html,/Medium/);
  assert.match(html,/04:40:00/);
  assert.match(html,/ship-skill-icon/);
  assert.match(html,/ship-data-source/);
  assert.match(html,/Koumakan Wiki/);
  assert.ok(html.indexOf('data-action="profile-back"')<html.indexOf('class="ship-profile-overview"'));
  assert.ok(html.indexOf('data-action="add-ship"')<html.indexOf('class="ship-profile-overview"'));
  const overview=html.match(/<section class="ship-profile-overview">([\s\S]+?)<\/section>/)?.[1]||'';
  assert.doesNotMatch(overview,/profile-back|add-ship/);
  const at120=renderShipProfile({ship,data:info,wikiFacts:wiki,level:'level120'});
  assert.match(at120,/7,599/);
  assert.doesNotMatch(at120,/7,168/);
});
test('failure and group ID mismatch do not overwrite Lycoris values',()=>{
  const different={...parseWikiShipFacts(WIKI,'30715'),sourceId:'10517'};
  const html=renderShipProfile({ship,data:info,wikiFacts:different,level:'level120'});
  assert.match(html,/7,168/);
  assert.match(html,/Lycoris game-data snapshot/);
  assert.doesNotMatch(html,/7,599/);
});
test('wiki loader validates URL, group ID and source template asynchronously',async()=>{
  const urls=[];
  const fetcher=async url=>{
    urls.push(new URL(url));
    return {ok:true,text:async()=>JSON.stringify({parse:{wikitext:WIKI,revid:88}})};
  };
  const result=await loadWikiShipFacts('https://azurlane.koumakan.jp/wiki/Amagi(CV)','30715',fetcher);
  assert.equal(result.stats.level125.health,7779);
  assert.equal(result.revision,88);
  assert.equal(urls.length,1);
  assert.equal(urls[0].searchParams.get('prop'),'wikitext');
  assert.equal(urls[0].searchParams.get('origin'),'*');
  assert.equal(await loadWikiShipFacts('https://example.com/wiki/Amagi(CV)','30715',fetcher),null);
  assert.equal(await loadWikiShipFacts('https://azurlane.koumakan.jp/wiki/Amagi(CV)','30714',fetcher),null);
});
test('Guam voice actor omits wiki section comments and commented-out fields',()=>{
  const guam=String.raw`{{Ship
| GroupID = 11802
| Rarity = Ultra Rare
| VA = [[Karin Kagami]]<!--
--------- Section 2: Stats ---------
| VA = Fake Commented Actor
| GroupID = 99999
-->
| Artist = Dishwasher1910
| Armor = Medium
}}`;
  const fields=extractShipFields(guam);
  assert.equal(fields.VA,'[[Karin Kagami]]');
  assert.equal(fields.Artist,'Dishwasher1910');
  assert.equal(fields.GroupID,'11802');
  const parsed=parseWikiShipFacts(guam,'11802');
  assert.equal(parsed.voiceActor,'Karin Kagami');
  assert.equal(parsed.artist,'Dishwasher1910');
  const guamShip={...ship,id:'lyc-11802',sourceId:'11802',name:'Guam'};
  const guamInfo={...info,id:'11802',names:{en:'Guam'}};
  const html=renderShipProfile({ship:guamShip,data:guamInfo,wikiFacts:parsed});
  assert.match(html,/<dt>Voice actor<\/dt><dd>Karin Kagami<\/dd>/);
  assert.doesNotMatch(html,/Section 2: Stats|Fake Commented Actor|99999/);
});
test('unterminated wiki comments never enter text fields',()=>{
  const raw='{{Ship\n| GroupID = 11802\n| VA = Karin Kagami\n}}\n<!-- broken editor comment';
  const fields=extractShipFields(raw);
  assert.equal(fields?.VA,'Karin Kagami');
});
test('Elite remains purple and Ultra Rare is a distinct prismatic style',()=>{
  const css=readFileSync(new URL('../assets/styles.css',import.meta.url),'utf8');
  assert.match(css,/\.ship-roster-tile\.rarity-ultra-rare \.ship-roster-name\s*\{\s*background:linear-gradient/);
  assert.match(css,/\.ship-roster-tile\.rarity-elite \.ship-roster-name\{background:#79549a/);
  assert.match(css,/\.ship-profile-toolbar/);
});
