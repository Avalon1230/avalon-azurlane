/**
 * Generic, craftable augments from the dated May 2 2026 AzurLaneData snapshot.
 * Source: https://github.com/Linuxxy0/AzurLaneData-2026-5-2-16-08-11/blob/main/data/augments.json
 * Only source limit_group === 0 records; no ship-exclusive modules are guessed.
 * Class group mapping comes from types/augments.d.ts in that same project.
 * Gear art is NOT synthesized or borrowed from an unrelated equipment icon.
 */
export const GENERIC_AUGMENT_SOURCE = 'https://github.com/Linuxxy0/AzurLaneData-2026-5-2-16-08-11/blob/main/data/augments.json';
export const GENERIC_AUGMENT_DATE = 'May 2, 2026';
const HULLS_BY_TYPE=Object.freeze({
  1:['DD'],2:['CL'],3:['CL','AR'],4:['CA','CB','AE'],
  5:['CA','CB','BM','AE'],6:['BB','BC','BBV'],
  7:['CV','CVL'],8:['SS','SSV'],9:['CA','CL'],
  10:['IX','IXM','IXV']
});
const ITEMS=Object.freeze([
  {
    "id": 1010100,
    "name": "Dual Swords",
    "type": 1,
    "rarity": 3,
    "craftable": true,
    "stats": [
      {
        "stat": "fp",
        "max": 12
      },
      {
        "stat": "eva",
        "max": 7
      }
    ]
  },
  {
    "id": 1010120,
    "name": "Dual Swords",
    "type": 1,
    "rarity": 4,
    "craftable": true,
    "stats": [
      {
        "stat": "fp",
        "max": 20
      },
      {
        "stat": "eva",
        "max": 12
      }
    ]
  },
  {
    "id": 1010200,
    "name": "Hammer",
    "type": 1,
    "rarity": 3,
    "craftable": true,
    "stats": [
      {
        "stat": "trp",
        "max": 18
      },
      {
        "stat": "hit",
        "max": 4
      }
    ]
  },
  {
    "id": 1010220,
    "name": "Hammer",
    "type": 1,
    "rarity": 4,
    "craftable": true,
    "stats": [
      {
        "stat": "trp",
        "max": 30
      },
      {
        "stat": "hit",
        "max": 7
      }
    ]
  },
  {
    "id": 1020100,
    "name": "Sword",
    "type": 2,
    "rarity": 3,
    "craftable": true,
    "stats": [
      {
        "stat": "hit",
        "max": 12
      },
      {
        "stat": "rld",
        "max": 5
      }
    ]
  },
  {
    "id": 1020120,
    "name": "Sword",
    "type": 2,
    "rarity": 4,
    "craftable": true,
    "stats": [
      {
        "stat": "hit",
        "max": 20
      },
      {
        "stat": "rld",
        "max": 9
      }
    ]
  },
  {
    "id": 1030100,
    "name": "Crossbow",
    "type": 3,
    "rarity": 3,
    "craftable": true,
    "stats": [
      {
        "stat": "fp",
        "max": 9
      },
      {
        "stat": "aa",
        "max": 12
      }
    ]
  },
  {
    "id": 1030120,
    "name": "Crossbow",
    "type": 3,
    "rarity": 4,
    "craftable": true,
    "stats": [
      {
        "stat": "fp",
        "max": 15
      },
      {
        "stat": "aa",
        "max": 21
      }
    ]
  },
  {
    "id": 1040100,
    "name": "Greatsword",
    "type": 4,
    "rarity": 3,
    "craftable": true,
    "stats": [
      {
        "stat": "fp",
        "max": 12
      },
      {
        "stat": "trp",
        "max": 9
      }
    ]
  },
  {
    "id": 1040120,
    "name": "Greatsword",
    "type": 4,
    "rarity": 4,
    "craftable": true,
    "stats": [
      {
        "stat": "fp",
        "max": 20
      },
      {
        "stat": "trp",
        "max": 15
      }
    ]
  },
  {
    "id": 1050100,
    "name": "Lance",
    "type": 5,
    "rarity": 3,
    "craftable": true,
    "stats": [
      {
        "stat": "hit",
        "max": 11
      },
      {
        "stat": "aa",
        "max": 10
      }
    ]
  },
  {
    "id": 1050120,
    "name": "Lance",
    "type": 5,
    "rarity": 4,
    "craftable": true,
    "stats": [
      {
        "stat": "hit",
        "max": 19
      },
      {
        "stat": "aa",
        "max": 18
      }
    ]
  },
  {
    "id": 1060100,
    "name": "Officer's Sword",
    "type": 6,
    "rarity": 3,
    "craftable": true,
    "stats": [
      {
        "stat": "hit",
        "max": 9
      },
      {
        "stat": "eva",
        "max": 10
      }
    ]
  },
  {
    "id": 1060120,
    "name": "Officer's Sword",
    "type": 6,
    "rarity": 4,
    "craftable": true,
    "stats": [
      {
        "stat": "hit",
        "max": 15
      },
      {
        "stat": "eva",
        "max": 17
      }
    ]
  },
  {
    "id": 1060200,
    "name": "Bowgun",
    "type": 6,
    "rarity": 3,
    "craftable": true,
    "stats": [
      {
        "stat": "fp",
        "max": 12
      },
      {
        "stat": "aa",
        "max": 10
      }
    ]
  },
  {
    "id": 1060220,
    "name": "Bowgun",
    "type": 6,
    "rarity": 4,
    "craftable": true,
    "stats": [
      {
        "stat": "fp",
        "max": 20
      },
      {
        "stat": "aa",
        "max": 17
      }
    ]
  },
  {
    "id": 1070100,
    "name": "Hunting Bow",
    "type": 7,
    "rarity": 3,
    "craftable": true,
    "stats": [
      {
        "stat": "avi",
        "max": 15
      },
      {
        "stat": "aa",
        "max": 10
      }
    ]
  },
  {
    "id": 1070120,
    "name": "Hunting Bow",
    "type": 7,
    "rarity": 4,
    "craftable": true,
    "stats": [
      {
        "stat": "avi",
        "max": 25
      },
      {
        "stat": "aa",
        "max": 17
      }
    ]
  },
  {
    "id": 1070200,
    "name": "Scepter",
    "type": 7,
    "rarity": 3,
    "craftable": true,
    "stats": [
      {
        "stat": "avi",
        "max": 15
      },
      {
        "stat": "eva",
        "max": 10
      }
    ]
  },
  {
    "id": 1070220,
    "name": "Scepter",
    "type": 7,
    "rarity": 4,
    "craftable": true,
    "stats": [
      {
        "stat": "avi",
        "max": 25
      },
      {
        "stat": "eva",
        "max": 17
      }
    ]
  },
  {
    "id": 1080100,
    "name": "Dagger",
    "type": 8,
    "rarity": 3,
    "craftable": true,
    "stats": [
      {
        "stat": "hit",
        "max": 4
      },
      {
        "stat": "eva",
        "max": 9
      }
    ]
  },
  {
    "id": 1080120,
    "name": "Dagger",
    "type": 8,
    "rarity": 4,
    "craftable": true,
    "stats": [
      {
        "stat": "hit",
        "max": 10
      },
      {
        "stat": "eva",
        "max": 15
      }
    ]
  },
  {
    "id": 1080200,
    "name": "Kunai",
    "type": 8,
    "rarity": 3,
    "craftable": true,
    "stats": [
      {
        "stat": "trp",
        "max": 21
      },
      {
        "stat": "hit",
        "max": 3
      }
    ]
  },
  {
    "id": 1080220,
    "name": "Kunai",
    "type": 8,
    "rarity": 4,
    "craftable": true,
    "stats": [
      {
        "stat": "trp",
        "max": 35
      },
      {
        "stat": "hit",
        "max": 5
      }
    ]
  }
]);
const RARITY=Object.freeze({3:'Rare',4:'Elite',5:'Super Rare',6:'Ultra Rare'});
export function genericAugmentCandidates(hull) {
  const cls=String(hull||'').toUpperCase();
  if(!cls||!Object.values(HULLS_BY_TYPE).some(list=>list.includes(cls)))return [];
  return ITEMS.filter(item=>(HULLS_BY_TYPE[item.type]||[]).includes(cls))
    .map(item=>({
      id:'aug-'+item.id,sourceId:String(item.id),name:item.name,
      rarity:RARITY[item.rarity]||'Unverified',rarityCode:item.rarity,
      category:'Augment',typeCode:item.type,craftable:item.craftable,
      stats:item.stats,source:'augment-snapshot',sourceUrl:GENERIC_AUGMENT_SOURCE
    }))
    .sort((a,b)=>(b.rarityCode-a.rarityCode)||
      a.name.localeCompare(b.name)||a.sourceId.localeCompare(b.sourceId));
}
export function genericAugmentById(hull,id) {
  return genericAugmentCandidates(hull).find(item=>item.id===id)||null;
}
