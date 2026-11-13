import { researchProgression } from './research-progression.js';

export const DEV_CHECKPOINTS = Object.freeze([0, 5, 10, 15, 20, 25, 30]);
export function developmentOptions(dev, detailed = false) {
  return detailed ? Array.from({length:31}, (_, i) => i)
    : [...new Set([...DEV_CHECKPOINTS, dev].filter(n => Number.isInteger(n) && n >= 0 && n <= 30))].sort((a,b) => a-b);
}

// Compare completed stages at the same level and affinity; never interpolate.
export function compareResearch(model, mode = 'start') {
  if (model?.status !== 'calculated') return {status:'unknown', reason:model?.reason || 'Choose a valid configuration to compare.'};
  const stage = mode === 'previous'
    ? model.fate > 0 ? {dev:30, fate:model.fate-1} : {dev:Math.max(0, model.dev-1), fate:0}
    : mode === 'checkpoint'
      ? model.fate > 0 ? {dev:30, fate:0} : {dev:DEV_CHECKPOINTS.filter(n=>n<model.dev).at(-1) ?? 0, fate:0}
      : mode === 'developed' ? {dev:30, fate:0} : {dev:0, fate:0};
  const baseline = researchProgression(model.id, {...stage, level:model.level});
  if (baseline.status !== 'calculated') return {status:'unknown', reason:baseline.reason};
  const stats = Object.fromEntries(Object.keys(model.stats).map(key => [key, model.stats[key]-baseline.stats[key]]));
  const slots = model.slots.map((slot,i) => ({index:i, mounts:slot.mounts-baseline.slots[i].mounts, preloads:slot.preloads-baseline.slots[i].preloads, efficiency:Math.round((slot.efficiency-baseline.slots[i].efficiency)*10000)/100}));
  const addedSkills = model.skills.filter(skill=>!baseline.skills.some(old=>old.id===skill.id));
  const removedSkills = baseline.skills.filter(skill=>!model.skills.some(current=>current.id===skill.id));
  return {status:'calculated', baseline, stats, slots, addedSkills, removedSkills};
}
