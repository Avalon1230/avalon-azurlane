import {createHash} from 'node:crypto';
import {luaRecord} from './lua-data.mjs';
import {RESEARCH_MANIFEST} from '../src/research-manifest.js';
const commit=RESEARCH_MANIFEST.sources.client.commit;
const output={commit,sources:[],records:{}};
for(const table of ['ship_data_statistics','ship_data_template']){
 const path='EN/sharecfgdata/'+table+'.lua';
 const response=await fetch('https://raw.githubusercontent.com/AzurLaneTools/AzurLaneLuaScripts/'+commit+'/'+path);if(!response.ok)throw Error(path+' '+response.status);
 const raw=await response.text();output.sources.push({path,blob:createHash('sha1').update('blob '+Buffer.byteLength(raw)+'\0').update(raw).digest('hex'),sha256:createHash('sha256').update(raw).digest('hex')});
 for(const r of Object.values(RESEARCH_MANIFEST.records)){
  const record=output.records[r.id]||={};record[table]=[];
  for(let lb=1;lb<=4;lb++){
   const id=Number(r.id)*10+lb,source=luaRecord(raw,table,id);if(!source)throw Error('Missing '+table+' '+id);
   const keys=table==='ship_data_statistics'?['id','attrs','attrs_growth','attrs_growth_extra','equipment_proficiency','base_list','preload_count','parallel_max','max_hp','name','rarity','type']:['id','buff_list','buff_list_display','equip_1','equip_2','equip_3','base','group_type','star'];
   record[table].push(Object.fromEntries(keys.filter(k=>source[k]!==undefined).map(k=>[k,source[k]])));
  }
 }
}
console.log('RESEARCH_CLIENT_EXTRACT='+JSON.stringify(output));
