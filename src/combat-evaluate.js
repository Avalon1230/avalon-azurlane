import {COMBAT_DATA} from './combat-data.js';
import {gameShipSlots} from './game-slot-manifest.js';
import {directVolley,weaponCycle,airstrikeCycle,attackTimeline} from './combat-mechanics.js';
import {skillCondition} from './combat-skills.js';

export const COMBAT_PRESET = Object.freeze({level:10,reload:100,stat:100,duration:60,armor:'mixed',movement:'ideal',enemyAA:0});
export const MECHANICS_CONFLICTS = Object.freeze({
  '31040':{field:'shell_range',reason:'Pinned extract gives 45–55; BWIKI reports 40–60. Range is not evaluated.'}
});
const norm=s=>String(s).toLowerCase().replace(/[^a-z0-9]/g,'');
export function resolveCombatItem(candidate,data=COMBAT_DATA){
  if(candidate?.source!=='fernando')return null;
  const item=data.equipment[String(candidate.sourceId)];
  if(!item||item.type!==candidate.typeCode||![item.name,...(item.aliases||[])].some(n=>norm(n)===norm(candidate.name)))return null;
  return item;
}
const statBonus=(item,stat,level)=>item.stats?.find(s=>s.stat===stat)?.values?.[level]??0;
/** A component comparison; the compatible pool is supplied by the existing planner. */
export function compareSlot(model,index,context=COMBAT_PRESET,data=COMBAT_DATA){
  const slot=model?.slots?.find(s=>s.index===index), ship=gameShipSlots(model?.sourceId);
  const fail=reason=>({status:'unknown',reason,rows:[],recommended:null});
  if(!slot||slot.kind!=='weapon'||!ship?.slots[index])return fail('No supported weapon slot');
  const c={...COMBAT_PRESET,...context}, weights=c.armor==='mixed'?[1/3,1/3,1/3]:c.armor;
  if(!['general','boss','mobbing','opsi'].includes(model.mode))return fail('Unknown encounter mode');
  if(model.mode==='boss'&&c.armor==='mixed')return fail('Choose the boss armor to compare direct damage');
  if(c.movement!=='ideal')return fail('Moving-target accuracy is not modeled; no reliable damage comparison');
  if(!Number.isInteger(c.level)||c.level<0||![c.reload,c.stat,c.duration].every(v=>typeof v==='number'&&Number.isFinite(v)&&v>=0)||c.duration>600)
    return fail('Invalid scenario inputs');
  const sourceSlot=ship.slots[index];
  if(slot.maxEfficiency!==sourceSlot.maxEfficiency||slot.maxMounts!==sourceSlot.maxMounts)
    return fail('Live slot and mechanics snapshot disagree or slot efficiency is unavailable');
  const mapped=slot.candidates.map(candidate=>({candidate,item:resolveCombatItem(candidate,data)}));
  const rows=[],excluded=[];
  for(const {candidate,item} of mapped){
    if(!item||item.skills.length||!sourceSlot.types.includes(item.type)||item.hull_restriction.includes(ship.hullId))continue;
    const conflict=data.conflicts?.[item.id]||MECHANICS_CONFLICTS[item.id];
    if(conflict&&['reload','damage','coefficient','armor'].includes(conflict.field)){
      excluded.push({sourceId:String(item.id),name:item.name,reason:conflict.reason});continue;
    }
    const types=model.slots.map(s=>s.index===index?item.type:s.selected?.typeCode);
    const skill=skillCondition(model.sourceId,types);
    if(item.weapon?.aircraft){
      const wing=[];
      for(let i=0;i<3;i++){
        const selected=i===index?item:c.wing==='reference'?data.equipment[[17340,17340,28140][i]]:resolveCombatItem(model.slots.find(s=>s.index===i)?.selected,data);
        if(!selected?.weapon?.aircraft||!ship.slots[i].types.includes(selected.type)||selected.hull_restriction.includes(ship.hullId))break;
        wing.push({item:selected,mounts:ship.slots[i].maxMounts});
      }
      if(wing.length!==3||skill.status!=='source-conditioned'||!skill.role)continue;
      const air=airstrikeCycle(wing,{level:c.level,reload:c.reload,loadingMultiplier:skill.loadingMultiplier});
      if(air.status!=='calculated')continue;
      rows.push({id:candidate.id,name:candidate.name,sourceId:String(item.id),kind:'aircraft',cycle:air.value,
        intercepts:item.weapon.is_interceptor,payload:item.armaments.filter(a=>a.ammo!==5).map(a=>({id:a.id,name:a.name,count:a.count,damage:a.damage[c.level],armor:a.armor_mod,aim:a.aim_type})),skill,
        evidenceClass:'reproducible-component',limitations:['Payload hit rate, interception damage, aircraft losses, barrage and effective healing are not simulated.']});
      continue;
    }
    const absoluteCooldown=item.type===4?0.2:0.3;
    const cycle=weaponCycle(item,{level:c.level,reload:c.reload,absoluteCooldown});
    const volley=directVolley(item,{level:c.level,stat:c.stat+statBonus(item,item.weapon?.stat,c.level),
      efficiency:sourceSlot.maxEfficiency,mounts:sourceSlot.maxMounts,armor:weights});
    if(cycle.status!=='calculated'||volley.status!=='calculated')continue;
    const timeline=attackTimeline({cycle:cycle.value,duration:c.duration});
    rows.push({id:candidate.id,name:candidate.name,sourceId:String(item.id),kind:'gun',cycle:cycle.value,
      volley:volley.value,dps:volley.value/cycle.value,activations:timeline.events.length,
      directTotal:volley.value*timeline.events.length,barrageTriggers:skill.every?Math.floor(timeline.events.length/skill.every):null,
      armorDps:Object.fromEntries(['light','medium','heavy'].map(armor=>[armor,directVolley(item,{level:c.level,
        stat:c.stat+statBonus(item,item.weapon.stat,c.level),efficiency:sourceSlot.maxEfficiency,mounts:sourceSlot.maxMounts,armor}).value/cycle.value])),
      pattern:{count:item.weapon.count,volley:item.weapon.volley_info,spread:item.weapon.spread_angle,splash:item.weapon.splash,pierce:item.weapon.pierce,velocity:item.weapon.velocity},skill,
      evidenceClass:'reproducible-component',limitations:['All projectiles hit one target. No crit, burn, barrage, skill buffs, aim delay or mount staggering. Absolute cooldown is an approximation.']});
  }
  if(rows.length<2)return fail('Fewer than two source-identified options have comparable mechanics. Aircraft comparisons also need a complete supported air wing; try the labeled reference wing.');
  const guns=rows.every(r=>r.kind==='gun');
  // Preserve raw alternatives. No arbitrary aggregate score or full-build recommendation.
  const damageLeader=guns?[...rows].sort((a,b)=>b.dps-a.dps)[0]:null;
  const timingLeader=[...rows].sort((a,b)=>a.cycle-b.cycle)[0];
  const alternative=guns?rows.find(r=>r.id!==damageLeader.id&&Object.keys(r.armorDps).some(a=>r.armorDps[a]>damageLeader.armorDps[a]))||rows.find(r=>r.id!==damageLeader.id):null;
  const betterArmor=alternative?Object.keys(alternative.armorDps).filter(a=>alternative.armorDps[a]>damageLeader.armorDps[a]):[];
  const alternativeReason=betterArmor.length?'Higher ideal direct DPS against '+betterArmor.join('/')+' armor.':
    alternative?.cycle<damageLeader?.cycle?'Earlier firing and more main-gun trigger opportunities; barrage damage is not included.':
      'No modeled damage or timing advantage here; retain as a compatible option, not a superior choice.';
  return {status:'partial',recommended:null,rows,excluded,damageLeader,timingLeader,alternative,alternativeReason,context:c,
    coverage:{compared:rows.length,compatible:slot.candidates.length},source:data.source,
    modeNote:model.mode==='mobbing'?'Wave coverage and overkill are unknown; faster cycles offer more firing opportunities.':
      model.mode==='opsi'?'Adaptation, survival, Anti-Siren effects and fleet timing are not modeled.':
      model.mode==='general'?'Mixed armor uses equal weights, an explicit baseline rather than a universal encounter mix.':'Armor-specific ideal direct hits; no moving-target accuracy model.'};
}
