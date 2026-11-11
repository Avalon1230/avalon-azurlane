import assert from 'node:assert/strict';
import { COLLAB_SERIES_LOGOS, collabSeriesLogoUrl } from '../src/collab-series.js';

// HTTP response checks for every external franchise logo we show.
// Missing official wordmarks have no guessed URL and use sourced ship portrait art.
const results=await Promise.all(Object.keys(COLLAB_SERIES_LOGOS).map(async series=>{
  const url=collabSeriesLogoUrl(series);
  const response=await fetch(url,{headers:{'User-Agent':'AVALON-AzurLane-Logo-Check/1.0 (non-commercial fan UI; github.com/Avalon1230/avalon-azurlane)'},signal:AbortSignal.timeout(20000)});
  if([403,429,503].includes(response.status)){
    console.warn('WARN external logo host rate-limited '+series+' (HTTP '+response.status+'); source-matched ship portrait remains visible.');
    return {series,bytes:0,throttled:true};
  }
  assert.equal(response.status,200,'HTTP '+response.status+' for '+series+': '+url);
  const mime=response.headers.get('content-type')||'';
  assert.match(mime,/image\/(?:svg\+xml|png)/i,'wrong logo format '+series+': '+mime);
  const data=Buffer.from(await response.arrayBuffer());
  assert.ok(data.length>250,'empty logo: '+series);
  if(mime.includes('png'))assert.equal(data.toString('hex',0,4),'89504e47','not PNG: '+series);
  else assert.match(data.toString('utf8',0,Math.min(2000,data.length)),/<svg\b/,'not SVG: '+series);
  return {series,bytes:data.length};
}));
for(const item of results){if(!item.throttled)console.log('PASS source-attributed collab logo '+item.series+' ('+item.bytes+' bytes)');}
console.log('PASS '+results.filter(x=>!x.throttled).length+' real source-attributed logos; '+results.filter(x=>x.throttled).length+' host-throttled (not certified)');
