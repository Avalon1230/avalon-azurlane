/**
 * Low-volume, on-demand Koumakan artwork metadata lookup.
 * Uses MediaWiki API with CORS origin=*. Never scrapes HTML, guesses hash
 * paths or mirrors artwork in this repository.
 */
export const WIKI_API = 'https://azurlane.koumakan.jp/w/api.php';
const approvedImageHosts=new Set(['azurlane.netojuu.com','azurlane.koumakan.jp']);
const cache=new Map();
export function wikiPageTitle(url) {
  try {
    const u=new URL(url);
    if(u.protocol!=='https:' || u.hostname!=='azurlane.koumakan.jp' || !u.pathname.startsWith('/wiki/'))return null;
    const title=decodeURIComponent(u.pathname.slice(6)).replaceAll('_',' ').trim();
    if(!title || title.length>120 || title.includes('/') || title.includes('#'))return null;
    return title;
  }catch{return null;}
}
export function trustedWikiImage(url) {
  try {
    const u=new URL(url);
    if(u.protocol!=='https:' || !approvedImageHosts.has(u.hostname))return null;
    if(!/^\/(?:w\/)?images\/[0-9a-f]\/[0-9a-f]{2}\/[\w%().,-]+\.(?:png|webp|jpg|jpeg)$/i.test(u.pathname))return null;
    if(u.search || u.hash)return null;
    return u.href;
  }catch{return null;}
}
async function requestWiki(params,fetcher) {
  const u=new URL(WIKI_API);
  for(const [key,value] of Object.entries({
    action:'query',format:'json',formatversion:'2',origin:'*',...params
  }))u.searchParams.set(key,String(value));
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),6000);
  try{
    const response=await fetcher(u.href,{signal:controller.signal,cache:'force-cache'});
    if(!response.ok)throw new Error('Wiki metadata HTTP '+response.status);
    return await response.json();
  }finally{clearTimeout(timer);}
}
export async function loadWikiDefaultArtwork(wikiUrl,fetcher=fetch) {
  const title=wikiPageTitle(wikiUrl);
  if(!title)return null;
  if(fetcher===fetch && cache.has(title))return cache.get(title);
  const wanted='File:'+title+'.png';
  const request=(async()=>{
    const first=await requestWiki({prop:'images',titles:title,imlimit:'50'},fetcher);
    const page=first.query?.pages?.find(p=>!p.missing && p.title===title);
    const filenames=page?.images?.map(x=>x.title)||[];
    if(!filenames.some(x=>x.toLocaleLowerCase()===wanted.toLocaleLowerCase()))return null;
    const second=await requestWiki({prop:'imageinfo',titles:wanted,iiprop:'url|mime|size'},fetcher);
    const info=second.query?.pages?.find(x=>!x.missing)?.imageinfo?.[0];
    if(!info || info.mime!=='image/png' || !Number.isFinite(info.size) || info.size<=0)return null;
    return trustedWikiImage(info.url);
  })();
  if(fetcher===fetch)cache.set(title,request);
  try{return await request;}catch(e){if(fetcher===fetch)cache.delete(title);throw e;}
}
