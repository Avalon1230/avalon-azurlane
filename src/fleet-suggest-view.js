import { CURATED_SHIPS, curatedProfile, SUGGEST_SOURCES, SCENARIOS, gearAdvisories } from './fleet-suggest.js';
import { imageMarkup } from './media.js';
const E=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const profileLink=id=>{const s=SUGGEST_SOURCES[id];return s?`<a class="text-link" href="${E(s.url)}" target="_blank" rel="noopener noreferrer">${E(s.label)} ↗</a>`:'';};
export function renderSuggestedFleet({mode,ships,workspace,options={},preview=null,sourceStatus='loading'}) {
  const scenarioOptions=SCENARIOS[mode.id]||[];
  const current=scenarioOptions.some(x=>x.id===options.scenario)?options.scenario:scenarioOptions[0]?.id;
  const reviewed=ships.filter(ship=>curatedProfile(ship));
  const already=new Set();const candidates=reviewed.filter(s=>!already.has(s.id)&&already.add(s.id));
  const owned=new Set(options.ownedIds||[]);
  const checkboxes=(options.poolOpen?`<div class="suggest-pool-grid">${candidates.map(ship=>`<label class="suggest-ship"><input type="checkbox" data-suggest-owned="${E(ship.id)}" ${owned.has(ship.id)?'checked':''}>${imageMarkup(ship,'ship','asset-owned')}<span>${E(ship.name)}<small>${E(ship.hull)}</small></span></label>`).join('')}</div>`:'');
  const availability = sourceStatus === 'failed' ? ' · Local candidates only' : '';
  let result='';
  if(preview && preview.modeId===mode.id){
    const count=preview.changes.length,missing=preview.missing.length,unverified=preview.changes.filter(x=>!x.qualified).length;
    const groups=Object.entries(preview.plan.fleets).map(([fleetId,slots])=>{
      const delta=preview.changes.filter(row=>row.fleetId===fleetId);
      const locks=preview.locked.filter(row=>row.fleetId===fleetId);
      const absent=preview.missing.filter(row=>row.fleetId===fleetId);
      const content=[...delta.map(x=>`<div class="suggest-item">${imageMarkup(x.name,'ship','asset-suggestion')}<span class="suggest-pos">${E(x.slotId)}</span><strong>${E(x.name)}</strong><span class="suggest-basis">${E(x.rationale)} · ${E(x.role)}</span><div class="suggest-links">${x.sources.slice(0,2).map(profileLink).join('')}</div>${x.note&&x.note!=='Provisional role classification; inspect skills and gear before deploying.'?`<div class="suggest-nuance">${E(x.note)}</div>`:''}</div>`),...locks.map(x=>`<div class="suggest-item suggest-locked">${imageMarkup(x.name,'ship','asset-suggestion')}<span class="suggest-pos">${E(x.slotId)}</span><strong>${E(x.name)} (retained)</strong><span class="suggest-basis">Your existing pick stays here</span></div>`),...absent.map(x=>`<div class="suggest-item suggest-gap"><span class="suggest-pos">${E(x.slotId)}</span><strong>Unfilled</strong><span class="suggest-basis">Requested: ${E(x.role)}</span></div>`)].join('');
      return `<details class="suggest-fleet"><summary>${E(fleetId.toUpperCase())} <span>${delta.length} suggested · ${locks.length} retained · ${absent.length} unfilled</span></summary><div class="suggest-items">${content}</div></details>`;
    }).join('');
    const advisories=gearAdvisories(mode.id,current).map(x=>`<li><strong>${E(x.label)}:</strong> ${E(x.text)} ${profileLink(x.source)}</li>`).join('');
    result=`<div class="suggest-results"><div class="suggest-result-head"><div><strong>Suggested formation preview</strong><small>${count} new · ${preview.locked.length} preserved · ${missing} unfilled · ${unverified} role mismatches</small></div><button type="button" class="small-btn" data-action="suggest-apply" ${!count?'disabled':''}>Apply ${count} additions</button></div>
    <div class="suggest-note"><strong>Matched by ship roles.</strong> We haven’t simulated this fleet’s damage, skill timing or gear. Check the lineup before taking it into battle.</div>
    ${groups}<div class="suggest-advice"><strong>Gear and timing to check</strong><ul>${advisories}</ul></div>
    <div class="suggest-cautions"><strong>Limitations and next checks</strong><ul>${preview.notes.map(x=>`<li>${E(x)}</li>`).join('')}</ul></div></div>`;
  }
  return `<section class="suggest-panel"><div class="suggest-heading"><div><div class="eyebrow">AVALON / AUTOMATIC FORMATION PREVIEW</div><h2>Suggest a Fleet</h2><p>Find ships to fill your fleet while keeping the choices you already made.</p></div></div>
    <div class="suggest-toolbar"><label class="select-wrap">Scenario <select id="suggest-scenario">${scenarioOptions.map(s=>`<option value="${E(s.id)}" ${current===s.id?'selected':''}>${E(s.label)}</option>`).join('')}</select></label>
    <label class="suggest-owned-toggle"><input id="suggest-owned-only" type="checkbox" ${options.ownedOnly?'checked':''}> Use only my checked ships</label>
    <button type="button" class="outline-btn compact" data-action="suggest-generate">Suggest ships</button></div>
    <div class="suggest-pool-head"><span>${candidates.length} reviewed ships · ${candidates.filter(s=>owned.has(s.id)).length} checked as available${E(availability)}</span><button type="button" class="ghost-btn" data-action="suggest-toggle-pool">${options.poolOpen?'Hide':'Show'} ship availability</button></div>
    ${options.poolOpen?`<div class="suggest-pool-actions"><button class="ghost-btn" type="button" data-action="suggest-all-owned">Mark all reviewed ships available</button><button class="ghost-btn" type="button" data-action="suggest-none-owned">Clear available ships</button></div>${checkboxes}`:''}
    ${result}</section>`;
}