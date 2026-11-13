import {luaRecord} from './lua-data.mjs';
export function buildProgressionRecords(manifest,client,blueprints,stages,skills){
 const result={records:{},skills:{}};
 for(const r of Object.values(manifest.records)){
  const bp=luaRecord(blueprints,'ship_data_blueprint',r.id);if(!bp||bp.strengthen_effect.length!==30)throw Error('Blueprint '+r.id);
  const readStage=id=>{
   const stage=luaRecord(stages,'ship_strengthen_blueprint',id);if(!stage)throw Error('Stage '+id);
   const keys=['id','lv','need_lv','effect','special','effect_attr','effect_breakout','effect_base','effect_preload','effect_equipment_proficiency','effect_skill','change_skill'];
   return Object.fromEntries(keys.map(k=>[k,stage[k]]));
  };
  const input=client.records[r.id];if(!input)throw Error('Ship '+r.id);
  const row={id:r.id,attrExp:bp.attr_exp,forms:input.ship_data_statistics.map((s,i)=>({statistics:s,template:input.ship_data_template[i]})),development:bp.strengthen_effect.map(readStage),fate:bp.fate_strengthen.map(readStage)};
  result.records[r.id]=row;
  const ids=new Set(row.forms.flatMap(f=>f.template.buff_list));
  for(const stage of [...row.development,...row.fate])if(Array.isArray(stage.change_skill))stage.change_skill.forEach(id=>ids.add(id));
  for(const id of ids){
   const skill=luaRecord(skills,'skill_data_template',id);
   if(skill)result.skills[id]={id:skill.id,name:skill.name,type:skill.type,maxLevel:skill.max_level,description:skill.desc,parameters:skill.desc_add};
  }
 }
 return result;
}
