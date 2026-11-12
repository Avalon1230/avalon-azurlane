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
    control('movement','Hit assumption',[['ideal','Ideal: all projectiles hit'],['moving','Moving: accuracy unknown']])+
    numeric('reload','Final RLD (scenario)',0,2000)+numeric('stat','FP/TRP before this gun',0,3000)+numeric('duration','Duration (seconds)',0,600)+
    (slot.categories?.some(x=>['Fighter','Dive Bomber','Torpedo Bomber'].includes(x))?control('wing','Other aircraft slots',[['current','Current choices'],['reference','Reference: Hellcat / Hellcat / Barracuda']]):'')+'</div>';
  let body='<p>'+E(result.reason)+'</p>';
  if(result.status==='partial'){
    const leader=result.damageLeader,fast=result.timingLeader;
    body=(leader?'<p><strong>Direct-hit leader:</strong> '+E(leader.name)+' — '+n(leader.dps)+' ideal damage/s. Skills and accuracy can change the result.</p>':'<p><strong>Role first:</strong> Fighter keeps Aquila’s healing/shielding; dive bomber enables preload and shorter loading. Neither is universally better.</p>')+
      '<p><strong>Fastest compared:</strong> '+E(fast.name)+' — '+n(fast.cycle)+'s '+(fast.kind==='aircraft'?'whole-wing loading cycle':'estimated cycle')+'. '+
      (fast.kind==='aircraft'?'Choose the role your fleet needs.':'Useful when an earlier shot or more main-gun triggers matters.')+'</p>'+
      (result.alternative?'<p><strong>Alternative:</strong> '+E(result.alternative.name)+' — '+E(result.alternativeReason)+'</p>':'')+
      '<details class="combat-evidence"><summary>Calculations, conditions & sources</summary><p>'+E(result.modeNote)+'</p>'+
      (c.wing==='reference'?'<p>Reference air wing comparison only: Hellcat in slot 1, tested option in this slot, Barracuda in slot 3. This does not describe or change your saved wing.</p>':'')+
      '<p>Snapshot: '+E(result.source.snapshotDate)+'; +10 equipment, base-form MLB slots, level-10 reviewed skill conditions, no augment/retrofit effects. Scenario stats are editable assumptions, not your ship’s stats. Aircraft use the current three aircraft choices and supplied final RLD.</p>'+
      '<p>'+result.coverage.compared+' of '+result.coverage.compatible+' compatible options compared. This is not a best-in-slot ranking.</p>'+
      result.excluded.map(x=>'<p>'+E(x.name)+': '+E(x.reason)+'</p>').join('')+
      '<ul>'+result.rows.map(r=>'<li><strong>'+E(r.name)+'</strong> (#'+r.sourceId+') — '+n(r.cycle)+'s'+
        (r.kind==='gun'?'; '+n(r.volley)+' direct damage/volley; '+r.activations+' ideal activations in '+c.duration+'s; '+n(r.directTotal)+' direct damage'+(r.barrageTriggers!==null?'; '+r.barrageTriggers+' barrage triggers (damage excluded)':''):
          '; '+E(r.skill.role)+'; '+r.skill.preload+' preload; '+(r.intercepts?'interception-capable':'no passive interception')+'; payload: '+E(r.payload.map(p=>p.name).join(', ')))+
        '<p>'+E(r.skill.note||r.skill.reason||'Skill damage and effective healing not included.')+'</p><small>'+E(r.limitations.join(' '))+'</small></li>').join('')+'</ul>'+
      '<a href="https://github.com/Linuxxy0/AzurLaneData-2026-5-2-16-08-11/blob/'+E(result.source.commit)+'/docs/equips/fomulas.md" target="_blank" rel="noopener noreferrer">Versioned formulas and data</a></details>';
  }
  return '<section class="combat-comparison" aria-label="Combat mechanics comparison"><h3>Combat comparison (WIP)</h3><p>Calculated components only. Your saved gear stays unchanged.</p>'+controls+body+'</section>';
}
