/**
 * Combine reviewed collections by (ship GroupID, skin ID), never by display name.
 * Later sources enrich earlier records; absent fields cannot erase known variants.
 */
export function mergeArtworkSkins(sourceId,...collections) {
  const shipId=String(sourceId||'');
  if(!/^\d{2,8}$/.test(shipId))return [];
  const byId=new Map();
  for(const collection of collections)for(const skin of Array.isArray(collection)?collection:[]){
    const id=String(skin?.id||'');
    if(!/^\d{5,10}$/.test(id)||skin.shipId!=null&&String(skin.shipId)!==shipId)continue;
    const previous=byId.get(id)||{id,shipId,images:{}};
    const fields=Object.fromEntries(Object.entries(skin).filter(([,v])=>v!=null&&v!==''));
    const images=Object.fromEntries(Object.entries(skin.images||{}).filter(([,v])=>typeof v==='string'&&v));
    byId.set(id,{...previous,...fields,id,shipId,images:{...previous.images,...images}});
  }
  return [...byId.values()].sort((a,b)=>{
    const base=shipId+'0';
    return a.id===base?-1:b.id===base?1:Number(a.id)-Number(b.id);
  });
}
