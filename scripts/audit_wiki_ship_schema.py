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
        fields=re.findall(r"(?m)^\s*\|\s*([A-Za-z0-9]+)\s*=",text)
        group=re.search(r"(?m)^\s*\|\s*GroupID\s*=\s*(\d+)",text)
        print("GROUP_ID",group.group(1) if group else "missing")
        print("STRUCTURE", {"has_ship_template": "{{Ship" in text,
          "has_lvl125": "Health125" in fields,
          "has_build_time": "ConstructTime" in fields,
          "has_gear_mounts": all("Eq"+str(i)+"BaseMax" in fields for i in (1,2,3)),
          "has_skill_ids": "Skill1Icon" in fields,
          "parameter_count":len(fields)})
      else:
        print("RENDERED_STRUCTURE", {"table_count":len(re.findall("<table",text)),
          "has_barrage_table":"barrageTable" in text,
          "has_level125":"Level 125" in text})
    except Exception as e:print("ERROR",page,prop,type(e).__name__,str(e)[:250])
