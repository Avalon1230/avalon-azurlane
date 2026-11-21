/** Prepare a Commander-authorized release locally. Never commits, merges or deploys. */
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {releaseErrors,validReleaseDate,validApproval} from './release-consistency.mjs';
import {readReleaseDocuments,releaseDocumentPaths} from './release-documents.mjs';
import {buildRelease} from './build-release.mjs';

export function finalizedDocuments(documents,{date,approval}){
 assert.deepEqual(releaseErrors(documents),[],'Repair release consistency before finalizing');
 assert.equal(documents.metadata.status,'unreleased','Release is already finalized');
 assert(validReleaseDate(date),'Provide the authorized release date as YYYY-MM-DD (Asia/Manila)');
 assert(validApproval(approval),'Provide the GitHub PR review/comment recording Commander release approval');
 const next=structuredClone(documents),version=next.metadata.version;
 const title=next.changelog.match(/^### (.+)$/m)?.[1]||'AVALON update';
 const previousReleasedMain=next.metadata.releasedMain;
 next.metadata={...next.metadata,status:'released',releasedVersion:version,releaseDate:date,releaseApproval:approval,previousReleasedVersion:documents.metadata.releasedVersion};
 delete next.metadata.releasedMain;
 if(previousReleasedMain)next.metadata.previousReleasedMain=previousReleasedMain;
 next.readme=next.readme.replace(/^\*\*Release status:\*\*[^\r\n]*$/m,'**Release status:** The live release is v'+version+', released on '+date+'. Commander authorization: [release approval]('+approval+').');
 next.changelog=next.changelog.replace(/^## \[[^\]]+\] - \d{4}-\d{2}-\d{2}/m,'## ['+version+'] - '+date)
  .replace(/^Unreleased;[^\r\n]*$/m,'Released on '+date+'; Commander authorization: [release approval]('+approval+').');
 // Preserve previous verification and decisions under explicitly historical headings.
 next.status=next.status.replace(/^## Current release /m,'## Previous release ')
  .replace(/^## Active development ([^\r\n]*)$/m,
   '## Current release — v'+version+' ('+date+', Commander-approved)\n\n'+
   'Released on '+date+'; Commander authorization: [release approval]('+approval+').\n\n'+
   '- **Delivered:** '+title+'. See the current [changelog](../CHANGELOG.md).\n'+
   '- **Release verification:** Run full CI on this finalized commit before the authorized merge. After Pages completes, verify the served manifest and version label before reporting deployment success.\n'+
   '- **History and limitations:** The preceding development record below retains source evidence, verification results and remaining coverage gaps.\n\n'+
   '## Historical development $1');
 next.status=next.status.replace(/_Last updated: \d{4}-\d{2}-\d{2}/,'_Last updated: '+date);
 delete next.deployment;delete next.build; // Regenerated from the complete static file graph below.
 assert.deepEqual(releaseErrors(next,{requireReleased:true}),[],'Finalized documents disagree');
 return next;
}

export async function finalizeRelease(root,{date,approval,write=false}){
 const documents=await readReleaseDocuments(root);
 await buildRelease(root,{check:true});
 const next=finalizedDocuments(documents,{date,approval});
 if(write){
  for(const key of ['metadata','readme','changelog','status']){
   await writeFile(resolve(root,releaseDocumentPaths[key]),key==='metadata'?JSON.stringify(next[key],null,2)+'\n':next[key]);
  }
  await buildRelease(root);
  assert.deepEqual(releaseErrors(await readReleaseDocuments(root),{requireReleased:true}),[]);
  await buildRelease(root,{check:true});
 }
 return next;
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const args=process.argv.slice(2),value=key=>args[args.indexOf(key)+1];
 assert(args.includes('--date')&&args.includes('--approval'),'Usage: node scripts/finalize-release.mjs --date YYYY-MM-DD --approval APPROVAL_URL [--write]');
 const write=args.includes('--write');
 const next=await finalizeRelease(fileURLToPath(new URL('..',import.meta.url)),{date:value('--date'),approval:value('--approval'),write});
 console.log((write?'PREPARED':'DRY RUN')+' v'+next.metadata.version+' released state; '+(write?'documents and both build artifacts updated.':'no files changed.'));
 console.log('This command does not verify the approval text, commit, merge or deploy. Commander authorization and final-head CI are still required.');
}
