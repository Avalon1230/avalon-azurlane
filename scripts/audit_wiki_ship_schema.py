#!/usr/bin/env python3
"""Read-only bounded audit of two MediaWiki ship page structures.
Only print field names and short snippets. Never mirror the page.
"""
import json,urllib.parse,urllib.request,re
for page in ["Amagi(CV)","New Jersey"]:
  for prop in ["wikitext","text"]:
    url="https://azurlane.koumakan.jp/w/api.php?"+urllib.parse.urlencode({"action":"parse","page":page,"prop":prop,"format":"json","formatversion":"2","origin":"*"})
    try:
      req=urllib.request.Request(url,headers={"User-Agent":"AVALON-Wiki-Structure-Audit/0.8"})
      with urllib.request.urlopen(req,timeout=15) as resp:
        raw=resp.read(1_300_000)
        status=resp.status
      obj=json.loads(raw)
      text=obj.get("parse",{}).get(prop,"")
      if isinstance(text,dict):text=text.get("*","")
      print("PAGE",page,"PROP",prop,"STATUS",status,"CHARACTERS",len(text),"ERROR",obj.get("error",{}).get("code"))
      if prop=="wikitext":
        print("START",repr(text[:4200]))
        print("TEMPLATES",re.findall(r"\{\{([^|{}\n]{1,65})",text)[:40])
        for word in ["Level 125","Level125","Armor","Equipable","Construction","Barrage","Stats","ShipStats","ShipCard","Skill"]:
          i=text.lower().find(word.lower())
          if i>=0:print("TOKEN",word,repr(text[max(0,i-80):i+300]))
      else:
        print("TABLES",len(re.findall("<table",text)), "HEADERS",re.findall(r"<th[^>]*>(.*?)</th>",text,re.S)[:24])
        for token in ["Level 125","Level&nbsp;125","baseStats","stat-table","statTable","Skills","Barrages"]:
          i=text.lower().find(token.lower())
          if i>=0:print("HTMLTOKEN",token,repr(re.sub("<[^>]+>"," ",text[max(0,i-120):i+500])[:450]))
    except Exception as e:print("ERROR",page,prop,type(e).__name__,str(e)[:250])
