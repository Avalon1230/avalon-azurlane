/** Validate current release statements without rewriting historical handoff sections. */
export function releaseErrors({metadata,pkg,readme,changelog,status,html}) {
 const errors=[],expect=(ok,label)=>{if(!ok)errors.push(label);};
 expect(metadata.schemaVersion===1&&['unreleased','released'].includes(metadata.status),'release metadata schema/status');
 expect(pkg.version===metadata.version,'package version differs from release metadata');
 const first=changelog.match(/^## \[([^\]]+)\] - (\d{4}-\d{2}-\d{2})$/m);
 expect(first?.[1]===metadata.version,'first changelog version/date differs');
 const current=changelog.split(/^## /m)[1]||'';
 expect(metadata.status==='released'||current.includes('Unreleased;'),'development version is not marked Unreleased');
 const releaseLine=readme.split('\n').find(l=>l.startsWith('**Release status:**'))||'';
 expect(releaseLine.includes('live release is v'+metadata.releasedVersion),'README live release is stale');
 expect(metadata.status==='released'||releaseLine.includes('v'+metadata.version)&&releaseLine.includes('is unreleased'),'README development status is stale');
 expect(status.includes('## Current release — v'+metadata.releasedVersion),'project current release is stale');
 expect(metadata.status==='released'||status.includes('## Active development — v'+metadata.version),'project active version is stale');
 expect(html.includes('name="avalon-version" content="'+metadata.version+'"'),'HTML build version is stale');
 return errors;
}
