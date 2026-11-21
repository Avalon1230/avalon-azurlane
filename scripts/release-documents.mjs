/** Shared filesystem input for release validation and isolated release rehearsals. */
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
export const releaseDocumentPaths={metadata:'data/release-status.json',pkg:'package.json',readme:'README.md',changelog:'CHANGELOG.md',status:'docs/PROJECT_STATUS.md',html:'index.html'};
export async function readReleaseDocuments(root,{generated=true}={}){
 const result={};
 for(const [key,path] of Object.entries(releaseDocumentPaths)){
  const text=await readFile(resolve(root,path),'utf8');
  result[key]=['metadata','pkg'].includes(key)?JSON.parse(text):text;
 }
 if(generated){
  result.deployment=JSON.parse(await readFile(resolve(root,'data/deployment.json'),'utf8'));
  const module=await readFile(resolve(root,'src/release-data.js'),'utf8');
  const match=module.match(/^export const BUILD=(\{[^\n]+\});$/m);
  if(!match)throw Error('Malformed generated BUILD module');
  result.build=JSON.parse(match[1]);
 }
 return result;
}
