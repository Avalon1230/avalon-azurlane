/** Validate current release statements; historical handoffs remain historical. */
export function releaseErrors({metadata,pkg,readme,changelog,status,html,deployment,build},{requireReleased=false}={}) {
 const errors=[],expect=(ok,label)=>{if(!ok)errors.push(label);};
 const versionPattern=/^\d+\.\d+\.\d+$/;
 const released=metadata.status==='released';
 expect(metadata.schemaVersion===1&&['unreleased','released'].includes(metadata.status),'release metadata schema/status');
 expect(versionPattern.test(metadata.version)&&versionPattern.test(metadata.releasedVersion),'release version format');
 expect(pkg.version===metadata.version,'package version differs from release metadata');
 expect(!requireReleased||released,'deployment requires a finalized released build');
 const first=changelog.match(/^## \[([^\]]+)\] - (\d{4}-\d{2}-\d{2})\s*$/m),current=changelog.split(/^## /m)[1]||'';
 const changelogState=current.split(/\r?\n\s*\r?\n/)[1]||'';
 expect(first?.[1]===metadata.version,'first changelog version/date differs');
 const releaseLines=readme.split(/\r?\n/).filter(l=>l.startsWith('**Release status:**'));
 const releaseLine=releaseLines[0]||'';
 expect(releaseLines.length===1,'README requires exactly one release status');
 expect(releaseLine.match(/\blive release is v(\d+\.\d+\.\d+)\b/)?.[1]===metadata.releasedVersion,'README live release is stale');
 const currentHeadings=[...status.matchAll(/^## Current release [^\r\n]*?\bv(\d+\.\d+\.\d+)\b[^\r\n]*$/gm)];
 const activeHeadings=[...status.matchAll(/^## Active development [^\r\n]*?\bv(\d+\.\d+\.\d+)\b[^\r\n]*$/gm)];
 expect(currentHeadings.length===1&&currentHeadings[0]?.[1]===metadata.releasedVersion,'project current release is stale');
 const firstStatusHeading=status.match(/^## .+$/m)?.[0];
 if(released){
  expect(metadata.releasedVersion===metadata.version,'releasedVersion must equal version when released');
  expect(validReleaseDate(metadata.releaseDate),'released build requires a valid releaseDate');
  expect(validApproval(metadata.releaseApproval),'released build requires a Commander approval record');
  expect(!Object.hasOwn(metadata,'releasedMain'),'released build must not retain the previous releasedMain');
  expect(first?.[2]===metadata.releaseDate&&changelogState.startsWith('Released on '+metadata.releaseDate+';'),'released changelog date/status is stale');
  expect(!/\bunreleased\b|\bpreview\b|awaits? .*authoriz|authorization required/i.test(changelogState),'released changelog retains development status');
  expect(!/\bunreleased\b|\bpreview\b|awaits? /i.test(releaseLine)&&releaseLine.includes('released on '+metadata.releaseDate),'README retains development status or stale release date');
  expect(activeHeadings.length===0&&firstStatusHeading===currentHeadings[0]?.[0],'released project status retains active development');
  const section=status.slice(currentHeadings[0]?.index||0).split(/^## /m)[1]||'';
  expect(section.includes('Released on '+metadata.releaseDate+';')&&!/\bunreleased\b|\bpreview\b|awaits? .*authoriz|authorization required/i.test(section),'released project status/date is stale');
 }else{
  const a=String(metadata.version).split('.').map(Number),b=String(metadata.releasedVersion).split('.').map(Number);
  const firstDifference=a.findIndex((value,i)=>value!==b[i]);
  expect(firstDifference>=0&&a[firstDifference]>b[firstDifference],'unreleased version must be newer than releasedVersion');
  expect(!metadata.releaseDate&&!metadata.releaseApproval,'unreleased build must not claim release approval/date');
  expect(/^Unreleased;/m.test(current)&&!/^Released on /m.test(current),'development version is not marked Unreleased');
  expect(releaseLine.match(/\bv(\d+\.\d+\.\d+) [^.\n]*?is unreleased\b/)?.[1]===metadata.version,'README development status is stale');
  expect(activeHeadings.length===1&&activeHeadings[0]?.[1]===metadata.version&&/\(unreleased\)/i.test(activeHeadings[0]?.[0])&&firstStatusHeading===activeHeadings[0]?.[0],'project active version is stale');
 }
 expect(html.includes('name="avalon-version" content="'+metadata.version+'"'),'HTML build version is stale');
 // The CLI supplies both generated artifacts; pure document fixtures may omit them.
 if(deployment!==undefined||build!==undefined){
  expect(deployment?.schemaVersion===1&&deployment.version===metadata.version&&deployment.status===metadata.status,'deployment version/status differs from release metadata');
  expect(build?.version===metadata.version&&build?.status===metadata.status,'generated BUILD version/status differs from release metadata');
  expect(/^[a-f0-9]{64}$/.test(deployment?.fingerprint||'')&&build?.fingerprint===deployment?.fingerprint,'generated build fingerprints differ');
 }
 return errors;
}

export function validReleaseDate(value){
 return typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&!Number.isNaN(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;
}
export function validApproval(value){
 return typeof value==='string'&&/^https:\/\/github\.com\/Avalon1230\/avalon-azurlane\/pull\/\d+#(?:pullrequestreview-|issuecomment-)\d+$/.test(value);
}
