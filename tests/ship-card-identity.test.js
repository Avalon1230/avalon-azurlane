import test from 'node:test';
import assert from 'node:assert/strict';
import {renderShipRosterTile} from '../src/ship-roster.js';
import {renderShipProfile} from '../src/ship-profiles.js';

for(const [id,identity]of [['29901','pr'],['29904','dr'],['970101','meta-elite'],['970701','meta-super-rare']]){
 test(`${identity} frames the entire roster and hero card, never the artwork container`,()=>{
  const ship={id:'lyc-'+id,sourceId:id,name:'Test',rarity:'Super Rare'};
  const tile=renderShipRosterTile(ship);
  assert.match(tile,new RegExp('<button[^>]+class="[^"]*portrait-'+identity));
  assert.match(tile,/<span class="ship-roster-portrait"><span class="asset-media/);
  assert.ok(tile.indexOf('research-frame')>tile.indexOf('ship-roster-footer'));
  const profile=renderShipProfile({ship,data:{id,names:{en:'Test'},stats:{},skills:[],slots:[]}});
  assert.match(profile,new RegExp('<section class="ship-profile-overview [^"]*portrait-'+identity));
  assert.match(profile,/<section class="ship-profile-overview [^"]*"><span class="research-frame/);
  assert.match(profile,/<div class="ship-profile-cover"><span class="asset-media/);
 });
}
