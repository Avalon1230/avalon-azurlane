/** Pure, bounded calculations. Inputs describe a scenario, never a player's stats. */
const finite = (v, min=0) => typeof v === 'number' && Number.isFinite(v) && v >= min;
const unknown = (...reasons) => ({status:'unknown', reasons, value:null});
export const supportedGun = item => [1,2,3,4,11].includes(item?.type)&&item?.weapon?.aircraft===false;
export function gunAbsoluteCooldown(item,capacity){
  if(!supportedGun(item))return unknown('Unsupported weapon timing family');
  if(item.type===4&&(!Number.isSafeInteger(capacity)||capacity<1))return unknown('Verified battleship slot capacity required');
  return {status:'calculated',value:item.type===4?(capacity===1?0.2:0.033):0.3};
}
export function reloadSeconds(weapon, level, reload) {
  if(!Number.isInteger(level)||level<0||!finite(reload)||(weapon?.reload_seconds!==undefined&&typeof weapon.reload_seconds!=='boolean')||!finite(weapon?.reload?.[level], Number.MIN_VALUE))
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
export function directVolley(item,options={}) {
  const {level,stat,efficiency,mounts,parallel,armor}=options??{};
  const w=item?.weapon, weights=armorWeights(armor);
  if(!supportedGun(item))return unknown('Unsupported weapon damage family');
  if(!Number.isInteger(level)||level<0||!finite(stat)||!finite(efficiency,Number.MIN_VALUE)||!Number.isSafeInteger(mounts)||mounts<1||!Number.isSafeInteger(parallel)||parallel<1||!weights)
    return unknown('Missing explicit stat, mounts, parallel, efficiency or armor');
  if(![w.damage?.[level],w.coefficient?.[level],w.ratio,w.count].every(x=>finite(x,Number.MIN_VALUE))||
    !Array.isArray(w.armor_mod)||w.armor_mod.length!==3||!Array.from(w.armor_mod).every(x=>finite(x)))return unknown('Incomplete weapon damage fields');
  const value=w.damage[level]*w.coefficient[level]*efficiency*(1+stat*w.ratio/100)*w.count*mounts*parallel*
    weights.reduce((s,p,i)=>s+p*w.armor_mod[i],0);
  return finite(value)?{status:'calculated',value}:unknown('Non-finite damage');
}
/** Absolute cooldown is explicit: published averages are not exact animation timing. */
export function weaponCycle(item,options={}) {
  const {level,reload,absoluteCooldown}=options??{};
  if(!supportedGun(item))return unknown('Unsupported weapon timing family');
  const r=reloadSeconds(item?.weapon,level,reload);
  if(r.status!=='calculated')return r;
  if(item.weapon.aircraft||!finite(item.weapon.delay)||!finite(absoluteCooldown))return unknown('Volley/absolute cooldown required');
  return {status:'calculated',value:r.value+item.weapon.delay+absoluteCooldown,reload:r.value};
}
/** Whole-wing weighted reload; never rank one aircraft by its standalone reload. */
export function airstrikeCycle(wing,options={}) {
  const {level,reload,loadingMultiplier=1,interception=false}=options??{};
  if(!Array.isArray(wing)||!wing.length||!finite(loadingMultiplier,Number.MIN_VALUE))return unknown('Complete air wing required');
  let total=0,count=0;
  for(const entry of wing){
    const {item,mounts}=entry??{};
    if(item?.weapon?.aircraft!==true||![7,8,9].includes(item.type)||!Number.isSafeInteger(mounts)||mounts<1)return unknown('Invalid air wing');
    if(interception&&typeof item.weapon.is_interceptor!=='boolean')return unknown('Unknown interception capability');
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
export function attackTimeline(options={}) {
  const {cycle,duration,first=cycle,arrivalDelay=0,windows=[]}=options??{};
  if(!finite(cycle,0.01)||!finite(duration)||duration>600||!finite(first)||!finite(arrivalDelay)||
    !Array.isArray(windows)||!Array.from(windows).every(w=>w&&finite(w.start)&&finite(w.end)&&w.end>w.start))return unknown('Invalid timeline');
  const events=[];
  for(let i=0,t=first;t+arrivalDelay<=duration+1e-9;i++,t=first+i*cycle){
    const arrival=t+arrivalDelay;
    events.push({launch:t,arrival,windowIds:windows.filter(w=>arrival>=w.start&&arrival<w.end).map(w=>w.id)});
  }
  return {status:'calculated',events};
}
