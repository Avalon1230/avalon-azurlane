import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {RESEARCH_MANIFEST} from '../src/research-manifest.js';
import {buildProgressionRecords} from './research-progression-data.mjs';
const client=JSON.parse(fs.readFileSync('.audit/research-client-extract.json'));
const sources=[...client.sources];
function read(path,file,blob){
 let text=fs.readFileSync('.audit/'+file,'utf8');
 const hash=s=>createHash('sha1').update('blob '+Buffer.byteLength(s)+'\0').update(s).digest('hex');
 if(hash(text)!==blob&&text.endsWith('\n')&&hash(text.slice(0,-1))===blob)text=text.slice(0,-1);
 if(hash(text)!==blob)throw Error('Source identity '+file);
 sources.push({path,blob,sha256:createHash('sha256').update(text).digest('hex')});return text;
}
const blueprints=read('EN/sharecfg/ship_data_blueprint.lua','ship_data_blueprint.lua','9e1fdddd1abbd53e48deed9b11938dc76ff4c17a');
const stages=read('EN/sharecfg/ship_strengthen_blueprint.lua','qa-ship_strengthen_blueprint.lua','1a22fbe9710e7daa27b4ab8b083922e869ad3ae7');
const skills=read('EN/sharecfg/skill_data_template.lua','qa-skill_data_template.lua','00f3f75a8d4cc2a256e413471b12246a981bdcee');
read('EN/model/vo/ship.lua','qa-ship.lua','371074238a9f77b80ec4e4f03ecb9c0baee22f2a');
read('EN/model/vo/shipblueprint.lua','qa-shipblueprint.lua','44de53b5782639796aa4a3bff4d52d6e2cd49c2f');
read('EN/model/const/shipmodattr.lua','qa-shipmodattr.lua','f801e57c19d15a348f39f2642b2bfd60d97dc053');
read('EN/sharecfg/intimacy_template.lua','qa-intimacy_template.lua','a805161de5f8136cf719910d6586b36914730e42');
read('EN/sharecfg/gameset.lua','qa-gameset.lua','f5ca750832e5e6b6404a851220af41b5ada3691b');
const data={schemaVersion:1,commit:client.commit,checked:'2026-11-13',sources,...buildProgressionRecords(RESEARCH_MANIFEST,client,blueprints,stages,skills)};
const generated='// Selected factual client records; see docs/RESEARCH_SHIPS.md for provenance.\nexport const RESEARCH_PROGRESSION_DATA = '+JSON.stringify(data)+';\n';
fs.writeFileSync('src/research-progression-data.js',generated);
console.log('Generated '+Object.keys(data.records).length+' ships and '+Object.keys(data.skills).length+' skill records.');
