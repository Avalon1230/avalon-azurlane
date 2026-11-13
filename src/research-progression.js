import {RESEARCH_PROGRESSION_DATA} from './research-progression-data.js';
export const RESEARCH_LEVELS=Object.freeze({levelBase:1,level100:100,level120:120,level125:125});
const attributes=['health','firepower','torpedo','antiwar','aviation','reload','armor','accuracy','evasion','speed','luck','antisub'];
const sourceAttributes=['durability','cannon','torpedo','antiaircraft','air','reload','armor','hit','dodge','speed','luck','antisub'];
const enhancementIndices=[1,2,3,4,5];
const finite=n=>typeof n==='number'&&Number.isFinite(n)&&n>=0;
const numbers=(a,length)=>Array.isArray(a)&&a.length===length&&a.every(finite);
const emptyOrArray=a=>a===''||Array.isArray(a);
export function researchSkill(id,level=10,data=RESEARCH_PROGRESSION_DATA){
 const skill=data?.skills?.[id];
 if(!skill||skill.id!==id||typeof skill.name!=='string'||typeof skill.description!=='string'||!Number.isInteger(skill.maxLevel)||!Number.isInteger(level)||level<1||level>skill.maxLevel)return {id,status:'unknown',name:'Skill '+id,description:'The selected skill description is unavailable.'};
 let known=true;
 const description=skill.description.replace(/\$(\d+)/g,(_,n)=>{
  const v=skill.parameters?.[Number(n)-1]?.[level-1]?.[0];if(typeof v!=='string'){known=false;return '?';}return v;
 }).replace(/<[^>]*>/g,'');
 return {id,status:known?'verified-description':'unknown',name:skill.name,description:known?description:'The source does not provide every value for this skill level.',level,type:skill.type};
}
/** Completed stages only: zero progress toward the next Dev/Fate stage. */
export function researchProgression(id,{dev=30,fate=0,level=120}={},data=RESEARCH_PROGRESSION_DATA){
 const unknown=reason=>({status:'unknown',reason,stats:null,slots:[],skills:[]});
 const r=data?.records?.[String(id)];
 if(!r||r.id!==String(id))return unknown('Verified progression data is unavailable for this ship.');
 if(!Number.isInteger(dev)||dev<0||dev>30||!Number.isInteger(fate)||fate<0||fate>5||!Object.values(RESEARCH_LEVELS).includes(level))return unknown('Choose a supported ship level and completed Dev/Fate stage.');
 if(!Array.isArray(r.development)||r.development.length!==30||!Array.isArray(r.fate)||![0,5].includes(r.fate.length)||!numbers(r.attrExp,5)||r.attrExp.some(n=>n===0)||!Array.isArray(r.forms)||r.forms.length!==4)return unknown('The progression source record is incomplete.');
 if((fate>0&&dev!==30)||fate>r.fate.length)return unknown('This Fate stage is unavailable at the selected development level.');
 const stages=[...r.development.slice(0,dev),...r.fate.slice(0,fate)];
 let formId=Number(id)*10+1,minimumLevel=1;
 const additions=Array(12).fill(0),enhancements=Array(5).fill(0),efficiencyAdds=[0,0,0];
 let mounts=null,preloads=null;const replacements=[];
 for(const [index,s] of stages.entries()){
  const expectedLevel=index<dev?index+1:31+index-dev;
  if(!s||s.lv!==expectedLevel||!Number.isInteger(s.need_lv)||s.need_lv<1||!numbers(s.effect,5)||![0,1].includes(s.special)||!Number.isInteger(s.effect_breakout)||!['effect_attr','effect_base','effect_preload','effect_equipment_proficiency','effect_skill','change_skill'].every(k=>emptyOrArray(s[k])))return unknown('A development or Fate record is missing or contradictory.');
  minimumLevel=Math.max(minimumLevel,s.need_lv);
  if(index<dev)s.effect.forEach((v,i)=>{enhancements[i]+=v;});
  if(s.special!==1)continue;
  if(s.effect_breakout)formId=s.effect_breakout;
  if(Array.isArray(s.effect_attr))for(const pair of s.effect_attr){
   if(!Array.isArray(pair)||pair.length!==2||!sourceAttributes.includes(pair[0])||!finite(pair[1]))return unknown('Unknown progression stat effect.');
   additions[sourceAttributes.indexOf(pair[0])]+=pair[1];
  }
  for(const [key,target] of [['effect_base','mounts'],['effect_preload','preloads']])if(Array.isArray(s[key])){
   if(!numbers(s[key],3)||!s[key].every(Number.isInteger))return unknown('Invalid weapon mount or preload record.');
   if(target==='mounts')mounts=s[key];else preloads=s[key];
  }
  if(Array.isArray(s.effect_equipment_proficiency)){
   const [slot,amount]=s.effect_equipment_proficiency;
   if(s.effect_equipment_proficiency.length!==2||!Number.isInteger(slot)||slot<1||slot>3||!finite(amount))return unknown('Unknown equipment efficiency effect.');
   efficiencyAdds[slot-1]+=amount;
  }
  if(Array.isArray(s.effect_skill)&&s.effect_skill.length)return unknown('This development skill effect is not supported yet.');
  if(Array.isArray(s.change_skill)){
   if(s.change_skill.length!==2||!s.change_skill.every(x=>Number.isInteger(x)&&x>0))return unknown('Invalid skill replacement.');
   replacements.push(s.change_skill);
  }
 }
 if(level<minimumLevel)return unknown('This configuration requires ship level '+minimumLevel+' or higher. Choose a higher level tab or a lower development/Fate stage.');
 const form=r.forms.find(f=>f?.statistics?.id===formId&&f?.template?.id===formId);
 const base=form?.statistics,template=form?.template;
 if(!base||template.group_type!==Number(id)||!numbers(base.attrs,12)||!numbers(base.attrs_growth,12)||!numbers(base.attrs_growth_extra,12)||!Array.isArray(base.equipment_proficiency)||base.equipment_proficiency.length<3||!base.equipment_proficiency.every(finite)||!numbers(base.base_list,3)||!numbers(base.preload_count,3)||!numbers(base.parallel_max,3)||!Array.isArray(template.buff_list)||!template.buff_list.every(n=>Number.isInteger(n)&&n>0))return unknown('The selected ship form has incomplete base statistics or slots.');
 enhancements.forEach((v,i)=>{additions[enhancementIndices[i]]+=v/r.attrExp[i];});
 const stats={};
 for(let i=0;i<attributes.length;i++){
  // Ship.getShipProperties floors combined blueprint additions before affinity.
  // Integer-scaled arithmetic avoids a floating-point floor at e.g. 107.9999999.
  const scaled=base.attrs[i]*1000+(level-1)*base.attrs_growth[i]+Math.max(0,level-100)*base.attrs_growth_extra[i]+Math.floor(additions[i])*1000;
  const value=i===9?scaled/1000:Math.floor(scaled*([6,10].includes(i)?100:106)/100000);
  if(!finite(value)||value>Number.MAX_SAFE_INTEGER)return unknown('Progression statistics exceed the supported numerical range.');
  stats[attributes[i]]=value;
 }
 const slots=[];
 for(let i=0;i<3;i++){
  const types=template['equip_'+(i+1)];if(!Array.isArray(types)||!types.length||!types.every(n=>Number.isInteger(n)&&n>0))return unknown('Equipment compatibility for this form is unknown.');
  const efficiency=base.equipment_proficiency[i]+efficiencyAdds[i];
  if(!finite(efficiency))return unknown('Equipment efficiency is invalid.');
  slots.push({index:i,types,efficiency,mounts:(mounts||base.base_list)[i],preloads:(preloads||base.preload_count)[i],parallel:base.parallel_max[i]});
 }
 let skillIds=[...template.buff_list];
 for(const [from,to] of replacements){if(!skillIds.includes(from)||skillIds.includes(to))return unknown('A Fate skill replacement conflicts with the selected ship form.');skillIds=skillIds.map(id=>id===from?to:id);}
 delete stats.armor; // The client attribute is not the ship's armor classification.
 return {status:'calculated',id:String(id),dev,fate,level,affinity:100,minimumLevel,formId,stats,slots,skills:skillIds.map(id=>researchSkill(id,Math.min(10,data.skills?.[id]?.maxLevel??10),data)),sourceCommit:data.commit};
}
