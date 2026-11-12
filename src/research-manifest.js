// Exact-ID research facts. Provenance and limitations: docs/RESEARCH_SHIPS.md.
export const RESEARCH_MANIFEST = {
  "schemaVersion": 1,
  "checked": "2026-11-12",
  "sources": {
    "client": {
      "repository": "AzurLaneTools/AzurLaneLuaScripts",
      "commit": "3fb6befa2f969bd879de2341cdf41a571852a95f",
      "path": "EN/sharecfg/ship_data_blueprint.lua",
      "blob": "9e1fdddd1abbd53e48deed9b11938dc76ff4c17a",
      "sha256": "ffc8de5b173a02a3be13b4aa1f7d791e47e23597112847a71012e4f303085a2a"
    },
    "milestones": {
      "repository": "Linuxxy0/AzurLaneData-2026-5-2-16-08-11",
      "commit": "3deb898433a03ed3d7d7ff877f0d1a9b505dfd44",
      "path": "data/ships.json",
      "license": "MIT",
      "sha256": "3787c9de6976f8d32ce9e797a96ee9d90911e51c15cac4e529d5a133c0fb3380"
    },
    "tasks": {
      "repository": "AzurLaneTools/AzurLaneLuaScripts",
      "commit": "3fb6befa2f969bd879de2341cdf41a571852a95f",
      "path": "EN/sharecfgdata/task_data_template.lua",
      "blob": "f7d69a4f364508b58cefbd7fa3c657e20bf9c399",
      "sha256": "8cdde500dc8f9a519ec05f9ec33d8e62d9c5417876ed63303f26f8dce6a0e156"
    }
  },
  "records": {
    "19901": {
      "id": "19901",
      "name": "Seattle",
      "classification": "PR",
      "series": 2,
      "unlock": "Requires 760 Eagle Union Tech Points",
      "missions": [
        {
          "id": 60072,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,000,000 EXP using Eagle Union Vanguard ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60073,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 5 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60074,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 10 T2 Cruiser Retrofit Blueprints (tapping \"Submit\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60075,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,000,000 EXP using Eagle Union Vanguard ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60072
          ]
        },
        {
          "id": 60076,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60073
          ]
        },
        {
          "id": 60077,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 5 T3 Cruiser Retrofit Blueprints (tapping \"Submit\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60078,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 20,000 Coins (tapping \"Submit\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60079,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 5 Wisdom Cubes (tapping \"Submit\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [
        731,
        732,
        733,
        734,
        735
      ],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+225 base hp",
            "+17 base aa",
            "Slot 1 mounts +1"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"All Out Assault I\"",
            "Unlock Skill \"Siren Killer I\"",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+451 base hp",
            "+34 base aa",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "Upgrade ghost equipment \"DD Ghost Gun (USS CLs)\" to HE Ammo.",
            "Slot 2 types change to {CL Gun|2}, {AA Gun (Normal)|6}",
            "Slot 1 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+677 base hp",
            "+51 base aa",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"All Out Assault I\" changes to \"All Out Assault II\"",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "Slot 1 efficiency +15%"
          ]
        },
        {
          "descriptor": "Fate Sim 1",
          "value": [
            "+1 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 2",
          "value": [
            "+2 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 3",
          "value": [
            "+3 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 4",
          "value": [
            "+4 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 5",
          "value": [
            "+5 base luck",
            "Skill \"No-Fly Zone!\" changes to \"No-Fly Zone!+\""
          ]
        }
      ],
      "sourceShipId": 20007
    },
    "19902": {
      "id": "19902",
      "name": "Georgia",
      "classification": "PR",
      "series": 2,
      "unlock": "Requires 810 Eagle Union Tech Points",
      "missions": [
        {
          "id": 60082,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,000,000 EXP using Eagle Union Main Fleet ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60083,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 5 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60084,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 10 T2 Battleship Retrofit Blueprints (tapping \"Submit\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60085,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,000,000 EXP using Eagle Union Main Fleet ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60082
          ]
        },
        {
          "id": 60086,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60083
          ]
        },
        {
          "id": 60087,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 5 T3 Battleship Retrofit Blueprints (tapping \"Submit\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60088,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 30,000 Coins (tapping \"Submit\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60089,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 5 Wisdom Cubes (tapping \"Submit\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [
        831,
        832,
        833,
        834,
        835
      ],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+356 base hp",
            "+19 base aa",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"Siren Killer I\"",
            "Slot 1 mounts +1",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+711 base hp",
            "+39 base aa",
            "Slot 3 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "Slot 2 mounts +2",
            "Slot 1 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+1068 base hp",
            "+58 base aa",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "Slot 1 efficiency +15%"
          ]
        },
        {
          "descriptor": "Fate Sim 1",
          "value": [
            "+1 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 2",
          "value": [
            "+2 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 3",
          "value": [
            "+3 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 4",
          "value": [
            "+4 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 5",
          "value": [
            "+5 base luck",
            "Skill \"Iron Sight Caliber\" changes to \"Iron Sight Caliber+\""
          ]
        }
      ],
      "sourceShipId": 20008
    },
    "19903": {
      "id": "19903",
      "name": "Anchorage",
      "classification": "PR",
      "series": 4,
      "unlock": "Requires 850 Eagle Union Tech Points",
      "missions": [
        {
          "id": 60182,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,000,000 EXP using Eagle Union Vanguard ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60183,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 5 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60184,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 10 T2 Cruiser Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60185,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,000,000 EXP using Eagle Union Vanguard ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60182
          ]
        },
        {
          "id": 60186,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60183
          ]
        },
        {
          "id": 60187,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 5 T3 Cruiser Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60188,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 20,000 Coins (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60189,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 5 Wisdom Cubes (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [
        1831,
        1832,
        1833,
        1834,
        1835
      ],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+268 base hp",
            "+10 base aa",
            "+5 base eva",
            "Slot 1 mounts +1"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"All-Out Assault I\"",
            "Unlock Skill \"Siren Killer I\"",
            "Slot 1 efficiency +5%",
            "Slot 2 preload +1"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+537 base hp",
            "+21 base aa",
            "Slot 1 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "Upgrade ghost equipment \"DD Ghost Gun (USS CAs)\" to HE Ammo.",
            "Slot 2 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+805 base hp",
            "+31 base aa",
            "+10 base eva"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"All-Out Assault I\" changes to \"All-Out Assault II\"",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "All Weapon efficiencies +5%"
          ]
        },
        {
          "descriptor": "Fate Sim 1",
          "value": [
            "+1 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 2",
          "value": [
            "+2 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 3",
          "value": [
            "+3 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 4",
          "value": [
            "+4 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 5",
          "value": [
            "+5 base luck",
            "Skill \"Riddle Me This\" changes to \"Riddle Me This+\""
          ]
        }
      ],
      "sourceShipId": 20018
    },
    "19904": {
      "id": "19904",
      "name": "Kearsarge",
      "classification": "DR",
      "series": 6,
      "unlock": "Requires 1,000 Eagle Union Tech Points",
      "missions": [
        {
          "id": 60282,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,200,000 EXP using Eagle Union Main Fleet ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60283,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60284,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 3 T3 Carrier Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60285,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,400,000 EXP using Eagle Union Main Fleet ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60282
          ]
        },
        {
          "id": 60286,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 12 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60283
          ]
        },
        {
          "id": 60287,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 8 T3 Battleship Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60288,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 60,000 Coins (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60289,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 10 Wisdom Cubes (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+383 base hp",
            "+15 base aa",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"Siren Killer I\"",
            "Gains ghost equipment \"Ghost DD Gun (Kearsarge)\"",
            "Gains ghost equipment \"Ghost DD Gun (Kearsarge)\"",
            "Slot 1 mounts +1",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+766 base hp",
            "+31 base aa",
            "Slot 2 efficiency +20%"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "Slot 2 mounts +1",
            "Slot 1 & Slot 2 efficiencies +10%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+1149 base hp",
            "+47 base aa",
            "Slot 2 mounts +1",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "Slot 1 mounts +1",
            "Slot 2 efficiency +10%",
            "Slot 1 efficiency +15%"
          ]
        }
      ],
      "sourceShipId": 20028
    },
    "19905": {
      "id": "19905",
      "name": "Halford",
      "classification": "PR",
      "series": 7,
      "unlock": "Requires 950 Eagle Union Tech Points",
      "missions": [
        {
          "id": 60332,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,000,000 EXP using Eagle Union Vanguard ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60333,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 5 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60334,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 10 T2 Destroyer Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60335,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,000,000 EXP using Eagle Union Vanguard ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60332
          ]
        },
        {
          "id": 60336,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60333
          ]
        },
        {
          "id": 60337,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 5 T3 Destroyer Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60338,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 20,000 Coins (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60339,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 5 Wisdom Cubes (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [
        3331,
        3332,
        3333,
        3334,
        3335
      ],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+100 base hp",
            "+8 base aa",
            "Slot 1 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"All Out Assault I\"",
            "Unlock Skill \"Siren Killer I\"",
            "Slot 3 types change to {AA Gun (Normal)|6}, {Seaplane|12}",
            "All Weapon efficiencies +2%"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+201 base hp",
            "+16 base aa",
            "Slot 2 preload +1"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "All Weapon efficiencies +3%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+301 base hp",
            "+24 base aa"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"All Out Assault I\" changes to \"All Out Assault II\"",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "All Weapon efficiencies +5%"
          ]
        },
        {
          "descriptor": "Fate Sim 1",
          "value": [
            "+1 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 2",
          "value": [
            "+2 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 3",
          "value": [
            "+3 base luck",
            "Slot 3 mounts +1"
          ]
        },
        {
          "descriptor": "Fate Sim 4",
          "value": [
            "+4 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 5",
          "value": [
            "+5 base luck",
            "Skill \"Nocturnal Judgment\" changes to \"Nocturnal Judgment+\""
          ]
        }
      ],
      "sourceShipId": 20033
    },
    "19906": {
      "id": "19906",
      "name": "Kansas",
      "classification": "PR",
      "series": 8,
      "unlock": "Requires 950 Eagle Union Tech Points",
      "missions": [
        {
          "id": 60382,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,000,000 EXP using Eagle Union Main Fleet ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60383,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 5 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60384,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 10 T2 Battleship Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60385,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,000,000 EXP using Eagle Union Main Fleet ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60382
          ]
        },
        {
          "id": 60386,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60383
          ]
        },
        {
          "id": 60387,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 5 T3 Battleship Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60388,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 30,000 Coins (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60389,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 5 Wisdom Cubes (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [
        3831,
        3832,
        3833,
        3834,
        3835
      ],
      "milestones": [
        {
          "descriptor": "Dev 0",
          "value": [
            "Slot 1 mounts +1"
          ]
        },
        {
          "descriptor": "Dev 5",
          "value": [
            "+350 base hp",
            "+19 base aa",
            "Slot 2 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"Siren Killer I\"",
            "Slot 1 mounts +1",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+700 base hp",
            "+37 base aa",
            "Slot 3 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "Slot 2 mounts +2",
            "Slot 1 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+1049 base hp",
            "+56 base aa",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "Slot 1 mounts +1",
            "Slot 1 efficiency +15%"
          ]
        }
      ],
      "sourceShipId": 20038
    },
    "29901": {
      "id": "29901",
      "name": "Neptune",
      "classification": "PR",
      "series": 1,
      "unlock": "Register 20 or more Royal Navy Vanguard Fleet ships in your Library.",
      "missions": [
        {
          "id": 60012,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,000,000 EXP using Royal Navy Vanguard ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60013,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 5 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60014,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 10 T2 Cruiser Retrofit Blueprints (tapping \"Submit\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60015,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,000,000 EXP using Royal Navy Vanguard ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60012
          ]
        },
        {
          "id": 60016,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60013
          ]
        },
        {
          "id": 60017,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 5 T3 Cruiser Retrofit Blueprints (tapping \"Submit\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60018,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 20,000 Coins (tapping \"Submit\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60019,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 5 Wisdom Cubes (tapping \"Submit\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [
        131,
        132,
        133,
        134,
        135
      ],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+199 base hp",
            "+17 base aa",
            "Slot 2 mounts +1",
            "Slot 2 preload +1"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"All Out Assault I\"",
            "Unlock Skill \"Siren Killer I\"",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+398 base hp",
            "+34 base aa",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "Slot 2 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+596 base hp",
            "+51 base aa",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"All Out Assault I\" changes to \"All Out Assault II\"",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "Slot 1 efficiency +15%"
          ]
        },
        {
          "descriptor": "Fate Sim 1",
          "value": [
            "+1 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 2",
          "value": [
            "+2 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 3",
          "value": [
            "+3 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 4",
          "value": [
            "+4 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 5",
          "value": [
            "+5 base luck",
            "Skill \"MKV-Class AP Shells\" changes to \"MKV-Class AP Shells+\""
          ]
        }
      ],
      "sourceShipId": 20001
    },
    "29902": {
      "id": "29902",
      "name": "Monarch",
      "classification": "PR",
      "series": 1,
      "unlock": "Register 10 or more Royal Navy Main Fleet ships in your Library.",
      "missions": [
        {
          "id": 60022,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,000,000 EXP using Royal Navy Main Fleet ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60023,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 5 Research Projects in the Tech Academy.",
          "name": "Theoretical Technology Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60024,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 10 T2 Battleship Retrofit Blueprints (tapping \"Submit\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60025,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,000,000 EXP using Royal Navy Main Fleet ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60022
          ]
        },
        {
          "id": 60026,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60023
          ]
        },
        {
          "id": 60027,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 5 T3 Battleship Retrofit Blueprints (tapping \"Submit\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60028,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 30,000 Coins (tapping \"Submit\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60029,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 5 Wisdom Cubes (tapping \"Submit\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [
        231,
        232,
        233,
        234,
        235
      ],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+325 base hp",
            "+11 base aa",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"Siren Killer I\"",
            "Slot 1 mounts +1",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+651 base hp",
            "+21 base aa",
            "Slot 3 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "Slot 2 mounts +2",
            "Slot 1 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+976 base hp",
            "+31 base aa",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "Slot 1 mounts +1",
            "Slot 1 efficiency +15%"
          ]
        },
        {
          "descriptor": "Fate Sim 1",
          "value": [
            "+1 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 2",
          "value": [
            "+2 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 3",
          "value": [
            "+3 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 4",
          "value": [
            "+4 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 5",
          "value": [
            "+5 base luck",
            "Skill \"Against the Current\" changes to \"Against the Current+\""
          ]
        }
      ],
      "sourceShipId": 20002
    },
    "29903": {
      "id": "29903",
      "name": "Cheshire",
      "classification": "PR",
      "series": 3,
      "unlock": "Requires 700 Royal Navy Tech Points",
      "missions": [
        {
          "id": 60132,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,000,000 EXP using Royal Navy Vanguard ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60133,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 5 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60134,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 10 T2 Cruiser Retrofit Blueprints (tapping \"Submit\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60135,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,000,000 EXP using Royal Navy Vanguard ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60132
          ]
        },
        {
          "id": 60136,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60133
          ]
        },
        {
          "id": 60137,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 5 T3 Cruiser Retrofit Blueprints (tapping \"Submit\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60138,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 20,000 Coins (tapping \"Submit\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60139,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 5 Wisdom Cubes (tapping \"Submit\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [
        1331,
        1332,
        1333,
        1334,
        1335
      ],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+217 base hp",
            "+19 base aa",
            "+5 base eva",
            "Slot 3 mounts +1"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"All Out Assault I\"",
            "Unlock Skill \"Siren Killer I\"",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+433 base hp",
            "+39 base aa",
            "Slot 1 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "Slot 3 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+649 base hp",
            "+58 base aa",
            "+10 base eva"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"All Out Assault I\" changes to \"All Out Assault II\"",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "All Weapon efficiencies +5%"
          ]
        },
        {
          "descriptor": "Fate Sim 1",
          "value": [
            "+1 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 2",
          "value": [
            "+2 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 3",
          "value": [
            "+3 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 4",
          "value": [
            "+4 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 5",
          "value": [
            "+5 base luck",
            "Skill \"Bounce Right Back\" changes to \"Bounce Right Back+\""
          ]
        }
      ],
      "sourceShipId": 20013
    },
    "29904": {
      "id": "29904",
      "name": "Drake",
      "classification": "DR",
      "series": 3,
      "unlock": "Requires 820 Royal Navy Tech Points",
      "missions": [
        {
          "id": 60142,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,200,000 EXP using Royal Navy Vanguard ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60143,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60144,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 3 T3 Cruiser Retrofit Blueprints (tapping \"Submit\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60145,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,400,000 EXP using Royal Navy Vanguard ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60142
          ]
        },
        {
          "id": 60146,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 12 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60143
          ]
        },
        {
          "id": 60147,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 8 T3 Cruiser Retrofit Blueprints (tapping \"Submit\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60148,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 40,000 Coins (tapping \"Submit\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60149,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 10 Wisdom Cubes (tapping \"Submit\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [
        1431,
        1432,
        1433,
        1434,
        1435
      ],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+237 base hp",
            "+13 base aa",
            "+5 base eva",
            "Slot 1 mounts +1"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"All Out Assault I\"",
            "Unlock Skill \"Siren Killer I\"",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+473 base hp",
            "+27 base aa",
            "Slot 2 preload +1",
            "Slot 1 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "Slot 2 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+710 base hp",
            "+40 base aa",
            "+10 base eva"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"All Out Assault I\" changes to \"All Out Assault II\"",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "Slot 1 efficiency +15%"
          ]
        },
        {
          "descriptor": "Fate Sim 1",
          "value": [
            "+3 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 2",
          "value": [
            "+4 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 3",
          "value": [
            "+5 base luck",
            "Skill \"Flintlock Burst\" changes to \"Flintlock Burst+\""
          ]
        },
        {
          "descriptor": "Fate Sim 4",
          "value": [
            "+6 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 5",
          "value": [
            "+7 base luck",
            "Skill \"The Fearless Privateer\" changes to \"The Fearless Privateer+\""
          ]
        }
      ],
      "sourceShipId": 20014
    },
    "29905": {
      "id": "29905",
      "name": "Plymouth",
      "classification": "DR",
      "series": 5,
      "unlock": "Requires 900 Royal Navy Tech Points",
      "missions": [
        {
          "id": 60232,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,200,000 EXP using Royal Navy Vanguard ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60233,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60234,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 3 T3 Cruiser Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60235,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,400,000 EXP using Royal Navy Vanguard ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60232
          ]
        },
        {
          "id": 60236,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 12 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60233
          ]
        },
        {
          "id": 60237,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 8 T3 Cruiser Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60238,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 40,000 Coins (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60239,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 10 Wisdom Cubes (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+227 base hp",
            "+16 base aa",
            "Slot 1 mounts +1"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"All Out Assault I\"",
            "Unlock Skill \"Siren Killer I\"",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+453 base hp",
            "+31 base aa"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "Slot 1 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+681 base hp",
            "+46 base aa",
            "Slot 1 efficiency +15%"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"All Out Assault I\" changes to \"All Out Assault II\"",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "Slot 1 mounts +1"
          ]
        }
      ],
      "sourceShipId": 20023
    },
    "29906": {
      "id": "29906",
      "name": "Duncan",
      "classification": "PR",
      "series": 9,
      "unlock": "Requires 700 Royal Navy Tech Points",
      "missions": [
        {
          "id": 60432,
          "order": 1,
          "gateSeconds": 0,
          "objective": "–Sortie and accumulate 1,000,000 EXP using Royal Navy Main Fleet ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60433,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "–Complete 5 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60434,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "–Gather 10 T2 Battleship Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60435,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "–Sortie and accumulate 2,000,000 EXP using Royal Navy Main Fleet ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60432
          ]
        },
        {
          "id": 60436,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "–Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60433
          ]
        },
        {
          "id": 60437,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "–Gather 5 T3 Battleship Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60438,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "–Gather 30,000 Coins (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60439,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "–Gather 5 Wisdom Cubes (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [],
      "milestones": [],
      "sourceShipId": null
    },
    "39901": {
      "id": "39901",
      "name": "Ibuki",
      "classification": "PR",
      "series": 1,
      "unlock": "Register 20 or more Sakura Empire Vanguard Fleet ships in your Library.",
      "missions": [
        {
          "id": 60032,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,000,000 EXP using Sakura Empire Vanguard ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60033,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 5 Research Projects in the Tech Academy.",
          "name": "Theoretical Technology Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60034,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 10 T2 Cruiser Retrofit Blueprints (tapping \"Submit\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60035,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,000,000 EXP using Sakura Empire Vanguard ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60032
          ]
        },
        {
          "id": 60036,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60033
          ]
        },
        {
          "id": 60037,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 5 T3 Cruiser Retrofit Blueprints (tapping \"Submit\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60038,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 20,000 Coins (tapping \"Submit\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60039,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 5 Wisdom Cubes (tapping \"Submit\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [
        331,
        332,
        333,
        334,
        335
      ],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+201 base hp",
            "+9 base aa",
            "+5 base eva",
            "Slot 2 mounts +1",
            "Slot 2 preload +1"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"All Out Assault I\"",
            "Unlock Skill \"Siren Killer I\"",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+402 base hp",
            "+18 base aa",
            "Slot 2 preload +1",
            "Slot 1 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "Upgrade ghost equipment \"DD Ghost Gun (IJN CAs)\" to HE Ammo.",
            "Slot 2 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+603 base hp",
            "+26 base aa",
            "+10 base eva"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"All Out Assault I\" changes to \"All Out Assault II\"",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "Slot 2 efficiency +15%"
          ]
        },
        {
          "descriptor": "Fate Sim 1",
          "value": [
            "+1 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 2",
          "value": [
            "+2 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 3",
          "value": [
            "+3 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 4",
          "value": [
            "+4 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 5",
          "value": [
            "+5 base luck",
            "Skill \"Body and Soul\" changes to \"Body and Soul+\""
          ]
        }
      ],
      "sourceShipId": 20003
    },
    "39902": {
      "id": "39902",
      "name": "Izumo",
      "classification": "PR",
      "series": 1,
      "unlock": "Register 10 or more Sakura Empire Main Fleet ships in your Library.",
      "missions": [
        {
          "id": 60042,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,000,000 EXP using Sakura Empire Main Fleet ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60043,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 5 Research Projects in the Tech Academy.",
          "name": "Theoretical Technology Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60044,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 10 T2 Battleship Retrofit Blueprints (tapping \"Submit\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60045,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,000,000 EXP using Sakura Empire Main Fleet ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60042
          ]
        },
        {
          "id": 60046,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60043
          ]
        },
        {
          "id": 60047,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 5 T3 Battleship Retrofit Blueprints (tapping \"Submit\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60048,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 30,000 Coins (tapping \"Submit\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60049,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 5 Wisdom Cubes (tapping \"Submit\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [
        431,
        432,
        433,
        434,
        435
      ],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+347 base hp",
            "+11 base aa",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"Siren Killer I\"",
            "Slot 1 mounts +1",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+694 base hp",
            "+21 base aa",
            "Slot 3 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "Slot 2 mounts +2",
            "Slot 1 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+1041 base hp",
            "+33 base aa",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "Slot 1 mounts +1",
            "Slot 1 efficiency +15%"
          ]
        },
        {
          "descriptor": "Fate Sim 1",
          "value": [
            "+1 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 2",
          "value": [
            "+2 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 3",
          "value": [
            "+3 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 4",
          "value": [
            "+4 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 5",
          "value": [
            "+5 base luck",
            "Skill \"A Legend's Inheritance\" changes to \"A Legend's Inheritance+\""
          ]
        }
      ],
      "sourceShipId": 20004
    },
    "39903": {
      "id": "39903",
      "name": "Kitakaze",
      "classification": "PR",
      "series": 2,
      "unlock": "Requires 780 Sakura Empire Tech Points",
      "missions": [
        {
          "id": 60092,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,000,000 EXP using Sakura Empire Vanguard ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60093,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 5 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60094,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 10 T2 Destroyer Retrofit Blueprints (tapping \"Submit\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60095,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,000,000 EXP using Sakura Empire Vanguard ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60092
          ]
        },
        {
          "id": 60096,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60093
          ]
        },
        {
          "id": 60097,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 5 T3 Destroyer Retrofit Blueprints (tapping \"Submit\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60098,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 20,000 Coins (tapping \"Submit\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60099,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 5 Wisdom Cubes (tapping \"Submit\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [
        931,
        932,
        933,
        934,
        935
      ],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+111 base hp",
            "+9 base aa",
            "Slot 1 mounts +1"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"All Out Assault I\"",
            "Unlock Skill \"Siren Killer I\"",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+221 base hp",
            "+18 base aa",
            "Slot 2 preload +1",
            "Slot 1 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "Slot 3 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+333 base hp",
            "+27 base aa"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"All Out Assault I\" changes to \"All Out Assault II\"",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "All Weapon efficiencies +5%"
          ]
        },
        {
          "descriptor": "Fate Sim 1",
          "value": [
            "+1 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 2",
          "value": [
            "+2 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 3",
          "value": [
            "+3 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 4",
          "value": [
            "+4 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 5",
          "value": [
            "+5 base luck",
            "Skill \"Kitakaze Style - Lotus Torpedoes\" changes to \"Kitakaze Style - Lotus Torpedoes+\""
          ]
        }
      ],
      "sourceShipId": 20009
    },
    "39904": {
      "id": "39904",
      "name": "Azuma",
      "classification": "DR",
      "series": 2,
      "unlock": "Requires 900 Sakura Empire Tech Points",
      "missions": [
        {
          "id": 60102,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,200,000 EXP using Sakura Empire Main Fleet ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60103,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60104,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 3 T3 Battleship Retrofit Blueprints (tapping \"Submit\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60105,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,400,000 EXP using Sakura Empire Vanguard ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60102
          ]
        },
        {
          "id": 60106,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 12 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60103
          ]
        },
        {
          "id": 60107,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 8 T3 Cruiser Retrofit Blueprints (tapping \"Submit\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60108,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 50,000 Coins (tapping \"Submit\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60109,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 10 Wisdom Cubes (tapping \"Submit\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [
        1031,
        1032,
        1033,
        1034,
        1035
      ],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+315 base hp",
            "+10 base aa",
            "Slot 1 mounts +1",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"Siren Killer I\"",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+629 base hp",
            "+21 base aa",
            "Slot 3 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "Slot 2 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+945 base hp",
            "+31 base aa",
            "+5 base eva",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "Slot 1 efficiency +15%"
          ]
        },
        {
          "descriptor": "Fate Sim 1",
          "value": [
            "+3 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 2",
          "value": [
            "+4 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 3",
          "value": [
            "+5 base luck",
            "Skill \"Mizuho's Intuition\" changes to \"Mizuho's Intuition+\""
          ]
        },
        {
          "descriptor": "Fate Sim 4",
          "value": [
            "+6 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 5",
          "value": [
            "+7 base luck",
            "Skill \"Special Gunnery Training\" changes to \"Special Gunnery Training+\""
          ]
        }
      ],
      "sourceShipId": 20010
    },
    "39905": {
      "id": "39905",
      "name": "Hakuryuu",
      "classification": "DR",
      "series": 4,
      "unlock": "Requires 950 Sakura Empire Tech Points",
      "missions": [
        {
          "id": 60192,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,200,000 EXP using Sakura Empire Main Fleet ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60193,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60194,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 3 T3 Carrier Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60195,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,400,000 EXP using Sakura Empire Main Fleet ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60192
          ]
        },
        {
          "id": 60196,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 12 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60193
          ]
        },
        {
          "id": 60197,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 8 T3 Carrier Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60198,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 50,000 Coins (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60199,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 10 Wisdom Cubes (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [
        1931,
        1932,
        1933,
        1934,
        1935
      ],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+346 base hp",
            "+15 base aa",
            "Slot 1 mounts +1",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"Siren Killer I\"",
            "Slot 1 types change to {Fighter|7}, {Torpedo Bomber|8}",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+691 base hp",
            "+30 base aa",
            "Slot 2 mounts +2",
            "Slot 2 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "Hangar Capacity +1",
            "Slot 2 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+1037 base hp",
            "+45 base aa",
            "All Weapon mounts +1",
            "Slot 3 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "Slot 3 types change to {Torpedo Bomber|8}, {Dive Bomber|9}",
            "All Weapon efficiencies +5%"
          ]
        },
        {
          "descriptor": "Fate Sim 1",
          "value": [
            "+3 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 2",
          "value": [
            "+4 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 3",
          "value": [
            "+5 base luck",
            "Skill \"The Great One's Shadow\" changes to \"The Great One's Shadow+\""
          ]
        },
        {
          "descriptor": "Fate Sim 4",
          "value": [
            "+6 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 5",
          "value": [
            "+7 base luck",
            "Skill \"Sky-Rending Retribution\" changes to \"Sky-Rending Retribution+\""
          ]
        }
      ],
      "sourceShipId": 20019
    },
    "39906": {
      "id": "39906",
      "name": "Shimanto",
      "classification": "PR",
      "series": 6,
      "unlock": "Requires 900 Sakura Empire Tech Points",
      "missions": [
        {
          "id": 60292,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,000,000 EXP using Sakura Empire Vanguard ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60293,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 5 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60294,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 10 T2 Cruiser Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60295,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,000,000 EXP using Sakura Empire Vanguard ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60292
          ]
        },
        {
          "id": 60296,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60293
          ]
        },
        {
          "id": 60297,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 5 T3 Cruiser Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60298,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 20,000 Coins (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60299,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 5 Wisdom Cubes (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [
        2931,
        2932,
        2933,
        2934,
        2935
      ],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+223 base hp",
            "+21 base aa",
            "Slot 2 mounts +1"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"All Out Assault I\"",
            "Unlock Skill \"Siren Killer I\"",
            "Slot 2 Parallel Reloading +1",
            "Slot 2 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+447 base hp",
            "+43 base aa",
            "Slot 1 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "Upgrade ghost equipment \"DD Ghost Gun (IJN CLs)\" to HE Ammo.",
            "Slot 1 mounts +1",
            "Slot 2 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+670 base hp",
            "+63 base aa",
            "Slot 3 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"All Out Assault I\" changes to \"All Out Assault II\"",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "Slot 2 efficiency +15%"
          ]
        },
        {
          "descriptor": "Fate Sim 1",
          "value": [
            "+1 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 2",
          "value": [
            "+2 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 3",
          "value": [
            "+3 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 4",
          "value": [
            "+4 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 5",
          "value": [
            "+5 base luck",
            "Skill \"Divine Presence\" changes to \"Divine Presence+\""
          ]
        }
      ],
      "sourceShipId": 20029
    },
    "39907": {
      "id": "39907",
      "name": "Daisen",
      "classification": "PR",
      "series": 7,
      "unlock": "Requires 950 Sakura Empire Tech Points",
      "missions": [
        {
          "id": 60342,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,000,000 EXP using Sakura Empire Main Fleet ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60343,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 5 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60344,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 10 T2 Battleship Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60345,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,000,000 EXP using Sakura Empire Main Fleet ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60342
          ]
        },
        {
          "id": 60346,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60343
          ]
        },
        {
          "id": 60347,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 5 T3 Battleship Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60348,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 30,000 Coins (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60349,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 5 Wisdom Cubes (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [
        3431,
        3432,
        3433,
        3434,
        3435
      ],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+337 base hp",
            "+12 base aa",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"Siren Killer I\"",
            "Slot 1 mounts +1",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+674 base hp",
            "+24 base aa",
            "Slot 3 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "Slot 2 mounts +2",
            "Slot 1 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+1010 base hp",
            "+35 base aa",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "Slot 1 mounts +1",
            "Slot 1 efficiency +15%"
          ]
        },
        {
          "descriptor": "Fate Sim 1",
          "value": [
            "+1 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 2",
          "value": [
            "+2 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 3",
          "value": [
            "+3 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 4",
          "value": [
            "+4 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 5",
          "value": [
            "+5 base luck",
            "Skill \"Causality Anchor\" changes to \"Causality Anchor+\""
          ]
        }
      ],
      "sourceShipId": 20034
    },
    "39908": {
      "id": "39908",
      "name": "Takahashi",
      "classification": "PR",
      "series": 9,
      "unlock": "Requires 1,000 Sakura Empire Tech Points",
      "missions": [
        {
          "id": 60442,
          "order": 1,
          "gateSeconds": 0,
          "objective": "–Sortie and accumulate 1,000,000 EXP using Sakura Empire Vanguard ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60443,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "–Complete 5 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60444,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "–Gather 10 T2 Cruiser Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60445,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "–Sortie and accumulate 2,000,000 EXP using Sakura Empire Vanguard ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60442
          ]
        },
        {
          "id": 60446,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "–Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60443
          ]
        },
        {
          "id": 60447,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "–Gather 5 T3 Cruiser Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60448,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "–Gather 20,000 Coins (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60449,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "–Gather 5 Wisdom Cubes (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [],
      "milestones": [],
      "sourceShipId": null
    },
    "49901": {
      "id": "49901",
      "name": "Roon",
      "classification": "PR",
      "series": 1,
      "unlock": "Register 7 or more Iron Blood Vanguard Fleet ships in your Library.",
      "missions": [
        {
          "id": 60052,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,000,000 EXP using Iron Blood Vanguard ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60053,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 5 Research Projects in the Tech Academy.",
          "name": "Theoretical Technology Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60054,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 10 T2 Cruiser Retrofit Blueprints (tapping \"Submit\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60055,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,000,000 EXP using Iron Blood Vanguard ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60052
          ]
        },
        {
          "id": 60056,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60053
          ]
        },
        {
          "id": 60057,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 5 T3 Cruiser Retrofit Blueprints (tapping \"Submit\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60058,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 20,000 Coins (tapping \"Submit\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60059,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 5 Wisdom Cubes (tapping \"Submit\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [
        531,
        532,
        533,
        534,
        535
      ],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+254 base hp",
            "+11 base aa",
            "+5 base eva",
            "Slot 1 mounts +1"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"All Out Assault I\"",
            "Unlock Skill \"Siren Killer I\"",
            "All Weapon efficiencies +2%"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+508 base hp",
            "+21 base aa",
            "Slot 1 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "All Weapon efficiencies +3%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+761 base hp",
            "+32 base aa",
            "+10 base eva"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"All Out Assault I\" changes to \"All Out Assault II\"",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "All Weapon efficiencies +5%"
          ]
        },
        {
          "descriptor": "Fate Sim 1",
          "value": [
            "+1 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 2",
          "value": [
            "+2 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 3",
          "value": [
            "+3 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 4",
          "value": [
            "+4 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 5",
          "value": [
            "+5 base luck",
            "Skill \"Well-Rounded Armor\" changes to \"Well-Rounded Armor+\""
          ]
        }
      ],
      "sourceShipId": 20005
    },
    "49902": {
      "id": "49902",
      "name": "Friedrich der Große",
      "classification": "DR",
      "series": 2,
      "unlock": "Requires 630 Iron Blood Tech Points",
      "missions": [
        {
          "id": 60112,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,200,000 EXP using Iron Blood Main Fleet ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60113,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60114,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 3 T3 Battleship Retrofit Blueprints (tapping \"Submit\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60115,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,400,000 EXP using Iron Blood Main Fleet ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60112
          ]
        },
        {
          "id": 60116,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 12 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60113
          ]
        },
        {
          "id": 60117,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 8 T3 Battleship Retrofit Blueprints (tapping \"Submit\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60118,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 60,000 Coins (tapping \"Submit\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60119,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 10 Wisdom Cubes (tapping \"Submit\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [
        1131,
        1132,
        1133,
        1134,
        1135
      ],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+400 base hp",
            "+11 base aa",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"Siren Killer I\"",
            "Slot 1 mounts +1",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+797 base hp",
            "+22 base aa",
            "Slot 3 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "Slot 2 mounts +2",
            "Slot 1 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+1195 base hp",
            "+33 base aa",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "Slot 1 mounts +1",
            "Slot 1 efficiency +15%"
          ]
        },
        {
          "descriptor": "Fate Sim 1",
          "value": [
            "+3 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 2",
          "value": [
            "+4 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 3",
          "value": [
            "+5 base luck",
            "Skill \"Rhapsody of Darkness\" changes to \"Rhapsody of Darkness+\""
          ]
        },
        {
          "descriptor": "Fate Sim 4",
          "value": [
            "+6 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 5",
          "value": [
            "+7 base luck",
            "Skill \"Symphony of Destruction\" changes to \"Symphony of Destruction+\""
          ]
        }
      ],
      "sourceShipId": 20011
    },
    "49903": {
      "id": "49903",
      "name": "Mainz",
      "classification": "PR",
      "series": 3,
      "unlock": "Requires 550 Iron Blood Tech Points",
      "missions": [
        {
          "id": 60152,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,000,000 EXP using Iron Blood Vanguard ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60153,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 5 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60154,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 10 T2 Cruiser Retrofit Blueprints (tapping \"Submit\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60155,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,000,000 EXP using Iron Blood Vanguard ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60152
          ]
        },
        {
          "id": 60156,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60153
          ]
        },
        {
          "id": 60157,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 5 T3 Cruiser Retrofit Blueprints (tapping \"Submit\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60158,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 20,000 Coins (tapping \"Submit\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60159,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 5 Wisdom Cubes (tapping \"Submit\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [
        1531,
        1532,
        1533,
        1534,
        1535
      ],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+226 base hp",
            "+17 base aa",
            "Slot 1 mounts +1"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"All Out Assault I\"",
            "Unlock Skill \"Siren Killer I\"",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+451 base hp",
            "+33 base aa",
            "Slot 2 preload +1",
            "Slot 1 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "Slot 2 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+677 base hp",
            "+49 base aa"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"All Out Assault I\" changes to \"All Out Assault II\"",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "Slot 1 efficiency +15%"
          ]
        },
        {
          "descriptor": "Fate Sim 1",
          "value": [
            "+1 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 2",
          "value": [
            "+2 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 3",
          "value": [
            "+3 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 4",
          "value": [
            "+4 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 5",
          "value": [
            "+5 base luck",
            "Skill \"Ausgewogen\" changes to \"Ausgewogen+\""
          ]
        }
      ],
      "sourceShipId": 20015
    },
    "49904": {
      "id": "49904",
      "name": "Odin",
      "classification": "PR",
      "series": 3,
      "unlock": "Requires 600 Iron Blood Tech Points",
      "missions": [
        {
          "id": 60162,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,000,000 EXP using Iron Blood Main Fleet ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60163,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 5 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60164,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 10 T2 Battleship Retrofit Blueprints (tapping \"Submit\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60165,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,000,000 EXP using Iron Blood Main Fleet ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60162
          ]
        },
        {
          "id": 60166,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60163
          ]
        },
        {
          "id": 60167,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 5 T3 Battleship Retrofit Blueprints (tapping \"Submit\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60168,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 30,000 Coins (tapping \"Submit\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60169,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 5 Wisdom Cubes (tapping \"Submit\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [
        1631,
        1632,
        1633,
        1634,
        1635
      ],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+289 base hp",
            "+16 base aa",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"Siren Killer I\"",
            "Gains ghost equipment \"DD Ghost Gun (Odin)\"",
            "Gains ghost equipment \"CL Ghost Gun (Odin)\"",
            "Slot 1 mounts +1"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+579 base hp",
            "+31 base aa",
            "Slot 3 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "Slot 1 efficiency +15%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+868 base hp",
            "+47 base aa",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "Slot 1 mounts +1",
            "Slot 1 efficiency +15%"
          ]
        },
        {
          "descriptor": "Fate Sim 1",
          "value": [
            "+1 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 2",
          "value": [
            "+2 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 3",
          "value": [
            "+3 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 4",
          "value": [
            "+4 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 5",
          "value": [
            "+5 base luck",
            "Skill \"Herteitr's Rolling Thunder\" changes to \"Herteitr's Rolling Thunder+\""
          ]
        }
      ],
      "sourceShipId": 20016
    },
    "49905": {
      "id": "49905",
      "name": "Ägir",
      "classification": "DR",
      "series": 4,
      "unlock": "Requires 700 Iron Blood Tech Points",
      "missions": [
        {
          "id": 60202,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,200,000 EXP using Iron Blood Main Fleet ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60203,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60204,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 3 T3 Battleship Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60205,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,400,000 EXP using Iron Blood Vanguard ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60202
          ]
        },
        {
          "id": 60206,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 12 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60203
          ]
        },
        {
          "id": 60207,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 8 T3 Cruiser Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60208,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 50,000 Coins (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60209,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 10 Wisdom Cubes (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [
        2031,
        2032,
        2033,
        2034,
        2035
      ],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+338 base hp",
            "+12 base aa",
            "Slot 1 mounts +1",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"Siren Killer I\"",
            "Replaces ghost equipment \"DD Ghost Gun (KMS CAs)\" with \"CL Ghost Gun (Ägir)\"",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+675 base hp",
            "+23 base aa",
            "Slot 2 preload +1",
            "Slot 3 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "Slot 2 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+1014 base hp",
            "+34 base aa",
            "+5 base eva",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "Slot 1 efficiency +15%"
          ]
        }
      ],
      "sourceShipId": 20020
    },
    "49906": {
      "id": "49906",
      "name": "August von Parseval",
      "classification": "PR",
      "series": 4,
      "unlock": "Requires 600 Iron Blood Tech Points",
      "missions": [
        {
          "id": 60212,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,000,000 EXP using Iron Blood Main Fleet ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60213,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 5 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60214,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 10 T2 Carrier Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60215,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,000,000 EXP using Iron Blood Main Fleet ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60212
          ]
        },
        {
          "id": 60216,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60213
          ]
        },
        {
          "id": 60217,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 5 T3 Carrier Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60218,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 30,000 Coins (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60219,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 5 Wisdom Cubes (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [
        2131,
        2132,
        2133,
        2134,
        2135
      ],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+310 base hp",
            "+15 base aa",
            "Slot 2 mounts +1",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"Siren Killer I\"",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+621 base hp",
            "+30 base aa",
            "Slot 3 mounts +1",
            "Slot 3 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "Hangar Capacity +1",
            "Slot 3 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+931 base hp",
            "+46 base aa",
            "All Weapon mounts +1",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "All Weapon efficiencies +5%"
          ]
        },
        {
          "descriptor": "Fate Sim 1",
          "value": [
            "+1 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 2",
          "value": [
            "+2 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 3",
          "value": [
            "+3 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 4",
          "value": [
            "+4 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 5",
          "value": [
            "+5 base luck",
            "Skill \"Hex-Principle of Insight\" changes to \"Hex-Principle of Insight+\""
          ]
        }
      ],
      "sourceShipId": 20021
    },
    "49907": {
      "id": "49907",
      "name": "Prinz Rupprecht",
      "classification": "PR",
      "series": 5,
      "unlock": "Requires 700 Iron Blood Tech Points",
      "missions": [
        {
          "id": 60242,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,000,000 EXP using Iron Blood Main Fleet ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60243,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 5 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60244,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 10 T2 Battleship Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60245,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,000,000 EXP using Iron Blood Main Fleet ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60242
          ]
        },
        {
          "id": 60246,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60243
          ]
        },
        {
          "id": 60247,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 5 T3 Battleship Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60248,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 30,000 Coins (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60249,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 5 Wisdom Cubes (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [
        2431,
        2432,
        2433,
        2434,
        2435
      ],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+344 base hp",
            "+15 base aa",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"Siren Killer I\"",
            "Slot 1 mounts +1"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+688 base hp",
            "+29 base aa",
            "Slot 3 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "Slot 2 mounts +1",
            "Slot 1 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+1032 base hp",
            "+45 base aa"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "Slot 1 mounts +1",
            "Slot 1 efficiency +15%"
          ]
        },
        {
          "descriptor": "Fate Sim 1",
          "value": [
            "+1 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 2",
          "value": [
            "+2 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 3",
          "value": [
            "+3 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 4",
          "value": [
            "+4 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 5",
          "value": [
            "+5 base luck",
            "Skill \"Lindwurm - Devouring Fang\" changes to \"Lindwurm - Devouring Fang+\""
          ]
        }
      ],
      "sourceShipId": 20024
    },
    "49908": {
      "id": "49908",
      "name": "Felix Schultz",
      "classification": "PR",
      "series": 6,
      "unlock": "Requires 850 Iron Blood Tech Points",
      "missions": [
        {
          "id": 60302,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,000,000 EXP using Iron Blood Vanguard ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60303,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 5 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60304,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 10 T2 Destroyer Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60305,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,000,000 EXP using Iron Blood Vanguard ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60302
          ]
        },
        {
          "id": 60306,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60303
          ]
        },
        {
          "id": 60307,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 5 T3 Destroyer Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60308,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 20,000 Coins (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60309,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 5 Wisdom Cubes (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [
        3031,
        3032,
        3033,
        3034,
        3035
      ],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+134 base hp",
            "+7 base aa",
            "Slot 2 mounts +1"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"All Out Assault I\"",
            "Unlock Skill \"Siren Killer I\"",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+269 base hp",
            "+15 base aa",
            "Slot 2 preload +1",
            "Slot 1 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "Slot 3 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+403 base hp",
            "+22 base aa"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"All Out Assault I\" changes to \"All Out Assault II\"",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "All Weapon efficiencies +5%"
          ]
        },
        {
          "descriptor": "Fate Sim 1",
          "value": [
            "+1 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 2",
          "value": [
            "+2 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 3",
          "value": [
            "+3 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 4",
          "value": [
            "+4 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 5",
          "value": [
            "+5 base luck",
            "Skill \"Tormentor of the Weak\" changes to \"Tormentor of the Weak+\""
          ]
        }
      ],
      "sourceShipId": 20030
    },
    "49909": {
      "id": "49909",
      "name": "Hindenburg",
      "classification": "DR",
      "series": 6,
      "unlock": "Requires 950 Iron Blood Tech Points",
      "missions": [
        {
          "id": 60312,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,200,000 EXP using Iron Blood Vanguard ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60313,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60314,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 3 T3 Cruiser Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60315,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,400,000 EXP using Iron Blood Vanguard ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60312
          ]
        },
        {
          "id": 60316,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 12 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60313
          ]
        },
        {
          "id": 60317,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 8 T3 Cruiser Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60318,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 40,000 Coins (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60319,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 10 Wisdom Cubes (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+253 base hp",
            "+11 base aa",
            "+5 base eva",
            "Slot 1 mounts +1"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"All Out Assault I\"",
            "Unlock Skill \"Siren Killer I\"",
            "All Weapon efficiencies +2%"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+506 base hp",
            "+21 base aa",
            "Slot 1 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "All Weapon efficiencies +3%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+759 base hp",
            "+32 base aa",
            "+10 base eva"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"All Out Assault I\" changes to \"All Out Assault II\"",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "Slot 3 types change to {CA Gun|3}, {AA Gun (Normal)|6}",
            "All Weapon efficiencies +5%"
          ]
        }
      ],
      "sourceShipId": 20031
    },
    "49910": {
      "id": "49910",
      "name": "Mecklenburg",
      "classification": "DR",
      "series": 8,
      "unlock": "Requires 950 Iron Blood Tech Points",
      "missions": [
        {
          "id": 60392,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,200,000 EXP using Iron Blood Main Fleet ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60393,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60394,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 3 T3 Battleship Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60395,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,400,000 EXP using Iron Blood Main Fleet ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60392
          ]
        },
        {
          "id": 60396,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 12 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60393
          ]
        },
        {
          "id": 60397,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 8 T3 Battleship Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60398,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 60,000 Coins (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60399,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 10 Wisdom Cubes (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+409 base hp",
            "+12 base aa",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"Siren Killer I\"",
            "Slot 1 mounts +1",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+818 base hp",
            "+24 base aa",
            "Slot 3 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "Salvo Capacity +1",
            "Slot 2 mounts +2",
            "Slot 1 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+1226 base hp",
            "+35 base aa",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "Slot 1 mounts +1",
            "Slot 1 efficiency +15%"
          ]
        }
      ],
      "sourceShipId": 20039
    },
    "49911": {
      "id": "49911",
      "name": "Max Immelmann",
      "classification": "DR",
      "series": 9,
      "unlock": "Requires 1,050 Iron Blood Tech Points",
      "missions": [
        {
          "id": 60452,
          "order": 1,
          "gateSeconds": 0,
          "objective": "–Sortie and accumulate 1,200,000 EXP using Iron Blood Main Fleet ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60453,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "–Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60454,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "–Gather 3 T3 Carrier Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60455,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "–Sortie and accumulate 2,400,000 EXP using Iron Blood Main Fleet ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60452
          ]
        },
        {
          "id": 60456,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "–Complete 12 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60453
          ]
        },
        {
          "id": 60457,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "–Gather 8 T3 Carrier Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60458,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "–Gather 50,000 Coins (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60459,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "–Gather 10 Wisdom Cubes (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [],
      "milestones": [],
      "sourceShipId": null
    },
    "59901": {
      "id": "59901",
      "name": "Harbin",
      "classification": "PR",
      "series": 5,
      "unlock": "Requires 160 Dragon Empery Tech Points",
      "missions": [
        {
          "id": 60252,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,000,000 EXP using Dragon Empery Vanguard ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60253,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 5 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60254,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 10 T2 Cruiser Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60255,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,000,000 EXP using Dragon Empery Vanguard ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60252
          ]
        },
        {
          "id": 60256,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60253
          ]
        },
        {
          "id": 60257,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 5 T3 Cruiser Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60258,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 20,000 Coins (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60259,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 5 Wisdom Cubes (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [
        2531,
        2532,
        2533,
        2534,
        2535
      ],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+152 base hp",
            "+19 base aa",
            "Slot 2 mounts +1"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"All Out Assault I\"",
            "Unlock Skill \"Siren Killer I\"",
            "Slot 2 efficiency +5%",
            "Slot 2 preload +1"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+305 base hp",
            "+38 base aa",
            "Slot 2 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "Upgrade ghost equipment \"DD Ghost Gun (SN CLs)\" to HE Ammo.",
            "Slot 1 mounts +1",
            "Slot 2 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+457 base hp",
            "+58 base aa"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"All Out Assault I\" changes to \"All Out Assault II\"",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "Slot 2 efficiency +15%"
          ]
        },
        {
          "descriptor": "Fate Sim 1",
          "value": [
            "+1 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 2",
          "value": [
            "+2 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 3",
          "value": [
            "+3 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 4",
          "value": [
            "+4 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 5",
          "value": [
            "+5 base luck",
            "Skill \"Blazing Battledance\" changes to \"Blazing Battledance+\""
          ]
        }
      ],
      "sourceShipId": 20025
    },
    "69901": {
      "id": "69901",
      "name": "Marco Polo",
      "classification": "PR",
      "series": 4,
      "unlock": "Requires 600 Iron Blood Tech Points and 700 Royal Navy Tech Points",
      "missions": [
        {
          "id": 60222,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,000,000 EXP using Iron Blood or Sardegna Empire Main Fleet ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60223,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 5 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60224,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 10 T2 Battleship Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60225,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,000,000 EXP using Royal Navy or Sardegna Empire Main Fleet ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60222
          ]
        },
        {
          "id": 60226,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60223
          ]
        },
        {
          "id": 60227,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 5 T3 Battleship Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60228,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 30,000 Coins (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60229,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 5 Wisdom Cubes (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [
        2231,
        2232,
        2233,
        2234,
        2235
      ],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+344 base hp",
            "+12 base aa",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"Siren Killer I\"",
            "Slot 1 mounts +1",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+688 base hp",
            "+24 base aa",
            "Slot 3 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "Slot 2 mounts +2",
            "Slot 1 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+1032 base hp",
            "+35 base aa",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "Slot 1 mounts +1",
            "Slot 1 efficiency +15%"
          ]
        },
        {
          "descriptor": "Fate Sim 1",
          "value": [
            "+1 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 2",
          "value": [
            "+2 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 3",
          "value": [
            "+3 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 4",
          "value": [
            "+4 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 5",
          "value": [
            "+5 base luck",
            "Skill \"Il Milione\" changes to \"Il Milione+\""
          ]
        }
      ],
      "sourceShipId": 20022
    },
    "69902": {
      "id": "69902",
      "name": "Napoli",
      "classification": "DR",
      "series": 7,
      "unlock": "Requires 300 Sardegna Empire Tech Points and 200 \\nNorthern Parliament Tech Points",
      "missions": [
        {
          "id": 60352,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,200,000 EXP using Sardegna Empire or Northern Parliament Vanguard ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60353,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60354,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 3 T3 Cruiser Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60355,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,400,000 EXP using Sardegna Empire or Northern Parliament Vanguard ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60352
          ]
        },
        {
          "id": 60356,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 12 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60353
          ]
        },
        {
          "id": 60357,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 8 T3 Cruiser Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60358,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 40,000 Coins (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60359,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 10 Wisdom Cubes (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+298 base hp",
            "+12 base aa",
            "+5 base eva",
            "Slot 2 mounts +1"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"All Out Assault I\"",
            "Unlock Skill \"Siren Killer I\"",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+597 base hp",
            "+23 base aa",
            "Slot 1 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "Slot 2 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+894 base hp",
            "+36 base aa",
            "+10 base eva"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"All Out Assault I\" changes to \"All Out Assault II\"",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "All Weapon efficiencies +5%"
          ]
        }
      ],
      "sourceShipId": 20035
    },
    "69903": {
      "id": "69903",
      "name": "Vittorio Cuniberti",
      "classification": "PR",
      "series": 8,
      "unlock": "Requires 300 Sardegna Empire Tech Points",
      "missions": [
        {
          "id": 60402,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,000,000 EXP using Sardegna Empire Vanguard ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60403,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 5 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60404,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 10 T2 Destroyer Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60405,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,000,000 EXP using Sardegna Empire Vanguard ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60402
          ]
        },
        {
          "id": 60406,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60403
          ]
        },
        {
          "id": 60407,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 5 T3 Destroyer Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60408,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 20,000 Coins (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60409,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 5 Wisdom Cubes (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [
        4031,
        4032,
        4033,
        4034,
        4035
      ],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+84 base hp",
            "+9 base aa",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"All Out Assault I\"",
            "Unlock Skill \"Siren Killer I\"",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+168 base hp",
            "+17 base aa",
            "Slot 2 preload +1"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "Slot 1 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+252 base hp",
            "+26 base aa"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"All Out Assault I\" changes to \"All Out Assault II\"",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "All Weapon efficiencies +5%"
          ]
        }
      ],
      "sourceShipId": 20040
    },
    "79901": {
      "id": "79901",
      "name": "Chkalov",
      "classification": "PR",
      "series": 5,
      "unlock": "Requires 760 Eagle Union Tech Points and 300 Sardegna Empire Tech Points",
      "missions": [
        {
          "id": 60262,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,000,000 EXP using Sardegna Empire or Northern Parliament Main ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60263,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 5 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60264,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 10 T2 Carrier Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60265,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,000,000 EXP using Eagle Union or Northern Parliament Main ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60262
          ]
        },
        {
          "id": 60266,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60263
          ]
        },
        {
          "id": 60267,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 5 T3 Carrier Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60268,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 30,000 Coins (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60269,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 5 Wisdom Cubes (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [
        2631,
        2632,
        2633,
        2634,
        2635
      ],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+269 base hp",
            "+15 base aa",
            "Slot 3 mounts +1"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"Siren Killer I\"",
            "Slot 3 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+539 base hp",
            "+30 base aa",
            "All Weapon mounts +1",
            "Slot 3 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "Hangar Capacity +1",
            "Slot 3 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+809 base hp",
            "+44 base aa",
            "Slot 3 mounts +1"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "Slot 3 efficiency +15%"
          ]
        },
        {
          "descriptor": "Fate Sim 1",
          "value": [
            "+1 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 2",
          "value": [
            "+2 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 3",
          "value": [
            "+3 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 4",
          "value": [
            "+4 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 5",
          "value": [
            "+5 base luck",
            "Skill \"Contingency Experiment - Suppressive Fire\" changes to \"Contingency Experiment - Suppressive Fire+\""
          ]
        }
      ],
      "sourceShipId": 20026
    },
    "79902": {
      "id": "79902",
      "name": "Admiral Nakhimov",
      "classification": "DR",
      "series": 7,
      "unlock": "Requires 300 Northern Parliament Tech Points and 200 \\nSardegna Empire Tech Points",
      "missions": [
        {
          "id": 60362,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,200,000 EXP using Sardegna Empire or Northern Parliament Main Fleet ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60363,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60364,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 3 T3 Carrier Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60365,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,400,000 EXP using Sardegna Empire or Northern Parliament Main Fleet ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60362
          ]
        },
        {
          "id": 60366,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 12 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60363
          ]
        },
        {
          "id": 60367,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 8 T3 Carrier Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60368,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 50,000 Coins (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60369,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 10 Wisdom Cubes (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+393 base hp",
            "+14 base aa",
            "Slot 2 & Slot 3 mounts +1"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"Siren Killer I\"",
            "Slot 2 & Slot 3 efficiencies +5%"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+787 base hp",
            "+27 base aa",
            "Slot 1 mounts +1",
            "Slot 2 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "Hangar Capacity +1",
            "Slot 1 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+1180 base hp",
            "+41 base aa",
            "All Weapon mounts +1",
            "Slot 3 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "Slot 2 types change to {Fighter|7}, {Torpedo Bomber|8}, {Dive Bomber|9}",
            "All Weapon efficiencies +5%"
          ]
        }
      ],
      "sourceShipId": 20036
    },
    "79903": {
      "id": "79903",
      "name": "Dmitri Donskoi",
      "classification": "PR",
      "series": 8,
      "unlock": "Requires 300 Northern Parliament Tech Points",
      "missions": [
        {
          "id": 60412,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,000,000 EXP using Northern Parliament Vanguard ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60413,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 5 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60414,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 10 T2 Cruiser Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60415,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,000,000 EXP using Northern Parliament Vanguard ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60412
          ]
        },
        {
          "id": 60416,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60413
          ]
        },
        {
          "id": 60417,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 5 T3 Cruiser Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60418,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 20,000 Coins (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60419,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 5 Wisdom Cubes (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [
        4131,
        4132,
        4133,
        4134,
        4135
      ],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+200 base hp",
            "+18 base aa",
            "Slot 2 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"All Out Assault I\"",
            "Unlock Skill \"Siren Killer I\"",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+400 base hp",
            "+35 base aa",
            "Slot 2 mounts +1"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "Upgrade ghost equipment \"DD Ghost Gun (SN CLs)\" to HE Ammo.",
            "Slot 1 mounts +1",
            "Slot 2 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+600 base hp",
            "+53 base aa"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"All Out Assault I\" changes to \"All Out Assault II\"",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "Slot 1 efficiency +10%"
          ]
        }
      ],
      "sourceShipId": 20041
    },
    "89901": {
      "id": "89901",
      "name": "Saint Louis",
      "classification": "PR",
      "series": 1,
      "unlock": "Register 20 or more Eagle Union Vanguard Fleet ships in your Library.",
      "missions": [
        {
          "id": 60062,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,000,000 EXP using Eagle Union Vanguard ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60063,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 5 Research Projects in the Tech Academy.",
          "name": "Theoretical Technology Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60064,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 10 T2 Cruiser Retrofit Blueprints (tapping \"Submit\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60065,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,000,000 EXP using Eagle Union Vanguard ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60062
          ]
        },
        {
          "id": 60066,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60063
          ]
        },
        {
          "id": 60067,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 5 T3 Cruiser Retrofit Blueprints (tapping \"Submit\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60068,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 20,000 Coins (tapping \"Submit\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60069,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 5 Wisdom Cubes (tapping \"Submit\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [
        631,
        632,
        633,
        634,
        635
      ],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+230 base hp",
            "+11 base aa",
            "+5 base eva",
            "Slot 1 mounts +1"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"All Out Assault I\"",
            "Unlock Skill \"Siren Killer I\"",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+460 base hp",
            "+23 base aa",
            "Slot 1 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "Slot 2 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+690 base hp",
            "+34 base aa",
            "+10 base eva"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"All Out Assault I\" changes to \"All Out Assault II\"",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "Slot 1 efficiency +15%"
          ]
        },
        {
          "descriptor": "Fate Sim 1",
          "value": [
            "+1 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 2",
          "value": [
            "+2 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 3",
          "value": [
            "+3 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 4",
          "value": [
            "+4 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 5",
          "value": [
            "+5 base luck",
            "Skill \"Engine Boost\" changes to \"Engine Boost+\""
          ]
        }
      ],
      "sourceShipId": 20006
    },
    "89902": {
      "id": "89902",
      "name": "Champagne",
      "classification": "PR",
      "series": 3,
      "unlock": "Requires 760 Eagle Union Tech Points and 700 Royal Navy Tech Points",
      "missions": [
        {
          "id": 60172,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,000,000 EXP using Eagle Union, Vichya Dominion, or Iris Libre Main Fleet ships. (EXP from any combination of Main Fleet ships from these factions will count.)",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60173,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 5 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60174,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 10 T2 Battleship Retrofit Blueprints (tapping \"Submit\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60175,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,000,000 EXP using Eagle Union, Vichya Dominion, or Iris Libre Main Fleet ships. (EXP from any combination of Main Fleet ships from these factions will count.)",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60172
          ]
        },
        {
          "id": 60176,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60173
          ]
        },
        {
          "id": 60177,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 5 T3 Battleship Retrofit Blueprints (tapping \"Submit\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60178,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 30,000 Coins (tapping \"Submit\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60179,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 5 Wisdom Cubes (tapping \"Submit\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [
        1731,
        1732,
        1733,
        1734,
        1735
      ],
      "milestones": [],
      "sourceShipId": null
    },
    "89903": {
      "id": "89903",
      "name": "Brest",
      "classification": "DR",
      "series": 5,
      "unlock": "Requires 250 Iris Libre Tech Points",
      "missions": [
        {
          "id": 60272,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,200,000 EXP using Iris Libre or Vichya Dominion Main Fleet ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60273,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60274,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 3 T3 Battleship Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60275,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,400,000 EXP using Iris Libre or Vichya Dominion Vanguard ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60272
          ]
        },
        {
          "id": 60276,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 12 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60273
          ]
        },
        {
          "id": 60277,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 8 T3 Cruiser Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60278,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 50,000 Coins (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60279,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 10 Wisdom Cubes (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+307 base hp",
            "+12 base aa",
            "Slot 1 mounts +1"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"Siren Killer I\"",
            "Replaces ghost equipment \"DD Ghost Gun (KMS CAs)\" with \"CL Ghost Gun (Brest)\"",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+614 base hp",
            "+23 base aa",
            "Slot 3 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "Slot 2 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+921 base hp",
            "+35 base aa",
            "+5 base eva",
            "Slot 3 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "Slot 1 efficiency +15%"
          ]
        }
      ],
      "sourceShipId": 20027
    },
    "89904": {
      "id": "89904",
      "name": "Bayard",
      "classification": "PR",
      "series": 7,
      "unlock": "Requires 230 Iris Libre Tech Points",
      "missions": [
        {
          "id": 60372,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,000,000 EXP using Iris Libre or Vichya Dominion Vanguard ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60373,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 5 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60374,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 10 T2 Cruiser Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60375,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,000,000 EXP using Iris Libre or Vichya Dominion Vanguard ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60372
          ]
        },
        {
          "id": 60376,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60373
          ]
        },
        {
          "id": 60377,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 5 T3 Cruiser Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60378,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 20,000 Coins (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60379,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 5 Wisdom Cubes (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [
        3731,
        3732,
        3733,
        3734,
        3735
      ],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+202 base hp",
            "+17 base aa",
            "Slot 2 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"All Out Assault I\"",
            "Unlock Skill \"Siren Killer I\"",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+405 base hp",
            "+35 base aa",
            "Slot 2 mounts +1"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "Upgrade ghost equipment \"DD Ghost Gun (FFNF CLS)\" to HE Ammo.",
            "Slot 1 mounts +1",
            "Slot 2 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+607 base hp",
            "+51 base aa"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"All Out Assault I\" changes to \"All Out Assault II\"",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "Slot 1 efficiency +10%"
          ]
        },
        {
          "descriptor": "Fate Sim 1",
          "value": [
            "+1 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 2",
          "value": [
            "+2 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 3",
          "value": [
            "+3 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 4",
          "value": [
            "+4 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 5",
          "value": [
            "+5 base luck",
            "Skill \"Blade of Iris Aspirations\" changes to \"Blade of Iris Aspirations+\""
          ]
        }
      ],
      "sourceShipId": 20037
    },
    "89905": {
      "id": "89905",
      "name": "Orage",
      "classification": "PR",
      "series": 9,
      "unlock": "Requires 280 Iris Libre Tech Points",
      "missions": [
        {
          "id": 60462,
          "order": 1,
          "gateSeconds": 0,
          "objective": "–Sortie and accumulate 1,000,000 EXP using Iris Libre or Vichya Dominion Vanguard ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60463,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "–Complete 5 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60464,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "–Gather 10 T2 Destroyer Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60465,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "–Sortie and accumulate 2,000,000 EXP using Iris Libre or Vichya Dominion Vanguard ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60462
          ]
        },
        {
          "id": 60466,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "–Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60463
          ]
        },
        {
          "id": 60467,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "–Gather 5 T3 Destroyer Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60468,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "–Gather 20,000 Coins (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60469,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "–Gather 5 Wisdom Cubes (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [],
      "milestones": [],
      "sourceShipId": null
    },
    "99901": {
      "id": "99901",
      "name": "Gascogne",
      "classification": "PR",
      "series": 2,
      "unlock": "Requires 760 Eagle Union Tech Points and 420 Iron Blood Tech Points",
      "missions": [
        {
          "id": 60122,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,000,000 EXP using Iron Blood, Vichya Dominion, or Iris Libre Main Fleet ships. (EXP from any combination of Main Fleet ships from these factions will count.)",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60123,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 5 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60124,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 10 T2 Battleship Retrofit Blueprints (tapping \"Submit\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60125,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,000,000 EXP using Iron Blood, Vichya Dominion, or Iris Libre Main Fleet ships. (EXP from any combination of Main Fleet ships from these factions will count.)",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60122
          ]
        },
        {
          "id": 60126,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60123
          ]
        },
        {
          "id": 60127,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 5 T3 Battleship Retrofit Blueprints (tapping \"Submit\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60128,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 30,000 Coins (tapping \"Submit\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60129,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 5 Wisdom Cubes (tapping \"Submit\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [
        1231,
        1232,
        1233,
        1234,
        1235
      ],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+325 base hp",
            "+11 base aa",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"Siren Killer I\"",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+651 base hp",
            "+22 base aa",
            "Slot 3 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "Slot 2 mounts +2",
            "Slot 1 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+976 base hp",
            "+33 base aa",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "Slot 1 efficiency +15%"
          ]
        },
        {
          "descriptor": "Fate Sim 1",
          "value": [
            "+1 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 2",
          "value": [
            "+2 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 3",
          "value": [
            "+3 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 4",
          "value": [
            "+4 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 5",
          "value": [
            "+5 base luck",
            "Skill \"Emotion Inhibition Module\" changes to \"Emotion Inhibition Module+\""
          ]
        }
      ],
      "sourceShipId": 20012
    },
    "99902": {
      "id": "99902",
      "name": "Flandre",
      "classification": "PR",
      "series": 6,
      "unlock": "Requires 180 Vichya Dominion Tech Points and 800 Iron Blood Tech Points",
      "missions": [
        {
          "id": 60322,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,000,000 EXP using Iris Libre or Vichya Dominion Main Fleet ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60323,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 5 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60324,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 10 T2 Battleship Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60325,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,000,000 EXP using Iris Libre or Vichya Dominion Main Fleet ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60322
          ]
        },
        {
          "id": 60326,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60323
          ]
        },
        {
          "id": 60327,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 5 T3 Battleship Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60328,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 30,000 Coins (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60329,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 5 Wisdom Cubes (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [
        3231,
        3232,
        3233,
        3234,
        3235
      ],
      "milestones": [
        {
          "descriptor": "Dev 5",
          "value": [
            "+356 base hp",
            "+12 base aa",
            "Slot 1 preload +1",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Unlock Skill \"Siren Killer I\"",
            "Slot 1 mounts +1",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+712 base hp",
            "+25 base aa",
            "Slot 3 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "Slot 2 mounts +2",
            "Slot 1 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+1068 base hp",
            "+37 base aa",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "Slot 1 mounts +1",
            "Slot 1 efficiency +15%"
          ]
        },
        {
          "descriptor": "Fate Sim 1",
          "value": [
            "+1 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 2",
          "value": [
            "+2 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 3",
          "value": [
            "+3 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 4",
          "value": [
            "+4 base luck"
          ]
        },
        {
          "descriptor": "Fate Sim 5",
          "value": [
            "+5 base luck",
            "Skill \"Apotheosis: Flourishing Assault\" changes to \"Apotheosis: Flourishing Assault+\""
          ]
        }
      ],
      "sourceShipId": 20032
    },
    "119901": {
      "id": "119901",
      "name": "Gouden Leeuw",
      "classification": "DR",
      "series": 8,
      "unlock": "Requires 800 Iron Blood Tech Points and 200 Sardegna Empire Tech Points",
      "missions": [
        {
          "id": 60422,
          "order": 1,
          "gateSeconds": 0,
          "objective": "Sortie and accumulate 1,200,000 EXP using Kingdom of Tulipa, Iron Blood, or Sardegna Empire Vanguard ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60423,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60424,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "Gather 3 T3 Cruiser Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60425,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "Sortie and accumulate 2,400,000 EXP using Kingdom of Tulipa, Iron Blood, or Sardegna Empire Vanguard ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60422
          ]
        },
        {
          "id": 60426,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "Complete 12 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60423
          ]
        },
        {
          "id": 60427,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "Gather 8 T3 Cruiser Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60428,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "Gather 40,000 Coins (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60429,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "Gather 10 Wisdom Cubes (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [],
      "milestones": [
        {
          "descriptor": "Dev 0",
          "value": [
            "Unlock Skill \"Bombing Raid I\""
          ]
        },
        {
          "descriptor": "Dev 5",
          "value": [
            "+296 base hp",
            "+22 base aa",
            "+5 base eva",
            "Slot 1 mounts +1"
          ]
        },
        {
          "descriptor": "Dev 10",
          "value": [
            "Limit Break to 4 Stars",
            "Skill \"Bombing Raid I\" changes to \"Bombing Raid II\"",
            "Unlock Skill \"Siren Killer I\"",
            "Slot 1 efficiency +5%"
          ]
        },
        {
          "descriptor": "Dev 15",
          "value": [
            "+592 base hp",
            "+43 base aa",
            "Slot 2 efficiency +10%"
          ]
        },
        {
          "descriptor": "Dev 20",
          "value": [
            "Limit Break to 5 Stars",
            "Skill \"Bombing Raid II\" changes to \"Bombing Raid III\"",
            "Skill \"Siren Killer I\" changes to \"Siren Killer II\"",
            "Slot 3 mounts +1"
          ]
        },
        {
          "descriptor": "Dev 25",
          "value": [
            "+887 base hp",
            "+65 base aa",
            "+10 base eva"
          ]
        },
        {
          "descriptor": "Dev 30",
          "value": [
            "Limit Break to 6 Stars",
            "Skill \"Bombing Raid III\" changes to \"Bombing Raid IV\"",
            "Skill \"Siren Killer II\" changes to \"Siren Killer III\"",
            "Slot 1 efficiency +15%"
          ]
        }
      ],
      "sourceShipId": 20042
    },
    "129901": {
      "id": "129901",
      "name": "Valparaíso",
      "classification": "DR",
      "series": 9,
      "unlock": "Requires 950 Eagle Union Tech Points and 1,000 Royal Navy Tech Points",
      "missions": [
        {
          "id": 60472,
          "order": 1,
          "gateSeconds": 0,
          "objective": "–Sortie and accumulate 1,200,000 EXP using Royal Navy Main Fleet ships.",
          "name": "Combat Data Collection Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60473,
          "order": 2,
          "gateSeconds": 86400,
          "objective": "–Complete 8 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60474,
          "order": 3,
          "gateSeconds": 172800,
          "objective": "–Gather 3 T3 Battleship Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60475,
          "order": 4,
          "gateSeconds": 259200,
          "objective": "–Sortie and accumulate 2,400,000 EXP using Eagle Union Main Fleet ships.",
          "name": "Combat Data Collection Ⅱ",
          "prerequisiteText": "Combat Data Collection Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60472
          ]
        },
        {
          "id": 60476,
          "order": 5,
          "gateSeconds": 345600,
          "objective": "–Complete 12 Research Projects in the Tech Academy.",
          "name": "Theoretical Engineering Research Ⅱ",
          "prerequisiteText": "Theoretical Engineering Research Ⅰ must be completed first.",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": [
            60473
          ]
        },
        {
          "id": 60477,
          "order": 6,
          "gateSeconds": 432000,
          "objective": "–Gather 8 T3 Battleship Retrofit Blueprints (tapping \"Complete\" will use up these resources.)",
          "name": "Design Breakthrough Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60478,
          "order": 7,
          "gateSeconds": 518400,
          "objective": "–Gather 60,000 Coins (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅰ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        },
        {
          "id": 60479,
          "order": 8,
          "gateSeconds": 518400,
          "objective": "–Gather 10 Wisdom Cubes (tapping \"Complete\" will use up these resources.)",
          "name": "Hull Construction Ⅱ",
          "prerequisiteText": "",
          "requiredCommanderLevel": 30,
          "prerequisiteTaskIds": []
        }
      ],
      "fateIds": [],
      "milestones": [],
      "sourceShipId": null
    }
  }
};
