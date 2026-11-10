import test from 'node:test';
import assert from 'node:assert/strict';
import { renderShipRosterTile } from '../src/ship-roster.js';
import { detailedShipRecord, renderShipProfile, trustedShipPainting, trustedReconstructedPainting, resolveSkinArtwork } from '../src/ship-profiles.js';
import { FULL_SHIP_FEED, loadDetailedShips } from '../src/remote.js';

const ship={id:'lyc-30715',sourceId:'30715',name:'Amagi(CV)',hull:'CV',nation:'Sakura Empire',rarity:'Ultra Rare'};
const details={
  id:'30715',names:{en:'Amagi(CV)'},nationality:'Sakura Empire',
  rarity:'Ultra Rare',class:'Amagi(CV)',hullType:'Aircraft Carrier',
  stats:{
    level100:{health:6488,firepower:0,torpedo:0,antiwar:277,aviation:397,reload:120,evasion:42,accuracy:83,speed:31.5,luck:23},
    level120:{health:7168,firepower:0,torpedo:0,antiwar:303,aviation:417,reload:126,evasion:48,accuracy:93,speed:31.5,luck:23}
  },
  slots:[{type:'Fighter',minEfficiency:1.3,maxEfficiency:1.45},{type:'Torpedo Bomber',minEfficiency:1.45,maxEfficiency:1.6}],
  skills:[{color:'yellow',names:{en:'From Plans Laid, Eternity Arrayed'},description:'Buffs Sakura Empire ships.'}],
  limitBreaks:[['Hangar capacity +1','All Fighters +1']],
  obtainedFrom:{obtainedFrom:'Event: Ode of Everblooming Crimson'},
  skins:[{name:'Amagi(CV)',image:'https://raw.githubusercontent.com/iujab/azurlane-images/main/paintings/tiancheng_cv_rw.webp'}],
  wikiUrl:'https://azurlane.koumakan.jp/wiki/Amagi(CV)'
};
const artworkSkins=[
  {name:'Amagi(CV)',images:{
    painting:'https://raw.githubusercontent.com/Fernando2603/AzurLane/main/images/skin/307150/painting.png',
    paintingNoBackground:'https://raw.githubusercontent.com/Fernando2603/AzurLane/main/images/skin/307150/painting_n.png'}},
  {name:'Alternate',images:{painting:'https://raw.githubusercontent.com/Fernando2603/AzurLane/main/images/skin/307151/painting.png'}}
];
test('dense roster tiles show clickable original portraits rather than oversized action cards',()=>{
  const html=renderShipRosterTile(ship);
  assert.match(html,/class="ship-roster-tile rarity-ultra-rare"/);
  assert.match(html,/data-action="ship-details"/);
  assert.match(html,/aria-label="View Amagi\(CV\) ship profile"/);
  assert.match(html,/asset-roster-ship/);
  assert.doesNotMatch(html,/data-action="add-ship"/);
  assert.doesNotMatch(html,/Inspect/);
});
test('full profile displays available stats, skills, equipment and acquisition without invented data',()=>{
  const html=renderShipProfile({ship,data:details,level:'level120',artworkSkins});
  assert.match(html,/7,168/);
  assert.match(html,/417/);
  assert.match(html,/Fighter/);
  assert.match(html,/130% → 145%/);
  assert.match(html,/From Plans Laid, Eternity Arrayed/);
  assert.match(html,/Event: Ode of Everblooming Crimson/);
  assert.match(html,/Hangar capacity \+1/);
  assert.match(html,/307150\/painting\.png/);
  assert.match(html,/data-action="profile-back"/);
  assert.match(html,/data-action="profile-jump"/);
  assert.match(html,/Full Koumakan entry/);
  assert.doesNotMatch(html,/Damage per second/);
});
test('stat toggle selects requested level and exposes level120 as default',()=>{
  assert.match(renderShipProfile({ship,data:details,level:'level100'}),/6,488/);
  assert.match(renderShipProfile({ship,data:details}),/7,168/);
});
test('ship detail URLs and user text are escaped and image URL is allowlisted',()=>{
  assert.equal(trustedShipPainting('javascript:alert(1)'),null);
  assert.equal(trustedShipPainting('https://evil.example/paintings/a.webp'),null);
  assert.equal(trustedShipPainting('https://raw.githubusercontent.com/iujab/azurlane-images/main/paintings/tiancheng_cv_rw.webp'),
    'https://raw.githubusercontent.com/iujab/azurlane-images/main/paintings/tiancheng_cv_rw.webp');
  const malicious={...details,skins:[{image:'javascript:alert(1)'}],
    wikiUrl:'https://evil.example/wiki/Amagi',skills:[{color:'red',names:{en:'<script>'},description:'<img src=x onerror=alert(1)>'}]};
  const html=renderShipProfile({ship,data:malicious});
  assert.doesNotMatch(html,/<script>|<img src=x|https:\/\/evil\.example/);
  assert.match(html,/&lt;script&gt;/);
});
test('unavailable detail data shows an honest retry state, not invented stats',()=>{
  const html=renderShipProfile({ship,status:'failed',error:'Network unavailable'});
  assert.match(html,/Retry loading/);
  assert.match(html,/Network unavailable/);
  assert.doesNotMatch(html,/ship-stat-grid/);
});
test('full records are resolved strictly by validated source ID',()=>{
  assert.equal(detailedShipRecord({'30715':details},'30715'),details);
  assert.equal(detailedShipRecord({'30715':details},'30715?'),null);
  assert.equal(detailedShipRecord({'30715':details},'30714'),null);
});
test('full detail source is lazy and has a validated record count',async()=>{
  assert.match(FULL_SHIP_FEED,/data\/ships\.json$/);
  const data=Object.fromEntries(Array.from({length:101},(_,i)=>[
    String(10000+i),{id:String(10000+i),names:{en:'Ship'+i}}
  ]));
  const mock=async url=>({ok:true,headers:{get:()=>null},text:async()=>JSON.stringify(data)});
  const returned=await loadDetailedShips(mock);
  assert.equal(Object.keys(returned).length,101);
});

