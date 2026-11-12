/**
 * Evidence-led loadout explanations. This module deliberately does NOT turn
 * source-compatible, rarity/HIT/RLD-sorted gear into a reviewed BIS pick.
 * Independent expert advice is attributed, conditional and never treated
 * as AVALON-calculated damage or ship-specific simulation.
 */
export const LOADOUT_EVIDENCE_SOURCES=Object.freeze({
  research:{name:'Suchiguma · Research Focus (2026)',url:'https://suchiguma.github.io/miniguides/research-focus/'},
  quick:{name:'Suchiguma · Quick Gear Guide (July 2026)',url:'https://suchiguma.github.io/miniguides/quick-gear-guide/'},
  skill:{name:'Lycoris-AzurAPI · game-client ship skills',url:'https://github.com/iujab/Lycoris-AzurAPI'}
});
const E=v=>String(v??'').replace(/[&<>"']/g,c=>({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[c]));
const RESEARCHED=Object.freeze({
  '85600':{
    modes:['boss','opsi'],category:'Fighter',title:'Medium/heavy single-target damage',
    evidence:'Research Focus reports La-9 dealing approximately 43% more damage than BF-109G against medium armor, and approximately 52% more than FW-190 A-6 against heavy armor, in its tested comparisons.',
    conditions:'Relevant to boss targets with medium/heavy armor. Interception requirements, aircraft slot conditions, launch timing and the ship’s skills can change the correct fighter.',
    alternative:'BF-109G remains a lower-cost alternative; for light-armor targets, this comparison alone gives no ranking.',
    source:'research'
  },
  '44320':{
    modes:['boss','opsi'],category:'Battleship Gun',title:'Medium/heavy boss gun · firing cycle',
    evidence:'Research Focus compares the PR8 Mecklenburg quadruple 305mm gun with the Champagne gun: approximately 7% higher damage per salvo against medium armor and 15% higher against heavy, with a faster reload.',
    conditions:'This is a gear-level guide comparison, not a simulated damage advantage for this particular ship. Target armor, barrage timing, weapon efficiency and fleet synchronization still matter.',
    alternative:'Champagne gun remains a viable alternative; a light-armor or coordinated launch scenario may favor a different weapon.',
    source:'research'
  },
  '39340':{
    modes:['general','mobbing','boss'],category:'Dive Bomber',title:'Campaign and heavy-armor dive bombing',
    evidence:'Research Focus retains Tenrai as a strong campaign and heavy-boss dive bomber, but identifies the newer Ta 152 as the preferred single-target option against medium/heavy boss armor.',
    conditions:'Choose based on target count, movement, armor and the carrier’s aircraft skill/slot. This is not a universal Tenrai best-in-slot claim.',
    alternative:'Ta 152 may overtake Tenrai in a specialized medium/heavy single-target boss fight.',
    source:'research'
  },
  '38300':{
    modes:['boss','opsi'],category:'Torpedo Bomber',title:'Converging torpedo boss option',
    evidence:'Research Focus identifies Saiun as a relevant converging torpedo bomber for boss encounters.',
    conditions:'Converging ordnance benefits from a target that remains stationary or is immobilized when the aircraft arrives. Missing a moving target can outweigh paper damage.',
    alternative:'Choose a different timing or torpedo pattern when the target cannot be held still.',
    source:'research'
  },
  '47160':{
    modes:['boss','opsi'],category:'Fighter',title:'Budget boss fighter trade-off',
    evidence:'Research Focus presents BF-109G as a useful accessible fighter, but its La-9 comparisons report materially higher medium/heavy boss damage for La-9.',
    conditions:'Useful as an availability/budget alternative; intercept capability and aircraft slot skills still require evaluation.',
    alternative:'La-9 is a research-backed higher-damage upgrade for medium/heavy single-target boss scenarios, not automatically for light armor.',
    source:'research'
  },
  '1760':{
    modes:['general','mobbing','boss','opsi'],category:'Auxiliary',title:'Survivability-oriented vanguard auxiliary',
    evidence:'Quick Gear Guide recommends prioritizing survival over damage for vanguard auxiliary slots unless the ship is reliably safe; High Performance Hydraulic Steering Gear contributes evasion.',
    conditions:'The survival benefit depends on hull, baseline HP/evasion, incoming threats and frontline position. No effective-HP comparison is calculated here.',
    alternative:'Once survivability is sufficient, offensive or specialized support auxiliaries can be preferable.',
    source:'quick'
  }
});
export const RESEARCHED_EQUIPMENT_COUNT=Object.keys(RESEARCHED).length;
const METRIC=Object.freeze({boss:['hit','HIT'],mobbing:['reload','RLD stat'],opsi:['anti_siren','Anti-Siren']});
const RARITY=Object.freeze({'Ultra Rare':5,'Super Rare':4,'Elite':3,'Rare':2,'Normal':1});
function numeric(item,key){
  const n=item?.stats?.[key];
  return typeof n==='number'&&Number.isFinite(n)?n:null;
}
function metricLabel(item,key,label){
  const n=numeric(item,key);
  return n===null?'not recorded':label+' '+(n>=0?'+':'')+n;
}
function sourceLink(key){
  const source=LOADOUT_EVIDENCE_SOURCES[key];
  return '<a href="'+E(source.url)+'" target="_blank" rel="noopener noreferrer">'+E(source.name)+'</a>';
}
function researchFor(item,mode){
  if(item?.source!=='fernando')return null;
  const note=RESEARCHED[String(item?.sourceId||'')];
  return note&&note.category===item.category&&note.modes.includes(mode)?note:null;
}
function candidateExplanation(slot,mode){
  const picked=slot.selected;
  if(!picked)return 'No item selected. No performance comparison can be made.';
  if(slot.manual)return 'This is your saved selection. AVALON has not validated it as optimal. Source legality is the only automatic check.';
  if(slot.kind==='augment')return 'The automatic augment choice prioritizes source ship exclusivity or published class eligibility; its skill effects have not been compared.';
  const alternatives=(slot.candidates||[]).filter(x=>x.id!==picked.id&&x.category===picked.category);
  const [key,label]=METRIC[mode]||[];
  const base='This gear was auto-filled because it fits. ';
  if(key){
    const chosen=numeric(picked,key);
    const alt=alternatives.find(x=>numeric(x,key)!==null);
    if(chosen!==null&&alt){
      const other=numeric(alt,key);
      const diff=chosen-other;
      return base+'At the source enhancement, it has '+metricLabel(picked,key,label)+
        ' versus '+metricLabel(alt,key,label)+' on '+alt.name+' ('+
        (diff>0?'+':'')+diff+' difference). That explains the sorting order, not which gear does more damage. Reload cycles, armor and skill synergy still matter.';
    }
    if(chosen!==null)return base+'This mode sorts by '+metricLabel(picked,key,label)+
      ', but another item has no matching reported value to compare. That alone does not prove a combat advantage.';
  }
  const alt=alternatives[0];
  const rarity='Its recorded rarity is '+String(picked.rarity||'unknown')+'. ';
  return base+rarity+(alt?'The next candidate is '+alt.name+' ('+String(alt.rarity||'unknown')+'). ':'')+
    'Rarity sets this order. It does not tell us which item deals more damage or keeps your ship alive longer.';
}
function shipMechanic(model,slot){
  if(String(model?.sourceId)==='60701'&&slot.index===1&&slot.kind==='weapon')
    return {
      title:'Aquila · aircraft slot 2 changes her skill behavior',
      rule:'A Fighter in her second aircraft slot activates healing/shielding; a Dive Bomber instead activates the offensive preload/damage configuration. Pick a Fighter when you need healing; pick a Dive Bomber when you want the offensive opening.',
      source:'skill'
    };
  return null;
}
function checksFor(item,mode){
  const c=item?.category||'';
  if(c==='Battleship Gun'||c==='Large Cruiser Gun'||c.endsWith(' Cruiser Gun')||c==='Destroyer Gun')
    return 'Compare ammo type and armor multipliers, volley pattern, base firing cycle, slot efficiency, barrage triggers and fleet synchronization.';
  if(['Fighter','Dive Bomber','Torpedo Bomber','Seaplane'].includes(c))
    return 'Compare light/medium/heavy target, enemy movement, plane weapon loadout, interception, launch timing, slot efficiency and aircraft-triggered ship skills.';
  if(['Surface Torpedo','Submarine Torpedo'].includes(c))
    return 'Compare homing/spread, target movement, reload cycle, per-launch damage and any torpedo-triggered ship skill.';
  if(c==='Anti-Air Gun'||c==='Time-Fuze AA Gun')
    return 'Compare actual AA DPS, reload and fleet-wide range plus each ship’s AA stat contribution; no anti-air performance is simulated.';
  if(c==='Auxiliary')
    return 'Compare estimated survival (HP/evasion, incoming damage, position), offensive stats and special equipment effects; eHP has not been calculated.';
  if(mode==='opsi')return 'Compare enemy modifier, armor, boss mechanics, team debuffs and synchronization; Anti-Siren stat alone is not a fleet score.';
  return 'Check source weapon mechanics, target matchup and ship skill interactions before treating this choice as a recommendation.';
}
export function researchedOptions(slot,mode){
  if(!Array.isArray(slot?.candidates)||slot.kind==='augment')return [];
  return slot.candidates.filter(item=>researchFor(item,mode))
    .map(item=>({item,note:researchFor(item,mode)})).slice(0,6);
}
export function renderLoadoutDecisionEvidence(model,slot){
  if(!slot||slot.kind==='augment')return '';
  const selected=slot.selected;
  const method=candidateExplanation(slot,model?.mode||'general');
  const mechanic=shipMechanic(model,slot);
  const insights=researchedOptions(slot,model?.mode||'general');
  const currentNote=selected?researchFor(selected,model?.mode||'general'):null;
  return '<section class="loadout-evidence">'+
    '<h3>Why this gear is shown · '+(slot.manual?'your choice':'auto-filled choice')+'</h3>'+
    '<p>'+E(method)+'</p>'+
    (selected?'<p><strong>Equipment record:</strong> '+E(selected.name)+' · source ID '+E(selected.sourceId)+' · '+
      E(selected.category)+' · enhancement '+E(selected.enhancement||'not stated')+'</p>':'')+
    (mechanic?'<section class="loadout-evidence-mechanic"><h4>'+E(mechanic.title)+'</h4><p>'+E(mechanic.rule)+'</p>'+
      '<small>Ship skill: '+sourceLink(mechanic.source)+'</small></section>':'')+
    '<section class="loadout-evidence-checks"><h4>What else matters for this choice?</h4><p>'+
      E(checksFor(selected||slot.candidates?.[0],model?.mode||'general'))+
      '</p></section>'+
    (currentNote?'<section class="loadout-evidence-reviewed"><h4>What the guide says · '+E(currentNote.title)+'</h4>'+
      '<p>'+E(currentNote.evidence)+'</p><p><strong>When it applies:</strong> '+E(currentNote.conditions)+'</p>'+
      '<p><strong>Trade-off:</strong> '+E(currentNote.alternative)+'</p><small>Evidence: '+sourceLink(currentNote.source)+
      ' · comparison by the linked author; not an AVALON simulation</small></section>':'')+
    (insights.length?'<section class="loadout-evidence-options"><h4>Other options discussed in guides</h4>'+
      '<p class="loadout-evidence-caveat">These are guide authors’ observations, not automatic best-in-slot picks. Check whether the ship and matchup fit their advice.</p>'+
      '<ul>'+insights.map(({item,note})=>'<li><strong>'+E(item.name)+'</strong>'+
        (item.id===selected?.id?' · selected':' · alternative')+
        '<p>'+E(note.evidence)+'</p><p><strong>Trade-off / alternative:</strong> '+E(note.alternative)+'</p>'+'<small>'+E(note.conditions)+' · '+sourceLink(note.source)+'</small></li>').join('')+
      '</ul></section>':
      '<p class="loadout-evidence-caveat">We haven’t confirmed the best gear for this slot and mission yet. Fitting the slot is only the first check.</p>')+
    '</section>';
}

