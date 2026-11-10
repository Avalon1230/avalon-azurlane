/**
 * AVALON's compact, source-ID keyed index of reconstructed game paintings.
 * The stored manifest only contains IDs/names and flags, never copyrighted image binaries.
 * Painting images are requested directly from the independent fan asset host.
 */
export const ARTWORK_CATALOG_URL = new URL('../data/ship-artwork.json',import.meta.url);
export const RECONSTRUCTED_ART_ROOT =
  'https://raw.githubusercontent.com/Fernando2603/AzurLane/main/images/skin/';
let cached=null;
let pending=null;
export function validArtworkCatalog(catalog) {
  return catalog && !Array.isArray(catalog) && catalog.schema===1 &&
    catalog.ships && typeof catalog.ships==='object' && !Array.isArray(catalog.ships) &&
    catalog.shipCount>=800 && catalog.shipCount<=2000 &&
    catalog.skinCount>=1000 && catalog.skinCount<=10000;
}
export function artworkSkinsForShip(catalog,sourceId) {
  const key=String(sourceId||'');
  if(!/^\d{4,8}$/.test(key))return [];
  const entries=catalog?.ships?.[key];
  if(!Array.isArray(entries))return [];
  return entries.flatMap((entry)=>{
    if(!Array.isArray(entry)||entry.length<3)return [];
    const [id,name,hasNoBackground]=entry;
    if(!Number.isSafeInteger(id)||id<10000||id>9999999999||typeof name!=='string'||!name.trim())return [];
    return [{id:String(id),name:name.trim(),source:'reconstructed',
      images:{
        painting:RECONSTRUCTED_ART_ROOT+id+'/painting.png',
        paintingNoBackground:hasNoBackground===1?RECONSTRUCTED_ART_ROOT+id+'/painting_n.png':null
      }}];
  });
}
export async function loadArtworkCatalog(fetcher=fetch) {
  if(fetcher===fetch && cached)return cached;
  if(fetcher===fetch && pending)return pending;
  const work=async()=>{
    const response=await fetcher(ARTWORK_CATALOG_URL,{cache:'force-cache'});
    if(!response.ok)throw new Error('Artwork index unavailable');
    const result=await response.json();
    if(!validArtworkCatalog(result))throw new Error('Invalid artwork index');
    return result;
  };
  if(fetcher!==fetch)return work();
  pending=work();
  try{cached=await pending;return cached;}finally{pending=null;}
}
