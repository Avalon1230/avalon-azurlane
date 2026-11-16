import {LIVE_CONTENT} from './live-content-data.js';
export const LIVE_SHIPS=Object.values(LIVE_CONTENT.ships).map(r=>r.index);
export function liveShip(sourceId){return LIVE_CONTENT.ships[String(sourceId)]||null;}
export function liveAugment(sourceId){return LIVE_CONTENT.augments[String(sourceId).replace(/^aug-/,'')]||null;}
export function liveAugments(){return Object.values(LIVE_CONTENT.augments);}
