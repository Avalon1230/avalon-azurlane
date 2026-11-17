import {validateEventCatalog,normalizeEventFilters} from './events.js';
const KEY='avalon.chronicle.filters.v1';
export function readEventFilters(storage){try{return normalizeEventFilters(JSON.parse(storage.getItem(KEY)||'{}'));}catch{return normalizeEventFilters();}}
export function saveEventFilters(storage,filters){try{storage.setItem(KEY,JSON.stringify(normalizeEventFilters(filters)));return true;}catch{return false;}}
/** Only the reviewed local snapshot is read at runtime; no wiki scraping. */
export async function loadEventCatalog(fetcher=fetch){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);
  try{
    const response=await fetcher(new URL('../data/events/catalog.json',import.meta.url),{signal:controller.signal});
    if(!response.ok)throw new Error('Event catalog HTTP '+response.status);
    const text=await response.text();if(text.length>2000000)throw new Error('Event catalog exceeds size limit');
    const data=JSON.parse(text),errors=validateEventCatalog(data);
    if(errors.length)throw new Error('Event catalog validation failed: '+errors[0]);
    return data;
  }finally{clearTimeout(timer);}
}
