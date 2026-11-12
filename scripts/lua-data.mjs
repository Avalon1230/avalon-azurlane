// Read literal data tables only. Never evaluate extracted client Lua code.
export function luaTable(text, start) {
 let at=start;
 const ws=()=>{while(/\s/.test(text[at]||'')&&at<text.length)at++;};
 const expect=c=>{ws();if(text[at++]!==c)throw Error('Expected '+c+' at '+(at-1));};
 function value(){
  ws();if(text.startsWith('[[',at)){const end=text.indexOf(']]',at+2);if(end<0)throw Error('Long string');const s=text.slice(at+2,end);at=end+2;return s;}
  if(text[at]==='{')return table();
  if(text[at]==='"'){const start=at++;while(at<text.length){if(text[at]==='\\'){at+=2;continue;}if(text[at++]==='"')return JSON.parse(text.slice(start,at));}throw Error('String');}
  const match=text.slice(at).match(/^(?:-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|nil)\b/);if(!match)throw Error('Nonliteral value at '+at);
  at+=match[0].length;return match[0]==='nil'?null:match[0]==='true'?true:match[0]==='false'?false:Number(match[0]);
 }
 function table(){expect('{');const array=[],object={};let keyed=false;ws();while(text[at]!=='}'){
   const key=text.slice(at).match(/^([A-Za-z_]\w*)\s*=/);
   if(key){keyed=true;at+=key[0].length;object[key[1]]=value();}
   else if(text[at]==='['&&!text.startsWith('[[',at)){keyed=true;at++;const k=value();expect(']');expect('=');object[k]=value();}
   else array.push(value());
   ws();if(text[at]===','){at++;ws();}else if(text[at]!=='}')throw Error('Table delimiter at '+at);
  }at++;if(keyed&&array.length)throw Error('Mixed table');return keyed?object:array;
 }
 const result=value();return {value:result,end:at};
}
export function luaRecord(text,table,id){
 const marker=new RegExp('(?:pg\\.base\\.|pg\\.)'+table+'\\['+id+'\\]\\s*=\\s*\\{').exec(text);
 if(!marker)return null;
 return luaTable(text,marker.index+marker[0].lastIndexOf('{')).value;
}
