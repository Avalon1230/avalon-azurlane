import test from 'node:test';
import assert from 'node:assert/strict';
import { renderCatalogIndex } from '../src/catalog-index.js';
const shipRow=(id,name,nation,hull='DD')=>({id:String(id),sourceId:String(id),name,nation,hull,rarity:'Super Rare',tags:[]});
const card=item=>'<article data-ship="'+item.id+'">'+item.name+'</article>';
test('nation-categorized ship index supports all 894 records with 15 pages',()=>{
  const rows=Array.from({length:894},(_,i)=>shipRow(10000+i,'Ship '+i,i%2===0?'Eagle Union':'Royal Navy',i%4===0?'BB':'DD'));
  const page=renderCatalogIndex({kind:'ships',records:rows,page:15,renderCard:card});
  assert.match(page,/894 indexed total/);
  assert.match(page,/Page <select/);
  assert.match(page,/<option value="15" selected>/);
  assert.match(page,/data-ship="10893"/);
  assert.doesNotMatch(page,/data-ship="10000"/);
  assert.match(page,/Eagle Union/);
  assert.match(page,/Royal Navy/);
  assert.match(page,/All nations/);
});
test('equipment view filters by type, origin, and hull without fictional equipability',()=>{
  const gear=[
    {id:'1',name:'Eagle Fighter',category:'Fighter',nation:'Eagle Union',typeCode:7,forbiddenHullIds:[]},
    {id:'2',name:'Iron Fighter',category:'Fighter',nation:'Iron Blood',typeCode:7,forbiddenHullIds:[7]},
    {id:'3',name:'Unknown',category:'Other',nation:'Unclassified'}
  ];
  const html=renderCatalogIndex({kind:'equipment',records:gear,hull:'CV',renderCard:card});
  assert.match(html,/Eagle Fighter/);
  assert.doesNotMatch(html,/Iron Fighter<\/article>/);
  assert.doesNotMatch(html,/Unknown<\/article>/);
  assert.match(html,/Equippable by hull/);
  assert.match(html,/Equipment type/);
});
test('search escaping prevents attribute injection in catalog controls',()=>{
  const html=renderCatalogIndex({kind:'ships',records:[],query:'" autofocus onfocus="alert(1)',renderCard:card});
  assert.match(html,/&quot; autofocus onfocus=&quot;/);
  assert.doesNotMatch(html,/value="" autofocus/);
});
test('invalid catalog types throw rather than silently presenting wrong records',()=>{
  assert.throws(()=>renderCatalogIndex({kind:'unknown',records:[],renderCard:card}),/Unknown catalog/);
});