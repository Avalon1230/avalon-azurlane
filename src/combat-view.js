import {compareSlot,COMBAT_PRESET} from './combat-evaluate.js';
const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const n=v=>Number.isFinite(v)?v.toFixed(2):'Unknown';
export function renderCombatComparison(model,index,context={}){
  const slot=model?.slots?.find(s=>s.index===index);
  if(slot?.kind!=='weapon')return '';
  const c={...COMBAT_PRESET,...context},result=compareSlot(model,index,c);
  const control=(field,label,options)=>'<label>'+E(label)+'<select data-combat-field="'+field+'" id="combat-'+field+'">'+options.map(([value,text])=>'<option value="'+value+'"'+(c[field]===value?' selected':'')+'>'+E(text)+'</option>').join('')+'</select></label>';
  const numeric=(field,label,min,max)=>'<label>'+E(label)+'<input id="combat-'+field+'" data-combat-field="'+field+'" type="number" min="'+min+'" max="'+max+'" value="'+E(c[field])+'"></label>';
  const controls='<div class="combat-controls">'+control('armor','Enemy armor',[['mixed','Mixed: equal thirds'],['light','Light'],['medium','Medium'],['heavy','Heavy']])+
    control('movement','Hit assumption',[['ideal','Every shot lands'],['moving','Moving target: not calculated']])+
    numeric('reload','Reload stat (final RLD)',0,2000)+numeric('stat','Firepower before this gun',0,3000)+numeric('duration','Duration (seconds)',0,600)+
    (slot.categories?.some(x=>['Fighter','Dive Bomber','Torpedo Bomber'].includes(x))?control('wing','Other aircraft slots',[['current','Current choices'],['reference','Reference: Hellcat / Hellcat / Barracuda']]):'')+'</div>';
  let body='<p>'+E(result.reason)+'</p>'+((result.excluded?.length)?'<details class="combat-exclusions"><summary>Why we cannot compare this gear</summary>'+result.excluded.map(x=>'<p>'+E(x.name)+': '+E(x.reason)+'</p>').join('')+'</details>':'');
  if(result.status==='partial'){
    const leader=result.damageLeader,fast=result.timingLeader;
    body=(leader?'<p><strong>Highest direct damage:</strong> '+E(leader.name)+' — '+n(leader.dps)+' damage/s if every shot lands. Skills and accuracy can change the result.</p>':'<p><strong>Role first:</strong> Fighter keeps Aquila’s healing/shielding; dive bomber enables preload and shorter loading. Neither is universally better.</p>')+
      '<p><strong>Shortest cycle:</strong> '+E(fast.name)+' — '+n(fast.cycle)+'s '+(fast.kind==='aircraft'?'to reload the full air wing':'estimated cycle')+'. '+
      (fast.kind==='aircraft'?'Choose the role your fleet needs.':'Useful when you need an earlier shot or more chances to trigger a barrage.')+'</p>'+
      (result.alternative?'<p><strong>Alternative:</strong> '+E(result.alternative.name)+' — '+E(result.alternativeReason)+'</p>':'')+
      '<details class="combat-evidence"><summary>Calculations, conditions & sources</summary><p>'+E(result.modeNote)+'</p>'+
      (c.wing==='reference'?'<p>Reference comparison: the tested option replaces its slot in Hellcat / Hellcat / Barracuda. The evaluated wing is listed below. Saved choices stay unchanged.</p>':'')+
      '<p>Snapshot: '+E(result.source.snapshotDate)+'; +10 equipment, fully limit-broken base ships and level-10 skill conditions; augment and retrofit effects are not included. These stats are your test settings, not imported ship stats. Aircraft timing uses all three slots of the evaluated wing and your final Reload stat.</p>'+
      '<p>'+result.coverage.compared+' of '+result.coverage.compatible+' compatible options compared. This is not a best-in-slot ranking.</p>'+
      result.excluded.map(x=>'<p>'+E(x.name)+': '+E(x.reason)+'</p>').join('')+
      '<ul>'+result.rows.map(r=>'<li data-combat-equipment="'+E(r.sourceId)+'" data-combat-cycle="'+E(r.cycle)+'"><strong>'+E(r.name)+'</strong> (#'+r.sourceId+') — '+n(r.cycle)+'s'+
        (r.kind==='gun'?'; '+n(r.volley)+' direct damage per volley; '+r.activations+' shots in '+c.duration+'s; '+n(r.directTotal)+' direct damage'+(r.barrageTriggers!==null?'; '+r.barrageTriggers+' barrage triggers (damage excluded)':''):
          '; '+E(r.skill.role)+'; '+r.skill.preload+' preload; '+(r.intercepts?'interception-capable':'no passive interception')+'; payload: '+E(r.payload.map(p=>p.name).join(', ')))+
        '<p>'+E(r.kind==='gun'?'Parallel: '+r.parallel+'; capacity: '+(r.capacity??'not supplied / not required for this gun family')+'; absolute cooldown: '+r.absoluteCooldown+'s.':'Evaluated wing: '+r.wing.map(x=>x.name+' x '+x.mounts).join(' / '))+'</p>'+'<p>'+E(r.skill.note||r.skill.reason||'Skill damage and effective healing not included.')+'</p><small>'+E(r.limitations.join(' '))+'</small></li>').join('')+'</ul>'+
      '<a href="https://github.com/Linuxxy0/AzurLaneData-2026-5-2-16-08-11/blob/'+E(result.source.commit)+'/docs/equips/fomulas.md" target="_blank" rel="noopener noreferrer">Formulas and data for this snapshot</a></details>';
  }
  return '<section class="combat-comparison" aria-label="Combat mechanics comparison"><h3>Combat comparison (WIP)</h3><p>Compare damage and timing under your chosen conditions. Your saved gear stays unchanged. Settings reset when you compare another ship, slot or mode, and are not saved between visits.</p>'+controls+body+'</section>';
}
