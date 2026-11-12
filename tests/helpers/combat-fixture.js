import {COMBAT_DATA} from '../../src/combat-data.js';
import {buildShipLoadout} from '../../src/loadout-intelligence.js';
const categories={1:'Destroyer Gun',3:'Heavy Cruiser Gun',4:'Battleship Gun',7:'Fighter',8:'Torpedo Bomber',9:'Dive Bomber'};
export const combatEquipment=Object.values(COMBAT_DATA.equipment).map(x=>({id:'fer-'+x.id,sourceId:String(x.id),source:'fernando',name:x.name,typeCode:x.type,category:categories[x.type],forbiddenHullIds:x.hull_restriction}));
export function combatModel(sourceId='20403',mode='general',overrides={}){
  const hull={'20403':'BC','20503':'BB','40303':'CA','40123':'DD','60701':'CV'}[sourceId];
  return buildShipLoadout({ship:{sourceId,hull},data:{id:sourceId,slots:[]},equipment:combatEquipment,mode,
    overrides:sourceId==='60701'?{0:'fer-17340',1:'fer-17340',2:'fer-28140',...overrides}:overrides});
}
