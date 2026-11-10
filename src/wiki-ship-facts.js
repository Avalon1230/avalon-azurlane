/**
 * Read-only, on-demand MediaWiki ship-template facts.
 * This is not bulk wiki scraping; profiles are resolved by a known wiki page
 * and validated against their numeric in-game GroupID before use.
 * Source pages expose a {{Ship}} infobox with factual fields, not precomputed tiers.
 */
import { wikiPageTitle, WIKI_API } from './wiki-artwork.js';

const MAX_TEXT=150000;
const STAT_MAP=Object.freeze({
  Health:'health',Fire:'firepower',AA:'antiwar',Torp:'torpedo',Air:'aviation',
  Reload:'reload',Evade:'evasion',Acc:'accuracy',ASW:'antisub'
});
const ENHANCE_LEVELS=Object.freeze({
  levelBase:'Initial',level100:'Max',level120:'120',level125:'125'
});
const cache=new Map();
const plain=v=>String(v??'')
  .replace(/\[\[(?:[^\]|]*\|)?([^\]]+)\]\]/g,'$1')
  .replace(/\[https?:\/\/[^\s\]]+\s+([^\]]+)\]/g,'$1')
  .replace(/\{\{(?:[^{}]|\{[^{}]*\})*\}\}/g,'')
  .replace(/<\/?(?:p|br|hr|span|div)[^>]*\/?>/gi,' ')
  .replace(/&nbsp;/g,' ').replace(/&amp;/g,'&')
  .replace(/'{2,}/g,'').replace(/\s+/g,' ').trim();

export function extractShipFields(wikitext) {
  if(typeof wikitext!=='string'||wikitext.length>MAX_TEXT)return null;
  const start=wikitext.search(/\{\{Ship\s*\n/i);
  if(start<0)return null;
  const rest=wikitext.slice(start);
  const end=rest.search(/^\s*\}\}\s*$/m);
  if(end<0)return null;
  const template=rest.slice(0,end);
  const matches=[...template.matchAll(/^[ \t]*\|[ \t]*([A-Za-z][A-Za-z0-9]*)[ \t]*=[ \t]*/gm)];
  if(!matches.length)return null;
  const fields=Object.create(null);
  for(let i=0;i<matches.length;i++){
    const match=matches[i];
    const key=match[1];
    if(Object.hasOwn(fields,key))continue;
    const beginning=match.index+match[0].length;
    fields[key]=template.slice(beginning,matches[i+1]?.index??template.length).trim();
  }
  return fields;
}
function intField(fields,key,{min=0,max=50000}={}){
  const raw=fields?.[key];
  if(typeof raw!=='string'||!/^\d+$/.test(raw.trim()))return null;
  const n=Number(raw.trim());
  return Number.isSafeInteger(n)&&n>=min&&n<=max?n:null;
}
function percentField(raw){
  if(typeof raw!=='string'||!/^\d+(?:\.\d+)?%$/.test(raw.trim()))return null;
  const value=Number.parseFloat(raw)/100;
  return Number.isFinite(value)&&value>=0&&value<=10?value:null;
}
function levelFields(fields,suffix) {
  const stats=Object.create(null);
  for(const [field,key]of Object.entries(STAT_MAP)){
    const v=intField(fields,field+suffix,{max:100000});
    if(v!==null)stats[key]=v;
  }
  const spd=intField(fields,'Speed',{max:100});
  const luck=intField(fields,'Luck',{max:100});
  if(spd!==null)stats.speed=spd;
  if(luck!==null)stats.luck=luck;
  const consumption=intField(fields,'Consumption'+(suffix==='Initial'?'Initial':'Max'),{max:50});
  if(consumption!==null)stats.oil=consumption;
  // Do not display sparse wiki fragments as a complete level.
  return Number.isFinite(stats.health)&&Object.keys(stats).length>=8?stats:null;
}
export function parseWikiShipFacts(wikitext, sourceId, {pageTitle='',revision=null}={}) {
  const fields=extractShipFields(wikitext);
  if(!fields||!(/^\d{4,8}$/.test(String(sourceId))))return null;
  const groupId=intField(fields,'GroupID',{max:99999999});
  if(String(groupId)!==String(sourceId))return null;
  const stats={};
  for(const [level,suffix]of Object.entries(ENHANCE_LEVELS)){
    const result=levelFields(fields,suffix);
    if(result)stats[level]=result;
  }
  const slots=[1,2,3].map(index=>{
    const type=plain(fields['Eq'+index+'Type']);
    const maxMounts=intField(fields,'Eq'+index+'BaseMax',{max:12});
    const minEfficiency=percentField(fields['Eq'+index+'EffInit']);
    const maxEfficiency=percentField(fields['Eq'+index+'EffInitMax']);
    return type&&minEfficiency!==null&&maxEfficiency!==null
      ?{type,maxMounts,minEfficiency,maxEfficiency}:null;
  });
  const limitBreaks=[1,2,3].map(i=>{
    const value=plain(fields['LB'+i]);
    return value?value.split(/\s+\/\s+/).filter(Boolean):null;
  });
  const skillIcons=Object.create(null);
  for(let i=1;i<=5;i++){
    const name=plain(fields['Skill'+i]);
    const id=intField(fields,'Skill'+i+'Icon',{max:99999999});
    if(name&&id!==null)skillIcons[name]=id;
  }
  const armor=plain(fields.Armor);
  const constructionTime=plain(fields.ConstructTime);
  const dropNote=plain(fields.DropHistory||fields.DropNote);
  const artist=plain(fields.Artist);
  const voiceActor=plain(fields.VA);
  const augmentType=plain(fields.AugmentType);
  return {
    source:'Koumakan Wiki',sourceId:String(sourceId),pageTitle,
    revision:Number.isSafeInteger(revision)?revision:null,
    rarity:plain(fields.Rarity),
    armor:['Light','Medium','Heavy'].includes(armor)?armor:null,
    artist:artist||null,voiceActor:voiceActor||null,
    constructionTime:/^\d{2}:\d{2}:\d{2}$/.test(constructionTime)?constructionTime:null,
    stats,slots:slots.every(Boolean)?slots:null,
    limitBreaks:limitBreaks.every(Boolean)?limitBreaks:null,
    skillIcons,dropNote:dropNote||null,augmentType:augmentType||null
  };
}
export async function loadWikiShipFacts(wikiUrl,sourceId,fetcher=fetch){
  const title=wikiPageTitle(wikiUrl);
  const id=String(sourceId||'');
  if(!title||!/^\d{4,8}$/.test(id))return null;
  const key=id+'|'+title;
  if(fetcher===fetch && cache.has(key))return cache.get(key);
  const request=(async()=>{
    const u=new URL(WIKI_API);
    for(const [key,value]of Object.entries({
      action:'parse',page:title,prop:'wikitext',format:'json',formatversion:'2',origin:'*'
    }))u.searchParams.set(key,value);
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),10000);
    try{
      const response=await fetcher(u.href,{signal:controller.signal,cache:'force-cache'});
      if(!response.ok)throw new Error('MediaWiki ship fields HTTP '+response.status);
      const raw=await response.text();
      if(raw.length>MAX_TEXT)throw new Error('Wiki ship fields exceed request limit');
      const payload=JSON.parse(raw);
      if(!payload?.parse||typeof payload.parse.wikitext!=='string')return null;
      return parseWikiShipFacts(payload.parse.wikitext,id,{
        pageTitle:title,revision:payload.parse.revid
      });
    }finally{clearTimeout(timer);}
  })();
  if(fetcher===fetch)cache.set(key,request);
  try{return await request;}catch(error){
    if(fetcher===fetch)cache.delete(key);
    throw error;
  }
}
