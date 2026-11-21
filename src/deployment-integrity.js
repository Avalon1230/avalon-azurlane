import {BUILD} from './release-data.js';
export function deploymentState(build,htmlVersion,remote) {
 if(htmlVersion!==build.version)return 'mixed';
 if(!remote||remote.schemaVersion!==1||typeof remote.fingerprint!=='string')return 'unavailable';
 return remote.version===build.version&&remote.fingerprint===build.fingerprint?'current':'changed';
}
export async function checkDeployment({fetcher=fetch,htmlVersion,build=BUILD}={}) {
 try{
  const response=await fetcher(new URL('../data/deployment.json',import.meta.url),{cache:'no-store',signal:AbortSignal.timeout(6000)});
  return deploymentState(build,htmlVersion,response.ok?await response.json():null);
 }catch{return deploymentState(build,htmlVersion,null);}
}
export {BUILD};
