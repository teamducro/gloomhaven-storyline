---
paths:
  - "resources/js/games/**"
---

# Game data

- Load the `gloomhaven-domain` skill and read the reference of each game you touch first.
- Every `games/{game}.json` has the same top-level keys, empty where the game has no data. `gh.json` also holds the Forgotten Circles scenarios, items and achievements.
- Per-game numbers and rules belong in the game's file and are read through `services/GameData.js`, not hardcoded behind a `Game.fh`-style check.
- Scenario references (`links_to`, `linked_from`, `coupled`, `treasures_from`, `treasures_to`, `chapter_id`, achievements, `required_by`) must resolve; `npm run test:arch` checks them.
