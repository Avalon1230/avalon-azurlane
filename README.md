# AVALON — Azur Lane Intelligence

**Find the right ships, choose your gear, and understand why a fleet works.**

Azur Lane has too many ships, skills and equipment choices for a single tier number to tell the whole story. A ship that feels unstoppable in one fight may be the wrong pick for another. AVALON is a fan-made companion for exploring those choices, comparing what matters and putting together a fleet with a purpose.

**[Open AVALON](https://avalon1230.github.io/avalon-azurlane/)** · [See what's new](CHANGELOG.md) · [Follow development](docs/PROJECT_STATUS.md)

## Explore AVALON

- **Ship Index:** Browse the 894-ship catalog by faction, hull type, rarity or name. Open a ship's profile for stats, skills, equipment slots, acquisition details and original in-game artwork. Skins have their own gallery.
- **Research & Development:** Find Priority and Decisive ships by research series, explore Development and Fate Simulation stats where available, and keep track of shipyard missions and timers yourself.
- **Equipment & Augments:** Search gear by type and nation, inspect its stats, see which hulls may be able to use it, and check recorded acquisition routes. The augment directory is separate from ordinary equipment.
- **Loadout Planner (WIP):** Try a six-position loadout, explore compatible alternatives and save your own picks for General, Boss, Mobbing or OpSi. Automatic choices are starting points, not proven best-in-slot builds.
- **Fleet Lab (WIP):** Arrange fleets for different modes, including four Operation Siren surface fleets. Generate role-based suggestions from a smaller, reviewed candidate pool; nothing replaces your selections unless you apply it.
- **Tier Boards (WIP):** Read scenario-specific ship and gear assessments, with reasons and alternatives. Personal favorites and the *Must Protect!* board have their own space—they aren't combat rankings.

## Where to start

**Looking at a new ship?** Open the Ship Index, choose her faction and use the hull and rarity filters to narrow the roster. Her profile brings together the details you need, from skills to equipment and artwork.

**Working on a PR or DR ship?** Use the Research filter to find her, compare completed Development and Fate stages, then open **Research & Development** under Acquisition to track her shipyard missions. The mission tracker is manual, so you stay in control of what gets marked complete.

**Preparing for a particular fight?** Start with the mode and role, not just rarity. A fleet built for campaign mobbing has different priorities from an Operation Siren boss fleet. Fleet Lab can help sketch out a formation, and equipment details can help you weigh individual choices.

## What the recommendations mean

A gun being equippable doesn't make it the best gun for that ship. The same goes for rarity, damage on paper or a popular tier-list position. Skills, enemy armor, fleet support and the job you're asking a ship to do all matter.

AVALON is still growing into the full fleet adviser we want it to be. Current combat comparisons cover selected, checked mechanics rather than a complete battle simulation. Research ships can display Development and Fate stat changes, but combat comparisons currently use **Dev 30 / Fate 0**. Fleet suggestions come from a curated set of candidates, not a complete optimizer for every ship and piece of gear.

You can browse, experiment and save your own choices today. Where a comparison isn't ready, the site should say so rather than make up an answer.

## The bigger picture

This project is for **the whole game**, not just the latest difficult campaign chapter: Main Campaign, Operation Siren, META Showdown, Exercises, events, Challenge Mode, Guild Operations and long-term account progression.

The long-term goal is a fleet builder that understands ship skills, timing, enemy mechanics, equipment availability and how ships support one another. For OpSi, that means planning four fleets together without assigning the same ship or limited equipment twice. We want advice that explains the trade-offs, not just a button that declares something “best.”

## Run it locally

AVALON is a lightweight static website. There's no build step or package installation needed to view it. From the repository folder, start a local server:

```bash
python -m http.server 8765
```

Then open [http://localhost:8765](http://localhost:8765). Serving over HTTP matters because the app uses JavaScript modules; opening `index.html` directly from your files won't work reliably.

Some ship data and images are requested from community-hosted sources as you browse, so those details need an internet connection. Your saved fleet and equipment selections live in your browser; use the available JSON export if you want a copy.

For development checks, use Node.js 20 or newer:

```bash
npm run check
npm test
```

## Notes, sources and development

Want to see what changed, how a calculation works or where the artwork comes from? The details live here rather than crowding the front page.

| Looking for… | Read this |
| --- | --- |
| Releases and bug fixes | [Changelog](CHANGELOG.md) |
| Current work, QA and development handoff | [Project status](docs/PROJECT_STATUS.md) |
| Research ships, shipyard missions and Dev/Fate calculations | [Research ships](docs/RESEARCH_SHIPS.md) · [Research statistics](docs/RESEARCH_STATISTICS.md) |
| Equipment choices and combat calculations | [Loadout data](docs/TACTICAL_LOADOUTS.md) · [Combat mechanics](docs/COMBAT_MECHANICS.md) · [Recommendation evidence](docs/RECOMMENDATION_EVIDENCE.md) |
| Fleet suggestions and the long-term optimizer | [Fleet Lab guide](docs/FLEET_SUGGESTIONS.md) · [Optimizer plan](docs/FLEET_OPTIMIZER_SPEC.md) |
| Data sources, artwork and reuse details | [Data sources](docs/DATA_SOURCES.md) · [Artwork sources](docs/IMAGE_ASSETS.md) · [Third-party notices](THIRD_PARTY_NOTICES.md) |

## Credits

AVALON is an independent Azur Lane fan project. It isn't affiliated with or endorsed by Manjuu, Yostar, the Azur Lane Wiki, ECTL, REGAL or the community guide authors whose work we reference.

Azur Lane's characters, artwork and trademarks belong to their respective owners. Game artwork is linked from community-maintained sources, and research from other players is credited rather than presented as our own. See [third-party notices](THIRD_PARTY_NOTICES.md) for attribution and [artwork sources](docs/IMAGE_ASSETS.md) for image provenance and reuse considerations.