test('profile portrait is fixed while changing independently selected artwork',()=>{
  const first=renderShipProfile({ship,data:details,skinIndex:0,artworkSkins});
  const second=renderShipProfile({ship,data:details,skinIndex:1,artworkSkins});
  assert.match(first,/class="ship-profile-overview"/);
  assert.match(first,/class="ship-profile-cover"/);
  assert.match(first,/class="ship-art-panel"/);
  assert.match(first,/class="ship-art-preview"/);
  assert.match(first,/data-action="profile-art-open"/);
  assert.match(first,/data-action="profile-skin"/);
  assert.match(second,/307151\/painting\.png/);
  assert.match(second,/aria-pressed="true">Alternate<\/button>/);
  const cover=markup=>markup.match(/<div class="ship-profile-cover">([\s\S]+?)<\/div>/)?.[1];
  assert.equal(cover(first),cover(second),'skin selection must never change the shipyard portrait');
});
test('enlarge viewer is a separate opt-in layer with a fullscreen control',()=>{
  const closed=renderShipProfile({ship,data:details});
  const open=renderShipProfile({ship,data:details,viewerOpen:true,artworkSkins});
  assert.doesNotMatch(closed,/id="ship-art-lightbox"/);
  assert.match(open,/role="dialog" aria-modal="true"/);
  assert.match(open,/id="ship-art-lightbox"/);
  assert.match(open,/data-action="profile-art-fullscreen"/);
  assert.match(open,/data-action="profile-art-close"/);
  assert.match(open,/class="ship-art-viewer-image"/);
});
test('reconstructed paintings supersede all broken raw image layers',()=>{
  const layer='https://raw.githubusercontent.com/iujab/azurlane-images/main/paintings/xinzexi_4_rw.webp';
  const source={name:'New Jersey',images:{default:layer,censored:layer}};
  assert.deepEqual(resolveSkinArtwork(source),{primary:null,fallback:null});
  const first='https://raw.githubusercontent.com/Fernando2603/AzurLane/main/images/skin/105173/painting.png';
  const noBg='https://raw.githubusercontent.com/Fernando2603/AzurLane/main/images/skin/105173/painting_n.png';
  const reconstructed={name:'Dancing in the Moonlight',images:{painting:first,paintingNoBackground:noBg}};
  assert.deepEqual(resolveSkinArtwork(reconstructed),{primary:first,fallback:noBg});
  const html=renderShipProfile({ship,data:details,artworkSkins:[reconstructed]});
  assert.match(html,/105173\/painting\.png/);
  assert.match(html,/data-fallback-src="[^"]*105173\/painting_n\.png"/);
  assert.doesNotMatch(html,/_rw\.webp/);
  assert.equal(trustedReconstructedPainting('javascript:alert(1)'),null);
  assert.equal(trustedReconstructedPainting('https://evil.example/105173/painting.png'),null);
});
