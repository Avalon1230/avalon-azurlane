/** Context dimensions, not ship tier scores. Adding scenario math requires
 * verified enemy stats, fit checks and reproducible combat assumptions. */
export const MODE_CRITERIA = Object.freeze({
 campaign: ['Enemy armor & level', 'Mob sustain / boss burst', 'Air control & interception', 'Anti-submarine threats', 'Oil cost & auto reliability'],
 opsi: ['Enemy armor & modifiers', 'Four-fleet coverage', 'Adaptation & hazard pressure', 'Siren boss burst', 'Multi-battle sustain'],
 meta: ['META boss mechanics', 'Damage window alignment', 'Debuff coverage', 'Survival through attack cycle', 'Manual vs auto consistency'],
 exercises: ['Opening damage / preload', 'Survivability & protection', 'Anti-air vs carrier pressure', 'Opponent counters', 'Attack vs defense'],
 events: ['Stage-specific gimmicks', 'Mob / boss composition', 'Drop farming efficiency', 'EX challenge constraints', 'Repeatable auto consistency'],
 challenge: ['Special mechanics', 'Damage and score targets', 'Timing windows', 'Survival requirement', 'Reset consistency'],
 daily: ['Raid-specific enemies', 'Damage constraints', 'Repeatability', 'Build accessibility', 'Clear speed'],
 guild: ['Guild boss armor', 'Support effects', 'Damage uptime', 'Fleet contribution', 'Survival consistency']
});
export function contextCriteria(modeId) { return MODE_CRITERIA[modeId]||[] }
export function evaluationState(entry) {
  return {
    tier: null,
    verdict: 'Not evaluated',
    quality: entry?.source === 'lycoris' || entry?.source === 'fernando'
      ? 'Source-indexed identity; combat assessment pending'
      : 'Editorial preview; source verification pending'
  };
}