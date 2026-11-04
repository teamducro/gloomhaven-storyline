---
name: gloomhaven-domain
description: How the tracker models each Gloomhaven game in code. Load before touching scenarios/unlocks, achievements, sheets, characters, items, buildings, events or campaign storage/sync, or when a Gloomhaven term's code meaning is unclear.
---

# Gloomhaven domain

Terms: [`GLOSSARY.md`](../../../GLOSSARY.md); use them in prose and UI text, keep code names in code. Paths relative to `resources/js/` unless starting with `commands/`, `cypress/`, `plans/`, `docs/`, `resources/`.

Read the reference for every game your change touches: [gh](references/gh.md) (+ FC), [gh2](references/gh2.md), [fh](references/fh.md), [jotl](references/jotl.md), [cs](references/cs.md), [mp](references/mp.md).

## Term → code

| Glossary | Code |
|---|---|
| Game | `models/Game.js`: `gh gh2 fh fc jotl cs mp` (`fc`, `mp` aren't Games); current: `app.game` |
| Campaign | localStorage blob `app.campaignId` / `app.campaignData`; local = `'local'` |
| Shared campaign / code | `apiModels/Story.js` (`campaignId = '_' + story.id`, `app.story`) / `StoryCode.js` |
| Party sheet | `models/Sheet.js` (gh, fc, jotl, cs) |
| Campaign sheet | FH `models/CampaignSheet.js`; GH2 `Sheet.js` |
| Party | `sheet.characters` (uuid → class id) |
| Sheet unlock | `sheet.unlocks` (index-keyed; list per Party page) |
| Scenario state | `models/ScenarioState.js` |
| Requirement | `required_by` (logic), `requirements` (text), `models/Requirement.js` (tokens) |
| Branch choice | `choices` / `scenario.choice` |
| Conclusion decision | `prompt` / `promptChoice` / `services/ChoiceService.js` |
| Story summary | `models/Quest.js`, `quests-*.json`, `QuestValidator` |
| Personal quest | `models/PersonalQuest.js`, `character.quest` |
| City rule | `AchievementGroup` `CR`, `CR2`; other exclusive groups `ART`, FH `CORE`/`JAR` |
| Prosperity / checkmark | `SheetCalculations.calculateProsperity` / `sheet.prosperityIndex` |
| Retire / Remove | `CharacterRepository.archiveCharacter` / `removeCharacter` |
| Perk checkmark | `character.checks` |
| Item design | `sheet.itemDesigns` |
| FH vehicle, wall, town feature, world sticker | `models/Overlay.js` |
| Brew | `AlchemySection.unlock()` |

## Storage

- One blob holds **every** game. Keys from each model's `key()`: `scenario-{game}-{id}`, `achievement-{id}` / `achievementgroup-{id}` (not game-scoped, hence GH2 `G2`/`P2` ids), `sheet` (gh **and** fc) / `sheet-{game}`, `campaign-fh`, `character-{uuid}`, `building-{game}-{id}`, `overlay-{game}-{id}`.
- `Storable` (`fieldsToStore`; `delete()` writes null), `Versionable` for sync.
- Current/enabled games are **device** settings (`store 'game'`, `'gamesEnabled'`); the Gloomhaven edition (gh or gh2) is per campaign (`sheet.edition`), survives a reset.
- `StorySyncer` after each validation: bump changed model versions, PUT the whole blob if its hash changed; server returns per-key conflicts; newer `updated_at` wins on load; Echo channel `story.{id}`. Share links overwrite the local campaign; `Reseter` wipes all games.

## Scenario unlocking

Data `scenarios-{game}.json` (GH+FC: `scenarios.json`). `ScenarioValidator` ≤5 passes, then `AchievementValidator`, `QuestValidator`, `StorySyncer.store()`.

- `hidden` → visible: `root`, a complete `linked_from` parent (respecting `choice`), `treasures_to`, or `solo` class unlocked/in party. Visible `is_side` never re-hides.
- `required_by`: OR of AND-groups `{complete, incomplete}`; ints = scenarios, strings = achievements or tokens `rope boat sled calendar puzzle`; `hidden`/`hidden_when` display-only. Unmet → `required`, met → `incomplete`.
- `blocks_on`: OR of `{complete, incomplete, lost}` → `blocked`.
- Completing applies `achievements_awarded`, `achievements_lost`, `achievements_awarded_by_choice[promptChoice-1]`, "(Item N)" in rewards → `itemDesigns`, FH overlays. Other reward text is display-only. Undo reverts achievements, not item designs.
- Conclusion decisions: per prompt name in `ChoiceService` (GH/FC/FH/CS); GH2 data-driven `prompt_unlocks`.
- `ScenarioCompletedService`: FC 106/107→112, 110–113→114; off for fh, gh2.

## Achievements

`achievements.json` = gh, fc, cs; plus `-gh2`, `-fh`; jotl none. Types `Global`, `Party`, `Campaign` (FH). `upgrades` + `count` = stacking stickers. `is_manual` added on the Achievements page, may reveal a side scenario. Group gain replaces the current; default city rule (`GCRM`, `G2AUP`) auto-gained. `GTPE`/`G2TPE` enable enhancements.

## Rules per game

`services/SheetCalculations.js`: prosperity thresholds, reputation price, donations, FH defense, shop (`calculateItems*`), scenario level, difficulty. Add new rules there keyed by game.

## Characters, items, enhancements

- `characters.json`: `perks[].cards` → attack modifier deck; `masteries`. Starters hard-coded in `starterCharacters` (`starting_group` unused). `character.game` = class origin, `sheet_game` = campaign game.
- `sheet.characterUnlocks`: Party page, personal quest (`PersonalQuestValidator`), Envelope X (`xResult`).
- Item id `{game}-{number}` (fc → gh); `app.items` merges enabled games; shop = `calculateItems*` + `itemDesigns` + cross-game; `ItemAvailability` = stock − owned.
- `sheet.enhancements[classId][abilityCode]` (survives retirement); costs/limits in `AbilityEnhancements.js`.

## Pages

`routes.js`, menu `Drawer.vue`: `/story` (`resources/svg/storylines/{game}.svg`), `/map` (not cs), `/scenarios`, `/achievements`, `/party` → `PartyGh` (gh, fc) / `PartyGh2` / `PartyFh` / `PartyJotl` / `PartyCs`, `/characters`, `/items`, `/buildings` (fh), `/campaigns`, `/settings`, `/info`. `pages/sections/` = marketing site.

## Game data

- Text in `lang/{locale}/*.js` by game-prefixed id; JSON holds structure.
- GH2 data generated by `commands/convert-gh2-*.js`: change and regenerate.
- Specs in `cypress/e2e/tracker/` (`gh2-*` for GH2).
