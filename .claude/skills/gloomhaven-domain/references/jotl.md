# Jaws of the Lion (jotl)

The smallest game: no achievements, prosperity, reputation, donations, road events, personal quests or locked classes (the class list shows the 4 starters).

## Data

`games/jotl.json` `scenarios`: 25 scenarios in chapters 1 Intro (tutorial scenarios 1–5, root 1), 2 Main, 3 City Events (side 20–21), 4 Characters (side 22–25). `items`, `quests` (story summaries), `abilities` (no `id`; tutorial `variations` a/b of level-1 cards). Treasure ids can be strings (`"X"` → `jotl-X`).

## Storyline

Linear with exclusive branches: 7/8 and 11/12 block each other via `blocks_on`. Scenario 9's `coordinates` are keyed by the parent you came from.

## Party sheet (`pages/PartyJotl.vue`, extends `PartyGh`)

City deck only (C-1…C-22, all start in the deck), scenario level, notes, class unlocks. Storage key `sheet-jotl`. The Achievements page shows an empty-state message.

## Characters and items

- 4 starting classes (RG, DM, HT, VW), always unlocked; perks with attack modifier cards; no masteries.
- Shop unlocked by completed scenarios (`calculateItemsJotl`): 2 → items 1–13, 4 → 14, 9 → 15–20, 15 → 21–26. Item designs 26–36 ticked by hand. Enabling GH cross-game items adds all GH items.
