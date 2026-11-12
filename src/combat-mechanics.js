/** Pure, bounded calculations. Inputs describe a scenario, never a player's stats. */
const finite = (v, min=0) => typeof v === 'number' && Number.isFinite(v) && v >= min;
const unknown = (...reasons) => ({status:'unknown', reasons, value:null});
export function reloadSeconds(weapon, level, reload) {
  if(!Number.isInteger(level)||level<0||!finite(reload)||!finite(weapon?.reload?.[level], Number.MIN_VALUE))
    return unknown('Missing enhancement or final RLD');
  return {status:'calculated',value:weapon.reload_seconds ? weapon.reload[level]
    : weapon.reload[level]/(6*Math.sqrt((reload+100)*3.14))};
}
export function armorWeights(armor) {
  if(['light','medium','heavy'].includes(armor))return ['light','medium','heavy'].map(x=>+(x===armor));
  if(Array.isArray(armor)&&armor.length===3&&armor.every(x=>finite(x))&&Math.abs(armor.reduce((a,b)=>a+b,0)-1)<1e-9)return armor;
  return null;
}
/** Ideal direct-hit damage, excludes random +0/1/2, crits, burns and all skills. */
export function directVolley(item,{level,stat,efficiency,mounts,armor}={}) {
  const w=item?.weapon, weights=armorWeights(armor);
  if(!w||w.aircraft||![1,2,3,4,5,11,13].includes(item.type))return unknown('Unsupported weapon damage family');
  if(!Number.isInteger(level)||level<0||!finite(stat)||!finite(efficiency,Number.MIN_VALUE)||!Number.isSafeInteger(mounts)||mounts<1||!weights)
    return unknown('Missing explicit stat, mounts, efficiency or armor');
  if(![w.damage?.[level],w.coefficient?.[level],w.ratio,w.count].every(x=>finite(x,Number.MIN_VALUE))||
    w.armor_mod?.length!==3||!w.armor_mod.every(x=>finite(x)))return unknown('Incomplete weapon damage fields');
  const value=w.damage[level]*w.coefficient[level]*efficiency*(1+stat*w.ratio/100)*w.count*mounts*
    weights.reduce((s,p,i)=>s+p*w.armor_mod[i],0);
  return {status:'calculated',value};
}
/** Absolute cooldown is explicit: published averages are not exact animation timing. */
export function weaponCycle(item,{level,reload,absoluteCooldown}={}) {
  const r=reloadSeconds(item?.weapon,level,reload);
  if(r.status!=='calculated')return r;
  if(item.weapon.aircraft||!finite(item.weapon.delay)||!finite(absoluteCooldown))return unknown('Volley/absolute cooldown required');
  return {status:'calculated',value:r.value+item.weapon.delay+absoluteCooldown,reload:r.value};
}
/** Whole-wing weighted reload; never rank one aircraft by its standalone reload. */
export function airstrikeCycle(wing,{level,reload,loadingMultiplier=1,interception=false}={}) {
  if(!Array.isArray(wing)||!wing.length||!finite(loadingMultiplier,Number.MIN_VALUE))return unknown('Complete air wing required');
  let total=0,count=0;
  for(const {item,mounts} of wing){
    if(!item?.weapon?.aircraft||!Number.isSafeInteger(mounts)||mounts<1)return unknown('Invalid air wing');
    if(interception&&!item.weapon.is_interceptor)continue;
    const w=interception?{...item.weapon,reload:item.weapon.intercept_reload}:item.weapon;
    const r=reloadSeconds(w,level,reload);
    if(r.status!=='calculated')return r;
    total+=r.value*mounts;count+=mounts;
  }
  if(!count)return unknown('No intercepting aircraft');
  return {status:'calculated',value:total/count*(interception?1:2.2)*loadingMultiplier+0.033};
}
/** Scheduling primitive, not an in-game timeline: arrival delays must be supplied. */
export function attackTimeline({cycle,duration,first=cycle,arrivalDelay=0,windows=[]}={}) {
  if(!finite(cycle,0.01)||!finite(duration)||duration>600||!finite(first)||!finite(arrivalDelay)||
    !Array.isArray(windows)||!windows.every(w=>finite(w.start)&&finite(w.end)&&w.end>w.start))return unknown('Invalid timeline');
  const events=[];
  for(let i=0,t=first;t+arrivalDelay<=duration+1e-9;i++,t=first+i*cycle){
    const arrival=t+arrivalDelay;
    events.push({launch:t,arrival,windowIds:windows.filter(w=>arrival>=w.start&&arrival<w.end).map(w=>w.id)});
  }
  return {status:'calculated',events};
}
