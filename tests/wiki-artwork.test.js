import test from 'node:test';
import assert from 'node:assert/strict';
import { WIKI_API, wikiPageTitle, trustedWikiImage, loadWikiDefaultArtwork } from '../src/wiki-artwork.js';

const verified='https://azurlane.netojuu.com/images/9/9e/New_Jersey.png';
test('accept only Koumakan page URLs and verified wiki CDN image paths',()=>{
  assert.equal(wikiPageTitle('https://azurlane.koumakan.jp/wiki/New_Jersey'),'New Jersey');
  assert.equal(wikiPageTitle('https://azurlane.koumakan.jp/wiki/Amagi(CV)'),'Amagi(CV)');
  assert.equal(wikiPageTitle('https://evil.example/wiki/New_Jersey'),null);
  assert.equal(wikiPageTitle('javascript:alert(1)'),null);
  assert.equal(trustedWikiImage(verified),verified);
  assert.equal(trustedWikiImage('https://azurlane.netojuu.com/images/1/1b/Ldp_1.png'),
    'https://azurlane.netojuu.com/images/1/1b/Ldp_1.png');
  assert.equal(trustedWikiImage('https://evil.example/images/9/9e/New_Jersey.png'),null);
  assert.equal(trustedWikiImage('https://azurlane.netojuu.com/other/logo.png'),null);
});
test('fetch wiki file metadata only if the referenced ship page contains that image',async()=>{
  const calls=[];
  const fetcher=async url=>{
    const u=new URL(url);
    assert.equal(u.origin,new URL(WIKI_API).origin);
    assert.equal(u.searchParams.get('origin'),'*');
    calls.push(u);
    const info=u.searchParams.get('prop')==='images'
      ? {query:{pages:[{title:'New Jersey',images:[{title:'File:New Jersey.png'}]}]}}
      : {query:{pages:[{title:'File:New Jersey.png',imageinfo:[{url:verified,mime:'image/png',size:3932475}]}]}};
    return {ok:true,json:async()=>info};
  };
  const result=await loadWikiDefaultArtwork('https://azurlane.koumakan.jp/wiki/New_Jersey',fetcher);
  assert.equal(result,verified);
  assert.equal(calls.length,2);
  assert.equal(calls[1].searchParams.get('titles'),'File:New Jersey.png');
});
test('do not guess or embed unverified wiki files',async()=>{
  const mock=async()=>({ok:true,json:async()=>({query:{pages:[{title:'New Jersey',images:[]}]}})});
  assert.equal(await loadWikiDefaultArtwork('https://azurlane.koumakan.jp/wiki/New_Jersey',mock),null);
  assert.equal(await loadWikiDefaultArtwork('https://other.site/wiki/New_Jersey',mock),null);
});
