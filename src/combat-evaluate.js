import {COMBAT_DATA} from './combat-data.js';
import {gameShipSlots} from './game-slot-manifest.js';
import {directVolley,weaponCycle,airstrikeCycle,attackTimeline,gunAbsoluteCooldown} from './combat-mechanics.js';
import {skillCondition} from './combat-skills.js';

export const COMBAT_PRESET = Object.freeze({level:10,reload:100,stat:100,duration:60,armor:'mixed',movement:'ideal',enemyAA:0});
export const MECHANICS_CONFLICTS = Object.freeze({
  '31040':{field:'shell_range',reason:'Pinned extract gives 45–55; BWIKI reports 40–60. Range is not evaluated.'}
});
const norm=s=>String(s).toLowerCase().replace(/[^a-z0-9]/g,'');
export function resolveCombatItem(candidate,data=COMBAT_DATA){
  if(candidate?.source!=='fernando')return null;
  const item=data?.equipment?.[String(candidate.sourceId)];
  if(!item||!Array.isArray(item.aliases)||item.type!==candidate.typeCode||![item.name,...item.aliases].some(n=>norm(n)===norm(candidate.name)))return null;
  return item;
}
const statBonus=(item,stat,level)=>{
  if(!Array.isArray(item.stats)||!item.stats.every(s=>s&&typeof s.stat==='string'&&Array.isArray(s.values)))return null;
  const matching=item.stats.filter(s=>s.stat===stat);
  if(matching.length>1)return null;
  if(!matching.length)return 0; // Verified complete stat list has no bonus for this stat.
  const v=matching[0].values[level];return typeof v==='number'&&Number.isFinite(v)&&v>=0?v:null;
};
/** A component comparison; the compatible pool is supplied by the existing planner. */
export function compareSlot(model,index,context=COMBAT_PRESET,data=COMBAT_DATA){
  const slot=Array.isArray(model?.slots)?model.slots.find(s=>s?.index===index):null, ship=gameShipSlots(model?.sourceId);
  const rows=[],excluded=[];
  const fail=reason=>({status:'unknown',reason,rows,excluded,recommended:null});
  if(model?.combatUnsupportedReason)return fail(model.combatUnsupportedReason);
  if(!slot||slot.kind!=='weapon'||!ship?.slots[index])return fail('No supported weapon slot');
  const c={...COMBAT_PRESET,...context}, weights=c.armor==='mixed'?[1/3,1/3,1/3]:c.armor;
  if(!['general','boss','mobbing','opsi'].includes(model.mode))return fail('Unknown encounter mode');
  if(model.mode==='boss'&&c.armor==='mixed')return fail('Choose the boss armor to compare direct damage');
  if(c.movement!=='ideal')return fail('We haven’t accounted for moving targets yet. Choose “every shot lands” to compare damage under that assumption.');
  if(!Number.isInteger(c.level)||c.level<0||![c.reload,c.stat,c.duration].every(v=>typeof v==='number'&&Number.isFinite(v)&&v>=0)||c.duration>600)
    return fail('Invalid scenario inputs');
  const sourceSlot=ship.slots[index];
  if(slot.maxEfficiency!==sourceSlot.maxEfficiency||slot.maxMounts!==sourceSlot.maxMounts||slot.parallel!==sourceSlot.parallel||slot.capacity!==sourceSlot.capacity)
    return fail('The slot data disagrees with our mechanics snapshot, or its efficiency is missing. We cannot calculate a reliable comparison.');
  if(!Array.isArray(slot.candidates))return fail('Missing compatible candidate list');
  const mapped=slot.candidates.map(candidate=>({candidate,item:resolveCombatItem(candidate,data)}));
  for(const {candidate,item} of mapped){
    const exclude=reason=>excluded.push({sourceId:String(candidate?.sourceId??'unknown'),name:candidate?.name??'Unknown equipment',reason});
    if(!item){exclude('We could not match this gear to a reliable mechanics record.');continue;}
    if(!Array.isArray(item.skills)||!Array.isArray(item.hull_restriction)){exclude('Incomplete skill or hull restrictions');continue;}
    if(item.skills.length){exclude('We haven’t calculated this equipment’s skill effects yet.');continue;}
    if(!sourceSlot.types.includes(item.type)||item.hull_restriction.includes(ship.hullId)){exclude('Source slot or hull incompatibility');continue;}
    const conflict=data.conflicts?.[item.id]||MECHANICS_CONFLICTS[item.id];
    if(conflict&&['reload','damage','coefficient','armor'].includes(conflict.field)){
      excluded.push({sourceId:String(item.id),name:item.name,reason:conflict.reason});continue;
    }
    const types=model.slots.map(s=>s?.index===index?item.type:s?.selected?.typeCode);
    let skill=skillCondition(model.sourceId,types);
    if(item.weapon?.aircraft){
      const wing=[];
      for(let i=0;i<3;i++){
        const selected=i===index?item:c.wing==='reference'?data?.equipment?.[[17340,17340,28140][i]]:resolveCombatItem(model.slots.find(s=>s?.index===i)?.selected,data);
        if(!selected?.weapon?.aircraft||!ship.slots[i].types.includes(selected.type)||!Array.isArray(selected.hull_restriction)||selected.hull_restriction.includes(ship.hullId)||!Array.isArray(selected.skills)||selected.skills.length||ship.slots[i].parallel!==1)break;
        if(data.conflicts?.[selected.id]&&['reload','damage','coefficient','armor'].includes(data.conflicts[selected.id].field))break;
        wing.push({item:selected,mounts:ship.slots[i].maxMounts});
      }
      skill=skillCondition(model.sourceId,wing.map(x=>x.item.type));
      if(wing.length!==3||skill.status!=='source-conditioned'||!skill.role){exclude('We need usable data for all three aircraft slots and the matching ship skill. Try the reference wing.');continue;}
      const air=airstrikeCycle(wing,{level:c.level,reload:c.reload,loadingMultiplier:skill.loadingMultiplier});
      if(air.status!=='calculated'){exclude(air.reasons.join('; '));continue;}
      if(!Array.isArray(item.armaments)||!item.armaments.every(a=>a&&Array.isArray(a.damage))){exclude('Incomplete aircraft payload records');continue;}
      rows.push({id:candidate.id,name:candidate.name,sourceId:String(item.id),kind:'aircraft',cycle:air.value,
        wing:wing.map(x=>({id:x.item.id,name:x.item.name,mounts:x.mounts})),intercepts:item.weapon.is_interceptor,payload:item.armaments.filter(a=>a.ammo!==5).map(a=>({id:a.id,name:a.name,count:a.count,damage:a.damage[c.level]??null,armor:a.armor_mod,aim:a.aim_type})),skill,
        evidenceClass:'reproducible-component',limitations:['These timings do not tell us aircraft damage or how much healing reaches the fleet. Hit rate, interception damage, aircraft losses and barrages are not calculated.']});
      continue;
    }
    const cooldown=gunAbsoluteCooldown(item,sourceSlot.capacity);
    if(cooldown.status!=='calculated'){exclude(cooldown.reasons.join('; '));continue;}
    const bonus=statBonus(item,item.weapon?.stat,c.level);
    if(bonus===null){exclude('Missing or contradictory equipment stat bonus');continue;}
    const absoluteCooldown=cooldown.value;
    const cycle=weaponCycle(item,{level:c.level,reload:c.reload,absoluteCooldown});
    const volley=directVolley(item,{level:c.level,stat:c.stat+statBonus(item,item.weapon?.stat,c.level),
      efficiency:sourceSlot.maxEfficiency,mounts:sourceSlot.maxMounts,parallel:sourceSlot.parallel,armor:weights});
    if(cycle.status!=='calculated'||volley.status!=='calculated'){exclude([...(cycle.reasons||[]),...(volley.reasons||[])].join('; '));continue;}
    const timeline=attackTimeline({cycle:cycle.value,duration:c.duration});
    if(timeline.status!=='calculated'){exclude(timeline.reasons.join('; '));continue;}
    const dps=volley.value/cycle.value,directTotal=volley.value*timeline.events.length;
    const armorDps={};let invalidArmor=false;
    for(const armor of ['light','medium','heavy']){
      const damage=directVolley(item,{level:c.level,stat:c.stat+bonus,efficiency:sourceSlot.maxEfficiency,
        mounts:sourceSlot.maxMounts,parallel:sourceSlot.parallel,armor});
      if(damage.status!=='calculated'){invalidArmor=true;break;}
      armorDps[armor]=damage.value/cycle.value;
    }
    // Finite inputs and individual formulas do not guarantee finite derived metrics.
    // Reject the entire row before ranking; never coerce an unknown armor result to zero.
    if(invalidArmor||![dps,directTotal,...Object.values(armorDps)].every(Number.isFinite)){
      exclude('Damage per second or total damage exceeds the numeric range, or an armor calculation is unavailable. This option cannot be compared reliably.');continue;
    }
    rows.push({id:candidate.id,name:candidate.name,sourceId:String(item.id),kind:'gun',cycle:cycle.value,
      parallel:sourceSlot.parallel,capacity:sourceSlot.capacity,absoluteCooldown,volley:volley.value,dps,activations:timeline.events.length,
      directTotal,barrageTriggers:skill.every?Math.floor(timeline.events.length/skill.every):null,armorDps,
      pattern:{count:item.weapon.count,volley:item.weapon.volley_info,spread:item.weapon.spread_angle,splash:item.weapon.splash,pierce:item.weapon.pierce,velocity:item.weapon.velocity},skill,
      evidenceClass:'reproducible-component',limitations:['Assumes every projectile hits one target. Crits, burns, barrages, skill buffs, aiming time and staggered mounts are not included. Absolute cooldown is an estimate.']});
  }
  if(rows.length<2)return fail('There isn’t enough data to compare two options yet. For aircraft, all three slots need usable mechanics data; you can try the reference wing.');
  const guns=rows.every(r=>r.kind==='gun');
  // Preserve raw alternatives. No arbitrary aggregate score or full-build recommendation.
  const damageLeader=guns?[...rows].sort((a,b)=>b.dps-a.dps)[0]:null;
  const timingLeader=[...rows].sort((a,b)=>a.cycle-b.cycle)[0];
  const alternative=guns?rows.find(r=>r.id!==damageLeader.id&&Object.keys(r.armorDps).some(a=>r.armorDps[a]>damageLeader.armorDps[a]))||rows.find(r=>r.id!==damageLeader.id):null;
  const betterArmor=alternative?Object.keys(alternative.armorDps).filter(a=>alternative.armorDps[a]>damageLeader.armorDps[a]):[];
  const alternativeReason=betterArmor.length?'More direct damage per second against '+betterArmor.join('/')+' armor.':
    alternative?.cycle<damageLeader?.cycle?'Fires sooner, giving salvo-triggered skills more chances to activate. Barrage damage is not included.':
      'This gear fits, but it has no damage or timing advantage in this calculation.';
  return {status:'partial',recommended:null,rows,excluded,damageLeader,timingLeader,alternative,alternativeReason,context:c,
    coverage:{compared:rows.length,compatible:slot.candidates.length},source:data.source,
    modeNote:model.mode==='mobbing'?'Faster guns fire more often, which can help between waves. We haven’t accounted for coverage or damage wasted on nearly defeated enemies.':
      model.mode==='opsi'?'OpSi adaptation, survival, Anti-Siren effects and fleet timing are not included yet.':
      model.mode==='general'?'Mixed armor gives light, medium and heavy armor equal weight. Your actual encounters may favor one type.':'This compares your chosen armor type and assumes every shot lands. Moving-target accuracy is not included.'};
}
