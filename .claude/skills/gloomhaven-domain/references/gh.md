# Gloomhaven (gh) and Forgotten Circles (fc)

Forgotten Circles is an expansion: it is the **same campaign** as Gloomhaven. Selecting `fc` is a view on the GH campaign, not separate progress.

## Shared between gh and fc

- `games/gh.json` `scenarios`: GH 1–95 + solo 202–219, FC 96–117 (FC chapters 20–25, FC root 96, FC solo 116 Diviner, 117 without chapter). Scenario keys are still `scenario-gh-*` / `scenario-fc-*` by the scenario's `game`; the scenario list only shows the current game's scenarios.
- `achievements` (FC achievements are tagged `game: "gh"`), `items`, `personalQuests` (all in `gh.json`), the party sheet (storage key `sheet` for both).
- Map: both use the FC world map image (`img/maps/fc`).

## FC-only

- `games/fc.json` `quests` story summaries (only these load in the fc view), `abilities` and `characters` in `fc.json` (Diviner `DR`), `svg/storylines/fc.svg`, Rift event deck (`sheet.rift`, shown in `PartyGh` for fc only).
- `ScenarioCompletedService`: 106/107 → 112 after 3× `GPOA`, 110–113 → 114 after 2× `GPA`.

## Party sheet (`pages/PartyGh.vue`)

Reputation (shop price modifier), donations to the Great Oak (each threshold 100…1000 ticks a prosperity checkmark, shown as locked boxes), prosperity (thresholds 1/5/10/16/23/31/40/51/65), City/Road decks (start 1–30), scenario level, notes, class unlocks, and 9 sheet unlocks by index: 0 five Ancient Technology → Envelope A, 1 Drake's Command & Treasure, 2 donate 100 → Envelope B, 3–6 reputation ±10/±20, 7 retire → Town Records, 8 Envelope X solved (`xResult === 'Bladeswarm'` unlocks `BS`).

## Scenarios

- Regions (12) as a list filter; `pages` give scenario book page images; `coupled` pairs share a sticker (11/12, 35/36); Virtual Board link.
- Conclusion decisions hard-coded in `ChoiceService`: `dragon`, `merchantsBay`, `shiftingGears`, `aftershocks`.
- Treasures can unlock scenarios (`treasures_to`, e.g. treasure 49 in scenario 37 → 17).
- Chapters ≥100: 100 Solo, 101 Personal Quests, 102 Random Scenarios, 103 Sealed, 104 Road Events, 105 City Events.

## Seeker of Xorn (fan-made small expansion)

Personal quest 510 adds City event `C-SoX1` on choosing (`events_on_choose`) and makes `C-SoX2`…`4` addable (`events_addable_on_choose`). Crypt scenarios `SoX1`–`3` (chapter 101) and party achievements `PSOX1`–`3` are gated by `requires_event`. String event ids are kept in storage even when out of the deck. Images in `img/cards/gh/city/SoX*`, `img/pages/gh/SoX*`; the card links to BGG thread 2220121 as credit.

## Achievements

Global + Party. City rule group `CR` (start `GCRM` Militaristic) and Artifact group `ART`. Stacking stickers via `upgrades` (e.g. `GAT` → `GAT2..5` Ancient Technology). `GAR2` requires `GAL` (`requirement`).

## Characters and items

- 17 classes + Bladeswarm (Envelope X); FC adds Diviner. Personal quests 510–533 unlock classes.
- Shop by prosperity (items 1–70), item designs 71–164 (FC 152–164). Classic enhancement costs, limit = prosperity level per class.
