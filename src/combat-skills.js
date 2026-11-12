/** Reviewed condition adapters; source skill IDs stay distinct from ship GroupIDs. */
export const SKILL_RULES = Object.freeze({
  '20503':{skillId:10320,event:'salvo',chance:0.4,note:'Base-form Big Seven: 40% chance per salvo; barrage damage is excluded. Retrofit/augment upgrades are not applied.'},
  '60701':{skillId:14380,slot:1,branches:{7:{role:'healing',preload:0,loadingMultiplier:1,heal:0.08,shield:0.06,duration:5},9:{role:'offense',preload:1,loadingMultiplier:0.9,damageBonus:0.08}}},
  '20403':{skillId:10290,event:'salvo',chance:0.7,buff:{stat:'rld',fraction:0.4,duration:8},note:'Barrage and 8s main-fleet RLD buff are not included in gun damage.'},
  '40303':{skillId:23212,event:'main-gun',every:6,note:'All Out Assault after six main-gun activations; barrage damage is not included.'},
  '40123':{skillId:29202,event:'main-gun',every:10,note:'All Out Assault after ten main-gun activations; FP proc and barrage damage are not included.'}
});
export function skillCondition(shipId,slotTypes,{level=10,augmented=false,retrofit=false}={}) {
  const rule=SKILL_RULES[String(shipId)];
  if(!rule)return {status:'unknown',reason:'We haven’t calculated this ship’s skill effects yet.'};
  if(level!==10||augmented||retrofit)return {status:'unknown',reason:'These skill checks cover level 10 on the base ship, without augment replacements or retrofits.'};
  if(rule.branches){
    const branch=rule.branches[slotTypes?.[rule.slot]];
    return branch?{status:'source-conditioned',skillId:rule.skillId,...branch}:{status:'unknown',reason:'We cannot confirm the aircraft type in slot 2.'};
  }
  return {status:'source-conditioned',...rule};
}
